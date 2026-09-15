import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = { title: "Reports | University Student Council" };

const REPORTS = [
  {
    year: "2024–25",
    href: "https://sites.google.com/christuniversity.in/student-council-23-24/reports/2024-2025?authuser=0",
  },
  {
    year: "2023–24",
    href: "https://sites.google.com/christuniversity.in/student-council-23-24/reports/2023-24?authuser=0",
  },
];

export default function ReportsPage() {
  return (
    <Shell>
      <section className="mb-0 pb-0">
        <SectionHeader
          eyebrow="Transparency"
          title="Annual Reports"
          subtitle="A record of what the University Student Council has organised and achieved each academic year."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5 max-w-195">
          {REPORTS.map((r) => (
            <a
              key={r.year}
              className="bg-white border border-line rounded-card-md p-8 no-underline block transition-all duration-250 hover:border-gold hover:shadow-card-sm hover:-translate-y-0.5"
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="font-display text-[1.9rem] font-semibold text-ink mb-2">{r.year}</div>
              <p className="text-[0.84rem] text-text-secondary mb-4 font-light">
                Full record of Council activities, events and achievements for the academic year.
              </p>
              <span className="text-[0.76rem] font-semibold text-ink inline-flex items-center gap-1.5">View Report →</span>
            </a>
          ))}
        </div>
      </section>
    </Shell>
  );
}
