# Parity fix plan (from `06-parity-report.md`)

Collapsed **335** register rows → **8** root-cause groups (ignore image-filename false positives P-005, P-048, etc.; ignore per-viewport duplicates; ignore `fontFamily` stack noise P-006/009/…).

| Group | Representative P-IDs | Cause | Primary files | Effort |
|-------|---------------------|-------|---------------|--------|
| G1 Hero typography | P-010–P-012, P-021–P-023, P-053–P-055, … | Shared hero uses `text-[56px]` + `text-brand-navy`; reference uses **68px/60px** and **brand-blue** (`#19688B`) on h1 | `tailwind.config.js`, `PageHero.tsx`, `landingPage.tsx` | S |
| G2 Bottom CTA bands | P-039, P-040, pricing download h2 | Features/pricing missing shared **platform + download** closing sections present on home | `WebsiteMarketingClosing.tsx` (new), `featuresPage.tsx`, `pricingPage.tsx`, `landingPage.tsx` | M |
| G3 Product platform sections | products_web/mobile/desktop/voice section gaps | Missing **What you get**, **Also available on**, web **Install once…** h2 blocks | `productPlatformPage.tsx`, shared section helpers | M |
| G4 Download IA | download missing device/support h2 | Device rows and support copy use different heading text/structure vs reference | `downloadPage.tsx` | M |
| G5 Header position | P-008, P-019, P-030, … | React `fixed` vs reference `sticky` | `header.tsx`, `website.css` if needed | S |
| G6 Footer shell | P-001–P-004, P-013–P-016, … | Footer **white** shell vs reference **navy** band; column title casing | `footer.tsx` | M |
| G7 Feature copy (optional) | P-045–P-047 | Short home-style blurbs missing on features page body | `websiteFeaturesData.tsx` / home cards | S |
| G8 Image count | pricing/features img count | Store badges + platform art not rendered on inner pages | `WebsiteMarketingClosing.tsx`, `featuresPage` hero/nav | S |

**Intentionally unchanged:** `[PRICE]` placeholders; modal routes; ProfileMenu; Partner/Give handlers; Store/Contact URLs; webpack image filenames.

## Verification tally (after fixes)

| Metric | Before (06) | After (re-measure @1440, SPA nav) |
|--------|-------------|-------------------------------------|
| Pages section-order full match | 1/8 | **6/8** (features, pricing, download, products_web/mobile; home false negative on cold splash) |
| Pages partial | 7/8 | **2/8** |
| Hero h1 | 56px navy | **60px brand-blue** on PageHero pages [MEASURED] |
| Header | fixed | **sticky** [MEASURED on /features] |
| Register P-items | 335 | **201** (style repeats; ignore filename rows) |

**Left unchanged:** `[PRICE]`; modals; ProfileMenu; Partner/Give; Store/Contact URLs; webpack filenames.

**Blockers:** Home automated extract still hits splash on cold load; pixel diff n/a (no Pillow). `06-parity-report.md` regenerated locally during spot-check — use `07` as fix source of truth.

## Hover on dark surfaces (commit `1e7767c`)

- **Reference [grep styles.css]:** default `a:hover` → navy; `.btn-lift:hover` → lift + brightness; `focus-visible` → orange outline; utility/footer links stay readable on dark bars.
- **Root cause:** Bootstrap Reboot (via global `tw-elements`) retargets `--bs-link-color-rgb` on `a:hover`, overriding Tailwind `text-*` on marketing links.
- **Fix:** `.website-root` hover rules in `website.css`; explicit `hover:text-*` on `WebsiteButton`, utility bar, footer, CTA bands.

## Link hover leak (commit `93582e0`)

- **Root cause:** Bootstrap Reboot `a:hover { --bs-link-color-rgb: var(--bs-link-hover-color-rgb) }` plus global `reference.css` `a:hover { navy }` overriding explicit token link colors in the React bundle only.
- **Fix:** Unset `--bs-link-*` on `.website-root a`/`:hover` in `website-isolation.css`; restore token hover colors with higher-specificity selectors (utility, CTAs, cards, footer).
- **Verify:** `C:/temp/parity/hover-measure.mjs` (CDP hover, 300ms settle); home/pricing compare gates unchanged @1440.
