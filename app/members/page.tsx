import type { Metadata } from "next";
import Shell from "@/components/Shell";
import MemberGrid from "@/components/MemberGrid";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Members | University Student Council" };

export default function MembersPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="The People Who Serve"
          title="University Student Council — 2026–27"
          subtitle="Filter by school/centre and level. Photographs for the full 64-member roster are being updated — verified profiles are shown first."
        />
        <MemberGrid />
      </section>
    </Shell>
  );
}
