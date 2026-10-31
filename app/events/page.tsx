import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/SectionHeader";
import { ButtonLink, Chip, Eyebrow, H2, Img } from "@/components/daksh/ui";
import { DAKSH, PHOTOS, TEACHERS_DAY } from "@/lib/daksh";

export const metadata: Metadata = { title: "Events | University Student Council" };

const EVENTS = [
  { tag: "Flagship Event", title: "Daksh — Annual Education Fair", date: DAKSH.dates, body: "CHRIST's flagship career fair — departments showcase programmes, eminent personalities host career dialogues, and the Council-built Accord app (2018–19) makes registration paperless and tracks student interest." },
  { tag: "Student Welfare", title: "Gratitude Week & Gratitude Day", date: "March", body: "Every March, the Council organises a week of appreciation for Security, Housekeeping, Gardeners and Administration staff — concluding with Gratitude Day, when the Council and University Choir sing the Gratitude Day song." },
  { tag: "Heritage", title: "Bhasha Utsav & Ethnic Day", date: "September, across all campuses", body: "The only festival that brings together all Christites — the Council leads the opening procession in ethnic attire, celebrating the University's cultural diversity." },
  { tag: "Appreciation", title: "Teachers Day", date: "5 September", body: "On 5th September, the Council partners with the Student Welfare Office to present every teaching faculty member with a token of appreciation and respect." },
  { tag: "Infrastructure", title: "The Sky Walk", date: "Standing initiative", body: "Proposed by the University Student Council and approved by the University and regulatory authorities, the Sky Walk eases student movement and pedestrian safety — proof that a small idea can have a lasting campus-wide impact." },
  { tag: "Digital Tool", title: "CHRIST Programmes App", date: "Available for Android", body: "The official Android app showcasing every CHRIST programme — segregated by level and campus, with push alerts, keyword search, bookmarking and one-tap contact." },
];

const DAKSH_2025 = [
  { photo: PHOTOS.lampLighting, caption: "Lighting the lamp" },
  { photo: PHOTOS.crowdLane, caption: "The stall avenue" },
  { photo: PHOTOS.choir, caption: "University choir" },
  { photo: PHOTOS.openDaySign, caption: "Open Day welcome" },
];

const [soloDance, ensembleDance, band, felicitation, teachersAudience] = TEACHERS_DAY.photos;

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

        {/* Teachers' Day — Gurubhyo Namaha 2026 */}
        <section>
          <Eyebrow>Teachers’ Day · 5 September</Eyebrow>
          <H2>{TEACHERS_DAY.title}</H2>
          <p className="mt-3 max-w-[760px] text-base font-light leading-[1.65] text-text-secondary">
            Every Teachers’ Day, the Council partners with the Student Welfare Office to honour every teaching faculty member
            with a token of appreciation — and a celebration of song, dance and gratitude.
          </p>
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

        {/* Traditions */}
        <section>
          <Eyebrow>Every year</Eyebrow>
          <H2>Traditions we keep</H2>
          <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5 max-[640px]:gap-3">
            {EVENTS.map((e) => (
              <div className="rounded-card-md border border-line bg-card p-7 text-white max-[640px]:p-5" key={e.title}>
                <span className="mb-3 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-light">{e.tag}</span>
                <h3 className="mb-2 font-display text-[1.12rem] font-semibold">{e.title}</h3>
                <p className="mb-3.5 text-[0.84rem] font-light leading-[1.6] text-white/72">{e.body}</p>
                <div className="text-[0.74rem] font-medium text-white/50">{e.date}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
