"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Kicker, Sparkle } from "@/components/daksh/kit";
import { DakshLogo } from "@/components/daksh/ui";
import { api, deviceId, hourLabel, load, store } from "@/lib/footfall/core";

// ---------------------------------------------------------------- data from the web app (dashStats)
type StallDay = [visits: number, unique: number, ratingSum: number, ratings: number];
interface DashStall {
  code: string;
  no: string;
  name: string;
  dept: string;
  loc: string;
  last: number | null;
  phone: boolean;
  active: boolean;
  d: Record<string, StallDay>;
}
interface DashDay {
  label: string;
  gate: { people: number; scans: number; unique: number; hours: Record<string, number> };
  visitors: number;
  categories: Record<string, number>;
  hours: Record<string, number>;
}
interface Dash {
  updated: number;
  today: string;
  registrations: { total: number; Individual?: number; Institution?: number; "Open Day"?: number; today: number; todayByType: Record<string, number> };
  dates: { date: string; label: string }[];
  days: Record<string, DashDay>;
  stalls: DashStall[];
  feedback: { at: number; code: string; rating: number | null; text: string; date: string }[];
  gates: number;
}
interface DashSession {
  code: string;
  pin: string;
  name: string;
}

// ---------------------------------------------------------------- styles (same as the scanner)
const BTN =
  "inline-flex items-center justify-center gap-2 rounded-[14px] px-5 pt-[12px] pb-[10px] text-[0.95rem] font-bold leading-[1.2] tracking-[0.02em] transition-all duration-200 disabled:opacity-55 cursor-pointer";
const GOLD = `${BTN} bg-gold text-ink hover:bg-gold-light`;
const OUTLINE = `${BTN} border-2 border-fg/40 text-fg hover:border-fg hover:bg-fg/10`;
const CARD = "rounded-[16px] border border-line bg-card p-5 max-[480px]:p-4";
const INPUT =
  "w-full rounded-[12px] border border-line bg-paper-2 px-4 py-3 text-[1rem] text-fg outline-none transition-colors placeholder:text-text-muted focus:border-gold-dark";
const LABEL = "mb-2 mt-4 block text-[0.86rem] font-bold text-text-secondary";
const CHIP = "cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.86rem] font-bold transition-colors";
const chip = (on: boolean) => `${CHIP} ${on ? "border-gold bg-gold text-ink" : "border-line text-text-secondary hover:border-fg/50 hover:text-fg"}`;

const REFRESH_MS = 30_000;
const ALL = "all";
const nf = (n: number) => n.toLocaleString("en-IN");
const avgOf = (sum: number, n: number) => (n ? Math.round((sum / n) * 10) / 10 : null);

function ago(t: number, now: number) {
  const m = Math.max(0, Math.round((now - t) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h} h ${m % 60} min ago` : new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function H2({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3.5 flex flex-wrap items-end justify-between gap-2">
      <h2 className="font-gilda text-[22px] uppercase leading-[1.15] text-fg">{children}</h2>
      {right}
    </div>
  );
}

// ---------------------------------------------------------------- app
export default function Dashboard() {
  const [session, setSession] = useState<DashSession | null>(() => load<DashSession | null>("dash_session", null));
  const [dash, setDash] = useState<Dash | null>(() => load<Dash | null>("dash_data", null));
  const [err, setErr] = useState("");
  const [signedOut, setSignedOut] = useState("");
  const [fetchedAt, setFetchedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const refresh = useCallback(async () => {
    if (!session) return;
    try {
      const res = await api<{ ok: boolean; dash?: Dash | null; auth?: boolean; signedOut?: boolean; message?: string }>("dashStats", [
        session.code,
        session.pin,
        deviceId(),
      ]);
      if (res.ok) {
        if (res.dash) {
          setDash(res.dash);
          store("dash_data", res.dash);
        }
        setErr("");
        setFetchedAt(Date.now());
      } else if (res.auth || res.signedOut) {
        store("dash_session", null);
        store("dash_data", null);
        setSession(null);
        setDash(null);
        setSignedOut(res.message || "Signed out.");
      } else setErr(res.message || "Could not refresh.");
    } catch {
      setErr("No connection — showing the last numbers received.");
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const first = setTimeout(refresh, 0);
    const t = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
      setNow(Date.now());
    }, REFRESH_MS);
    const vis = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        refresh();
      }
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearTimeout(first);
      clearInterval(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [session, refresh]);

  async function logout() {
    if (!session) return;
    try {
      await api("dashLogout", [session.code, session.pin, deviceId()]);
    } catch {
      if (!window.confirm("No connection, so this device's place can't be freed now. Log out anyway?")) return;
    }
    store("dash_session", null);
    store("dash_data", null);
    setSession(null);
    setDash(null);
  }

  return (
    <div className="min-h-screen bg-paper text-fg">
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-6 pb-16 max-[640px]:px-4 max-[640px]:pt-4">
        {!session ? (
          <Login
            note={signedOut}
            onIn={(s) => {
              store("dash_session", s);
              setSignedOut("");
              setSession(s);
            }}
          />
        ) : (
          <>
            <Header session={session} dash={dash} fetchedAt={fetchedAt} now={now} err={err} onRefresh={refresh} onLogout={logout} />
            {dash ? (
              <Body dash={dash} now={now} />
            ) : (
              <div className={`${CARD} mt-5 text-text-secondary`} id="dash-wait">
                Loading the first numbers…
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- sign in
function Login({ note, onIn }: { note: string; onIn: (s: DashSession) => void }) {
  const [code, setCode] = useState(() => load("dash_last_code", ""));
  const [pin, setPin] = useState("");
  const [name, setName] = useState(() => load("dash_last_name", ""));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c || !pin.trim()) return setMsg("Enter the dashboard code and PIN.");
    if (name.trim().length < 2) return setMsg("Enter your name or role (e.g. Director, Coordinator 2).");
    setBusy(true);
    setMsg("");
    try {
      const res = await api<{ ok: boolean; message?: string }>("dashLogin", [c, pin.trim(), deviceId(), name.trim()]);
      if (!res.ok) return setMsg(res.message || "Could not sign in.");
      store("dash_last_code", c);
      store("dash_last_name", name.trim());
      onIn({ code: c, pin: pin.trim(), name: name.trim() });
    } catch {
      setMsg("No connection. Check the network and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[480px] pt-[6vh] max-[640px]:pt-2">
      <section className="relative isolate mb-5 overflow-hidden rounded-[16px] border border-line bg-card px-6 pt-7 pb-6 max-[480px]:px-5">
        <Sparkle className="absolute top-6 right-6 h-5 w-5 text-gold-light" />
        <Kicker>Organisers only</Kicker>
        <h1 className="mt-3 flex flex-col gap-1">
          <DakshLogo light className="w-[160px]" />
          <span className="font-gilda text-[24px] uppercase leading-none text-fg">
            Live <span className="text-gold-light">dashboard</span>
          </span>
        </h1>
        <p className="mt-3 text-[0.95rem] leading-[1.5] text-text-secondary">
          Registrations, gate entries and stall footfall for Daksh &amp; Open Day 2026, updated every minute. Sign in with the dashboard code and PIN from the council team — it works on up to 6 devices.
        </p>
      </section>
      <form className={CARD} id="dl" onSubmit={submit}>
        {note && (
          <div className="mb-3 rounded-[12px] bg-amber-400/10 px-3.5 py-2.5 text-[0.9rem] leading-[1.45] text-amber-200" id="dash-note">
            {note}
          </div>
        )}
        <label className={`${LABEL} mt-0`} htmlFor="d-code">
          Dashboard code
        </label>
        <input id="d-code" className={INPUT} value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" placeholder="e.g. DASH" />
        <label className={LABEL} htmlFor="d-pin">
          PIN
        </label>
        <input id="d-pin" type="password" inputMode="numeric" className={INPUT} value={pin} onChange={(e) => setPin(e.target.value)} autoComplete="off" placeholder="4-digit PIN" />
        <label className={LABEL} htmlFor="d-name">
          Your name / role
        </label>
        <input id="d-name" className={INPUT} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="name" placeholder="e.g. Director, Coordinator 2" />
        <button type="submit" id="d-in" className={`${GOLD} mt-5 w-full`} disabled={busy}>
          {busy ? "Signing in…" : "Open dashboard"}
        </button>
        <div id="d-msg" className="mt-3 min-h-[1em] text-[0.9rem] text-[#f08f8f]" role="alert">
          {msg}
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------- header
function Header({
  session,
  dash,
  fetchedAt,
  now,
  err,
  onRefresh,
  onLogout,
}: {
  session: DashSession;
  dash: Dash | null;
  fetchedAt: number;
  now: number;
  err: string;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  const [spin, setSpin] = useState(false);
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-line bg-card px-6 py-4 max-[640px]:px-4">
      <div className="flex items-center gap-4">
        <DakshLogo light className="w-[118px] max-[480px]:w-[96px]" />
        <div>
          <div className="font-gilda text-[21px] uppercase leading-none text-fg max-[480px]:text-[18px]">
            Live <span className="text-gold-light">dashboard</span>
          </div>
          <div className="mt-1 text-[0.82rem] text-text-muted" id="dash-updated">
            {dash ? `Numbers as of ${new Date(dash.updated).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Waiting for numbers"}
            {fetchedAt ? ` · checked ${ago(fetchedAt, Math.max(now, fetchedAt))}` : ""}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[0.88rem] text-text-secondary" id="dash-who">
          {session.name}
        </span>
        <button
          type="button"
          className={OUTLINE}
          id="dash-refresh"
          onClick={async () => {
            setSpin(true);
            await onRefresh();
            setSpin(false);
          }}
          disabled={spin}
        >
          {spin ? "Refreshing…" : "Refresh"}
        </button>
        <button type="button" className={OUTLINE} id="dash-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
      {err && (
        <div className="w-full rounded-[12px] bg-amber-400/10 px-3.5 py-2 text-[0.88rem] text-amber-200" id="dash-err">
          {err}
        </div>
      )}
    </header>
  );
}

// ---------------------------------------------------------------- body
type Status = "active" | "quiet" | "idle" | "none";
interface Row {
  s: DashStall;
  visits: number;
  unique: number;
  rating: number | null;
  ratings: number;
  status: Status;
  attention: string;
}

function Body({ dash, now }: { dash: Dash; now: number }) {
  const defaultDay = dash.days[dash.today] ? dash.today : dash.dates.length ? dash.dates[dash.dates.length - 1].date : ALL;
  const [day, setDay] = useState<string>(defaultDay);
  const [area, setArea] = useState("");
  const dayKey = day !== ALL && !dash.days[day] ? defaultDay : day;
  const isToday = dayKey === dash.today;
  const dates = useMemo(() => (dayKey === ALL ? dash.dates.map((d) => d.date) : [dayKey]), [dash, dayKey]);

  const totals = useMemo(() => {
    const t = { gate: 0, gateUnique: 0, visitors: 0, visits: 0, rSum: 0, rN: 0, hours: {} as Record<string, number>, gateHours: {} as Record<string, number>, cats: {} as Record<string, number> };
    for (const date of dates) {
      const d = dash.days[date];
      if (!d) continue;
      t.gate += d.gate.people;
      t.gateUnique += d.gate.unique;
      t.visitors += d.visitors;
      for (const [h, n] of Object.entries(d.hours)) t.hours[h] = (t.hours[h] || 0) + n;
      for (const [h, n] of Object.entries(d.gate.hours)) t.gateHours[h] = (t.gateHours[h] || 0) + n;
      for (const [c, n] of Object.entries(d.categories)) t.cats[c] = (t.cats[c] || 0) + n;
    }
    for (const s of dash.stalls)
      for (const date of dates) {
        const v = s.d[date];
        if (v) {
          t.visits += v[0];
          t.rSum += v[2];
          t.rN += v[3];
        }
      }
    return t;
  }, [dash, dates]);

  const rows: Row[] = useMemo(
    () =>
      dash.stalls.map((s) => {
        let visits = 0,
          unique = 0,
          rSum = 0,
          rN = 0;
        for (const date of dates) {
          const v = s.d[date];
          if (v) {
            visits += v[0];
            unique += v[1];
            rSum += v[2];
            rN += v[3];
          }
        }
        const since = s.last ? now - s.last : Infinity;
        const status: Status = !s.last ? "none" : since <= 15 * 60000 ? "active" : since <= 60 * 60000 ? "quiet" : "idle";
        let attention = "";
        if (isToday) {
          if (!s.phone) attention = "No phone signed in";
          else if (!s.d[dash.today]) attention = "No scans yet today";
          else if (since > 30 * 60000) attention = "No scans for 30+ min";
        }
        return { s, visits, unique, rating: avgOf(rSum, rN), ratings: rN, status, attention };
      }),
    [dash, dates, now, isToday]
  );

  const activeNow = rows.filter((r) => r.status === "active").length;
  const phones = dash.stalls.filter((s) => s.phone).length;
  const reg = dash.registrations;

  return (
    <div className="flex flex-col gap-5" id="dash">
      {/* day picker */}
      <div className="flex flex-wrap items-center gap-2" id="dash-days">
        {dash.dates.map((d) => (
          <button key={d.date} type="button" className={chip(dayKey === d.date)} onClick={() => setDay(d.date)} data-day={d.date}>
            {d.label}
            {d.date === dash.today ? " · today" : ""}
          </button>
        ))}
        <button type="button" className={chip(dayKey === ALL)} onClick={() => setDay(ALL)} data-day={ALL}>
          All days
        </button>
        {!dash.dates.length && <span className="text-[0.9rem] text-text-muted">No scans recorded yet.</span>}
      </div>

      {/* headline numbers */}
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[400px]:gap-2" id="kpis">
        <Kpi label="Registrations" value={nf(reg.total)} sub={`+${nf(reg.today)} today`} id="k-reg" />
        <Kpi label="Entries at gate" value={nf(totals.gate)} sub={`${nf(totals.gateUnique)} different tickets`} id="k-gate" />
        <Kpi label="Stall visits" value={nf(totals.visits)} sub={`${nf(totals.visitors)} visitors at stalls${dates.length > 1 ? " (per day, added)" : ""}`} id="k-visits" />
        <Kpi label="Average rating" value={totals.rN ? `${avgOf(totals.rSum, totals.rN)} ★` : "—"} sub={`${nf(totals.rN)} ratings`} id="k-rating" />
        <Kpi label="Stalls scanning now" value={`${activeNow} / ${dash.stalls.length}`} sub="a scan in the last 15 min" id="k-active" />
        <Kpi label="Phones signed in" value={`${phones} / ${dash.stalls.length}`} sub={`plus ${dash.gates} gate scanner${dash.gates === 1 ? "" : "s"}`} id="k-phones" />
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-5 max-[980px]:grid-cols-1">
        <section className={CARD} id="hourly">
          <H2>Hour by hour</H2>
          <Hourly visits={totals.hours} gate={totals.gateHours} />
        </section>
        <section className={CARD} id="mix">
          <H2>Registrations</H2>
          <Bars
            items={[
              ["Individual", reg.Individual || 0],
              ["Institution", reg.Institution || 0],
              ["Open Day", reg["Open Day"] || 0],
            ]}
          />
          <div className="mt-6">
            <H2>Visitors at stalls</H2>
            {Object.keys(totals.cats).length ? (
              <Bars items={Object.entries(totals.cats).sort((a, b) => b[1] - a[1])} />
            ) : (
              <p className="text-[0.9rem] text-text-muted">No stall visits yet.</p>
            )}
          </div>
        </section>
      </div>

      <Areas
        rows={rows}
        isToday={isToday}
        onPick={(a) => {
          setArea(a);
          document.getElementById("stalls")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
      <StallTable rows={rows} now={now} isToday={isToday} area={area} setArea={setArea} dayLabel={dayKey === ALL ? "All days" : dash.days[dayKey]?.label || dayKey} />
      <Feedback dash={dash} dates={dates} now={now} />
    </div>
  );
}

function Kpi({ label, value, sub, id }: { label: string; value: string; sub: string; id: string }) {
  return (
    <div className="rounded-[16px] border border-line bg-card px-5 py-4 max-[480px]:px-4 max-[480px]:py-3.5" id={id}>
      <div className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-text-muted max-[480px]:text-[0.7rem]">{label}</div>
      <div className="mt-1.5 font-gilda text-[34px] leading-none text-fg max-[480px]:text-[26px]" data-v>
        {value}
      </div>
      <div className="mt-1.5 text-[0.82rem] text-text-secondary max-[480px]:text-[0.76rem]">{sub}</div>
    </div>
  );
}

function Bars({ items }: { items: [string, number][] }) {
  const max = Math.max(1, ...items.map((i) => i[1]));
  const total = items.reduce((a, b) => a + b[1], 0);
  return (
    <div className="flex flex-col gap-2.5">
      {items.map(([k, v]) => (
        <div key={k} data-bar={k}>
          <div className="mb-1 flex justify-between gap-3 text-[0.9rem]">
            <span className="text-text-secondary">{k}</span>
            <span className="font-bold text-fg">
              {nf(v)}{" "}
              <span className="ml-1 text-[0.8rem] font-normal text-text-muted">{total ? Math.round((v / total) * 100) : 0}%</span>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-paper-2">
            <div className="h-full rounded-full bg-gold" style={{ width: `${(v / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Hourly({ visits, gate }: { visits: Record<string, number>; gate: Record<string, number> }) {
  const hours: number[] = [];
  for (let h = 9; h <= 16; h++) hours.push(h);
  for (const h of [...Object.keys(visits), ...Object.keys(gate)].map(Number)) if (!hours.includes(h)) hours.push(h);
  hours.sort((a, b) => a - b);
  const max = Math.max(1, ...hours.map((h) => Math.max(visits[h] || 0, gate[h] || 0)));
  return (
    <>
      <div className="mb-3 flex gap-4 text-[0.82rem] text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold" /> Stall visits
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-fg/45" /> Gate entries
        </span>
      </div>
      <div className="flex h-[210px] items-end gap-1.5 max-[480px]:h-[170px] max-[480px]:gap-1" id="hours">
        {hours.map((h) => (
          <div key={h} className="flex h-full min-w-0 flex-1 flex-col justify-end" data-hour={h} title={`${hourLabel(h)}: ${visits[h] || 0} stall visits, ${gate[h] || 0} gate entries`}>
            <div className="mb-1 truncate text-center text-[0.72rem] font-bold text-fg max-[480px]:text-[0.62rem]">{visits[h] || ""}</div>
            <div className="flex flex-1 items-end justify-center gap-[3px]">
              <div className="w-1/2 max-w-[22px] rounded-t-[4px] bg-gold" style={{ height: `${((visits[h] || 0) / max) * 100}%` }} />
              <div className="w-1/2 max-w-[22px] rounded-t-[4px] bg-fg/45" style={{ height: `${((gate[h] || 0) / max) * 100}%` }} />
            </div>
            <div className="mt-1.5 truncate text-center text-[0.7rem] text-text-muted max-[480px]:text-[0.6rem]">{h < 12 ? `${h || 12}AM` : `${h % 12 || 12}PM`}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- areas (coordinators' zones)
function Areas({ rows, isToday, onPick }: { rows: Row[]; isToday: boolean; onPick: (area: string) => void }) {
  const areas = useMemo(() => {
    const m = new Map<string, { stalls: number; visits: number; rSum: number; rN: number; active: number; attention: number }>();
    for (const r of rows) {
      const k = r.s.loc || "Other";
      const a = m.get(k) || { stalls: 0, visits: 0, rSum: 0, rN: 0, active: 0, attention: 0 };
      a.stalls++;
      a.visits += r.visits;
      if (r.rating !== null) {
        a.rSum += r.rating * r.ratings;
        a.rN += r.ratings;
      }
      if (r.status === "active") a.active++;
      if (r.attention) a.attention++;
      m.set(k, a);
    }
    return [...m.entries()];
  }, [rows]);
  if (areas.length < 2) return null;
  return (
    <section className={CARD} id="areas">
      <H2>By area</H2>
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
        {areas.map(([k, a]) => (
          <button
            type="button"
            key={k}
            className="cursor-pointer rounded-[12px] border border-line bg-paper-2 px-4 py-3.5 text-left transition-colors hover:border-gold"
            data-area={k}
            onClick={() => onPick(k === "Other" ? "" : k)}
            title="Show these stalls"
          >
            <div className="text-[0.95rem] font-bold leading-[1.3] text-fg">{k}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.84rem] text-text-secondary">
              <span>
                <b className="text-fg">{nf(a.visits)}</b> visits
              </span>
              <span>
                {a.stalls} stall{a.stalls === 1 ? "" : "s"}
              </span>
              <span>{a.rN ? `${avgOf(a.rSum, a.rN)} ★` : "no ratings"}</span>
            </div>
            {isToday && (
              <div className="mt-1.5 flex flex-wrap gap-x-4 text-[0.82rem]">
                <span className="text-emerald-300">{a.active} scanning now</span>
                {a.attention > 0 && <span className="text-amber-300">{a.attention} need a check</span>}
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- stalls table
type Sort = "visits" | "no" | "rating" | "last" | "name";
const DOT: Record<Status, string> = { active: "bg-emerald-400", quiet: "bg-amber-400", idle: "bg-crimson", none: "bg-fg/25" };

function stallNo(no: string) {
  const m = /^(\d+)\s*\(?([A-Za-z]?)/.exec(no || "");
  return m ? Number(m[1]) + (m[2] ? (m[2].toUpperCase().charCodeAt(0) - 64) / 100 : 0) : 9999;
}

const PAGE = 25;

function StallTable({
  rows,
  now,
  isToday,
  dayLabel,
  area,
  setArea,
}: {
  rows: Row[];
  now: number;
  isToday: boolean;
  dayLabel: string;
  area: string;
  setArea: (a: string) => void;
}) {
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const [only, setOnly] = useState<"" | "attention" | "none">("");
  const [sort, setSort] = useState<Sort>("visits");
  const areas = useMemo(() => [...new Set(rows.map((r) => r.s.loc).filter(Boolean))], [rows]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (!area || r.s.loc === area) &&
        (!only || (only === "attention" ? !!r.attention : r.visits === 0)) &&
        (!t || `${r.s.no} ${r.s.code} ${r.s.name} ${r.s.dept}`.toLowerCase().includes(t))
    );
    const by: Record<Sort, (a: Row, b: Row) => number> = {
      visits: (a, b) => b.visits - a.visits || stallNo(a.s.no) - stallNo(b.s.no),
      no: (a, b) => stallNo(a.s.no) - stallNo(b.s.no) || a.s.code.localeCompare(b.s.code),
      rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || b.ratings - a.ratings,
      last: (a, b) => (b.s.last ?? 0) - (a.s.last ?? 0),
      name: (a, b) => a.s.name.localeCompare(b.s.name),
    };
    return list.sort(by[sort]);
  }, [rows, q, area, only, sort]);

  const attentionCount = rows.filter((r) => r.attention).length;

  async function exportXlsx() {
    const { downloadXlsx } = await import("@/lib/footfall/xlsx");
    downloadXlsx(
      `daksh-stalls-${dayLabel.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase()}.xlsx`,
      "Stalls",
      ["Stall No.", "Stall Code", "Stall", "Run By", "Location", "Visits", "Unique visitors", "Avg rating", "Ratings", "Last scan", "Phone signed in", ...(isToday ? ["Needs a check"] : [])],
      shown.map((r) => [
        r.s.no,
        r.s.code,
        r.s.name,
        r.s.dept,
        r.s.loc,
        r.visits,
        r.unique,
        r.rating ?? "",
        r.ratings,
        r.s.last ? new Date(r.s.last).toLocaleString("en-IN") : "",
        r.s.phone ? "Yes" : "No",
        ...(isToday ? [r.attention] : []),
      ]),
      [9, 11, 44, 36, 30, 8, 10, 10, 8, 20, 12, 22]
    );
  }

  return (
    <section className={CARD} id="stalls">
      <H2
        right={
          <button type="button" className={OUTLINE} onClick={exportXlsx} id="st-export">
            Download Excel
          </button>
        }
      >
        Stalls — {dayLabel}
      </H2>
      <div className="mb-3 grid grid-cols-[1.4fr_1fr_auto] gap-2.5 max-[760px]:grid-cols-1">
        <input className={INPUT} placeholder="Search stall, number or department" value={q} onChange={(e) => setQ(e.target.value)} id="st-q" />
        <select className={INPUT} value={area} onChange={(e) => setArea(e.target.value)} id="st-area">
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select className={INPUT} value={sort} onChange={(e) => setSort(e.target.value as Sort)} id="st-sort">
          <option value="visits">Most visits</option>
          <option value="no">Stall number</option>
          <option value="rating">Best rated</option>
          <option value="last">Latest scan</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className={chip(only === "")} onClick={() => setOnly("")} data-only="all">
          All ({rows.length})
        </button>
        {isToday && (
          <button type="button" className={chip(only === "attention")} onClick={() => setOnly("attention")} data-only="attention">
            Needs a check ({attentionCount})
          </button>
        )}
        <button type="button" className={chip(only === "none")} onClick={() => setOnly("none")} data-only="none">
          No visits ({rows.filter((r) => r.visits === 0).length})
        </button>
      </div>

      <div className="grid grid-cols-[52px_minmax(0,1fr)_78px_78px_74px_150px] items-center gap-x-3 border-b border-line px-2 pb-2 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-muted max-[760px]:hidden">
        <span>No.</span>
        <span>Stall</span>
        <span className="text-right">Visits</span>
        <span className="text-right">Unique</span>
        <span className="text-right">Rating</span>
        <span>Last scan</span>
      </div>
      <div className="flex flex-col" id="st-rows">
        {(all ? shown : shown.slice(0, PAGE)).map((r) => (
          <div
            key={r.s.code}
            data-code={r.s.code}
            className="grid grid-cols-[52px_minmax(0,1fr)_78px_78px_74px_150px] items-center gap-x-3 border-b border-line/70 px-2 py-2.5 max-[760px]:grid-cols-[44px_minmax(0,1fr)_auto] max-[760px]:gap-y-1"
          >
            <span className="font-mono text-[0.9rem] text-gold-light">{r.s.no || "—"}</span>
            <div className="min-w-0">
              <div className="truncate text-[0.95rem] font-bold text-fg" title={r.s.name}>
                {r.s.name}
              </div>
              <div className="truncate text-[0.78rem] text-text-muted">
                {r.s.code}
                {r.s.loc ? ` · ${r.s.loc}` : ""}
                {!r.s.active ? " · inactive" : ""}
              </div>
              {r.attention && <div className="mt-0.5 text-[0.78rem] font-bold text-amber-300">{r.attention}</div>}
            </div>
            <span className="text-right font-gilda text-[22px] leading-none text-fg max-[760px]:row-span-2 max-[760px]:self-center" data-visits>
              {nf(r.visits)}
            </span>
            <span className="text-right text-[0.92rem] text-text-secondary max-[760px]:hidden">{nf(r.unique)}</span>
            <span className="text-right text-[0.92rem] text-text-secondary max-[760px]:hidden">{r.rating !== null ? `${r.rating} ★` : "—"}</span>
            <span className="flex items-center gap-2 text-[0.84rem] text-text-secondary max-[760px]:col-start-2 max-[760px]:text-[0.78rem]">
              <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[r.status]}`} />
              {r.s.last ? ago(r.s.last, now) : "No scans yet"}
              <span className="hidden max-[760px]:inline">
                {r.rating !== null ? ` · ${r.rating} ★` : ""} · {nf(r.unique)} unique
              </span>
            </span>
          </div>
        ))}
        {!shown.length && <p className="px-2 py-6 text-center text-[0.92rem] text-text-muted">No stalls match.</p>}
      </div>
      {shown.length > PAGE && (
        <button type="button" className={`${OUTLINE} mt-4 w-full`} onClick={() => setAll(!all)} id="st-more">
          {all ? "Show fewer" : `Show all ${shown.length} stalls`}
        </button>
      )}
      <p className="mt-3 text-[0.8rem] text-text-muted">
        Dot: green = scanned in the last 15 min · amber = within the hour · red = over an hour ago · grey = no scans yet. Unique = different visitors.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------- feedback
function Feedback({ dash, dates, now }: { dash: Dash; dates: string[]; now: number }) {
  const names = useMemo(() => Object.fromEntries(dash.stalls.map((s) => [s.code, s])), [dash]);
  const [more, setMore] = useState(false);
  const all = dash.feedback.filter((f) => dates.includes(f.date));
  const list = more ? all : all.slice(0, 10);
  return (
    <section className={CARD} id="feedback">
      <H2>Latest feedback</H2>
      {list.length ? (
        <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
          {list.map((f, i) => (
            <div key={i} className="rounded-[12px] border border-line bg-paper-2 px-4 py-3" data-fb>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 truncate text-[0.84rem] font-bold text-fg">
                  {names[f.code]?.no ? `${names[f.code].no}. ` : ""}
                  {names[f.code]?.name || f.code}
                </div>
                {f.rating ? <span className="shrink-0 text-[0.84rem] text-gold-light">{"★".repeat(f.rating)}</span> : null}
              </div>
              <p className="mt-1.5 text-[0.92rem] leading-[1.5] text-text-secondary">{f.text}</p>
              <div className="mt-1 text-[0.76rem] text-text-muted">{ago(f.at, now)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[0.9rem] text-text-muted">No written feedback yet.</p>
      )}
      {all.length > 10 && (
        <button type="button" className={`${OUTLINE} mt-4 w-full`} onClick={() => setMore(!more)} id="fb-more">
          {more ? "Show fewer" : `Show all ${all.length}`}
        </button>
      )}
    </section>
  );
}
