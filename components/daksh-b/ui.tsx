import type { ReactNode } from "react";
import type { Photo } from "@/lib/daksh";
import { Img } from "@/components/daksh/ui";

export function EyebrowB({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-2.5 font-gs text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-db-steel ${className}`}>{children}</div>;
}

/** Brochure-style heading: General Sans, uppercase, generous tracking. */
export function TitleB({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-gs text-[clamp(1.7rem,3vw,2.6rem)] font-semibold uppercase leading-[1.08] tracking-[0.02em] text-db-royal ${className}`}>
      {children}
    </h2>
  );
}

const HAND_TONES = { maroon: "text-db-maroon", butter: "text-db-butter", royal: "text-db-royal" };

/** Handwritten accent line (the board's script face). Colour comes from `tone`, not className, so it can't be overridden by accident. */
export function Hand({ children, tone = "maroon", className = "" }: { children: ReactNode; tone?: keyof typeof HAND_TONES; className?: string }) {
  return <p className={`font-hand text-[1.5rem] leading-tight ${HAND_TONES[tone]} ${className}`}>{children}</p>;
}

export function ButtonB({
  href,
  children,
  variant = "solid",
  external = false,
  download = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "butter" | "light";
  external?: boolean;
  download?: boolean;
}) {
  const styles = {
    solid: "bg-db-royal text-white hover:bg-db-navy",
    outline: "border-2 border-db-royal text-db-royal hover:bg-db-royal hover:text-white",
    butter: "bg-db-butter text-db-navy hover:bg-[#ffe39e]",
    light: "border-2 border-white/70 text-white hover:bg-white hover:text-db-navy",
  }[variant];
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      className={`inline-flex items-center justify-center rounded-[16px] px-6 py-3.5 font-gs text-[0.92rem] font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5 max-[640px]:w-full ${styles}`}
    >
      {children}
    </a>
  );
}

/** The brochure's sweeping corner arcs. */
export function Arc({ className = "", solid = false }: { className?: string; solid?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${solid ? "bg-db-royal" : "border-[18px] border-db-royal"} ${className}`}
      aria-hidden="true"
    />
  );
}

export function PolaroidB({ photo, caption, tilt, className = "" }: { photo: Photo; caption: string; tilt: number; className?: string }) {
  return (
    <figure
      className={`rounded-[4px] bg-white p-3 pb-3.5 shadow-[0_18px_34px_-12px_rgba(3,46,75,0.55)] transition-transform duration-300 hover:rotate-0! hover:-translate-y-1.5 hover:scale-[1.03] max-[640px]:p-2 max-[640px]:pb-2.5 ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <Img photo={photo} className="aspect-[5/4] w-full rounded-[2px] object-cover" />
      <figcaption className="mt-2 font-hand text-[1.3rem] leading-tight text-db-navy max-[640px]:mt-1.5 max-[640px]:text-[0.95rem]">{caption}</figcaption>
    </figure>
  );
}
