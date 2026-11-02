# Phase 3 — Code Quality & Maintainability

## Conventions & organization

| Topic | Assessment |
|-------|------------|
| Folder layout | CRA + `baseUrl: "src"`; features split `components/`, `screens/`, `hooks/`, `store/atoms/` [CONFIRMED] |
| Naming consistency | **Mixed**: typos persist (`Anotations`, `Preffered`, `freesbies` routes); parallel `Header` / `OldHeader`, `main.tsx` / `main2.tsx`, `SingleReaderArea_OLD` [CONFIRMED] paths |
| UI libraries | MUI + Evergreen + Tailwind/tw-elements + styled-components — overlapping design stacks [CONFIRMED] `package.json` |
| Route constants | Centralized in `src/navigation/routes.ts` [CONFIRMED] |
| Data access | Most Firestore access funneled through `useFirebase` [CONFIRMED] — good DRY intent; many hooks still duplicate query logic |

## Complexity hotspots

| File (lines) | Concern |
|--------------|---------|
| `screens/Multi_layout/.../index.tsx` (~1030) | Large layout/Bible UI [CONFIRMED] `wc -l` |
| `components/Workspace/index.tsx` (~879) | Editor workspace orchestration |
| `components/SingleReaderArea/index.tsx` (~723) | Reader core |
| `hooks/useProjects.ts` (~644) | Project lifecycle + Firestore |
| `container/main.tsx` (~295) | Entire routing table in one component |

**Nesting / churn:** Git-based churn **not measurable** (no `.git`) [CONFIRMED Phase 1].

## Dead code & inventory

| Item | Evidence |
|------|----------|
| TODO/FIXME/HACK in `src/**/*.{ts,tsx,js}` | **0 matches** [CONFIRMED] case-insensitive grep |
| Legacy copies | `backup/kingschat-old/`, `*_OLD` components, commented routes in `main.tsx` [CONFIRMED] sampled |
| `main2.tsx` | Alternate router — usage **not traced** [UNKNOWN] grep if imported |

## Error handling & observability

| Pattern | Finding |
|---------|---------|
| Swallowed errors | Empty `catch` in `Protected`, `AddUsers`, `SingleReaderArea`, `Admin/Users` [CONFIRMED] |
| Logging | **138+** `console.log/error/warn` hits in `src` [CONFIRMED] grep (incl. debug strings in `useFirebase.ts:189`) |
| Firebase errors | Often logged only, not surfaced to UI [INFERRED] from `useProjects` samples |
| APM / structured logging | **None** found [CONFIRMED] |
| Web vitals | CRA `reportWebVitals` wired in `index.tsx` [CONFIRMED] |

## Type safety & tooling

| Tool | Setup | Run result |
|------|-------|------------|
| TypeScript | `strict: true`, `allowJs: true` [CONFIRMED] `tsconfig.json` |
| `: any` usage | Widespread (~80+ files with `: any`) [CONFIRMED] grep count |
| ESLint | Extends `react-app` + jest only [CONFIRMED] `package.json:115-119` |
| Prettier / Husky | **Absent** [CONFIRMED] |
| `tsc` / `eslint` CI | **Not run** — no `node_modules` in workspace [CONFIRMED] |

## Notable maintainability issues

| ID | Severity | Effort | Finding |
|----|----------|--------|---------|
| Q-01 | High | S | `Protected` renders children when logged out (`index.tsx:43-44`) — logic bug |
| Q-02 | Medium | M | Monolithic route file + duplicate auth callback routes (`/auth/callback` twice) [CONFIRMED] `main.tsx:106-109` |
| Q-03 | Medium | L | Multiple parallel headers/routers increase drift risk |
| Q-04 | Low | M | Debug `console.log` left in production paths |

## Phase 3 summary (5 lines)

1. **Strict TS on paper**, but heavy `any` and eslint-disable usage in hot paths.
2. Largest files are **reader/workspace/multi-layout** screens (600–1000+ lines).
3. **No TODO/FIXME** markers; legacy instead lives in `_OLD` files and `backup/`.
4. Error handling often **silent**; logging is ad-hoc console output.
5. No formatter/pre-commit tooling; lint/type-check **not verified** without install.
