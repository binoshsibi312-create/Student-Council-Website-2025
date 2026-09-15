# Christ Hub setup

Christ Hub uses this Next.js application for both read and write paths. There is no Apps Script deployment and no redirect to a Google page.

## One-time Google Cloud setup

1. Create or select a Google Cloud project owned by the council's institutional Workspace administrator.
2. Enable **Google Sheets API**, **Google Drive API**, and **Google Identity Services** for the project.
3. Create a service account. Create a JSON key only if the deployment cannot use workload identity; keep that JSON secret.
4. Create a browser API key. Restrict it to the production Vercel domains and restrict the key to **Google Sheets API** and **Google Drive API**. This key is read-only in this application and is safe to expose only because those API restrictions are applied.
5. Create a Web application OAuth client ID for GIS. Add the production site origin, preview origins used for testing, and `http://localhost:3000` under **Authorized JavaScript origins**. Set the client ID in both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`.
6. Create a Google Sheet and share it as **Anyone with the link: Viewer**. Copy its ID from the URL.
7. Create a Drive folder named `StudentCouncil_ChristHub_26-27` (or use your existing root). Share that folder with the service account email as **Editor**. Copy the folder ID from the URL.
8. **If your Workspace does not have Google Shared Drives**: Deploy the lightweight Google Apps Script Web App from `docs/christ-hub/apps-script/Code.gs` under your account (or council account) and add `CHRIST_HUB_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec` to your `.env.local`. It creates files in your Drive folder using your account's regular Drive quota.
9. For local development, place the downloaded service-account JSON at `secrets/christ-hub-service-account.json` and set `GOOGLE_SERVICE_ACCOUNT_JSON_PATH=./secrets/christ-hub-service-account.json`. The `secrets` folder is git-ignored. Add the remaining values from `.env.local.example`.

Do not commit the service-account JSON, private key, or any `.env.local` file. If Workspace blocks `Anyone` Drive permissions, the media proxy cannot serve anonymous student views; ask the Workspace administrator to allow link-viewable files in this folder.

## Sheet layout

Create these tabs and exact header names. Column order can be changed because the server maps by header name.

### `Posts`

`id`, `timestamp`, `orgEmail`, `orgName`, `orgType`, `category`, `caption`, `mediaType`, `driveFileId`, `registrationUrl`, `videoUrl`, `semester`, `status`

`mediaType` is `image`, `video`, or `none`. `status` should be `published` for visible posts. `registrationUrl` and `videoUrl` are optional legacy-friendly fields; the current compose modal only asks for media, caption, and category.

### `OrgDirectory`

`email`, `orgName`, `orgType`, `logoFileId`, `active`

Use one lowercase `@christuniversity.in` address per official broadcaster. `orgType` is `department`, `school`, `club`, `cell`, or `admin`. Set `active` to `yes` or `no` to grant/revoke posting access without deleting history. This table is the authorization boundary: the server ignores any client-supplied org identity and resolves it from the verified Google email.

## Drive layout

The service account creates this structure automatically:

```text
Christ Hub/
  2026-Odd/
    dept-of-computer-science/
    school-of-business/
  Archive/
    2025-Even/
      ...
```

`CHRIST_HUB_SEMESTER` selects the live folder and the value written to new rows. With a root named `StudentCouncil_ChristHub_26-27`, the first upload creates `StudentCouncil_ChristHub_26-27/<semester>/<organisation>/` automatically.

## Runtime routes

- `GET /api/christ-hub/feed`: same-origin, five-minute cached public feed. The server reads the public Sheet with the API key.
- `GET /api/christ-hub/media/:fileId`: same-origin cached Drive proxy. Students never request Drive directly.
- `POST /api/broadcast/upload`: multipart form with `idToken`, `caption`, `category`, and optional `file`. GIS supplies the token in the in-page modal. The route verifies the token, exact Workspace domain, directory membership, media MIME type, and 50 MB limit before writing to Drive and Sheets.
- `POST /api/broadcast/archive`: protected maintenance route. Send `Authorization: Bearer $CHRIST_HUB_CRON_SECRET` and JSON such as `{ "nextSemester": "2027-Even" }`. Configure a Vercel Cron or run it manually at semester end, then update `CHRIST_HUB_SEMESTER` to the new value.

The archive operation copies the current semester rows to `Archive_<semester>`, removes them from `Posts`, moves the current Drive folder under `Archive/<semester>`, and creates the next live folder.

## PWA status

The manifest, service-worker registration, offline shell, and stale-while-revalidate caching for `/api/christ-hub/feed` are already site-wide. Web Push still needs a VAPID key pair, a subscription storage/send route, and a notification sender; the current service worker listener is intentionally a stub. Those keys must be treated as secrets and should be added only when the subscription workflow is implemented.
