export interface SidebarItem {
  href: string;
  label: string;
}

export interface Mentor {
  name: string;
  role: string;
  dept: string;
  img: string;
}

export interface Member {
  name: string;
  dept: string;
  level: "UG" | "PG" | "Centre";
}

export type ProcedureCategory = "safety" | "financial" | "academic" | "campus" | "international";

export interface Procedure {
  cat: ProcedureCategory;
  title: string;
  audience: string;
  steps: string[];
  contact: string;
}

export type RoomType = "office" | "wash" | "circulation" | "common";

export interface Room {
  name: string;
  type: RoomType;
  c: number;
  cs?: number;
  r: number;
  desc: string;
}

export interface Floor {
  id: string;
  label: string;
  title: string;
  rows: number;
  rooms: Room[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/christ-hub", label: "Christ Hub" },
  { href: "/about", label: "About" },
  { href: "/governance", label: "Governance" },
  { href: "/mentors", label: "Mentors" },
  { href: "/members", label: "Members" },
  { href: "/events", label: "Events" },
  { href: "/procedures", label: "Procedures" },
  { href: "/campus-map", label: "Campus Map" },
  { href: "/reports", label: "Reports" },
  { href: "/contact", label: "Connect" },
];

export const MENTOR_LEADERSHIP: Mentor[] = [
  { name: "Dr Fr Joseph C C", role: "Vice Chancellor", dept: "CHRIST (Deemed to be University)", img: "/images/mentors/josecc.jpg" },
  { name: "Dr Fr Viju P D", role: "Pro-Vice Chancellor", dept: "CHRIST (Deemed to be University)", img: "/images/mentors/viju.jpg" },
  { name: "Dr Anil Joseph Pinto", role: "Registrar", dept: "CHRIST (Deemed to be University)", img: "/images/mentors/anil.jpg" },
  { name: "Jyothi Kumar", role: "Registrar (Academics)", dept: "CHRIST (Deemed to be University)", img: "/images/mentors/jyothi_kumar.jpg" },
  { name: "Dr Kishore Selva Babu", role: "Director, University Student Council", dept: "CHRIST (Deemed to be University)", img: "/images/mentors/kishore_selva_babu.jpg" },
];

export const MENTOR_COORDINATORS: Mentor[] = [
  { name: "Dr Suja Mol John", role: "Faculty Mentor", dept: "School of Business and Management", img: "/images/mentors/suja_mol_john.jpg" },
  { name: "Dr Naveen Kumara R", role: "Faculty Mentor", dept: "School of Commerce, Finance and Accountancy", img: "/images/mentors/naveen_kumara.jpg" },
  { name: "Dr Kiran Vazirani", role: "Faculty Mentor", dept: "School of Business and Management", img: "/images/mentors/kiran_vazirani.jpg" },
  { name: "Pritha Biswas", role: "Faculty Mentor", dept: "School of Commerce, Finance and Accountancy", img: "/images/mentors/pritha_biswas.jpg" },
  { name: "Prof Devika Menon M K", role: "Faculty Mentor", dept: "Kengeri Campus", img: "/images/mentors/devika_menon.jpg" },
  { name: "Dr Gobi R", role: "Faculty Mentor", dept: "School of Sciences", img: "/images/mentors/gobi_r.jpg" },
  { name: "Dr Ellumkalayil Merlin Thomas", role: "Faculty Mentor", dept: "Yeshwanthpur Campus", img: "/images/mentors/merlin_thomas_new.jpg" },
  { name: "Aghil P Komban", role: "Faculty Mentor", dept: "Yeshwanthpur Campus", img: "/images/mentors/aghil_komban_new.jpg" },
  { name: "Dr Anila Rose Cherian", role: "Faculty Mentor", dept: "School of Sciences", img: "/images/mentors/anila_rose_cherian_new.jpg" },
  { name: "Dr Christine Ann Thomas", role: "Faculty Mentor", dept: "School of Arts, Humanities, and Social Sciences", img: "/images/mentors/christine_ann_thomas.jpg" },
  { name: "Dr Prathima V G", role: "Faculty Mentor", dept: "School of Business and Management (PG)", img: "/images/mentors/prathima_vg.jpg" },
  { name: "Dr Athullya Nair", role: "Faculty Mentor", dept: "School of Psychological Sciences, Social Work and Education", img: "/images/mentors/athullya_nair.jpg" },
  { name: "Dr Piyali Roy Chowdury", role: "Faculty Mentor", dept: "School of Business and Management (UG)", img: "/images/mentors/piyali_roy_chowdury.jpg" },
  { name: "Dr Shijo Thomas", role: "Faculty Mentor", dept: "School of Engineering & Technology", img: "/images/mentors/shijo_thomas.jpg" },
  { name: "Dr Souradeep Rakshit", role: "Faculty Mentor", dept: "School of Law", img: "/images/mentors/souradeep_rakshit.jpg" },
  { name: "Dr Yogesh Kanna Sathyamoorthy", role: "Faculty Mentor", dept: "Dept of Psychology", img: "/images/mentors/yogesh_kanna_sathyamoorthy.jpg" },
  { name: "Prof Betty Bharathi Sharath", role: "Faculty Mentor", dept: "School of Architecture", img: "/images/mentors/betty_bharathi_sharath.jpg" },
];

export const MEMBERS: Member[] = [
  { name: "Aarushi Ahuja", dept: "School of Sciences — Statistics and Data Science", level: "UG" },
  { name: "Abhishek Paul P", dept: "School of Social Sciences — Economics", level: "UG" },
  { name: "Adrino Rosario James", dept: "School of Sciences — Computer Science", level: "UG" },
  { name: "Akshat R Shinde", dept: "School of Business and Management", level: "UG" },
  { name: "Al Sakib Hami", dept: "Centre for Academic & Professional Support", level: "Centre" },
  { name: "Amrutha Bhavani Sundar", dept: "School of Commerce, Finance and Accountancy — DPS", level: "UG" },
  { name: "Anandita Handa", dept: "Centre for Placement and Career Guidance", level: "Centre" },
  { name: "Anika Britto", dept: "School of Business and Management", level: "UG" },
  { name: "Apsara R Krishna", dept: "School of Humanities — English and Cultural Studies", level: "PG" },
  { name: "Ashmita Hota", dept: "School of Arts, Humanities and Social Sciences — Sociology", level: "PG" },
  { name: "Avinash Ashok", dept: "School of Commerce, Finance and Accountancy", level: "UG" },
  { name: "Basil Sible", dept: "Centre for Service Learning", level: "Centre" },
  { name: "Bevan Mathew Cyriac", dept: "School of Sciences — Statistics and Data Science", level: "PG" },
  { name: "Bindu M", dept: "School of Sciences — PCM", level: "PG" },
  { name: "Brahm Jairamuka", dept: "Student Welfare Office", level: "Centre" },
];

export const PROCEDURES: Procedure[] = [
  { cat: "safety", title: "Student Grievance Redressal", audience: "All Students", steps: [
    "Approach the Centre for Counselling and Health Services (CCHS) first, or your Department Counsellor.",
    "If unresolved, the matter escalates to the Departmental Student Grievance Redressal Committee (DSGRC).",
    "The Central Student Grievance Redressal Committee (CSGRC) is the final appellate authority.",
  ], contact: "christuniversity.in/grievance-redressal" },
  { cat: "safety", title: "Reporting Ragging", audience: "All Students", steps: [
    "Lodge a written complaint in person or by university email within 3 working days of the incident.",
    "Send it to any Anti-Ragging Squad member, the Director of Student Services, or your HOD, in that order.",
    "Cite the date, time, place, persons involved, and nature of the incident. Parents/guardians may file on a student's behalf.",
  ], contact: "antiraggingsquad@christuniversity.in" },
  { cat: "safety", title: "Sexual Harassment Complaint (ICC)", audience: "Students, Staff & Visitors", steps: [
    "Submit a signed written complaint to the Internal Complaints Committee (ICC) within 3 months of the incident.",
    "A Select Committee scrutinises the complaint within 7 working days and reports on its veracity.",
    "The ICC conducts a hearing, completes the enquiry within 45 days, and submits recommendations to the Vice Chancellor.",
  ], contact: "icc@christuniversity.in" },
  { cat: "financial", title: "Fee Concession Application", audience: "UG & PG Students", steps: [
    "Download the application form from your Knowledge Pro (KP) ERP account within the notified window.",
    "Fill it completely and attach your previous semester marks card and attendance report.",
    "Submit to your HOD / Programme Co-ordinator before the deadline.",
    "The Dean's Office reviews and forwards approved applications to the Scholarship & Fellowship Support Cell (SSC).",
    "SSC emails you and issues a Fee Concession Voucher.",
    "Take the voucher to the Office of Accounts, Central Block, for a revised demand slip.",
  ], contact: "scholarship.support@christuniversity.in" },
  { cat: "financial", title: "Merit / Sports / Co-Curricular Scholarship", audience: "All Students (except 1st Years)", steps: [
    "Download the application form from your KP ERP account within the notified period.",
    "Submit the filled form with supporting certificates (only those showing prizes won) to your Director/Co-ordinator.",
    "The SSC notifies eligible students of the outcome.",
  ], contact: "scholarship.support@christuniversity.in" },
  { cat: "academic", title: "Answer Script Re-evaluation / Re-totalling", audience: "UG & PG Students", steps: [
    "Apply through your Student KP login within the prescribed date after results are announced.",
    "Pay the prescribed fee; the higher of the original or revised marks is always awarded.",
    "Results are normally announced within one month of the application.",
  ], contact: "Office of Examinations" },
  { cat: "academic", title: "Supplementary Examination", audience: "UG & PG Students with Backlogs", steps: [
    "Apply through your ERP student login before the notified deadline.",
    "Notifications are published on the University website at least 30 days before exams commence.",
    "A maximum of 3 attempts is permitted with the same syllabus (2 for 3-year, 1 for 2-year programmes).",
  ], contact: "Office of Examinations" },
  { cat: "academic", title: "CIA Repeat Application", audience: "Students with Low CIA Marks", steps: [
    "Apply immediately after results are announced — windows open twice a year, in June and November.",
    "Submit the filled form in person to the Office of Examinations; a maximum of 2 courses at a time.",
    "Complete a 30-hour tutorial (on-campus, including library time) within 30 days under an assigned tutor.",
  ], contact: "Office of Examinations" },
  { cat: "campus", title: "Booking the Auditorium / Meeting Halls", audience: "Departments & Student Bodies", steps: [
    "Book at least one week in advance at the Block I Reception with an HOD letter (Central Campus).",
    "Allotment is first-come-first-served; the venue must be vacated within 30 minutes of the event ending.",
    "Meet technical staff at least two days prior for audio/video trial runs.",
  ], contact: "Block I Reception" },
  { cat: "campus", title: "Special Needs Exam Accommodation", audience: "Differently-Abled Students", steps: [
    "Submit medical documentation to the Office of Examinations at least 2 weeks before the exam.",
    "Request compensatory time (up to 20 minutes/hour), a scribe, or a modified question paper as needed.",
    "If a scribe is required, submit their details in advance for eligibility approval.",
  ], contact: "disability.support@christuniversity.in" },
  { cat: "campus", title: "Leave Application", audience: "All Students", steps: [
    "Use the prescribed form at the Office of Student Services — categories include medical, placement, and co-/extra-curricular.",
    "Submit within the deadline printed on the relevant form; false claims are rejected outright.",
    "Continuous unapproved absence of 2+ weeks is treated as withdrawal from the University.",
  ], contact: "Office of Student Services" },
  { cat: "campus", title: "Library Book Borrowing & Renewal", audience: "All Students", steps: [
    "Your ID card is your library card — report to the circulation desk on your first visit to activate it.",
    "UG students may borrow 2 books, PG students 4 books, for a 14-day loan period.",
    "A book may be renewed once online or via SMS; late returns are fined ₹5/day.",
  ], contact: "library@christuniversity.in" },
  { cat: "campus", title: "Detention Certificate & Re-admission", audience: "Students Detained for Attendance", steps: [
    "Apply for a detention certificate from the Office of Admissions within the stipulated deadline.",
    "Re-admission after detention is considered only once during your entire course of study.",
  ], contact: "Office of Admissions" },
  { cat: "international", title: "International Student FRRO Registration", audience: "International Students", steps: [
    "Register on the e-FRRO portal (indianfrro.gov.in) within 14 days of arrival on a new student visa.",
    "Bangalore campuses: visit the Office of International Affairs, Ground Floor, Block I for assistance.",
    "Deposit a copy of your Residential Permit with the OIA once issued; renew well before expiry.",
  ], contact: "Office of International Affairs" },
  { cat: "international", title: "University Student Council Membership Nomination", audience: "Aspiring Council Members", steps: [
    "Submit a statement of purpose with attendance and marks records to your Class Teacher.",
    "The Class Teacher/HOD shortlist 4 candidates per class for the Faculty Coordinator to interview.",
    "Two members per class are selected for the School Council; eligible members may later apply for the University Council.",
  ], contact: "Your Faculty Coordinator" },
];

export const ROOM_ICON: Record<RoomType, string> = { office: "door", wash: "wash", circulation: "lift", common: "pin" };

export const FLOORS: Floor[] = [
  { id: "b2", label: "2nd Basement", title: "Car Parking — 2nd Basement", rows: 5,
    rooms: [
      { name: "Exit Ramp", type: "common", c: 6, cs: 2, r: 1, desc: "Vehicle exit ramp leading up from the 2nd basement." },
      { name: "Lift", type: "circulation", c: 3, r: 2, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 2, desc: "Fire-compliant staircase serving all floors." },
      { name: "Car Parking", type: "common", c: 1, cs: 5, r: 3, desc: "Second basement parking level of the Central Block." },
      { name: "Lift", type: "circulation", c: 3, r: 4, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 4, desc: "Fire-compliant staircase serving all floors." },
      { name: "Entry Ramp", type: "common", c: 6, cs: 2, r: 5, desc: "Vehicle entry ramp descending to the 2nd basement." },
    ] },
  { id: "b1", label: "1st Basement", title: "Gourmet & Facilities — 1st Basement", rows: 5,
    rooms: [
      { name: "Gourmet Extension", type: "common", c: 1, cs: 2, r: 1, desc: "Extended seating and service area for Gourmet." },
      { name: "Washroom", type: "wash", c: 3, r: 1, desc: "Gents & Ladies washrooms on this floor." },
      { name: "Health Centre", type: "office", c: 4, r: 1, desc: "On-campus medical facility for students and staff." },
      { name: "CCTV Office", type: "office", c: 5, r: 1, desc: "Campus security and surveillance monitoring office." },
      { name: "Ramp / Entry", type: "common", c: 6, cs: 2, r: 1, desc: "Vehicle ramp and pedestrian entry/exit point." },
      { name: "Lift", type: "circulation", c: 3, r: 2, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 2, desc: "Fire-compliant staircase serving all floors." },
      { name: "Gourmet (Dining)", type: "common", c: 1, cs: 3, r: 3, desc: "Main dining / gourmet facility of the Central Block." },
      { name: "Lift", type: "circulation", c: 3, r: 4, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 4, desc: "Fire-compliant staircase serving all floors." },
      { name: "Ramp / Entry", type: "common", c: 6, cs: 2, r: 5, desc: "Vehicle ramp connecting to the 2nd basement, with entry/exit." },
    ] },
  { id: "g", label: "Ground Floor", title: "Ground Floor — Administration", rows: 9,
    rooms: [
      { name: "Entry / Exit", type: "common", c: 2, r: 1, desc: "Main pedestrian entry and exit point." },
      { name: "Office of Accounts", type: "office", c: 1, r: 2, desc: "Fee payments and accounts-related services." },
      { name: "Washroom", type: "wash", c: 2, r: 2, desc: "Gents washroom on this floor." },
      { name: "Office of IPM", type: "office", c: 3, r: 2, desc: "Institutional Planning & Management office." },
      { name: "Office of Admissions", type: "office", c: 4, r: 2, desc: "Handles admissions enquiries and processing." },
      { name: "Office of the Vice Chancellor", type: "office", c: 6, cs: 2, r: 2, desc: "Administrative office of the Vice Chancellor." },
      { name: "Office of the CFO", type: "office", c: 1, r: 3, desc: "Office of the Chief Financial Officer." },
      { name: "Lift", type: "circulation", c: 3, r: 3, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 3, desc: "Fire-compliant staircase serving all floors." },
      { name: "Washroom", type: "wash", c: 1, r: 4, desc: "Ladies washroom on this floor." },
      { name: "Lift", type: "circulation", c: 5, r: 4, desc: "Secondary passenger lift on this floor." },
      { name: "Staff Check-in Room", type: "office", c: 1, r: 5, desc: "Staff attendance and check-in point." },
      { name: "Lift", type: "circulation", c: 3, r: 6, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 6, desc: "Fire-compliant staircase serving all floors." },
      { name: "Council Room", type: "office", c: 1, r: 7, desc: "Meeting room used by the University Student Council." },
      { name: "Washroom", type: "wash", c: 2, r: 8, desc: "Gents washroom near reception." },
      { name: "Reception", type: "common", c: 4, r: 8, desc: "Main reception and visitor entry point." },
      { name: "Entry / Exit", type: "common", c: 4, r: 9, desc: "Secondary pedestrian entry and exit point." },
    ] },
  { id: "f8", label: "8th Floor", title: "8th Floor — Knowledge Centre", rows: 8,
    rooms: [
      { name: "Room 811", type: "office", c: 1, r: 1, desc: "Numbered classroom / seminar room." },
      { name: "Washroom", type: "wash", c: 2, r: 1, desc: "Gents & Ladies washrooms on this floor." },
      { name: "Room 810", type: "office", c: 3, r: 1, desc: "Numbered classroom / seminar room." },
      { name: "Room 809", type: "office", c: 4, r: 1, desc: "Numbered classroom / seminar room." },
      { name: "Room 808", type: "office", c: 5, r: 1, desc: "Numbered classroom / seminar room." },
      { name: "Knowledge Centre (Library)", type: "common", c: 6, cs: 2, r: 1, desc: "The Central Campus library — 6th & 8th floor, Central Block." },
      { name: "Room 812", type: "office", c: 1, r: 2, desc: "Numbered classroom / seminar room." },
      { name: "Lift", type: "circulation", c: 3, r: 2, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 2, desc: "Fire-compliant staircase serving all floors." },
      { name: "Cafe Coffee Day", type: "common", c: 5, r: 2, desc: "Campus cafe outlet on the 8th floor." },
      { name: "Room 813", type: "office", c: 1, r: 3, desc: "Numbered classroom / seminar room." },
      { name: "Washroom", type: "wash", c: 1, r: 4, desc: "Ladies washroom on this floor." },
      { name: "Lift", type: "circulation", c: 5, r: 4, desc: "Secondary passenger lift on this floor." },
      { name: "Room 814", type: "office", c: 1, r: 5, desc: "Numbered classroom / seminar room." },
      { name: "Lift", type: "circulation", c: 3, r: 6, desc: "Passenger lift serving all Central Block floors." },
      { name: "Staircase", type: "circulation", c: 4, r: 6, desc: "Fire-compliant staircase serving all floors." },
      { name: "Room 815", type: "office", c: 1, r: 7, desc: "Numbered classroom / seminar room." },
      { name: "Washroom", type: "wash", c: 2, r: 8, desc: "Gents washroom on this floor." },
      { name: "Faculty Cabins", type: "office", c: 4, r: 8, desc: "Individual faculty offices for consultation." },
      { name: "Faculty Lounge", type: "office", c: 5, r: 8, desc: "Common lounge area for faculty members." },
    ] },
];
