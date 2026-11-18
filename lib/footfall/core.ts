// Footfall scanner — everything that isn't UI: ticket checks, the on-phone
// queue/history, and calls to the registration web app (Google Apps Script),
// which stores scans in the Daksh Google Sheet.
//
// The web app's JSON API (doPost in Footfall.gs) accepts:
//   scannerLogin, submitScans, findTicketById, stallStats.
import nacl from "tweetnacl";
import { DAKSH } from "@/lib/daksh";

/** The registration web app (same /exec link as the register buttons). */
export const FOOTFALL_API = DAKSH.webAppApi;

export const CATEGORY_LABELS: Record<string, string> = {
  S: "Student",
  P: "Parent",
  T: "Teacher / Faculty",
  I: "Industry Expert",
  R: "Professional",
  G: "Institution",
  O: "Open Day Visitor",
};

/** Ticket day codes → event dates (IST). */
const TICKET_DAY_DATES: Record<string, string> = { "1": "2026-11-21", "2": "2026-11-22" };
export const DAY_LABELS: Record<string, string> = { "2026-11-21": "Day 1 — 21 Nov", "2026-11-22": "Day 2 — 22 Nov" };

export type StallType = "STALL" | "GATE";
export interface Stall {
  code: string;
  name: string;
  dept: string;
  type: StallType;
}
export interface Session {
  stall: Stall;
  pin: string;
  publicKey: string;
}
export interface Ticket {
  payload: string;
  id: string;
  cat: string;
  days: string;
  name: string;
  email: string;
  phone: string;
}
export interface ScanRecord {
  id: string;
  payload: string;
  ticketId: string;
  scannedAt: number;
  device: string;
  consent: boolean;
  rating: number;
  feedback: string;
  entry: number;
  count: number;
  flags: string[];
}
export interface HistoryItem {
  t: number;
  tid: string;
  name: string;
  cat: string;
  n?: number;
  rating?: number;
  rid: string;
  st: "queued" | "sent" | "rejected";
  at?: number;
  /** Feedback text, entry # (institution passes), whether details were shared, repeat visit / re-entry. */
  fb?: string;
  ent?: number;
  shared?: boolean;
  re?: boolean;
}
export interface DayStats {
  date: string;
  label: string;
  visits: number;
  unique?: number;
  shared?: number;
  avg?: number | null;
  hours: Record<string, number>;
}
export interface StallStats {
  total: number;
  days: DayStats[];
  updated?: number;
}

// ---------------------------------------------------------------- storage
// Phone storage keeps scans safe across reloads. If the browser blocks it
// (some private modes), values live in memory and the UI warns the volunteer.
const MEM: Record<string, unknown> = {};
let persistent = true;
export const isPersistent = () => persistent;

export function store(key: string, value: unknown) {
  MEM[key] = value;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    persistent = false;
  }
}
export function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v != null) return JSON.parse(v) as T;
  } catch {
    persistent = false;
  }
  return key in MEM && MEM[key] != null ? (MEM[key] as T) : fallback;
}

export function uid() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
export function deviceId() {
  let d = load<string | null>("ff_device", null);
  if (!d) {
    d = uid().slice(0, 10);
    store("ff_device", d);
  }
  return d;
}

export const getQueue = () => load<ScanRecord[]>("ff_queue", []);
export const setQueue = (q: ScanRecord[]) => store("ff_queue", q);
export const getHistory = (code: string) => load<HistoryItem[]>(`ff_hist_${code}`, []);
export function setHistory(code: string, h: HistoryItem[]) {
  // Keeps this phone's visits for the visits table and exports (well within phone storage).
  store(`ff_hist_${code}`, h.slice(0, 3000));
}

// ---------------------------------------------------------------- dates
export function ymd(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** "Day 1 — 21 Nov" on event days, "Today — 18 Nov", otherwise "Tue, 17 Nov". */
export function dayLabelOf(date: string) {
  if (DAY_LABELS[date]) return DAY_LABELS[date];
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return date;
  const short = dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return date === ymd() ? `Today — ${short}` : dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
export function timeOf(t: number) {
  return new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
export function hourLabel(h: number) {
  const a = h % 12 || 12;
  const b = (h + 1) % 12 || 12;
  return `${a}–${b} ${h + 1 >= 12 ? "PM" : "AM"}`;
}

// ---------------------------------------------------------------- tickets
function b64u(s: string) {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/**
 * Checks a scanned QR offline: it must be a council-signed ticket
 * ("CU26|id|category|days|name|maskedEmail|maskedPhone~signature").
 * An edited or made-up QR fails the signature check.
 */
export function checkTicket(text: string, publicKey: string): Ticket | null {
  const parts = String(text || "").trim().split("~");
  if (parts.length !== 2) return null;
  const f = parts[0].split("|");
  if (f.length !== 7 || f[0] !== "CU26") return null;
  try {
    if (!nacl.sign.detached.verify(new TextEncoder().encode(parts[0]), b64u(parts[1]), b64u(publicKey))) return null;
  } catch {
    return null;
  }
  return { payload: `${parts[0]}~${parts[1]}`, id: f[1], cat: f[2], days: f[3], name: f[4], email: f[5], phone: f[6] };
}

export const categoryLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

/** A note when today is an event day the ticket isn't registered for (still allowed). */
export function dayNote(t: Ticket) {
  const today = ymd();
  const code = Object.keys(TICKET_DAY_DATES).find((k) => TICKET_DAY_DATES[k] === today);
  if (!code || t.days.includes(code)) return "";
  const reg = t.days
    .split("")
    .map((k) => DAY_LABELS[TICKET_DAY_DATES[k]] ?? "")
    .filter(Boolean)
    .join(", ");
  return `Registered for ${reg || "another day"}, not today. Allowed — noted in the records.`;
}

export function newRecord(t: Ticket, extra: Partial<ScanRecord>): ScanRecord {
  return {
    id: uid(),
    payload: t.payload,
    ticketId: t.id,
    scannedAt: Date.now(),
    device: deviceId(),
    consent: false,
    rating: 0,
    feedback: "",
    entry: 1,
    count: 1,
    flags: [],
    ...extra,
  };
}

// ---------------------------------------------------------------- server
/** POSTs as text/plain (no CORS preflight); Apps Script answers with JSON. */
export async function api<T = Record<string, unknown>>(fn: string, args: unknown[]): Promise<T> {
  const r = await fetch(FOOTFALL_API, {
    method: "POST",
    body: JSON.stringify({ fn, args }),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
}
