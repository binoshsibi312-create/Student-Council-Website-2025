"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/preview/daksh", label: "Daksh 2026" },
  { href: "/preview/trailblaze", label: "Trailblaze" },
  { href: "/about", label: "About" },
  { href: "/governance", label: "Governance" },
  { href: "/mentors", label: "Mentors" },
  { href: "/members", label: "Members" },
  { href: "/events", label: "Events" },
  { href: "/procedures", label: "Procedures" },
  { href: "/reports", label: "Reports" },
  { href: "/contact", label: "Connect" },
];

/** Which page of the current design each preview page corresponds to. */
const CURRENT_DESIGN: Record<string, string> = { "/preview/daksh": "/", "/preview/trailblaze": "/trailblaze" };

export default function ShellB({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const compareHref = CURRENT_DESIGN[pathname] ?? "/";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e6ecfb_0%,#f6f8fe_40%,#ffffff_100%)] font-manjari text-db-ink">
      <header className="sticky top-0 z-50 border-b border-db-navy/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-8 py-3.5 max-[1080px]:flex-col max-[1080px]:items-stretch max-[1080px]:gap-3 max-[640px]:px-4">
          <Link href="/preview/daksh" className="flex shrink-0 items-center gap-3 no-underline">
            <img src="/images/logos/christ_emblem.png" alt="" className="h-10 w-10 object-contain" />
            <span className="leading-tight">
              <span className="block font-gs text-[0.66rem] font-medium uppercase tracking-[0.14em] text-db-steel">CHRIST (Deemed to be University)</span>
              <span className="block font-gs text-[0.98rem] font-semibold text-db-navy">University Student Council</span>
            </span>
          </Link>
          <nav aria-label="Primary navigation" className="ml-auto flex gap-1 overflow-x-auto max-[1080px]:ml-0 max-[1080px]:pb-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-[16px] px-3.5 py-2 font-gs text-[0.84rem] font-medium no-underline transition-colors ${
                    active ? "bg-db-royal text-white" : "text-db-navy/75 hover:bg-db-mist hover:text-db-navy"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-8 pt-8 pb-20 max-[640px]:px-4 max-[640px]:pt-4 max-[640px]:pb-14">{children}</main>

      <footer className="relative overflow-hidden bg-db-royal text-white">
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-8 py-8 max-[640px]:px-4">
          <div className="font-gs text-[0.95rem] font-semibold">University Student Council — CHRIST (Deemed to be University)</div>
          <div className="text-[0.82rem] text-white/70">© 2026 CHRIST (Deemed to be University), Bangalore.</div>
        </div>
      </footer>

      {/* Design comparison switch */}
      <Link
        href={compareHref}
        className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-[16px] border border-db-navy/15 bg-white/95 px-4 py-2.5 font-gs text-[0.8rem] font-semibold text-db-navy no-underline shadow-[0_10px_30px_-10px_rgba(3,46,75,0.45)] backdrop-blur hover:bg-db-mist max-[640px]:right-3 max-[640px]:bottom-3"
      >
        <span className="rounded-[8px] bg-db-butter px-1.5 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.08em]">Design B</span>
        Compare with current design →
      </Link>
    </div>
  );
}
