# UI upgrade progress

Last updated: 2026-11-01 (Stage 0 complete)

## Scope lock

- Goal 1: Old website (`src/screens/Website`) → match `ROR_Bible_Plus_Website` (read-only reference).
- Goal 2: App screens (`src/screens` except Website, `src/components`) → same design language (Stage 4+).
- Out of scope: Electron, business logic, routing, auth, data layer.

## Git / branch

| Item | Status |
|------|--------|
| Git repository | **Not detected** (`git rev-parse` exit 128) |
| Branch `ui-upgrade` | **Blocked** — need your decision (init git vs. backup-only workflow) |
| Backup `src/screens/Website` | **Not created yet** — required per workflow before implementation if no git |

**Action needed from you:** Confirm whether to `git init` + branch `ui-upgrade`, or proceed with a filesystem backup of `src/screens/Website` only.

## Stage checklist

| Stage | Status | Artifact |
|-------|--------|----------|
| 0 Setup | Done | This file |
| 1 Visual comparison | Done | `docs/ui/01-visual-comparison.md` |
| 2 Code discrepancies | Done | `docs/ui/02-discrepancies.md` |
| Gate 1 | **STOP — awaiting your approval** | — |
| 3 Website implementation | Not started | `docs/ui/03-change-log.md` |
| 4 Design system + app analysis | Not started | `04-design-system.md`, `05-app-discrepancies.md` |
| Gate 2 | Waiting | — |
| 5 App implementation | Not started | `05-change-log.md` |

## Runtime detection (Stage 0)

### Main app (OLD website lives here)

| Field | Value |
|-------|--------|
| Package manager | **Yarn** (`yarn.lock` present; no root `package-lock.json`) |
| Framework | React 18 + **CRACO** (`react-scripts` 5) + TypeScript |
| Entry | `src/index.tsx` → `src/App.tsx` → `src/container/main.tsx` |
| UI stack (app-wide) | MUI, Evergreen, Tailwind (PostCSS via craco), SCSS (`theme/`), styled-components, tw-elements |
| Dev UI port | **3400** (`npm run react` → `cross-env PORT=3400 craco start`) |
| Express / payments | **3000** (`src/server.js`, `PORT` env or default 3000) |
| Combined dev | `npm run dev:payments` / `npm run local` — concurrent server + React |
| Proxy | `src/setupProxy.js` → `/espees`, `/proxy` → `http://localhost:3000` |
| `node_modules` | Installed via `yarn install` (Stage 1) |
| Website-only dev | Use `npm run react` (no Express required for static marketing routes) |

### OLD website routes (`src/container/main.tsx`)

| Path | Component | Notes |
|------|-----------|--------|
| `/`, `/home` | `screens/Website/landingPage` | Hash or Browser router per `isElectron` |
| `/about` | `screens/Website/about` | Also modal route when opened from dashboard |
| `/product` | `screens/Website/product` | Modal variant |
| `/give` | `screens/Website/give` | Modal variant |
| `/partner` | `screens/Website/partner` | Modal variant |

Route constants: `src/navigation/routes.ts` (`HomeRoute = '/home'`, etc.). Marketing paths are **literal strings** in `main.tsx`, not exported constants.

### OLD website files (`src/screens/Website/`)

15 TSX modules: `landingPage`, `header`, `footer`, `sideNav`, `carousel`, `features`, `about`, `product`, `give`, `partner`, `videoplayer`, `featureProduct`, `featuresAbout`, `homepage`, `partnerPhoneInput.css`.

Styling: **Tailwind utility classes** in components (sample: `header.tsx` `#18668D`, `#0299B4`).

### NEW reference site (`ROR_Bible_Plus_Website/`)

| Field | Value |
|-------|--------|
| Type | **Static HTML/CSS/JS** (no `package.json`, no install) |
| Run | Open HTML or serve folder (README recommends web server for fonts/video) |
| Pages | `index.html`, `features.html`, `pricing.html`, `download.html`, `web.html`, `mobile.html`, `desktop.html`, `voice.html` |
| Assets | `css/styles.css`, `js/main.js`, `images/`, `fonts/` (Montserrat woff) |
| Brand tokens (README) | Cyan `#07BDD2`, Teal `#099DB2`, Deep blue `#19688B`, Orange `#FF5900`, BG `#F6FBFD`, Montserrat |

**Do not edit** `ROR_Bible_Plus_Website/`.

## Decisions log

| Date | Decision | Approved IDs |
|------|----------|--------------|
| — | — | — |

## Runtime notes (Stage 1)

- NEW site served with `npx serve -l 5501` (Python missing on host).
- OLD site: `npm run react` on 3400; webpack error overlay from TS2307 `product_Details.` — screenshots taken after temporary overlay removal in browser only.

## Next step

**Gate 1:** Review `docs/ui/02-discrepancies.md` and reply with approved/rejected IDs.
