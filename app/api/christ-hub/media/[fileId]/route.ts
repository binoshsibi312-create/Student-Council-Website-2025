import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { serviceClients } from "@/lib/christ-hub/google";
import { Readable } from "node:stream";

const FILE_ID_PATTERN = /^[a-zA-Z0-9_.-]{5,100}$/;

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  if (!FILE_ID_PATTERN.test(fileId)) {
    return new NextResponse("Invalid file id", { status: 400 });
  }

  // 1. Handle locally stored media
  if (fileId.startsWith("local_")) {
    const rawName = fileId.slice(6);
    const safeName = rawName.replace(/[^a-zA-Z0-9_.-]/g, "");
    const filePath = join(process.cwd(), "public", "uploads", "christ-hub", safeName);

    try {
      const buffer = await readFile(filePath);
      const ext = safeName.includes(".") ? safeName.slice(safeName.lastIndexOf(".")).toLowerCase() : "";
      const contentType = MIME_MAP[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("Media not found", { status: 404 });
    }
  }

  // 2. Handle Google Drive media via Service Account
  try {
    const { drive } = await serviceClients();
    const driveRes = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "stream" }
    );
    const contentType = driveRes.headers["content-type"] || "application/octet-stream";
    const webStream = Readable.toWeb(driveRes.data as Readable) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (driveErr) {
    // 3. Fallback to public API key fetch if SA fails
    const apiKey = process.env.GOOGLE_PUBLIC_API_KEY;
    if (!apiKey) return new NextResponse("Media not found", { status: 404 });

    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${encodeURIComponent(apiKey)}`;
    try {
      const upstream = await fetch(driveUrl, { next: { revalidate: 86400 } });
      if (!upstream.ok || !upstream.body) {
        return new NextResponse("Media not found", { status: 404 });
      }

      return new NextResponse(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("Upstream fetch failed", { status: 502 });
    }
  }
}
