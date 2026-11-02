# Phase 1 — Orientation

## Purpose & users

| Item | Finding |
|------|---------|
| Product | **Rhapsody Bible** web/PWA/desktop reader and companion app; internal name `rorbible` / **Scribbbler** (Electron `productName`, register copy) [CONFIRMED] `package.json:2-5`, `134-135`, `src/components/SplashScreen`, Store screens |
| Features (inferred from structure) | Bible reading (XML/JSON), annotations, collaboration, audio, digital store (`api.rorbible.plus`), KingsChat OAuth, Espees payments, admin dashboard [CONFIRMED] dirs + grep hits |
| Intended users | Bible readers, partners/store customers, admins/collaborators [INFERRED] from `screens/Admin`, `screens/Store`, auth flows |
| Maturity | **Production-shaped**: Firebase Hosting site `rhapsodybible`, committed `build/` (~355MB), production URLs in `build.sh` [CONFIRMED] `firebase.json:3-4`, `build.sh:5-7`; not a greenfield prototype |

## Stack & tooling

| Layer | Detail |
|-------|--------|
| Languages | TypeScript/JavaScript, SCSS; XML/JSON Bible assets [CONFIRMED] `tsconfig.json`, `src/` |
| UI | React 18, CRA 5 via **CRACO**, MUI + Evergreen + Tailwind/tw-elements, Recoil [CONFIRMED] `package.json:8-73`, `src/index.tsx:14-16` |
| Backend | Express dev server (`src/server.js`), Firebase (Hosting, Firestore, Cloud Functions Node 16), Cloudflare Worker sample (`workers/kingschat-callback`) [CONFIRMED] `package.json:106-107`, `firebase.json`, `functions/package.json:11-12` |
| Desktop | Electron 21 + electron-builder [CONFIRMED] `package.json:112-113`, `133-145` |
| Package manager | **Yarn** (`yarn.lock` ~614KB); npm scripts still used [CONFIRMED] root listing |
| Monorepo | **No** — root SPA + `functions/` + `workers/` sibling packages [CONFIRMED] two `package.json` files |
| TS config | `strict: true`, `baseUrl: "src"` [CONFIRMED] `tsconfig.json:11-23` |
| Node (functions) | engines **16** [CONFIRMED] `functions/package.json:11-12` |

## Size metrics

| Metric | Value |
|--------|-------|
| `src/` files (all types) | 519 [CONFIRMED] `find` |
| TS/TSX/JS/JSX/SCSS LOC in `src/` | ~34,911 [CONFIRMED] `wc -l` aggregate |
| TS/TSX files | 204 [CONFIRMED] |
| Component folders | ~72 under `src/components/` [CONFIRMED] |
| Disk (approx.) | `src/` 195M, `public/` 193M, `build/` 355M [CONFIRMED] `du` — bulk is Bible/media static data |
| `cloc` | Not installed [UNKNOWN] — used `wc` on source extensions |

### Top-level directories

| Path | Role |
|------|------|
| `src/` | Application source (components, screens, services, store) |
| `public/` | Static assets + Bible XML/Hebrew-Greek resources (mirrors much of `build/`) |
| `build/` | Pre-built CRA output (committed) |
| `functions/` | Firebase Cloud Functions |
| `workers/` | KingsChat OAuth callback worker |
| `scripts/` | Build/aux scripts (in tsconfig include) |
| `scss/` | Shared SCSS |
| `backup/` | Archived KingsChat login flow |
| `audit/` | Prior audit artifacts (not this run) |
| `docs/audit/` | This audit |

## Git health

| Item | Status |
|------|--------|
| Git repository | **[CONFIRMED] absent** — `fatal: not a git repository` in workspace |
| History / contributors / branches | **[UNKNOWN]** here; `backup/README.md` references commits `dc28744`, `767f16f` [INFERRED] copy may have been exported without `.git` |
| CI | No `.github/` workflows [CONFIRMED] glob |
| Conventions | Commit messages/churn hotspots **not auditable** without git |

## Skipped (noise)

`node_modules` (not present in tree), `build/static` minified JS/CSS, `public/bibleXML` & `HebrewGreekRes`, `src/BibleJson`, `yarn.lock` body, `firebase-debug.log`, `.DS_Store`, `backup/kingschat-old` full tree.

## Phase 1 summary (5 lines)

1. **Rhapsody Bible / Scribbbler** — React 18 PWA + optional Electron, Firebase-hosted production app.
2. ~35k LOC in `src/` plus **hundreds of MB** of Bible/store static assets in `public/`/`build/`.
3. Yarn + CRACO + TypeScript strict; satellite **`functions/`** (Node 16) and **`workers/`**.
4. **No git** in this workspace — cannot assess history or contributor patterns.
5. Committed **`build/`** and Firebase config indicate deploy-ready, legacy-ops style rather than prototype.
