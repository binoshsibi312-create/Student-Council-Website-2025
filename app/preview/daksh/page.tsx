import type { Metadata } from "next";
import Countdown from "@/components/daksh/Countdown";
import { DakshLogo, Img, Mascot } from "@/components/daksh/ui";
import { Arc, ButtonB, EyebrowB, Hand, PolaroidB, TitleB } from "@/components/daksh-b/ui";
import { AWAITS, CAMPUSES, COMPETITIONS, CONTACTS, DAKSH, MOMENTS, OPEN_DAY, PHOTOS, SCHOOLS, SOCIALS, TRAILBLAZE, UNIVERSITY_STATS } from "@/lib/daksh";

export const metadata: Metadata = { title: "Daksh 2026 · Design B preview | University Student Council" };

const DEPARTMENT_COUNT = SCHOOLS.reduce((n, s) => n + s.departments.length, 0);

const card = "rounded-[16px] border border-db-navy/12 bg-white shadow-[0_8px_24px_-16px_rgba(3,46,75,0.35)]";

export default function DakshDesignB() {
  return (
    <div className="flex flex-col gap-24 max-[640px]:gap-14">
      {/* Hero */}
      <section className="relative isolate flex min-h-[600px] flex-col justify-end overflow-hidden rounded-[16px] px-14 pb-14 max-[1080px]:px-9 max-[640px]:-mx-4 max-[640px]:-mt-4 max-[640px]:min-h-[540px] max-[640px]:rounded-none max-[640px]:px-5 max-[640px]:pb-9">
        <Img photo={PHOTOS.stallAvenue} eager className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(180deg, rgba(3,46,75,0) 0%, rgba(3,46,75,0) 38%, rgba(3,46,75,0.6) 66%, rgba(3,46,75,0.95) 100%)" }}
        />
        <p className="font-gs text-[clamp(1rem,1.6vw,1.3rem)] font-bold uppercase tracking-[0.3em] text-white [text-shadow:0_2px_16px_rgba(3,46,75,0.9)] max-[640px]:tracking-[0.18em]">
          University Student Council presents
        </p>
        <h1 className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
          <span className="sr-only">Daksh 2026</span>
          <DakshLogo className="w-[min(520px,70vw)] drop-shadow-[0_6px_24px_rgba(3,46,75,0.7)]" />
          <span aria-hidden="true" className="font-gs text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.8] text-db-butter [text-shadow:0_6px_24px_rgba(3,46,75,0.7)]">
            2026
          </span>
        </h1>
        <p className="mt-5 font-manjari text-[clamp(1.15rem,2vw,1.6rem)] font-bold text-white [text-shadow:0_2px_14px_rgba(3,46,75,0.9)]">
          Education &amp; Career Guidance Fair · University Open Day
        </p>
      </section>

      {/* Key information — navy date block + tiles, brochure style */}
      <section aria-labelledby="key-info-b">
        <h2 id="key-info-b" className="sr-only">
          Key information
        </h2>
        <div className="grid grid-cols-[1.1fr_2fr] gap-4 max-[1080px]:grid-cols-1">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[16px] bg-db-royal px-8 py-8 text-white max-[640px]:px-6">
            <Arc className="-right-16 -bottom-16 h-48 w-48 border-white/15" />
            <div>
              <div className="font-gs text-[clamp(3.2rem,6vw,4.6rem)] font-semibold leading-none">21–22</div>
              <div className="mt-2 font-gs text-[1.6rem] font-semibold uppercase tracking-[0.04em]">November 2026</div>
              <div className="mt-1 font-gs text-[1.2rem] text-white/85">{DAKSH.hours}</div>
            </div>
            <div className="mt-6 [&>span]:rounded-[16px] [&>span]:border-db-butter/60 [&>span]:bg-white/10 [&>span]:text-db-butter">
              <Countdown startsAt={DAKSH.startsAt} endsAt={DAKSH.endsAt} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1 max-[640px]:gap-3">
            {[
              ["Where", DAKSH.venue, DAKSH.address],
              ["Online stalls", "Available", "Details will be shared shortly"],
              ["6 campuses", "One university", CAMPUSES.join(" · ")],
              [`${SCHOOLS.length} schools`, `${DEPARTMENT_COUNT} departments`, "Plus the University's centres and cells"],
            ].map(([label, value, note]) => (
              <div key={label} className={`${card} px-6 py-5`}>
                <div className="font-gs text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-db-steel">{label}</div>
                <div className="mt-1 font-gs text-[1.45rem] font-semibold text-db-navy">{value}</div>
                <div className="mt-1 text-[0.9rem] leading-snug text-db-ink/70">{note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${card} mt-4 flex flex-wrap items-center gap-3.5 px-6 py-5 max-[640px]:flex-col max-[640px]:items-stretch`}>
          <span className="mr-auto font-gs text-[1.15rem] font-semibold uppercase tracking-[0.04em] text-db-royal max-[640px]:mr-0">Be part of Daksh 2026</span>
          <ButtonB href={DAKSH.registerIndividuals} external>
            Register — Individuals
          </ButtonB>
          <ButtonB href={DAKSH.registerInstitutions} external variant="outline">
            Register — Institutions
          </ButtonB>
          <ButtonB href={DAKSH.brochure} download variant="butter">
            Download brochure ↓
          </ButtonB>
        </div>
      </section>

      {/* What is Daksh */}
      <section className={`${card} relative grid grid-cols-[1fr_auto] items-center gap-14 overflow-hidden px-12 py-12 max-[1080px]:grid-cols-1 max-[640px]:gap-10 max-[640px]:px-5 max-[640px]:py-9`}>
        <Arc className="-right-24 -bottom-24 h-64 w-64" />
        <div className="relative">
          <DakshLogo className="mb-5 w-[260px] max-[640px]:w-[200px]" />
          <EyebrowB>Education and career guidance fair</EyebrowB>
          <TitleB>Find your path at CHRIST</TitleB>
          <p className="mt-4 max-w-[560px] text-[1.05rem] leading-[1.7] text-db-ink/80">
            Daksh is an annual Education and Career Guidance Fair hosted by the University Student Council. It focuses on the
            opportunities available to pre-university, undergraduate and postgraduate students — with every department at
            its stall, career dialogues and personal counselling to help you choose with confidence.
          </p>
          <Hand className="mt-5">Academics, admissions, placements and campus life — ask us anything!</Hand>
        </div>
        <PolaroidB
          photo={PHOTOS.openDaySign}
          caption="Open Day & Daksh — see you in November!"
          tilt={-3}
          className="relative w-[400px] max-[1080px]:mx-auto max-[1080px]:w-full max-[1080px]:max-w-[400px]"
        />
      </section>

      {/* University Open Day + overview of CHRIST */}
      <section className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-center gap-12 max-[1080px]:grid-cols-1 max-[1080px]:gap-8">
        <div>
          <EyebrowB>Same days · Same campus</EyebrowB>
          <TitleB>{OPEN_DAY.title}</TitleB>
          <p className="mt-4 text-[1.05rem] leading-[1.7] text-db-ink/80">{OPEN_DAY.summary}</p>
          <p className="mt-2 text-[0.92rem] text-db-steel">{OPEN_DAY.partner}</p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {UNIVERSITY_STATS.map((s) => (
              <div key={s.label} className="rounded-[16px] bg-db-royal px-5 py-4 text-white">
                <div className="font-gs text-[2rem] font-bold leading-none">{s.value}</div>
                <div className="mt-1.5 font-gs text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-white/85">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <Arc className="-right-10 -bottom-10 h-40 w-40 max-[640px]:hidden" solid />
          <Img photo={PHOTOS.openDayWalk} className="relative aspect-[4/5] w-full rounded-[16px] object-cover max-[1080px]:aspect-[4/3]" />
        </div>
      </section>

      {/* What awaits you */}
      <section>
        <EyebrowB>What awaits you</EyebrowB>
        <TitleB>Two days, the whole university</TitleB>
        <div className="mt-7 grid grid-cols-4 gap-5 max-[1080px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
          {AWAITS.map((a) => {
            const isTrailblaze = !a.photo;
            const Card = isTrailblaze ? "a" : "article";
            return (
              <Card
                key={a.title}
                {...(isTrailblaze ? { href: "/preview/trailblaze" } : {})}
                className={`${card} overflow-hidden no-underline transition-all duration-200 hover:-translate-y-1 hover:border-db-royal/50 max-[640px]:flex max-[640px]:items-center max-[640px]:gap-3.5 max-[640px]:p-2.5`}
              >
                {a.photo ? (
                  <Img photo={a.photo} className="aspect-[245/170] w-full object-cover max-[640px]:aspect-auto max-[640px]:h-20 max-[640px]:w-24 max-[640px]:shrink-0 max-[640px]:rounded-[12px]" />
                ) : (
                  <div className="flex aspect-[245/170] w-full flex-col items-center justify-center bg-db-maroon max-[640px]:aspect-auto max-[640px]:h-20 max-[640px]:w-24 max-[640px]:shrink-0 max-[640px]:rounded-[12px]" aria-hidden="true">
                    <span className="font-gs text-[1.4rem] font-bold tracking-[0.14em] text-white max-[640px]:text-[0.66rem]">TRAILBLAZE</span>
                    <span className="mt-1 font-hand text-[1.05rem] text-db-butter max-[640px]:hidden">{COMPETITIONS.length} competitions</span>
                  </div>
                )}
                <div className="px-5 pt-4.5 pb-5.5 max-[640px]:p-0 max-[640px]:pr-2">
                  <h3 className="font-gs text-[1.12rem] font-semibold text-db-navy">{a.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-[1.55] text-db-ink/75 max-[640px]:text-[0.85rem]">{a.body}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Moments wall */}
      <section
        className="relative overflow-hidden rounded-[16px] px-14 pt-13 pb-16 max-[1080px]:px-8 max-[640px]:-mx-4 max-[640px]:rounded-none max-[640px]:px-4 max-[640px]:pt-9 max-[640px]:pb-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%) 0 0 / 56px 56px, linear-gradient(225deg, rgba(255,255,255,0.05) 25%, transparent 25%) 0 0 / 56px 56px, linear-gradient(135deg, #253b81 0%, #032e4b 100%)",
        }}
      >
        <div className="mb-10 text-center max-[640px]:mb-7">
          <div className="mb-2 font-gs text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-db-butter">Daksh 2025 · Open Day</div>
          <h2 className="font-gs text-[clamp(1.6rem,3vw,2.4rem)] font-semibold uppercase tracking-[0.02em] text-white">Moments worth coming back for</h2>
        </div>
        <div className="mx-auto grid max-w-[900px] grid-cols-3 gap-x-9 gap-y-10 max-[640px]:grid-cols-2 max-[640px]:gap-x-3.5 max-[640px]:gap-y-5">
          {MOMENTS.map((m, i) => (
            <PolaroidB key={m.caption} photo={m.photo} caption={m.caption} tilt={m.tilt} className={i >= 6 ? "max-[640px]:hidden" : ""} />
          ))}
        </div>
      </section>

      {/* Schools & departments — brochure page 3 */}
      <section>
        <Hand tone="royal" className="mb-3">Every step in learning is a new step towards growth.</Hand>
        <div className="relative overflow-hidden rounded-[16px] bg-db-royal px-9 py-7 text-white max-[640px]:px-5 max-[640px]:py-6">
          <div className="pointer-events-none absolute top-1/2 -right-6 h-px w-48 bg-white/70 max-[640px]:hidden" aria-hidden="true" />
          <div className="font-gs text-[clamp(1.6rem,3vw,2.4rem)] font-semibold uppercase leading-tight">Schools &amp; departments</div>
          <div className="font-gs text-[clamp(1.1rem,2vw,1.5rem)] uppercase tracking-[0.04em] text-white/85">Across the University</div>
        </div>
        <div className="mt-5 columns-3 gap-4 max-[1080px]:columns-2 max-[640px]:columns-1">
          {SCHOOLS.map((s) => (
            <div key={s.name} className="mb-4 break-inside-avoid rounded-[16px] border border-db-navy/12 bg-db-mist/70 px-5.5 py-5">
              <h3 className="border-b border-db-royal/30 pb-3 font-gs text-[1.02rem] font-semibold uppercase leading-snug tracking-[0.02em] text-db-royal">{s.name}</h3>
              <ul className="mt-3 space-y-0.5">
                {s.departments.map((dep) => (
                  <li key={dep} className="text-[0.95rem] text-db-ink/80">
                    {dep}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trailblaze band */}
      <a
        href="/preview/trailblaze"
        className="group relative isolate flex items-center gap-10 overflow-hidden rounded-[16px] bg-db-maroon px-12 py-12 no-underline max-[1080px]:flex-col max-[1080px]:items-start max-[640px]:gap-6 max-[640px]:px-5 max-[640px]:py-8"
      >
        <Arc className="-top-20 -right-20 h-64 w-64 border-db-butter/25" />
        <div className="relative flex-1">
          <div className="font-gs text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-db-butter">Trailblaze · {TRAILBLAZE.theme}</div>
          <h2 className="mt-2 max-w-[620px] font-gs text-[clamp(1.6rem,3vw,2.5rem)] font-semibold uppercase leading-[1.1] text-white">
            {COMPETITIONS.length} competitions. One weekend.
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {COMPETITIONS.map((c) => (
              <li key={c.name} className="rounded-[16px] bg-white/10 px-3 py-1.5 font-gs text-[0.8rem] font-medium text-white">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
        <span className="relative inline-flex items-center justify-center rounded-[16px] bg-db-butter px-6 py-3.5 font-gs text-[0.92rem] font-semibold text-db-navy transition-colors group-hover:bg-[#ffe39e] max-[640px]:w-full">
          Enter Trailblaze →
        </span>
      </a>

      {/* Contact — brochure back page */}
      <section className="relative grid grid-cols-[auto_1fr] items-center gap-10 overflow-hidden rounded-[16px] bg-db-navy px-12 py-11 text-white max-[1080px]:grid-cols-1 max-[640px]:gap-6 max-[640px]:px-5 max-[640px]:py-8">
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/8" aria-hidden="true" />
        <Mascot className="relative w-[210px] rounded-[16px] max-[640px]:w-[150px]" />
        <div className="relative">
          <div className="font-gs text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold uppercase leading-tight">In case of queries, contact us</div>
          <Hand tone="butter" className="mt-1">Alden&apos;s got your back!</Hand>
          <div className="mt-5 grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
            {CONTACTS.map((c) => (
              <div key={c.email}>
                <div className="font-gs font-semibold">{c.name}</div>
                <a href={`mailto:${c.email}`} className="block break-all text-[0.92rem] text-db-butter hover:underline">
                  {c.email}
                </a>
                <a href={`tel:${c.tel}`} className="text-[0.92rem] text-white/80 hover:text-white">
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[0.92rem]">
            <a href={`mailto:${DAKSH.email}`} className="text-db-butter hover:underline">
              {DAKSH.email}
            </a>
            {SOCIALS.map((s) => (
              <a key={s.handle} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                {s.handle}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
