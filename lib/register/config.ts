// Registration for Daksh & Open Day 2026 — form options and wording.
// These match the registration web app (Google Apps Script, Code.gs CONFIG) so
// the page can show instantly; the page then fetches the web app's own copy
// (registrationConfig) and uses that, so they can never drift apart.
import { DAKSH } from "@/lib/daksh";

export interface RegConfig {
  eventTitle: string;
  openDayTitle: string;
  openDayTime: string;
  days: string[];
  categories: string[];
  institutionTypes: string[];
  openDayDays: string[];
  interests: string[];
  consent: string;
  instConsent: string;
  venue: string;
}

export const DEFAULT_CONFIG: RegConfig = {
  eventTitle: "Daksh 2026",
  openDayTitle: "Open Day 2026",
  openDayTime: "9:00 AM – 5:00 PM",
  days: ["Day 1 — Saturday, 21 November 2026", "Day 2 — Sunday, 22 November 2026"],
  categories: ["Student", "Parent", "Teacher / Faculty", "Industry Expert", "Professional"],
  institutionTypes: ["School", "PU / Junior College", "College / University", "Other"],
  openDayDays: ["21st November 2026", "22nd November 2026"],
  interests: [
    "English and Cultural Studies",
    "Media Studies",
    "Performing arts, Theatre Studies and Music",
    "Philosophy and Theology",
    "Business and Management",
    "Hotel Management",
    "Commerce",
    "Professional Studies (CA, CMA, ACCA, CFA, CPA, CIMA etc.)",
    "Education",
    "Law",
    "Chemistry",
    "Computer Science",
    "Life Sciences",
    "Mathematics",
    "Physics and Electronics",
    "Statistics and Data Science",
    "Economics",
    "International Studies, Political Science and History",
    "Psychology",
    "Sociology and Social work",
    "Languages",
  ],
  consent:
    "I agree that my registered name, email, mobile number and category may be stored by the University Student Council, Christ University for this event, and shared with a stall only when I show my ticket there and confirm. If I am under 18, my parent/guardian has agreed to this.",
  instConsent:
    "I am authorised by my institution to register this group, and I agree that these details may be stored by the University Student Council, Christ University for event coordination.",
  venue: "CHRIST (Deemed to be University), Central Campus, Bengaluru",
};

export type Kind = "individual" | "institution" | "openday";
export type View = "home" | Kind | "ticket";

/** Ticket details returned by the web app (drawn in the site's design). */
export interface TicketData {
  id: string;
  type: "Individual" | "Institution" | "Open Day";
  label: string;
  title: string;
  kind: string;
  name: string;
  category: string;
  institution: string;
  students: number | null;
  staff: number | null;
  accompanying: string;
  time: string;
  days: string[];
  venue: string;
}
export interface TicketResult {
  ok: true;
  existing: boolean;
  id: string;
  gif: string;
  label: string;
  ticket: TicketData;
}

/** POSTs as text/plain (no CORS preflight); the web app answers with JSON. */
export async function callWebApp<T>(fn: string, args: unknown[]): Promise<T> {
  const r = await fetch(DAKSH.webAppApi, {
    method: "POST",
    body: JSON.stringify({ fn, args }),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
}
