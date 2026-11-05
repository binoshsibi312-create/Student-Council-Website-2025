import type { CSSProperties, ReactNode } from "react";
import Countdown from "@/components/daksh/Countdown";
import { Img } from "@/components/daksh/ui";
import { DAKSH, type Photo } from "@/lib/daksh";

// Building blocks for the Daksh and Trailblaze pages, matching the Figma
// design: Gilda Display headings, Manjari text, Gochi Hand accents. Wrap the
// page in <DakshType> so those fonts are loaded.

/** Four-point sparkle used as a bullet and decoration. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 fill-current ${className}`} aria-hidden="true">
      <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" />
    </svg>
  );
}

/** Small spaced-out label above a heading. */
export function Kicker({ children, className = "text-gold-dark" }: { children: ReactNode; className?: string }) {
  return <div className={`text-[0.81rem] font-bold uppercase leading-[1.2] tracking-[0.22em] ${className}`}>{children}</div>;
}

/** Gilda Display, all caps. Size it with `className`. */
export function Heading({ children, as: Tag = "h2", className = "" }: { children: ReactNode; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  return <Tag className={`font-gilda font-normal uppercase leading-[1.1] tracking-[0.01em] text-fg ${className}`}>{children}</Tag>;
}

/** Handwritten accent line. */
export function Hand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-hand leading-[1.2] text-gold-light ${className}`}>{children}</p>;
}

const BTN =
  "inline-flex items-center justify-center rounded-[16px] px-6 pt-[15px] pb-[13px] text-[0.94rem] font-bold leading-[1.2] tracking-[0.02em] whitespace-nowrap no-underline transition-all duration-200 max-[640px]:w-full";
const BTN_STYLES = {
  gold: "bg-gold text-ink hover:-translate-y-0.5 hover:bg-gold-light",
  outline: "border-2 border-fg/60 text-fg hover:-translate-y-0.5 hover:border-fg hover:bg-fg/10",
};

/** A pill button. Without `href` it renders as an inert "coming soon" button. */
export function Btn({
  href,
  children,
  variant = "gold",
  external = false,
  download = false,
}: {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof BTN_STYLES;
  external?: boolean;
  download?: boolean;
}) {
  if (!href)
    return (
      <span aria-disabled="true" className={`${BTN} ${BTN_STYLES[variant]} cursor-default hover:translate-y-0 hover:bg-transparent`}>
        {children}
      </span>
    );
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      className={`${BTN} ${BTN_STYLES[variant]}`}
    >
      {children}
    </a>
  );
}

export interface Tile {
  label: string;
  value: string;
  note: string;
}

/**
 * Date block, four info tiles and an action bar — the "key information" block
 * that opens both the Daksh and Trailblaze pages.
 */
export function KeyInfo({ tiles, title, children }: { tiles: Tile[]; title: string; children: ReactNode }) {
  return (
    <section aria-label="Key information" className="flex flex-col gap-4 max-[640px]:gap-3">
      <div className="grid grid-cols-[360px_1fr] gap-4 max-[1080px]:grid-cols-1 max-[640px]:gap-3">
        <div className="relative isolate overflow-hidden rounded-[16px] bg-gold p-8 text-ink max-[640px]:px-6 max-[640px]:py-7">
          <div
            className="absolute -right-[60px] -bottom-[60px] -z-10 h-[220px] w-[220px] rounded-full border-[20px] border-ink/14 max-[640px]:h-[160px] max-[640px]:w-[160px] max-[640px]:border-[16px]"
            aria-hidden="true"
          />
          <div className="font-gilda text-[88px] leading-none max-[640px]:text-[64px]">21–22</div>
          <div className="mt-1.5 font-gilda text-[30px] uppercase leading-[1.2] tracking-[0.01em] max-[640px]:text-[24px]">November 2026</div>
          <div className="mt-1.5 text-[19px] leading-[1.6] max-[640px]:text-[17px]">{DAKSH.hours}</div>
          <div className="mt-2.5">
            <Countdown startsAt={DAKSH.startsAt} endsAt={DAKSH.endsAt} tone="date" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1 max-[640px]:gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="flex flex-col gap-1.5 rounded-[16px] border border-line bg-card px-[22px] py-5 max-[640px]:px-5 max-[640px]:py-4">
              <Kicker>{t.label}</Kicker>
              <Heading as="p" className="text-[23px] leading-[1.2] max-[640px]:text-[21px]">
                {t.value}
              </Heading>
              <p className="text-[14px] leading-[1.5] text-text-secondary">{t.note}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line bg-card py-[18px] pr-5 pl-[26px] min-[1300px]:flex-nowrap max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:p-0">
        <div className="mr-auto flex min-w-0 items-center gap-2.5 max-[1299px]:basis-full max-[640px]:hidden min-[1300px]:flex-1">
          <Sparkle className="h-4 w-4 text-gold-light" />
          <Heading as="p" className="text-[19px] leading-[1.2]">
            {title}
          </Heading>
        </div>
        {children}
      </div>
    </section>
  );
}

/** White instant photo with a handwritten caption. */
export function Polaroid({ photo, caption, tilt, className = "" }: { photo: Photo; caption: string; tilt: number; className?: string }) {
  return (
    <figure
      className={`rounded-[4px] bg-white p-3 pb-3.5 shadow-[0_18px_34px_-10px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:rotate-0! hover:scale-[1.03] ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <Img photo={photo} className="aspect-[340/240] w-full rounded-[2px] object-cover" />
      <figcaption className="mt-2 font-hand text-[19px] leading-[1.2] text-ink">{caption}</figcaption>
    </figure>
  );
}

/**
 * A polaroid pinned with tape on the Daksh Wall. It is placed on a scaled
 * artboard, so position and size are percentages and everything inside is in
 * container units of the polaroid's own width.
 */
export function WallPolaroid({
  photo,
  caption,
  spot: [x, y, w, tilt, tapeTilt],
  board: [bw, bh],
}: {
  photo: Photo;
  caption: string;
  spot: [number, number, number, number, number];
  board: [number, number];
}) {
  const style: CSSProperties = { left: `${(x / bw) * 100}%`, top: `${(y / bh) * 100}%`, width: `${(w / bw) * 100}%`, rotate: `${tilt}deg` };
  return (
    <figure
      className="@container absolute rounded-[4px] bg-white shadow-[0_18px_34px_-10px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:z-10 hover:rotate-0! hover:scale-[1.06]"
      style={style}
    >
      <span
        className="absolute -top-[4.6cqi] left-1/2 h-[9.3cqi] w-[29.6cqi] -translate-x-1/2 bg-gold-light/75"
        style={{ rotate: `${tapeTilt}deg` }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-[3.7cqi] p-[5.1cqi] pb-[6cqi]">
        <Img photo={photo} className="aspect-[194/147] w-full rounded-[2px] object-cover" />
        <figcaption className="font-hand text-[8.3cqi] leading-[1.2] text-ink">{caption}</figcaption>
      </div>
    </figure>
  );
}
