import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import { ButtonLink, Chip, Eyebrow, H2, Img } from "@/components/daksh/ui";
import { DAKSH, PHOTOS, TEACHERS_DAY, type Photo } from "@/lib/daksh";

export const metadata: Metadata = { title: "Events | University Student Council" };

/** Six photos in the Teachers' Day mosaic order: lead, two beneath it, one tall, two stacked. */
type Mosaic = [lead: Photo, small1: Photo, small2: Photo, tall: Photo, stack1: Photo, stack2: Photo];

type TimelineEvent =
  | { kind: "gallery"; date: string; title: string; body: string; photos: Mosaic }
  | { kind: "photo"; date: string; title: string; body: string; photo: Photo; focus?: string }
  | { kind: "text"; date: string; title: string; body: string; note: string };

const ev = (name: string, alt: string, width: number, height: number): Photo => ({ src: `/images/events/2026/${name}.jpg`, alt, width, height });
const L = (set: string, name: string, alt: string): Photo => ev(`${set}/${name}`, alt, 1600, 1200);

const [soloDance, ensembleDance, band, felicitation, teachersAudience] = TEACHERS_DAY.photos;

/** 2026 at the Council, in date order. Text-only events get their photo galleries once the pictures are in. */
const TIMELINE: TimelineEvent[] = [
  {
    kind: "gallery",
    date: "2 March 2026 · Central Campus",
    title: "Gratitude Day",
    body: "Every March, the Council thanks the people who keep the University running — security, housekeeping, gardening and administration staff — ending with Gratitude Day, when the Council and the University Choir sing the Gratitude Day song.",
    photos: [
      L("gratitude-day", "staff-avenue", "Support staff lined up along the bamboo avenue with students on Gratitude Day"),
      L("gratitude-day", "staff-faces", "Housekeeping staff listening during the Gratitude Day celebration"),
      L("gratitude-day", "courtyard", "Students and staff filling the courtyard for Gratitude Day"),
      ev("gratitude-day/choir", "The University Choir singing the Gratitude Day song", 1200, 1600),
      L("gratitude-day", "choir-steps", "The choir on the Central Block steps"),
      L("gratitude-day", "address", "A councillor addressing the gathering"),
    ],
  },
  {
    kind: "gallery",
    date: "10 March 2026 · Central Campus",
    title: "USC Investiture Ceremony",
    body: "The 2026–27 University Student Council was formally invested — members took their oath of office and stepped up to represent every Christite for the year ahead.",
    photos: [
      ev("investiture/council-stage", "The 2026–27 University Student Council on stage at the Investiture Ceremony", 1600, 1066),
      L("investiture", "certificates", "Councillors receiving their certificates on stage"),
      L("investiture", "address", "An address from the podium at the Investiture Ceremony"),
      L("investiture", "oath", "Councillors taking the oath, hands on hearts"),
      L("investiture", "flag", "The University flag carried across the stage"),
      L("investiture", "oath-line", "Councillors reciting the oath of office"),
    ],
  },
  { kind: "text", date: "8–9 July 2026 · Yeshwanthpur Campus", title: "USC Leadership Training Program", body: "Two intensive days where the councillors came together to work, build and bond as the team leading the University this academic year — sharing initiatives and ideas, forming the six committees (Logistics, Events, Promotions, IT & Website, Documentation and Design) and choosing each committee’s point of contact.", note: "LTP · 2-day intensive" },
  {
    kind: "gallery",
    date: "27 August 2026 · Yeshwanthpur Campus",
    title: "USC General Body Meeting",
    body: "Every month the Council meets to take up the latest issues and concerns across campuses and schools, and each committee shares updates on its upcoming events and initiatives.",
    photos: [
      ev("gb-meeting/auditorium", "Councillors filling the auditorium for the General Body Meeting", 1600, 1067),
      ev("gb-meeting/presenting", "Two councillors presenting a committee update", 1600, 1067),
      ev("gb-meeting/listening", "Councillors listening to a presentation", 1600, 1067),
      ev("gb-meeting/at-the-mic", "Councillors raising a concern at the mic", 1067, 1600),
      ev("gb-meeting/from-the-floor", "A councillor speaking from the floor", 1600, 1067),
      ev("gb-meeting/speaker", "A councillor presenting at the podium", 1067, 1600),
    ],
  },
  {
    kind: "gallery",
    date: "5 September 2026 · Teachers’ Day",
    title: TEACHERS_DAY.title,
    body: "Every Teachers’ Day, the Council partners with the Student Welfare Office to honour every teaching faculty member with a token of appreciation — and a celebration of song, dance and gratitude.",
    photos: [TEACHERS_DAY.hero, felicitation, teachersAudience, soloDance, ensembleDance, band],
  },
  { kind: "photo", date: "12 September 2026 · Central Campus", title: "Bhasha Utsav 2026", body: "The one festival that brings every Christite together — the Council leads the opening procession in ethnic attire, celebrating the University’s many languages and cultures.", photo: ev("bhasha-utsav", "The University Student Council in ethnic wear on the Central Block steps at Bhasha Utsav", 1280, 720), focus: "object-[50%_35%]" },
  { kind: "text", date: "19 & 20 September 2026 · Bengaluru", title: "Ploggathon — Namma Bengaluru, Namma Mane", body: "A two-day plogging clean-up drive under the Namma Bengaluru, Namma Mane initiative — around the Town Hall area on 19 September and at Yediyur Lake on 20 September.", note: "Town Hall · Yediyur Lake" },
  {
    kind: "gallery",
    date: "22 September 2026 · Central Campus",
    title: "Open Forum with the Vice-Chancellor",
    body: "An open forum where students put their questions and concerns directly to the Vice-Chancellor, alongside the University Student Council.",
    photos: [
      ev("vc-open-forum/group", "The Vice-Chancellor, faculty and the University Student Council outside Block IV", 1600, 891),
      ev("vc-open-forum/response", "A question being answered from the panel", 1600, 1067),
      ev("vc-open-forum/hall", "The packed hall at the open forum", 1600, 1067),
      ev("vc-open-forum/question", "A councillor reading out a question", 1212, 1600),
      ev("vc-open-forum/panel", "Panel members in discussion", 1600, 1067),
      ev("vc-open-forum/student-question", "A student putting a question to the panel", 1600, 1067),
    ],
  },
];

/** The Teachers' Day photo mosaic, reused for every event gallery. */
function Gallery({ photos: [lead, small1, small2, tall, stack1, stack2] }: { photos: Mosaic }) {
  return (
    <div className="mt-7 grid grid-cols-[2.2fr_1fr_1fr] gap-3.5 max-[1080px]:grid-cols-2 max-[640px]:gap-2.5">
      <div className="grid grid-rows-[1.5fr_1fr] gap-3.5 max-[1080px]:col-span-2 max-[640px]:gap-2.5">
        <Img photo={lead} className="h-full w-full rounded-xl object-cover" />
        <div className="grid grid-cols-2 gap-3.5 max-[640px]:gap-2.5">
          <Img photo={small1} className="h-full w-full rounded-xl object-cover" />
          <Img photo={small2} className="h-full w-full rounded-xl object-cover" />
        </div>
      </div>
      <Img photo={tall} className="h-full w-full rounded-xl object-cover max-[1080px]:aspect-[3/4]" />
      <div className="grid grid-rows-2 gap-3.5 max-[640px]:gap-2.5">
        <Img photo={stack1} className="h-full w-full rounded-xl object-cover" />
        <Img photo={stack2} className="h-full w-full rounded-xl object-cover" />
      </div>
    </div>
  );
}

const SKY_WALK = {
  title: "The Sky Walk",
  body: "Proposed by the University Student Council and approved by the University and regulatory authorities, the Sky Walk eases student movement and pedestrian safety — proof that a small idea can have a lasting campus-wide impact.",
};

const DAKSH_2025 = [
  { photo: PHOTOS.lampLighting, caption: "Lighting the lamp" },
  { photo: PHOTOS.crowdLane, caption: "The stall avenue" },
  { photo: PHOTOS.choir, caption: "University choir" },
  { photo: PHOTOS.openDaySign, caption: "Open Day welcome" },
];

/** Text-only event, in the style of the Sky Walk card. */
function EventCard({ tag, title, body, note }: { tag: string; title: string; body: string; note: string }) {
  return (
    <section className="rounded-card-md border border-line bg-card px-8 py-7 text-white max-[640px]:px-5 max-[640px]:py-5">
      <span className="mb-3 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-light">{tag}</span>
      <h3 className="mb-2 font-display text-[1.75rem] font-semibold leading-tight max-[640px]:text-[1.4rem]">{title}</h3>
      <p className="mb-3.5 max-w-[860px] text-[0.94rem] font-light leading-[1.6] text-white/72">{body}</p>
      <div className="text-[0.74rem] font-medium text-white/50">{note}</div>
    </section>
  );
}

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

        {/* 2026 at the Council, in date order */}
        <div className="flex flex-col gap-[72px] max-[640px]:gap-12">
          <div>
            <Eyebrow>This year at the Council</Eyebrow>
            <H2>2026, event by event</H2>
            <p className="mt-3 max-w-[760px] text-base font-light leading-[1.65] text-text-secondary">
              From Gratitude Day in March to the Vice-Chancellor’s open forum in September — the moments that shaped the 2026–27
              University Student Council, in the order they happened.
            </p>
          </div>

          {TIMELINE.map((e) => {
            if (e.kind === "gallery")
              return (
                <section key={e.title}>
                  <Eyebrow>{e.date}</Eyebrow>
                  <H2>{e.title}</H2>
                  <p className="mt-3 max-w-[760px] text-base font-light leading-[1.65] text-text-secondary">{e.body}</p>
                  <Gallery photos={e.photos} />
                </section>
              );
            if (e.kind === "photo")
              return (
                <section key={e.title}>
                  <Eyebrow>{e.date}</Eyebrow>
                  <H2>{e.title}</H2>
                  <p className="mt-3 max-w-[760px] text-base font-light leading-[1.65] text-text-secondary">{e.body}</p>
                  <Img
                    photo={e.photo}
                    className={`mt-7 aspect-[1040/480] w-full rounded-xl object-cover max-[640px]:aspect-[4/3] ${e.focus ?? ""}`}
                  />
                </section>
              );
            return <EventCard key={e.title} tag={e.date} title={e.title} body={e.body} note={e.note} />;
          })}
        </div>

        {/* Daksh 2025 strip */}
        <section>
          <Eyebrow>Daksh 2025 · University Open Day</Eyebrow>
          <H2>Last November on campus</H2>
          <div className="mt-6 grid grid-cols-4 gap-3.5 max-[1080px]:grid-cols-2 max-[640px]:gap-2.5">
            {DAKSH_2025.map((p) => (
              <figure key={p.caption}>
                <Img photo={p.photo} className="aspect-[248/190] w-full rounded-xl object-cover" />
                <figcaption className="mt-2.5 font-display text-[1.06rem] font-semibold italic text-gold-light max-[640px]:text-[0.92rem]">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Standing initiative */}
        <section>
          <Eyebrow>Standing initiative</Eyebrow>
          <H2>Built by the Council</H2>
          <div className="mt-7">
            <EventCard tag="Infrastructure" title={SKY_WALK.title} body={SKY_WALK.body} note="Standing initiative" />
          </div>
        </section>
      </div>
    </Shell>
  );
}
