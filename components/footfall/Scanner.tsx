"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Kicker, Sparkle } from "@/components/daksh/kit";
import { DakshLogo } from "@/components/daksh/ui";
import {
  api,
  categoryLabel,
  checkTicket,
  dayNote,
  DAY_LABELS,
  getHistory,
  getQueue,
  hourLabel,
  isPersistent,
  load,
  newRecord,
  setHistory,
  setQueue,
  store,
  timeOf,
  ymd,
  type HistoryItem,
  type ScanRecord,
  type Session,
  type StallStats,
  type Ticket,
} from "@/lib/footfall/core";
import { decodeFile, decodeFrame } from "@/lib/footfall/decode";
import { DAKSH } from "@/lib/daksh";

type Screen =
  | { k: "scan"; msg?: string }
  | { k: "manual" }
  | { k: "invalid" }
  | { k: "gateGroup"; t: Ticket; prev?: HistoryItem; note: string; manual: boolean }
  | { k: "gateDone"; t: Ticket; n: number; prev?: HistoryItem; note: string }
  | { k: "stall"; t: Ticket; prev?: HistoryItem; note: string; manual: boolean }
  | { k: "thanks"; count: number }
  | { k: "stats" };

// ---------------------------------------------------------------- shared styles
const BTN =
  "inline-flex w-full items-center justify-center gap-2.5 rounded-[16px] px-6 pt-[15px] pb-[13px] text-[1rem] font-bold leading-[1.2] tracking-[0.02em] transition-all duration-200 disabled:opacity-55 cursor-pointer";
const GOLD = `${BTN} bg-gold text-ink hover:bg-gold-light`;
const OUTLINE = `${BTN} border-2 border-fg/50 text-fg hover:border-fg hover:bg-fg/10`;
const LINK = "mt-1 w-full cursor-pointer bg-transparent py-2 text-[0.92rem] text-text-secondary underline underline-offset-4 hover:text-fg";
const CARD = "rounded-[16px] border border-line bg-card p-5 max-[400px]:p-4";
const INPUT =
  "w-full rounded-[12px] border border-line bg-paper-2 px-4 py-3.5 text-[1.05rem] text-fg outline-none transition-colors placeholder:text-text-muted focus:border-gold-dark";
const LABEL = "mb-2 mt-4 block text-[0.86rem] font-bold text-text-secondary";
const TONE = {
  ok: "border-emerald-400/35 bg-emerald-400/[0.08]",
  warn: "border-amber-400/40 bg-amber-400/[0.08]",
  bad: "border-crimson/50 bg-crimson/[0.1]",
};

function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-gilda text-[26px] uppercase leading-[1.15] text-fg ${className}`}>{children}</h2>;
}

function Note({ children }: { children: ReactNode }) {
  return <div className="mt-3 rounded-[12px] bg-amber-400/10 px-3.5 py-2.5 text-[0.9rem] leading-[1.45] text-amber-200">{children}</div>;
}

// ---------------------------------------------------------------- app
export default function Scanner() {
  const [session, setSession] = useState<Session | null>(() => load<Session | null>("ff_session", null));
  const [screen, setScreen] = useState<Screen>({ k: "scan" });
  const [queueLen, setQueueLen] = useState(() => getQueue().length);
  const [history, setHist] = useState<HistoryItem[]>(() => (session ? getHistory(session.stall.code) : []));
  const [syncState, setSyncState] = useState<"ok" | "sending" | "offline">("ok");
  const [stats, setStats] = useState<StallStats | null>(() => (session ? load<StallStats | null>(`ff_stats_${session.stall.code}`, null) : null));
  const [camMode, setCamMode] = useState<"live" | "photo">("live");
  const [camOn, setCamOn] = useState(false);

  const sessionRef = useRef(session);
  const syncing = useRef(false);
  const backoff = useRef(0);
  const nextTry = useRef(0);
  const statsAt = useRef(0);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const refreshLocal = useCallback(() => {
    setQueueLen(getQueue().length);
    const s = sessionRef.current;
    if (s) setHist(getHistory(s.stall.code));
  }, []);

  // ---- stats (cached on the server, refreshed every minute)
  const refreshStats = useCallback(async (force = false) => {
    const s = sessionRef.current;
    if (!s || (!force && Date.now() - statsAt.current < 20000)) return;
    statsAt.current = Date.now();
    try {
      const res = await api<{ ok: boolean; stats?: StallStats }>("stallStats", [s.stall.code, s.pin]);
      if (res.ok && res.stats) {
        setStats(res.stats);
        store(`ff_stats_${s.stall.code}`, res.stats);
      }
    } catch {
      /* offline — keep the last numbers */
    }
  }, []);

  // ---- sync: every scan stays on the phone until the server confirms it
  const sync = useCallback(async () => {
    const s = sessionRef.current;
    if (!s || syncing.current) return;
    if (!getQueue().length) {
      setSyncState("ok");
      return;
    }
    if (Date.now() < nextTry.current) return;
    syncing.current = true;
    setSyncState(backoff.current >= 6000 || navigator.onLine === false ? "offline" : "sending");
    try {
      // Send in batches of 25 until the phone's queue is empty.
      for (let q = getQueue(); q.length; q = getQueue()) {
        const res = await api<{ ok: boolean; auth?: boolean; message?: string; accepted?: string[]; rejected?: string[]; at?: number }>("submitScans", [
          s.stall.code,
          s.pin,
          q.slice(0, 25),
        ]);
        if (res.auth) {
          alert(`${res.message} Your scans are kept on this phone — sign in again to send them.`);
          store("ff_session", null);
          setSession(null);
          return;
        }
        if (!res.ok) throw new Error(res.message || "server");
        const done = new Set(res.accepted ?? []);
        const rejected = new Set(res.rejected ?? []);
        setQueue(getQueue().filter((r) => !done.has(r.id)));
        setHistory(
          s.stall.code,
          getHistory(s.stall.code).map((x) =>
            done.has(x.rid) && x.st === "queued" ? { ...x, st: rejected.has(x.rid) ? ("rejected" as const) : ("sent" as const), at: res.at ?? Date.now() } : x
          )
        );
        backoff.current = 0;
        nextTry.current = 0;
        refreshLocal();
      }
      setSyncState("ok");
      void refreshStats(true);
    } catch {
      backoff.current = Math.min(backoff.current ? backoff.current * 2 : 3000, 60000);
      nextTry.current = Date.now() + backoff.current;
      setSyncState(backoff.current >= 6000 || navigator.onLine === false ? "offline" : "sending");
    } finally {
      syncing.current = false;
    }
  }, [refreshLocal, refreshStats]);

  const syncSoon = useCallback(() => {
    nextTry.current = 0;
    setTimeout(() => void sync(), 150);
  }, [sync]);

  useEffect(() => {
    const t = setInterval(() => void sync(), 4000);
    const s = setInterval(() => void refreshStats(true), 60000);
    const online = () => syncSoon();
    const offline = () => setSyncState(getQueue().length ? "offline" : "ok");
    const leave = (e: BeforeUnloadEvent) => {
      if (getQueue().length) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    window.addEventListener("beforeunload", leave);
    const first = setTimeout(() => {
      void sync();
      void refreshStats(true);
    }, 300);
    return () => {
      clearInterval(t);
      clearInterval(s);
      clearTimeout(first);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.removeEventListener("beforeunload", leave);
    };
  }, [sync, syncSoon, refreshStats]);

  function enqueue(recs: ScanRecord[], items: HistoryItem[]) {
    setQueue([...getQueue(), ...recs]);
    const s = sessionRef.current; // the ref, not state: this runs from callbacks created before sign-in
    if (s) setHistory(s.stall.code, [...items, ...getHistory(s.stall.code)]);
    refreshLocal();
    setSyncState("sending");
    syncSoon();
  }

  // ---- scanning
  const handleText = useCallback(
    (text: string, manual = false) => {
      const s = sessionRef.current;
      if (!s) return;
      try {
        navigator.vibrate?.(60);
      } catch {
        /* not supported */
      }
      const t = checkTicket(text, s.publicKey);
      if (!t) return setScreen({ k: "invalid" });
      const today = ymd();
      const prev = getHistory(s.stall.code).find((h) => h.tid === t.id && ymd(new Date(h.t)) === today);
      const note = dayNote(t);
      if (s.stall.type === "GATE") {
        if (t.cat === "G") return setScreen({ k: "gateGroup", t, prev, note, manual });
        const flags = [...(prev ? ["re-entry"] : []), ...(manual ? ["typed-id"] : [])];
        const r = newRecord(t, { count: 1, flags });
        enqueue([r], [{ t: r.scannedAt, tid: t.id, name: t.name, cat: t.cat, n: 1, rid: r.id, st: "queued" }]);
        return setScreen({ k: "gateDone", t, n: 1, prev, note });
      }
      setScreen({ k: "stall", t, prev, note, manual });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function logout() {
    if (getQueue().length) {
      alert(`${getQueue().length} scan(s) haven't reached the server yet. Stay on this page until the green "All scans saved" bar shows, then log out.`);
      return;
    }
    setCamOn(false);
    store("ff_session", null);
    setSession(null);
  }

  if (!session)
    return (
      <Frame>
        <Login
          pending={queueLen}
          onIn={(s) => {
            store("ff_session", s);
            sessionRef.current = s;
            setSession(s);
            setHist(getHistory(s.stall.code));
            setStats(load<StallStats | null>(`ff_stats_${s.stall.code}`, null));
            statsAt.current = 0;
            setScreen({ k: "scan" });
            syncSoon();
            void refreshStats(true);
          }}
        />
      </Frame>
    );

  const gate = session.stall.type === "GATE";
  const tab = screen.k === "stats" ? "stats" : "scan";
  const back = () => setScreen({ k: "scan" });

  return (
    <Frame session={session} onLogout={logout}>
      <SyncBar state={syncState} pending={queueLen} />
      <div className="mb-4 flex rounded-[16px] border border-line bg-card p-1">
        {(["scan", "stats"] as const).map((k) => (
          <button
            key={k}
            type="button"
            data-tab={k}
            onClick={() => setScreen(k === "scan" ? { k: "scan" } : { k: "stats" })}
            className={`flex-1 cursor-pointer rounded-[12px] py-2.5 text-[0.95rem] font-bold transition-colors ${
              tab === k ? "bg-gold text-ink" : "text-text-secondary hover:text-fg"
            }`}
          >
            {k === "scan" ? "Scan" : gate ? "Entries" : "Your stall"}
          </button>
        ))}
      </div>

      {screen.k === "scan" && (
        <ScanCard
          gate={gate}
          msg={screen.msg}
          camMode={camMode}
          camOn={camOn}
          setCamOn={setCamOn}
          onBlocked={() => {
            setCamMode("photo");
            setCamOn(false);
          }}
          onRetryLive={() => setCamMode("live")}
          onText={handleText}
          onManual={() => {
            setCamOn(false);
            setScreen({ k: "manual" });
          }}
          onPhotoFail={(m) => setScreen({ k: "scan", msg: m })}
        />
      )}
      {screen.k === "scan" && <Recent items={history.slice(0, 5)} gate={gate} />}

      {screen.k === "manual" && <Manual session={session} onBack={back} onFound={(p) => handleText(p, true)} />}

      {screen.k === "invalid" && (
        <>
          <div className={`mb-4 rounded-[16px] border p-5 ${TONE.bad}`}>
            <div className="font-gilda text-[28px] uppercase leading-[1.1] text-crimson">✕ Not a valid ticket</div>
            <p className="mt-2 text-[0.95rem] leading-[1.5] text-text-secondary">
              This QR isn&apos;t a Daksh &amp; Open Day 2026 ticket, or it has been altered. Ask the visitor to open their ticket again, or register them on the spot.
            </p>
          </div>
          <button type="button" className={GOLD} onClick={back} id="again">
            Scan again
          </button>
          <a className={`${OUTLINE} mt-3`} href={DAKSH.registerIndividuals} target="_blank" rel="noopener noreferrer">
            Register on the spot
          </a>
        </>
      )}

      {screen.k === "gateGroup" && (
        <GateGroup
          screen={screen}
          onCancel={back}
          onRecord={(n) => {
            const { t, prev, manual, note } = screen;
            const flags = [...(prev ? ["re-entry"] : []), ...(manual ? ["typed-id"] : [])];
            const r = newRecord(t, { count: n, flags });
            enqueue([r], [{ t: r.scannedAt, tid: t.id, name: t.name, cat: t.cat, n, rid: r.id, st: "queued" }]);
            setScreen({ k: "gateDone", t, n, prev, note });
          }}
        />
      )}

      {screen.k === "gateDone" && (
        <>
          <div className={`mb-4 rounded-[16px] border p-5 ${screen.prev ? TONE.warn : TONE.ok}`} data-result={screen.prev ? "warn" : "ok"}>
            <div className="font-gilda text-[28px] uppercase leading-[1.1] text-fg">
              {screen.prev ? "↺ Re-entry" : "✓ Welcome"}, {screen.t.name}
            </div>
            <p className="mt-2 text-[0.95rem] text-text-secondary">
              {categoryLabel(screen.t.cat)}
              {screen.n > 1 ? ` · ${screen.n} people` : ""} · Entry recorded
            </p>
            {screen.prev && <Note>Already entered today at {timeOf(screen.prev.t)}. Recorded as a re-entry.</Note>}
            {screen.note && <Note>{screen.note}</Note>}
          </div>
          <button type="button" className={GOLD} id="next" onClick={back}>
            Scan next
          </button>
        </>
      )}

      {screen.k === "stall" && (
        <StallForm
          key={screen.t.id + (screen.prev?.rid ?? "")}
          screen={screen}
          stallName={session.stall.name}
          onCancel={back}
          onSave={(recs, consent) => {
            const t = screen.t;
            enqueue(
              recs,
              recs.map((r) => ({
                t: r.scannedAt,
                tid: t.id,
                name: consent ? t.name : "Visitor (details not shared)",
                cat: t.cat,
                rating: r.rating,
                rid: r.id,
                st: "queued" as const,
              }))
            );
            setScreen({ k: "thanks", count: recs.length });
          }}
        />
      )}

      {screen.k === "thanks" && <Thanks count={screen.count} onNext={back} />}

      {screen.k === "stats" && <Stats gate={gate} stats={stats} history={history} />}
    </Frame>
  );
}

// ---------------------------------------------------------------- frame (header in the site's style)
function Frame({ children, session, onLogout }: { children: ReactNode; session?: Session; onLogout?: () => void }) {
  return (
    <div className="min-h-screen bg-paper text-fg">
      <header className="sticky top-0 z-20 border-b border-gold/40 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-3">
          <img src="/images/logos/christ_emblem.png" alt="CHRIST (Deemed to be University) emblem" width={40} height={40} className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.66rem] font-bold uppercase tracking-[0.2em] text-gold-dark">
              {session ? session.stall.dept || "University Student Council" : "University Student Council"}
            </div>
            {session ? (
              <div className="flex items-center gap-2">
                <span className="truncate font-gilda text-[19px] uppercase leading-[1.2]">{session.stall.name}</span>
                <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.1em] text-ink">{session.stall.type}</span>
              </div>
            ) : (
              <div className="font-gilda text-[19px] uppercase leading-[1.2]">Footfall Scanner</div>
            )}
          </div>
          {session ? (
            <button
              type="button"
              id="logout"
              onClick={onLogout}
              className="shrink-0 cursor-pointer rounded-[12px] border border-fg/40 px-3 py-1.5 text-[0.82rem] text-fg hover:bg-fg/10"
            >
              Log out
            </button>
          ) : (
            <DakshLogo light className="w-[84px] shrink-0" />
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[560px] px-4 pt-5 pb-14">{children}</main>
      <footer className="pb-10 text-center text-[0.74rem] text-text-muted">
        Daksh &amp; Open Day 2026 · University Student Council — CHRIST (Deemed to be University)
      </footer>
    </div>
  );
}

function SyncBar({ state, pending }: { state: "ok" | "sending" | "offline"; pending: number }) {
  const s = pending === 0 ? "ok" : state === "ok" ? "sending" : state;
  const tone =
    s === "ok" ? "bg-emerald-400/10 text-emerald-300" : s === "offline" ? "bg-crimson/12 text-[#f08f8f]" : "bg-amber-400/10 text-amber-200";
  const text =
    s === "ok"
      ? "All scans saved to the server"
      : s === "offline"
        ? `${pending} scan${pending > 1 ? "s" : ""} saved on this phone — will send when the network is back`
        : `Sending ${pending} scan${pending > 1 ? "s" : ""}…`;
  return (
    <div id="sync" className={`mb-4 flex items-center gap-2.5 rounded-[12px] px-3.5 py-2.5 text-[0.88rem] ${tone}`} aria-live="polite">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      <span>{text}</span>
      {!isPersistent() && <b className="ml-auto text-right">⚠ Keep this page open — this browser can&apos;t save scans offline</b>}
    </div>
  );
}

// ---------------------------------------------------------------- login
function Login({ pending, onIn }: { pending: number; onIn: (s: Session) => void }) {
  const [code, setCode] = useState(() => load("ff_last_code", ""));
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c || !pin.trim()) return setMsg("Enter both the stall code and PIN.");
    setBusy(true);
    setMsg("");
    try {
      const res = await api<{ ok: boolean; message?: string; stall?: Session["stall"]; publicKey?: string }>("scannerLogin", [c, pin.trim()]);
      if (!res.ok || !res.stall || !res.publicKey) {
        setMsg(res.message || "Could not sign in.");
        return;
      }
      store("ff_last_code", c);
      onIn({ stall: res.stall, pin: pin.trim(), publicKey: res.publicKey });
    } catch {
      setMsg("No connection. Sign-in needs the network once; after that, scanning works offline.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="relative isolate mb-5 overflow-hidden rounded-[16px] border border-line bg-card px-5 pt-6 pb-5">
        <Sparkle className="absolute top-5 right-5 h-5 w-5 text-gold-light" />
        <Kicker>Volunteers only</Kicker>
        <h1 className="mt-3 flex flex-col gap-1">
          <DakshLogo light className="w-[150px]" />
          <span className="font-gilda text-[22px] uppercase leading-none text-fg">
            &amp; Open Day <span className="text-gold-light">2026</span>
          </span>
        </h1>
        <p className="mt-3 text-[0.95rem] leading-[1.5] text-text-secondary">Sign in with your stall code and PIN from the council team to start scanning visitors&apos; tickets.</p>
      </section>
      <form className={CARD} id="lf" onSubmit={submit}>
        <label className={`${LABEL} mt-0`} htmlFor="code">
          Stall code
        </label>
        <input id="code" className={INPUT} value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" placeholder="e.g. TEST-CS" />
        <label className={LABEL} htmlFor="pin">
          PIN
        </label>
        <input id="pin" type="password" inputMode="numeric" className={INPUT} value={pin} onChange={(e) => setPin(e.target.value)} autoComplete="off" placeholder="4-digit PIN" />
        <button type="submit" id="lb" className={`${GOLD} mt-5`} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <div id="lm" className="mt-3 min-h-[1em] text-[0.9rem] text-[#f08f8f]" role="alert">
          {msg}
        </div>
      </form>
      {pending > 0 && <Note>{pending} scans from an earlier session are saved on this phone. Sign in with the same stall to send them.</Note>}
    </>
  );
}

// ---------------------------------------------------------------- scan card (live camera, photo, typed ID)
function ScanCard({
  gate,
  msg,
  camMode,
  camOn,
  setCamOn,
  onBlocked,
  onRetryLive,
  onText,
  onManual,
  onPhotoFail,
}: {
  gate: boolean;
  msg?: string;
  camMode: "live" | "photo";
  camOn: boolean;
  setCamOn: (v: boolean) => void;
  onBlocked: () => void;
  onRetryLive: () => void;
  onText: (t: string) => void;
  onManual: () => void;
  onPhotoFail: (m: string) => void;
}) {
  const [reading, setReading] = useState(false);
  return (
    <section className={`${CARD} mb-4 text-center`}>
      <Heading>{gate ? "Scan at entry" : "Scan visitor's ticket"}</Heading>
      <p className="mx-auto mt-2 max-w-[400px] text-[0.95rem] leading-[1.5] text-text-secondary">
        {gate
          ? "Scan each visitor's ticket QR as they enter."
          : "After talking with the visitor, scan the QR on their ticket. They confirm their details and leave feedback on this phone."}
      </p>

      {camMode === "live" && camOn && (
        <Camera
          onText={(t) => {
            onText(t);
          }}
          onBlocked={onBlocked}
          onStop={() => setCamOn(false)}
        />
      )}
      {camMode === "live" && !camOn && (
        <button type="button" id="camBtn" className={`${GOLD} mt-5 py-6 text-[1.15rem]`} onClick={() => setCamOn(true)}>
          <CameraIcon /> Scan QR code
        </button>
      )}
      {camMode === "photo" && (
        <>
          <label id="photoBtn" className={`${GOLD} mt-5 py-6 text-[1.15rem]`}>
            <CameraIcon /> {reading ? "Reading QR…" : "Take photo of QR"}
            <input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setReading(true);
                const t = await decodeFile(file).catch(() => null);
                setReading(false);
                if (t) onText(t);
                else onPhotoFail("Couldn't read the QR. Hold the phone steady, fill the frame with the QR and try again — or type the ticket ID.");
              }}
            />
          </label>
          <button type="button" className={LINK} onClick={onRetryLive}>
            Try the live camera again
          </button>
        </>
      )}

      <div id="sm" className="mt-3 min-h-[1em] text-[0.9rem] leading-[1.45] text-[#f08f8f]" role="alert">
        {msg}
      </div>
      <button type="button" id="manual" className={`${OUTLINE} mt-2`} onClick={onManual}>
        ⌨&nbsp; Type ticket ID instead
      </button>
      {gate && (
        <a className={`${LINK} block`} href={DAKSH.registerIndividuals} target="_blank" rel="noopener noreferrer">
          Visitor not registered? Open on-spot registration
        </a>
      )}
    </section>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

/** Live camera: reads frames continuously until a QR is found. */
function Camera({ onText, onBlocked, onStop }: { onText: (t: string) => void; onBlocked: () => void; onStop: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cb = useRef({ onText, onBlocked });
  useEffect(() => {
    cb.current = { onText, onBlocked };
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let stopped = false;
    const canvas = document.createElement("canvas");
    if (!navigator.mediaDevices?.getUserMedia) {
      cb.current.onBlocked();
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        const v = videoRef.current;
        if (!v) return;
        v.srcObject = s;
        v.play().catch(() => {});
        let busy = false;
        timer = setInterval(async () => {
          if (busy || stopped || !v.videoWidth) return;
          busy = true;
          const t = await decodeFrame(v, v.videoWidth, v.videoHeight, canvas, 720).catch(() => null);
          busy = false;
          if (t && !stopped) {
            stopped = true;
            cb.current.onText(t);
          }
        }, 180);
      })
      .catch(() => cb.current.onBlocked());
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="mt-5">
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-black">
        <video ref={videoRef} id="vid" playsInline muted autoPlay className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-[15%] rounded-[18px] border-[3px] border-gold-light shadow-[0_0_0_999px_rgba(0,0,0,0.38)]" />
        <div className="pointer-events-none absolute right-0 bottom-3 left-0 text-center text-[0.85rem] text-white/85">Point at the ticket QR</div>
      </div>
      <button type="button" id="stopCam" className={`${OUTLINE} mt-3`} onClick={onStop}>
        Stop camera
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- typed ticket ID
function Manual({ session, onBack, onFound }: { session: Session; onBack: () => void; onFound: (payload: string) => void }) {
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await api<{ ok: boolean; payload?: string; message?: string }>("findTicketById", [session.stall.code, session.pin, id]);
      if (res.ok && res.payload) onFound(res.payload);
      else setMsg(res.message || "Not found.");
    } catch {
      setMsg("No connection — typing an ID needs the network. Scanning the QR works offline.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={CARD} id="mf" onSubmit={submit}>
      <Heading>Type ticket ID</Heading>
      <p className="mt-2 text-[0.95rem] leading-[1.5] text-text-secondary">
        The ticket ID is printed under the QR code, e.g. <b className="text-fg">DK26-7QJDAP</b>. Needs the network.
      </p>
      <input id="tid" className={`${INPUT} mt-4 uppercase`} value={id} onChange={(e) => setId(e.target.value)} autoCapitalize="characters" autoComplete="off" placeholder="DK26-XXXXXX" />
      <button type="submit" id="mb" className={`${GOLD} mt-4`} disabled={busy}>
        {busy ? "Finding…" : "Find ticket"}
      </button>
      <div id="mm" className="mt-3 min-h-[1em] text-[0.9rem] text-[#f08f8f]" role="alert">
        {msg}
      </div>
      <button type="button" className={LINK} onClick={onBack}>
        ← Back to scanning
      </button>
    </form>
  );
}

// ---------------------------------------------------------------- results
function Details({ t }: { t: Ticket }) {
  const rows: [string, string][] = [
    [t.cat === "G" ? "Institution" : "Name", t.name],
    ["Category", categoryLabel(t.cat)],
    ["Email", t.email],
    ["Mobile", t.phone],
    ["Ticket", t.id],
  ];
  return (
    <dl className="mt-3 grid grid-cols-[96px_1fr] gap-x-3 gap-y-1.5 text-[0.98rem]">
      {rows.map(([k, v], i) => (
        <div key={k} className="contents">
          <dt className="pt-0.5 text-[0.82rem] text-text-muted">{k}</dt>
          <dd className={`m-0 break-words ${i === 0 ? "font-bold text-fg" : "text-text-secondary"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function GateGroup({ screen, onCancel, onRecord }: { screen: Extract<Screen, { k: "gateGroup" }>; onCancel: () => void; onRecord: (n: number) => void }) {
  const [n, setN] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <>
      <div className={`mb-4 rounded-[16px] border p-5 ${TONE.ok}`}>
        <div className="font-gilda text-[28px] uppercase leading-[1.1]">✓ {screen.t.name}</div>
        <Details t={screen.t} />
        {screen.note && <Note>{screen.note}</Note>}
      </div>
      <div className={CARD}>
        <label className={`${LABEL} mt-0`} htmlFor="cnt">
          How many people are entering with this institution pass now?
        </label>
        <input id="cnt" type="number" inputMode="numeric" min={1} max={500} className={INPUT} value={n} onChange={(e) => setN(e.target.value)} placeholder="Students + staff" />
        <button
          type="button"
          id="rec"
          className={`${GOLD} mt-4`}
          onClick={() => {
            const v = Math.floor(Number(n));
            if (!(v >= 1 && v <= 500)) return setMsg("Enter the number of people (1–500).");
            onRecord(v);
          }}
        >
          Record group entry
        </button>
        <div id="gm" className="mt-3 min-h-[1em] text-[0.9rem] text-[#f08f8f]" role="alert">
          {msg}
        </div>
        <button type="button" className={LINK} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="mt-1 flex gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((k) => (
        <button
          key={k}
          type="button"
          data-v={k}
          role="radio"
          aria-checked={value === k}
          aria-label={`${k} star${k > 1 ? "s" : ""}`}
          onClick={() => onChange(k)}
          className={`flex-1 cursor-pointer rounded-[12px] border py-2 text-[2rem] leading-none transition-colors ${
            k <= value ? "border-gold bg-gold/15 text-gold-light" : "border-line bg-paper-2 text-text-muted/50"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function StallForm({
  screen,
  stallName,
  onCancel,
  onSave,
}: {
  screen: Extract<Screen, { k: "stall" }>;
  stallName: string;
  onCancel: () => void;
  onSave: (recs: ScanRecord[], consent: boolean) => void;
}) {
  const { t, prev, note, manual } = screen;
  const group = t.cat === "G";
  const [consent, setConsent] = useState(false);
  const [entries, setEntries] = useState([{ rating: 0, fb: "" }]);
  const [msg, setMsg] = useState("");

  function save(withFeedback: boolean) {
    const flags = [...(prev ? ["repeat-visit"] : []), ...(manual ? ["typed-id"] : [])];
    if (!withFeedback) return onSave([newRecord(t, { consent, flags: [...flags, "no-feedback"] })], consent);
    const es = entries.map((e) => ({ ...e, fb: e.fb.trim() })).filter((e) => e.rating || e.fb);
    if (!es.length) return setMsg("Please tap the stars to rate your experience.");
    if (es.some((e) => !e.rating)) return setMsg(group ? "Please give a star rating for every student who wrote feedback." : "Please give a star rating.");
    onSave(
      es.map((e, i) => newRecord(t, { consent, rating: e.rating, feedback: e.fb, entry: i + 1, flags })),
      consent
    );
  }

  return (
    <>
      <div className={`mb-4 rounded-[16px] border p-5 ${TONE.ok}`} data-result="ok">
        <div className="font-gilda text-[28px] uppercase leading-[1.1]">✓ Valid ticket</div>
        <Details t={t} />
        {prev && <Note>Already recorded at this stall today at {timeOf(prev.t)}. You can still record this visit.</Note>}
        {note && <Note>{note}</Note>}
      </div>
      <div className={CARD}>
        <p className="mb-3 text-[0.95rem] font-bold text-fg">Please hand the phone to the {group ? "teacher / students" : "visitor"}.</p>
        <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border-2 border-gold bg-gold/[0.07] p-4 text-[0.98rem] leading-[1.5]">
          <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[#b8923a]" />
          <span>
            {group ? (
              <>
                I confirm these are our institution&apos;s details and agree to share them with <b>{stallName}</b>.
              </>
            ) : (
              <>
                I, <b>{t.name}</b>, confirm these are my details and agree to share my registered name, email, mobile number and category with <b>{stallName}</b>.
              </>
            )}
          </span>
        </label>
        <p className="mt-2 text-[0.82rem] leading-[1.45] text-text-muted">Without this tick, the visit is still counted, but no details are shared with the stall.</p>

        {entries.map((e, i) => (
          <div key={i} className={`entry ${i ? "mt-5 border-t border-dashed border-line pt-4" : "mt-2"}`}>
            {group ? (
              <Kicker className="mt-3 mb-2 text-gold-dark">Student {i + 1}</Kicker>
            ) : (
              <label className={LABEL}>How was your experience at this stall?</label>
            )}
            <Stars value={e.rating} onChange={(v) => setEntries((xs) => xs.map((x, j) => (j === i ? { ...x, rating: v } : x)))} />
            <label className={LABEL}>Your feedback{group ? "" : " (optional)"}</label>
            <textarea
              maxLength={1000}
              value={e.fb}
              onChange={(ev) => setEntries((xs) => xs.map((x, j) => (j === i ? { ...x, fb: ev.target.value } : x)))}
              placeholder="What did you like? What could be better?"
              className={`${INPUT} min-h-[88px] resize-y text-[1rem]`}
            />
          </div>
        ))}
        {group && (
          <button type="button" id="addE" className={`${OUTLINE} mt-4`} onClick={() => setEntries((xs) => [...xs, { rating: 0, fb: "" }])}>
            + Add another student&apos;s feedback
          </button>
        )}
        <button type="button" id="submit" className={`${GOLD} mt-5`} onClick={() => save(true)}>
          Submit
        </button>
        <div id="fm" className="mt-3 min-h-[1em] text-[0.9rem] text-[#f08f8f]" role="alert">
          {msg}
        </div>
        <button type="button" id="skip" className={LINK} onClick={() => save(false)}>
          Visitor doesn&apos;t want to give feedback — just count the visit
        </button>
        <button type="button" id="cancel" className={LINK} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}

function Thanks({ count, onNext }: { count: number; onNext: () => void }) {
  const next = useRef(onNext);
  useEffect(() => {
    next.current = onNext;
  });
  useEffect(() => {
    const t = setTimeout(() => next.current(), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div className={`mb-4 rounded-[16px] border p-6 text-center ${TONE.ok}`}>
        <Sparkle className="mx-auto mb-2 h-6 w-6 text-gold-light" />
        <div className="font-gilda text-[30px] uppercase leading-[1.1]">Thank you!</div>
        <p className="mt-2 text-[0.95rem] text-text-secondary">{count > 1 ? `${count} feedback entries recorded.` : "Visit recorded."}</p>
      </div>
      <button type="button" id="next" className={GOLD} onClick={onNext}>
        Scan next visitor
      </button>
    </>
  );
}

// ---------------------------------------------------------------- recent + stats
function Recent({ items, gate }: { items: HistoryItem[]; gate: boolean }) {
  if (!items.length) return null;
  return (
    <section className={CARD}>
      <Kicker className="mb-2 text-gold-dark">Recent {gate ? "entries" : "visits"}</Kicker>
      <ul>
        {items.map((h) => (
          <li key={h.rid} className="flex justify-between gap-3 border-b border-line py-2.5 text-[0.92rem] last:border-0">
            <span className="min-w-0 break-words text-fg">
              {h.name}
              {h.n && h.n > 1 ? ` · ${h.n} people` : ""}
              {h.rating ? <span className="text-gold-light"> · {"★".repeat(h.rating)}</span> : null}
            </span>
            <span className={`shrink-0 whitespace-nowrap ${h.st === "sent" ? "text-text-muted" : "text-amber-200"}`}>
              {timeOf(h.t)} {h.st === "sent" ? "✓" : h.st === "rejected" ? "✕" : "⏳"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stats({ gate, stats, history }: { gate: boolean; stats: StallStats | null; history: HistoryItem[] }) {
  const today = ymd();
  const days = [...(stats?.days ?? [])];
  if (!days.some((d) => d.date === today)) days.push({ date: today, label: DAY_LABELS[today] ?? "Today", visits: 0, hours: {} });
  const [pick, setPick] = useState(today);
  const day = days.find((d) => d.date === pick) ?? days[days.length - 1];

  // Server numbers (refreshed every minute) + this phone's scans the server hasn't counted yet.
  const hours: Record<number, number> = {};
  Object.entries(day.hours ?? {}).forEach(([h, v]) => (hours[Number(h)] = v));
  let visits = day.visits ?? 0;
  if (day.date === today) {
    const upd = stats?.updated ?? 0;
    history
      .filter((h) => ymd(new Date(h.t)) === today && h.st !== "rejected" && (h.st !== "sent" || !((h.at ?? 0) < upd)))
      .forEach((h) => {
        const hr = new Date(h.t).getHours();
        hours[hr] = (hours[hr] ?? 0) + (h.n ?? 1);
        visits += h.n ?? 1;
      });
  }
  const max = Math.max(1, ...Object.values(hours));
  // Event hours (9 AM–5 PM) always, plus any other hour that has scans (e.g. an evening test run).
  const hrs = [...new Set([9, 10, 11, 12, 13, 14, 15, 16, ...Object.keys(hours).map(Number).filter((h) => hours[h] > 0)])].sort((a, b) => a - b);

  return (
    <>
      <section className={`${CARD} mb-4`}>
        <Heading>{gate ? "Entries" : "Footfall at your stall"}</Heading>
        <div className="my-4 flex flex-wrap gap-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => setPick(d.date)}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.85rem] ${
                d.date === day.date ? "border-gold bg-gold text-ink" : "border-line text-text-secondary hover:text-fg"
              }`}
            >
              {d.label || d.date}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2.5" id="kpis">
          <Kpi value={visits} label={gate ? "people entered" : "visits"} />
          {!gate && <Kpi value={day.unique ?? "–"} label="unique visitors" />}
          {!gate && <Kpi value={day.avg != null ? `${day.avg}★` : "–"} label="avg rating" />}
        </div>
        <Kicker className="mt-6 mb-3 text-gold-dark">Hour by hour</Kicker>
        <ul className="flex flex-col gap-2">
          {hrs.map((h) => (
            <li key={h} className="flex items-center gap-3 text-[0.86rem]">
              <span className="w-[76px] shrink-0 text-text-muted">{hourLabel(h)}</span>
              <span className="h-4 flex-1 overflow-hidden rounded-[4px] bg-paper-2">
                <span className="block h-full rounded-[4px] bg-gradient-to-r from-gold-dark to-gold-light" style={{ width: `${((hours[h] ?? 0) / max) * 100}%` }} />
              </span>
              <b className="w-8 text-right text-fg">{hours[h] ?? 0}</b>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.8rem] leading-[1.45] text-text-muted">
          Server totals refresh every minute{stats ? "" : " (waiting for the first update)"}. Today&apos;s count includes scans still on this phone.
        </p>
      </section>
      <Recent items={history.slice(0, 20)} gate={gate} />
    </>
  );
}

function Kpi({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-[12px] bg-paper-2 px-2 py-3 text-center">
      <b className="block font-gilda text-[28px] leading-none text-gold-light">{value}</b>
      <span className="mt-1 block text-[0.74rem] text-text-muted">{label}</span>
    </div>
  );
}
