"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Kicker, Sparkle } from "@/components/daksh/kit";
import { callWebApp, DEFAULT_CONFIG, type Kind, type RegConfig, type TicketData, type TicketResult, type View } from "@/lib/register/config";

// ---------------------------------------------------------------- shared styles (Daksh design)
const BTN =
  "inline-flex items-center justify-center gap-2.5 rounded-[16px] px-7 pt-[15px] pb-[13px] text-[1rem] font-bold leading-[1.2] tracking-[0.02em] transition-all duration-200 cursor-pointer disabled:opacity-55 disabled:cursor-wait";
const GOLD = `${BTN} bg-gold text-ink hover:-translate-y-0.5 hover:bg-gold-light`;
const OUTLINE = `${BTN} border-2 border-fg/60 text-fg hover:-translate-y-0.5 hover:border-fg hover:bg-fg/10`;
const CARD = "rounded-[16px] border border-line bg-card p-8 max-[640px]:p-5";
const INPUT =
  "w-full rounded-[12px] border border-line bg-paper-2 px-4 py-3.5 text-[1.02rem] text-fg outline-none transition-colors placeholder:text-text-muted focus:border-gold-dark";
const LABEL = "mb-2 mt-5 block text-[0.92rem] font-bold text-fg";
const HINT = "mt-1.5 text-[0.82rem] leading-[1.45] text-text-muted";
const ERR = "text-[#f08f8f]";

// ---------------------------------------------------------------- helpers
function store(k: string, v: unknown) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* private mode: drafts just aren't kept */
  }
}
function load<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
}
function newId() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim());
function phoneOk(p: string) {
  let d = String(p).replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d);
}
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const VIEWS: View[] = ["home", "individual", "institution", "openday", "ticket"];
function viewFromUrl(): View {
  const t = new URLSearchParams(window.location.search).get("type") as View | null;
  return t && VIEWS.includes(t) ? t : "home";
}

// ---------------------------------------------------------------- app
export default function RegisterApp() {
  const [cfg, setCfg] = useState<RegConfig>(() => load("reg_cfg", DEFAULT_CONFIG));
  const [view, setView] = useState<View>(viewFromUrl);
  const [results, setResults] = useState<{ list: TicketResult[]; from: Kind | "lookup" } | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // The web app's own form options (so this page always matches it); shown from cache first.
  useEffect(() => {
    callWebApp<RegConfig & { ok: boolean }>("registrationConfig", [])
      .then((c) => {
        if (c && c.ok && Array.isArray(c.categories)) {
          setCfg(c);
          store("reg_cfg", c);
        }
      })
      .catch(() => {});
    const back = () => {
      setView(viewFromUrl());
      setResults(null);
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);

  const go = useCallback((v: View) => {
    setView(v);
    setResults(null);
    window.history.pushState({}, "", v === "home" ? "/register" : `/register?type=${v}`);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const show = useCallback((list: TicketResult[], from: Kind | "lookup") => {
    setResults({ list, from });
    setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, []);

  return (
    <div ref={top} className="scroll-mt-6" id="register-app">
      {results ? (
        <Tickets results={results} onAgain={(k) => go(k)} onHome={() => go("home")} />
      ) : view === "home" ? (
        <Choices onPick={go} />
      ) : view === "ticket" ? (
        <Lookup onBack={() => go("home")} onFound={(list) => show(list, "lookup")} />
      ) : (
        <RegForm key={view} kind={view} cfg={cfg} onBack={() => go("home")} onDone={(r) => show([r], view)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- the four options
const CHOICES: { v: View; title: string; body: string; cta: string }[] = [
  {
    v: "individual",
    title: "Daksh — Individual registration",
    body: "Students, parents, teachers, industry experts and professionals. You get a personal QR ticket instantly.",
    cta: "Register",
  },
  {
    v: "institution",
    title: "Daksh — Institution registration",
    body: "Schools and colleges bringing a group. One pass covers all your students who attend with their institution ID cards.",
    cta: "Register your institution",
  },
  {
    v: "openday",
    title: "Open Day registration",
    body: "Visiting CHRIST on Open Day? Book your slot for campus tours, programmes and interaction with faculty — 21–22 November, 9 AM – 5 PM.",
    cta: "Book your slot",
  },
  {
    v: "ticket",
    title: "Already registered?",
    body: "View or download your ticket again with your email and mobile number.",
    cta: "Get my ticket",
  },
];

function Choices({ onPick }: { onPick: (v: View) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1 max-[640px]:gap-3" id="choices">
      {CHOICES.map((c, i) => (
        <button
          key={c.v}
          type="button"
          data-nav={c.v}
          onClick={() => onPick(c.v)}
          className={`group flex cursor-pointer flex-col items-start gap-2.5 rounded-[16px] border p-7 text-left transition-all duration-200 hover:-translate-y-0.5 max-[640px]:p-5 ${
            i < 3 ? "border-line bg-card hover:border-gold" : "border-dashed border-line bg-paper-2 hover:border-gold"
          }`}
        >
          <span className="font-gilda text-[25px] uppercase leading-[1.15] text-fg max-[640px]:text-[21px]">{c.title}</span>
          <span className="text-[0.98rem] leading-[1.55] text-text-secondary">{c.body}</span>
          <span className="mt-1 inline-flex items-center gap-2 text-[0.92rem] font-bold text-gold-light">
            {c.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- forms
type Data = Record<string, string | string[] | boolean>;

interface FormSpec {
  heading: string;
  intro: (cfg: RegConfig) => ReactNode;
  fields: (cfg: RegConfig, f: FieldKit) => ReactNode;
  check: (d: Data) => [string, string] | null;
  initial: Data;
  submitLabel: string;
}

const str = (d: Data, k: string) => String(d[k] ?? "");
const arr = (d: Data, k: string) => (Array.isArray(d[k]) ? (d[k] as string[]) : []);

const SPECS: Record<Kind, FormSpec> = {
  individual: {
    heading: "Daksh — Individual registration",
    intro: () => <p>Register once to get your personal QR ticket. Show it at the entry gate and at every stall — no forms to fill again on the day.</p>,
    initial: { name: "", email: "", phone: "", category: "", institution: "", grade: "", days: [], consent: false },
    submitLabel: "Register & get my ticket",
    fields: (cfg, f) => (
      <>
        {f.text("name", "Full name", { required: true, autoComplete: "name", maxLength: 60 })}
        {f.text("email", "Email address", { required: true, type: "email", autoComplete: "email", hint: "Your ticket is also emailed here." })}
        {f.text("phone", "Mobile number", { required: true, type: "tel", autoComplete: "tel", inputMode: "numeric", placeholder: "10-digit mobile number" })}
        {f.options("category", "I am registering as a", cfg.categories, "radio", { required: true })}
        {f.text("institution", "School / College / Organisation", { maxLength: 120 })}
        {f.text("grade", "Class / Grade or Designation", { maxLength: 80, placeholder: "e.g. Grade 11, II B.Com, Software Engineer" })}
        {f.days(cfg)}
        {f.consent(cfg.consent)}
      </>
    ),
    check: (d) => {
      if (str(d, "name").trim().length < 2) return ["name", "Please enter your full name."];
      if (!emailOk(str(d, "email"))) return ["email", "Please enter a valid email address."];
      if (!phoneOk(str(d, "phone"))) return ["phone", "Please enter a valid 10-digit mobile number."];
      if (!str(d, "category")) return ["category", "Please choose what you are registering as."];
      if (!arr(d, "days").length) return ["days", "Please choose at least one day."];
      if (d.consent !== true) return ["consent", "Please tick the consent box."];
      return null;
    },
  },
  institution: {
    heading: "Daksh — Institution registration",
    intro: () => (
      <p>
        One pass covers all your students who attend with their institution ID cards — they do not need to register individually. Give us a rough student count so we can plan.
      </p>
    ),
    initial: { institution: "", institutionType: "", city: "", coordinator: "", designation: "", email: "", phone: "", students: "", staff: "0", days: [], notes: "", consent: false },
    submitLabel: "Register & get my ticket",
    fields: (cfg, f) => (
      <>
        {f.text("institution", "Institution name", { required: true, maxLength: 120 })}
        {f.options("institutionType", "Institution type", cfg.institutionTypes, "radio", { required: true })}
        {f.text("city", "City / Area", { required: true, maxLength: 60 })}
        {f.text("coordinator", "Coordinator name", { required: true, autoComplete: "name", maxLength: 60 })}
        {f.text("designation", "Coordinator designation", { maxLength: 80, placeholder: "e.g. Principal, Class Teacher" })}
        {f.text("email", "Coordinator email", { required: true, type: "email", autoComplete: "email", hint: "The institution pass is also emailed here." })}
        {f.text("phone", "Coordinator mobile", { required: true, type: "tel", autoComplete: "tel", inputMode: "numeric", placeholder: "10-digit mobile number" })}
        <div className="grid grid-cols-2 gap-4 max-[460px]:grid-cols-1 max-[460px]:gap-0">
          <div>{f.text("students", "Approx. students", { required: true, type: "number", inputMode: "numeric", min: 1, max: 5000 })}</div>
          <div>{f.text("staff", "Accompanying staff", { type: "number", inputMode: "numeric", min: 0, max: 500 })}</div>
        </div>
        {f.days(cfg)}
        {f.textarea("notes", "Anything we should know?", 500)}
        {f.consent(cfg.instConsent)}
      </>
    ),
    check: (d) => {
      const students = Number(str(d, "students"));
      const staff = str(d, "staff") === "" ? 0 : Number(str(d, "staff"));
      if (str(d, "institution").trim().length < 2) return ["institution", "Please enter the institution name."];
      if (!str(d, "institutionType")) return ["institutionType", "Please choose the institution type."];
      if (str(d, "city").trim().length < 2) return ["city", "Please enter the city / area."];
      if (str(d, "coordinator").trim().length < 2) return ["coordinator", "Please enter the coordinator's name."];
      if (!emailOk(str(d, "email"))) return ["email", "Please enter a valid email address."];
      if (!phoneOk(str(d, "phone"))) return ["phone", "Please enter a valid 10-digit mobile number."];
      if (!(students >= 1 && students <= 5000 && Number.isInteger(students))) return ["students", "Please enter the approximate number of students (1–5000)."];
      if (!(staff >= 0 && staff <= 500 && Number.isInteger(staff))) return ["staff", "Please enter the number of staff (0–500)."];
      if (!arr(d, "days").length) return ["days", "Please choose at least one day."];
      if (d.consent !== true) return ["consent", "Please tick the consent box."];
      return null;
    },
  },
  openday: {
    heading: "Open Day registration",
    intro: (cfg) => (
      <>
        <p>
          Step into CHRIST (Deemed to be University), Central Campus, Bengaluru, and experience university life beyond the classroom! Explore our vibrant campus through guided tours,
          discover diverse academic programmes, interact with faculty and get a glimpse of the facilities and opportunities that shape the CHRIST experience.
        </p>
        <p>Join us for two days of exploration, learning and discovery as you take your first step towards an exciting future!</p>
        <p className="font-bold text-gold-light">21st – 22nd November 2026 · {cfg.openDayTime}</p>
        <p>Explore the campus. Discover your possibilities. Experience CHRIST!</p>
        <p>Kindly provide your details to book your slot.</p>
      </>
    ),
    initial: { name: "", dob: "", email: "", phone: "", accompanying: "", day: "", interests: [], consent: false },
    submitLabel: "Register & get my ticket",
    fields: (cfg, f) => (
      <>
        {f.text("name", "Applicant name as per ID card", { required: true, autoComplete: "name", maxLength: 60 })}
        {f.text("dob", "Date of birth", { required: true, type: "date", min: "1925-01-01", max: today() })}
        {f.text("email", "Email ID", { required: true, type: "email", autoComplete: "email", hint: "Your ticket is also emailed here." })}
        {f.text("phone", "Mobile number", { required: true, type: "tel", autoComplete: "tel", inputMode: "numeric", placeholder: "10-digit mobile number" })}
        {f.text("accompanying", "Accompanying", {
          required: true,
          maxLength: 120,
          placeholder: "e.g. Priya Rao — Mother",
          hint: "Please mention the name of the person accompanying you and your relation. Write “None” if you are coming alone.",
        })}
        {f.options("day", "Which day do you prefer to visit?", cfg.openDayDays, "radio", { required: true })}
        {f.options(
          "interests",
          "Is there a specific topic or area of interest you'd like to explore or learn more about during your visit to CHRIST?",
          cfg.interests,
          "checkbox",
          { required: true, hint: "Choose one or more.", columns: true }
        )}
        {f.consent(cfg.consent)}
      </>
    ),
    check: (d) => {
      const dob = str(d, "dob");
      if (str(d, "name").trim().length < 2) return ["name", "Please enter the applicant's name as per ID card."];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || dob > today() || dob < "1925-01-01") return ["dob", "Please enter a valid date of birth."];
      if (!emailOk(str(d, "email"))) return ["email", "Please enter a valid email address."];
      if (!phoneOk(str(d, "phone"))) return ["phone", "Please enter a valid 10-digit mobile number."];
      if (str(d, "accompanying").trim().length < 2) return ["accompanying", "Please mention who is accompanying you and your relation (or write “None”)."];
      if (!str(d, "day")) return ["day", "Please choose the day you prefer to visit."];
      if (!arr(d, "interests").length) return ["interests", "Please choose at least one area of interest."];
      if (d.consent !== true) return ["consent", "Please tick the consent box."];
      return null;
    },
  },
};

interface FieldKit {
  text: (
    k: string,
    label: string,
    o?: { required?: boolean; type?: string; autoComplete?: string; inputMode?: "numeric" | "text"; placeholder?: string; maxLength?: number; min?: number | string; max?: number | string; hint?: string }
  ) => ReactNode;
  textarea: (k: string, label: string, maxLength: number) => ReactNode;
  options: (k: string, label: string, values: string[], type: "radio" | "checkbox", o?: { required?: boolean; hint?: string; columns?: boolean }) => ReactNode;
  days: (cfg: RegConfig) => ReactNode;
  consent: (text: string) => ReactNode;
}

function Req() {
  return <span className="text-crimson"> *</span>;
}

// Retries network / busy errors with the SAME submission ID, so a retry can never create a second ticket.
const WAITS = [1500, 3000, 5000, 8000, 12000];

function RegForm({ kind, cfg, onBack, onDone }: { kind: Kind; cfg: RegConfig; onBack: () => void; onDone: (r: TicketResult) => void }) {
  const spec = SPECS[kind];
  const draftKey = `reg_draft_${kind}`;
  // An unfinished or failed attempt is restored with the same submission ID (never a duplicate ticket).
  const [draft] = useState(() => load<{ sid: string; data: Data } | null>(draftKey, null));
  const sid = useRef(draft?.sid ?? newId());
  const [data, setData] = useState<Data>(() => ({ ...spec.initial, ...(draft?.data ?? {}) }));
  const [bad, setBad] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState("");

  // Only one day configured → selected automatically, no question.
  const oneDay = cfg.days.length === 1 ? cfg.days[0] : "";
  const set = (k: string, v: string | string[] | boolean) => {
    setData((d) => {
      const next = { ...d, [k]: v };
      store(draftKey, { sid: sid.current, data: next });
      return next;
    });
    if (bad) {
      setBad("");
      setMsg("");
    }
  };

  const ring = (k: string) => (bad === k ? "!border-crimson" : "");
  const kit: FieldKit = {
    text: (k, label, o = {}) => (
      <div data-field={k}>
        <label className={LABEL} htmlFor={`f-${k}`}>
          {label}
          {o.required && <Req />}
        </label>
        <input
          id={`f-${k}`}
          name={k}
          type={o.type ?? "text"}
          className={`${INPUT} ${ring(k)}`}
          value={str(data, k)}
          onChange={(e) => set(k, e.target.value)}
          autoComplete={o.autoComplete ?? "off"}
          inputMode={o.inputMode}
          placeholder={o.placeholder}
          maxLength={o.maxLength}
          min={o.min}
          max={o.max}
        />
        {o.hint && <p className={HINT}>{o.hint}</p>}
      </div>
    ),
    textarea: (k, label, maxLength) => (
      <div data-field={k}>
        <label className={LABEL} htmlFor={`f-${k}`}>
          {label}
        </label>
        <textarea id={`f-${k}`} name={k} maxLength={maxLength} className={`${INPUT} min-h-[96px] resize-y`} value={str(data, k)} onChange={(e) => set(k, e.target.value)} />
      </div>
    ),
    options: (k, label, values, type, o = {}) => {
      const picked = type === "radio" ? [str(data, k)] : arr(data, k);
      return (
        <fieldset data-field={k} className={`mt-5 rounded-[12px] ${bad === k ? "outline outline-2 outline-crimson outline-offset-4" : ""}`}>
          <legend className="mb-2 text-[0.92rem] font-bold text-fg">
            {label}
            {o.required && <Req />}
          </legend>
          {o.hint && <p className={`${HINT} -mt-1 mb-2`}>{o.hint}</p>}
          <div className={`grid gap-2 ${o.columns ? "grid-cols-2 max-[640px]:grid-cols-1" : ""}`}>
            {values.map((v) => {
              const on = picked.includes(v);
              return (
                <label
                  key={v}
                  className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3 text-[0.98rem] leading-[1.4] transition-colors ${
                    on ? "border-gold bg-gold/[0.08] text-fg" : "border-line bg-paper-2 text-text-secondary hover:border-fg/40"
                  }`}
                >
                  <input
                    type={type}
                    name={k}
                    value={v}
                    checked={on}
                    onChange={(e) => {
                      if (type === "radio") set(k, v);
                      else set(k, e.target.checked ? [...arr(data, k), v] : arr(data, k).filter((x) => x !== v));
                    }}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#b8923a]"
                  />
                  <span>{v}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    },
    days: (c) => (oneDay ? null : kit.options("days", "Which day(s) will you attend?", c.days, "checkbox", { required: true })),
    consent: (text) => (
      <label
        data-field="consent"
        className={`mt-6 flex cursor-pointer items-start gap-3 rounded-[14px] border-2 p-4 text-[0.93rem] leading-[1.5] text-text-secondary ${
          bad === "consent" ? "border-crimson" : "border-gold/70"
        } bg-gold/[0.05]`}
      >
        <input type="checkbox" name="consent" checked={data.consent === true} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-[20px] w-[20px] shrink-0 accent-[#b8923a]" />
        <span>{text}</span>
      </label>
    ),
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const d: Data = { ...data };
    if (oneDay) d.days = [oneDay];
    const problem = spec.check(d);
    if (problem) {
      setBad(problem[0]);
      setMsg(problem[1]);
      document.querySelector(`[data-field="${problem[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setMsg("");
    setBusy("Registering…");
    const payload: Record<string, unknown> = { ...d, submissionId: sid.current };
    if (kind === "institution") {
      payload.students = Number(d.students);
      payload.staff = str(d, "staff") === "" ? 0 : Number(d.staff);
    }
    for (let attempt = 0; attempt <= WAITS.length; attempt++) {
      try {
        const res = await callWebApp<TicketResult | { ok: false; retry?: boolean; message?: string }>("register", [kind, payload]);
        if (res.ok === true) {
          store(draftKey, null);
          setBusy("");
          return onDone(res);
        }
        const fail = res as { retry?: boolean; message?: string };
        if (!fail.retry || attempt === WAITS.length) {
          setBusy("");
          setMsg(fail.message || "Could not register. Please try again.");
          return;
        }
        setBusy("Busy — retrying…");
      } catch {
        if (attempt === WAITS.length) break;
        setBusy("Connection slow — retrying…");
      }
      await new Promise((r) => setTimeout(r, WAITS[attempt]));
    }
    setBusy("");
    setMsg("Could not register. Please check your connection and press Register again — your details are saved.");
  }

  return (
    <div className="mx-auto max-w-[780px]">
      <BackLink onClick={onBack} />
      <form className={CARD} id="reg-form" data-kind={kind} onSubmit={submit} noValidate>
        <h2 className="font-gilda text-[32px] uppercase leading-[1.15] text-fg max-[640px]:text-[25px]">{spec.heading}</h2>
        <div className="mt-3 flex flex-col gap-3 text-[1rem] leading-[1.6] text-text-secondary">{spec.intro(cfg)}</div>
        <div className="mt-2">{spec.fields(cfg, kit)}</div>
        <button type="submit" id="reg-submit" className={`${GOLD} mt-7 w-full`} disabled={!!busy}>
          {busy || spec.submitLabel}
        </button>
        <p id="reg-msg" className={`mt-3 min-h-[1.2em] text-[0.95rem] leading-[1.45] ${ERR}`} role="alert">
          {msg}
        </p>
      </form>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-[0.95rem] text-text-secondary hover:text-gold-light" id="reg-back">
      ← All registration options
    </button>
  );
}

// ---------------------------------------------------------------- "Get my ticket"
function Lookup({ onBack, onFound }: { onBack: () => void; onFound: (list: TicketResult[]) => void }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!emailOk(email) || !phoneOk(phone)) return setMsg("Please enter a valid email and 10-digit mobile number.");
    setBusy(true);
    setMsg("");
    try {
      const res = await callWebApp<{ ok: boolean; message?: string; tickets?: TicketResult[] }>("lookupTicket", [email, phone]);
      if (res.ok && res.tickets?.length) onFound(res.tickets);
      else setMsg(res.message || "No ticket found for these details.");
    } catch {
      setMsg("Connection problem — please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-[620px]">
      <BackLink onClick={onBack} />
      <form className={CARD} id="lookup-form" onSubmit={submit} noValidate>
        <h2 className="font-gilda text-[32px] uppercase leading-[1.15] text-fg max-[640px]:text-[25px]">Get your ticket</h2>
        <p className="mt-2 text-[1rem] leading-[1.6] text-text-secondary">Enter the email and mobile number you registered with.</p>
        <label className={LABEL} htmlFor="lk-email">
          Registered email
        </label>
        <input id="lk-email" type="email" autoComplete="email" className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className={LABEL} htmlFor="lk-phone">
          Registered mobile number
        </label>
        <input id="lk-phone" type="tel" inputMode="numeric" autoComplete="tel" className={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit" id="lk-submit" className={`${GOLD} mt-6 w-full`} disabled={busy}>
          {busy ? "Looking up…" : "Show my ticket"}
        </button>
        <p id="lk-msg" className={`mt-3 min-h-[1.2em] text-[0.95rem] ${ERR}`} role="alert">
          {msg}
        </p>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------- tickets
function detailRows(t: TicketData): [string, string][] {
  const rows: [string, string][] = [["Ticket ID", t.id]];
  if (t.type === "Institution") {
    rows.push(["Institution", t.institution], ["Coordinator", t.name], ["Expected", `~${t.students ?? 0} students + ${t.staff ?? 0} staff`]);
  } else if (t.type === "Open Day") {
    rows.push(["Name", t.name], ["Category", "Open Day Visitor"], ["Accompanying", t.accompanying], ["Time", t.time]);
  } else {
    rows.push(["Name", t.name], ["Category", t.category]);
    if (t.institution) rows.push(["Institution / Org", t.institution]);
  }
  rows.push([t.type === "Open Day" ? "Visit day" : "Day(s)", t.days.join("\n")]);
  return rows;
}

function howTo(t: TicketData) {
  return t.type === "Institution"
    ? "This one pass covers all students of your institution who attend with their institution ID card — they do not need to register individually. Show this QR at the entry desk on arrival; at stalls, volunteers scan it to record your students' feedback."
    : "Show this QR code at the entry gate and at every stall you visit. The volunteer scans it, you confirm your details on their device, then leave your feedback and rating — no forms to fill again. This ticket is personal.";
}

function TicketCard({ r }: { r: TicketResult }) {
  const t = r.ticket;
  return (
    <article className="overflow-hidden rounded-[16px] border border-line bg-card" data-ticket={r.id}>
      <div className="relative isolate border-b border-gold/40 px-7 pt-6 pb-5 max-[640px]:px-5">
        <Sparkle className="absolute top-5 right-6 h-5 w-5 text-gold-light" />
        <Kicker>University Student Council · CHRIST University</Kicker>
        <div className="mt-2 font-gilda text-[30px] uppercase leading-[1.1] text-fg max-[640px]:text-[24px]">{t.title}</div>
        <div className="mt-1 text-[0.92rem] text-text-secondary">{t.kind}</div>
      </div>
      <div className="bg-gold px-5 py-2.5 text-center text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ink">{t.label}</div>
      <div className="grid grid-cols-[auto_1fr] items-start gap-7 p-7 max-[640px]:grid-cols-1 max-[640px]:gap-5 max-[640px]:p-5">
        <div className="mx-auto flex flex-col items-center">
          <div className="rounded-[12px] bg-white p-2.5">
            <img src={`data:image/gif;base64,${r.gif}`} alt={`QR code for ticket ${r.id}`} width={220} height={220} className="h-[220px] w-[220px] [image-rendering:pixelated]" />
          </div>
          <div className="mt-3 font-mono text-[1.15rem] tracking-[0.18em] text-gold-light">{r.id}</div>
        </div>
        <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2.5 text-[0.98rem] max-[400px]:grid-cols-[96px_1fr]">
          {detailRows(t).map(([k, v], i) => (
            <div key={k} className="contents">
              <dt className="pt-0.5 text-[0.84rem] text-text-muted">{k}</dt>
              <dd className={`m-0 whitespace-pre-line break-words ${i === 1 ? "font-bold text-fg" : "text-text-secondary"}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="border-t border-line px-7 py-4 text-[0.88rem] leading-[1.55] text-text-secondary max-[640px]:px-5">{howTo(t)}</p>
      <p className="px-7 pb-5 text-[0.8rem] text-text-muted max-[640px]:px-5">{t.venue}</p>
    </article>
  );
}

function Tickets({ results, onAgain, onHome }: { results: { list: TicketResult[]; from: Kind | "lookup" }; onAgain: (k: Kind) => void; onHome: () => void }) {
  const [printing, setPrinting] = useState(false);
  const first = results.list[0];
  const banner =
    results.from === "lookup"
      ? ""
      : first.existing
        ? `You were already registered for ${first.label} — here is your ticket again.`
        : `You're registered for ${first.label}! Your ticket is below and a copy is on its way to your email.`;

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const t = setTimeout(() => window.print(), 80);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);

  return (
    <div className="mx-auto flex max-w-[780px] flex-col gap-4" id="tickets">
      {banner && (
        <div id="reg-ok" className="rounded-[16px] border border-emerald-400/35 bg-emerald-400/[0.08] px-5 py-4 text-[1rem] leading-[1.5] text-emerald-200" role="status">
          {banner}
        </div>
      )}
      {results.list.map((r) => (
        <div key={r.id + r.label} className="flex flex-col gap-3">
          <TicketCard r={r} />
          <div className="grid grid-cols-2 gap-3 max-[460px]:grid-cols-1">
            <a className={OUTLINE} download={`ticket-${r.id}.gif`} href={`data:image/gif;base64,${r.gif}`} id={`save-${r.id}`}>
              Save QR image
            </a>
            <button type="button" className={OUTLINE} onClick={() => setPrinting(true)} id={`print-${r.id}`}>
              Print / Save PDF
            </button>
          </div>
        </div>
      ))}
      <p className="text-center text-[0.88rem] text-text-muted">Tip: take a screenshot of this ticket so you can show it even if the campus network is slow.</p>
      {results.from !== "lookup" && (
        <button type="button" className={GOLD} onClick={() => onAgain(results.from as Kind)} id="reg-again">
          Register {results.from === "institution" ? "another institution" : "another person"}
        </button>
      )}
      <button type="button" className={OUTLINE} onClick={onHome}>
        All registration options
      </button>
      {printing && <PrintTickets list={results.list} />}
    </div>
  );
}

/** Plain black-on-white tickets, shown only when printing / saving as PDF. */
function PrintTickets({ list }: { list: TicketResult[] }) {
  const [el] = useState(() => {
    const d = document.createElement("div");
    d.id = "rg-print";
    return d;
  });
  useEffect(() => {
    document.body.appendChild(el);
    return () => el.remove();
  }, [el]);
  return createPortal(
    <>
      <style>{`
        #rg-print { display: none; }
        @media print {
          @page { size: A4 portrait; margin: 14mm; }
          :root, html, body { color-scheme: light !important; background: #fff !important; }
          body > *:not(#rg-print) { display: none !important; }
          #rg-print { display: block !important; color: #000; font-family: Arial, "Noto Sans", sans-serif; }
          #rg-print .t { border: 2px solid #000; border-radius: 10px; padding: 18px 22px; margin-bottom: 16px; break-inside: avoid; }
          #rg-print .band { background: #e9dfc2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 6px 10px; font-weight: bold; text-transform: uppercase; letter-spacing: .06em; font-size: 10pt; text-align: center; margin: 10px 0 14px; }
          #rg-print .row { display: flex; gap: 22px; align-items: flex-start; }
          #rg-print img { width: 200px; height: 200px; image-rendering: pixelated; }
          #rg-print dl { display: grid; grid-template-columns: 110px 1fr; gap: 6px 12px; margin: 0; font-size: 11pt; }
          #rg-print dt { color: #555; }
          #rg-print dd { margin: 0; white-space: pre-line; }
          #rg-print .id { font-family: "Courier New", monospace; font-size: 14pt; letter-spacing: .12em; text-align: center; margin-top: 6px; }
        }
      `}</style>
      {list.map((r) => (
        <div className="t" key={r.id + r.label}>
          <div style={{ fontSize: "9pt", letterSpacing: ".14em", textTransform: "uppercase" }}>University Student Council · CHRIST (Deemed to be University)</div>
          <div style={{ fontSize: "20pt", fontWeight: "bold", marginTop: "4px" }}>{r.ticket.title}</div>
          <div style={{ fontSize: "10pt" }}>{r.ticket.kind}</div>
          <div className="band">{r.ticket.label}</div>
          <div className="row">
            <div>
              <img src={`data:image/gif;base64,${r.gif}`} alt="" />
              <div className="id">{r.id}</div>
            </div>
            <dl>
              {detailRows(r.ticket).map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p style={{ fontSize: "9.5pt", marginTop: "12px" }}>{howTo(r.ticket)}</p>
          <p style={{ fontSize: "9pt", color: "#555" }}>{r.ticket.venue}</p>
        </div>
      ))}
    </>,
    el
  );
}
