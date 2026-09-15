import type { Metadata } from "next";
import Shell from "@/components/Shell";
import ProceduresPanel from "@/components/ProceduresPanel";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Procedures | University Student Council" };

export default function ProceduresPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Know the Process"
          title="Procedural Awareness"
          subtitle="Step-by-step guidance drawn directly from the official Christite Handbook 2026–27. Choose a category, select a procedure, and follow the steps."
        />
        <ProceduresPanel />
      </section>
    </Shell>
  );
}
