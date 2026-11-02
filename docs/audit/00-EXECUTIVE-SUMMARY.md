# Executive Summary — Rhapsody Bible 2.0 (`rorbible`)

## Project summary & health

**Rhapsody Bible / Scribbbler** is a React 18 + Firebase SPA (PWA and optional Electron) for Bible reading, collaboration, digital store commerce, KingsChat login, and Espees payments, with large static Bible assets and a generic Firestore data layer. Feature maturity resembles a **production product**, but security posture, testing, and repository hygiene are **far below** that bar.

**Overall health: 3 / 10** — Functional breadth and clear module boundaries earn partial credit; **open Firestore rules**, a **broken route guard**, **hardcoded payment/JWT secrets**, **unauthenticated payment Cloud Functions**, **minimal tests**, **no CI**, **missing git metadata**, and a **committed ~355MB build** drive the score down.

## Top 10 risks (severity → effort)

| Rank | Risk | Sev | Effort |
|------|------|-----|--------|
| 1 | Firestore `allow read, write: if true` | Critical | L |
| 2 | `Protected` renders protected UI when logged out | Critical | S |
| 3 | Hardcoded Espees API key in `src/server.js` (+ shell `REACT_APP_*` secrets) | Critical | S |
| 4 | Hardcoded JWT signing secret in client `useEncrypt.ts` | Critical | S |
| 5 | Espees HTTP functions: CORS `*`, no caller auth | High | M |
| 6 | Password auth via Firestore + client bcrypt | High | L |
| 7 | Admin roles enforced only in React | High | L |
| 8 | Dependency/CVE status unverified; axios 0.27 / Node 16 functions | Medium | M |
| 9 | No automated tests on auth/payments/Firestore | Medium | M |
| 10 | Committed production build + no CI → unknown reproducibility | Medium | M |

## Top 5 quick wins

1. Fix `Protected` to `Navigate` away when `isLoggedIn === 'false'`.
2. Replace `firestore.rules` with auth-scoped rules (start with deny-all, then open per collection).
3. Remove secrets from `local.sh`, `build.sh`, `server.js`, `useEncrypt.ts`; rotate all exposed keys.
4. Add `.env.example` (variable **names** only) and document `local.sh` flow in a root README.
5. Add Jest tests for `Protected` + `cdnUrl`-style rules unit tests for Firestore (when rules exist).

## Top 5 structural improvements

1. Adopt **Firebase Auth** (or hardened custom auth) and migrate off plaintext-equivalent Firestore password docs.
2. Lock down Espees functions (Firebase App Check, auth, IP allowlist, or callable functions with ID token).
3. Split dev server from frontend package; stop shipping Express in browser dependency tree.
4. Restore git, add CI (`yarn install`, `tsc`, `test`, `audit`, `build`), `.gitignore` for `build/`.
5. Break up `container/main.tsx` and mega-screens; consolidate Header/router variants.

## Before changing anything (gotchas)

- Dev requires **two ports**: CRA **3400**, Express **3000** — do not set global `PORT` in `local.sh` (documented in `local.sh`).
- `setupProxy.js` must use http-proxy-middleware **v3** `pathFilter` pattern or dev server silently fails to bind.
- **Electron** uses `HashRouter`; web uses `BrowserRouter` (`main.tsx`).
- `isLoggedIn` is a **string** `'true'|'false'`, not boolean.
- Production Espees paths are Firebase Hosting **rewrites**, not CRA proxy.
- KingsChat login depends on external **Cloudflare Worker** URL in `kingschat.ts` defaults.
- Open Firestore means **any local change can affect production data** if pointed at prod config — verify project ID first (`kjv-strongs-reader`).

## Recommended work order

1. **Stop the bleeding:** rotate secrets; fix `Protected`; deploy restrictive Firestore rules to a staging project first.
2. **Verify environment:** clone with git; `yarn install`; confirm which Firebase project is targeted.
3. **Harden payments:** auth on Espees functions; remove keys from client/repo.
4. **Auth redesign plan:** Firebase Auth or server-mediated login; custom claims for admin roles.
5. **Tooling:** CI, drop committed `build/`, run `yarn audit` / upgrade axios & functions runtime.
6. **Tests:** Protected, rules, payment handler smoke tests.
7. **Refactor:** routing modularization and dead code removal (`_OLD`, `main2`).

## Open Questions (project owner)

1. Is this workspace intentionally **without `.git`**, and what is the canonical remote?
2. Do **deployed** Firestore rules match committed `firestore.rules`, or are production rules different?
3. Is Firebase project **`kjv-strongs-reader`** still the intended backend for Rhapsody Bible 2.0?
4. Should Espees integration remain on **public HTTP functions**, or move to authenticated callables?
5. Are **passwords in Firestore** still required, or is KingsChat-only auth the target state?
6. Should the **committed `build/`** directory remain, or is hosting built only in CI?
7. What is the status of **`container/main2.tsx`** — dead or alternate entry?
8. Have keys appearing in `local.sh`, `build.sh`, `server.js`, and worker README been **rotated** since last leak?

## Coverage statement

| Deep | Sampled | Skipped |
|------|---------|---------|
| Routing (`main.tsx`), Firebase config/service, Firestore rules, Protected guard, KingsChat config, Functions Espees/proxy (partial file), dev server/proxy, package manifests, shell build scripts | Individual screens (Store/Dashboard), most hooks, service worker, Admin Users, worker handler body | `node_modules`, minified `build/static`, bulk Bible XML/JSON assets, `yarn.lock` contents, `backup/kingschat-old` tree, full grep of 2000+ brand strings, npm audit (no install), git history |

## Report index

- `docs/audit/00-progress.md`
- `docs/audit/01-overview.md`
- `docs/audit/02-architecture.md`
- `docs/audit/03-quality.md`
- `docs/audit/04-dependencies-build.md`
- `docs/audit/05-testing.md`
- `docs/audit/06-security.md`
- `docs/audit/07-docs-onboarding.md`
- `docs/audit/00-EXECUTIVE-SUMMARY.md` (this file)
