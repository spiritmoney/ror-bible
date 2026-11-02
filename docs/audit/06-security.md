# Phase 6 — Security & Reliability

## Authentication & authorization

| Finding | Severity | Effort | Label |
|---------|----------|--------|-------|
| Firestore rules allow world read/write | Critical | L | [CONFIRMED] `firestore.rules:3-4` |
| `Protected` bypass when `isLoggedIn === 'false'` | Critical | S | [CONFIRMED] `src/components/Protected/index.tsx:43-44` |
| Roles from Firestore user doc (`usePermission`) — no server enforcement | High | L | [CONFIRMED] `usePermission.ts:4-12` + open rules |
| Passwords stored/compared with `bcryptjs` in browser against Firestore `users` | High | M | [CONFIRMED] `useGeneral.ts`, `Login/index.tsx` grep |
| Hardcoded JWT secret in client bundle | Critical | S | [CONFIRMED] `useEncrypt.ts:4-7` |
| Session = Recoil + localStorage (`userAtom` persist) | Medium | M | [CONFIRMED] `store/atoms/user.ts` |

## Secrets & configuration leakage

| Location | Issue | Label |
|----------|-------|-------|
| `local.sh`, `build.sh` | Export `REACT_APP_EMAIL_API_KEY`, KingsChat IDs/tokens in shell | [CONFIRMED] — values **not repeated** in this report |
| `src/server.js` | Hardcoded Espees `x-api-key` constant | [CONFIRMED] lines 10-11 |
| `src/config/firebase.ts` | Firebase web config inline (expected public, still project-scoped) | [CONFIRMED] |
| `workers/kingschat-callback/README.md` | Documents a **literal API key** for Wrangler setup | [CONFIRMED] line ~30 region — **rotate** if ever deployed |
| `backup/kingschat-old/.env` | Legacy env file in tree | [CONFIRMED] glob — do not commit |

**Git history scan for secrets:** **Not possible** (no `.git`) [CONFIRMED].

## API & network exposure

| Endpoint | Control | Issue |
|----------|---------|-------|
| `espeesCreateProduct` / `espeesConfirmPayment` | CORS `*`, **no caller authentication** | Anyone who can hit URL can proxy Espees with server key [CONFIRMED] `functions/index.js:9-13`, `121+` |
| Dev `src/server.js` `/create-product` | Same pattern locally | [CONFIRMED] |
| `audioProxy` / `downloadProxy` | Host whitelist on `rorbible.plus` CDN | [CONFIRMED] `functions/index.js:39-62` — open CORS |
| Express `/proxy` | Host allowlist | [CONFIRMED] `server.js:13-35` |
| Store PHP API | Third-party HTTPS | [CONFIRMED] |

## Input validation & injection

| Area | Assessment |
|------|------------|
| Espees payloads | Server-side field validation on create [CONFIRMED] `validateCreatePayload` |
| Firestore queries | Built from hook params; risk if user-controlled `where` values reach hooks | [INFERRED] medium — needs per-call review |
| Quill/HTML content | Rich text — XSS risk if rendered unsafely | [UNKNOWN] not traced in this phase |
| `dangerouslySetInnerHTML` | Not counted in this phase | [UNKNOWN] |

## CORS & rate limiting

- Wide `Access-Control-Allow-Origin: *` on Functions and dev server [CONFIRMED]
- **No rate limiting** middleware found in Express or Functions sample [CONFIRMED]

## Privacy & error leakage

- Errors sometimes return upstream Espees JSON to client [CONFIRMED] `server.js` catch paths
- User passwords hashed but **readable by anyone** with DB access due to rules [INFERRED]

## Performance & reliability

| Risk | Severity | Evidence |
|------|----------|----------|
| 7s mandatory splash | Medium | `App.tsx:19-21` |
| Huge static payloads (public/build) | Medium | ~193–355MB dirs |
| Disabled webpack splitChunks | Medium | `craco.config.js` commented block |
| Firestore unbounded listeners | Medium | [INFERRED] multiple `onSnapshot` usages |
| Payment confirm without idempotency | High | [INFERRED] `espeesConfirmPayment` passes through |
| Node 16 functions runtime | Medium | EOL |

## Phase 6 summary (5 lines)

1. **Critical:** open Firestore + broken `Protected` + client JWT secret + committed API keys.
2. **Espees Cloud Functions** act as open payment proxies if deployed as written.
3. Auth model is **custom** (not Firebase Auth) with passwords in Firestore.
4. CORS is permissive; **no rate limits** on sensitive proxies.
5. Reliability hurt by silent catches and large static assets.
