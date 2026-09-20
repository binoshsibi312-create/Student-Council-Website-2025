"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "christ-hub:my-posts";

/** How long after sharing an update its uploader may delete it. */
export const DELETE_WINDOW_MS = 5 * 60 * 1000;

interface MyPostEntry {
  idToken: string;
  orgEmail: string;
  uploadedAt: number;
}

type MyPostsMap = Record<string, MyPostEntry>;

function readStore(): MyPostsMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MyPostsMap) : {};
  } catch {
    return {};
  }
}

function writeStore(map: MyPostsMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore write failures — the delete option just won't persist across reloads
  }
}

function pruneExpired(map: MyPostsMap): MyPostsMap {
  const now = Date.now();
  const next: MyPostsMap = {};
  for (const [postId, entry] of Object.entries(map)) {
    if (now - entry.uploadedAt < DELETE_WINDOW_MS) next[postId] = entry;
  }
  return next;
}

/**
 * Tracks, on this device only, which posts the current visitor just
 * broadcast and the short-lived Google id token used to authenticate the
 * upload. Nobody else's browser ever holds this record, which is what keeps
 * the delete option private to the person who shared the update — combined
 * with the server re-checking the 5-minute window before actually deleting.
 */
export function useMyPosts() {
  const [mine, setMine] = useState<MyPostsMap>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMine(pruneExpired(readStore()));
  }, []);

  const remember = useCallback((postId: string, idToken: string, orgEmail: string, uploadedAt: number) => {
    setMine((prev) => {
      const next = pruneExpired({ ...prev, [postId]: { idToken, orgEmail, uploadedAt } });
      writeStore(next);
      return next;
    });
  }, []);

  const forget = useCallback((postId: string) => {
    setMine((prev) => {
      if (!(postId in prev)) return prev;
      const next = { ...prev };
      delete next[postId];
      writeStore(next);
      return next;
    });
  }, []);

  const getDeletable = useCallback(
    (postId: string): MyPostEntry | null => {
      const entry = mine[postId];
      if (!entry) return null;
      if (Date.now() - entry.uploadedAt >= DELETE_WINDOW_MS) return null;
      return entry;
    },
    [mine]
  );

  return { remember, forget, getDeletable };
}
