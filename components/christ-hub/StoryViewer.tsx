"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChristHubOrg, ChristHubPost } from "@/lib/christ-hub/types";
import { christHubMediaUrl, formatRelativeTime, orgInitials } from "@/lib/christ-hub/format";
import { CATEGORY_STYLE } from "@/lib/christ-hub/category";
import { hoursRemaining } from "@/lib/christ-hub/expiry";
import { useViewerId } from "@/lib/christ-hub/use-viewer-id";

const STORY_MS = 15000;
/** A held press shorter than this still counts as a tap-to-navigate. */
const HOLD_THRESHOLD_MS = 180;
/** How often to refresh the "watching now" count while a story is open. */
const VIEWER_HEARTBEAT_MS = 4000;

interface DeletableEntry {
  idToken: string;
  orgEmail: string;
  uploadedAt: number;
}

export default function StoryViewer({
  orgs,
  postsByOrg,
  orderedEmails,
  activeOrgEmail,
  isHighlight,
  onClose,
  onNavigateOrg,
  getDeletable,
  onDeletePost,
}: {
  orgs: ChristHubOrg[];
  postsByOrg: Map<string, ChristHubPost[]>;
  orderedEmails: string[];
  activeOrgEmail: string | null;
  isHighlight: boolean;
  onClose: () => void;
  onNavigateOrg: (email: string | null) => void;
  getDeletable: (postId: string) => DeletableEntry | null;
  onDeletePost: (postId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  const rafRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const startRef = useRef(0);
  const pressStartRef = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const viewerId = useViewerId();

  const org = useMemo(() => orgs.find((o) => o.email === activeOrgEmail) ?? null, [orgs, activeOrgEmail]);
  const posts = activeOrgEmail ? postsByOrg.get(activeOrgEmail) ?? [] : [];
  const post = posts[index];
  const isVideo = post?.mediaType === "video";

  function jumpToOrg(offset: number) {
    if (!activeOrgEmail) return;
    // A highlight reel is scoped to the one org the user tapped into — it
    // never spills into another org's highlights on its own; running out
    // just closes the viewer.
    if (isHighlight) {
      onClose();
      return;
    }
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

  // Reset per-post playback state whenever the visible post changes.
  useEffect(() => {
    elapsedRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    setPaused(false);
    setConfirmingDelete(false);
    setDeleteError("");
    setDeleting(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, [post?.id]);

  // Image/text stories advance on a fixed timer; holding pauses it in place.
  useEffect(() => {
    if (!activeOrgEmail || !post || isVideo) return;
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - elapsedRef.current;
    function frame(now: number) {
      const elapsed = now - startRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min(1, elapsed / STORY_MS);
      setProgress(pct);
      if (pct >= 1) {
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrgEmail, post?.id, paused, isVideo]);

  // Video stories track their own runtime; holding pauses the actual video.
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    if (paused) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
  }, [paused, isVideo, post?.id]);

  function handleVideoTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const el = event.currentTarget;
    if (el.duration > 0) setProgress(el.currentTime / el.duration);
  }

  // Best-effort "watching now" count: heartbeat while this story is open.
  useEffect(() => {
    if (!activeOrgEmail || !post || !viewerId) return;
    let cancelled = false;
    async function beat() {
      try {
        const response = await fetch("/api/christ-hub/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post!.id, viewerId }),
        });
        if (!response.ok) return;
        const data = (await response.json()) as { count?: number };
        if (!cancelled && typeof data.count === "number") setViewerCount(data.count);
      } catch {
        // best-effort only — a missed heartbeat just delays the count update
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewerCount(null);
    beat();
    const interval = setInterval(beat, VIEWER_HEARTBEAT_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrgEmail, post?.id, viewerId]);

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

  // A quick tap should still navigate instantly; only a press held past the
  // threshold counts as "hold to pause" (and then a release doesn't also
  // trigger navigation).
  function onPressStart() {
    pressStartRef.current = Date.now();
    holdTimerRef.current = setTimeout(() => setPaused(true), HOLD_THRESHOLD_MS);
  }

  function onPressEnd() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setPaused(false);
  }

  function handleNavClick(direction: "prev" | "next") {
    const held = Date.now() - pressStartRef.current >= HOLD_THRESHOLD_MS;
    if (held) return;
    if (direction === "prev") goPrev();
    else goNext();
  }

  const deletable = post ? getDeletable(post.id) : null;

  const startDeleteConfirm = useCallback(() => {
    setPaused(true);
    setConfirmingDelete(true);
    setDeleteError("");
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmingDelete(false);
    setDeleteError("");
    setPaused(false);
  }, []);

  async function confirmDelete() {
    if (!post || !deletable) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/broadcast/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, idToken: deletable.idToken }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "This update could not be deleted.");
      onDeletePost(post.id);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "This update could not be deleted.");
      setDeleting(false);
    }
  }

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
                  <div
                    className="h-full bg-white"
                    style={{
                      transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})`,
                      transformOrigin: "0 0",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-3 gap-2">
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
                {isHighlight && <span className="text-white/40 text-[0.68rem] shrink-0">· Highlight</span>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {deletable && !confirmingDelete && (
                  <button
                    className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                    onClick={startDeleteConfirm}
                    aria-label="Delete this update"
                    title="Delete this update"
                  >
                    🗑
                  </button>
                )}
                <button
                  className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                  onClick={onClose}
                  aria-label="Close story viewer"
                >
                  ✕
                </button>
              </div>
            </div>

            {confirmingDelete && (
              <div className="absolute top-16 left-3 right-3 z-20 flex items-center justify-between gap-3 rounded-card-md border border-white/15 bg-ink p-3.5 shadow-lg">
                <span className="text-[0.78rem] text-white font-light leading-[1.4]">
                  {deleteError || "Delete this update for everyone?"}
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={cancelDelete}
                    disabled={deleting}
                    className="rounded-full border border-white/25 px-3 py-1.5 text-[0.72rem] font-medium text-white/85 hover:text-white cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="rounded-full bg-crimson px-3 py-1.5 text-[0.72rem] font-semibold text-white hover:bg-crimson/85 cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            )}

            <button
              className="absolute left-0 top-0 w-1/3 h-full z-[5] cursor-default"
              aria-label="Previous story"
              onPointerDown={onPressStart}
              onPointerUp={onPressEnd}
              onPointerLeave={onPressEnd}
              onPointerCancel={onPressEnd}
              onClick={() => handleNavClick("prev")}
            />
            <button
              className="absolute right-0 top-0 w-2/3 h-full z-[5] cursor-default"
              aria-label="Next story"
              onPointerDown={onPressStart}
              onPointerUp={onPressEnd}
              onPointerLeave={onPressEnd}
              onPointerCancel={onPressEnd}
              onClick={() => handleNavClick("next")}
            />

            <div className="w-full h-full flex items-center justify-center" style={{ background: CATEGORY_STYLE[post.category].gradient }}>
              {(() => {
                const mediaUrl = christHubMediaUrl(post.driveFileId);
                if (mediaUrl) {
                  return post.mediaType === "video" ? (
                    <video
                      key={post.id}
                      ref={videoRef}
                      src={mediaUrl}
                      className="w-full h-full object-contain"
                      autoPlay
                      muted
                      playsInline
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={goNext}
                    />
                  ) : (
                    <img src={mediaUrl} alt="" className="w-full h-full object-contain" />
                  );
                }
                return (
                  <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
                    <span className="mb-4 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-light">
                      Announcement
                    </span>
                    <p className="font-display text-[1.5rem] sm:text-[1.7rem] font-semibold leading-[1.35] text-white">
                      {post.caption}
                    </p>
                  </div>
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
              {post.mediaType !== "none" && (
                <p className="text-white text-[0.88rem] leading-[1.55] font-light mb-3">{post.caption}</p>
              )}
              {post.registrationUrl && (
                <div className="relative z-20 flex flex-wrap gap-2">
                  <a
                    href={post.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-ink bg-gold py-1.5 px-3 rounded-full hover:bg-gold-light transition-colors"
                  >
                    Register →
                  </a>
                </div>
              )}
            </div>

            {viewerCount !== null && (
              <div
                className="absolute bottom-3 right-3 z-20 flex items-center gap-1 text-[0.66rem] font-medium text-white/50"
                aria-label={`${viewerCount} watching now`}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {viewerCount}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
