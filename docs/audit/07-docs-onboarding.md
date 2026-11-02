# Phase 7 — Documentation & Onboarding

## README & docs inventory

| Document | Location | Accuracy vs code |
|----------|----------|------------------|
| Root README | **Missing** | [CONFIRMED] glob only `backup/README.md`, worker README |
| `backup/README.md` | KingsChat rollback instructions | References git commits — **misleading** without `.git` [CONFIRMED] |
| `workers/kingschat-callback/README.md` | Worker OAuth flow + Wrangler setup | Flow mostly matches `kingschat.ts` defaults; **contains secret example** — unsafe [CONFIRMED] |
| `audit/AUDIT_REPORT.md` | Prior third-party-style audit | Useful cross-check; not a substitute for onboarding |
| Inline comments | `local.sh`, `setupProxy.js` | **High quality** on port/proxy pitfalls [CONFIRMED] |

## Verified getting started (from manifests + scripts)

| Step | Instruction | Verified? |
|------|-------------|-----------|
| 1 | Install deps: `yarn` (lockfile present) | [INFERRED] standard; not executed |
| 2 | Run dev: `sh local.sh` or `npm run dev:payments` | [CONFIRMED] sets `REACT_APP_*` then starts concurrent server + CRA |
| 3 | UI URL | `http://localhost:3400` [CONFIRMED] `package.json:104` |
| 4 | API proxy | Express `npm run server` → default port 3000 [CONFIRMED] `local.sh` comment |
| 5 | Production build | `npm run build` (runs `build.sh` + `craco build`) | [CONFIRMED] |
| 6 | Firebase deploy | CLI + `firebase.json` hosting from `build/` | [CONFIRMED] |
| 7 | Functions | `cd functions && npm install && npm run deploy` | [CONFIRMED] `functions/package.json` |
| 8 | Electron | `yarn electron:start` expects UI on 3400 | [CONFIRMED] `public/electron.ts:17-18` |

**Blockers for new developers:** no root README; secrets expected in shell scripts not `.env.example`; committed `build/` may confuse “source vs artifact”; no git remote in this copy.

## Domain glossary

| Term | Meaning |
|------|---------|
| **Rhapsody Bible / ROR Bible** | Product brand; store API host `api.rorbible.plus` |
| **Scribbbler** | Internal/editor app name (Electron product, registration copy) |
| **KingsChat (KC)** | OAuth identity provider for login |
| **Espees** | Payment processor (`api.espees.org`) |
| **Workspace** | Collaborative Bible annotation editor UI |
| **Dashboard / `/dash`** | User project hub (protected) |
| **Strong's / Hebrew-Greek** | Concordance assets under `public/HebrewGreekRes` |
| **Recoil atoms** | Client state; `user`, `isLoggedIn`, settings |
| **ICollections** | Firestore collection names (`projects`, `annotations`, …) |

## Phase 7 summary (5 lines)

1. **No root README** — onboarding relies on tribal knowledge and shell scripts.
2. **`local.sh` / `setupProxy.js` comments** are the best operational docs in the repo.
3. Worker README explains OAuth but **embeds secrets** — docs are unsafe as written.
4. Getting-started commands are **derivable** from `package.json` and verified against config.
5. Add `.env.example` (names only) + README linking Firebase project `kjv-strongs-reader`.
