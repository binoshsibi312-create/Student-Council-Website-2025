import type { Metadata } from "next";
import Shell from "@/components/Shell";
import Icon from "@/components/Icon";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "About | University Student Council" };

const OBJECTIVES = [
  "Imbibe and inculcate among students the vision, mission and core values of the University.",
  "Provide constructive feedback on campus life — academic programmes, general discipline, library facilities, and maintenance of the campus and student service facilities.",
  "Suggest means for improving academic quality, standards and research culture among students.",
  "Identify, assess and suggest student perspectives in the development of Arts and Culture, Sports and Games, and co-/extra-curricular activities.",
  "Identify and suggest methods of improving student life, conduct and discipline.",
  "Assist the anti-ragging committee to remove the menace of ragging completely.",
  "Assess and improve the potential for student placements and facilitate internships.",
  "Create and encourage an environment for healthy, effective use of student service facilities.",
  "Assist student endeavours like CSA, NCC, SWO, Sports & Games and the Peer Education Programme.",
  "Interlink students, faculty, staff and management to forge a strong academic community.",
  "Establish and maintain continuous, effective interaction with University alumni.",
  "Help students keep the Christite spirit alive through various activities.",
];

export default function AboutPage() {
  return (
    <Shell>
      <section className="pb-16 mb-16 border-b border-line max-[640px]:pb-12 max-[640px]:mb-12">
        <SectionHeader
          eyebrow="Who We Are"
          title="About the University Student Council"
          subtitle="The University Student Council exists to enhance the overall graduate experience at CHRIST (Deemed to be University) by promoting the general welfare of the student body. It creates new programmes and initiatives that provide opportunities for growth, leadership, and meaningful interaction, while communicating with the Administration and Faculty on behalf of students."
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5 mb-14">
          <div className="bg-white border border-line rounded-card-md p-7 transition-all duration-250 hover:border-gold hover:shadow-card-sm hover:-translate-y-0.5">
            <div className="w-10 h-10 flex items-center justify-center text-ink mb-4.5">
              <Icon name="university" />
            </div>
            <h3 className="font-display text-[1.1rem] font-semibold text-ink mb-2">University Level Council</h3>
            <p className="text-[0.88rem] text-text-secondary leading-[1.6] font-light">
              The apex body of student representation — the USC comprises 64 student representatives from Departments and Centres across campus.
            </p>
          </div>
          <div className="bg-white border border-line rounded-card-md p-7 transition-all duration-250 hover:border-gold hover:shadow-card-sm hover:-translate-y-0.5">
            <div className="w-10 h-10 flex items-center justify-center text-ink mb-4.5">
              <Icon name="school" />
            </div>
            <h3 className="font-display text-[1.1rem] font-semibold text-ink mb-2">School Level Council</h3>
            <p className="text-[0.88rem] text-text-secondary leading-[1.6] font-light">
              The SSC supports the USC with representatives from every class and school, bridging students, faculty, staff and management.
            </p>
          </div>
          <div className="bg-white border border-line rounded-card-md p-7 transition-all duration-250 hover:border-gold hover:shadow-card-sm hover:-translate-y-0.5">
            <div className="w-10 h-10 flex items-center justify-center text-ink mb-4.5">
              <Icon name="vision" />
            </div>
            <h3 className="font-display text-[1.1rem] font-semibold text-ink mb-2">Vision, Mission &amp; Values</h3>
            <p className="text-[0.88rem] text-text-secondary leading-[1.6] font-light">
              The Council imbibes CHRIST&apos;s Vision — <em>Excellence and Service</em> — and its Core Values across every initiative it runs.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-0 pb-0">
        <SectionHeader eyebrow="Our Mandate" title="Objectives" />
        <div className="grid gap-0 border-t border-line">
          {OBJECTIVES.map((text, i) => (
            <div className="flex gap-5 items-baseline py-4 px-0.5 border-b border-line" key={i}>
              <div className="shrink-0 w-6 font-display font-semibold text-[0.9rem] text-gold-dark">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-[0.9rem] text-text-secondary leading-[1.6] font-light">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
