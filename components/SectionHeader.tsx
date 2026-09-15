import type { ReactNode } from "react";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  titleClassName = "",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className="max-w-[720px] mb-11">
      <div className="text-[0.74rem] font-semibold tracking-[0.2em] text-gold-dark uppercase mb-3">
        {eyebrow}
      </div>
      <h2
        className={`font-display text-[clamp(1.7rem,2.6vw,2.2rem)] font-semibold text-ink tracking-[-0.01em] ${subtitle ? "mb-3.5" : ""} ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[0.98rem] text-text-secondary leading-[1.7] font-light">{subtitle}</p>
      )}
    </div>
  );
}
