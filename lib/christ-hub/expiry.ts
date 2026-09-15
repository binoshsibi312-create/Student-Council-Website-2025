export const ACTIVE_WINDOW_HOURS = 48;
export const MAX_ACTIVE_POSTS_PER_ORG = 3;

const ACTIVE_WINDOW_MS = ACTIVE_WINDOW_HOURS * 60 * 60 * 1000;

export function isPostActive(timestamp: string, now: number = Date.now()): boolean {
  return now - new Date(timestamp).getTime() < ACTIVE_WINDOW_MS;
}

export function hoursRemaining(timestamp: string, now: number = Date.now()): number {
  const remainingMs = new Date(timestamp).getTime() + ACTIVE_WINDOW_MS - now;
  return Math.max(0, Math.ceil(remainingMs / (60 * 60 * 1000)));
}
