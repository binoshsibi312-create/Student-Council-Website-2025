import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import { MENTOR_LEADERSHIP, MENTOR_COORDINATORS, type Mentor } from "@/lib/data";

export const metadata: Metadata = { title: "Mentors | University Student Council" };

function initials(name: string) {
  return name
    .replace(/^Dr\.?|Fr\.?|Prof\.?/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function PersonCard({ m }: { m: Mentor }) {
  return (
    <div className="bg-white border border-line rounded-card-md overflow-hidden transition-all duration-250 hover:border-gold hover:shadow-card-sm">
      <div className="w-full aspect-[4/5] bg-ink-2">
        {m.img ? (
          <img src={m.img} alt={m.name} className="w-full h-full object-cover object-[center_18%]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-[2rem] font-medium text-white/85">
            {initials(m.name)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-display text-[0.94rem] font-semibold text-ink mb-1 leading-[1.3]">{m.name}</h4>
        <div className="text-[0.68rem] font-semibold text-gold-dark uppercase tracking-[0.03em] mb-1.5">{m.role}</div>
        <div className="text-[0.78rem] text-text-muted leading-[1.4] font-light">{m.dept}</div>
      </div>
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Guiding Faculty"
          title="Our Mentors"
          subtitle="The faculty leadership and coordinators who guide the University Student Council — sourced from CHRIST University's official directory. A few photographs are pending an update."
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-5">
          {[...MENTOR_LEADERSHIP, ...MENTOR_COORDINATORS].map((m) => <PersonCard m={m} key={m.name} />)}
        </div>
      </section>
    </Shell>
  );
}
