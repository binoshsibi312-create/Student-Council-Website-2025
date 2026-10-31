import type { Metadata } from "next";
import { DakshLogo, Mascot } from "@/components/daksh/ui";
import { Arc, ButtonB, EyebrowB, Hand, TitleB } from "@/components/daksh-b/ui";
import { COMPETITIONS, DAKSH, SOCIALS, TRAILBLAZE } from "@/lib/daksh";

export const metadata: Metadata = { title: "Trailblaze · Design B preview | Daksh 2026" };

/** Card accent colours, cycling through the design board's palette. */
const ACCENTS = [
  { band: "bg-db-royal", text: "text-white" },
  { band: "bg-db-maroon", text: "text-white" },
  { band: "bg-db-navy", text: "text-white" },
  { band: "bg-db-steel", text: "text-white" },
  { band: "bg-db-butter", text: "text-db-navy" },
];

const STEPS = [
  ["01", "Pick your stage", "Seven competitions — choose the one that fits your talent, solo or as a team."],
  ["02", "Build your team", "Team sizes differ for each competition — check the card before you sign up."],
  ["03", "Watch for registration", `Registration details will be announced soon. Follow ${SOCIALS[0].handle} for updates.`],
];

export default function TrailblazeDesignB() {
  return (
    <div className="flex flex-col gap-22 max-[640px]:gap-14">
      {/* Hero — typographic, no photography */}
      <section
        className="relative isolate overflow-hidden rounded-[16px] px-14 pt-16 pb-14 text-white max-[1080px]:px-9 max-[640px]:-mx-4 max-[640px]:-mt-4 max-[640px]:rounded-none max-[640px]:px-5 max-[640px]:pt-12 max-[640px]:pb-10"
        style={{ background: "linear-gradient(130deg, #56071d 0%, #3a1035 38%, #253b81 75%, #032e4b 100%)" }}
      >
        <Arc className="-top-28 -right-28 h-[380px] w-[380px] border-white/10 max-[640px]:h-[220px] max-[640px]:w-[220px]" />
        <Arc className="-bottom-40 -left-16 h-[300px] w-[300px] border-db-butter/20 max-[640px]:hidden" />
        <div className="relative">
          <div className="inline-flex rounded-[16px] bg-white/12 px-4 py-2 font-gs text-[0.8rem] font-semibold uppercase tracking-[0.2em]">Daksh 2026 · Competitions</div>
          <h1 className="mt-6 font-gs text-[clamp(3.2rem,9vw,7.5rem)] font-bold leading-[0.88] tracking-[0.02em]">TRAILBLAZE</h1>
          <p className="mt-5 font-hand text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none text-db-butter">{TRAILBLAZE.theme}</p>
          <p className="mt-3 font-manjari text-[clamp(1.1rem,1.8vw,1.4rem)] font-bold text-white/90">{TRAILBLAZE.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-2.5 font-gs text-[0.86rem] font-medium">
            <span className="rounded-[16px] bg-db-butter px-4 py-2 text-db-navy">{DAKSH.dates}</span>
            <span className="rounded-[16px] border border-white/30 px-4 py-2">{COMPETITIONS.length} competitions</span>
            <span className="rounded-[16px] border border-white/30 px-4 py-2">{DAKSH.venue}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3.5 max-[640px]:flex-col">
            <ButtonB href="#competitions" variant="butter">
              See the competitions
            </ButtonB>
            <ButtonB href="/preview/daksh" variant="light">
              Back to Daksh
            </ButtonB>
          </div>
        </div>
      </section>

      {/* Competitions */}
      <section id="competitions" className="scroll-mt-24">
        <EyebrowB>The competitions</EyebrowB>
        <TitleB>Pick your stage</TitleB>
        <div className="mt-7 grid grid-cols-2 gap-5 max-[1080px]:grid-cols-1 max-[640px]:gap-4">
          {COMPETITIONS.map((c, i) => {
            const a = ACCENTS[i % ACCENTS.length];
            return (
              <article
                key={c.name}
                className="flex flex-col overflow-hidden rounded-[16px] border border-db-navy/12 bg-white shadow-[0_10px_28px_-18px_rgba(3,46,75,0.45)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className={`flex items-center justify-between px-6 py-3.5 ${a.band} ${a.text}`}>
                  <span className="font-gs text-[0.72rem] font-bold uppercase tracking-[0.18em]">{c.tag}</span>
                  <span className="font-gs text-[1.3rem] font-bold leading-none opacity-70" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-6 pt-5 pb-6 max-[640px]:px-5">
                  <h3 className="font-gs text-[1.6rem] font-bold leading-tight text-db-navy">{c.name}</h3>
                  <div className="font-gs text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-db-steel">{c.kind}</div>
                  <Hand className="mt-2.5 text-[1.35rem]">{c.tagline}</Hand>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-[16px] bg-db-mist px-4.5 py-3.5 text-[0.92rem]">
                    <dt className="font-gs font-semibold text-db-royal">Team</dt>
                    <dd className="text-db-ink/85">{c.team}</dd>
                    <dt className="font-gs font-semibold text-db-royal">Format</dt>
                    <dd className="text-db-ink/85">{c.format}</dd>
                    {c.concept && (
                      <>
                        <dt className="font-gs font-semibold text-db-royal">Concept</dt>
                        <dd className="text-db-ink/85">“{c.concept}”</dd>
                      </>
                    )}
                  </dl>
                  <p className="mt-4 text-[0.98rem] leading-[1.65] text-db-ink/75">{c.description}</p>
                </div>
              </article>
            );
          })}
          {/* Theme card fills the eighth slot of the two-column grid */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-[16px] bg-db-navy px-8 py-9 text-white max-[1080px]:hidden">
            <Arc className="-right-14 -bottom-14 h-44 w-44 border-db-butter/25" />
            <div className="font-gs text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-db-butter">The theme</div>
            <p className="mt-2 font-gs text-[2rem] font-bold uppercase leading-tight">{TRAILBLAZE.theme}</p>
            <Hand tone="butter" className="mt-3">{TRAILBLAZE.tagline}</Hand>
          </div>
        </div>
      </section>

      {/* How to take part */}
      <section>
        <EyebrowB>How to take part</EyebrowB>
        <TitleB>Three steps to the stage</TitleB>
        <div className="mt-7 grid grid-cols-3 gap-5 max-[1080px]:grid-cols-1 max-[640px]:gap-3">
          {STEPS.map(([n, title, body]) => (
            <div key={n} className="rounded-[16px] border border-db-navy/12 bg-white px-6 py-6 max-[640px]:px-5 max-[640px]:py-5">
              <div className="font-gs text-[2.6rem] font-bold leading-none text-db-royal">{n}</div>
              <h3 className="mt-3 font-gs text-[1.15rem] font-semibold uppercase tracking-[0.02em] text-db-navy">{title}</h3>
              <p className="mt-1.5 text-[0.98rem] leading-[1.6] text-db-ink/75">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Daksh, with the logo and Alden */}
      <section className="relative flex items-center gap-10 overflow-hidden rounded-[16px] bg-db-mist px-12 py-10 max-[1080px]:flex-col max-[1080px]:items-start max-[640px]:gap-6 max-[640px]:px-5 max-[640px]:py-8">
        <Arc className="-top-20 -right-20 h-56 w-56" />
        <Mascot className="relative w-[170px] rounded-[16px] max-[640px]:w-[130px]" />
        <div className="relative flex-1">
          <DakshLogo className="mb-3 w-[200px] max-[640px]:w-[160px]" />
          <h2 className="font-gs text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold uppercase leading-tight text-db-royal">Competing is just the start</h2>
          <p className="mt-2 max-w-[520px] text-[1rem] leading-[1.6] text-db-ink/75">
            Explore every school, meet students and faculty, get career guidance and tour the campus at the University Open
            Day — all on the same two days.
          </p>
        </div>
        <div className="relative">
          <ButtonB href="/preview/daksh">Explore Daksh →</ButtonB>
        </div>
      </section>
    </div>
  );
}
