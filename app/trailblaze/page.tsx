import type { Metadata } from "next";
import ContactList from "@/components/ContactList";
import Shell from "@/components/Shell";
import DakshType from "@/components/daksh/DakshType";
import { Btn, Hand, Heading, KeyInfo, Kicker, Sparkle } from "@/components/daksh/kit";
import { DakshLogo, Mascot } from "@/components/daksh/ui";
import { COMPETITIONS, DAKSH, PHOTOS, TRAILBLAZE, TRAILBLAZE_CONTACTS } from "@/lib/daksh";

export const metadata: Metadata = {
  title: "Trailblaze Competitions | Daksh & Open Day 2026",
  description: `Trailblaze Competitions — ${COMPETITIONS.length} Daksh & Open Day 2026 competitions on the theme “${TRAILBLAZE.theme}”: ${COMPETITIONS.map((c) => c.name).join(", ")}. ${DAKSH.dates}.`,
};

/** Colour band for each competition card, in COMPETITIONS order: [background, text, sparkle]. */
const BANDS = [
  ["#253b81", "#ffffff", "#ffd679"],
  ["#56071d", "#ffffff", "#ffd679"],
  ["#032e4b", "#ffffff", "#ffd679"],
  ["#33a7f1", "#032e4b", "#032e4b"],
  ["#ffd679", "#032e4b", "#032e4b"],
  ["#253b81", "#ffffff", "#ffd679"],
  ["#56071d", "#ffffff", "#ffd679"],
];

const STEPS = [
  ["01", "Pick your stage", "Seven competitions", "Seven competitions — choose the one that fits your talent, solo or as a team."],
  ["02", "Register yourself", "Individuals only", "Registration is individual — each participant signs up on their own. Institutions do not register."],
  ["03", "Read the brochure", "Rules & fees", "The Trailblaze Competitions brochure has the guidelines, judging criteria and registration fee for every competition."],
];

export default function TrailblazePage() {
  const { trailblazeBanner: banner, trailblazeBannerMobile: bannerMobile } = PHOTOS;
  return (
    <Shell>
      <DakshType>
        <div className="flex flex-col gap-[92px] max-[640px]:gap-14">
          {/* Hero — the dance banner, logo top-right, title bottom-left */}
          <section className="relative isolate flex min-h-[520px] flex-col justify-end overflow-hidden rounded-[16px] p-14 max-[1080px]:px-9 max-[640px]:-mx-4.5 max-[640px]:-mt-8 max-[640px]:min-h-[420px] max-[640px]:rounded-none max-[640px]:px-5 max-[640px]:pb-9">
            <picture>
              <source media="(max-width: 640px)" srcSet={bannerMobile.src} width={bannerMobile.width} height={bannerMobile.height} />
              <img
                src={banner.src}
                alt={banner.alt}
                width={banner.width}
                height={banner.height}
                loading="eager"
                decoding="async"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-[64%_50%] max-[640px]:object-top"
              />
            </picture>
            <div
              className="absolute inset-0 -z-10 max-[640px]:hidden"
              style={{ background: "linear-gradient(90deg, rgba(12,12,14,0.4) 0%, rgba(12,12,14,0.15) 55%, rgba(22,36,74,0) 100%)" }}
            />
            <div
              className="absolute inset-0 -z-10 min-[641px]:hidden"
              style={{ background: "linear-gradient(180deg, rgba(12,12,14,0.05) 0%, rgba(12,12,14,0.35) 50%, rgba(12,12,14,0.82) 100%)" }}
            />
            <DakshLogo light className="absolute top-11 right-[100px] w-[180px] max-[1080px]:right-9 max-[640px]:top-6 max-[640px]:right-auto max-[640px]:left-5 max-[640px]:w-[120px]" />
            <div className="flex flex-col gap-4 max-[640px]:gap-2.5">
              <p className="flex items-center gap-3.5 text-[17px] font-bold uppercase leading-[1.2] tracking-[0.22em] text-fg [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] max-[640px]:gap-2.5 max-[640px]:text-[11px] max-[640px]:tracking-[0.18em]">
                <span className="h-0.5 w-10 shrink-0 bg-gold-light max-[640px]:w-6" aria-hidden="true" />
                Daksh &amp; Open Day 2026 Competitions
              </p>
              <h1 className="flex flex-col font-gilda leading-none text-fg">
                <span className="text-[112px] max-[1080px]:text-[88px] max-[640px]:text-[56px]">TRAILBLAZE</span>
                <span className="mt-2 text-[44px] tracking-[0.12em] text-fg/90 max-[1080px]:text-[36px] max-[640px]:text-[22px]">COMPETITIONS</span>
              </h1>
              <Hand className="text-[48px] max-[640px]:text-[27px]">{TRAILBLAZE.theme}</Hand>
              <p className="mt-1 flex w-fit items-center gap-2.5 rounded-[12px] border border-gold/50 bg-ink/55 py-2.5 pr-4 pl-3 text-[17px] font-bold leading-[1.35] text-gold-light backdrop-blur-sm max-[640px]:text-[14px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                  <path d="M17 6h2.5a1.5 1.5 0 0 1 1.5 1.5V8a4 4 0 0 1-4 4M7 6H4.5A1.5 1.5 0 0 0 3 7.5V8a4 4 0 0 0 4 4" />
                </svg>
                {TRAILBLAZE.prizes}
              </p>
            </div>
          </section>

          <KeyInfo
            title="Compete at Trailblaze Competitions 2026"
            tiles={[
              { label: "Where", value: DAKSH.venue, note: DAKSH.address },
              { label: "Competitions", value: `${COMPETITIONS.length} competitions`, note: COMPETITIONS.map((c) => c.name.split(":")[0]).join(" · ") },
              { label: "Theme", value: TRAILBLAZE.theme, note: `${TRAILBLAZE.tagline} — ${DAKSH.theme.split(":")[0]}` },
              { label: "Registration", value: "Individual participants only", note: "Students register themselves — no institution entries" },
            ]}
          >
            <Btn href={TRAILBLAZE.register} external>
              Register — Participants
            </Btn>
            <Btn href={TRAILBLAZE.brochure} download variant="outline">
              Competitions brochure ↓
            </Btn>
            <Btn href="/" variant="outline">
              Back to Daksh
            </Btn>
          </KeyInfo>

          {/* Overall School Championship */}
          <section aria-labelledby="tb-prizes" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Kicker>Prizes · Trailblaze Competitions 2026</Kicker>
              <Heading className="text-[42px] max-[640px]:text-[30px]">
                <span id="tb-prizes">Overall School Championship</span>
              </Heading>
            </div>
            <ol className="grid grid-cols-[1.25fr_1fr_1fr] gap-5 max-[1080px]:grid-cols-1 max-[640px]:gap-4">
              {TRAILBLAZE.championship.map((t, i) => (
                <li
                  key={t.place}
                  className={`relative flex flex-col gap-2 overflow-hidden rounded-[16px] border px-7 pt-6 pb-7 max-[640px]:px-5 max-[640px]:pt-5 max-[640px]:pb-5 ${
                    i === 0
                      ? "border-gold/50 bg-[radial-gradient(120%_140%_at_100%_0%,#1d2f63_0%,#121a36_50%,#0e0f16_100%)]"
                      : "border-white/12 bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[13px] font-bold uppercase leading-[1.2] tracking-[0.22em] text-gold-light">
                    {i === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
                        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                        <path d="M17 6h2.5a1.5 1.5 0 0 1 1.5 1.5V8a4 4 0 0 1-4 4M7 6H4.5A1.5 1.5 0 0 0 3 7.5V8a4 4 0 0 0 4 4" />
                      </svg>
                    ) : (
                      <Sparkle className="h-3 w-3" />
                    )}
                    {t.place}
                  </span>
                  <span className={`font-gilda leading-none text-fg ${i === 0 ? "text-[64px] max-[640px]:text-[48px]" : "text-[48px] max-[640px]:text-[40px]"}`}>
                    {t.prize}
                  </span>
                  {t.extra && <span className="text-[17px] font-bold text-gold-light">{t.extra}</span>}
                </li>
              ))}
            </ol>
          </section>

          {/* Competitions */}
          <section id="competitions" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Kicker>The competitions</Kicker>
              <Heading className="text-[42px] max-[640px]:text-[30px]">Pick your stage</Heading>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 max-[1080px]:grid-cols-1 max-[640px]:gap-4">
              {COMPETITIONS.map((c, i) => {
                const [band, bandText, sparkle] = BANDS[i % BANDS.length];
                return (
                  <article
                    key={c.name}
                    tabIndex={0}
                    aria-label={`${c.name} — hover or focus to see the poster`}
                    className="group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#032e4b]/10 bg-white shadow-[0_14px_28px_-14px_rgba(0,0,0,0.6)] outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold-light"
                  >
                    {/* The competition poster fades in over the card on hover, focus or tap */}
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#032e4b]/92 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
                      <img
                        src={c.poster}
                        alt={`${c.name} poster`}
                        loading="lazy"
                        decoding="async"
                        className="h-full max-h-full w-auto scale-95 rounded-[10px] object-contain shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-100 group-focus:scale-100"
                      />
                    </div>
                    <div className="flex items-center justify-between px-[26px] pt-3.5 pb-3 max-[640px]:px-5" style={{ background: band, color: bandText }}>
                      <span className="flex items-center gap-2 text-[13px] font-bold uppercase leading-[1.2] tracking-[0.22em]">
                        <Sparkle className="h-3 w-3" />
                        <span style={{ color: bandText }}>{c.tag}</span>
                        <span className="ml-1 rounded-full border border-current/40 px-2 pt-[3px] pb-px text-[10px] tracking-[0.12em] opacity-80">
                          <span className="max-[1080px]:hidden">Hover for poster</span>
                          <span className="min-[1081px]:hidden">Tap for poster</span>
                        </span>
                      </span>
                      <span className="font-gilda text-[22px] leading-[1.2]" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 px-[26px] pt-[22px] pb-[26px] max-[640px]:px-5 max-[640px]:pt-5 max-[640px]:pb-5">
                      <h3 className="font-gilda text-[27px] uppercase leading-[1.2] tracking-[0.01em] text-[#032e4b] max-[640px]:text-[23px]">{c.name}</h3>
                      <div className="text-[12px] font-bold uppercase leading-[1.2] tracking-[0.22em] text-[#33a7f1] max-[640px]:text-[10px]">{c.kind}</div>
                      <p className="font-hand text-[24px] leading-[1.2] text-[#56071d] max-[640px]:text-[20px]">{c.tagline}</p>
                      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 rounded-[16px] bg-[#e6ecfb] px-[18px] pt-3.5 pb-3 text-[14px] leading-[1.5] max-[640px]:text-[13px]">
                        <dt className="font-bold text-[#253b81]">Team</dt>
                        <dd className="text-[#0f1d33]">{c.team}</dd>
                        <dt className="font-bold text-[#253b81]">Format</dt>
                        <dd className="text-[#0f1d33]">{c.format}</dd>
                        {c.concept && (
                          <>
                            <dt className="font-bold text-[#253b81]">Theme</dt>
                            <dd className="text-[#0f1d33]">“{c.concept}”</dd>
                          </>
                        )}
                        <dt className="font-bold text-[#253b81]">Fee</dt>
                        <dd className="font-bold text-[#56071d]">{c.fee}</dd>
                      </dl>
                      <p className="mt-1 text-[14px] leading-[1.5] text-[#0f1d33]/80 max-[640px]:hidden">{c.description}</p>
                    </div>
                  </article>
                );
              })}
              {/* Theme card fills the eighth slot */}
              <div className="relative isolate flex flex-col justify-center gap-2.5 overflow-hidden rounded-[16px] border border-gold/50 bg-[#16244a] px-10 py-14 max-[640px]:px-6 max-[640px]:py-7">
                <div className="absolute -right-[40px] -bottom-[100px] -z-10 h-[260px] w-[260px] rounded-full border-[24px] border-gold-light/22" aria-hidden="true" />
                <Sparkle className="h-[30px] w-[30px] text-gold-light" />
                <Kicker className="text-gold-light">The theme</Kicker>
                <Heading as="p" className="text-[46px] leading-[1.05] tracking-normal max-[640px]:text-[32px]">
                  The Culture of
                  <br />
                  Tomorrow
                </Heading>
                <Hand className="text-[26px] max-[640px]:text-[20px]">{TRAILBLAZE.tagline}</Hand>
                <p className="max-w-[420px] text-[15px] leading-[1.6] text-white/75">
                  {DAKSH.theme} — tracing how human ingenuity has reshaped professions, ideas and societies, and how today’s
                  innovations carve the path to tomorrow.
                </p>
              </div>
            </div>
          </section>

          {/* How to take part */}
          <section id="take-part" className="flex scroll-mt-8 flex-col gap-6 max-[640px]:gap-3">
            <div className="flex flex-col gap-3">
              <Kicker>How to take part</Kicker>
              <Heading className="text-[42px] max-[640px]:hidden">Three steps to the stage</Heading>
            </div>
            <div className="grid grid-cols-3 gap-[18px] max-[1080px]:grid-cols-1 max-[640px]:gap-3">
              {STEPS.map(([n, title, aside, body]) => (
                <div
                  key={n}
                  className="flex flex-col gap-2 rounded-[16px] border border-line bg-card px-6 pt-[22px] pb-6 max-[640px]:flex-row max-[640px]:items-center max-[640px]:gap-4 max-[640px]:px-4 max-[640px]:py-3"
                >
                  <div className="font-gilda text-[50px] leading-[1.05] text-gold max-[640px]:text-[30px]">{n}</div>
                  <Heading as="h3" className="text-[19px] leading-[1.2] max-[640px]:text-[16px]">
                    {title}
                    <span className="min-[641px]:hidden"> — {aside}</span>
                  </Heading>
                  <p className="text-[16px] leading-[1.6] text-text-secondary max-[640px]:hidden">{body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Btn href={TRAILBLAZE.register} external>
                Register for Trailblaze Competitions →
              </Btn>
              <p className="text-[14px] leading-[1.5] text-text-secondary">Registration is for individual participants only.</p>
            </div>
          </section>

          {/* Trailblaze contacts, from the brochure */}
          <section aria-labelledby="tb-contact" className="flex flex-col gap-4 rounded-[16px] border border-line bg-card px-11 py-10 max-[640px]:px-5 max-[640px]:py-6">
            <Kicker>Trailblaze Competitions · queries</Kicker>
            <Heading className="text-[32px] max-[640px]:text-[24px]">
              <span id="tb-contact">In case of queries, contact us</span>
            </Heading>
            <ContactList people={TRAILBLAZE_CONTACTS} className="pt-1" />
          </section>

          {/* Back to Daksh, with the logo and ALDEN */}
          <section className="relative isolate flex items-center gap-9 overflow-hidden rounded-[16px] border border-line bg-card p-11 max-[1080px]:flex-col max-[1080px]:items-start max-[640px]:gap-4 max-[640px]:p-5">
            <div className="absolute -top-[120px] -right-[70px] -z-10 h-[260px] w-[260px] rounded-full border-[22px] border-gold/45 max-[640px]:hidden" aria-hidden="true" />
            <Mascot className="w-[190px] rounded-[16px] max-[640px]:w-[120px]" />
            <div className="flex flex-1 flex-col items-start gap-2">
              <DakshLogo light className="w-[230px] max-[640px]:w-[180px]" />
              <Heading className="text-[32px] max-[640px]:text-[24px]">Competing is just the start</Heading>
              <p className="max-w-[509px] text-[16px] leading-[1.6] text-text-secondary max-[640px]:hidden">
                Explore every school, tour the campus at University Open Day and get career guidance — all on the same two days.
              </p>
            </div>
            <div className="self-end max-[1080px]:self-start max-[640px]:w-full">
              <Btn href="/">Explore Daksh &amp; Open Day →</Btn>
            </div>
          </section>
        </div>
      </DakshType>
    </Shell>
  );
}
