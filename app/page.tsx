import type { Metadata } from "next";
import ContactList from "@/components/ContactList";
import Shell from "@/components/Shell";
import DakshType from "@/components/daksh/DakshType";
import { Btn, Hand, Heading, KeyInfo, Kicker, Polaroid, Sparkle, WallPolaroid } from "@/components/daksh/kit";
import { DakshLogo, Img, Mascot } from "@/components/daksh/ui";
import { BRAND, CAMPUSES, COMPETITIONS, CONTACTS, DAKSH, OPEN_DAY, PHOTOS, SCHOOLS, SOCIALS, TRAILBLAZE, TRAILBLAZE_CONTACTS, WALL } from "@/lib/daksh";

export const metadata: Metadata = {
  title: "Daksh & Open Day 2026 | University Student Council",
  description: `Daksh & Open Day 2026 — CHRIST's Education & Career Guidance Fair and University Open Day, ${DAKSH.dates} at ${DAKSH.venue}.`,
};

const DEPARTMENT_COUNT = SCHOOLS.reduce((n, s) => n + s.departments.length, 0);

const STATS = [
  { value: "40,000+", label: "Students" },
  { value: "3,190+", label: "Teaching + admin staff" },
  { value: "166+", label: "UG, PG & doctoral programmes" },
  { value: "6", label: "Campuses across India" },
];

const AWAITS = [
  { photo: PHOTOS.festsClubsStall, title: "Department stalls", body: "Every school and department showcases its programmes, projects and student life.", short: "Every school showcases its programmes." },
  { photo: PHOTOS.stallDemo, title: "Career counselling", body: "Personalised guidance to match your interests to the right course and career.", short: "Guidance to find the right course." },
  { photo: PHOTOS.openDayParents, title: "University Open Day", body: "Explore the Central Campus and its facilities on the same two days.", short: "Explore the Central Campus and its facilities." },
  { photo: PHOTOS.nrityaGroup, title: "Trailblaze", body: `Seven competitions on the theme ${TRAILBLAZE.theme}.`, short: `Seven competitions — ${TRAILBLAZE.theme}.`, href: "/trailblaze" },
];

/** The schools split into three columns of roughly equal height (by index into SCHOOLS). */
const SCHOOL_COLUMNS = [
  [0, 4, 6],
  [1, 2, 3],
  [5, 7, 8],
];

const WALL_DESKTOP: [number, number] = [1040, 1500];
const WALL_MOBILE: [number, number] = [358, 1420];

function SchoolCard({ school, className = "" }: { school: (typeof SCHOOLS)[number]; className?: string }) {
  return (
    <div className={`flex flex-col gap-2.5 rounded-[16px] border border-line bg-paper-2 px-5 pt-[18px] pb-5 ${className}`}>
      <Heading as="h3" className="text-[18px] leading-[1.2]">
        {school.name}
      </Heading>
      <div className="h-px bg-gold/50" aria-hidden="true" />
      <ul className="text-[14px] leading-[1.5] text-text-secondary">
        {school.departments.map((dep) => (
          <li key={dep}>{dep}</li>
        ))}
      </ul>
    </div>
  );
}

export default function DakshPage() {
  return (
    <Shell>
      <DakshType>
        <div className="flex flex-col gap-[100px] max-[640px]:gap-14">
          {/* Hero — cropped to the crowd, with the Daksh wordmark */}
          <section className="relative isolate flex min-h-[620px] flex-col justify-end overflow-hidden rounded-[16px] p-14 max-[1080px]:px-9 max-[640px]:-mx-4.5 max-[640px]:-mt-8 max-[640px]:min-h-[440px] max-[640px]:rounded-none max-[640px]:px-5 max-[640px]:pb-8">
            <Img photo={PHOTOS.stallAvenue} eager className="absolute inset-0 -z-10 h-full w-full origin-bottom scale-[1.44] object-cover object-bottom" />
            <div
              className="absolute inset-0 -z-10"
              style={{ background: "linear-gradient(180deg, rgba(12,12,14,0) 35%, rgba(12,12,14,0.62) 68%, rgba(12,12,14,0.96) 100%)" }}
            />
            <Sparkle className="absolute top-12 right-14 h-[34px] w-[34px] text-gold-light max-[640px]:top-10 max-[640px]:right-10 max-[640px]:h-6 max-[640px]:w-6" />
            <Sparkle className="absolute top-[110px] right-[110px] h-[18px] w-[18px] text-white/80 max-[640px]:hidden" />
            <div className="flex flex-col gap-3.5 max-[640px]:gap-2.5">
              <p className="flex items-center gap-3.5 text-[17px] font-bold uppercase leading-[1.2] tracking-[0.22em] text-fg [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] max-[640px]:gap-2.5 max-[640px]:text-[11px] max-[640px]:tracking-[0.18em]">
                <span className="h-0.5 w-10 shrink-0 bg-gold-light max-[640px]:w-6" aria-hidden="true" />
                University Student Council presents
              </p>
              <h1 className="flex flex-col gap-2 max-[640px]:gap-1">
                <DakshLogo light className="w-[340px] max-[1080px]:w-[290px] max-[640px]:w-[170px]" />
                <span className="font-gilda text-[46px] leading-none text-fg uppercase [text-shadow:0_4px_24px_rgba(0,0,0,0.7)] max-[1080px]:text-[40px] max-[640px]:text-[25px]">
                  &amp; Open Day <span className="text-gold-light">2026</span>
                </span>
              </h1>
              <Heading as="p" className="text-[24px] leading-[1.2] max-[640px]:text-[16px]">
                Education &amp; Career Guidance Fair&nbsp; · &nbsp;University Open Day
              </Heading>
            </div>
          </section>

          <KeyInfo
            title="Be part of Daksh & Open Day 2026"
            tiles={[
              { label: "Where", value: DAKSH.venue, note: DAKSH.address },
              { label: "Online stalls", value: "Available", note: "Details will be shared shortly" },
              { label: `${CAMPUSES.length} campuses`, value: "One university", note: "Bangalore Central · Bannerghatta · Yeshwanthpur · Kengeri · Delhi NCR · Pune Lavasa" },
              { label: `${SCHOOLS.length} schools`, value: `${DEPARTMENT_COUNT} departments`, note: "Plus the University's centres and cells" },
            ]}
          >
            <Btn href={DAKSH.registerIndividuals} external>
              Daksh — Individuals
            </Btn>
            <Btn href={DAKSH.registerInstitutions} external variant="outline">
              Daksh — Institutions
            </Btn>
            <Btn href={DAKSH.registerOpenDay} external variant="outline">
              Open Day registration
            </Btn>
            <Btn href={DAKSH.brochure} download variant="outline">
              Brochure ↓
            </Btn>
          </KeyInfo>

          {/* What is Daksh */}
          <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-14 max-[1080px]:grid-cols-1 max-[1080px]:gap-10">
            <div className="flex flex-col items-start gap-3">
              <DakshLogo light className="w-[300px] max-[640px]:w-[230px]" />
              <Kicker>Annual Education and Career Guidance Fair</Kicker>
              <Heading className="text-[42px] max-[640px]:text-[30px]">Find your path at CHRIST</Heading>
              <p className="max-w-[605px] text-[19px] leading-[1.6] text-text-secondary max-[640px]:text-[16px]">
                <span className="max-[640px]:hidden">
                  Daksh is the annual Education and Career Guidance Fair hosted by the University Student Council. Every school and
                  department sets up its stall, students and faculty answer your questions face to face, and career dialogues and
                  personal counselling help you choose with confidence — for pre-university, undergraduate and postgraduate
                  students.
                </span>
                <span className="min-[641px]:hidden">
                  Every school and department sets up its stall, students and faculty answer your questions face to face, and career
                  dialogues and counselling help you choose with confidence.
                </span>
              </p>
              <Hand className="max-w-[460px] text-[26px] max-[640px]:text-[21px]">
                <span className="max-[640px]:hidden">Academics, admissions, placements and campus life — ask us anything!</span>
                <span className="min-[641px]:hidden">Ask us anything!</span>
              </Hand>
              <p className="flex items-center gap-2 rounded-[16px] border border-line py-2 pr-4 pl-3.5 text-[14px] leading-[1.5] text-text-secondary">
                <Sparkle className="h-3 w-3 text-gold-light" />
                <span>
                  Theme: <span className="text-fg">{DAKSH.theme}</span>
                </span>
              </p>
            </div>
            <Polaroid
              photo={PHOTOS.openDaySign}
              caption="Daksh & Open Day — see you in November!"
              tilt={3}
              className="w-[364px] max-[1080px]:mx-auto max-[640px]:hidden"
            />
          </section>

          {/* University Open Day — the badge, the brochure's invitation and what to explore */}
          <section aria-labelledby="open-day-title" className="relative isolate flex flex-col gap-7 overflow-hidden rounded-[16px] bg-[#16244a] p-12 max-[1080px]:px-8 max-[640px]:gap-5 max-[640px]:px-5 max-[640px]:py-7">
            <div className="absolute -top-[140px] -right-[120px] -z-10 h-[380px] w-[380px] rounded-full border-[28px] border-gold-light/12" aria-hidden="true" />
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] items-center gap-12 max-[1080px]:grid-cols-1 max-[1080px]:gap-8">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-5 max-[640px]:gap-4">
                  <img
                    src={BRAND.openDayLogo.src}
                    alt={BRAND.openDayLogo.alt}
                    width={BRAND.openDayLogo.width}
                    height={BRAND.openDayLogo.height}
                    loading="lazy"
                    className="w-[132px] shrink-0 drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] max-[640px]:w-[88px]"
                  />
                  <div className="flex flex-col gap-2">
                    <Kicker className="text-gold-light">In collaboration with the Open Day Team</Kicker>
                    <Heading className="text-[42px] max-[640px]:text-[28px]">
                      <span id="open-day-title">University Open Day</span>
                    </Heading>
                  </div>
                </div>
                <Hand className="text-[26px] max-[640px]:text-[21px]">Come see CHRIST University for yourself!</Hand>
                <p className="max-w-[560px] text-[18px] leading-[1.6] text-text-secondary max-[640px]:text-[16px]">{OPEN_DAY.summary}</p>
                <p className="max-w-[560px] text-[16px] leading-[1.6] text-text-secondary max-[640px]:hidden">{OPEN_DAY.more}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[16px] bg-gold px-4 pt-2.5 pb-2 text-[14px] font-bold leading-[1.4] text-ink">
                  <span>{DAKSH.dates}</span>
                  <span aria-hidden="true">·</span>
                  <span>{DAKSH.hours}</span>
                  <span aria-hidden="true">·</span>
                  <span>{DAKSH.venue}</span>
                </p>
              </div>
              <div className="grid h-[400px] grid-cols-[1fr_1.15fr] grid-rows-2 gap-3 max-[640px]:h-[300px] max-[640px]:gap-2">
                <Img photo={PHOTOS.openDayWalk} className="row-span-2 h-full w-full rounded-[14px] object-cover" />
                <Img photo={PHOTOS.openDayParents} className="h-full w-full rounded-[14px] object-cover" />
                <Img photo={PHOTOS.openDayStudents} className="h-full w-full rounded-[14px] object-cover" />
              </div>
            </div>
            <ul className="grid grid-cols-4 gap-3.5 max-[1080px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-2.5">
              {OPEN_DAY.highlights.map((h) => (
                <li key={h.title} className="flex flex-col gap-1.5 rounded-[14px] border border-white/12 bg-white/[0.05] px-5 pt-[18px] pb-5 max-[640px]:px-4 max-[640px]:py-3.5">
                  <span className="flex items-center gap-2">
                    <Sparkle className="h-3.5 w-3.5 text-gold-light" />
                    <span className="text-[16px] font-bold leading-[1.3] text-fg">{h.title}</span>
                  </span>
                  <span className="text-[14px] leading-[1.5] text-text-secondary">{h.body}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 border-t border-white/12 pt-6 max-[640px]:pt-5">
              <Kicker className="text-gold-light">Also explore · CHRIST online programmes</Kicker>
              {[
                { label: "Undergraduate", list: OPEN_DAY.online.ug },
                { label: "Postgraduate", list: OPEN_DAY.online.pg },
              ].map((g) => (
                <div key={g.label} className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 w-[120px] text-[13px] font-bold uppercase tracking-[0.12em] text-white/60 max-[640px]:w-full">{g.label}</span>
                  {g.list.map((p) => (
                    <span key={p} className="rounded-[11px] bg-white/10 px-3 pt-[6px] pb-[4px] text-[14px] leading-[1.5] text-fg">
                      {p}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Overview of CHRIST */}
          <section className="grid grid-cols-[minmax(0,632fr)_minmax(0,360fr)] gap-12 max-[1080px]:grid-cols-1">
            <div className="flex flex-col gap-4">
              <Heading className="text-[34px] max-[640px]:text-[28px]">
                Overview of
                <br />
                CHRIST (Deemed to be University)
              </Heading>
              <Kicker className="text-gold-dark max-[640px]:hidden">Premier educational institution with</Kicker>
              <div className="grid grid-cols-2 gap-3.5 max-[640px]:gap-2.5">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-[16px] bg-[#16244a] px-6 pt-5 pb-[18px] max-[640px]:px-4 max-[640px]:pt-4 max-[640px]:pb-3.5">
                    <div className="font-gilda text-[46px] leading-[1.05] text-gold-light max-[640px]:text-[32px]">{s.value}</div>
                    <div className="mt-0.5 text-[14px] font-bold uppercase leading-[1.3] text-fg max-[640px]:text-[11px]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 max-[640px]:hidden">
              <Heading as="p" className="text-[22px] leading-[1.2]">
                Presence across
              </Heading>
              <Heading as="p" className="text-[50px] leading-[1.05] tracking-normal">
                {CAMPUSES.length} campuses
              </Heading>
              <ul className="flex flex-col">
                {CAMPUSES.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 pt-1.5">
                    <Sparkle className="h-3 w-3 text-gold-light" />
                    <Heading as="p" className="text-[17px] leading-[1.2]">
                      {c} Campus
                    </Heading>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What awaits you */}
          <section className="flex flex-col gap-[22px]">
            <div className="flex flex-col gap-3">
              <Kicker>What awaits you</Kicker>
              <Heading className="text-[42px] max-[640px]:text-[30px]">Two days, the whole university</Heading>
            </div>
            <div className="grid grid-cols-4 gap-[18px] max-[1080px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
              {AWAITS.map((a) => {
                const Card = a.href ? "a" : "article";
                return (
                  <Card
                    key={a.title}
                    {...(a.href ? { href: a.href } : {})}
                    className="flex flex-col overflow-hidden rounded-[16px] border border-line bg-card no-underline transition-all duration-200 hover:-translate-y-1 hover:border-gold max-[640px]:flex-row max-[640px]:items-center max-[640px]:gap-3.5 max-[640px]:p-2.5"
                  >
                    <Img
                      photo={a.photo}
                      className="aspect-[245/170] w-full object-cover max-[640px]:aspect-auto max-[640px]:h-[78px] max-[640px]:w-24 max-[640px]:shrink-0 max-[640px]:rounded-[12px]"
                    />
                    <div className="flex flex-col gap-1.5 px-[18px] pt-4 pb-5 max-[640px]:gap-1 max-[640px]:p-0 max-[640px]:pr-2">
                      <h3 className="text-[17px] font-bold leading-[1.3] text-fg">{a.title}</h3>
                      <p className="text-[14px] leading-[1.5] text-text-secondary">
                        <span className="max-[640px]:hidden">{a.body}</span>
                        <span className="min-[641px]:hidden">{a.short}</span>
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* The Daksh Wall — polaroids pinned over the graffiti wall, on a scaled artboard */}
          <section aria-labelledby="wall-title" className="relative isolate overflow-hidden rounded-[16px] bg-paper">
            <img
              src={PHOTOS.graffitiWall.src}
              alt=""
              width={PHOTOS.graffitiWall.width}
              height={PHOTOS.graffitiWall.height}
              loading="lazy"
              decoding="async"
              className="absolute -top-[2.7%] -left-[3.85%] -z-10 h-[105.4%] w-[107.7%] max-w-none object-cover blur-[3px]"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{ background: "radial-gradient(ellipse at center, rgba(12,12,14,0.18) 0%, rgba(12,12,14,0.45) 70%, rgba(12,12,14,0.75) 100%)" }}
            />
            <div className="absolute inset-x-0 top-0 -z-10 h-[15.3%]" style={{ background: "linear-gradient(180deg, rgba(12,12,14,0.85), rgba(12,12,14,0))" }} />

            {[
              { board: WALL_DESKTOP, show: "max-[640px]:hidden", title: "left-[13.65%] top-[3.07%] w-[72.8%]", sizes: ["text-[max(10px,1.25cqi)]", "text-[6.15cqi]", "text-[2.4cqi]"], chip: "top-[94%] text-[max(11px,1.44cqi)]", photos: WALL.map((w) => ({ ...w, spot: w.desktop })), chipText: "Find them all at the stalls · 21–22 November" },
              { board: WALL_MOBILE, show: "min-[641px]:hidden", title: "left-[4.47%] top-[1.97%] w-[91%]", sizes: ["text-[3.07cqi]", "text-[9.5cqi]", "text-[5cqi]"], chip: "top-[95.1%] text-[3.6cqi]", photos: WALL.filter((w) => w.mobile).map((w) => ({ ...w, spot: w.mobile! })), chipText: "Find them at the stalls · 21–22 Nov" },
            ].map(({ board, show, title, sizes, chip, photos, chipText }, i) => (
              <div key={i} className={`@container relative ${show}`} style={{ aspectRatio: `${board[0]} / ${board[1]}` }}>
                <div className={`absolute flex flex-col items-center gap-[0.6cqi] text-center [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.6))] ${title}`}>
                  <Kicker className={`text-gold-light ${sizes[0]}`}>Daksh 2025 · Come see it live</Kicker>
                  <Heading as={i === 0 ? "h2" : "p"} className={`leading-[1.05] tracking-normal ${sizes[1]}`}>
                    <span id={i === 0 ? "wall-title" : undefined}>The Daksh Wall</span>
                  </Heading>
                  <Hand className={sizes[2]}>
                    Miniature cities, roaring engines, art {i === 0 ? "you can touch " : ""}— and ALDEN himself.
                  </Hand>
                </div>
                {photos.map((p) => (
                  <WallPolaroid key={p.caption} photo={p.photo} caption={p.caption} spot={p.spot} board={board} />
                ))}
                <p className={`absolute left-1/2 -translate-x-1/2 rounded-[16px] bg-gold px-[1.2em] pt-[0.8em] pb-[0.67em] font-bold leading-[1.2] tracking-[0.02em] whitespace-nowrap text-ink ${chip}`}>
                  {chipText}
                </p>
              </div>
            ))}
          </section>

          {/* Schools & departments */}
          <section className="flex flex-col gap-4">
            <Hand className="text-[28px] max-[640px]:text-[22px]">Every step in learning is a new step towards growth.</Hand>
            <div className="flex items-center gap-9 rounded-[16px] bg-[#16244a] pt-[26px] pb-6 pl-9 max-[640px]:pr-5 max-[640px]:pl-5">
              <div className="flex-1">
                <Heading className="text-[40px] max-[640px]:text-[26px]">Schools &amp; departments</Heading>
                <Heading as="p" className="text-[24px] leading-[1.2] max-[640px]:text-[16px]">
                  Across the university
                </Heading>
              </div>
              <div className="h-[3px] w-40 bg-gold-light max-[640px]:hidden" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-1.5 max-[1080px]:hidden">
              {SCHOOL_COLUMNS.map((col) => (
                <div key={col[0]} className="flex flex-col gap-4">
                  {col.map((idx, j) => (
                    <SchoolCard key={SCHOOLS[idx].name} school={SCHOOLS[idx]} className={j === col.length - 1 ? "flex-1" : ""} />
                  ))}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 min-[1081px]:hidden max-[640px]:grid-cols-1 max-[640px]:gap-3">
              {SCHOOLS.map((s) => (
                <SchoolCard key={s.name} school={s} />
              ))}
            </div>
          </section>

          {/* Trailblaze band — text bottom-left, button bottom-right */}
          <a
            href="/trailblaze"
            className="group relative isolate flex min-h-[300px] items-end justify-between gap-8 overflow-hidden rounded-[16px] p-12 no-underline max-[1080px]:px-8 max-[640px]:min-h-[244px] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:justify-end max-[640px]:gap-4 max-[640px]:p-5"
          >
            <Img photo={PHOTOS.nrityaGroup} className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div
              className="absolute inset-0 -z-10 max-[640px]:hidden"
              style={{ background: "linear-gradient(90deg, rgba(12,12,14,0.95) 0%, rgba(12,12,14,0.7) 60%, rgba(12,12,14,0.25) 100%)" }}
            />
            <div
              className="absolute inset-0 -z-10 min-[641px]:hidden"
              style={{ background: "linear-gradient(180deg, rgba(12,12,14,0.25) 0%, rgba(12,12,14,0.7) 55%, rgba(12,12,14,0.95) 100%)" }}
            />
            <div className="flex flex-col gap-3 max-[640px]:gap-2">
              <Kicker className="text-gold-light max-[640px]:text-[10px]">Trailblaze · {TRAILBLAZE.theme}</Kicker>
              <Heading className="text-[38px] max-[640px]:text-[26px]">{COMPETITIONS.length} competitions</Heading>
              <div className="flex flex-col gap-2 max-[640px]:hidden">
                {[COMPETITIONS.slice(0, 3), COMPETITIONS.slice(3)].map((row) => (
                  <ul key={row[0].name} className="flex flex-wrap gap-2">
                    {row.map((c) => (
                      <li key={c.name} className="rounded-[11px] bg-white/14 px-3 pt-[7px] pb-[5px] text-[14px] leading-[1.5] text-fg">
                        {c.short ?? c.name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center justify-center rounded-[16px] bg-gold px-6 pt-[15px] pb-[13px] text-[0.94rem] font-bold leading-[1.2] tracking-[0.02em] text-ink transition-colors group-hover:bg-gold-light">
              Enter Trailblaze →
            </span>
          </a>

          {/* Contact, with ALDEN */}
          <section className="relative isolate grid grid-cols-[210px_1fr] items-center gap-8 overflow-hidden rounded-[16px] border border-line bg-card px-9 py-12 max-[1080px]:grid-cols-1 max-[1080px]:justify-items-start max-[640px]:gap-5 max-[640px]:px-5 max-[640px]:py-6">
            <div className="absolute -bottom-[260px] -left-[160px] -z-10 h-[420px] w-[420px] rounded-full bg-gold/8" aria-hidden="true" />
            <Mascot className="w-[210px] rounded-[16px] max-[640px]:w-[130px]" />
            <div className="flex flex-col gap-2.5">
              <Heading className="text-[32px] max-[640px]:text-[24px]">In case of queries, contact us</Heading>
              <Hand className="text-[26px] max-[640px]:text-[20px]">ALDEN&apos;s got your back!</Hand>
              {[
                { label: "Daksh & Open Day", people: CONTACTS },
                { label: "Trailblaze competitions", people: TRAILBLAZE_CONTACTS.slice(0, 2) },
              ].map((g) => (
                <div key={g.label} className="flex flex-col gap-3 border-t border-line pt-4 first-of-type:mt-1">
                  <Kicker>{g.label}</Kicker>
                  <ContactList people={g.people} />
                </div>
              ))}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] leading-[1.5] text-fg">
                <a href={`mailto:${DAKSH.email}`} className="hover:text-gold-light">
                  {DAKSH.email}
                </a>
                {SOCIALS.map((s) => (
                  <a key={s.handle} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">
                    {s.handle}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </DakshType>
    </Shell>
  );
}
