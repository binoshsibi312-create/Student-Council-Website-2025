# Hidden pages

Folders starting with `_` are private in the Next.js App Router — nothing in
here is routed. These pages are switched off for now, not deleted:

- `christ-hub/page.tsx` — the Christ Hub stories feed (was served at `/`)
- `campus-map/page.tsx` — the interactive Campus Map (was `/campus-map`)

To bring one back, move its `page.tsx` to a routed folder (e.g.
`app/campus-map/page.tsx`), add it to `SIDEBAR_ITEMS` in `lib/data.ts`, and
remove its redirect from `next.config.mjs`.
