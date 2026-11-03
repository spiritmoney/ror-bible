# Electron open Bible — progress log

**Branch:** `electron-open-bible` (from `electron-wrap`)  
**Last updated:** 2026-11-03

## Step 1 — Root cause (login-first)

| Source | File:line | Behavior |
|--------|-----------|----------|
| Packaged load URL | `electron/main.ts` | Loads `app://…/index.html` with **no hash** → HashRouter pathname `/` |
| Desktop bootstrap | `src/container/main.tsx` `ElectronBootstrapRedirect` | On `/` and marketing paths, **formerly** `Navigate` to `LoginRoute` when logged out or `DashboardRoute` when logged in |
| Splash | `src/App.tsx` | Does not choose auth route |
| Protected routes | `src/components/Protected` | Unchanged — `/dash` etc. still redirect logged-out users to `/login` |

## Step 3 — Reader actions vs account

| Location | Action | Logged-out OK? | Behavior |
|----------|--------|----------------|----------|
| `subNav.tsx` Read | `/read`, `setNav('read')` | yes | unchanged |
| `subNav.tsx` Home | `setNav('store')` | no | `useRequireLogin` → `/login` with return path |
| `BibleDisplay.tsx` bookmark/highlight | verse utilities | no | existing `useRequireAuth` / `useRequireLogin` |
| `subNav.tsx` Bookmark/Note tabs | UI only (no handler) | n/a | unchanged |
| `Workspace/index.tsx` | `PROTECTED_NAVS` | no | `Navigate` `/login` + `saveAuthReturnPath` (reader path preserved) |
| `Header/index.tsx` | Profile vs Sign in (Electron) | Sign in → login with return | Electron only |
| Chapter nav, copy, Strong's | reader | yes | unchanged |

## Verification (Step 5)

| Check | Result |
|-------|--------|
| Jest `useRequireLogin` | PASS |
| `tsc --noEmit` | PASS |
| Web `compare.mjs` 8 pages | not re-run this session — prior gate 0/0/&lt;0.5% on `electron-wrap` |
| Packaged fresh userData → `#/bible-online` | manual |
| Post-login return to reader | **UNVERIFIED** (owner sign-in) |

Manual post-login: open packaged app logged out → `#/bible-online` → **Sign in** or **Home** → KingsChat → welcome → should land on stored path (default `#/bible-online`).

## Commits (this branch)

Recorded after commits land — see `git log electron-open-bible --oneline`.
