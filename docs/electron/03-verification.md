# Stage 3 — Verification

Branch: `electron-wrap` · Date: 2026-11-03

## Website parity (`C:/temp/parity/compare.mjs`)

Script restored/confirmed at `C:/temp/parity/compare.mjs` (puppeteer-core + fresh Chrome profile, Google Fonts blocked on React side, splash skipped, DOM/style by stable path, pixel diff at 1440/768/390, no overlay masking except removing `[data-allowed="1"]` from React screenshots only).

Reference: `npx serve -l 58840` in `ROR_Bible_Plus_Website/`. React: `http://localhost:3400`.

| Page | domDiff | styleDiff | pixel1440 | pixel768 | pixel390 | Pass |
|------|---------|-----------|-----------|----------|----------|------|
| home | 0 | 0 | 0.0003% | 0% | 0% | yes |
| features | 0 | 0 | 0.0001% | 0% | 0% | yes |
| pricing | 0 | 0 | 0.0005% | 0% | 0% | yes |
| download | 0 | 0 | 0.0005% | 0% | 0% | yes |
| products/web | 0 | 0 | 0.0005% | 0% | 0% | yes |
| products/mobile | 0 | 0 | 0.0007% | 0% | 0% | yes |
| products/desktop | 0 | 0 | 0.0007% | 0% | 0% | yes |
| products/voice | 0 | 0 | 0.0007% | 0% | 0% | yes |

Reports: `C:/temp/parity/reports-electron-verify/*-summary.json`.

## Packaged Windows app (`dist/win-unpacked/Rhapsody Bible.exe`)

Method: launch with `--remote-debugging-port=9222 --user-data-dir=C:/temp/electron-verify-profile2`, CDP via `scripts/run-packaged-verify.mjs` and manual checks. Screenshots: `docs/electron/shots/` (login, bible-online, verify-packaged-* when captured).

| Check | Result | Evidence |
|-------|--------|----------|
| Splash shows & skips | **PASS** | `SplashScreen` skip control + `SPLASH_AUTO_MS` 2000 in `App.tsx`; skip dismisses overlay (CDP click when visible) |
| Fonts load (no 404) | **PASS** | `font404Count` 0 in packaged run |
| Images load | **PASS** | `image404Count` 0 |
| `/bible-online` | **PASS** | `app://…#/bible-online`, reader title e.g. Genesis 3 |
| Chapter navigation | **PASS** | Reader title advances (e.g. Genesis 2 → Genesis 3) via next-chapter control |
| Translation switch | **UNVERIFIED** | UI shows fixed **KJV** label only in bundled SKU; no second translation exposed without store flow |
| Strong's online | **PASS** | Main IPC fetches `https://rhapsodybible.web.app/HebrewGreekRes/<path>`; cache files under `%userData%/HebrewGreekRes/json/` (e.g. `greekDictionary.json`, `audioPronunciation.json`) after clicking Strong's `h8064` |
| Strong's offline | **PASS** | `Network.emulateNetworkConditions` offline: no crash; popup shows loading/placeholder text |
| External link (`openExternal`) | **PASS** (IPC) | `window.electronAPI.openExternal('https://example.com')` resolves true; **UNVERIFIED** that default browser window opened (not observable in headless CDP) |
| Min window 1024×720 | **PASS** (config) | `electron/main.ts` `minWidth: 1024`, `minHeight: 720`; **UNVERIFIED** live resize (Electron CDP lacks `Browser.getWindowForTarget` on this build) |
| Console clean | **PASS** (after fix) | Removed desktop fetch of missing `/Bible_English_AMP.xml`; remaining benign audio lookup warnings only |

Security (unchanged from Stage 2): `contextIsolation`, `sandbox`, `nodeIntegration: false`, CSP header on `app://` responses, external navigation blocked in-window.

## Fixes applied this verification pass

| Commit | Change |
|--------|--------|
| `067fb7a` | Skip `/Bible_English_AMP.xml` fetch when `isElectron()` (BibleJson bundle; file pruned from desktop build) |

Prior packaging: `345ca16`, `cc5a225`.

## Owner follow-ups (not code)

1. **KingsChat** — register `rhapsody-bible://auth/callback` (and loopback fallback if used).
2. **Signing** — Windows (`WIN_CSC_LINK` / password) and Apple Developer ID + notarization for release builds.
3. **Updates** — set `ELECTRON_UPDATE_URL` / GitHub release when publishing; bundle `electron-updater` in asar when enabling updates.
4. **macOS** — run `npm run electron:build:mac` or CI `build-macos` (UNVERIFIED on this machine).

## Helper scripts

- `scripts/run-packaged-verify.mjs` — CDP checklist (requires app on port 9222).
- `C:/temp/parity/compare.mjs` — website parity (outside repo).
