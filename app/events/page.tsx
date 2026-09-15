import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Events | University Student Council" };

const EVENTS = [
  { tag: "Flagship Event", title: "Daksh — Annual Education Fair", date: "Around Daksh & Open Day, November", body: "CHRIST's flagship career fair — departments showcase programmes, eminent personalities host career dialogues, and the Council-built Accord app (2018–19) makes registration paperless and tracks student interest." },
  { tag: "Student Welfare", title: "Gratitude Week & Gratitude Day", date: "March", body: "Every March, the Council organises a week of appreciation for Security, Housekeeping, Gardeners and Administration staff — concluding with Gratitude Day, when the Council and University Choir sing the Gratitude Day song." },
  { tag: "Heritage", title: "Bhasha Utsav & Ethnic Day", date: "September, across all campuses", body: "The only festival that brings together all Christites — the Council leads the opening procession in ethnic attire, celebrating the University's cultural diversity." },
  { tag: "Appreciation", title: "Teachers Day", date: "5 September", body: "On 5th September, the Council partners with the Student Welfare Office to present every teaching faculty member with a token of appreciation and respect." },
  { tag: "Infrastructure", title: "The Sky Walk", date: "Standing initiative", body: "Proposed by the University Student Council and approved by the University and regulatory authorities, the Sky Walk eases student movement and pedestrian safety — proof that a small idea can have a lasting campus-wide impact." },
  { tag: "Digital Tool", title: "CHRIST Programmes App", date: "Available for Android", body: "The official Android app showcasing every CHRIST programme — segregated by level and campus, with push alerts, keyword search, bookmarking and one-tap contact." },
];

export default function EventsPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Campus Calendar"
          title="Events, Fests & Initiatives"
          subtitle="The flagship events and long-running traditions the University Student Council organises every year."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
          {EVENTS.map((e) => (
            <div className="bg-ink text-white rounded-card-md p-7" key={e.title}>
              <span className="block text-[0.68rem] font-semibold text-gold-light uppercase tracking-[0.1em] mb-3">{e.tag}</span>
              <h3 className="font-display text-[1.12rem] font-semibold mb-2">{e.title}</h3>
              <p className="text-[0.84rem] text-white/72 leading-[1.6] mb-3.5 font-light">{e.body}</p>
              <div className="text-[0.74rem] text-white/50 font-medium">{e.date}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
