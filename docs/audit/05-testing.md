# Phase 5 — Testing

## Framework & layout

| Item | Detail |
|------|--------|
| Runner | Jest via CRA/`craco test` [CONFIRMED] `package.json:110` |
| RTL | `@testing-library/react`, `jest-dom`, `user-event` in dependencies [CONFIRMED] |
| Config | Extends `react-app/jest` via eslintConfig only; no custom `jest.config` [CONFIRMED] |

## Test files found

| File | Type |
|------|------|
| `src/utils/cdnUrl.test.ts` | Unit tests for CDN URL normalization (2 cases) [CONFIRMED] |
| `workers/kingschat-callback/src/index.test.js` | Worker helper tests [CONFIRMED] glob |

**Approximate ratio:** 2 test files vs ~204 TS/TSX sources → **~1%** file coverage by count [CONFIRMED].

## Execution

| Command | Result |
|---------|--------|
| `npm test -- --watchAll=false` | **Not run** — no root `node_modules` [CONFIRMED] |
| Coverage report | **None** in repo [CONFIRMED] |

## Critical untested areas (sampled)

| Area | Risk if untested |
|------|------------------|
| `Protected` auth gate | Regression allowed admin/dashboard exposure [CONFIRMED bug in component] |
| `useFirebase` / Firestore hooks | Data loss, query bugs |
| KingsChat OAuth (`useKingsChat`, `AuthCallback`) | Login breakage |
| Espees payment flows | Financial/regression |
| `useGeneral` password login (bcrypt client-side) | Auth bugs |
| Store catalog axios calls | Integration failures |

## Test quality (existing)

| File | Assessment |
|------|------------|
| `cdnUrl.test.ts` | **Meaningful** assertions on URL casing edge case [CONFIRMED] |
| Worker tests | Not fully read; likely unit-level on token body builders [INFERRED] from worker `index.js` exports |

No E2E (Cypress/Playwright), no Firestore rules tests, no Functions HTTP tests found [CONFIRMED] glob.

## Phase 5 summary (5 lines)

1. Jest/RTL **configured by CRA** but almost unused in `src/`.
2. Only **one** app unit test file (`cdnUrl.test.ts`) plus worker tests.
3. Test suite **not executed** in this audit (missing dependencies).
4. **Auth, payments, and Firestore** paths have no automated safety net.
5. Adding rules tests + Protected route tests would give highest ROI.
