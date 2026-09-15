"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChristHubPost, PostCategory } from "@/lib/christ-hub/types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string>) => void;
        };
      };
    };
  }
}

const CATEGORIES: PostCategory[] = ["Academic", "Cultural", "Sports", "Deadline", "Admin"];

export default function BroadcasterAccess({
  clientId,
  onPosted,
}: {
  clientId?: string;
  onPosted: (post: ChristHubPost) => void;
}) {
  const [open, setOpen] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  const signedInEmail = useMemo(() => {
    if (!idToken) return "";
    try {
      const base64Url = idToken.split(".")[1];
      if (!base64Url) return "";
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      return parsed.email || "";
    } catch {
      return "";
    }
  }, [idToken]);

  useEffect(() => {
    if (!open || !clientId || idToken) return;
    const render = () => {
      if (!window.google || !signInRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          setIdToken(credential);
          setMessage("");
        },
      });
      signInRef.current.replaceChildren();
      window.google.accounts.id.renderButton(signInRef.current, { theme: "outline", size: "large", width: "320" });
    };
    if (window.google) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
    return () => script.remove();
  }, [open, clientId, idToken]);

  function close() {
    setOpen(false);
    setIdToken("");
    setMessage("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    setMediaIsVideo(file.type.startsWith("video/"));
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    const form = new FormData(formElement);
    form.append("idToken", idToken);
    try {
      const response = await fetch("/api/broadcast/upload", { method: "POST", body: form });
      const result = (await response.json()) as { ok?: boolean; error?: string; post?: ChristHubPost };
      if (!response.ok || !result.ok || !result.post) {
        throw new Error(result.error ?? "Could not publish this post.");
      }
      onPosted(result.post);
      close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish this post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-6.5 -mt-6">
        <button
          className="inline-block bg-transparent text-ink border border-ink font-semibold text-[0.82rem] py-2.25 px-5 rounded-md transition-colors duration-250 hover:bg-ink hover:text-white cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Post to Christ Hub
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-ink/60 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="bg-white rounded-card-lg shadow-card-lg max-w-130 w-full max-h-[92vh] overflow-y-auto p-8 max-[640px]:p-6"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="broadcaster-access-title"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-dark uppercase">
                  Broadcaster Access
                </div>
                <button onClick={close} className="text-text-muted hover:text-ink cursor-pointer" aria-label="Close posting dialog">
                  ✕
                </button>
              </div>
              <h3 id="broadcaster-access-title" className="font-display text-[1.3rem] font-semibold text-ink mb-2">
                Post to Christ Hub
              </h3>
              <p className="text-[0.86rem] text-text-secondary leading-[1.6] font-light mb-5">
                Use your official @christuniversity.in account. Your organisation is resolved from the broadcaster directory after Google verifies the token.
              </p>
              {!clientId ? (
                <p className="text-[0.85rem] text-crimson">Google sign-in is not configured on this deployment.</p>
              ) : !idToken ? (
                <div ref={signInRef} className="min-h-10" />
              ) : (
                <form onSubmit={submit} className="grid gap-4">
                  <div className="flex items-center justify-between p-3 rounded-md bg-stone-100 border border-line text-[0.78rem]">
                    <div className="truncate">
                      <span className="text-text-muted">Broadcaster: </span>
                      <strong className="text-ink font-medium">{signedInEmail}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIdToken("");
                        setMessage("");
                      }}
                      className="text-gold-dark font-medium hover:underline ml-2 shrink-0 cursor-pointer"
                    >
                      Switch account
                    </button>
                  </div>

                  <label className="grid gap-1.5 text-[0.78rem] font-medium text-text-secondary">
                    Media (optional)
                    <input
                      name="file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                      className="text-[0.8rem]"
                      onChange={handleFileChange}
                    />
                    <span className="text-[0.7rem] text-text-muted font-light">
                      JPEG, PNG, WebP, MP4, WebM or MOV. Maximum 50 MB.
                    </span>
                  </label>

                  {previewUrl && (
                    <div className="relative rounded-md overflow-hidden max-h-48 bg-stone-900 flex items-center justify-center">
                      {mediaIsVideo ? (
                        <video src={previewUrl} className="max-h-48 w-full object-contain" controls muted />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="max-h-48 w-full object-contain" />
                      )}
                    </div>
                  )}

                  <label className="grid gap-1.5 text-[0.78rem] font-medium text-text-secondary">
                    Caption
                    <textarea
                      name="caption"
                      required
                      maxLength={2000}
                      rows={4}
                      className="border border-line rounded-md p-3 text-[0.86rem] font-light resize-y"
                      placeholder="What should students know?"
                    />
                  </label>

                  <label className="grid gap-1.5 text-[0.78rem] font-medium text-text-secondary">
                    Category
                    <select name="category" required className="border border-line rounded-md p-3 text-[0.86rem] bg-white">
                      <option value="">Choose a category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  {message && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-[0.8rem] text-red-700 font-normal leading-relaxed" role="alert">
                      {message}
                    </div>
                  )}

                  <button
                    disabled={submitting}
                    className="bg-gold text-ink font-semibold text-[0.86rem] py-3 px-5 rounded-md hover:bg-gold-light disabled:opacity-50 cursor-pointer"
                    type="submit"
                  >
                    {submitting ? "Publishing…" : "Publish post"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

