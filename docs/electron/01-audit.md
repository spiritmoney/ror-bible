# Stage 1 — Electron audit (read-only)

Branch: `electron-wrap` · Audit date: 2026-11-03  
Labels: **[CONFIRMED]** from file read · **[INFERRED]** from structure · **[UNKNOWN]** not executed

---

## A. `public/electron.ts` [CONFIRMED]

| Topic | Detail | Lines |
|-------|--------|-------|
| BrowserWindow | Full primary display work area; `show: false` until `ready-to-show`; `backgroundColor: 'white'` | 6–11 |
| Icon | Relative `icon/scribbblerIcon.icns` (macOS path; likely wrong on Windows) | 9 |
| webPreferences | `nodeIntegration: false`; `devTools: isDev` only | 12–15 |
| Missing (security defaults not set explicitly) | No `contextIsolation`, `sandbox`, `preload`, `webSecurity`, CSP injection | 12–15 |
| Dev load | `http://localhost:3400` when `electron-is-dev` | 17–18 |
| Prod load | `file://${path.join(__dirname, '../build/index.html')}` | 19 |
| Menu | None | — |
| Protocol | None registered | — |
| Navigation | Deprecated `webContents.on('new-window')` — prevents default then `loadURL(url)` **in same window** (external URLs trapped in-app) | 30–33 |
| CSP | None in main process | — |
| IPC | None | — |
| Single-instance | No `requestSingleInstanceLock` | — |
| Main as TypeScript | `"main": "public/electron.ts"` — Electron loads `.ts` without compile step in repo **[INFERRED broken in prod]** | `package.json` L5 |

---

## B. `package.json` — Electron / builder [CONFIRMED]

| Field | Value |
|-------|--------|
| `main` | `public/electron.ts` (L5) |
| `homepage` | `"./"` (L6) — relative asset base for CRA |
| `electron` | `^21.2.0` devDependency (L159) — **EOL** |
| `electron-builder` | `^23.3.3` (L160) |
| `electron-updater` | **Not present** |
| `build.appId` | `com.appsloveworld.scribbbler` (L134) |
| `build.productName` | `Scribbbler` (L135) |
| `build.files` | `build/**/*`, `public/electron.ts`, `package.json` (L136–139) — **no `public/` static assets except via CRA `build/`** |
| `build.icon` | `public/icon/icon_512x512.png` (L141) |
| `build.mac` | `{ type: distribution }` only (L143–145) — no dmg/zip targets, entitlements, hardenedRuntime |
| Win/Linux publish | **Not configured** |
| Scripts | `electron:start`: `concurrently "yarn local" "wait-on http://localhost:3001 && electron ."` (L112) |
| | `electron:build:all`: `yarn build-electron && electron-builder build --publish never -mwl` (L113) |
| React packaging | `build-electron` → `build.sh` → `craco build` with env from shell (L109, `build.sh`) |

**Script mismatch [CONFIRMED]:** `wait-on http://localhost:3001` (L112) vs Express `PORT` default **3000** (`src/server.js` L112–115).

---

## C. Packaged asset loading [CONFIRMED / INFERRED]

| Topic | Assessment |
|-------|------------|
| Protocol | Production uses **`file://`** to `build/index.html` (`electron.ts` L19) |
| Router | `isElectron()` → `HashRouter` (`src/container/main.tsx` L289–293); web uses `BrowserRouter` (L295–298) |
| `homepage` | `"./"` helps CRA **built** relative URLs for JS/CSS |
| Absolute `fetch`/paths | **Break under `file://`**: root-relative URLs resolve to filesystem root, not app bundle |
| Strong's / concordance | `/HebrewGreekRes/json/...` (`StrongsDictionary.tsx` L110–135, L249–251) |
| Legacy XML fetch | `/Bible_English_AMP.xml` (`multi_layout_component/index.tsx` L269; OLD reader L69) |
| Store CDN proxy | `/proxy?url=...` (`dynamicProduct_Details/index.tsx` L148) |
| Bundled JSON | `BibleJson/*.json` imported in webpack (`multi_layout_component/index.tsx` L53–54) — **works** in bundle |
| `PUBLIC_URL` | Used for SW and one video (`serviceWorkerRegistration.ts` L29–38; `homeMain.tsx` L71); `build.sh` does not set `PUBLIC_URL` for electron build **[INFERRED]** defaults to relative for CRA |

**Recommendation:** Use `app://` custom protocol or `loadFile` + runtime base URL helper; fix all root-relative network paths (see table below).

---

## D. Network layer — relative / Hosting-dependent calls

Firebase Hosting rewrites (`firebase.json` L24–36): `/espees/create-product`, `/espees/confirm-payment` → Cloud Functions. **Not available in packaged app.**

| ID | Call | File:line | Dev path | Packaged target (proposed) |
|----|------|-----------|----------|----------------------------|
| E-015 | `/proxy?url=` | `dynamicProduct_Details/index.tsx:148` | `setupProxy.js` → `localhost:3000` | Absolute Hosting or Cloud Function proxy URL via `runtime.ts` |
| E-016 | `/espees/*` (hosting) | `firebase.json:26–31` | `setupProxy.js:24–27` → Express | Firebase Functions HTTPS URLs (same as production hosting rewrite targets) |
| E-017 | Express `/create-product`, `/confirm-payment` | `server.js:62–90` | Local only | Not bundled; map app calls to Functions URLs |
| E-018 | Give page payments | `give.tsx:24` | Hardcoded `https://espees-proxy.vercel.app/create-product` | **Already absolute**; website-only path |
| E-019 | KingsChat worker | `AuthCallback.jsx:11–53`, `useKingsChat.ts:182`, `kingschat.ts:18–20` | Absolute Worker URL | Keep; may need Worker CORS update for desktop origins |
| E-020 | Email API | `useSendGrid.ts:24` | `getEnv('EMAIL_API_URL')` | Already env-based |
| E-021 | Store/catalog | Multiple store screens | `https://api.rorbible.plus/...` | OK in Electron |
| E-022 | Dev proxy wiring | `setupProxy.js:21–37` | CRA dev only | No change on web |

**Config today:** `getEnv()` reads `process.env[VAR]` or `REACT_APP_${VAR}` (`utils/general.ts` L31–36). **No unified API base module.**

**Note:** Grep found **no** frontend `fetch('/espees/...')` in `src/`; Espees in-app may be unused or routed only via hosting for future/store flows. Proxy is the critical app dependency for premium downloads.

---

## E. Service worker [CONFIRMED]

| Item | Location |
|------|----------|
| Registration | `src/index.tsx` L25 — always calls `register()` |
| Logic | `serviceWorkerRegistration.ts` L27+ — production + same-origin check via `PUBLIC_URL` |
| SW implementation | `src/service-worker.ts` — Workbox precache, Google Fonts cache, navigation fallback to `index.html` |
| `file://` | SW registration **fails or is meaningless** (opaque origin / no controller for API traffic) **[INFERRED]** |
| Risk | Stale precache or broken navigation if SW registers from `file://` origin |

**Target:** Skip registration in Electron (preload flag or `REACT_APP_ELECTRON`).

---

## F. Auth — KingsChat [CONFIRMED]

| Step | Behavior | Source |
|------|----------|--------|
| Login start | `window.location.assign` to KingsChat with `clientId`, `origin` (base64url state) | `useKingsChat.ts` L77–81 |
| Registered redirect | Config `KINGSCHAT_REDIRECT_URL` default `https://rhapsodybible.web.app/auth/callback` | `kingschat.ts` L13–16 — **not appended in login URL**; must match KingsChat app settings |
| Callback routes | `/auth/callback` → `AuthCallback` **and** `KingsChatCallbackRoute` (same path) | `main.tsx` L110–113 — **first route wins** (`AuthCallback`) |
| Exchange | `AuthCallback`: `fetch(WORKER_URL)`; `KingsChatCallback` / `exchangeCode`: axios to Worker | `AuthCallback.jsx` L11–57; `useKingsChat.ts` L181–198 |
| CSRF | `origin` query must match `sessionStorage` state | `useKingsChat.ts` L158–167 |
| Firebase Auth | Firestore + Storage only; **no** `getAuth()` | `service/firebase.ts` L1–11 |
| Persistence | Recoil + `localStorage` / session keys | `AuthCallback.jsx`, `Protected` |

**Splash + HashRouter bug [CONFIRMED]:** `App.tsx` L8–10 uses `window.location.pathname` for `/auth/callback`; under `HashRouter` the path is in **`location.hash`**, not pathname — splash may run during OAuth on desktop.

### Desktop OAuth options

| Option | Pros | Cons | Worker / KingsChat |
|--------|------|------|---------------------|
| **Custom protocol** `rhapsody-bible://auth/callback?code=&origin=` | Native return to app; no local server | Must register scheme in KingsChat; OS handler; test on both OSes | Redirect URI must be allowed by KingsChat (often custom schemes OK) |
| **Loopback** `http://127.0.0.1:<port>/auth/callback` | HTTPS redirect pattern KingsChat already uses | Pick fixed port; firewall; must register exact URL | Same as web redirect registration |
| **External browser + poll** | Minimal KingsChat change | Poor UX; insecure | Not recommended |
| **In-app BrowserWindow** | Keeps redirect on `localhost` or hosted page | Still need reachable redirect URL; harder CSRF | Hosted `web.app/callback` could deep-link to custom protocol |

**Safest minimum change [INFERRED]:** External system browser for login + **custom protocol** or **loopback** redirect back to app; reuse existing Worker exchange (no Worker token logic change). Update Worker `allowedOrigins` if renderer origin changes.

**Redirect URIs to register (pick one strategy):**

- Custom: `rhapsody-bible://auth/callback` (or `com.appsloveworld.scribbbler://auth/callback`)
- Loopback: `http://127.0.0.1:8765/auth/callback` (port TBD in implementation)

---

## G. Offline data [CONFIRMED sizes — measured 2026-11-03]

| Asset | Size | Load mechanism |
|-------|------|----------------|
| `public/HebrewGreekRes` | **181M** | HTTP fetch absolute paths |
| `public/bibleXML` | **5.5M** | Not referenced in `src/` grep (legacy/public) |
| `public/` total | **194M** | Copied into `build/` by CRA |
| `src/BibleJson` | **68M** | Webpack imports — in JS bundle / chunks |

| Strategy | Installer impact (order of magnitude) | Tradeoff |
|----------|--------------------------------------|----------|
| Bundle all public + JSON | **~260M+** before compression (194M public + 68M JSON in bundle) | Largest installer; full offline Strong's + reader |
| JSON in bundle + Strong's on first run to `userData` | **~70–100M** initial + download | Needs download UI; smaller first install |
| JSON only bundled; Strong's stream from CDN when online | Smallest installer | Weak offline Strong's |

IndexedDB cache for purchased Bibles: `utils/bibleStorage.ts` — works in Electron Chromium **[INFERRED]**.

---

## H. Desktop UX readiness [INFERRED / partial CONFIRMED]

| Area | Current | Gap |
|------|---------|-----|
| Window size | Full screen default; **no minWidth/minHeight** | `electron.ts` L7–8 |
| Layout breakpoints | App tablet/laptop ~800/1024 (`docs/ui/04-design-system.md` L107) | Set min size ≥ ~1024×720 recommended |
| Title bar | Native frame (default) | OK unless custom approved |
| Splash | 2s auto + skip (`App.tsx` L6–23) | Hash callback detection bug |
| External links | Loaded in-app via `new-window` handler | Should open `shell.openExternal` |
| Menu / zoom / shortcuts | None | Add native menu Stage 2 |
| Protected + HashRouter | `Navigate` to `/login` with state | Should work with hash paths **[INFERRED]** — verify in Stage 3 |
| Website routes in desktop | Full `main.tsx` includes marketing routes | Same bundle as web — parity requirement |

---

## I. Security vs Electron hardening checklist

| Deviation | Severity | Lines |
|-----------|----------|-------|
| Main process is raw `.ts` without hardening pipeline | Med | `package.json` L5 |
| No `contextIsolation: true` explicit | Low (default true modern Electron) | `electron.ts` L12–15 |
| `sandbox: true` not enabled | Med | missing |
| No preload / contextBridge | Med | missing |
| No CSP (main or meta) | Med | missing |
| `new-window` loads arbitrary URL in-app | **High** | `electron.ts` L30–33 |
| No `will-navigate` / `setWindowOpenHandler` allowlist | **High** | missing |
| No single-instance lock | Low | missing |
| `build.sh` contains API keys in repo history | **High** (secrets hygiene) | `build.sh` L9–14 — **do not copy into docs/commits** |
| `server.js` contains API key | **High** | `server.js` L10–11 |

---

## J. Build matrix [CONFIRMED]

| Target | This machine (Windows) | macOS agent needed |
|--------|------------------------|-------------------|
| Windows NSIS/dir | **Yes** (unsigned) | — |
| macOS dmg/zip | **No** | **Yes** for build/sign/notarize |
| Linux `-l` in script | electron-builder can run | Low priority |

**Icons present:**

- `public/icon/icon_512x512.png`, `.icns`, duplicate `Iconxx.icns`
- `public/favicon.ico`, `logo192.png`, `logo512.png`
- **Missing:** dedicated **`icon.ico`** for Windows (builder can convert from 512 PNG)

---

## K. Latest Electron compatibility (target **45.x** npm latest) [INFERRED]

| Area | Risk |
|------|------|
| `require()` in main | Still supported in main process |
| `new-window` event | **Removed** — must use `setWindowOpenHandler` |
| CRACO polyfills | Renderer-only; unaffected by Electron Node bump |
| Node in Electron 45 | Newer than Node 24 on host — main process APIs OK |
| electron-builder 23 → 26 | Config schema updates likely (targets, notarize) |

---

## Findings table (grouped by root cause)

### Root: EOL stack & main process bootstrap

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-001 | Electron version | 21.2.0 EOL | 45.x (pending approval) | `package.json:159` | M | Med | CHANGE |
| E-002 | electron-builder | 23.3.3 | 26.x | `package.json:160` | S | Low | CHANGE |
| E-003 | electron-updater | absent | 6.x, disabled until publish URL | `package.json` | S | Low | CHANGE |
| E-004 | Main entry TS | `public/electron.ts` loaded directly | Compiled `electron/main.js` + typed source | `package.json:5`, `electron.ts` | M | Med | CHANGE |
| E-005 | electron:start | wait-on **3001** | wait-on **3400** (UI) or 3000 (API) | `package.json:112` | S | Med | CHANGE |

### Root: `file://` + absolute URLs

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-006 | Load strategy | `file://` index | `loadFile` + relative base or `app://` protocol | `electron.ts:19` | M | High | CHANGE |
| E-007 | Strong's assets | `/HebrewGreekRes/...` fetch | Runtime base + copy in `build/` | `StrongsDictionary.tsx` | M | High | CHANGE |
| E-008 | `/proxy` downloads | Dev proxy only | Absolute proxy/Functions URL | `dynamicProduct_Details/index.tsx:148` | S | High | CHANGE |
| E-009 | `/espees` hosting | Firebase rewrite | Functions base URL module | `firebase.json`, future callers | S | Med | CHANGE |

### Root: Security hardening

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-010 | webPreferences | partial | contextIsolation, sandbox, no nodeIntegration, preload | `electron.ts` | M | High | CHANGE |
| E-011 | Navigation | `new-window` in-window load | allowlist + external browser | `electron.ts:30–33` | S | High | CHANGE |
| E-012 | CSP | none | strict CSP for Firebase, Worker, APIs | main + meta | M | Med | CHANGE |
| E-013 | Single instance | none | `requestSingleInstanceLock` | main | S | Low | CHANGE |

### Root: Auth & identity

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-014 | OAuth redirect | web.app callback | custom protocol or loopback | KingsChat + main | L | High | ASK |
| E-023 | Worker CORS | web origins only | add desktop/null origin policy | `workers/.../index.js:19–24` | S | Med | CHANGE |
| E-024 | Duplicate callback | two components same path | single callback route | `main.tsx:110–113` | S | Low | CHANGE |
| E-025 | Splash detection | `window.location.pathname` | hash-aware or router hook | `App.tsx:8–10` | S | Med | CHANGE |

### Root: PWA / SW

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-026 | Service worker | always register | skip in Electron | `index.tsx:25` | S | Med | CHANGE |

### Root: Packaging & branding

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-027 | productName / appId | Scribbbler / scribbbler | Rhapsody Bible branding? | `package.json:134–135` | S | Low | ASK |
| E-028 | Win icon | PNG only | `.ico` + builder win target | `public/icon/` | S | Low | CHANGE |
| E-029 | Package excludes | minimal files list | exclude backup, workers, functions, docs | `package.json:136` | S | Low | CHANGE |
| E-030 | Offline payload | 194M public + 68M JSON | strategy TBD | see §G | L | Med | ASK |

### Root: Runtime config

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-031 | API base URLs | scattered / dev proxy | `src/config/runtime.ts` | new + call sites | M | Med | CHANGE |

### Root: Keep as-is

| ID | Area | Current | Target | Files | Effort | Risk | Rec |
|----|------|---------|--------|-------|--------|------|-----|
| E-032 | HashRouter in Electron | yes | keep | `main.tsx:289` | — | — | KEEP |
| E-033 | homepage `./` | set | keep for CRA | `package.json:6` | — | — | KEEP |
| E-034 | Protected redirect | Navigate to login | keep | `Protected/index.tsx:55–62` | — | — | KEEP |

---

## Proposed implementation order (Stage 2)

1. E-001–E-005, E-004 — toolchain + dev launch fix  
2. E-010–E-013 — security  
3. E-031, E-008, E-009 — runtime URLs  
4. E-026 — service worker guard  
5. E-006, E-007 — assets / protocol  
6. E-014, E-023–E-025 — OAuth desktop  
7. E-027–E-029, E-003 — packaging + updater stub  
8. E-030 — offline strategy (after ASK)  
9. CI + README  

---

## Questions for you

1. Desktop **product name** and **appId**: keep `Scribbbler` / `com.appsloveworld.scribbbler` or rebrand to Rhapsody Bible?
2. KingsChat redirect: **custom protocol** vs **127.0.0.1 loopback** (which can you register with KingsChat)?
3. **Offline installer size** vs capability: bundle all ~260M, or download Strong's on first launch?
4. Should the desktop shell **hide marketing/website routes** or ship the full router (current behavior)?
5. **Auto-update**: GitHub Releases vs generic HTTPS bucket?
6. Store **Espees** payments in desktop: required in v1 or defer (currently no `/espees` fetch in app src)?

---

## Things only you can provide

See `00-progress.md` § Things only you can provide.

---

## Recommendation counts

| Rec | Count |
|-----|------:|
| CHANGE | 28 |
| ASK | 3 |
| KEEP | 3 |

*(E-014, E-027, E-030 = ASK; E-032–E-034 = KEEP; remainder CHANGE.)*
