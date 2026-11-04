# Firebase Hosting (web + PWA)

Hosting-only deploys for the CRA web build in `build/`. Do **not** run full `firebase deploy` without `--only hosting`, or you risk shipping Firestore rules, Cloud Functions, or Storage.

## Projects and sites

| Role | Firebase project | Hosting site id | URL |
|------|------------------|-----------------|-----|
| **App backend (unchanged)** | `kjv-strongs-reader` | (not deployed from this branch) | Auth/Firestore/Storage stay on existing web config in `src/config/firebase.ts` |
| **Staging (current target)** | `ror-premium-bible-reader` | `rhapsodybiblestaging` | https://rhapsodybiblestaging.web.app |
| **Production (later)** | `ror-premium-bible-reader` | `ror-premium-bible-reader` | https://ror-premium-bible-reader.web.app |
| **Legacy live (do not touch)** | `kjv-strongs-reader` | `rhapsodybible` | https://rhapsodybible.web.app |

`.firebaserc` default project: **`ror-premium-bible-reader`**.  
`firebase.json` `"site"`: **`rhapsodybiblestaging`** (change to `ror-premium-bible-reader` only when promoting production hosting).

Log in with `firebase login`. In Cursor/VS Code terminals, if the CLI errors on missing `lib/templates/hosting/init.js`, run with `env -u VSCODE_CWD firebase …`.

## Build (web / PWA)

From repo root (branch `hosting-new-project` or release branch):

```bash
export MSYS_NO_PATHCONV=1
export CI=false
export NODE_OPTIONS=--max-old-space-size=6144
export GENERATE_SOURCEMAP=false
export PUBLIC_URL=/
# then run craco build via build.sh env (see deploy-web) or:
./node_modules/.bin/craco build
```

**Windows Git Bash:** `MSYS_NO_PATHCONV=1` is required so `PUBLIC_URL=/` is not rewritten to `C:/Program Files/Git/` (which breaks asset URLs on Hosting).

- Do **not** set `REACT_APP_IS_ELECTRON` (Electron uses `npm run build-electron`).
- KingsChat redirect in `build.sh` still points at **legacy** `https://rhapsodybible.web.app/auth/callback` until you register staging/production callbacks separately.

Confirm `build/index.html` references `/static/js/...`, not `file://` or `C:/Program Files/Git/`.

## Deploy staging

```bash
export FIREBASE_HOSTING_UPLOAD_CONCURRENCY=1   # optional; avoids flaky parallel uploads on some networks
env -u VSCODE_CWD firebase deploy --only hosting:rhapsodybiblestaging --project ror-premium-bible-reader
```

Hosting-only. Never deploy to `kjv-strongs-reader`. Never deploy to site `ror-premium-bible-reader` until promotion is approved.

Espees rewrites in `firebase.json` point at Cloud Functions that are **not** in `ror-premium-bible-reader`; CLI warns but static hosting still ships. `/proxy` is **not** wired in hosting—see audit notes in verification.

## Promote to production site (later)

After staging QA:

1. Set `firebase.json` → `"site": "ror-premium-bible-reader"`.
2. Deploy:

```bash
env -u VSCODE_CWD firebase deploy --only hosting:ror-premium-bible-reader --project ror-premium-bible-reader
```

3. Register KingsChat redirect for the production Hosting URL if needed.

## Rollback

```bash
env -u VSCODE_CWD firebase hosting:rollback --site rhapsodybiblestaging --project ror-premium-bible-reader
```

Or Firebase console → Hosting → Release history → Roll back (per site).

## Cache and headers

See `firebase.json`: `index.html` / `service-worker.js` no-cache; `/static/**` immutable; `manifest.json` short cache; `/HebrewGreekRes/**` CORS `*`.

## Rewrites (order)

1. `/espees/create-product` → function name (no endpoint in this project yet)
2. `/espees/confirm-payment` → function name (same)
3. `**` → `/index.html` (last)

## Follow-ups

- [ ] Register KingsChat OAuth redirect for `https://rhapsodybiblestaging.web.app/auth/callback` (and prod URL when promoted)
- [ ] Decide Espees + `/proxy` strategy on new project (Functions or absolute URLs to `kjv-strongs-reader`)
- [ ] Cut DNS/custom domain when moving off `rhapsodybible.web.app`
- [ ] Re-run parity (`C:/temp/parity/compare.mjs`) after visual changes

## Post deploy checklist

- [ ] Website routes hard-refresh on staging URL
- [ ] `/bible-online`, `/read`, Strong's JSON 200 + CORS
- [ ] `/dash` logged out → `/login`
- [ ] PWA manifest, SW, installability
- [ ] No unexpected Firestore/Auth console errors beyond known SDK warnings
