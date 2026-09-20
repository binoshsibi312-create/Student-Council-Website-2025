import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { deleteChristHubPost } from "@/lib/christ-hub/google";

export const runtime = "nodejs";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { postId?: string; idToken?: string } | null;
    const postId = String(body?.postId ?? "").trim();
    const idToken = String(body?.idToken ?? "").trim();

    if (!postId) return errorResponse("A post id is required.", 400);
    if (!idToken) return errorResponse("Sign-in is required.", 401);

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

    await deleteChristHubPost({ postId, requesterEmail: email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[christ-hub] delete failed", error);
    const message = error instanceof Error ? error.message : "This update could not be deleted. Please try again.";
    return errorResponse(message, 400);
  }
}
