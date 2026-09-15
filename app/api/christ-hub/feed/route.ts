import { NextResponse } from "next/server";
import { getChristHubFeed } from "@/lib/christ-hub/data";

export const dynamic = "force-dynamic";

/**
 * Same-origin JSON endpoint for the Christ Hub feed. Exists alongside the
 * server-rendered page so the service worker (public/sw.js) has a stable
 * same-origin URL to cache for offline viewing, and so the client can
 * pull-to-refresh without a full page reload.
 */
export async function GET() {
  const feed = await getChristHubFeed();
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
