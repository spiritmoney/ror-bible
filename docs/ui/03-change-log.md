# Stage 3 — Website UI change log

## Gate 1 approval recorded

- **Approved:** U-001–U-028, U-032  
- **Rejected:** none  
- **Keep:** U-029, U-030, U-031 (+ user DO-NOT-TOUCH list)  
- **Git:** init + branch `ui-upgrade`  
- **Nav:** NEW IA; Store + Contact in utility bar and footer  
- **Hero:** NEW hero; carousel files left unused  
- **Pricing:** reference copy with placeholders  
- **Routes:** additive product/features/pricing/download routes  
- **Imagery:** full NEW `images/` set under `src/assets/website/new/`  

## Placeholders for owner (pricing)

| Location | Placeholder |
|----------|-------------|
| Premium plan price | `[PRICE]` |
| Pro plan price | `[PRICE]` |
| Max plan price | `[PRICE]` |
| Billing suffix | `/ month` or `/ year` (toggle UI only) |

## Parity table (reference → React)

| Reference page | React route | Verified (1440/768/390) |
|----------------|-------------|-------------------------|
| `index.html` | `/`, `/home` | Pending manual QA |
| `features.html` | `/features` | Pending manual QA |
| `pricing.html` | `/pricing` | Pending manual QA |
| `download.html` | `/download` | Pending manual QA |
| `web.html` | `/products/web` | Pending manual QA |
| `mobile.html` | `/products/mobile` | Pending manual QA |
| `desktop.html` | `/products/desktop` | Pending manual QA |
| `voice.html` | `/products/voice` | Pending manual QA |
| (modal content) | `/about`, `/product`, `/give`, `/partner` | Pending manual QA |

## Batch log

| IDs | Files (summary) | Verified | Notes |
|-----|-----------------|----------|-------|
| U-032 | `main.tsx`, `main2.tsx`, `Workspace/index.tsx` | tsc pass | Import path fix |
| U-001–U-003 | `tailwind.config.js`, `website.css`, `public/fonts/*`, `assets/website/new/*` | tsc pass | Brand tokens + assets |
| U-004–U-022 | `WebsiteLayout`, `header`, `footer`, `MobileMenu`, `WebsiteButton`, `Section`, `Card`, `BrandStripe`, `PageHero`, `websitePaths` | tsc pass | Shared chrome + interactions |
| U-010–U-016 | `landingPage`, `featuresPage`, `pricingPage`, `downloadPage`, `productPlatformPage`, `websiteFeaturesData`, `main.tsx` routes | tsc pass | New pages |
| U-023–U-027 | `about`, `partner`, `give`, `product`, `features`, `featuresAbout`, `featureProduct` | tsc pass | Shell + CSS motion; legacy inner content retained |
| U-028 | image imports → `assets/website/new/` | tsc pass | |

## Unused files (candidates for removal — awaiting your approval)

- `carousel.tsx`
- `sideNav.tsx`
- `videoplayer.tsx`
- `homepage.tsx`
- `features.tsx` (legacy section; not imported by new landing)

## Approved items not done

- None identified; visual verification at three widths still required before sign-off.

## Screenshots

Re-run comparison against `docs/ui/shots/` after local QA on `npm run react` (port 3400) and reference `npx serve` on `ROR_Bible_Plus_Website`.

## Runtime fix (2026-11-02)

- **Blank page:** circular ES module init — `give.tsx` (and modal pages) imported `HEADER_HEIGHT` from `header.tsx`, which pulled `WebsiteLayout` → `header` before `HEADER_HEIGHT` was initialized (`ReferenceError: Cannot access 'HEADER_HEIGHT' before initialization`).
- **Fix:** `constants.ts` (header offsets) and `websiteMenuContext.tsx` (`useWebsiteMenu`); modal pages import offsets from `constants`; `DashboardStore` imports `HEADER_HEIGHT` from `constants`. `madge --circular src/screens/Website`: no cycles.
- **Verify shots:** `docs/ui/shots/debug/*-{1440,390}.png` after fix on branch `ui-upgrade`.
