"use client";

import { useMemo, useState } from "react";
import { MEMBERS } from "@/lib/data";

function memberInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const selectClass =
  "font-body text-[0.83rem] py-2.25 px-3.5 border border-line rounded-md bg-white text-ink outline-none transition-colors focus:border-ink";

export default function MemberGrid() {
  const [division, setDivision] = useState("all");
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");

  const divisions = useMemo(
    () => [...new Set(MEMBERS.map((m) => m.dept.split(" — ")[0]))].sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MEMBERS.filter((m) => {
      const matchesDiv = division === "all" || m.dept.startsWith(division);
      const matchesLvl = level === "all" || m.level === level;
      const matchesSearch = !q || m.name.toLowerCase().includes(q);
      return matchesDiv && matchesLvl && matchesSearch;
    });
  }, [division, level, search]);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8">
        <select className={selectClass} value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value="all">All Schools &amp; Centres</option>
          {divisions.map((d) => (
            <option value={d} key={d}>{d}</option>
          ))}
        </select>
        <select className={selectClass} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="UG">Undergraduate</option>
          <option value="PG">Postgraduate</option>
          <option value="Centre">Centre / Office</option>
        </select>
        <input
          type="text"
          className={`${selectClass} cursor-text min-w-50 flex-1`}
          placeholder="Search member name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="text-[0.8rem] text-text-muted mb-6 font-light">
        Showing {filtered.length} verified profile{filtered.length === 1 ? "" : "s"} of 64 University
        Student Council members
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(170px,100%),1fr))] gap-y-7 gap-x-5 max-[640px]:grid-cols-[repeat(auto-fill,minmax(min(130px,100%),1fr))] max-[640px]:gap-y-5.5 max-[640px]:gap-x-3.5">
        {filtered.map((m) => (
          <div className="flex flex-col items-center text-center" key={m.name}>
            <div
              className="relative w-29 h-29 rounded-full p-1 mb-4 shrink-0 max-[640px]:w-23 max-[640px]:h-23"
              style={{ background: "linear-gradient(150deg, var(--color-gold-light), var(--color-gold-dark))" }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-ink-2 border-[3px] border-white">
                <div className="w-full h-full flex items-center justify-center font-display text-[1.6rem] font-medium text-white/85">
                  {memberInitials(m.name)}
                </div>
              </div>
            </div>
            <h4 className="font-display text-[0.94rem] font-semibold text-ink mb-0.75 leading-[1.3]">{m.name}</h4>
            <div className="text-[0.76rem] text-text-muted leading-[1.4] font-light max-w-40">{m.dept}</div>
            <span className="inline-block mt-1.5 text-[0.62rem] font-semibold tracking-[0.05em] uppercase text-steel bg-steel/8 py-0.5 px-2 rounded-full">
              {m.level}
            </span>
          </div>
        ))}
        <div className="col-span-full text-center p-5 text-text-muted text-[0.82rem] font-light border border-dashed border-line rounded-card-md">
          <strong className="text-text-secondary font-display font-semibold">+49 more members</strong>
          <br />
          The full 64-member USC roster and photographs are being added as they&apos;re verified.
        </div>
      </div>
    </>
  );
}
