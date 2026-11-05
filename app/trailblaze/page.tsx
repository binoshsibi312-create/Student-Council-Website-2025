import type { Metadata } from "next";
import ContactList from "@/components/ContactList";
import Shell from "@/components/Shell";
import DakshType from "@/components/daksh/DakshType";
import { Btn, Hand, Heading, KeyInfo, Kicker, Sparkle } from "@/components/daksh/kit";
import { DakshLogo, Mascot } from "@/components/daksh/ui";
import { COMPETITIONS, DAKSH, PHOTOS, TRAILBLAZE, TRAILBLAZE_CONTACTS } from "@/lib/daksh";

export const metadata: Metadata = {
  title: "Trailblaze | Daksh & Open Day 2026 Competitions",
  description: `Trailblaze — ${COMPETITIONS.length} Daksh & Open Day 2026 competitions on the theme “${TRAILBLAZE.theme}”: ${COMPETITIONS.map((c) => c.name).join(", ")}. ${DAKSH.dates}.`,
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
  ["03", "Read the brochure", "Rules & fees", "The Trailblaze brochure has the guidelines, judging criteria and registration fee for every competition."],
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
              <h1 className="font-gilda text-[112px] leading-none text-fg max-[1080px]:text-[88px] max-[640px]:text-[56px]">TRAILBLAZE</h1>
              <Hand className="text-[48px] max-[640px]:text-[27px]">{TRAILBLAZE.theme}</Hand>
            </div>
          </section>

          <KeyInfo
            title="Compete at Trailblaze"
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
              Trailblaze brochure ↓
            </Btn>
            <Btn href="/" variant="outline">
              Back to Daksh
            </Btn>
          </KeyInfo>

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
                    className="flex flex-col overflow-hidden rounded-[16px] border border-[#032e4b]/10 bg-white shadow-[0_14px_28px_-14px_rgba(0,0,0,0.6)] transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between px-[26px] pt-3.5 pb-3 max-[640px]:px-5" style={{ background: band, color: bandText }}>
                      <span className="flex items-center gap-2 text-[13px] font-bold uppercase leading-[1.2] tracking-[0.22em]">
                        <Sparkle className="h-3 w-3" />
                        <span style={{ color: bandText }}>{c.tag}</span>
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
                Register for Trailblaze →
              </Btn>
              <p className="text-[14px] leading-[1.5] text-text-secondary">Registration is for individual participants only.</p>
            </div>
          </section>

          {/* Trailblaze contacts, from the brochure */}
          <section aria-labelledby="tb-contact" className="flex flex-col gap-4 rounded-[16px] border border-line bg-card px-11 py-10 max-[640px]:px-5 max-[640px]:py-6">
            <Kicker>Trailblaze queries</Kicker>
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
