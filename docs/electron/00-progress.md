# Electron wrap — progress log

**Branch:** `electron-wrap` (created from `fix-protected` @ `c5041a2`)  
**Last updated:** 2026-11-03

## Stage checklist

| Stage | Status | Notes |
|-------|--------|-------|
| 0 Preconditions | **Done** | See below |
| 1 Audit → `01-audit.md` | **Done** | Gate 3 pending your reply |
| 2 Implement | Blocked | After Gate 3 approval |
| 3 Verification → `03-verification.md` | Blocked | |

## Stage 0 — Preconditions (2026-11-03)

### Git [CONFIRMED]

- Branch: `electron-wrap` from `fix-protected`.
- **Not clean:** modified `.gitignore`, `docs/ui/00-progress.md` (pre-existing on branch before electron work).
- Base commit: `c5041a2` — fix(auth): type-safe mock in Protected test.

### React dev compile [CONFIRMED]

- `npm run react` (PORT 3400): port already bound; `http://localhost:3400/` → HTTP 200.
- Fresh compile on PORT 3401 via `npx cross-env PORT=3401 craco start`: **Compiled with warnings** (eslint in `pricingMain.tsx`); **No issues found** (TS); **no webpack error overlay**.
- `npm run build` on this Windows shell **failed** (`PUBLIC_URL=/ sh build.sh` — Windows env syntax). Electron packaging normally uses `build-electron` / `build.sh` from Git Bash; not re-run in Stage 0.

### Environment [CONFIRMED]

| Item | Value |
|------|--------|
| OS | Windows 10 (10.0.26200), Git Bash MINGW64 |
| Node | v24.14.0 |
| npm | 11.9.0 |
| `npx electron-builder --version` | 23.6.0 (project devDependency `^23.3.3`) |
| macOS packaging | **Cannot run locally** on this machine |

### Things only you can provide (later)

1. **Windows code signing** — EV/OV certificate + `CSC_LINK` / `CSC_KEY_PASSWORD` (or store cert in CI secrets).
2. **Apple Developer** account — Developer ID Application cert, notarization Apple ID + app-specific password (`APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`).
3. **KingsChat OAuth** — Register desktop redirect URI(s) we choose (custom protocol and/or loopback); confirm KingsChat allows non-HTTPS redirect if using custom scheme.
4. **Cloudflare Worker CORS** — Add Electron/desktop origins if browser exchange from `file://` or custom protocol is blocked (`workers/kingschat-callback/src/index.js` allowedOrigins list).
5. **Auto-update host** — Generic update URL or GitHub Releases + `GH_TOKEN`; bucket/CDN for `latest.yml` / blockmaps.
6. **Espees / payment secrets** — Production keys belong in env/CI only (not in repo); confirm whether desktop store payments must hit Firebase Functions vs current Vercel proxy.

## Gate 3 — your reply

*(Record approval here after you respond.)*

```
Reply template:
APPROVE: E-001, ... | REJECT: ... | DO-NOT-TOUCH additions: ... | answers | package approval yes/no
```

**Your reply:** _(pending)_

## Decisions log

_(Empty until Gate 3.)_

## Next step

Wait for Gate 3 approval, then Stage 2 item 1 (Electron upgrade + compiled main process).
