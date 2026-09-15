"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SIDEBAR_ITEMS } from "@/lib/data";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sidebar-shell${collapsed ? " collapsed" : ""} shrink-0 bg-white border-r border-line sticky top-0 h-screen z-50 max-[1080px]:relative max-[1080px]:h-auto max-[1080px]:border-r-0 max-[1080px]:border-b`}
      aria-label="Primary navigation"
    >
      <div
        className={`flex flex-col h-full p-6 max-[1080px]:p-4 ${collapsed ? "items-center px-3.5" : ""}`}
      >
        <div
          className={`flex items-center justify-between gap-2 mb-7 pb-5.5 border-b border-line w-full max-[1080px]:mb-3.5 max-[1080px]:pb-3.5 ${
            collapsed ? "flex-col gap-4" : ""
          }`}
        >
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
              <div className="font-display text-[0.95rem] font-semibold text-ink whitespace-nowrap overflow-hidden text-ellipsis">
                University Student Council
              </div>
            </div>
          </Link>
          <button
            className="shrink-0 w-7.5 h-7.5 rounded-full border border-line bg-white text-text-muted cursor-pointer flex items-center justify-center transition-colors hover:border-ink hover:text-ink"
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

        <nav className="flex-1 flex flex-col gap-1 w-full overflow-y-auto max-[1080px]:flex-row max-[1080px]:flex-wrap max-[1080px]:overflow-x-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg no-underline text-[0.87rem] font-medium whitespace-nowrap w-full transition-colors ${
                  collapsed ? "justify-center px-1.5 py-2.5" : "px-3.5 py-2.5"
                } ${
                  active
                    ? "bg-ink text-gold-light"
                    : "text-text-secondary hover:bg-paper-2 hover:text-ink"
                }`}
              >
                <span className={collapsed ? "hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`pt-4.5 mt-3.5 border-t border-line w-full max-[1080px]:hidden ${collapsed ? "opacity-0" : ""}`}>
          <div className="text-[0.7rem] text-text-muted text-center">© 2026 CHRIST</div>
        </div>
      </div>
    </aside>
  );
}
