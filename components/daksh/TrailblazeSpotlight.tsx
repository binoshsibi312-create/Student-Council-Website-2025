import { Btn, Heading, Kicker, Sparkle } from "@/components/daksh/kit";
import { COMPETITIONS, TRAILBLAZE } from "@/lib/daksh";

/** Posters fanned on the right, in this order (by competition name). */
const FAN = ["Mind-Maze", "Celluloid: Filmlets", "Nritya Kshetra", "Chessverse", "Resonance"];
/** Resting and hovered transforms for each fanned poster, left to right. */
const SPREAD = [
  "-translate-x-[108%] rotate-[-14deg] translate-y-6 group-hover:-translate-x-[134%] group-hover:rotate-[-17deg]",
  "-translate-x-[62%] rotate-[-7deg] translate-y-1.5 group-hover:-translate-x-[78%] group-hover:rotate-[-9deg]",
  "translate-x-0 rotate-0 -translate-y-1 group-hover:-translate-y-3",
  "translate-x-[62%] rotate-[7deg] translate-y-1.5 group-hover:translate-x-[78%] group-hover:rotate-[9deg]",
  "translate-x-[108%] rotate-[14deg] translate-y-6 group-hover:translate-x-[134%] group-hover:rotate-[17deg]",
];

/**
 * Trailblaze, surfaced right under the Daksh hero: a short pitch with the
 * register button on the left and the real competition posters fanned out on
 * the right (they spread on hover). On phones the posters become a swipeable row.
 */
export default function TrailblazeSpotlight() {
  const fan = FAN.map((n) => COMPETITIONS.find((c) => c.name === n)!).filter(Boolean);
  return (
    <section
      aria-labelledby="tb-spotlight"
      className="group relative isolate grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-10 overflow-hidden rounded-[16px] border border-gold/35 bg-[radial-gradient(120%_140%_at_100%_0%,#1d2f63_0%,#121a36_45%,#0e0f16_100%)] px-12 py-11 max-[1080px]:grid-cols-1 max-[1080px]:gap-8 max-[1080px]:px-8 max-[640px]:-mx-1 max-[640px]:px-5 max-[640px]:py-7"
    >
      {/* fine gold rule along the top edge */}
      <div className="absolute inset-x-12 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" aria-hidden="true" />

      <div className="flex flex-col items-start gap-4 max-[640px]:gap-3">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/10 py-1.5 pr-3.5 pl-3 text-[0.78rem] font-bold uppercase leading-none tracking-[0.18em] text-gold-light">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
          </span>
          Registrations open
        </span>
        <Kicker className="text-white/60">Trailblaze Competitions 2026 · Annual inter-school</Kicker>
        <Heading className="text-[42px] leading-[1.02] max-[640px]:text-[30px]">
          <span id="tb-spotlight">
            Seven stages.
            <br />
            <span className="text-gold-light">Which one is yours?</span>
          </span>
        </Heading>
        <p className="max-w-[460px] text-[17px] leading-[1.6] text-text-secondary max-[640px]:text-[15px]">
          Quiz, debate, film, reels, dance, chess and music — on the theme <em className="not-italic text-fg">{TRAILBLAZE.theme}</em>, on the
          same two days as Daksh.
        </p>
        <p className="flex items-center gap-2.5 rounded-[12px] border border-gold/40 bg-gold/10 py-2.5 pr-4 pl-3 text-[15px] font-bold leading-[1.35] text-gold-light max-[640px]:text-[14px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
            <path d="M17 6h2.5a1.5 1.5 0 0 1 1.5 1.5V8a4 4 0 0 1-4 4M7 6H4.5A1.5 1.5 0 0 0 3 7.5V8a4 4 0 0 0 4 4" />
          </svg>
          {TRAILBLAZE.prizes}
        </p>
        <ul className="flex max-w-[480px] flex-wrap gap-2 max-[640px]:hidden">
          {COMPETITIONS.map((c) => (
            <li key={c.name} className="flex items-center gap-1.5 rounded-[10px] border border-white/12 bg-white/[0.04] px-2.5 pt-[5px] pb-[3px] text-[13px] leading-[1.5] text-fg">
              <Sparkle className="h-2.5 w-2.5 text-gold-light" />
              {c.short ?? c.name}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-3 max-[640px]:w-full max-[640px]:flex-col">
          <Btn href={TRAILBLAZE.register} external>
            Register for Trailblaze Competitions
          </Btn>
          <Btn href="/trailblaze#competitions" variant="outline">
            See all competitions →
          </Btn>
        </div>
      </div>

      {/* Desktop: fanned posters that spread on hover */}
      <a
        href="/trailblaze#competitions"
        aria-label="See all Trailblaze competitions"
        className="relative mx-auto block h-[340px] w-full max-w-[520px] max-[640px]:hidden"
      >
        {fan.map((c, i) => (
          <img
            key={c.name}
            src={c.poster}
            alt={`${c.name} poster`}
            loading="lazy"
            decoding="async"
            className={`absolute top-1/2 left-1/2 w-[170px] -mt-[120px] -ml-[85px] rounded-[10px] shadow-[0_22px_40px_-14px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-500 ease-out max-[1080px]:w-[150px] max-[1080px]:-ml-[75px] ${SPREAD[i]}`}
            style={{ zIndex: i === 2 ? 5 : 4 - Math.abs(2 - i) }}
          />
        ))}
      </a>

      {/* Phones: a swipeable row of every poster */}
      <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 min-[641px]:hidden max-[640px]:order-first">
        {COMPETITIONS.map((c) => (
          <a key={c.name} href="/trailblaze#competitions" className="w-[132px] shrink-0 snap-start">
            <img src={c.poster} alt={`${c.name} poster`} loading="lazy" decoding="async" className="w-full rounded-[10px] ring-1 ring-white/10" />
          </a>
        ))}
      </div>
    </section>
  );
}
