import type { Metadata } from "next";
import Shell from "@/components/Shell";
import ContactForm from "@/components/ContactForm";
import ContactList from "@/components/ContactList";
import SectionHeader from "@/components/SectionHeader";
import { CONTACTS, TRAILBLAZE_CONTACTS } from "@/lib/daksh";

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

      <section aria-labelledby="event-contacts" className="mt-14 rounded-card-md border border-line bg-card px-8 py-7 max-[640px]:px-5 max-[640px]:py-5">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-light">Event contacts</div>
        <h2 id="event-contacts" className="mt-1.5 font-display text-[1.75rem] font-semibold leading-tight text-fg">
          Daksh, Open Day &amp; Trailblaze 2026
        </h2>
        <p className="mt-1.5 text-[0.92rem] font-light text-text-secondary">Questions about the fair or the competitions? Reach the organisers directly.</p>
        {[
          { label: "Daksh & University Open Day", people: CONTACTS },
          { label: "Trailblaze competitions", people: TRAILBLAZE_CONTACTS },
        ].map((g) => (
          <div key={g.label} className="mt-6 border-t border-line pt-5">
            <h3 className="mb-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-dark">{g.label}</h3>
            <ContactList people={g.people} />
          </div>
        ))}
      </section>
    </Shell>
  );
}
