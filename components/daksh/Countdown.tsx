"use client";

import { useEffect, useState } from "react";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * "N days to go" / "Happening now" chip for the Daksh hero. Computed on the
 * client only, so the server-rendered HTML never disagrees with the visitor's
 * clock; renders nothing once the fair is over.
 */
export default function Countdown({ startsAt, endsAt, tone = "hero" }: { startsAt: string; endsAt: string; tone?: "hero" | "date" }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const now = Date.now();
      const start = new Date(startsAt).getTime();
      const end = new Date(endsAt).getTime();
      if (now >= end) setLabel(null);
      else if (now >= start) setLabel("Happening now");
      else {
        const days = Math.ceil((start - now) / DAY_MS);
        setLabel(days === 1 ? "Tomorrow!" : `${days} days to go`);
      }
    }
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [startsAt, endsAt]);

  if (!label) return null;
  // `date`: the outlined chip inside the gold date block on the Daksh and Trailblaze pages.
  if (tone === "date")
    return (
      <span className="inline-flex items-center gap-2 rounded-[16px] border border-ink/50 px-3.5 pt-2 pb-1.5 text-[0.81rem] font-bold leading-[1.3] text-ink">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" />
        </svg>
        {label}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 rounded-[16px] border border-gold/60 bg-ink/50 px-4 py-2 text-[0.86rem] font-semibold text-gold-light backdrop-blur-sm max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-[0.74rem]">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
      </span>
      {label}
    </span>
  );
}
