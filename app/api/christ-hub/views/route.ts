import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** A viewer still "counts" if their last heartbeat arrived within this window. */
const HEARTBEAT_WINDOW_MS = 20_000;

/**
 * Best-effort, in-memory "who's watching now" count. Christ Hub has no
 * shared database — this map lives only for the lifetime of one server
 * process, so on a multi-instance deployment each instance tracks its own
 * slice of viewers rather than a single global count. That's an acceptable
 * approximation for a campus-scale live badge; swap this for a shared store
 * (e.g. Redis) if a globally exact count is ever needed.
 */
const viewersByPost = new Map<string, Map<string, number>>();

function pruneStale(viewers: Map<string, number>, now: number) {
  for (const [viewerId, lastSeen] of viewers) {
    if (now - lastSeen > HEARTBEAT_WINDOW_MS) viewers.delete(viewerId);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { postId?: string; viewerId?: string } | null;
  const postId = String(body?.postId ?? "").trim();
  const viewerId = String(body?.viewerId ?? "").trim();
  if (!postId || !viewerId) return NextResponse.json({ ok: false }, { status: 400 });

  const now = Date.now();
  let viewers = viewersByPost.get(postId);
  if (!viewers) {
    viewers = new Map();
    viewersByPost.set(postId, viewers);
  }
  viewers.set(viewerId, now);
  pruneStale(viewers, now);

  return NextResponse.json({ ok: true, count: viewers.size });
}

export async function GET(request: Request) {
  const postId = new URL(request.url).searchParams.get("postId")?.trim();
  if (!postId) return NextResponse.json({ ok: false }, { status: 400 });

  const now = Date.now();
  const viewers = viewersByPost.get(postId);
  if (viewers) pruneStale(viewers, now);

  return NextResponse.json({ ok: true, count: viewers?.size ?? 0 });
}
