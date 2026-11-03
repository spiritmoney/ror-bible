# Rhapsody Bible — Electron desktop

## Versions (pinned)

| Package | Version |
|---------|---------|
| electron | 45.2.1 |
| electron-builder | 26.18.0 |
| electron-updater | 6.8.11 |

## Prerequisites

- Node 20+ (CI uses 20; local dev tested on Node 24)
- Yarn 1.x
- Windows: Git Bash for `build.sh` / `scripts/prune-electron-build.sh`

## Development

```bash
yarn install
npm run electron:start
```

- UI dev server: **http://localhost:3400**
- Main process: `electron/main.ts` → compile with `npm run electron:compile` → `dist-electron/main.js`
- Window/taskbar icon: `electron/main.ts` → `getWindowIconPath()` (`build-resources/icon.png` in dev; `resources/app-icon.png` when packaged via `extraResources`)

## App icons

Desktop icons live in **`build-resources/`** (generated from `public/logo512.png`). See **`build-resources/README.md`** for the padding/downscale pipeline and the scratch Python regen command (`C:/temp/rhapsody-icon-scratch/generate_icons.py` + Pillow in that folder only).

electron-builder uses `build-resources/icon.ico` (Windows/NSIS), `icon.icns` (macOS/DMG), and `icon.png` (Linux). Legacy assets under `public/icon/` are unused.

## Environment

Copy `.env.example` to `.env` for local overrides. Desktop builds set:

- `REACT_APP_IS_ELECTRON=true`
- `REACT_APP_KINGSCHAT_REDIRECT_URL=rhapsody-bible://auth/callback`

Optional:

- `REACT_APP_ELECTRON_HOSTING_ORIGIN` — default `https://rhapsodybible.web.app`
- `ELECTRON_UPDATE_URL` — generic update feed (checks stay off until set)

## KingsChat redirect URIs (register in dashboard)

1. **Primary:** `rhapsody-bible://auth/callback`
2. **Fallback (HTTP-only portals):** `http://127.0.0.1:47823/auth/callback`

Use the same value for `REACT_APP_KINGSCHAT_REDIRECT_URL` in desktop builds.

## Build (unsigned)

### Windows (local)

```bash
npm run electron:build:win
```

Output under `dist/` (NSIS `.exe`).

### macOS (requires Mac hardware or CI)

```bash
npm run electron:build:mac
```

**UNVERIFIED on Windows hosts** — use the `build-macos` job in `.github/workflows/electron-build.yml` or a Mac with Xcode CLT.

## Signing & notarization (CI secret names only)

| Platform | Secrets |
|----------|---------|
| Windows | `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD` |
| macOS | `APPLE_CSC_LINK`, `APPLE_CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` |

## Releases & auto-update

- electron-builder `publish.provider`: **github** (disabled in CI until `release` job enabled)
- Set `ELECTRON_UPDATE_URL` before enabling `autoUpdater.checkForUpdates` in main
- Upload artifacts from CI; attach to GitHub Releases when ready

## Offline data

- **BibleJson** — bundled in the CRA build
- **HebrewGreekRes** — pruned from installer; fetched from Hosting on first use into `userData/HebrewGreekRes`

## Known limits

- Espees store payments deferred; runtime URLs exist for future enablement
- Marketing website routes remain in bundle; on desktop, `/` and marketing paths bootstrap to **`/bible-online`** (or last reader route). Sign-in is on demand for store, bookmarks/highlights, etc.
- Service worker disabled in Electron; web PWA unchanged

## Troubleshooting

| Issue | Check |
|-------|--------|
| Blank window packaged | Run `npm run electron:compile`; confirm `build/index.html` exists |
| Strong's lookup offline | First online launch to populate `userData/HebrewGreekRes` |
| OAuth loop | Protocol registered? `rhapsody-bible://auth/callback` matches env + KingsChat dashboard |
| `electron:start` hangs | Port 3400 free; `wait-on http://localhost:3400` |

See also `docs/electron/00-progress.md`, `docs/electron/03-verification.md`, and `docs/electron/01-audit.md`.
