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
    <div className="flex gap-4 overflow-x-auto pb-4 mb-2 -mx-1 px-1">
      {orgs.map((org) => {
        const isPinned = pinned.includes(org.email);
        return (
          <div key={org.email} className="flex flex-col items-center gap-1.5 shrink-0 w-19 text-center">
            <button
              className="relative w-16 h-16 rounded-full p-0.75 cursor-pointer"
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
                className={`absolute -top-1 -right-1 w-5.5 h-5.5 rounded-full border flex items-center justify-center text-[11px] cursor-pointer transition-colors ${
                  isPinned ? "bg-gold border-gold text-ink" : "bg-white border-line text-text-muted hover:text-ink hover:border-ink"
                }`}
              >
                ★
              </span>
            </button>
            <span className="text-[0.7rem] text-text-secondary font-medium leading-[1.25] line-clamp-2">
              {org.orgName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
