import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import ChristHubClient from "@/components/christ-hub/ChristHubClient";
import { getChristHubFeed } from "@/lib/christ-hub/data";

export const metadata: Metadata = { title: "Christ Hub | University Student Council" };
export const dynamic = "force-dynamic";

export default async function ChristHubPage() {
  const feed = await getChristHubFeed();

  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Campus Broadcast"
          title="Christ Hub"
          subtitle="Live announcements, posters and updates from every department, school, club and cell across CHRIST — no login needed. Tap an avatar for the full story, or follow your orgs with the ★."
        />
        <ChristHubClient initialFeed={feed} />
      </section>
    </Shell>
  );
}
