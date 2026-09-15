"use client";

import { useMemo, useState } from "react";
import { PROCEDURES } from "@/lib/data";

export default function ProceduresPanel() {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROCEDURES.map((p, i) => ({
      ...p,
      index: i,
      hidden: !(!q || p.title.toLowerCase().includes(q) || p.audience.toLowerCase().includes(q)),
    }));
  }, [search]);

  const firstVisibleIndex = visible.find((p) => !p.hidden)?.index;
  const currentIndex = visible[activeIndex]?.hidden === false ? activeIndex : firstVisibleIndex;
  const current = currentIndex !== undefined ? PROCEDURES[currentIndex] : null;

  return (
    <div className="grid grid-cols-[340px_1fr] border border-line rounded-card-md overflow-hidden min-h-125 max-[1080px]:grid-cols-1">
      <div className="flex flex-col">
        <div className="bg-paper-2 border-r border-line flex flex-col max-h-140 overflow-y-auto max-[1080px]:border-r-0 max-[1080px]:border-b max-[1080px]:max-h-75">
          {visible.map((p) => {
            const active = p.index === currentIndex;
            return (
              <button
                key={p.index}
                className={`flex flex-col gap-0.75 text-left border-0 border-b border-line py-3.75 px-5 cursor-pointer transition-colors ${
                  p.hidden ? "hidden" : ""
                } ${active ? "bg-ink" : "bg-transparent hover:bg-white"}`}
                onClick={() => setActiveIndex(p.index)}
              >
                <span className={`font-display text-[0.9rem] font-semibold ${active ? "text-white" : "text-ink"}`}>
                  {p.title}
                </span>
                <span className={`text-[0.68rem] font-medium ${active ? "text-white/55" : "text-text-muted"}`}>
                  {p.audience}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 px-5 border-t border-line mt-auto bg-white">
          <input
            type="text"
            className="w-full py-2 px-0.5 border-0 border-b border-line text-[0.84rem] font-body outline-none bg-transparent focus:border-ink"
            placeholder="Search a procedure…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-9 bg-white">
        {current ? (
          <>
            <div className="text-[0.7rem] font-semibold text-gold-dark uppercase tracking-[0.08em] mb-2.5">
              {current.audience}
            </div>
            <h3 className="font-display text-[1.4rem] font-semibold text-ink mb-5.5 tracking-[-0.01em]">
              {current.title}
            </h3>
            <ol className="proc-steps">
              {current.steps.map((s, i) => (
                <li key={i}>
                  <span className="text-[0.88rem] text-text-secondary leading-[1.6] font-light">{s}</span>
                </li>
              ))}
            </ol>
            <div className="border-t border-line pt-4 text-[0.8rem] text-text-muted font-light">
              <strong className="text-text-secondary font-medium">Contact —</strong> {current.contact}
            </div>
          </>
        ) : (
          <p className="text-text-muted text-[0.9rem] font-light">No procedures match your search.</p>
        )}
      </div>
    </div>
  );
}
