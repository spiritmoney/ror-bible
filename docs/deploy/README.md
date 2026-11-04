# Firebase Hosting (web + PWA)

Hosting-only deploys for the CRA web build in `build/`. Do **not** run full `firebase deploy` without `--only hosting` (or channel deploy), or you risk shipping Firestore rules, Cloud Functions, or Storage.

## Project and site

| Item | Value |
|------|--------|
| Firebase project (app config) | `kjv-strongs-reader` |
| Hosting site id | `rhapsodybible` |
| Live URL | https://rhapsodybible.web.app |
| `public` directory | `build` |

Ensure `.firebaserc` points at `kjv-strongs-reader` (file is local; not always committed). Log in with `firebase login` before any deploy.

## Build (web / PWA)

From the repo root, on branch `deploy-web` (or your release branch):

```bash
export CI=false
export NODE_OPTIONS=--max-old-space-size=6144
export GENERATE_SOURCEMAP=false
npm run build
```

- Uses `PUBLIC_URL=/` via `package.json` (`npm run build` → `sh build.sh`).
- Do **not** set `REACT_APP_IS_ELECTRON` (that is for `npm run build-electron` only).
- `build.sh` sets KingsChat and API env vars; production redirect is `https://rhapsodybible.web.app/auth/callback`.

After build, confirm `build/` contains at least: `index.html`, `manifest.json`, `service-worker.js`, icons, `HebrewGreekRes/json/`, `bibleXML/`, fonts.

## Preview channel

```bash
firebase hosting:channel:deploy preview-YYYYMMDD --expires 7d --only hosting
```

If the CLI asks for a site, add:

```bash
firebase hosting:channel:deploy preview-YYYYMMDD --expires 7d --only hosting --site rhapsodybible
```

Use the preview URL from CLI output for QA (routes, PWA, Strong's JSON, `/dash` → `/login` when logged out).

## Live deploy

**Only after preview QA and explicit approval:**

```bash
firebase deploy --only hosting
```

Or target the site explicitly:

```bash
firebase deploy --only hosting:rhapsodybible
```

This replaces the current **live** release on site `rhapsodybible` (https://rhapsodybible.web.app).

## Rollback

- CLI: `firebase hosting:rollback` (interactive; selects previous release).
- Console: Firebase → Hosting → Release history → Roll back.

Rollback only affects Hosting static assets and headers/rewrites for that site—not Functions or Firestore.

## Cache and headers (firebase.json)

| Asset | Policy |
|-------|--------|
| `index.html`, `service-worker.js` | `Cache-Control: no-cache` |
| `/static/**` (hashed JS/CSS) | `public, max-age=31536000, immutable` |
| `manifest.json` | `public, max-age=3600` |
| `/HebrewGreekRes/**` | `Access-Control-Allow-Origin: *` (desktop Strong's fetches) |

Clients may keep old service workers until hard refresh or SW update; bump SW cache version in app code when changing offline behavior (outside this doc).

## Rewrites (order matters)

1. `/espees/create-product` → `espeesCreateProduct`
2. `/espees/confirm-payment` → `espeesConfirmPayment`
3. `**` → `/index.html` (SPA fallback; must stay **last**)

## Post go-live checklist

- [ ] `/`, `/pricing`, `/features`, `/download`, `/products/web` load on hard refresh
- [ ] `/bible-online`, `/read` work logged out; chapter nav OK
- [ ] `/HebrewGreekRes/json/...` returns 200
- [ ] `/dash` logged out → `/login`
- [ ] `manifest.json`, icons, service worker register; PWA installability
- [ ] No unexpected console errors or 404s on critical paths
- [ ] KingsChat login redirect registered for production callback URL
- [ ] Espees payment paths still hit Functions (smoke test if used)
