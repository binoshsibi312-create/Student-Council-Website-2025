import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Governance | University Student Council" };

const NOMINATION_STEPS = [
  { title: "Apply at Deanery Level", desc: "Submit a statement of purpose with attendance and marks records to your Class Teacher." },
  { title: "Shortlisting", desc: "Class Teacher & HoD evaluate applications and forward four candidates per class to the Faculty Coordinator." },
  { title: "Interview", desc: "The Faculty Coordinator interviews shortlisted candidates; one is selected per class for the School Council." },
  { title: "Apply for University Council", desc: "Eligible School Council members apply with a statement of purpose and contribution record to the Faculty Coordinator." },
  { title: "Final Interview", desc: "The University Student Council Coordinator conducts the final interview and confirms University Council membership." },
];

export default function GovernancePage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="How the Council Works"
          title="Constitution & Governance"
          subtitle="The University Student Council functions under the supervision of the Director, University Student Council, coordinated by faculty members for each deanery, and reports to the Vice Chancellor. It is a support system for holistic student development — never an association or bargaining agency."
        />

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-5 mb-5 max-[1080px]:grid-cols-1">
          <div className="bg-white border border-line rounded-card-md p-7.5">
            <h3 className="font-display text-[1.12rem] font-semibold text-ink mb-3.5">Constitution of the Council</h3>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] mb-2.5 font-light">
              The University Student Council is constituted by representatives chosen from all UG/PG programmes and
              formed at two levels. The <strong>University Level (USC)</strong> is the apex body — its
              member count may vary each academic year with new programmes, and it includes one
              representative each from SWO, CSA, NCC, Peer Education, CAPS, International Students, the
              Cultural Team and Sports &amp; Games Team.
            </p>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] mb-2.5 font-light">
              The <strong>School Level (SSC)</strong> is the supporting body: one representative per
              class, regardless of class strength.
            </p>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] font-light">
              The Director may dissolve the Council at their discretion at any time prior to its functional duration.
            </p>
          </div>
          <div className="bg-white border border-line rounded-card-md p-7.5">
            <h3 className="font-display text-[1.12rem] font-semibold text-ink mb-3.5">Meetings with the Vice Chancellor</h3>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] mb-2.5 font-light">
              USC members meet the Vice Chancellor once every semester, alongside the Pro-Vice
              Chancellor, Registrar, Deans and University Student Council Coordinators, to present suggestions and
              feedback pertaining to academics.
            </p>
            <h3 className="font-display text-[1.12rem] font-semibold text-ink mb-3.5 mt-6">Open Forum</h3>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] font-light">
              Twice each academic year, USC members raise deanery-level academic and managerial concerns
              directly with Deans, HODs and Academic Coordinators — with answers relayed back to all
              students of the department.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-5 mb-5 max-[1080px]:grid-cols-1">
          <div className="bg-white border border-line rounded-card-md p-7.5">
            <h3 className="font-display text-[1.12rem] font-semibold text-ink mb-3.5">Member Nomination Procedure</h3>
            <ol className="step-flow">
              {NOMINATION_STEPS.map((s) => (
                <li key={s.title}>
                  <h4 className="text-[0.88rem] font-semibold text-ink mb-1">{s.title}</h4>
                  <p className="text-[0.82rem] text-text-secondary leading-[1.55] font-light">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-white border border-line rounded-card-md p-7.5">
            <h3 className="font-display text-[1.12rem] font-semibold text-ink mb-3.5">Tenure &amp; Orientation</h3>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] mb-2.5 font-light">
              Normal tenure is <strong>one year</strong>, renewable on fresh nomination. Senior-student
              nominations happen every <strong>February</strong>; first-year nominations happen every{" "}
              <strong>July</strong>. Outgoing Council members hand over to the new Council on University
              Student Council Day.
            </p>
            <p className="text-[0.9rem] text-text-secondary leading-[1.7] font-light">
              All newly inducted members attend a compulsory <strong>two-day orientation</strong> on the
              first/second weekend after reopening. Unapproved absence results in automatic termination
              and replacement.
            </p>
          </div>
        </div>

        <div className="max-w-[720px] mt-2 mb-5">
          <h2 className="font-display text-[1.25rem] font-semibold text-ink tracking-[-0.01em]">Schedule of Meetings</h2>
        </div>
        <div className="overflow-x-auto border border-line rounded-card-md">
          <table className="meeting-table w-full border-collapse bg-white text-[0.84rem]">
            <thead>
              <tr>
                <th className="bg-ink text-white text-left py-3.25 px-4.5 font-medium text-[0.74rem] tracking-[0.03em] uppercase">Level</th>
                <th className="bg-ink text-white text-left py-3.25 px-4.5 font-medium text-[0.74rem] tracking-[0.03em] uppercase">Composition</th>
                <th className="bg-ink text-white text-left py-3.25 px-4.5 font-medium text-[0.74rem] tracking-[0.03em] uppercase">Meeting Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light"><strong className="font-medium text-ink">University Student Council</strong> (Apex Body)</td>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light">All UG &amp; PG programme reps, plus nominees from CSA, NCC, SWO, CAPS, Peer Education, International Students, Cultural &amp; Sports Teams</td>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light">Monthly with the Director of the University Student Council &amp; Faculty Coordinators; once per semester with the Vice Chancellor / Campus Director</td>
              </tr>
              <tr>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light"><strong className="font-medium text-ink">School Student Councils</strong></td>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light">1 rep per class, regardless of class size</td>
                <td className="py-3.75 px-4.5 border-t border-line text-text-secondary align-top font-light">At least once a month — minutes &amp; feedback presented to the University Council</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[0.8rem] text-text-muted font-light mt-4">
          Attendance is compulsory. Absence for two consecutive meetings without prior notice and valid
          reason results in termination of membership and appointment of a replacement.
        </p>
      </section>
    </Shell>
  );
}
