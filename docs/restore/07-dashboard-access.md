# Dashboard access investigation (read-only)

**Branch context:** `restore-web-bible` / `ui-upgrade`  
**Baseline:** `4089b6f`  
**Observed app:** `http://localhost:3400` (yarn `react`), fresh profile (storage cleared on origin before tests)

---

## Step 1 — Route trace (`src/container/main.tsx`)

Constants from `src/navigation/routes.ts`: `DashboardRoute=/dash`, `AdminRoute=/admin`, `AnnotateRoute=/annotate`, `FavouritesRoute=/favourites`, `StoreRoute=/store`.

| URL | Route entry (lines) | Wrappers | Renders (element) |
|-----|---------------------|----------|-------------------|
| `/dash` | 115–121 | `<Protected>` → `<SimpleSuspense component={Dashboard} />` | Lazy `screens/Dashboard` → `Header` + `Workspace` + modals |
| `/dash/:id` | 167–173 | Same Protected + Dashboard | Same Dashboard |
| `/admin` | 242–254 | `<Protected>` → `<SimpleSuspense component={Admin} />` (+ nested duplicate `AdminRoute` child for Users) | Lazy `screens/Admin` → `AdminComponent` |
| `/annotate/:id` | 175–181 | Protected + Dashboard | Same Dashboard shell (annotation context via route param) |
| `/favourites` | 199–205 | Protected + `<SimpleSuspense component={Store} />` | Lazy `screens/Store` (**note:** never wins for `/store`; see below) |
| `/store` | **151** `<Route path="/store" element={<DashboardStore nav="store" />} />` **first** | **No Protected**; `DashboardStore` → `Workspace` | Public route shell; **Workspace** enforces auth for store nav (lines 97–100 `Workspace/index.tsx`) |
| `/store` (duplicate) | 191–197 `path={StoreRoute}` | Protected + Store lazy | **Unreachable** — same path as line 151; React Router v6 uses **first** match |

No route for bare `/annotate` (only `/annotate/:id`).

**Splash:** All routes go through `App.tsx` splash (2s) before `Main` mounts.

**Router:** `BrowserRouter` in normal Chrome; `HashRouter` when `userAgent` contains `Electron/` (`src/utils/general.ts` lines 26–28, `main.tsx` 289–298).

### `Protected` logic [CONFIRMED] — `src/components/Protected/index.tsx` (full file, 50 lines)

```35:47:src/components/Protected/index.tsx
  if (isLoggedIn === 'true') {
    return <>{children}</>;
  }

  // if (isLoggedIn === 'false') {
  //   return <Navigate to={AuthRoute} />;
  // }
  // Replaced the condition for isLoggedIn = false
  if (isLoggedIn === 'false') {
    return <>{children}</>;
  }

  return <SuspenseLoader fullscreen />;
```

- **`isLoggedIn === 'true'`:** render protected children; Firestore user snapshot when logged in (lines 17–33).
- **`isLoggedIn === 'false'`:** **still renders children** (redirect to `AuthRoute` (`/auth`) is commented out).
- **Otherwise (`'loading'`):** fullscreen `SuspenseLoader`.

### Git since `4089b6f`

| File | Changed since baseline? |
|------|-------------------------|
| `src/components/Protected/index.tsx` | **No** (identical to baseline commit) |
| `src/container/main.tsx` | **Yes** — marketing routes, `font-montserrat`, import fix; **Protected dashboard routes unchanged** |
| `src/components/Workspace/index.tsx` | **Yes** — design token colors only (sid nav) |

`git log -p 4089b6f..HEAD -- src/components/Protected/index.tsx` → empty.

### Auth signal interaction [CONFIRMED]

- `isLoggedInAtom` default **`'true'`** (`src/store/atoms/user.ts` lines 16–19, comment: changed from `'loading'`).
- Fresh cleared storage: no `LOCAL_STORAGE_USER_EMAIL` → `useUser` does not immediately set `'false'` (`useUser.ts` lines 66–77).
- **`Protected` therefore treats a fresh visitor as logged-in** until something sets `'false'`.
- **`Workspace.isAuthenticated`** (separate from Protected) uses `user.id || storedEmail` and **does** redirect store/favourites nav to `/login` (`Workspace/index.tsx` 97–100).

---

## Step 2 — Logged-out browser observation (Puppeteer, storage cleared)

| Route | Final URL | UI observed | Console errors |
|-------|-----------|-------------|----------------|
| `/dash` | `/dash` | **Dashboard workspace** (SideNav: Library, Favourite, Store, reader sub-nav) | None |
| `/admin` | `/admin` | **Admin shell** (“Users & Permissions”, “Manage Users” in body text) | None |
| `/annotate/demo-id` | `/annotate/demo-id` | **Dashboard workspace** (same chrome as `/dash`) | None |
| `/favourites` | `/favourites` | **Dashboard workspace** chrome | None |
| `/store` | **`/login`** | **Reader login** (“Login with KingsChat”) | None |

---

## Step 3 — Answers

### Can a logged-out visitor see dashboard or admin UI?

**Yes [CONFIRMED]** for `/dash`, `/annotate/:id`, `/favourites`, and `/admin` under a fresh profile: `Protected` renders children when `isLoggedIn === 'true'` (default) **and** when `isLoggedIn === 'false'`.

### Can they read or write data through it?

**Partially [INFERRED]:** UI mounts (projects workspace, admin tables). Firestore reads in `Protected` only run when `isLoggedIn === 'true'` (lines 17–18). **`Admin`** only redirects non-admins when `isLoggedIn === 'true'` (`screens/Admin/index.tsx` lines 18–20); when logged out with default `'true'`, permission flags likely false—behavior varies. **No login gate** on Protected routes themselves. **`/store`** public route redirects to **`/login`** via Workspace before store UI—**does not** expose store shell logged out.

### Why did `/dash` show the marketing homepage?

**Not on BrowserRouter + pathname `/dash` [CONFIRMED]** — observation shows dashboard workspace.

**[INFERRED]** Marketing homepage at URL `/dash` happens when **`HashRouter`** is active (Electron/Cursor webview): routes match **hash** only, so pathname `/dash` with empty hash matches **`/` → `Homepage`** (`landingPage` / marketing). Same class of issue as `/bible-online` in `06-reader-compare.md`.

### Same as baseline?

**Protected behavior: yes [CONFIRMED]** — file unchanged since `4089b6f`.  
**`/store` → login:** Workspace gate + duplicate route order **predates** ui-upgrade (same pattern at baseline `main.tsx`).  
**Marketing routes / splash timing:** ui-upgrade only; not the root of Protected bypass.

---

## Step 4 — Smallest fix options (do not implement)

### Option A — Restore redirect when explicitly logged out

In `Protected/index.tsx`, replace lines 43–45 with:

```tsx
if (isLoggedIn === 'false') {
  return <Navigate to={LoginRoute} replace state={{ from: location.pathname }} />;
}
```

(use `LoginRoute` (`/login`) to match Workspace store redirect, not commented `AuthRoute` `/auth`.)

**Routes affected:** `/dash`, `/dash/:id`, `/annotate/:id`, `/voice-note/:id`, `/store` (Protected duplicate—currently dead), `/favourites`, `/admin`, nested admin users.

**Would not affect:** Public `DashboardStore` routes (`/bible-online`, `/read`, `/store` line 151, subpaths)—unchanged.

**Risks:**

| Risk | Mitigation |
|------|------------|
| Electron **HashRouter** | Use hash-aware `Navigate` / `Link`; test `#/dash`, `#/login`, KingsChat `#/auth/callback` |
| KingsChat callback | Do not wrap callback routes in Protected (already separate) |
| Flash while `'loading'` | Still shows loader until `'false'`/`'true'` resolved |
| **`isLoggedIn` default `'true'`** | Fix A alone **still allows UI** until state flips to `'false'` — may need default `'loading'` or treat “no user id + no stored email” as unauthenticated in Protected |

### Option B — Combined minimal hardening (recommended in doc only)

1. Option A redirect on `'false'`.  
2. In Protected, if `isLoggedIn !== 'true'` **and** no `user.id` and no `LOCAL_STORAGE_USER_EMAIL`, redirect to `/login` (or show loader)—closes default-`'true'` hole without reverting whole atom default in this task.

**Could break:** Brief loader on cold start for returning users until email hydrates (must align with existing 7s `checkLoginState` in `useUser`).

---

## References

- Observation script (local, not committed): `C:/temp/parity/dashboard-routes-observe.mjs`
- Related: `docs/restore/06-reader-compare.md` (HashRouter vs BrowserRouter)

---

## Fix applied (`fix-protected` branch)

**Commit message:** `fix(auth): enforce Protected guard and default logged-out`

1. **`isLoggedInAtom` default** changed from `'true'` to `'false'` (`src/store/atoms/user.ts`). Login still sets `'true'` via `saveUserInfo`, `AuthCallback`, and `useUser` expiry check on persisted `userAtom`.
2. **`Protected`** (`src/components/Protected/index.tsx`): renders children only when `isLoggedIn === 'true'`; shows loader while `'loading'` or while `user.id` / `LOCAL_STORAGE_USER_EMAIL` hints session restore; otherwise `<Navigate to={LoginRoute} replace />` (works with BrowserRouter and HashRouter).
3. **Tests:** `src/components/Protected/Protected.test.tsx` (redirect when logged out; render children when logged in).

Public routes (`/bible-online`, `/read`, `/store` via `DashboardStore`, website, KingsChat callback) unchanged — not wrapped in `Protected`.
