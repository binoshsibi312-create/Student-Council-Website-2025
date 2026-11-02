import type { Metadata } from "next";
import type { ReactNode } from "react";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import { ButtonLink, Chip, Eyebrow, H2, Img } from "@/components/daksh/ui";
import { DAKSH, PHOTOS, TEACHERS_DAY, type Photo } from "@/lib/daksh";

export const metadata: Metadata = { title: "Events | University Student Council" };

const ev = (name: string, alt: string, width = 1600, height = 1200): Photo => ({ src: `/images/events/2026/${name}.jpg`, alt, width, height });

const GRATITUDE = {
  staffAvenue: ev("gratitude-day/staff-avenue", "Support staff lined up along the bamboo avenue with students on Gratitude Day"),
  staffFaces: ev("gratitude-day/staff-faces", "Housekeeping staff listening during the Gratitude Day celebration"),
  courtyard: ev("gratitude-day/courtyard", "Students and staff filling the courtyard for Gratitude Day"),
  choir: ev("gratitude-day/choir", "The University Choir singing the Gratitude Day song", 1200, 1600),
  choirSteps: ev("gratitude-day/choir-steps", "The choir on the Central Block steps"),
  address: ev("gratitude-day/address", "A councillor addressing the gathering"),
};
const INVESTITURE = {
  stage: ev("investiture/council-stage", "The 2026–27 University Student Council on stage at the Investiture Ceremony", 1600, 1066),
  certificates: ev("investiture/certificates", "Councillors receiving their certificates on stage"),
  address: ev("investiture/address", "An address from the podium at the Investiture Ceremony"),
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
  response: ev("vc-open-forum/response", "A question being answered from the panel", 1600, 1067),
  hall: ev("vc-open-forum/hall", "The packed hall at the open forum", 1600, 1067),
  question: ev("vc-open-forum/question", "A councillor reading out a question", 1212, 1600),
  panel: ev("vc-open-forum/panel", "Panel members in discussion", 1600, 1067),
  studentQuestion: ev("vc-open-forum/student-question", "A student putting a question to the panel", 1600, 1067),
};
const BHASHA = ev("bhasha-utsav", "The University Student Council in ethnic wear on the Central Block steps at Bhasha Utsav", 1280, 720);

const [soloDance, ensembleDance, band, felicitation, teachersAudience] = TEACHERS_DAY.photos;

/** Latest first; drives the date ribbon at the top. */
const INDEX = [
  { id: "vc-open-forum", date: "22 Sep", title: "Open Forum" },
  { id: "ploggathon", date: "19–20 Sep", title: "Ploggathon" },
  { id: "bhasha-utsav", date: "12 Sep", title: "Bhasha Utsav" },
  { id: "teachers-day", date: "5 Sep", title: "Teachers’ Day" },
  { id: "gb-meeting", date: "27 Aug", title: "General Body Meeting" },
  { id: "ltp", date: "8–9 Jul", title: "Leadership Training" },
  { id: "investiture", date: "10 Mar", title: "Investiture" },
  { id: "gratitude-day", date: "2 Mar", title: "Gratitude Day" },
];

const COMMITTEES = ["Logistics", "Events", "Promotions", "IT & Website", "Documentation", "Design"];

/** Languages heard on campus at Bhasha Utsav, each in its own script. */
const SCRIPTS = ["ಕನ್ನಡ", "हिन्दी", "தமிழ்", "മലയാളം", "తెలుగు", "বাংলা", "मराठी", "ગુજરાતી", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ", "অসমীয়া", "English"];

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
        <section className="relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[22px] px-12 py-11 max-[1080px]:px-8 max-[640px]:min-h-[440px] max-[640px]:px-5 max-[640px]:py-6">
          <Img photo={PHOTOS.entranceArch} className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div
            className="absolute inset-0 -z-10 max-[640px]:hidden"
            style={{ background: "linear-gradient(90deg, rgba(9,9,10,0.94) 0%, rgba(9,9,10,0.55) 60%, rgba(9,9,10,0.1) 100%)" }}
          />
          <div className="absolute inset-0 -z-10 hidden max-[640px]:block" style={{ background: "linear-gradient(180deg, rgba(9,9,10,0.1) 0%, rgba(9,9,10,0.95) 100%)" }} />
          <div>
            <Chip accent>Flagship event · Coming up</Chip>
          </div>
          <h2 className="mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] font-bold leading-none text-fg">Daksh 2026</h2>
          <p className="mt-2.5 font-display text-[clamp(1.15rem,2vw,1.5rem)] font-semibold italic text-gold-light">
            Education &amp; Career Guidance Fair · {DAKSH.dates.replace(" 2026", "")}
          </p>
          <p className="mt-2.5 max-w-[560px] text-base font-light leading-[1.6] text-[#e8e6e0] max-[640px]:hidden">
            Department stalls, career counselling, the Trailblaze competitions and the University Open Day — all at{" "}
            {DAKSH.venue}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 max-[640px]:flex-col">
            <ButtonLink href="/">Explore Daksh →</ButtonLink>
            <ButtonLink href="/trailblaze" primary={false}>
              Trailblaze competitions
            </ButtonLink>
          </div>
        </section>

        {/* Date ribbon — the year at a glance, latest first; each stop jumps to its section */}
        <nav aria-label="2026 events" className="-mx-1 overflow-x-auto pb-2">
          <ol className="relative flex min-w-full gap-0 px-1">
            <span className="absolute top-[7px] right-4 left-4 h-px bg-gradient-to-r from-gold via-gold/40 to-line" aria-hidden="true" />
            {INDEX.map((e, i) => (
              <li key={e.id} className="relative min-w-[118px] flex-1 pr-4">
                <a href={`#${e.id}`} className="group block no-underline">
                  <span
                    className={`relative z-10 block h-[15px] w-[15px] rounded-full border-2 ${i === 0 ? "border-gold bg-gold shadow-[0_0_0_5px_rgba(184,146,58,0.18)]" : "border-gold/70 bg-paper group-hover:bg-gold"} transition-colors`}
                  />
                  <span className="mt-3 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold-light">{e.date}</span>
                  <span className="mt-1 block font-display text-[1.08rem] font-semibold leading-tight text-fg group-hover:text-gold-light">{e.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

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
            <Shot photo={VC_FORUM.response} className="h-full max-[1080px]:aspect-[4/3.4]" />
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

        {/* 12 Sep — Bhasha Utsav: cinematic, with a ribbon of scripts */}
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
          <div className="relative mt-4 overflow-hidden rounded-xl border border-gold/25 bg-[linear-gradient(90deg,rgba(184,146,58,0.12),rgba(184,146,58,0.04))] py-3.5">
            <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 font-display text-[1.5rem] text-gold-light/90 motion-reduce:animate-none">
              {[...SCRIPTS, ...SCRIPTS].map((s, i) => (
                <span key={i} className="whitespace-nowrap" aria-hidden={i >= SCRIPTS.length}>
                  {s} <span className="ml-10 text-gold/40">✦</span>
                </span>
              ))}
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

        {/* 10 Mar — Investiture: the stage, then arch-framed moments */}
        <section className={section} id="investiture">
          <div className="text-center">
            <Eyebrow>10 March 2026 · Central Campus</Eyebrow>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-tight font-bold text-fg">USC Investiture Ceremony</h2>
            <p className="mx-auto mt-3 max-w-[680px] text-base font-light leading-[1.65] text-text-secondary">
              The 2026–27 University Student Council was formally invested — members took their oath of office and stepped up to
              represent every Christite for the year ahead.
            </p>
          </div>
          <Shot photo={INVESTITURE.stage} className="mt-8 aspect-[21/9] rounded-[22px] shadow-[0_40px_80px_-40px_rgba(37,59,129,0.7)] max-[640px]:aspect-[4/3]" />
          {/* Arches flank the Director, who stands taller in the centre */}
          <div className="mt-5 grid grid-cols-[1fr_1fr_1.3fr_1fr_1fr] items-end gap-3.5 max-[640px]:grid-cols-2 max-[640px]:gap-2.5">
            {[INVESTITURE.oath, INVESTITURE.flag].map((p) => (
              <Shot key={p.src} photo={p} className="aspect-[3/4] rounded-t-full rounded-b-xl border border-gold/25" />
            ))}
            <figure className="relative max-[640px]:order-first max-[640px]:col-span-2">
              <Shot
                photo={INVESTITURE.director}
                className="aspect-[3/4.3] rounded-t-full rounded-b-xl border-2 border-gold/70 shadow-[0_0_0_6px_rgba(184,146,58,0.12),0_30px_60px_-30px_rgba(0,0,0,0.9)] max-[640px]:aspect-[4/3.6]"
                imgClass="object-[50%_30%]"
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-lg border border-white/10 bg-ink/75 px-3.5 py-2.5 text-center backdrop-blur-md">
                <span className="block font-display text-[1.02rem] leading-tight font-semibold text-fg">Dr Kishore Selva Babu</span>
                <span className="block text-[0.7rem] text-gold-light">Director, University Student Council</span>
              </figcaption>
            </figure>
            {[INVESTITURE.certificates, INVESTITURE.address].map((p) => (
              <Shot key={p.src} photo={p} className="aspect-[3/4] rounded-t-full rounded-b-xl border border-gold/25" />
            ))}
          </div>
        </section>

        {/* 2 Mar — Gratitude Day: a scrapbook */}
        <section className={section} id="gratitude-day">
          <div className="grid grid-cols-[1.15fr_1fr] items-center gap-10 max-[1080px]:grid-cols-1">
            <div>
              <Heading date="2 March 2026 · Central Campus" title="Gratitude Day">
                Every March, the Council thanks the people who keep the University running — security, housekeeping, gardening and
                administration staff — ending with Gratitude Day, when the Council and the University Choir sing the Gratitude Day
                song.
              </Heading>
              <Shot photo={GRATITUDE.staffAvenue} className="mt-7 aspect-[4/3]" />
            </div>
            <div className="relative h-[560px] max-[1080px]:h-[520px] max-[640px]:h-[440px]">
              {[
                { p: GRATITUDE.choir, cls: "left-[4%] top-0 w-[46%] -rotate-[4deg]", cap: "The Gratitude Day song", aspect: "aspect-[3/4]" },
                { p: GRATITUDE.staffFaces, cls: "right-[2%] top-[6%] w-[50%] rotate-[3deg]", cap: "Thank you, every day" },
                { p: GRATITUDE.choirSteps, cls: "left-[10%] bottom-[2%] w-[52%] rotate-[2deg]", cap: "On the Central Block steps" },
                { p: GRATITUDE.courtyard, cls: "right-0 bottom-[10%] w-[44%] -rotate-[3deg]", cap: "The whole campus, together" },
              ].map(({ p, cls, cap, aspect }) => (
                <figure
                  key={p.src}
                  className={`absolute rounded-[4px] bg-[#f4f1ea] p-2.5 pb-3 shadow-[0_18px_34px_-10px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.04] ${cls}`}
                >
                  <Img photo={p} className={`w-full rounded-[2px] object-cover ${aspect ?? "aspect-[4/3]"}`} />
                  <figcaption className="mt-1.5 font-display text-[0.98rem] leading-tight font-semibold italic text-[#2a2620] max-[640px]:text-[0.78rem]">{cap}</figcaption>
                </figure>
              ))}
            </div>
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
