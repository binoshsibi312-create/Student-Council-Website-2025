import { google, type drive_v3, type sheets_v4 } from "googleapis";
import { readFile } from "node:fs/promises";
import type { ChristHubFeed, ChristHubOrg, ChristHubPost, OrgType, PostCategory } from "./types";

const CATEGORIES: PostCategory[] = ["Academic", "Cultural", "Sports", "Deadline", "Admin"];
const ORG_TYPES: OrgType[] = ["department", "school", "club", "cell", "admin"];
const POSTS_RANGE = "Posts!A:N";
const ORG_RANGE = "OrgDirectory!A:E";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function readServiceAccountCredentials() {
  const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH;
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  let raw: string;
  if (filePath) {
    try {
      raw = await readFile(filePath, "utf8");
    } catch {
      throw new Error(`Service account file not found at ${filePath}. Place the downloaded JSON in a local secrets folder and set GOOGLE_SERVICE_ACCOUNT_JSON_PATH to that file.`);
    }
  } else if (rawJson) {
    raw = rawJson;
  } else {
    throw new Error("Google service account credentials are missing. Set GOOGLE_SERVICE_ACCOUNT_JSON_PATH or GOOGLE_SERVICE_ACCOUNT_JSON.");
  }

  try {
    const credentials = JSON.parse(raw) as { client_email: string; private_key: string };
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("The service account JSON is missing client_email or private_key.");
    }
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    return credentials;
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message
        ? `The service account JSON is invalid: ${error.message}`
        : "The service account JSON is invalid or malformed. Re-download it from Google Cloud Console and keep it in a local secrets folder."
    );
  }
}

function publicSheetsUrl(range: string): string {
  const spreadsheetId = required("CHRIST_HUB_SPREADSHEET_ID");
  const apiKey = required("GOOGLE_PUBLIC_API_KEY");
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;
}

async function readValues(range: string): Promise<string[][]> {
  const response = await fetch(publicSheetsUrl(range), { cache: "no-store" });
  if (!response.ok) throw new Error(`Google Sheets read failed (${response.status})`);
  const payload = (await response.json()) as { values?: string[][] };
  return payload.values ?? [];
}

function indexHeaders(values: string[][]): Record<string, number> {
  return Object.fromEntries((values[0] ?? []).map((name, index) => [String(name).trim(), index]));
}

function value(row: string[], headers: Record<string, number>, name: string): string {
  const index = headers[name];
  return index === undefined ? "" : String(row[index] ?? "").trim();
}

function normalizeOrgType(raw: string): OrgType {
  const lower = raw.toLowerCase().trim();
  if (lower.includes("school")) return "school";
  if (lower.includes("dept") || lower.includes("department")) return "department";
  if (lower.includes("club")) return "club";
  if (lower.includes("cell")) return "cell";
  if (ORG_TYPES.includes(lower as OrgType)) return lower as OrgType;
  return "admin";
}

function normalizeCategory(raw: string): PostCategory {
  const lower = raw.toLowerCase().trim();
  if (lower.includes("acad")) return "Academic";
  if (lower.includes("cult")) return "Cultural";
  if (lower.includes("sport")) return "Sports";
  if (lower.includes("dead")) return "Deadline";
  return CATEGORIES.find((category) => category.toLowerCase() === lower) ?? "Admin";
}

function isActive(raw: string): boolean {
  return ["yes", "true", "1"].includes(raw.toLowerCase());
}

export async function getOrgDirectory(): Promise<Record<string, ChristHubOrg>> {
  const values = await readValues(ORG_RANGE);
  const headers = indexHeaders(values);
  const directory: Record<string, ChristHubOrg> = {};

  for (const row of values.slice(1)) {
    const email = value(row, headers, "email").toLowerCase().trim();
    if (!email || !email.includes("@")) continue;
    directory[email] = {
      email,
      orgName: value(row, headers, "orgName") || email,
      orgType: normalizeOrgType(value(row, headers, "orgType")),
      logoFileId: value(row, headers, "logoFileId") || value(row, headers, "logoField") || undefined,
      active: isActive(value(row, headers, "active")),
    };
  }
  return directory;
}

export async function getGoogleFeed(): Promise<ChristHubFeed> {
  const [postValues, directory] = await Promise.all([readValues(POSTS_RANGE), getOrgDirectory()]);
  const headers = indexHeaders(postValues);
  const posts: ChristHubPost[] = postValues.slice(1).flatMap((row) => {
    const status = value(row, headers, "status");
    const orgEmail = value(row, headers, "orgEmail").toLowerCase().trim();
    if (status !== "published" || !orgEmail) return [];
    const directoryOrg = directory[orgEmail];
    return [{
      id: value(row, headers, "id"),
      timestamp: value(row, headers, "timestamp"),
      orgEmail,
      orgName: value(row, headers, "orgName") || directoryOrg?.orgName || orgEmail,
      orgType: normalizeOrgType(value(row, headers, "orgType") || directoryOrg?.orgType || "admin"),
      category: normalizeCategory(value(row, headers, "category")),
      caption: value(row, headers, "caption"),
      mediaType: value(row, headers, "mediaType") === "video" ? "video" : value(row, headers, "mediaType") === "image" ? "image" : "none",
      driveFileId: value(row, headers, "driveFileId") || undefined,
      registrationUrl: value(row, headers, "registrationUrl") || undefined,
      videoUrl: value(row, headers, "videoUrl") || value(row, headers, "driveFileUrl") || undefined,
      semester: value(row, headers, "semester"),
      status: "published",
    }];
  });

  posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return {
    semester: process.env.CHRIST_HUB_SEMESTER ?? posts[0]?.semester ?? "",
    generatedAt: new Date().toISOString(),
    orgs: Object.values(directory),
    posts,
  };
}

export async function serviceClients() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (refreshToken && clientSecret && clientId) {
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials({ refresh_token: refreshToken });
    return { drive: google.drive({ version: "v3", auth }), sheets: google.sheets({ version: "v4", auth }), auth };
  }

  const auth = new google.auth.GoogleAuth({
    credentials: await readServiceAccountCredentials(),
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
  });
  return { drive: google.drive({ version: "v3", auth }), sheets: google.sheets({ version: "v4", auth }), auth };
}

async function accessTokenFor(auth: { getAccessToken: () => Promise<unknown> }): Promise<string> {
  const result = await auth.getAccessToken();
  const token = typeof result === "string" ? result : (result as { token?: string | null } | null)?.token;
  if (!token) throw new Error("Could not obtain a Google access token.");
  return token;
}

function slugify(valueToSlug: string): string {
  return valueToSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "org";
}

async function getOrCreateFolder(drive: drive_v3.Drive, parentId: string, name: string): Promise<string> {
  const escapedName = name.replace(/'/g, "\\'");
  const found = await drive.files.list({
    q: `'${parentId}' in parents and name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const existing = found.data.files?.[0]?.id;
  if (existing) return existing;
  const created = await drive.files.create({
    requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
    fields: "id",
    supportsAllDrives: true,
  });
  if (!created.data.id) throw new Error("Drive folder creation returned no id");
  return created.data.id;
}

/**
 * Opens a Google Drive resumable-upload session and hands the session URL
 * back to the browser, which then PUTs the file bytes to Google directly.
 * The file never passes through our own server/Vercel function, which is
 * what lets uploads exceed Vercel's ~4.5 MB request body limit — routing a
 * 50 MB photo or video through our API route would always be rejected with
 * a 413 before it reached our code, regardless of any limit we enforce here.
 */
export async function createChristHubUploadSession(input: {
  org: ChristHubOrg;
  fileName: string;
  mimeType: string;
  fileSize: number;
}): Promise<string> {
  const { drive, auth } = await serviceClients();
  const rootId = required("CHRIST_HUB_DRIVE_ROOT_FOLDER_ID");
  const semester = process.env.CHRIST_HUB_SEMESTER ?? "Current";

  const semesterFolderId = await getOrCreateFolder(drive, rootId, semester);
  const orgFolderId = await getOrCreateFolder(drive, semesterFolderId, slugify(input.org.orgName));
  const accessToken = await accessTokenFor(auth);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": input.mimeType,
        "X-Upload-Content-Length": String(input.fileSize),
      },
      body: JSON.stringify({ name: `${Date.now()}-${input.fileName}`, parents: [orgFolderId] }),
    }
  );

  if (!response.ok) {
    throw new Error(`Could not start an upload session with Google Drive (${response.status}). Check that the configured Google account can edit the Christ Hub Drive folder.`);
  }
  const uploadUrl = response.headers.get("location");
  if (!uploadUrl) throw new Error("Google Drive did not return an upload session URL.");
  return uploadUrl;
}

/**
 * Records a published post. For media posts, the file has already landed in
 * Drive via the resumable session above — this just makes it link-viewable
 * and writes the Sheets row. Text-only announcements skip straight to the
 * Sheets row.
 */
export async function finalizeChristHubPost(input: {
  org: ChristHubOrg;
  caption: string;
  category: PostCategory;
  media?: { driveFileId: string; mediaType: "image" | "video" };
}) {
  const { drive, sheets } = await serviceClients();
  const semester = process.env.CHRIST_HUB_SEMESTER ?? "Current";

  if (input.media) {
    try {
      await drive.permissions.create({
        fileId: input.media.driveFileId,
        requestBody: { type: "anyone", role: "reader" },
        supportsAllDrives: true,
      });
    } catch {
      // Folder-level or domain permissions may already cover this file.
    }
  }

  const post = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    orgEmail: input.org.email,
    orgName: input.org.orgName,
    orgType: input.org.orgType,
    category: input.category,
    caption: input.caption,
    mediaType: input.media?.mediaType ?? ("none" as const),
    driveFileId: input.media?.driveFileId,
    semester,
    status: "published" as const,
  };
  await appendPostRow(sheets, post);
  return post;
}

/** How long after sharing an update its uploader may delete it. Mirrors the client-side window in use-my-posts.ts. */
const DELETE_WINDOW_MS = 5 * 60 * 1000;

function columnLetter(index: number): string {
  let n = index + 1;
  let letters = "";
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

/**
 * Soft-deletes a post by flipping its status to "removed" so it drops out of
 * getGoogleFeed's published-only filter. Re-validates ownership and the
 * 5-minute window server-side rather than trusting the caller, since the
 * client-side delete affordance is only a UI convenience.
 */
export async function deleteChristHubPost(input: { postId: string; requesterEmail: string }) {
  const { sheets } = await serviceClients();
  const spreadsheetId = required("CHRIST_HUB_SPREADSHEET_ID");
  const values = await readValues(POSTS_RANGE);
  const headers = indexHeaders(values);
  const idIndex = headers["id"];
  const orgEmailIndex = headers["orgEmail"];
  const timestampIndex = headers["timestamp"];
  const statusIndex = headers["status"];
  if (idIndex === undefined || orgEmailIndex === undefined || timestampIndex === undefined || statusIndex === undefined) {
    throw new Error("The Posts sheet is missing required columns.");
  }

  const rowNumber = values.findIndex((row, i) => i > 0 && String(row[idIndex] ?? "").trim() === input.postId);
  if (rowNumber < 1) throw new Error("This post could not be found. It may already be deleted.");

  const row = values[rowNumber];
  const ownerEmail = String(row[orgEmailIndex] ?? "").toLowerCase().trim();
  if (ownerEmail !== input.requesterEmail.toLowerCase().trim()) {
    throw new Error("You can only delete an update you shared yourself.");
  }

  const postedAt = new Date(String(row[timestampIndex] ?? "")).getTime();
  if (!Number.isFinite(postedAt) || Date.now() - postedAt > DELETE_WINDOW_MS) {
    throw new Error("This update can no longer be deleted. Deletion is only available for 5 minutes after sharing.");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Posts!${columnLetter(statusIndex)}${rowNumber + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: [["removed"]] },
  });
}

async function appendPostRow(sheets: sheets_v4.Sheets, post: Record<string, unknown>) {
  const spreadsheetId = required("CHRIST_HUB_SPREADSHEET_ID");
  const values = await readValues(POSTS_RANGE);
  const headers = values[0] ?? [];
  const row = headers.map((header) => {
    const key = String(header).trim();
    if (key === "driveFileUrl" && post.driveFileId) {
      return `/api/christ-hub/media/${post.driveFileId}`;
    }
    return post[key] ?? "";
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: POSTS_RANGE,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

export async function archiveChristHubSemester(nextSemester: string) {
  const currentSemester = process.env.CHRIST_HUB_SEMESTER;
  if (!currentSemester) throw new Error("CHRIST_HUB_SEMESTER must be configured before archiving");
  if (!nextSemester || nextSemester.length > 80) throw new Error("A valid next semester label is required");

  const { drive, sheets } = await serviceClients();
  const spreadsheetId = required("CHRIST_HUB_SPREADSHEET_ID");
  const values = await readValues(POSTS_RANGE);
  const headers = values[0] ?? [];
  const semesterIndex = headers.indexOf("semester");
  if (semesterIndex < 0) throw new Error("Posts sheet must have a semester column");
  const rowsToArchive = values.slice(1).filter((row) => String(row[semesterIndex] ?? "") === currentSemester);
  const archiveTitle = `Archive_${currentSemester}`.slice(0, 100);
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties" });
  const existingSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === archiveTitle);
  let archiveSheetId = existingSheet?.properties?.sheetId;
  if (archiveSheetId === undefined) {
    const created = await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: archiveTitle } } }] } });
    archiveSheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId;
  }
  if (archiveSheetId === undefined) throw new Error("Could not create archive sheet");
  await sheets.spreadsheets.values.update({ spreadsheetId, range: `${archiveTitle}!A1`, valueInputOption: "RAW", requestBody: { values: [headers, ...rowsToArchive] } });
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: POSTS_RANGE, requestBody: {} });
  const remainingRows = values.filter((row, index) => index === 0 || String(row[semesterIndex] ?? "") !== currentSemester);
  await sheets.spreadsheets.values.update({ spreadsheetId, range: "Posts!A1", valueInputOption: "RAW", requestBody: { values: remainingRows } });

  const rootId = required("CHRIST_HUB_DRIVE_ROOT_FOLDER_ID");
  const archiveFolderId = await getOrCreateFolder(drive, rootId, "Archive");
  const currentFolder = await drive.files.list({
    q: `'${rootId}' in parents and name = '${currentSemester.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const currentFolderId = currentFolder.data.files?.[0]?.id;
  if (currentFolderId) {
    const semesterArchiveFolderId = await getOrCreateFolder(drive, archiveFolderId, currentSemester);
    const children = await drive.files.list({
      q: `'${currentFolderId}' in parents and trashed = false`,
      fields: "files(id)",
      pageSize: 1000,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    await Promise.all((children.data.files ?? []).map((file) => file.id ? drive.files.update({ fileId: file.id, addParents: semesterArchiveFolderId, removeParents: currentFolderId, supportsAllDrives: true }) : Promise.resolve()));
    await drive.files.update({ fileId: currentFolderId, addParents: archiveFolderId, removeParents: rootId, supportsAllDrives: true });
  }
  await getOrCreateFolder(drive, rootId, nextSemester);
  return { archivedSemester: currentSemester, nextSemester, archivedPosts: rowsToArchive.length };
}
