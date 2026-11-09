// Daksh 2026, University Open Day and Trailblaze content.
// Sources: daksh.christuniversity.in and the Daksh 2026 | University Open Day
// and Trailblaze competition brochures (public/docs, November 2026 editions).
// Photos are from Daksh 2025 / Open Day.

export const DAKSH = {
  dates: "21–22 November 2026",
  days: "Saturday & Sunday",
  /** Start/end of the fair in IST, used by the countdown. */
  startsAt: "2026-11-21T09:00:00+05:30",
  endsAt: "2026-11-22T17:00:00+05:30",
  venue: "Bangalore Central Campus",
  address: "Hosur Road, Bengaluru 560029",
  hours: "9:00 AM – 5:00 PM",
  email: "daksh@christuniversity.in",
  site: "https://daksh.christuniversity.in",
  /** One Google Apps Script form handles individual, institution and Open Day registrations. */
  registerIndividuals: "https://script.google.com/a/macros/christuniversity.in/s/AKfycbxUlcTnmZBPihXIGJ1M3ysXmQjacCubeDmQrufU9P5yREwU0jl3ZxOj0i7kDeySOEg/exec",
  registerInstitutions: "https://script.google.com/a/macros/christuniversity.in/s/AKfycbxUlcTnmZBPihXIGJ1M3ysXmQjacCubeDmQrufU9P5yREwU0jl3ZxOj0i7kDeySOEg/exec",
  registerOpenDay: "https://script.google.com/a/macros/christuniversity.in/s/AKfycbxUlcTnmZBPihXIGJ1M3ysXmQjacCubeDmQrufU9P5yREwU0jl3ZxOj0i7kDeySOEg/exec",
  brochure: "/docs/daksh-2026-open-day-brochure.pdf",
  theme: "Imprints of Innovation: Past, Present and Future",
};

export const BRAND = {
  logo: { src: "/images/daksh/brand/daksh-logo.png", alt: "Daksh", width: 559, height: 214 },
  /** White wordmark for dark backgrounds. */
  logoLight: { src: "/images/daksh/brand/daksh-logo-light.png", alt: "Daksh", width: 1228, height: 370 },
  emblem: { src: "/images/daksh/brand/daksh-emblem.png", alt: "", width: 600, height: 743 },
  openDayLogo: { src: "/images/daksh/brand/open-day-logo.png", alt: "University Open Day 2026–27 badge", width: 480, height: 480 },
  mascot: { src: "/images/daksh/brand/alden-mascot.jpg", alt: "Alden, the Daksh owl mascot, giving a thumbs up from a laptop", width: 700, height: 681 },
};

export interface Contact {
  name: string;
  email: string;
  phone: string;
  tel: string;
}

const contact = (name: string, email: string, phone: string): Contact => ({ name, email, phone, tel: phone.replace(/\s/g, "") });

/** Daksh & Open Day brochure: "Contact us". */
export const CONTACTS: Contact[] = [
  contact("Amrutha Bhavani Sundar", "amrutha.bhavani@bcomfah.christuniversity.in", "+91 90223 38984"),
  contact("Malcolm Jeson", "malcolm.jeson@msie.christuniversity.in", "+91 63633 37126"),
  contact("Gauri V Nair", "gauri.nair@bcomfah.christuniversity.in", "+91 90725 57561"),
  contact("Ramisha R", "ramisha.r@bscbbh.christuniversity.in", "+91 70126 69229"),
];

/** Trailblaze brochure: "In case of queries, contact us". */
export const TRAILBLAZE_CONTACTS: Contact[] = [
  contact("Aiswarya Jelt", "aiswarya.jelt@law.christuniversity.in", "+91 70121 35057"),
  contact("Avinash Ashok", "avinash.ashok@bcomsfh.christuniversity.in", "+91 85537 71953"),
  contact("Devika Menon", "devika.menon@christuniversity.in", "+91 88847 32513"),
  contact("Dr Suja Mol John", "suja.john@christuniversity.in", "+91 98455 99589"),
  contact("Dr Naveen Kumara R", "naveenkumara.r@christuniversity.in", "+91 77950 95065"),
];

export const SOCIALS = [
  { handle: "@christ_studentcouncil.bcc", href: "https://www.instagram.com/christ_studentcouncil.bcc/" },
  { handle: "@swo_centralcampus", href: "https://www.instagram.com/swo_centralcampus/" },
];

export const CAMPUSES = ["Bangalore Central", "Bangalore Bannerghatta", "Bangalore Yeshwanthpur", "Bangalore Kengeri", "Delhi NCR", "Pune Lavasa"];

export const UNIVERSITY_STATS = [
  { value: "40,000+", label: "Students" },
  { value: "3,190+", label: "Teaching & admin staff" },
  { value: "166+", label: "UG, PG & doctoral programmes" },
  { value: "6", label: "Campuses" },
];

export const OPEN_DAY = {
  title: "University Open Day",
  summary:
    "Step into the world of possibilities at CHRIST (Deemed to be University) through Open Day! Explore the campus through guided tours of its modern classrooms, state-of-the-art laboratories and collaborative learning spaces.",
  more: "Experience the vibrant academic environment and discover the facilities that inspire learning, innovation and growth — while envisioning yourself as part of a thriving university community.",
  partner: "Presented by the University Student Council in collaboration with the Open Day Team.",
  highlights: [
    { title: "Guided campus tours", body: "Walk the Central Campus and see everyday life at CHRIST for yourself." },
    { title: "Modern classrooms", body: "See where lectures, seminars and discussions happen every day." },
    { title: "State-of-the-art laboratories", body: "Step inside the labs where projects and research come to life." },
    { title: "Collaborative learning spaces", body: "Find the spaces where students learn, build and create together." },
  ],
  /** Online programmes listed alongside Open Day in the brochure. */
  online: {
    ug: ["BBA", "BCom", "BCA"],
    pg: ["MCom", "MA (Applied Economics)", "MA (English with Communication Studies)", "MCA", "MSc (AI and Machine Learning)", "MSc (Data Science)"],
  },
};

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const d = (name: string, alt: string, width: number, height: number): Photo => ({ src: `/images/daksh/${name}.jpg`, alt, width, height });
const td = (name: string, alt: string, width: number, height: number): Photo => ({ src: `/images/events/teachers-day/${name}.jpg`, alt, width, height });

export const PHOTOS = {
  stallAvenue: d("stall-avenue", "Crowds of visitors walking the bamboo-lined avenue of Daksh stalls", 1800, 1200),
  entranceArch: d("entrance-arch", "Guests at the Daksh 2025 University Open Day entrance arch", 1600, 1067),
  openDaySign: d("open-day-sign", "The 'Open Day & Daksh '25' sign at the Central Campus", 1200, 776),
  openDayWalk: d("open-day-walk", "Students walking through the green Central Campus", 765, 973),
  openDayStudents: d("open-day-students", "Students working together outdoors on campus", 740, 585),
  mascotVisitors: d("mascot-visitors", "The Daksh owl mascot with a group of school visitors", 1000, 667),
  mascotStudents: d("mascot-students", "Students posing with the Daksh owl mascot", 1000, 872),
  festsClubsStall: d("fests-clubs-stall", "A colourful department stall on fests and clubs", 1000, 652),
  docMuseum: d("doc-museum", "The 'Welcome to DOC Museum' stall display", 1000, 667),
  droneExhibit: d("drone-exhibit", "A student-built drone on display", 1000, 667),
  nccDemo: d("ncc-demo", "NCC cadets showing visitors their equipment", 1000, 667),
  councilVolunteers: d("council-volunteers", "Student Council members hosting Daksh", 1000, 1500),
  stallTeam: d("stall-team", "A stall team of students in blazers", 1000, 780),
  performingArtsStall: d("performing-arts-stall", "A visitor with face paint at the performing arts stall", 1000, 596),
  stallDemo: d("stall-demo", "Students explaining their programme to visitors at a stall", 1000, 667),
  dancePerformance: d("dance-performance", "Classical dancers performing at the opening ceremony", 1000, 667),
  crowdLane: d("crowd-lane", "The stall avenue packed with visitors", 1200, 800),
  lampLighting: d("lamp-lighting", "Lighting the lamp at the opening ceremony", 1200, 961),
  choir: d("choir", "The university choir performing", 1200, 758),
  openDayParents: d("open-day-parents", "Parents and students touring a department on Open Day", 900, 536),
  nrityaGroup: d("nritya-group", "A classical dance troupe performing on stage", 1200, 829),
  graffitiWall: d("graffiti-wall", "", 1200, 1221),
  trailblazeBanner: d("trailblaze-banner", "Dancers performing under a warm stage spotlight", 2560, 1280),
  trailblazeBannerMobile: d("trailblaze-banner-mobile", "Dancers performing under a warm stage spotlight", 1170, 1170),
};

/** Where a polaroid sits on the Daksh Wall artboard: x/y/width in artboard px, then photo and tape tilt in degrees. */
type WallSpot = [x: number, y: number, w: number, tilt: number, tapeTilt: number];

/**
 * The Daksh Wall: Daksh 2025 polaroids pinned over the graffiti wall. Spots
 * are laid out on a 1040×1500 desktop artboard and a 358×1420 phone artboard
 * (the phone shows ten of them).
 */
export const WALL: { photo: Photo; caption: string; desktop: WallSpot; mobile?: WallSpot }[] = [
  { photo: PHOTOS.mascotVisitors, caption: "One with our mascot, ALDEN", desktop: [45, 214, 239, 4, -12], mobile: [14, 174, 166, 4, -12] },
  { photo: d("miniature-city", "A miniature city model at an architecture stall", 900, 600), caption: "A miniature city", desktop: [306, 248, 216, -3, 9], mobile: [183, 212, 150, -3, 9] },
  { photo: d("avenue-crowd", "Visitors crowding the stall avenue", 900, 430), caption: "The stall avenue, buzzing", desktop: [536, 222, 216, 2, -6], mobile: [30, 426, 150, -3, 9] },
  { photo: d("drive-simulator", "A visitor trying a driving simulator", 900, 600), caption: "Take the wheel", desktop: [786, 242, 216, -3, 9], mobile: [191, 448, 150, 3, -9] },
  { photo: d("engine-exhibit", "An engine on display at the mechanical stall", 1000, 667), caption: "Under the hood", desktop: [42, 530, 216, -2, 6], mobile: [183, 684, 150, -2.5, 7.5] },
  { photo: d("ncc-artillery", "NCC cadets showing a mounted gun to visitors", 900, 600), caption: "Lock, load & learn", desktop: [292, 548, 216, 3, -9], mobile: [22, 662, 150, 2, -6] },
  { photo: PHOTOS.docMuseum, caption: "Starry-night stall art", desktop: [522, 522, 216, 1.5, -4.5], mobile: [183, 1156, 150, -2.5, 7.5] },
  { photo: PHOTOS.droneExhibit, caption: "Built to fly", desktop: [772, 542, 216, -3, 9] },
  { photo: d("opening-stage", "Guests on stage at the Daksh 2025 inauguration", 900, 600), caption: "Inauguration Ceremony", desktop: [60, 830, 216, -2, 6], mobile: [30, 898, 150, -2, 6] },
  { photo: d("tree-art", "A painted tree artwork at a stall", 900, 493), caption: "Art that grows", desktop: [310, 848, 216, 2.5, -7.5] },
  { photo: d("cad-design", "A 3D design open on a workstation", 900, 600), caption: "Designed in 3D", desktop: [540, 822, 216, 3, -9] },
  { photo: d("walls-of-fame", "A stall wall covered in photos and notes", 900, 600), caption: "Walls of fame", desktop: [790, 842, 216, -1.5, 4.5], mobile: [191, 920, 150, 3, -9] },
  { photo: d("cloud-sculpture", "A cloud-shaped paper sculpture", 900, 538), caption: "A cloud of ideas", desktop: [278, 1130, 216, 2, -6] },
  { photo: d("textiles-karnataka", "The Textiles of Karnataka stall", 900, 454), caption: "Textiles of Karnataka", desktop: [528, 1148, 216, -2.5, 7.5], mobile: [22, 1134, 150, 2, -6] },
];

export const TEACHERS_DAY = {
  title: "Gurubhyo Namaha 2026",
  hero: td("gurubhyo-namaha", "The Gurubhyo Namaha Teachers' Day celebration on stage", 1400, 933),
  photos: [
    td("solo-dance", "A solo classical dance performance", 1000, 1500),
    td("ensemble-dance", "An ensemble dance performance", 1200, 800),
    td("band", "The student band performing", 1000, 1500),
    td("felicitation", "Faculty members being felicitated on stage", 1200, 800),
    td("teachers-audience", "Teachers smiling in the audience", 1000, 667),
  ],
};

/** Schools and their departments, as listed in the Daksh 2026 brochure. */
export const SCHOOLS: { name: string; departments: string[] }[] = [
  { name: "School of Architecture", departments: ["Architecture"] },
  { name: "School of Law", departments: ["Law"] },
  { name: "School of Sciences", departments: ["Chemistry", "Computer Science", "Life Sciences", "Mathematics", "Physics & Electronics", "Statistics & Data Science"] },
  { name: "School of Business and Management", departments: ["Business & Management", "Hotel Management", "Marketing & Tourism"] },
  {
    name: "School of Engineering and Technology",
    departments: [
      "AI and Data Science Engineering",
      "Civil Engineering",
      "Computer Science and Engineering",
      "Electrical and Electronics Engineering",
      "Electronics and Communication Engineering",
      "Mechanical and Automobile Engineering",
      "Sciences and Humanities (Engineering)",
    ],
  },
  { name: "School of Social Sciences", departments: ["Economics", "International Studies", "Political Science & History", "Sociology", "Media Studies", "Liberal Arts"] },
  { name: "School of Psychological Sciences, Education and Social Work", departments: ["Psychology", "Education", "Social Work"] },
  { name: "School of Humanities and Performing Arts", departments: ["English & Cultural Studies", "Languages", "Performing Arts", "Theatre Studies & Music", "Philosophy & Theology"] },
  { name: "School of Commerce, Finance and Accountancy", departments: ["Commerce", "Professional Studies"] },
];

export const AWAITS: { photo?: Photo; title: string; body: string }[] = [
  { photo: PHOTOS.festsClubsStall, title: "Department stalls", body: "Every school and department showcases its programmes, projects and student life — ask anything." },
  { photo: PHOTOS.stallDemo, title: "Career counselling", body: "Personalised guidance to help you match your interests to the right course and career." },
  { photo: PHOTOS.openDayWalk, title: "University Open Day", body: "Explore the Central Campus and its facilities on the same two days as Daksh." },
  { title: "Trailblaze competitions", body: "Seven competitions on the theme The Culture of Tomorrow — from quiz and debate to film, dance and e-sports." },
];

export const MOMENTS: { photo: Photo; caption: string; tilt: number }[] = [
  { photo: PHOTOS.mascotVisitors, caption: "Our owl says hello!", tilt: -3 },
  { photo: PHOTOS.stallTeam, caption: "Stalls with stories", tilt: 2 },
  { photo: PHOTOS.nccDemo, caption: "NCC up close", tilt: -1.5 },
  { photo: PHOTOS.docMuseum, caption: "The DOC museum", tilt: 2.5 },
  { photo: PHOTOS.mascotStudents, caption: "Selfie with the mascot", tilt: -2 },
  { photo: PHOTOS.droneExhibit, caption: "Built by students", tilt: 1.5 },
  { photo: PHOTOS.performingArtsStall, caption: "Arts that pop", tilt: -2.5 },
  { photo: PHOTOS.councilVolunteers, caption: "Your Student Council hosts", tilt: 3 },
  { photo: PHOTOS.dancePerformance, caption: "Opening day on stage", tilt: -1 },
];

export const TRAILBLAZE = {
  theme: "The Culture of Tomorrow",
  tagline: "Past · Present · Future",
  brochure: "/docs/trailblaze-2026-brochure.pdf",
  /** Trailblaze registration (Google Form). */
  register: "https://docs.google.com/forms/d/e/1FAIpQLSdmV5gmqnBsehP-0Fmfjr2Tfrioghi5tfas99nh2etHsZ_gIw/viewform",
};

export interface Competition {
  name: string;
  /** Shorter name for chips and lists, when the full one is long. */
  short?: string;
  kind: string;
  tag: string;
  tagline: string;
  team: string;
  format: string;
  /** Sub-theme some competitions set, e.g. “Echoes of Tomorrow”. */
  concept?: string;
  /** Registration fee, as printed in the brochure. */
  fee: string;
  description: string;
}

/** The seven Trailblaze competitions, from the Trailblaze 2026 competition brochure. */
export const COMPETITIONS: Competition[] = [
  {
    name: "Mind-Maze",
    kind: "Quiz Competition",
    tag: "Quiz",
    tagline: "Think Fast, Answer Faster.",
    team: "Up to 3 members",
    format: "3 rounds — written MCQ, bounce & pounce, audio-visual buzzer",
    fee: "₹200 per team",
    description:
      "A high-intensity quiz testing sharpness, awareness and intellect — current affairs, pop culture, logic, science, Indian polity, music, sports and general knowledge.",
  },
  {
    name: "Dialectica",
    kind: "Asian Parliamentary Debate",
    tag: "Debate",
    tagline: "Make Your Point. Own the Room.",
    team: "3 members — Government or Opposition, by draw of lots",
    format: "Preliminaries, semi-finals and finals · 3–7 minute speeches · 30 minutes’ preparation",
    fee: "₹200 per team",
    description:
      "Think critically, argue persuasively and communicate confidently on pressing global and social issues — judged on matter, manner and method.",
  },
  {
    name: "Celluloid: Filmlets",
    kind: "Short Film Making",
    tag: "Film",
    tagline: "Frame the Story. Own the Screen.",
    team: "3–8 members",
    format: "6–8 minutes including credits · any language, with English subtitles",
    concept: "Echoes of Tomorrow",
    fee: "₹300 per team",
    description:
      "Imagine how the choices, ideas and innovations of today shape the future — a personal story, a social issue or an imaginative vision. Original work only, with no AI-generated content.",
  },
  {
    name: "ReelScape: Stories in Motion",
    short: "ReelScape",
    kind: "Reel Making",
    tag: "Reels",
    tagline: "Shoot the Vibe in Real Time.",
    team: "Individual",
    format: "Theme revealed on the morning · 4 hours to shoot and edit · 30–90 seconds",
    fee: "₹100 per participant",
    description:
      "Capture the spirit, energy and atmosphere of Daksh and Open Day in one reel — shot and edited on campus on 21 November, with results on 22 November.",
  },
  {
    name: "Nritya Kshetra",
    kind: "Cultural Dance Showcase",
    tag: "Dance",
    tagline: "Bring the Rhythm to Life.",
    team: "6–8 members",
    format: "7 minutes including setup and exit · Indian film songs · a mandatory prop for at least 2 minutes",
    fee: "₹300 per team",
    description:
      "A celebration of India’s cultural spirit through Indian film songs and dance forms, with one common prop woven into the choreography.",
  },
  {
    name: "Chessverse",
    kind: "Chess Championship",
    tag: "Chess",
    tagline: "Master the Board. Claim the Crown.",
    team: "Individual (1v1)",
    format: "Blitz preliminaries (5 minutes) · rapid qualifiers (30 minutes) · over the board",
    fee: "₹100 per participant (1v1) · ₹200 per pair (2v2)",
    description:
      "Strategy, foresight and tactical precision on the physical board — high-speed rounds give way to deep, calculated endgames in the final stages.",
  },
  {
    name: "Resonance",
    kind: "Acoustic Group Singing",
    tag: "Music",
    tagline: "Raw Vocals, Real Music.",
    team: "3–8 members",
    format: "3–6 minutes (+1-minute setup) · live acoustic instruments and vocals only",
    fee: "₹300 per team",
    description:
      "Voices in their purest form — any genre, from classical and folk to pop, patriotic and Bollywood, performed live and unfiltered.",
  },
];
