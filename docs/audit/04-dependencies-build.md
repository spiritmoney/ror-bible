# Phase 4 — Dependencies & Build

## Direct dependencies (root, by purpose)

| Purpose | Packages (sample) | Notes |
|---------|---------------------|-------|
| Core UI | `react` 18, `react-dom`, `react-router-dom` 6 | [CONFIRMED] `package.json` |
| Build | `@craco/craco`, `react-scripts` 5.0.1, `typescript` 4.7 | CRA 5 stack |
| State | `recoil`, `recoil-persist` (vendored under `src/module/`) | |
| Firebase client | `firebase` 9.9 | Modular SDK in `service/firebase.ts` |
| Editor/media | `react-quill`, `wavesurfer.js`, `react-pageflip`, `jszip` | |
| HTTP | `axios` **0.27.2** | Predates many security fixes [CONFIRMED] |
| Auth/crypto | `bcryptjs`, `jsonwebtoken`, `js-md5`, `js-sha256` | Client-side password verify [INFERRED] |
| Server (dev) | `express`, `cors`, `body-parser` | Bundled in same package.json |
| Desktop | `electron` 21, `electron-builder` | |
| PWA | Full `workbox-*` 6.5 set | |
| UI kits | `@mui/material`, `evergreen-ui`, `tailwindcss`, `tw-elements` | |

## Functions package (`functions/package.json`)

| Dep | Version | Note |
|-----|---------|------|
| `firebase-functions` | ^3.18 | Gen-1 HTTP functions |
| `firebase-admin` | ^10.0.2 | |
| `node-fetch` | ^2.7 | |
| Node engine | **16** | EOL for production [CONFIRMED] |

## Outdated / deprecated signals (static review)

| Package | Concern | Label |
|---------|---------|-------|
| `axios@0.27.2` | Known CVEs in 0.x line | [INFERRED] ecosystem advisories; not npm-audited here |
| `electron@21` | Far behind current major | [CONFIRMED] version pin |
| `firebase-functions@3` | Legacy API vs v2/v4 | [CONFIRMED] |
| `react-scripts@5` | Webpack 5 CRA maintenance mode | [INFERRED] industry norm |
| `@types/react-router-dom@5` with RR v6 | Stale types package | [CONFIRMED] `package.json:27` vs `68` |

## Vulnerability audit

| Scope | Result |
|-------|--------|
| Root `yarn audit` | **Not run** — no `node_modules`; install blocked in this environment [CONFIRMED] |
| `functions/npm audit` | **Not run** — same blocker |
| Prior in-repo note | `audit/AUDIT_REPORT.md` claims 23 CVEs in functions after audit [INFERRED] not re-verified |

## Licenses

| Item | Status |
|------|--------|
| Root `private: true` | No SPDX file [CONFIRMED] |
| License field in package.json | **Absent** [CONFIRMED] |

## Build, run, deploy

| Action | Command | Evidence |
|--------|---------|----------|
| Dev (full) | `sh local.sh` or `npm run dev:payments` | Express :3000 + CRA :3400 |
| Dev (UI only) | `npm run react` | `PORT=3400` |
| Production build | `npm run build` → `build.sh` → `craco build` | Sets `REACT_APP_*` |
| Tests | `craco test` | |
| Electron | `yarn electron:start` / `electron:build:all` | |
| Firebase deploy | Hosting `public: build`, Functions from `functions/` | `firebase.json` |
| Docker / IaC | **None** [CONFIRMED] |
| CI/CD | **No** `.github/workflows` [CONFIRMED] |

## Local build verification

| Step | Outcome |
|------|---------|
| `node_modules` present | **No** [CONFIRMED] |
| `craco build` / `craco start` | **Not executed** — would require `yarn install` (~large) |
| Committed `build/` | Present (~355MB) — suggests last build artifact checked in [CONFIRMED] |

## webpack / CRACO notes

- Node polyfills enabled for browser bundles (`crypto`, `fs`, etc.) [CONFIRMED] `craco.config.js:12-23`
- `splitChunks` optimization block **commented out** — larger initial bundles [CONFIRMED] `craco.config.js:25-40` region

## Phase 4 summary (5 lines)

1. **Yarn** lockfile; single fat `package.json` mixes client, dev server, and Electron.
2. **Stale axios, Electron 21, Node 16 functions** — upgrade debt.
3. **npm/yarn audit not run** here (no install); treat dependency CVE status as **unknown** until audit locally.
4. Deploy path is **Firebase Hosting + Functions**; no CI automation in repo.
5. Fresh clone **cannot build** without dependency install; committed `build/` may mask broken HEAD.
