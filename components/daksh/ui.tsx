import type { ReactNode } from "react";
import { BRAND, type Photo } from "@/lib/daksh";

/** A plain <img> sized from the photo's real dimensions so the layout doesn't jump while it loads. */
export function Img({ photo, className = "", eager = false }: { photo: Photo; className?: string; eager?: boolean }) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}

/**
 * Tilted instant-photo frame. `cream` is the classic white border; `navy`
 * picks up the Daksh blue gradient used behind the moments wall.
 */
export function Polaroid({
  photo,
  caption,
  tilt,
  tone = "cream",
  className = "",
}: {
  photo: Photo;
  caption: string;
  tilt: number;
  tone?: "cream" | "navy";
  className?: string;
}) {
  const frame =
    tone === "navy"
      ? "border border-white/15 bg-[linear-gradient(135deg,#22356b_0%,#16244a_100%)] shadow-[0_16px_30px_-8px_rgba(0,0,0,0.7)]"
      : "bg-[#f4f1ea] shadow-[0_14px_28px_-6px_rgba(0,0,0,0.55)]";
  return (
    <figure
      className={`group rounded-[4px] p-3 pb-3.5 transition-transform duration-300 ease-out hover:rotate-0! hover:-translate-y-1.5 hover:scale-[1.03] max-[640px]:p-2 max-[640px]:pb-2.5 ${frame} ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <Img photo={photo} className="aspect-[5/4] w-full rounded-[2px] object-cover" />
      <figcaption
        className={`mt-2.5 font-display text-[1.12rem] font-semibold italic leading-tight max-[640px]:mt-1.5 max-[640px]:text-[0.82rem] ${
          tone === "navy" ? "text-gold-light" : "text-[#2a2620]"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export function Chip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-[16px] border px-4 py-2 text-[0.86rem] font-medium max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-[0.74rem] ${
        accent ? "border-gold bg-gold text-ink" : "border-white/25 bg-white/10 text-fg backdrop-blur-sm"
      }`}
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  primary = true,
  external = false,
  download = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      className={`inline-flex items-center justify-center rounded-[16px] px-6 py-3.5 text-[0.92rem] font-semibold no-underline transition-all duration-250 hover:-translate-y-0.5 max-[640px]:w-full max-[640px]:py-3 ${
        primary ? "bg-gold text-ink hover:bg-gold-light" : "border border-fg/60 text-fg hover:border-fg hover:bg-fg/10"
      }`}
    >
      {children}
    </a>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-gold-dark">{children}</div>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(1.85rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-fg ${className}`}>
      {children}
    </h2>
  );
}

/** The official Daksh wordmark; `light` is the white version for dark backgrounds. */
export function DakshLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const logo = light ? BRAND.logoLight : BRAND.logo;
  return <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={`h-auto ${className}`} />;
}

/** Alden, the Daksh owl, with a gentle idle bob (paused for reduced-motion users). */
export function Mascot({ className = "" }: { className?: string }) {
  const { mascot } = BRAND;
  return (
    <img
      src={mascot.src}
      alt={mascot.alt}
      width={mascot.width}
      height={mascot.height}
      loading="lazy"
      decoding="async"
      className={`alden-bob h-auto ${className}`}
    />
  );
}
