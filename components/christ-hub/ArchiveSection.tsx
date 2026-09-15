"use client";

import type { ChristHubOrg } from "@/lib/christ-hub/types";
import { christHubMediaUrl, orgInitials } from "@/lib/christ-hub/format";

export default function ArchiveSection({
  orgs,
  countByOrg,
  onOpenOrg,
}: {
  orgs: ChristHubOrg[];
  countByOrg: Map<string, number>;
  onOpenOrg: (email: string) => void;
}) {
  if (orgs.length === 0) return null;

  return (
    <div className="mt-14 pt-10 border-t border-line">
      <div className="text-[0.74rem] font-semibold tracking-[0.2em] text-gold-dark uppercase mb-1.5">Archive</div>
      <h3 className="font-display text-[1.15rem] font-semibold text-ink mb-1.5">Past Broadcasts</h3>
      <p className="text-[0.84rem] text-text-secondary leading-[1.6] font-light mb-6 max-w-[560px]">
        Posts move here automatically 48 hours after going live. Open a department&apos;s folder to browse
        everything they&apos;ve previously shared, like highlights.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-3.5">
        {orgs.map((org) => {
          const logoUrl = christHubMediaUrl(org.logoFileId);
          return (
            <button
              key={org.email}
              onClick={() => onOpenOrg(org.email)}
              className="flex items-center gap-3 p-3.5 bg-paper-2 border border-line rounded-card-md text-left cursor-pointer transition-colors hover:border-gold hover:bg-white"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full shrink-0 bg-ink-2 text-white/90 font-display text-[0.85rem] font-medium overflow-hidden">
                {logoUrl ? <img src={logoUrl} alt="" className="w-full h-full object-cover" /> : orgInitials(org.orgName)}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.84rem] font-semibold text-ink leading-[1.3] line-clamp-2">
                  {org.orgName}
                </span>
                <span className="block text-[0.7rem] text-text-muted mt-0.5">
                  {countByOrg.get(org.email) ?? 0} past post{(countByOrg.get(org.email) ?? 0) === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
