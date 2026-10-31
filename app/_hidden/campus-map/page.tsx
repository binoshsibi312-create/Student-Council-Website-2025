import type { Metadata } from "next";
import Shell from "@/components/Shell";
import CampusMap from "@/components/CampusMap";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Campus Map | University Student Council" };

export default function CampusMapPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Find Your Way"
          title="Interactive Campus Map"
          subtitle="A schematic directory of the Central Block, Bangalore Central Campus, reconstructed from the official floor register. Select a floor, then a hotspot, to see what's there."
        />
        <CampusMap />
      </section>
    </Shell>
  );
}
