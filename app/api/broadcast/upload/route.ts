import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { getOrgDirectory, finalizeChristHubPost } from "@/lib/christ-hub/google";
import type { PostCategory } from "@/lib/christ-hub/types";

export const runtime = "nodejs";

const CATEGORIES = new Set<PostCategory>(["Academic", "Cultural", "Sports", "Deadline", "Admin"]);

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/**
 * Finalizes a post after any media has already been uploaded straight to
 * Google Drive by the browser (see /api/broadcast/upload-session). This
 * route only ever receives small JSON — caption, category, and a Drive file
 * id — never the file bytes themselves.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      idToken?: string;
      caption?: string;
      category?: string;
      driveFileId?: string;
      mediaType?: string;
    } | null;

    const idToken = String(body?.idToken ?? "").trim();
    const caption = String(body?.caption ?? "").trim();
    const category = String(body?.category ?? "") as PostCategory;
    const driveFileId = String(body?.driveFileId ?? "").trim();
    const mediaType = body?.mediaType === "video" ? "video" : body?.mediaType === "image" ? "image" : undefined;

    if (!idToken) return errorResponse("Sign-in is required.", 401);
    if (!caption || caption.length > 2000) return errorResponse("Caption is required and must be under 2,000 characters.", 400);
    if (!CATEGORIES.has(category)) return errorResponse("Choose a valid category.", 400);
    if (driveFileId && !mediaType) return errorResponse("The uploaded media is invalid.", 400);

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

    const post = await finalizeChristHubPost({
      org,
      caption,
      category,
      media: driveFileId && mediaType ? { driveFileId, mediaType } : undefined,
    });
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (error) {
    console.error("[christ-hub] upload finalize failed", error);
    const rawMessage = error instanceof Error ? error.message : "The post could not be published. Please try again.";
    return errorResponse(rawMessage, 500);
  }
}
