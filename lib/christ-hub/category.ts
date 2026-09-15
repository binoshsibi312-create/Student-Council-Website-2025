import type { PostCategory } from "./types";

export const CATEGORY_STYLE: Record<PostCategory, { pill: string; gradient: string }> = {
  Academic: { pill: "bg-steel/10 text-steel", gradient: "linear-gradient(150deg, var(--color-steel), #16283f)" },
  Cultural: { pill: "bg-gold/15 text-gold-dark", gradient: "linear-gradient(150deg, var(--color-gold-light), var(--color-gold-dark))" },
  Sports: { pill: "bg-crimson/10 text-crimson", gradient: "linear-gradient(150deg, #c23f3f, var(--color-crimson))" },
  Deadline: { pill: "bg-ink/8 text-ink", gradient: "linear-gradient(150deg, var(--color-ink-2), var(--color-ink))" },
  Admin: { pill: "bg-silver/30 text-text-secondary", gradient: "linear-gradient(150deg, var(--color-silver), var(--color-text-muted))" },
};
