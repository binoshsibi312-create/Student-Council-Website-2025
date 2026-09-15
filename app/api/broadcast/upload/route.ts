import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { getOrgDirectory, uploadChristHubPost } from "@/lib/christ-hub/google";
import type { PostCategory } from "@/lib/christ-hub/types";

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
const CATEGORIES = new Set<PostCategory>(["Academic", "Cultural", "Sports", "Deadline", "Admin"]);

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const idToken = String(form.get("idToken") ?? "");
    const caption = String(form.get("caption") ?? "").trim();
    const category = String(form.get("category") ?? "") as PostCategory;
    const fileValue = form.get("file");

    if (!idToken) return errorResponse("Sign-in is required.", 401);
    if (!caption || caption.length > 2000) return errorResponse("Caption is required and must be under 2,000 characters.", 400);
    if (!CATEGORIES.has(category)) return errorResponse("Choose a valid category.", 400);
    if (fileValue && !(fileValue instanceof File)) return errorResponse("The uploaded media is invalid.", 400);

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const publicGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId || !publicGoogleClientId) {
      return errorResponse("Google OAuth is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID to the same Web client ID from Google Cloud Console.", 500);
    }
    if (googleClientId !== publicGoogleClientId) {
      return errorResponse("Google OAuth is misconfigured: NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID must be identical. Use the same Web client ID from Google Cloud Console.", 500);
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

    let file: { name: string; type: string; buffer: Buffer } | undefined;
    if (fileValue instanceof File && fileValue.size > 0) {
      if (fileValue.size > MAX_FILE_BYTES) return errorResponse("Media must be 50 MB or smaller.", 400);
      if (!ALLOWED_TYPES.has(fileValue.type)) return errorResponse("Use JPEG, PNG, WebP, MP4, WebM, or MOV media.", 400);
      file = { name: fileValue.name || "christ-hub-media", type: fileValue.type, buffer: Buffer.from(await fileValue.arrayBuffer()) };
    }

    const post = await uploadChristHubPost({ org, caption, category, file });
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (error) {
    console.error("[christ-hub] upload failed", error);
    const rawMessage = error instanceof Error ? error.message : "The post could not be published. Please try again.";
    return errorResponse(rawMessage, 500);
  }
}