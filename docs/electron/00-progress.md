# Electron wrap — progress log

**Branch:** `electron-wrap`  
**Last updated:** 2026-11-03

## Stage checklist

| Stage | Status | Notes |
|-------|--------|-------|
| 0 Preconditions | Done | `ba50c61` |
| 1 Audit | Done | `8a538ff` |
| 2 Implement | Done | 11 commits below |
| 3 Verification | Partial | `docs/electron/03-verification.md` |

## Gate 3 — recorded reply

- **APPROVE:** all CHANGE + ASK resolved via answers · **REJECT:** none  
- **Packages:** `electron@45.2.1`, `electron-builder@26.18.0`, `electron-updater@6.8.11`  
- **productName:** Rhapsody Bible · **appId:** `com.appsloveworld.scribbbler`  
- **OAuth:** `rhapsody-bible://auth/callback` (fallback loopback port **47823**)  
- **Offline:** BibleJson bundled; HebrewGreekRes → Hosting + `userData` cache  
- **Updates:** GitHub provider; checks off until `ELECTRON_UPDATE_URL`

## Stage 2 commits

| # | Item | Commit |
|---|------|--------|
| 1 | Upgrade + compile | `f32b99f` |
| 2 | Security | `c0e302c` |
| 3 | runtime.ts | `7fbdd56` |
| 4 | Service worker | `0c6fbca` |
| 5 | app:// routing | `31b2f38` |
| 6 | Desktop auth | `f7d207c` |
| 7 | Desktop UX | `50cde44` |
| 8 | Strong's cache | `2fed712` |
| 9 | Packaging | `c66f01f` |
| 10 | CI | `9f70484` |
| 11 | Docs | `7ed20ea` (+ verification doc pending commit) |

## Installer size (measured)

- **`dist/win-unpacked/`:** ~**357 MB** (unsigned, HebrewGreekRes not in bundle)  
- **NSIS installer `.exe`:** build was still running when recorded; re-run `npm run electron:build:win` to produce `dist/*.exe`

## Redirect URI to register (KingsChat)

1. `rhapsody-bible://auth/callback`  
2. Fallback: `http://127.0.0.1:47823/auth/callback`

Desktop builds set `REACT_APP_KINGSCHAT_REDIRECT_URL=rhapsody-bible://auth/callback` via `build-electron`.

## macOS (UNVERIFIED locally)

```bash
npm run electron:build:mac
```

Or push to `electron-wrap` and run GitHub Actions job **build-macos**.

## Your action items

1. KingsChat dashboard — register redirect URI above  
2. Worker CORS — add desktop/null origin if exchange fails (token logic unchanged)  
3. Windows signing — `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD`  
4. Apple — Developer ID + notarization secrets in CI  
5. `ELECTRON_UPDATE_URL` / GitHub release when ready  

## Next step

Complete Stage 3 manual checks (OAuth, signed-in UI, `compare.mjs`, NSIS artifact size).
