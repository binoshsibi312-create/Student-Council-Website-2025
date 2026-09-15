/**
 * Google Apps Script Web App for Christ Hub File Uploads
 * 
 * This script runs under your personal / official Christ University account (which has full Drive storage quota).
 * It receives uploads from the Next.js server and creates the file in the designated Google Drive folder.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/ and create a "New project".
 * 2. Name it "Christ Hub Uploader".
 * 3. Replace all code in Code.gs with this file's contents.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "Christ Hub Poster Uploads".
 * 7. Set "Execute as": "Me" (your account).
 * 8. Set "Who has access": "Anyone".
 * 9. Click "Deploy", authorize permissions when prompted, and copy the Web App URL (ends in /exec).
 * 10. Add the URL to your .env.local:
 *     CHRIST_HUB_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Verify secret
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (expectedSecret && data.secret !== expectedSecret) {
      return responseJson({ ok: false, error: "Unauthorized: Invalid secret" }, 401);
    }

    const { fileName, mimeType, base64, rootFolderId, semester, orgName } = data;

    if (!base64 || !fileName) {
      return responseJson({ ok: false, error: "Missing file data" }, 400);
    }

    const decoded = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(decoded, mimeType || "application/octet-stream", fileName);

    let targetFolder;
    if (rootFolderId) {
      const rootFolder = DriveApp.getFolderById(rootFolderId);
      const semesterFolder = getOrCreateSubfolder(rootFolder, semester || "Current");
      targetFolder = getOrCreateSubfolder(semesterFolder, slugify(orgName || "general"));
    } else {
      targetFolder = DriveApp.getRootFolder();
    }

    const file = targetFolder.createFile(blob);
    
    // Set view access so the image can be served publicly
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      Logger.log("Sharing permission warning: " + shareErr);
    }

    return responseJson({
      ok: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      name: file.getName(),
    });
  } catch (err) {
    return responseJson({ ok: false, error: err.toString() }, 500);
  }
}

function doGet(e) {
  return responseJson({ ok: true, status: "Christ Hub Uploader Web App is running" });
}

function getOrCreateSubfolder(parent, name) {
  const iter = parent.getFoldersByName(name);
  if (iter.hasNext()) return iter.next();
  return parent.createFolder(name);
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "org";
}

function responseJson(payload, status) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
