# Stage 1 — Visual comparison (OLD app website vs NEW reference)

Generated: 2026-11-01

## How sites were run

| Site | URL | Port | Notes |
|------|-----|------|--------|
| OLD | `http://localhost:3400/` | 3400 | `npm run react` (CRACO). 7s splash on first load [OBSERVED]. |
| NEW | `http://localhost:5501/` | 5501 | `npx serve` in `ROR_Bible_Plus_Website/` (Python unavailable on machine). |

**Dev overlay:** OLD build reports TS2307 for `screens/Store/product_Details.` [OBSERVED]; overlay removed in browser via DOM for screenshots only (not a code change).

**Dark mode:** Neither site implements `prefers-color-scheme` styling [INFERRED from grep; no dark screenshots taken].

## Screenshots (`docs/ui/shots/`)

| File | Page | Width |
|------|------|-------|
| `old-home-1440-clean.png` | OLD home | 1440 |
| `old-home-768.png` | OLD home | 768 |
| `old-home-390.png` | OLD home | 390 |
| `old-about-1440.png` | OLD `/about` (hero area) | 1440 |
| `new-home-1440.png` | NEW home | 1440 |
| `new-home-768.png` | NEW home | 768 |
| `new-home-390.png` | NEW home | 390 |
| `new-pricing-1440.png` | NEW pricing | 1440 |

Additional NEW pages (features, download, web/mobile/desktop/voice) compared by structure in Stage 2; full-width screenshot set deferred to Stage 3 verification.

## Page inventory

### NEW reference (`ROR_Bible_Plus_Website/`)

| Page | File |
|------|------|
| Home | `index.html` |
| Features (10) | `features.html` |
| Pricing | `pricing.html` |
| Download & support | `download.html` |
| Bible Web | `web.html` |
| Mobile | `mobile.html` |
| Desktop | `desktop.html` |
| Voice | `voice.html` |

### OLD (`src/screens/Website/` + routes)

| Route | Component | Modal variant |
|-------|-----------|---------------|
| `/`, `/home` | `landingPage.tsx` | — |
| `/about` | `about.tsx` | `isModal` |
| `/product` | `product.tsx` | `isModal` |
| `/give` | `give.tsx` | `isModal` |
| `/partner` | `partner.tsx` | `isModal` |

## Page-by-page comparison

| Page | OLD | NEW | Visible differences | Notes |
|------|-----|-----|---------------------|--------|
| Home | `/` carousel hero, `#1 Bible Reader` block, 5 feature rows, download banners, side drawer | `index.html` text hero + iPad mock, TV promo, feature cards, platform cards, CTA band | Header layout, colors, typography, hero pattern, section order, CTAs | OLD keeps promotional carousel slides [OBSERVED] |
| Features | Section on home only (`features.tsx`, 5 items) | Dedicated `features.html` (10 items, grid) | Count, layout, copy, imagery | NEW uses App Store–style JPGs |
| Pricing | **None** | `pricing.html` Free/Premium/Pro/Max, monthly/yearly toggle, FAQ | Entire page missing on OLD | Prices show `[PRICE]` placeholders on NEW [INFERRED from README] |
| Download | Banners on home; footer links | `download.html` + support/contact form | Consolidated download UX | NEW contact form is UI-only |
| Products | `/product` modal + nav buttons | Mega menu + `web/mobile/desktop/voice.html` | Four product landings vs single product screen | OLD nav includes **Store** link [OBSERVED] |
| About | `/about` modal (multi-tab content) | Nav dropdown placeholders (`href="#"`) | OLD has full content; NEW IA only | |
| Partner / Give | `/partner`, `/give` modals | Utility links + footer; forms on NEW download | Form styling and page shell differ | Partner form fields wired on OLD |
| Blog / Bible Online | Links in OLD header | Same utility links on NEW | Similar intent; styling differs | OLD `#blog` / app routes for store & bible-online |

## NEW has / OLD lacks

- Dedicated Features, Pricing, Download pages
- Product subpages (Web, Mobile, Desktop, Voice)
- Utility top bar (Support, KingsChat sign-in styling)
- Tri-color brand stripe under header
- TV promo block + inline video player pattern
- Monthly/yearly pricing toggle (UI)
- Skip link, mega-menu Products panel, card-lift hover system

## OLD has / NEW lacks

- Full-screen **splash** before site (app-level, not reference site)
- **10-slide marketing carousel** on home
- **Floating video player** (`videoplayer.tsx`) on landing
- Header **Store** nav item → `/store`
- **ProfileMenu** when logged in (`header.tsx`)
- **Contact** nav label (NEW uses Support in utility bar)
- Modal routing for About/Product/Give/Partner from dashboard (`main.tsx` background routes)
- Framer Motion scroll animations on feature rows [INFERRED from `features.tsx`]

## Cross-cutting visual themes [OBSERVED unless noted]

| Area | OLD | NEW |
|------|-----|-----|
| Header | Two stacked teal bars, white nav text | Utility navy bar + white main bar + orange/cyan stripe |
| Primary accent | Teal `#0299B4`, cyan underline `#3CF9FF` | Orange `#FF5900` pills, navy `#0B2F44` text |
| Background | Mostly white / `#f5f3f4` footer | Page `#F6FBFD`, mist `#EAF5F8` chips |
| Type | Tailwind defaults / `font-inter` in places | Montserrat scale, heavy display headings |
| Max width | `max-w-7xl` / `max-w-6xl` | `1200px` content columns |
