import { NextResponse } from "next/server";
import { archiveChristHubSemester } from "@/lib/christ-hub/google";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.CHRIST_HUB_CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CHRIST_HUB_CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { nextSemester?: string };
    const result = await archiveChristHubSemester(body.nextSemester?.trim() ?? "");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[christ-hub] archive failed", error);
    return NextResponse.json({ ok: false, error: "Archive failed" }, { status: 500 });
  }
}