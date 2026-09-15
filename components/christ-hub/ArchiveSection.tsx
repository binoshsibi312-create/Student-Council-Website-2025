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
    <div className="mt-2 border-t border-line pt-10">
      <div className="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-gold-dark">Story highlights</div>
      <h3 className="mb-1.5 font-display text-[1.35rem] font-semibold text-ink">Browse by organisation</h3>
      <p className="mb-6 max-w-[560px] text-[0.84rem] font-light leading-[1.6] text-text-secondary">
        Open an organisation to replay every story it has shared this term, with the newest story first.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-4">
        {orgs.map((org) => {
          const logoUrl = christHubMediaUrl(org.logoFileId);
          return (
            <button
              key={org.email}
              onClick={() => onOpenOrg(org.email)}
              className="group flex items-center gap-4 rounded-card-md border border-line bg-paper-2 p-4 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-card-md"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-2 font-display text-[0.9rem] font-medium text-white/90">
                {logoUrl ? <img src={logoUrl} alt="" className="w-full h-full object-cover" /> : orgInitials(org.orgName)}
              </span>
              <span className="min-w-0">
                <span className="block line-clamp-2 text-[0.9rem] font-semibold leading-[1.3] text-ink">
                  {org.orgName}
                </span>
                <span className="mt-1 block text-[0.72rem] text-text-muted">
                  {countByOrg.get(org.email) ?? 0} stor{(countByOrg.get(org.email) ?? 0) === 1 ? "y" : "ies"} this term
                </span>
              </span>
              <span className="ml-auto text-lg text-gold-dark transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
