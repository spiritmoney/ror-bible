# Stage 3 — Verification

Branch: `electron-wrap` · Date: 2026-11-03

## Summary

| Area | Result | Evidence |
|------|--------|----------|
| Dev `electron:start` compile | **PASS** | `npm run electron:compile` OK; `npx electron .` with `:3400` HTTP 200, process stayed up |
| Packaged Windows dir | **PARTIAL** | `npm run electron:build:win` produced `dist/win-unpacked/` (~357 MB); NSIS `.exe` still running at audit time |
| Packaged launch | **PARTIAL** | `dist/win-unpacked/electron.exe` started (killed after 8s); full UI not manually exercised |
| macOS | **UNVERIFIED** | No Mac host; use CI `build-macos` or `npm run electron:build:mac` on macOS |
| KingsChat OAuth | **UNVERIFIED** | Requires dashboard redirect + live sign-in |
| Signed-in screenshots | **UNVERIFIED** | No session during run |
| Website parity (`compare.mjs`) | **UNVERIFIED** | Not run this stage |
| Security runtime audit | **UNVERIFIED** | Manual DevTools check pending |
| Proxy/Espees network | **UNVERIFIED** | Logged-out store smoke not run |

## Dev checks (PASS)

- Electron **45.2.1**, main entry `dist-electron/main.js`.
- Dev URL `http://localhost:3400` loads in Electron window.
- Service worker registration skipped when `window.electronAPI.isElectron` or `REACT_APP_IS_ELECTRON`.

## Packaged Windows (PARTIAL)

- Command: `npm run electron:build:win`
- **Unpacked size:** ~**357 MB** (`dist/win-unpacked/`, HebrewGreekRes pruned from `build/`)
- **Installer `.exe`:** pending completion of electron-builder NSIS step (long `node_modules` scan observed)
- **Cold start:** not measured (stopwatch pending stable installer)

## macOS (UNVERIFIED)

```bash
npm run electron:build:mac
# or CI: .github/workflows/electron-build.yml job build-macos
```

## Manual follow-ups for you

1. Register **`rhapsody-bible://auth/callback`** (or loopback fallback) in KingsChat; match `REACT_APP_KINGSCHAT_REDIRECT_URL`.
2. Add Worker CORS origin if browser exchange fails from desktop (see audit E-023).
3. Set signing secrets and re-run CI; enable `release` job when `GH_TOKEN` + publish URL ready.
4. Set `ELECTRON_UPDATE_URL` before enabling update checks in main.
5. Run `compare.mjs` on 8 website pages (web build, not Electron).

## Redirect URI (register)

- `rhapsody-bible://auth/callback`
- Fallback: `http://127.0.0.1:47823/auth/callback`
