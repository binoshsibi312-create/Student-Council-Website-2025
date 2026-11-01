"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SIDEBAR_ITEMS } from "@/lib/data";

const iconButton =
  "shrink-0 w-10 h-10 rounded-xl border border-line bg-[#1b1b1f] text-fg cursor-pointer flex items-center justify-center transition-colors hover:border-fg/60";

function Brand() {
  return (
    <>
      <img src="/images/logos/christ_emblem.png" alt="University Student Council Logo" className="w-9.5 h-9.5 object-contain shrink-0" />
      <div className="min-w-0 overflow-hidden">
        <div className="text-[0.68rem] font-medium text-text-muted tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
          CHRIST (Deemed to be University)
        </div>
        <div className="font-display text-[0.95rem] font-semibold text-fg whitespace-nowrap overflow-hidden text-ellipsis">
          University Student Council
        </div>
      </div>
    </>
  );
}

/** Slide-in navigation for phones and tablets, opened from the hamburger in the top bar. */
function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[100] min-[1081px]:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-[312px] max-w-[85vw] flex-col border-r border-line bg-card px-4 pt-3.5 pb-6 shadow-[12px_0_40px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <button ref={closeRef} type="button" className={iconButton} onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-3 no-underline" onClick={onClose}>
            <Brand />
          </Link>
        </div>
        <div className="px-3.5 pt-4.5 pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-dark">Menu</div>
        <nav className="flex flex-col gap-1 overflow-y-auto" aria-label="Site navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-base no-underline transition-colors ${
                  active ? "bg-raised font-semibold text-gold-light" : "text-text-secondary hover:bg-paper-2 hover:text-fg"
                }`}
              >
                <span className={`h-4.5 w-[3px] shrink-0 rounded-full ${active ? "bg-gold-light" : "bg-line"}`} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-line px-3.5 pt-4">
          <a href="https://www.instagram.com/christ_studentcouncil.bcc/" target="_blank" rel="noopener noreferrer" className="text-[0.82rem] text-gold-light">
            @christ_studentcouncil.bcc
          </a>
          <div className="mt-1 text-[0.75rem] text-text-muted">© 2026 CHRIST (Deemed to be University)</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Top bar for phones and tablets (hidden on desktop): hamburger, then the
 * CHRIST emblem and name. It sticks to the top so the menu is always in reach.
 */
export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the menu when the route changes (e.g. browser back).
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-line bg-card px-4 py-3.5 min-[1081px]:hidden">
      <button
        type="button"
        className={iconButton}
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <Link href="/" className="flex min-w-0 items-center gap-3 no-underline">
        <Brand />
      </Link>
      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </header>
  );
}

/** Desktop sidebar (hidden below 1080px, where MobileNav takes over). */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sidebar-shell${collapsed ? " collapsed" : ""} shrink-0 bg-card border-r border-line sticky top-0 h-[calc(100dvh/var(--page-zoom))] z-50 max-[1080px]:hidden`}
      aria-label="Primary navigation"
    >
      <div className={`flex flex-col h-full p-6 ${collapsed ? "items-center px-3.5" : ""}`}>
        <div className={`flex items-center justify-between gap-2 mb-7 pb-5.5 border-b border-line w-full ${collapsed ? "flex-col gap-4" : ""}`}>
          <Link href="/" className="flex items-center gap-3 min-w-0 no-underline">
            <img
              src="/images/logos/christ_emblem.png"
              alt="University Student Council Logo"
              className="w-9.5 h-9.5 object-contain shrink-0"
            />
            <div className={`min-w-0 overflow-hidden transition-[opacity,width] duration-200 ${collapsed ? "w-0 opacity-0" : ""}`}>
              <div className="text-[0.68rem] font-medium text-text-muted tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                CHRIST (Deemed to be University)
              </div>
              <div className="font-display text-[0.95rem] font-semibold text-fg whitespace-nowrap overflow-hidden text-ellipsis">
                University Student Council
              </div>
            </div>
          </Link>
          <button
            className="shrink-0 w-7.5 h-7.5 rounded-full border border-line bg-card text-text-muted cursor-pointer flex items-center justify-center transition-colors hover:border-fg hover:text-fg"
            onClick={() => setCollapsed((c) => !c)}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-3.5 h-3.5"
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <path d="M15 6l-6 6 6 6" />
            </motion.svg>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 w-full overflow-y-auto ">
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-lg no-underline text-[0.87rem] font-medium whitespace-nowrap w-full transition-colors ${
                  collapsed ? "justify-center px-1.5 py-2.5" : "px-3.5 py-2.5"
                } ${active ? "bg-raised text-gold-light" : "text-text-secondary hover:bg-paper-2 hover:text-fg"}`}
              >
                <span className={collapsed ? "hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`pt-4.5 mt-3.5 border-t border-line w-full ${collapsed ? "opacity-0" : ""}`}>
          <div className="text-[0.7rem] text-text-muted text-center">© 2026 CHRIST</div>
        </div>
      </div>
    </aside>
  );
}
