# Stage 2 — Codebase discrepancies (website UI)

Generated: 2026-11-01  
Scope: `src/screens/Website/**` vs read-only `ROR_Bible_Plus_Website/**`

## Design tokens (extracted)

| Token | NEW (`css/styles.css`) | OLD (Website TSX / Tailwind) |
|-------|------------------------|------------------------------|
| Cyan | `#07BDD2` (`--cyan`) | `#3CF9FF` accent underline only |
| Teal | `#099DB2` | `#0299B4` nav bar |
| Blue | `#19688B` | `#18668D` logo bar (close, not identical) |
| Navy | `#0B2F44` (`--navy`) | Rare; body text often black/gray |
| Orange | `#FF5900` | Not used in Website header/CTAs |
| Page BG | `#F6FBFD` (`--pale`) | White / default |
| Mist | `#EAF5F8` | Ad hoc grays |
| Ink | `#3D5566` | `#666`, `#333`, `#202020` |
| Font | Montserrat 400–800 (self-hosted woff) | `font-inter`, default sans; `montserrat` in tailwind config but unused in Website grep sample |
| Container | `max-width: 1200px`, `padding: 32px` | `max-w-7xl`, mixed `px-4` / `md:mx-[3.5rem]` |
| Radii | `999px` pills, `16–32px` cards | `rounded-[4px]` forms, `rounded-full` some chips |
| Shadows | Orange/glow + navy card shadows | Lighter `shadow-md` on dropdowns |
| Breakpoints | `1100`, `980`, `720` px max | Tailwind `extend.screens` uses **max-width** names (`mobile`, `tablet`, etc.) — different model |
| Motion | CSS `.25s` lifts; `prefers-reduced-motion` | Framer Motion in `features.tsx` |
| Focus | Orange 3px outline | Not consistently styled |

## Assets

| Area | NEW | OLD |
|------|-----|-----|
| Logo | `images/ror-bible-plus-icon.png` + text lockup | `assets/website/logo.png` raster in header |
| Hero | `hero-ipad-reader.jpg` | Carousel PNG/JPG set in `landingPage.tsx` |
| Features | `feature-01`…`10` JPGs | `Features/feature1.png`…`feature5.png` |
| Store badges | loveworld / play / app store PNGs | `downloadBanner*.png` |
| Fonts | `ROR_Bible_Plus_Website/fonts/*.woff` | No Website-local Montserrat faces |

## Styling approach

| NEW | OLD |
|-----|-----|
| Single `styles.css` (~380 lines), hashed utility class names | React + Tailwind classes inline per component |
| Vanilla JS interactions (`js/main.js`) | React state (`sideNav`, Recoil `activeNavAtom`, react-router) |

---

## Discrepancy register

| ID | Page/Area | Old | New | Files involved | Effort | Risk | Recommendation |
|----|-----------|-----|-----|----------------|--------|------|----------------|
| U-001 | Global tokens | Ad hoc hex in TSX | CSS variables in `:root` | `tailwind.config.js`, new `Website` theme SCSS or CSS module, `styles.css` ref | M | Low | CHANGE |
| U-002 | Typography | Inter/default | Montserrat scale | Copy woff to `public/` (no npm dep), `@font-face` + tailwind `font-montserrat`, Website components | M | Low | CHANGE |
| U-003 | Page background | White | `#F6FBFD` | `landingPage.tsx`, `about.tsx`, etc. | S | Low | CHANGE |
| U-004 | Header shell | 2-row teal header | Utility bar + white main + tri-stripe | `header.tsx`, possibly shared `WebsiteLayout` | L | Med | CHANGE |
| U-005 | Logo lockup | Image-only top row | Icon + “ROR Bible+” + “Premium Bible Reader” | `header.tsx`, assets | M | Low | CHANGE |
| U-006 | Primary nav IA | About, Products, **Store**, Bible Online, Blog, Partner, Give, **Contact** | Features, Products▾, Pricing, Download, About▾; utility Support | `header.tsx`, `sideNav.tsx`, `navigation/routes.ts` (paths unchanged) | M | **High** | ASK (Store/Contact vs new IA) |
| U-007 | Products menu | Opens `/product` modal | Mega-menu + links to web/mobile/desktop/voice | `header.tsx`, `product.tsx`, new route shells | L | Med | CHANGE |
| U-008 | Header CTA | None | Orange “Get the app” pill | `header.tsx` | S | Low | CHANGE |
| U-009 | Utility bar | Absent | Bible Online, Blog, Partner, Give, Support, KingsChat | `header.tsx` | M | Med | CHANGE |
| U-010 | Sticky scroll | Fixed header, no shadow | `.site-header.is-scrolled` shadow | `header.tsx` + small hook/CSS | S | Low | CHANGE |
| U-011 | Home hero | Full-width carousel | Split hero + iPad + orange accent type | `landingPage.tsx`, `carousel.tsx` | L | Med | ASK (keep carousel below hero?) |
| U-012 | Home TV promo | Floating `videoplayer.tsx` | Poster + `<video>` section `#promo` | `landingPage.tsx`, `videoplayer.tsx` | M | Med | CHANGE |
| U-013 | Home features teaser | 5 alternating rows | Card grid + “See all features” | `features.tsx`, `landingPage.tsx` | M | Low | CHANGE |
| U-014 | Features page | None | `features.html` content | New `screens/Website/featuresPage.tsx` + route in `main.tsx` | L | Med | CHANGE |
| U-015 | Pricing page | None | Plans + toggle + FAQ | New page + route; UI-only toggle | L | **High** | ASK (prices, links to store/checkout) |
| U-016 | Download page | Footer/banners only | `download.html` + form | New page + route; form UI only | L | Med | CHANGE |
| U-017 | Product landings | Single `product.tsx` | `web/mobile/desktop/voice.html` | New pages or tabs; reuse `featureProduct.tsx` patterns | L | Med | CHANGE |
| U-018 | Buttons | Teal/gray ad hoc | Orange fill + blue outline pills | Shared `WebsiteButton` components | M | Low | CHANGE |
| U-019 | Cards/sections | Flat | `card-lift` hover shadows | Website section wrappers | M | Low | CHANGE |
| U-020 | Focus/accessibility | Partial | Orange focus-visible rings | Website interactive elements | S | Low | CHANGE |
| U-021 | Mobile nav | `sideNav.tsx` drawer | `#mobile-menu` pattern | `sideNav.tsx`, `header.tsx` | M | Med | CHANGE |
| U-022 | Breakpoints | Tailwind max-* custom | 720/980/1100 | Align responsive classes to new breakpoints | M | Med | CHANGE |
| U-023 | Motion | Framer Motion feature slides | CSS transitions / reduced-motion | `features.tsx` | S | Low | ASK |
| U-024 | About UI | `about.tsx` modal layout | About dropdown targets (Mission, Stories, …) | `about.tsx`, `featuresAbout.tsx` | L | Med | CHANGE |
| U-025 | Partner UI | `partner.tsx` form styling | Match new form visual system | `partner.tsx`, `partnerPhoneInput.css` | M | Med | CHANGE |
| U-026 | Give UI | `give.tsx` | Match new marketing style | `give.tsx` | M | Low | CHANGE |
| U-027 | Footer | `#f5f3f4` multi-column | New footer typography/colors/spacing | `footer.tsx` | M | Low | CHANGE |
| U-028 | Imagery | Legacy banners | New JPG/PNG set | `assets/website/**`, imports in pages | M | Low | ASK (replace all vs hero only) |
| U-029 | Splash screen | 7s app splash on every load | None on reference | `App.tsx` | S | Low | KEEP (out of Website folder; app shell) |
| U-030 | Logged-in header | `ProfileMenu` in header | Not in reference | `header.tsx` | S | Med | KEEP |
| U-031 | Modal routes | Background `Routes` for About/Product/Give/Partner | N/A | `main.tsx`, page `isModal` props | — | **High** | KEEP |
| U-032 | Dev/build overlay | TS2307 missing `product_Details.` | N/A | `main.tsx`, `Workspace/index.tsx` | — | Med | ASK (blocks clean QA; not UI but affects verification) |

### Recommendation counts

| Recommendation | Count |
|----------------|------:|
| CHANGE | 24 |
| KEEP | 3 |
| ASK | 5 |

---

## Proposed DO-NOT-TOUCH list (pending your approval)

| Item | Reason |
|------|--------|
| Route paths `/`, `/home`, `/about`, `/product`, `/give`, `/partner` and modal `backgroundLocation` pattern in `main.tsx` | Working navigation contract with dashboard |
| `navigate(..., { state: { backgroundLocation } })` in `header.tsx` | Modal UX for in-app users |
| `activeNavAtom` + underline logic | State wiring tied to existing UX |
| `useUser` / `ProfileMenu` in header | Auth-aware UI not shown on static reference |
| Partner/Give **form submission** handlers and payment hooks | Business logic |
| Links to `/store`, `/bible-online`, `/login` targets | App integration (style may change, URLs should not) |

---

## Questions for me

1. **Git:** No repo detected. Should I `git init` + branch `ui-upgrade`, or only backup `src/screens/Website` before Stage 3?
2. **Nav IA:** OLD header includes **Store** and **Contact**; NEW reference uses **Pricing**, **Download**, **Features**, and **Support**. Which items must remain in the upgraded header?
3. **Home hero:** Replace carousel entirely, or keep carousel as a secondary band below the new hero?
4. **Pricing:** Use placeholder `[PRICE]` copy like the reference, or connect to existing store/subscription UI (would touch non-UI)?
5. **New routes:** OK to add routes (e.g. `/features`, `/pricing`, `/download`, `/products/web`) in `main.tsx` for parity with HTML pages?
6. **Assets:** Swap all Website imagery to the NEW `images/` set, or only brand/header/hero?
7. **Framer Motion:** Remove from Website features section for CSS-only motion to match NEW site?
8. **TS2307 `product_Details.` import:** Allow a one-line path fix (non-UI) so dev server runs without overlay during UI QA?

---

## Gate 1 — awaiting approval

Do **not** edit `src/` until you reply.
