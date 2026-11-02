# Rhapsody Bible Project Status

Status: ✅ Done · 🟠 Ongoing · ❌ Pending  
Priority: ✳️ Launch-critical · 🟡 Conditional · ⚪ Post-launch

## At a glance

| Section | Done | Ongoing | Pending | Launch-critical items left |
|---------|------|---------|---------|----------------------------|
| 1. Safety Net & Version Control | 0 | 0 | 6 | 5 |
| 2. Secrets & Credential Rotation | 0 | 0 | 7 | 7 |
| 3. Authentication & Authorization | 0 | 0 | 6 | 6 |
| 4. Firestore & Storage Rules | 0 | 0 | 5 | 5 |
| 5. Payments | 0 | 0 | 6 | 6 |
| 6. Dependencies & Runtime | 0 | 0 | 5 | 3 |
| 7. Testing & Safety Reviews | 0 | 0 | 7 | 4 |
| 8. UI & UX Polish | 0 | 0 | 12 | 0 |
| 9. PWA Readiness | 0 | 2 | 3 | 1 |
| 10. Electron Desktop App | 0 | 2 | 11 | 9 |
| 11. CI/CD & Release | 0 | 1 | 6 | 5 |
| 12. Code Quality & Cleanup | 0 | 0 | 5 | 0 |
| 13. Documentation | 0 | 0 | 4 | 2 |
| **Total** | **0** | **5** | **83** | **53** |

The app has rich features but is not safe to ship publicly yet. The biggest risk is anyone on the internet can read or change user data. Start by restoring version control, rotating leaked secrets, and fixing login and database access.

---

## 1. Safety Net & Version Control

Protects the team from losing work and breaking production by accident.

### DevOps / Deployment

- Official git history and remote connected to this codebase ❌✳️
- Ignore list keeps build output and secrets out of git ❌✳️
- Separate staging Firebase project for safe experiments ❌✳️
- Regular Firestore backup and restore steps tested ❌🟡
- Fresh copy of repo installs all packages successfully ❌✳️
- Fresh copy builds the web app without checked-in build folder ❌✳️

## 2. Secrets & Credential Rotation

Leaked keys in the repo can let attackers charge payments or impersonate users.

### DevOps / Deployment

- Espees payment keys rotated; old keys disabled ❌✳️
- Email notification keys rotated; removed from shell scripts ❌✳️
- KingsChat login secrets rotated; removed from shell scripts ❌✳️
- Login token signing moved off the public app; old secret dead ❌✳️
- Worker setup docs cleaned; cloud worker secrets rotated ❌✳️
- Old backup environment files removed from the repository ❌✳️
- All secrets loaded from environment or vault, never source code ❌✳️

## 3. Authentication & Authorization

Users must only see their own content; admins must be provably admin.

### Frontend

- Logged-out visitors cannot open private pages ❌✳️

### Backend / Cloud Functions

- KingsChat login creates proper Firebase login session ❌✳️
- Email and password accounts moved to Firebase login ❌✳️
- Admin powers enforced by server roles, not screen checks alone ❌✳️

### DevOps / Deployment

- Password checking removed from the browser app ❌✳️
- Browser bundle no longer contains custom login token signing ❌✳️

## 4. Firestore & Storage Rules

Database access rules (Firestore rules) must match who is signed in.

### Data & Rules

- Default rule blocks all reads and writes ❌✳️
- Each named data collection has its own access rule ❌✳️
- Automated tests prove rules allow and deny correctly ❌✳️
- New rules live on staging before production switch ❌✳️
- Uploaded files rules match file owners ❌✳️

## 5. Payments

Payment endpoints must not let strangers create or confirm charges.

### Backend / Cloud Functions

- Only signed-in users can start or confirm Espees payments ❌✳️
- Payment APIs accept requests only from our web domains ❌✳️
- Confirming the same payment twice cannot double-charge ❌✳️
- App Check (bot protection) required on payment endpoints ❌✳️
- Rate limits slow abuse of payment and download proxies ❌✳️
- Every payment attempt recorded consistently in the database ❌✳️

## 6. Dependencies & Runtime

Outdated libraries and runtimes increase break-ins and outages.

### DevOps / Deployment

- Dependency scan run; serious issues fixed or accepted in writing ❌✳️
- Outdated HTTP client library upgraded to supported release ❌✳️
- Cloud Functions run on supported Node version ❌✳️

### Frontend

- Dev payment server split out of main web app package ❌🟡
- Smaller initial download after enabling webpack code splitting ❌⚪

## 7. Testing & Safety Reviews

Automated checks catch regressions before users do.

### Frontend

- Automated test proves private pages block logged-out users ❌✳️
- End-to-end test covers login through dashboard ❌🟡
- Rich text editor reviewed for cross-site scripting risk ❌✳️
- Live database listeners reviewed for runaway read costs ❌🟡

### Backend / Cloud Functions

- Automated tests cover payment create and confirm handlers ❌✳️
- Automated tests cover KingsChat token exchange worker ❌🟡

### Data & Rules

- Automated tests cover every Firestore security rule ❌✳️

## 8. UI & UX Polish

Small clarity fixes without a full redesign.

### Frontend

- Visible spelling typos in labels and menus fixed ❌⚪
- One header design used across the app ❌⚪
- Splash screen skippable or under two seconds ❌🟡
- Core screens show loading while data fetches ❌🟡
- Core lists show helpful message when empty ❌🟡
- Users see clear message when cloud save fails ❌🟡
- Crash boundaries prevent blank white screen ❌🟡
- Basic accessibility: labels, contrast, focus, keyboard ❌🟡
- Layout verified on phone, tablet, and desktop widths ❌🟡
- Desktop app: resize, title bar, shortcuts feel native ❌🟡
- One UI library chosen for all new screens ❌⚪
- Owner to supply list of UI tweaks ❌🟡

## 9. PWA Readiness

Installable web app (PWA) must meet browser and store expectations.

### Frontend

- Install manifest and required icon sizes ship with app 🟠🟡
- Service worker registers in production web builds 🟠🟡
- Offline reading behavior defined and implemented ❌🟡
- Users prompted when a new app version is available ❌🟡
- Lighthouse installability check passes agreed target ❌✳️

## 10. Electron Desktop App

Signed desktop app (Electron) for Windows and Mac with safe updates.

### Desktop (Electron)

- Desktop shell opens the app in a window today 🟠🟡
- Desktop dev start script waits on correct local port ❌✳️
- Electron sandbox and context isolation enabled ❌✳️
- Electron upgraded to currently supported major version ❌✳️
- API base URLs configurable for desktop builds ❌✳️
- Service worker disabled inside desktop app ❌✳️
- KingsChat login uses desktop-safe redirect flow ❌✳️
- Offline Bible asset strategy implemented for desktop ❌🟡
- Windows installer target configured in desktop build ❌✳️
- macOS packaging settings exist in desktop build config 🟠🟡
- Windows builds signed with trusted code signing certificate ❌✳️
- macOS builds notarized for Apple Gatekeeper ❌✳️
- Auto-update channel works on Windows and macOS ❌🟡

## 11. CI/CD & Release

Every release built the same way with no secrets in the repo.

### DevOps / Deployment

- Hosting config routes web traffic and payment URLs 🟠🟡
- GitHub Actions runs tests on each change ❌✳️
- GitHub Actions builds web app without committed build folder ❌✳️
- GitHub Actions builds signed Windows and macOS installers ❌✳️
- Signing credentials stored only in CI secret store ❌✳️
- Release builds published to hosting and update servers ❌🟡
- Committed production build folder removed from repository ❌✳️

## 12. Code Quality & Cleanup

Easier maintenance after launch stabilizes.

### Frontend

- Duplicate old screens and headers removed ❌⚪
- Giant route file split into manageable modules ❌⚪
- Silent error catches replaced with logging or user feedback ❌⚪
- Debug console logging removed from production paths ❌⚪
- Formatter, linter, and pre-commit hooks agreed and enforced ❌⚪

## 13. Documentation

New contributors can set up safely without tribal knowledge.

### DevOps / Deployment

- Root readme explains setup, ports, and deploy steps ❌✳️
- Example environment file lists variable names only ❌✳️
- Step-by-step onboarding guide matches actual commands ❌🟡
- Short architecture note for engineers and managers ❌⚪

---

## Blocked By

- Locking down the database cannot finish until the new login system works.
- Strict Firestore rules need real signed-in user identities from Firebase Auth.
- Payment lockdown should follow secret rotation and authenticated login.
- Desktop KingsChat login depends on choosing a desktop redirect approach.
- Signed Windows and Mac installers need code signing certificates and CI secrets.
- Removing the committed build folder depends on CI producing deploy artifacts first.
- Staging Firebase project should exist before production rule or payment changes.
- Owner UI tweak list is needed before custom polish work beyond the audit list.

## Open Decisions

- Where is the canonical git remote for this project?
- Do live production database rules differ from what is in the repo?
- Is Firebase project `kjv-strongs-reader` still the correct backend?
- Keep email and password login, or KingsChat-only?
- Keep public payment HTTP endpoints, or move to authenticated callables?
- Ship Bible text inside the desktop installer, or download on first launch?
- Should the web app work fully offline, or online-only with caching?
- Have all keys exposed in scripts and docs already been rotated in production?

## Plain-English Glossary

- **PWA** — Website users can install like an app on phone or desktop.
- **Electron** — Wraps the web app in a native Windows or Mac program.
- **Firestore** — Google cloud database storing users, notes, and projects.
- **Rules** — Server-side rules deciding who can read or write each database record.
- **Firebase Auth** — Google’s sign-in service verifying user identity.
- **Cloud Functions** — Small server programs handling payments and proxies in the cloud.
- **Espees** — Third-party payment service used for purchases.
- **KingsChat** — Third-party login provider used for sign-in.
- **Secrets** — Private keys and passwords that must never be public.
- **CI/CD** — Automated build and test pipeline on every code change.
- **Code signing** — Cryptographic stamp proving the desktop app is from you.
- **Notarization** — Apple’s malware scan approval required for Mac distribution.
