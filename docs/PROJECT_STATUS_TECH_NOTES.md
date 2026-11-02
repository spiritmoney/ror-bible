# PROJECT_STATUS — Tech notes (engineers)

1. No `.git` — `docs/audit/01-overview.md`.
2. Only `functions/.gitignore` — `docs/audit/04-dependencies-build.md`.
3. Staging Firebase — `docs/audit/00-EXECUTIVE-SUMMARY.md` work order #1.
4. Firestore backup — not in repo; `docs/audit/02-architecture.md`.
5. No `node_modules` — `docs/audit/04-dependencies-build.md`.
6. Committed `build/` — `docs/audit/01-overview.md`, `04-dependencies-build.md`.
7. `src/server.js` Espees key — `docs/audit/06-security.md`.
8. `local.sh`, `build.sh` — `docs/audit/06-security.md`.
9. KingsChat in `local.sh` — `docs/audit/02-architecture.md`.
10. `src/hooks/useEncrypt.ts` — `docs/audit/06-security.md`.
11. `workers/kingschat-callback/README.md` — `docs/audit/06-security.md`.
12. `backup/kingschat-old/.env` — `docs/audit/06-security.md`.
13. Env/vault-only secrets — `docs/audit/00-EXECUTIVE-SUMMARY.md` #3.
14. `src/components/Protected/index.tsx:43-44` — `docs/audit/06-security.md`.
15. Firebase Auth custom tokens — `docs/audit/00-EXECUTIVE-SUMMARY.md` structural #1.
16. `useGeneral.ts`, `Login/index.tsx` — `docs/audit/06-security.md`.
17. `usePermission.ts`, `screens/Admin/index.tsx` — `docs/audit/06-security.md`.
18. Client bcrypt removal — `docs/audit/06-security.md`.
19. `useEncrypt.ts` removal — `docs/audit/06-security.md`.
20. `firestore.rules:3-4` — `docs/audit/06-security.md`.
21. `src/interface/firebase.ts` ICollections — `docs/audit/02-architecture.md`.
22. Rules tests — `docs/audit/05-testing.md`.
23. Staged rules deploy — `docs/audit/00-EXECUTIVE-SUMMARY.md` #1.
24. Firebase Storage rules — `docs/audit/02-architecture.md`; `useFirebase.ts` folders.
25. `functions/index.js` Espees exports — `docs/audit/06-security.md`.
26. `functions/index.js` `sendCors` — `docs/audit/06-security.md`.
27. Payment idempotency — `docs/audit/06-security.md`.
28. App Check — `docs/audit/00-EXECUTIVE-SUMMARY.md` structural #2.
29. Rate limits — `docs/audit/06-security.md`.
30. `scribTransactionLog`, `scribSuccessfulPayments` — `docs/audit/02-architecture.md`.
31. `yarn audit` not run — `docs/audit/04-dependencies-build.md`.
32. `axios@0.27.2` — `docs/audit/04-dependencies-build.md`.
33. `functions/package.json` node 16 — `docs/audit/04-dependencies-build.md`.
34. Express in root `package.json` — `docs/audit/04-dependencies-build.md`.
35. `craco.config.js` splitChunks — `docs/audit/04-dependencies-build.md`.
36. Protected test — `docs/audit/05-testing.md`.
37. E2E — `docs/audit/05-testing.md`.
38. Quill/XSS — `docs/audit/06-security.md` [UNKNOWN].
39. `onSnapshot` — `docs/audit/06-security.md`.
40. Payment handler tests — `docs/audit/05-testing.md`.
41. `workers/kingschat-callback/src/index.test.js` — `docs/audit/05-testing.md`.
42. Firestore rules tests — `docs/audit/05-testing.md`.
43. Typos paths — `docs/audit/03-quality.md`.
44. `Header`, `OldHeader` — `docs/audit/03-quality.md`.
45. `src/App.tsx:19-21` — `docs/audit/06-security.md`.
46. Loading states — `docs/audit/03-quality.md` (pattern); screens not enumerated.
47. Empty states — same as 46.
48. User-visible Firebase errors — `docs/audit/03-quality.md` silent catches.
49. Error boundaries — not in audit; gap.
50. Accessibility — not in audit; gap.
51. Responsive — not in audit; gap.
52. `public/electron.ts`, HashRouter — `docs/audit/02-architecture.md`.
53. UI library overlap — `docs/audit/03-quality.md`.
54. Owner list — planning placeholder.
55. `public/manifest.json`, logos — verified read.
56. `src/index.tsx:24`, `src/service-worker.ts` — verified read.
57. Offline — `docs/audit/02-architecture.md` static assets.
58. `src/serviceWorkerRegistration.ts` — CRA PWA template.
59. Lighthouse — not run.
60. `public/electron.ts` — verified read.
61. `package.json:112` wait-on port 3001 — verified read.
62. `public/electron.ts:12-15` webPreferences — verified read.
63. `electron@21` — `docs/audit/04-dependencies-build.md`.
64. `build.sh`, `getEnv` — `docs/audit/07-docs-onboarding.md`.
65. SW in Electron — `public/electron.ts` file URL prod load.
66. `src/config/kingschat.ts` — `docs/audit/02-architecture.md`.
67. `public/` ~193M — `docs/audit/01-overview.md`.
68. `package.json:113` `-mwl` — verified read.
69. `package.json` `build` block — verified read; no win.sign.
70. Code signing — not configured in `package.json`.
71. Notarization — not in `package.json` build block.
72. `publish never` — `package.json:113`.
73. `firebase.json` — verified read; `docs/audit/02-architecture.md`.
74. No `.github/` — `docs/audit/04-dependencies-build.md`.
75. CI web build — same as 74.
76. CI desktop signed builds — same as 74.
77. CI secret store — not present.
78. Release publish — `firebase.json`; Heroku URL in `build.sh` audit `07`.
79. Remove `build/` from git — `docs/audit/04-dependencies-build.md`.
80. `_OLD`, `main2.tsx`, `backup/` — `docs/audit/03-quality.md`.
81. `src/container/main.tsx` — `docs/audit/03-quality.md`.
82. Empty catch blocks — `docs/audit/03-quality.md`.
83. `console.log` — `docs/audit/03-quality.md`.
84. ESLint only — `docs/audit/03-quality.md`.
85. No root README — `docs/audit/07-docs-onboarding.md`.
86. No `.env.example` — `docs/audit/07-docs-onboarding.md`.
87. `local.sh` onboarding — `docs/audit/07-docs-onboarding.md`.
88. Architecture note — `docs/audit/02-architecture.md`.
