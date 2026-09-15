"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChristHubOrg, ChristHubPost } from "@/lib/christ-hub/types";
import { christHubMediaUrl, formatRelativeTime, orgInitials } from "@/lib/christ-hub/format";
import { CATEGORY_STYLE } from "@/lib/christ-hub/category";
import { hoursRemaining } from "@/lib/christ-hub/expiry";

const STORY_SECONDS = 5;

export default function StoryViewer({
  orgs,
  postsByOrg,
  orderedEmails,
  activeOrgEmail,
  onClose,
  onNavigateOrg,
}: {
  orgs: ChristHubOrg[];
  postsByOrg: Map<string, ChristHubPost[]>;
  orderedEmails: string[];
  activeOrgEmail: string | null;
  onClose: () => void;
  onNavigateOrg: (email: string | null) => void;
}) {
  const [index, setIndex] = useState(0);

  const org = useMemo(() => orgs.find((o) => o.email === activeOrgEmail) ?? null, [orgs, activeOrgEmail]);
  const posts = activeOrgEmail ? postsByOrg.get(activeOrgEmail) ?? [] : [];
  const post = posts[index];

  function jumpToOrg(offset: number) {
    if (!activeOrgEmail) return;
    const pos = orderedEmails.indexOf(activeOrgEmail);
    const next = orderedEmails[pos + offset];
    onNavigateOrg(next ?? null);
  }

  function goNext() {
    if (index < posts.length - 1) setIndex((i) => i + 1);
    else jumpToOrg(1);
  }

  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
    else jumpToOrg(-1);
  }

  useEffect(() => {
    if (!activeOrgEmail) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrgEmail, index, posts.length]);

  return (
    <AnimatePresence>
      {activeOrgEmail && org && post && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-ink/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="relative w-full h-full sm:max-w-[480px] sm:h-[92vh] sm:rounded-card-lg overflow-hidden bg-ink-2">
            <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2.5">
              {posts.map((p, i) => (
                <div key={p.id} className="flex-1 h-0.75 rounded-full bg-white/25 overflow-hidden">
                  {i < index && <div className="w-full h-full bg-white" />}
                  {i === index && (
                    <motion.div
                      key={p.id}
                      className="h-full bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      style={{ originX: 0 }}
                      transition={{ duration: STORY_SECONDS, ease: "linear" }}
                      onAnimationComplete={goNext}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white font-display text-[0.75rem] font-medium border border-white/30 shrink-0 overflow-hidden">
                  {christHubMediaUrl(org.logoFileId) ? (
                    <img src={christHubMediaUrl(org.logoFileId)!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    orgInitials(org.orgName)
                  )}
                </span>
                <span className="text-white text-[0.82rem] font-medium truncate">{org.orgName}</span>
                <span className="text-white/55 text-[0.72rem] shrink-0">{formatRelativeTime(post.timestamp)}</span>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white cursor-pointer shrink-0"
                onClick={onClose}
                aria-label="Close story viewer"
              >
                ✕
              </button>
            </div>

            <button className="absolute left-0 top-0 w-1/3 h-full z-[5] cursor-default" aria-label="Previous story" onClick={goPrev} />
            <button className="absolute right-0 top-0 w-2/3 h-full z-[5] cursor-default" aria-label="Next story" onClick={goNext} />

            <div className="w-full h-full flex items-center justify-center" style={{ background: CATEGORY_STYLE[post.category].gradient }}>
              {(() => {
                const mediaUrl = christHubMediaUrl(post.driveFileId);
                if (mediaUrl) {
                  return post.mediaType === "video" ? (
                    <video src={mediaUrl} className="w-full h-full object-contain" controls autoPlay muted />
                  ) : (
                    <img src={mediaUrl} alt="" className="w-full h-full object-contain" />
                  );
                }
                return (
                  <span className="text-white/85 text-[0.8rem] font-semibold tracking-[0.12em] uppercase">
                    Announcement
                  </span>
                );
              })()}
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 z-10 p-5 pt-14"
              style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.75), transparent)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.05em] uppercase py-0.5 px-2 rounded-full bg-white/15 text-white">
                  {post.category}
                </span>
                <span className="text-[0.62rem] text-white/55 font-medium">
                  {(() => {
                    const remaining = hoursRemaining(post.timestamp);
                    return remaining > 0 ? `expires in ${remaining}h` : "expiring";
                  })()}
                </span>
              </div>
              <p className="text-white text-[0.88rem] leading-[1.55] font-light mb-3">{post.caption}</p>
              {(post.registrationUrl || post.videoUrl) && (
                <div className="relative z-20 flex flex-wrap gap-2">
                  {post.registrationUrl && (
                    <a
                      href={post.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-ink bg-gold py-1.5 px-3 rounded-full hover:bg-gold-light transition-colors"
                    >
                      Register →
                    </a>
                  )}
                  {post.videoUrl && (
                    <a
                      href={post.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-white bg-white/20 py-1.5 px-3 rounded-full hover:bg-white/30 transition-colors"
                    >
                      ▶ Watch video
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
