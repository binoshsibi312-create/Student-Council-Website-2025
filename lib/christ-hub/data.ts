import type { ChristHubFeed, ChristHubOrg, ChristHubPost, OrgType, PostCategory } from "./types";
import { getGoogleFeed } from "./google";

const ORG_TYPES: OrgType[] = ["department", "school", "club", "cell", "admin"];
const CATEGORIES: PostCategory[] = ["Academic", "Cultural", "Sports", "Deadline", "Admin"];

function normalizeOrgType(raw: unknown): OrgType {
  const lower = String(raw ?? "").trim().toLowerCase();
  return (ORG_TYPES as string[]).includes(lower) ? (lower as OrgType) : "admin";
}

function normalizeCategory(raw: unknown): PostCategory {
  const match = CATEGORIES.find((c) => c.toLowerCase() === String(raw ?? "").trim().toLowerCase());
  return match ?? "Admin";
}

/**
 * The OrgDirectory/Posts sheets are operator-edited free text (see
 * docs/christ-hub/README.md), so `orgType`/`category` casing isn't
 * guaranteed to match our TS unions exactly. Normalize on the way in
 * rather than trusting the Apps Script response shape verbatim.
 */
function normalizeFeed(raw: {
  semester?: string;
  generatedAt?: string;
  orgs?: Partial<ChristHubOrg>[];
  posts?: Partial<ChristHubPost>[];
}): ChristHubFeed {
  return {
    semester: raw.semester ?? "",
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    orgs: (raw.orgs ?? []).map((o) => ({
      email: String(o.email ?? "").toLowerCase(),
      orgName: String(o.orgName ?? ""),
      orgType: normalizeOrgType(o.orgType),
      logoFileId: o.logoFileId,
      active: o.active !== false,
    })),
    posts: (raw.posts ?? []).map((p) => ({
      id: String(p.id ?? ""),
      timestamp: String(p.timestamp ?? new Date().toISOString()),
      orgEmail: String(p.orgEmail ?? "").toLowerCase(),
      orgName: String(p.orgName ?? ""),
      orgType: normalizeOrgType(p.orgType),
      category: normalizeCategory(p.category),
      caption: String(p.caption ?? ""),
      mediaType: p.mediaType === "video" ? "video" : p.mediaType === "image" ? "image" : "none",
      driveFileId: p.driveFileId || undefined,
      registrationUrl: p.registrationUrl || undefined,
      videoUrl: p.videoUrl || undefined,
      semester: String(p.semester ?? ""),
      status: p.status === "hidden" || p.status === "pending" || p.status === "removed" ? "removed" : "published",
    })),
  };
}

/**
 * Reads the public Sheet through the server-side Google API client. The
 * fetch in google.ts uses Next's five-minute data cache. Until the Google
 * environment is configured, the page intentionally renders an empty feed.
 */
export async function getChristHubFeed(): Promise<ChristHubFeed> {
  if (!process.env.CHRIST_HUB_SPREADSHEET_ID || !process.env.GOOGLE_PUBLIC_API_KEY) {
    return emptyFeed();
  }
  try {
    return normalizeFeed(await getGoogleFeed());
  } catch (err) {
    console.error("[christ-hub] feed fetch failed:", err);
    return emptyFeed();
  }
}

function emptyFeed(): ChristHubFeed {
  return { semester: "", generatedAt: new Date().toISOString(), orgs: [], posts: [] };
}
