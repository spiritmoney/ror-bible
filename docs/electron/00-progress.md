# Electron wrap — progress log

**Branch:** `electron-wrap`  
**Last updated:** 2026-11-03

## Stage checklist

| Stage | Status | Notes |
|-------|--------|-------|
| 0 Preconditions | Done | `ba50c61` |
| 1 Audit | Done | `8a538ff` |
| 2 Implement | In progress | See commits below |
| 3 Verification | Blocked | |

## Gate 3 — recorded reply (2026-11-03)

- **APPROVE:** all CHANGE rows + ASK resolved via answers below  
- **REJECT:** none  
- **DO-NOT-TOUCH:** website redesign, Protected, Firestore rules, payments logic, Cloud Functions, Worker token exchange logic, Bible content, secrets/.env, UI redesign  
- **Packages:** yes — `electron@45.2.1`, `electron-builder@26.18.0`, `electron-updater@6.8.11`

### Decisions

| Topic | Decision |
|-------|----------|
| productName | **Rhapsody Bible** |
| appId | `com.appsloveworld.scribbbler` (unchanged) |
| OAuth redirect | **Primary:** `rhapsody-bible://auth/callback` · **Fallback:** `http://127.0.0.1:<port>/auth/callback` |
| Offline | Bundle **BibleJson**; **HebrewGreekRes** from Hosting → cache `userData` |
| Shell | App-only nav; routes `/login`, `/dash`, `/bible-online`, `/read`; marketing code stays, hidden from desktop nav |
| Updates | GitHub Releases; checks **off** until publish URL set |
| Espees | Deferred; still ship **runtime.ts** base URLs |

## Stage 2 commits

| # | Item | Commit | Verified |
|---|------|--------|----------|
| 1 | Electron upgrade + compile | _(this commit)_ | Dev launch: `electron` + `:3400` HTTP 200, no immediate crash |
| 2 | Security | | |
| 3 | runtime.ts | | |
| 4 | Service worker | | |
| 5 | Routing/assets | | |
| 6 | Desktop auth | | |
| 7 | Desktop UX | | |
| 8 | Strong's cache | | |
| 9 | Packaging | | |
| 10 | CI | | |
| 11 | Docs | | |

## Redirect URI to register (KingsChat dashboard)

1. **`rhapsody-bible://auth/callback`** (preferred)  
2. If HTTP only: **`http://127.0.0.1:47823/auth/callback`** (port fixed in implementation)

Set `REACT_APP_KINGSCHAT_REDIRECT_URL` to the registered value for desktop builds.

## Next step

Stage 2 item 2 — security hardening (preload, sandbox, navigation, CSP).
