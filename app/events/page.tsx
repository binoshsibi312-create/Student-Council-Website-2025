import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Gochi_Hand } from "next/font/google";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import { ButtonLink, Chip, Eyebrow, H2, Img } from "@/components/daksh/ui";
import { DAKSH, TEACHERS_DAY, type Photo } from "@/lib/daksh";

// Handwritten accents for the Gratitude Day note (see DakshType for why the var is re-declared).
const hand = Gochi_Hand({ variable: "--nf-hand", subsets: ["latin"], weight: "400" });
const handVar = { "--font-hand": 'var(--nf-hand), "Comic Sans MS", cursive' } as CSSProperties;

export const metadata: Metadata = { title: "Events | University Student Council" };

const ev = (name: string, alt: string, width = 1600, height = 1200): Photo => ({ src: `/images/events/2026/${name}.jpg`, alt, width, height });

const GRATITUDE = {
  quad: ev("gratitude-day/quad", "Students, staff and the choir filling the quadrangle for Gratitude Day, seen from the balconies above", 2000, 1500),
  staff: ev("gratitude-day/staff", "Housekeeping staff listening to the Gratitude Day song"),
  choir: ev("gratitude-day/choir-song", "The University Choir singing the Gratitude Day song"),
  vc: ev("gratitude-day/vc", "The Vice-Chancellor addressing the Gratitude Day gathering"),
  drums: ev("gratitude-day/drums", "A drummer from the band keeping time during the song"),
  staffCouncil: ev("gratitude-day/staff-council", "A councillor standing with the support staff"),
  singer: ev("gratitude-day/singer", "A councillor leading the gathering in song", 1200, 1600),
};
const INVESTITURE = {
  stage: ev("investiture/council-stage", "The 2026–27 University Student Council with the Vice-Chancellor, the Director and faculty at the Investiture Ceremony", 2000, 1500),
  certificates: ev("investiture/certificates", "Councillors receiving their certificates on stage"),
  vc: ev("investiture/address", "Rev Col Fr Dr Jose CC, Vice-Chancellor, addressing the Investiture Ceremony"),
  oath: ev("investiture/oath", "Councillors taking the oath, hands on hearts"),
  flag: ev("investiture/flag", "The University flag carried across the stage"),
  director: ev("investiture/director", "Dr Kishore Selva Babu, Director of the University Student Council, addressing the Investiture Ceremony", 1200, 1600),
};
const GB_MEETING = {
  podium: ev("gb-meeting/podium", "A councillor presenting at the podium", 1067, 1600),
  auditorium: ev("gb-meeting/auditorium", "Councillors filling the auditorium for the General Body Meeting", 1600, 1067),
  presenting: ev("gb-meeting/presenting", "Two councillors presenting a committee update", 1600, 1067),
  listening: ev("gb-meeting/listening", "Councillors listening to a presentation", 1600, 1067),
  director: ev("gb-meeting/director", "Dr Kishore Selva Babu, Director of the University Student Council, speaking at the meeting", 1200, 1538),
};
const VC_FORUM = {
  group: ev("vc-open-forum/group", "The Vice-Chancellor, faculty and the University Student Council outside Block IV", 1600, 891),
  vc: ev("vc-open-forum/vc", "Rev Col Fr Dr Jose CC, Vice-Chancellor, answering a question at the open forum", 1400, 1190),
  hall: ev("vc-open-forum/hall", "The packed hall at the open forum", 1600, 1067),
  question: ev("vc-open-forum/question", "A councillor reading out a question", 1212, 1600),
  panel: ev("vc-open-forum/panel", "Panel members in discussion", 1600, 1067),
  studentQuestion: ev("vc-open-forum/student-question", "A student putting a question to the panel", 1600, 1067),
};
const BHASHA = ev("bhasha-utsav", "The University Student Council in ethnic wear on the Central Block steps at Bhasha Utsav", 1280, 720);
const DAKSH_OPENING = ev("daksh-opening", "The ribbon being cut to open the Daksh 2025 University Open Day", 2000, 1157);

const [soloDance, ensembleDance, band, felicitation, teachersAudience] = TEACHERS_DAY.photos;

const COMMITTEES = ["Logistics", "Events", "Promotions", "IT & Website", "Documentation", "Design"];

const SKY_WALK =
  "Proposed by the University Student Council and approved by the University and regulatory authorities, the Sky Walk eases student movement and pedestrian safety — proof that a small idea can have a lasting campus-wide impact.";

/** A photo that eases in on hover. */
function Shot({ photo, className = "", imgClass = "" }: { photo: Photo; className?: string; imgClass?: string }) {
  return (
    <div className={`group min-h-0 overflow-hidden rounded-xl bg-ink-2 ${className}`}>
      <Img photo={photo} className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imgClass}`} />
    </div>
  );
}

function Heading({ date, title, children }: { date: string; title: string; children: ReactNode }) {
  return (
    <>
      <Eyebrow>{date}</Eyebrow>
      <H2>{title}</H2>
      <p className="mt-3 max-w-[760px] text-base font-light leading-[1.65] text-text-secondary">{children}</p>
    </>
  );
}

const section = "scroll-mt-24";

export default function EventsPage() {
  return (
    <Shell>
      <SectionHeader
        eyebrow="Campus Calendar"
        title="Events, Fests & Initiatives"
        subtitle="The flagship events and long-running traditions the University Student Council organises every year — and the moments that made them."
      />

      <div className="flex flex-col gap-20 max-[640px]:gap-12">
        {/* Featured: Daksh 2026 */}
        {/* Text and photo side by side, so nothing sits on top of the picture */}
        <section className="grid grid-cols-[1fr_1.4fr] overflow-hidden rounded-[22px] border border-line bg-[radial-gradient(circle_at_0%_100%,rgba(184,146,58,0.2),transparent_60%),var(--color-card)] max-[1080px]:grid-cols-1">
          <div className="flex flex-col justify-end px-11 py-10 max-[1080px]:px-8 max-[640px]:px-5 max-[640px]:py-6">
            <div>
              <Chip accent>Flagship event · Coming up</Chip>
            </div>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] font-bold leading-none text-fg">Daksh 2026</h2>
            <p className="mt-2.5 font-display text-[clamp(1.15rem,2vw,1.5rem)] font-semibold italic text-gold-light">
              Education &amp; Career Guidance Fair · {DAKSH.dates.replace(" 2026", "")}
            </p>
            <p className="mt-2.5 max-w-[520px] text-base font-light leading-[1.6] text-text-secondary">
              Department stalls, career counselling, the Trailblaze competitions and the University Open Day — all at{" "}
              {DAKSH.venue}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 max-[640px]:flex-col">
              <ButtonLink href="/">Explore Daksh →</ButtonLink>
              <ButtonLink href="/trailblaze" primary={false}>
                Trailblaze competitions
              </ButtonLink>
            </div>
          </div>
          <figure className="relative min-h-[400px] max-[1080px]:order-first max-[1080px]:aspect-[16/9] max-[1080px]:min-h-0">
            <Img photo={DAKSH_OPENING} className="absolute inset-0 h-full w-full object-cover object-[55%_45%]" />
            <figcaption className="absolute bottom-3.5 left-3.5 rounded-full border border-white/15 bg-ink/70 px-3.5 py-1.5 text-[0.72rem] font-medium text-white/85 backdrop-blur-md">
              Opening Daksh 2025 · University Open Day
            </figcaption>
          </figure>
        </section>

        {/* 22 Sep — VC Open Forum: editorial spotlight + filmstrip */}
        <section className={section} id="vc-open-forum">
          <div className="grid grid-cols-[1fr_1.35fr] items-end gap-10 max-[1080px]:grid-cols-1 max-[1080px]:gap-6">
            <div className="relative">
              <span className="pointer-events-none absolute -top-10 -left-2 font-display text-[9rem] leading-none font-bold text-white/[0.04] select-none max-[640px]:text-[6rem]" aria-hidden="true">
                22
              </span>
              <Eyebrow>22 September 2026 · Central Campus</Eyebrow>
              <H2>Open Forum with the Vice-Chancellor</H2>
              <p className="mt-3 text-base font-light leading-[1.65] text-text-secondary">
                An open forum where students put their questions and concerns directly to the Vice-Chancellor, alongside the
                University Student Council.
              </p>
            </div>
            <Shot photo={VC_FORUM.group} className="aspect-[16/10] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" />
          </div>
          <div className="mt-4 grid h-[240px] grid-cols-[1fr_1fr_0.7fr_1fr] gap-3.5 max-[1080px]:h-auto max-[1080px]:grid-cols-2 max-[640px]:gap-2.5">
            <Shot photo={VC_FORUM.studentQuestion} className="h-full max-[1080px]:aspect-[4/3.4]" />
            <Shot photo={VC_FORUM.vc} className="h-full max-[1080px]:aspect-[4/3.4]" imgClass="object-[62%_40%]" />
            <Shot photo={VC_FORUM.question} className="h-full max-[1080px]:aspect-[4/3.4]" imgClass="object-[50%_25%]" />
            <Shot photo={VC_FORUM.hall} className="h-full max-[1080px]:aspect-[4/3.4]" />
          </div>
        </section>

        {/* 19–20 Sep — Ploggathon: a two-day ticket */}
        <section className={section} id="ploggathon">
          <div className="relative overflow-hidden rounded-[22px] border border-[#3f6b4a]/50 bg-[radial-gradient(circle_at_12%_0%,rgba(92,160,108,0.22),transparent_55%),linear-gradient(135deg,#101a14,#0c0c0e_70%)] p-10 max-[640px]:p-6">
            <Eyebrow>19 &amp; 20 September 2026 · Bengaluru</Eyebrow>
            <H2>Ploggathon — Namma Bengaluru, Namma Mane</H2>
            <p className="mt-3 max-w-[720px] text-base font-light leading-[1.65] text-text-secondary">
              A two-day plogging clean-up drive under the Namma Bengaluru, Namma Mane initiative — jogging through the city and
              picking up litter along the way.
            </p>
            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-stretch max-[640px]:grid-cols-1">
              {[
                { day: "19", month: "September", place: "Town Hall area", note: "Day one in the heart of the city" },
                null,
                { day: "20", month: "September", place: "Yediyur Lake", note: "Day two along the lakeside" },
              ].map((d, i) =>
                d ? (
                  <div key={d.day} className="flex items-center gap-6 py-2 max-[640px]:gap-4">
                    <span className="font-display text-[5.5rem] leading-none font-bold text-[#9fd3ac] max-[640px]:text-[4rem]">{d.day}</span>
                    <span>
                      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/50">{d.month}</span>
                      <span className="mt-1 block font-display text-[1.6rem] leading-tight font-semibold text-fg">{d.place}</span>
                      <span className="mt-1 block text-[0.86rem] font-light text-white/60">{d.note}</span>
                    </span>
                  </div>
                ) : (
                  <span key={i} className="mx-8 w-px border-l-2 border-dashed border-white/15 max-[640px]:mx-0 max-[640px]:my-4 max-[640px]:h-px max-[640px]:w-full max-[640px]:border-t-2 max-[640px]:border-l-0" aria-hidden="true" />
                ),
              )}
            </div>
          </div>
        </section>

        {/* 12 Sep — Bhasha Utsav: cinematic */}
        <section className={section} id="bhasha-utsav">
          <div className="relative isolate overflow-hidden rounded-[22px]">
            <Img photo={BHASHA} className="aspect-[16/8] w-full object-cover object-[50%_35%] max-[640px]:aspect-[4/5]" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(9,9,10,0) 35%, rgba(9,9,10,0.55) 65%, rgba(9,9,10,0.96) 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 px-10 pb-9 max-[640px]:px-5 max-[640px]:pb-6">
              <Eyebrow>12 September 2026 · Central Campus</Eyebrow>
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-none font-bold text-fg">Bhasha Utsav 2026</h2>
              <p className="mt-3 max-w-[640px] text-base font-light leading-[1.6] text-[#e8e6e0] max-[640px]:text-[0.92rem]">
                The one festival that brings every Christite together — the Council leads the opening procession in ethnic
                attire, celebrating the University’s many languages and cultures.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Sep — Teachers' Day */}
        <section className={section} id="teachers-day">
          <Heading date="5 September 2026 · Teachers’ Day" title={TEACHERS_DAY.title}>
            Every Teachers’ Day, the Council partners with the Student Welfare Office to honour every teaching faculty member with
            a token of appreciation — and a celebration of song, dance and gratitude.
          </Heading>
          <div className="mt-7 grid grid-cols-[2.2fr_1fr_1fr] gap-3.5 max-[1080px]:grid-cols-2 max-[640px]:gap-2.5">
            <div className="grid grid-rows-[1.5fr_1fr] gap-3.5 max-[1080px]:col-span-2 max-[640px]:gap-2.5">
              <Img photo={TEACHERS_DAY.hero} className="h-full w-full rounded-xl object-cover" />
              <div className="grid grid-cols-2 gap-3.5 max-[640px]:gap-2.5">
                <Img photo={felicitation} className="h-full w-full rounded-xl object-cover" />
                <Img photo={teachersAudience} className="h-full w-full rounded-xl object-cover" />
              </div>
            </div>
            <Img photo={soloDance} className="h-full w-full rounded-xl object-cover max-[1080px]:aspect-[3/4]" />
            <div className="grid grid-rows-2 gap-3.5 max-[640px]:gap-2.5">
              <Img photo={ensembleDance} className="h-full w-full rounded-xl object-cover" />
              <Img photo={band} className="h-full w-full rounded-xl object-cover" />
            </div>
          </div>
        </section>

        {/* 27 Aug — General Body Meeting: triptych with the Director */}
        <section className={section} id="gb-meeting">
          <Heading date="27 August 2026 · Yeshwanthpur Campus" title="USC General Body Meeting">
            Every month the Council meets to take up the latest issues and concerns across campuses and schools, and each committee
            shares updates on its upcoming events and initiatives.
          </Heading>
          <div className="mt-7 grid h-[540px] grid-cols-[0.8fr_1.6fr_0.8fr] gap-3.5 max-[1080px]:h-auto max-[1080px]:grid-cols-2 max-[640px]:gap-2.5">
            <Shot photo={GB_MEETING.podium} className="h-full max-[1080px]:aspect-[3/4]" imgClass="object-[60%_50%]" />
            <div className="grid h-full min-h-0 grid-rows-[minmax(0,1.25fr)_minmax(0,1fr)] gap-3.5 max-[1080px]:h-[440px] max-[640px]:h-[340px] max-[1080px]:order-first max-[1080px]:col-span-2 max-[640px]:gap-2.5">
              <Shot photo={GB_MEETING.auditorium} />
              <div className="grid min-h-0 grid-cols-2 gap-3.5 max-[640px]:gap-2.5">
                <Shot photo={GB_MEETING.presenting} />
                <Shot photo={GB_MEETING.listening} />
              </div>
            </div>
            <figure className="relative h-full min-h-0">
              <Shot photo={GB_MEETING.director} className="h-full max-[1080px]:aspect-[3/4]" imgClass="object-[60%_40%]" />
              <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-lg border border-white/10 bg-ink/75 px-3.5 py-2.5 backdrop-blur-md">
                <span className="block font-display text-[1.02rem] leading-tight font-semibold text-fg">Dr Kishore Selva Babu</span>
                <span className="block text-[0.7rem] text-gold-light">Director, University Student Council</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 8–9 Jul — Leadership Training Program: the six committees */}
        <section className={section} id="ltp">
          <div className="rounded-[22px] border border-line bg-[radial-gradient(circle_at_100%_0%,rgba(184,146,58,0.14),transparent_50%),var(--color-card)] p-10 max-[640px]:p-6">
            <div className="grid grid-cols-[1.1fr_1fr] gap-10 max-[1080px]:grid-cols-1 max-[1080px]:gap-7">
              <div>
                <Eyebrow>8–9 July 2026 · Yeshwanthpur Campus</Eyebrow>
                <H2>USC Leadership Training Program</H2>
                <p className="mt-3 text-base font-light leading-[1.65] text-text-secondary">
                  Two intensive days where the councillors came together to work, build and bond as the team leading the University
                  this academic year — sharing initiatives and ideas, forming the six committees and choosing each committee’s
                  point of contact.
                </p>
                <div className="mt-6 inline-flex items-baseline gap-3 rounded-full border border-gold/40 px-5 py-2">
                  <span className="font-display text-[1.6rem] leading-none font-bold text-gold-light">2</span>
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white/70">days · 6 committees · 1 team</span>
                </div>
              </div>
              <ol className="grid grid-cols-2 gap-3 max-[640px]:gap-2.5">
                {COMMITTEES.map((c, i) => (
                  <li key={c} className="flex items-center gap-4 rounded-xl border border-white/8 bg-paper/60 px-5 py-4 transition-colors hover:border-gold/60 max-[640px]:px-3.5 max-[640px]:py-3">
                    <span className="font-display text-[1.9rem] leading-none font-bold text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[1.15rem] leading-tight font-semibold text-fg max-[640px]:text-[1rem]">{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 10 Mar — Investiture: the Council, two equal addresses, then the order of ceremony */}
        <section className={section} id="investiture">
          <div className="text-center">
            <Eyebrow>10 March 2026 · Central Campus</Eyebrow>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-tight font-bold text-fg">USC Investiture Ceremony</h2>
            <p className="mx-auto mt-3 max-w-[680px] text-base font-light leading-[1.65] text-text-secondary">
              The 2026–27 University Student Council was formally invested — members took their oath of office and stepped up to
              represent every Christite for the year ahead.
            </p>
          </div>
          <figure className="mt-8">
            <Shot photo={INVESTITURE.stage} className="aspect-[16/8] rounded-[22px] shadow-[0_40px_80px_-40px_rgba(37,59,129,0.7)] max-[640px]:aspect-[4/3]" imgClass="object-[50%_68%]" />
            <figcaption className="mt-3 text-center text-[0.82rem] font-light text-text-muted">
              The 2026–27 Council with the Vice-Chancellor, the Director and faculty
            </figcaption>
          </figure>
          {/* The Vice-Chancellor and the Director, given equal weight */}
          <div className="mt-8 grid grid-cols-2 gap-5 max-[640px]:grid-cols-1 max-[640px]:gap-4">
            {[
              { photo: INVESTITURE.vc, name: "Rev Col Fr Dr Jose CC", role: "Vice-Chancellor, CHRIST (Deemed to be University)", pos: "object-[52%_40%]" },
              { photo: INVESTITURE.director, name: "Dr Kishore Selva Babu", role: "Director, University Student Council", pos: "object-[50%_30%]" },
            ].map((s) => (
              <figure key={s.name} className="overflow-hidden rounded-[18px] border border-gold/30 bg-card shadow-[0_30px_60px_-34px_rgba(0,0,0,0.9)]">
                <Shot photo={s.photo} className="aspect-[5/4] rounded-none" imgClass={s.pos} />
                <figcaption className="flex items-center gap-4 border-t border-gold/25 px-6 py-4 max-[640px]:px-4.5">
                  <span className="h-9 w-[3px] shrink-0 rounded-full bg-gold-light" aria-hidden="true" />
                  <span>
                    <span className="block font-display text-[1.35rem] leading-tight font-semibold text-fg">{s.name}</span>
                    <span className="block text-[0.78rem] text-gold-light">{s.role}</span>
                  </span>
                  <span className="ml-auto text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/40 max-[640px]:hidden">Address</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {/* Order of ceremony */}
          <ol className="mt-5 grid grid-cols-3 gap-5 max-[640px]:grid-cols-1 max-[640px]:gap-4">
            {[
              { photo: INVESTITURE.oath, n: "I", label: "The oath of office" },
              { photo: INVESTITURE.flag, n: "II", label: "The University flag" },
              { photo: INVESTITURE.certificates, n: "III", label: "Certificates of office" },
            ].map((m) => (
              <li key={m.n}>
                <Shot photo={m.photo} className="aspect-[4/3]" />
                <div className="mt-3 flex items-baseline gap-3 border-t border-line pt-3">
                  <span className="font-display text-[1.1rem] font-bold text-gold/80">{m.n}</span>
                  <span className="font-display text-[1.1rem] font-semibold text-fg">{m.label}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 2 Mar — Gratitude Day: a thank-you note, the whole quad, then the song's moments set on a stave */}
        <section className={`${section} ${hand.variable}`} id="gratitude-day" style={handVar}>
          <div className="grid grid-cols-[1fr_1.35fr] items-stretch gap-8 max-[1080px]:grid-cols-1 max-[1080px]:gap-6">
            <div className="flex flex-col">
              <Heading date="2 March 2026 · Central Campus" title="Gratitude Day">
                Every March, the Council thanks the people who keep the University running — security, housekeeping, gardening and
                administration staff — ending with Gratitude Day, when the Council and the University Choir sing the Gratitude Day
                song.
              </Heading>
              <div className="mt-7 -rotate-[1.5deg] rounded-[6px] bg-[#f4f1ea] px-7 py-6 text-[#2a2620] shadow-[0_22px_40px_-16px_rgba(0,0,0,0.8)] max-[1080px]:mx-2 max-[640px]:px-5">
                <p className="font-hand text-[1.7rem] leading-[1.15] max-[640px]:text-[1.4rem]">
                  Thank you — for the early mornings, the clean corridors, the safe gates and the gardens in bloom.
                </p>
                <p className="mt-3 text-right font-hand text-[1.15rem] text-[#7a5b1c]">— the University Student Council</p>
              </div>
            </div>
            <Shot photo={GRATITUDE.quad} className="min-h-[420px] rounded-[22px] max-[1080px]:aspect-[4/3] max-[1080px]:min-h-0" imgClass="object-[50%_60%]" />
          </div>
          {/* Five stave lines run behind the photos, which rise and fall like notes */}
          <div className="relative mt-10 min-[1081px]:pb-10 max-[1080px]:mt-7">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 h-[120px] -translate-y-1/2 opacity-70 max-[1080px]:hidden"
              style={{ background: "repeating-linear-gradient(180deg, rgba(184,146,58,0.35) 0 1px, transparent 1px 30px)" }}
              aria-hidden="true"
            />
            <ol className="relative grid grid-cols-6 items-start gap-4 max-[1080px]:grid-cols-3 max-[640px]:grid-cols-2 max-[640px]:gap-2.5">
              {[
                { p: GRATITUDE.staff, cap: "The ones we thank", lift: "min-[1081px]:translate-y-8" },
                { p: GRATITUDE.choir, cap: "The University Choir", lift: "min-[1081px]:-translate-y-2" },
                { p: GRATITUDE.singer, cap: "Leading the song", lift: "min-[1081px]:translate-y-10", pos: "object-[50%_30%]" },
                { p: GRATITUDE.vc, cap: "The Vice-Chancellor", lift: "min-[1081px]:translate-y-0", pos: "object-[40%_40%]" },
                { p: GRATITUDE.drums, cap: "Keeping time", lift: "min-[1081px]:translate-y-9" },
                { p: GRATITUDE.staffCouncil, cap: "Side by side", lift: "min-[1081px]:-translate-y-1" },
              ].map(({ p, cap, lift, pos }) => (
                <li key={p.src} className={lift}>
                  <Shot photo={p} className="aspect-[3/4] rounded-[14px] border border-gold/25 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]" imgClass={pos ?? ""} />
                  <p className="mt-2 font-hand text-[1.05rem] leading-tight text-gold-light">♪ {cap}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Standing initiative */}
        <section>
          <Eyebrow>Standing initiative</Eyebrow>
          <H2>Built by the Council</H2>
          <div className="mt-7 rounded-card-md border border-line bg-card px-8 py-7 text-white max-[640px]:px-5 max-[640px]:py-5">
            <span className="mb-3 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-light">Infrastructure</span>
            <h3 className="mb-2 font-display text-[1.75rem] leading-tight font-semibold max-[640px]:text-[1.4rem]">The Sky Walk</h3>
            <p className="mb-3.5 max-w-[860px] text-[0.94rem] leading-[1.6] font-light text-white/72">{SKY_WALK}</p>
            <div className="text-[0.74rem] font-medium text-white/50">Standing initiative</div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
