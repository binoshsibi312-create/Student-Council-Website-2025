import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { getOrgDirectory, createChristHubUploadSession } from "@/lib/christ-hub/google";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/**
 * Opens a Google Drive resumable-upload session and returns its URL so the
 * browser can PUT the file straight to Google. This request body is tiny
 * (a file name, MIME type, and size) — it never carries the file itself, so
 * it's unaffected by Vercel's ~4.5 MB request body limit that a direct
 * multipart upload through our own function would hit.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      idToken?: string;
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    } | null;

    const idToken = String(body?.idToken ?? "").trim();
    const fileName = String(body?.fileName ?? "").trim() || "christ-hub-media";
    const mimeType = String(body?.mimeType ?? "").trim();
    const fileSize = Number(body?.fileSize ?? 0);

    if (!idToken) return errorResponse("Sign-in is required.", 401);
    if (!ALLOWED_TYPES.has(mimeType)) return errorResponse("Use JPEG, PNG, WebP, MP4, WebM, or MOV media.", 400);
    if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_BYTES) {
      return errorResponse("Media must be 50 MB or smaller.", 400);
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const publicGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId || !publicGoogleClientId) {
      return errorResponse("Google OAuth is not configured on this deployment.", 500);
    }
    if (googleClientId !== publicGoogleClientId) {
      return errorResponse("Google OAuth is misconfigured: NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID must be identical.", 500);
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase().trim();
    if (!email || payload?.email_verified !== true) {
      return errorResponse("Google authentication failed. Please sign in with a verified account.", 401);
    }

    const directory = await getOrgDirectory();
    const org = directory[email];
    if (!org) {
      return errorResponse(`The account (${email}) is not registered in the Christ Hub broadcaster directory.`, 403);
    }
    if (!org.active) {
      return errorResponse(`The account (${email}) is not active in the Christ Hub broadcaster directory.`, 403);
    }

    const uploadUrl = await createChristHubUploadSession({ org, fileName, mimeType, fileSize });
    const mediaType = mimeType.startsWith("video/") ? "video" : "image";
    return NextResponse.json({ ok: true, uploadUrl, mediaType });
  } catch (error) {
    console.error("[christ-hub] upload session failed", error);
    const message = error instanceof Error ? error.message : "Could not start the upload. Please try again.";
    return errorResponse(message, 500);
  }
}
