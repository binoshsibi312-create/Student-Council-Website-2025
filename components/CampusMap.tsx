"use client";

import { useState } from "react";
import { FLOORS, ROOM_ICON, type Room } from "@/lib/data";
import Icon from "@/components/Icon";

export default function CampusMap() {
  const [activeFloor, setActiveFloor] = useState("g");
  const [selected, setSelected] = useState<Room | null>(null);

  const floor = FLOORS.find((f) => f.id === activeFloor)!;

  function selectFloor(id: string) {
    setActiveFloor(id);
    setSelected(null);
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6.5">
        {FLOORS.map((f) => (
          <button
            key={f.id}
            className={`font-medium text-[0.78rem] py-2 px-4.5 rounded-full cursor-pointer transition-colors border ${
              f.id === activeFloor
                ? "bg-ink border-ink text-gold-light"
                : "bg-white border-line text-text-secondary hover:border-ink hover:text-ink"
            }`}
            onClick={() => selectFloor(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-7 items-start max-[1080px]:grid-cols-1">
        <div>
          <div className="mb-4.5">
            <h3 className="font-display text-[1.05rem] font-semibold text-ink mb-0.75">{floor.title}</h3>
            <p className="text-[0.78rem] text-text-muted font-light">Select a hotspot to view details</p>
          </div>
          <div
            className="schematic-grid grid grid-cols-7 auto-rows-[54px] gap-1.25 p-4 border border-line rounded-card-md bg-paper-2 max-[640px]:auto-rows-[46px]"
            style={{ gridTemplateRows: `repeat(${floor.rows}, 54px)` }}
          >
            {floor.rooms.map((r, i) => {
              const active = !!(selected && selected.name === r.name && selected.desc === r.desc);
              const circulation = r.type === "circulation";
              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-1.75 py-1.75 px-2.25 cursor-pointer transition-all overflow-hidden rounded-[4px] border ${
                    active
                      ? "bg-ink border-ink"
                      : circulation
                        ? "bg-paper-3 border-line hover:border-ink hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgba(0,0,0,0.16)]"
                        : "bg-white border-line hover:border-ink hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgba(0,0,0,0.16)]"
                  }`}
                  style={{ gridColumn: `${r.c} / span ${r.cs || 1}`, gridRow: r.r }}
                  onClick={() => setSelected(r)}
                >
                  <span
                    className={`w-3.75 h-3.75 shrink-0 ${
                      active ? "text-gold-light" : circulation ? "text-gold-dark" : "text-text-muted"
                    }`}
                  >
                    <Icon name={ROOM_ICON[r.type]} size={15} />
                  </span>
                  <span className={`text-[0.7rem] font-medium leading-[1.2] ${active ? "text-white" : "text-text-secondary"}`}>
                    {r.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky top-6 border border-line rounded-card-md p-6 min-h-50 flex flex-col max-[1080px]:static">
          {selected ? (
            <>
              <div className="text-[0.68rem] font-semibold text-gold-dark uppercase tracking-[0.08em] mb-2">Selected</div>
              <h4 className="font-display text-[1.2rem] font-semibold text-ink mb-2.5">{selected.name}</h4>
              <p className="text-[0.86rem] text-text-secondary leading-[1.65] font-light">{selected.desc}</p>
            </>
          ) : (
            <p className="text-text-muted text-[0.84rem] font-light my-auto">
              Select a hotspot on the plan to view what&apos;s there.
            </p>
          )}
        </div>
      </div>

      <p className="text-[0.75rem] text-text-muted mt-5 font-light">
        Schematic directory compiled from the Central Block floor register. More floors will be added as
        they&apos;re digitised.
      </p>
    </div>
  );
}
