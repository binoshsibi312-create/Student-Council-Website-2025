"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "christ-hub:pinned-orgs";

export function usePinnedOrgs() {
  const [pinned, setPinned] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Hydrate browser-only preferences after the server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPinned(JSON.parse(raw));
      }
    } catch {
      // localStorage unavailable (private browsing, disabled storage) — fall back to session-only state.
    } finally {
      setLoaded(true);
    }
  }, []);

  const togglePin = useCallback((email: string) => {
    setPinned((prev) => {
      const next = prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore write failures — pin state just won't persist this session
      }
      return next;
    });
  }, []);

  return { pinned, togglePin, loaded };
}
