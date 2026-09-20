"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "christ-hub:viewer-id";

/**
 * A random, per-browser identifier used only to de-duplicate the live
 * "watching now" heartbeat (see /api/christ-hub/views). It never leaves this
 * device tied to any account.
 */
export function useViewerId(): string {
  const [viewerId, setViewerId] = useState("");

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setViewerId(existing);
        return;
      }
      const generated = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, generated);
      setViewerId(generated);
    } catch {
      // localStorage unavailable — fall back to a session-only id.
      setViewerId(crypto.randomUUID());
    }
  }, []);

  return viewerId;
}
