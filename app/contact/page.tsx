import type { Metadata } from "next";
import Shell from "@/components/Shell";
import ContactForm from "@/components/ContactForm";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Connect | University Student Council" };

export default function ContactPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Student Connect"
          title="Student Grievance & Idea Desk"
          subtitle="We value your feedback. Share your queries, suggestions, or concerns with us — every submission is routed directly to the Council Executive's inbox."
        />
        <ContactForm />
      </section>
    </Shell>
  );
}
