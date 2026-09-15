"use client";

import type { ChristHubOrg } from "@/lib/christ-hub/types";
import { christHubMediaUrl, orgInitials } from "@/lib/christ-hub/format";

export default function OrgAvatarRail({
  orgs,
  pinned,
  onTogglePin,
  onOpenOrg,
}: {
  orgs: ChristHubOrg[];
  pinned: string[];
  onTogglePin: (email: string) => void;
  onOpenOrg: (email: string) => void;
}) {
  if (orgs.length === 0) return null;

  return (
    <div className="relative -mx-1 mb-8 overflow-hidden px-1 pb-2 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-20 after:bg-gradient-to-l after:from-white after:via-white/85 after:to-transparent">
      <div className="flex gap-5 overflow-x-auto pb-2 pr-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {orgs.map((org) => {
        const isPinned = pinned.includes(org.email);
        return (
          <div key={org.email} className="flex w-24 shrink-0 flex-col items-center gap-2 text-center">
            <button
              className="relative h-21 w-21 rounded-full p-1 cursor-pointer shadow-[0_8px_20px_rgba(33,30,26,0.12)]"
              style={{ background: "linear-gradient(150deg, var(--color-gold-light), var(--color-gold-dark))" }}
              onClick={() => onOpenOrg(org.email)}
              aria-label={`View posts from ${org.orgName}`}
            >
              <span className="flex items-center justify-center w-full h-full rounded-full bg-ink-2 border-2 border-white text-white/90 font-display text-[0.95rem] font-medium overflow-hidden">
                {christHubMediaUrl(org.logoFileId) ? (
                  <img src={christHubMediaUrl(org.logoFileId)!} alt="" className="w-full h-full object-cover" />
                ) : (
                  orgInitials(org.orgName)
                )}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(org.email);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onTogglePin(org.email);
                  }
                }}
                aria-label={isPinned ? `Unfollow ${org.orgName}` : `Follow ${org.orgName}`}
                className={`absolute -right-1 -top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border text-[11px] transition-colors ${
                  isPinned ? "bg-gold border-gold text-ink" : "bg-white border-line text-text-muted hover:text-ink hover:border-ink"
                }`}
              >
                ★
              </span>
            </button>
            <span className="line-clamp-2 text-[0.73rem] font-medium leading-[1.25] text-text-secondary">
              {org.orgName}
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
}
