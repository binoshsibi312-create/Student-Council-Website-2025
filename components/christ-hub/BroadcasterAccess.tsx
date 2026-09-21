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
const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** Vercel's function responses aren't always JSON (e.g. a plain-text 413 from the platform itself), so parse defensively rather than letting a bad response crash the flow. */
async function safeJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default function BroadcasterAccess({
  clientId,
  onPosted,
}: {
  clientId?: string;
  onPosted: (post: ChristHubPost, idToken: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadStage, setUploadStage] = useState<"uploading" | "publishing" | null>(null);
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
    const form = new FormData(formElement);
    const caption = String(form.get("caption") ?? "").trim();
    const category = String(form.get("category") ?? "");
    const fileValue = form.get("file");
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

    if (file && file.size > MAX_FILE_BYTES) {
      setMessage("Media must be 50 MB or smaller.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      let driveFileId: string | undefined;
      let mediaType: string | undefined;

      if (file) {
        // Step 1: ask our server to open a Drive upload session. This
        // request is tiny (just the file's name/type/size), so it's never
        // at risk of hitting a platform request-size limit.
        setUploadStage("uploading");
        const sessionResponse = await fetch("/api/broadcast/upload-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, fileName: file.name, mimeType: file.type, fileSize: file.size }),
        });
        const sessionResult = await safeJson(sessionResponse);
        if (!sessionResponse.ok || !sessionResult?.ok || typeof sessionResult.uploadUrl !== "string") {
          throw new Error(typeof sessionResult?.error === "string" ? sessionResult.error : "Could not start the upload. Please try again.");
        }
        mediaType = typeof sessionResult.mediaType === "string" ? sessionResult.mediaType : undefined;

        // Step 2: send the actual file bytes straight to Google — never
        // through our own server — so 50 MB photos and videos aren't
        // capped by our function's request body limit.
        const putResponse = await fetch(sessionResult.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const driveFile = await safeJson(putResponse);
        if (!putResponse.ok || typeof driveFile?.id !== "string") {
          throw new Error("The upload to Google Drive failed. Please try again.");
        }
        driveFileId = driveFile.id;
      }

      // Step 3: finalize — this is the only step for a text-only announcement.
      setUploadStage("publishing");
      const response = await fetch("/api/broadcast/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, caption, category, driveFileId, mediaType }),
      });
      const result = await safeJson(response);
      if (!response.ok || !result?.ok || !result.post) {
        throw new Error(typeof result?.error === "string" ? result.error : "Could not publish this post.");
      }
      onPosted(result.post as ChristHubPost, idToken);
      close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish this post.");
    } finally {
      setSubmitting(false);
      setUploadStage(null);
    }
  }

  return (
    <>
      <div className="mb-7 -mt-6 flex justify-end">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-[0.78rem] font-semibold text-gold-light shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:bg-ink-2 hover:shadow-md cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="text-base leading-none" aria-hidden="true">+</span>
          Share an update
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="w-full max-w-[560px] max-h-[92vh] overflow-y-auto rounded-card-lg border border-white/60 bg-white p-8 shadow-[0_24px_80px_rgba(33,30,26,0.28)] max-[640px]:p-5"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="broadcaster-access-title"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                    Broadcaster studio
                  </div>
                  <h3 id="broadcaster-access-title" className="font-display text-[1.55rem] font-semibold leading-tight text-ink">
                    Share with Christ Hub
                  </h3>
                </div>
                <button onClick={close} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-text-muted transition-colors hover:border-ink hover:text-ink cursor-pointer" aria-label="Close posting dialog">
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              <p className="mb-6 max-w-[440px] text-[0.84rem] font-light leading-[1.6] text-text-secondary">
                Sign in with the exact account listed as active in the broadcaster directory. Subdomain accounts such as MSAM, MBA and CCA are supported.
              </p>
              {!clientId ? (
                <p className="text-[0.85rem] text-crimson">Google sign-in is not configured on this deployment.</p>
              ) : !idToken ? (
                <div className="rounded-card-md border border-line bg-paper-2 p-5">
                  <div className="mb-3 text-[0.76rem] font-medium text-text-secondary">Sign in to continue</div>
                  <div ref={signInRef} className="min-h-10" />
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-5">
                  <div className="flex items-center justify-between rounded-card-md border border-gold/40 bg-gold-light/20 p-3.5 text-[0.78rem]">
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

                  <label className="grid gap-2 text-[0.78rem] font-medium text-text-secondary">
                    <span>Media <span className="font-light text-text-muted">(optional)</span></span>
                    <input
                      name="file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                      className="w-full cursor-pointer rounded-card-md border border-dashed border-gold-dark/60 bg-paper-2 p-4 text-[0.78rem] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-2 file:text-[0.72rem] file:font-semibold file:text-gold-light"
                      onChange={handleFileChange}
                    />
                    <span className="text-[0.7rem] text-text-muted font-light">
                      JPEG, PNG, WebP, MP4, WebM or MOV. Maximum 50 MB. No poster? Skip this — your caption below
                      is shown as a full text announcement in the story instead.
                    </span>
                  </label>

                  {previewUrl && (
                    <div className="relative flex max-h-52 items-center justify-center overflow-hidden rounded-card-md bg-stone-900 ring-1 ring-line">
                      {mediaIsVideo ? (
                        <video src={previewUrl} className="max-h-48 w-full object-contain" controls muted />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="max-h-48 w-full object-contain" />
                      )}
                    </div>
                  )}

                  <label className="grid gap-2 text-[0.78rem] font-medium text-text-secondary">
                    Caption
                    <textarea
                      name="caption"
                      required
                      maxLength={2000}
                      rows={4}
                      className="resize-y rounded-card-md border border-line bg-paper-2 p-3.5 text-[0.86rem] font-light outline-none transition-colors focus:border-gold-dark focus:bg-white"
                      placeholder="What should students know?"
                    />
                  </label>

                  <label className="grid gap-2 text-[0.78rem] font-medium text-text-secondary">
                    Category
                    <select name="category" required className="rounded-card-md border border-line bg-paper-2 p-3.5 text-[0.86rem] outline-none transition-colors focus:border-gold-dark focus:bg-white">
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
                    className="w-full rounded-full bg-ink px-5 py-3.5 text-[0.86rem] font-semibold text-gold-light shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ink-2 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    type="submit"
                  >
                    {uploadStage === "uploading" ? "Uploading media…" : uploadStage === "publishing" ? "Publishing…" : submitting ? "Publishing…" : "Publish post"}
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

