# Electron / PWA app routing — progress

**Branch:** `app-routing` (from `pwa-icons`)  
**Last updated:** 2026-11-03

## Routing

| Surface | Entry behavior |
|---------|----------------|
| Normal browser | `/` and `/home` show marketing website (unchanged) |
| Installed PWA | `manifest.json` `start_url` → `/bible-online?source=pwa`; `AppShellEntryRedirect` guards marketing URLs |
| Electron | HashRouter `#/` → `/bible-online`; marketing paths redirect; `ElectronRoutePersistence` for reader routes |

Helper: `src/utils/appShell.ts` (`isAppShell()`).

## Commits (this branch)

| Message | Scope |
|---------|--------|
| `feat(pwa): open installed app on Bible reader` | manifest, `isAppShell`, `AppShellEntryRedirect`, tests |
| `feat(electron): block website routes in app shell` | website header/footer/mobile menu |
| `ci: unsigned mac and windows artifacts` | workflow, `DOWNLOADS.md` |

## Downloads

See **`docs/electron/DOWNLOADS.md`**.

## UNVERIFIED

- macOS `.dmg` from CI until workflow runs on pushed branch
- CDP standalone emulation smoke (manual)
