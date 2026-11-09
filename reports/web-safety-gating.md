# Website-visible diff vs merge-base `0fae711` (github/electron-nav)

Scope: `src/screens/Website`, `src/styles`, `src/components/Footer`, `src/components/Header`.

| File | Hunk | Gating |
|------|------|--------|
| `src/components/Footer/index.tsx` | Build ID line in reader footer | **Reader/workspace** (`components/Footer`), not marketing `screens/Website/footer.tsx` |
| `src/components/Header/index.tsx` | `useAppChromeTopBar`, in-site nav vs `openExternalUrl` | **App chrome / reader routes** (`isAppShell \|\| isReaderAppTopBarRoute`); plain tab uses in-site `navigate` |
| `src/components/Header/index.tsx` | Logo/sign-in/top nav buttons | Same **reader/app-shell chrome**; invisible on marketing pages |
| `src/screens/Website/header.tsx` | `homeLinkToReader` lockup target | **Only when** `isAppShell()` or `/bible-online` reader top bar; **plain website** keeps `/home` |
| `src/styles/app-chrome.css` | Sidebar coming-soon cursor | **`.app-chrome` / sidebar** only |
| `src/styles/app-chrome.css` | `html.is-app-shell` / `html.is-electron` typography | **Installed PWA/Electron**; plain tab has neither class |
| `HeaderReaderRoute.test.tsx` / `HeaderTopNavWebsite.test.tsx` | Tests only | N/A |

Marketing `Website/*` page bodies: **no hunks** in this range.
