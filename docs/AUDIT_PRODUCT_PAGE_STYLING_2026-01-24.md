# Product Page Styling/Theming Audit (Mobile + Desktop)
Date: 2026-01-24

Scope:
- Product page route: `app/[locale]/[username]/[productSlug]/page.tsx`
- Store/product layout wrappers: `app/[locale]/[username]/layout.tsx`, `app/[locale]/[username]/[productSlug]/layout.tsx`
- Mobile PDP: `components/mobile/product/*`
- Desktop PDP: `components/shared/product/product-page-layout.tsx`, `components/desktop/product/*`
- Quick-view modal (desktop): `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`

Note: I could not find anything named “ultrathunk” in the repo (`rg -n "ultrathunk" -S .` returned no matches). I’m assuming you meant “ultrathink” (deep-dive) rather than a specific page/component.

---

## TL;DR (why styling looks “broken” / not themed)

1) **Mobile product page “surface/text” tokens are defined twice, and the hard-coded `@theme` values win**, so these classes don’t track the Twitter (shadcn) theme and don’t respond to `.dark` at all:
   - Mapping exists: `app/globals.css:286`–`app/globals.css:297` (e.g. `--color-surface-page: var(--surface-page)`).
   - But later **overrides** exist: `app/globals.css:590`–`app/globals.css:601` (e.g. `--color-surface-page: oklch(...)`).
   - Result: `bg-surface-*` / `text-text-*` on the PDP are effectively a **separate palette** (and ignore dark-mode overrides in `app/globals.css:193`+).

2) **Token name mismatch for “muted” text** makes the PDP drift further and breaks dark-mode correctness:
   - Light defines `--text-muted-alt`: `app/globals.css:108`.
   - Dark defines `--text-muted` (not `--text-muted-alt`): `app/globals.css:203`.
   - Theme bridge maps `--color-text-muted-alt`: `app/globals.css:296`, but the later theme block defines `--color-text-muted` (not `alt`): `app/globals.css:600`.
   - Result: PDP uses `text-text-muted-alt` in multiple places (e.g. `components/mobile/product/mobile-product-page.tsx:183`) but the “official” theme tokens don’t consistently define it.

3) **Typography on PDP description is not following our token-based richtext system**, and likely renders inconsistently:
   - We have a canonical `.richtext` style in `app/utilities.css` (token-based).
   - PDP uses `prose*` classes instead:
     - `components/mobile/product/mobile-specs-tabs.tsx:107`
     - `components/desktop/product/desktop-specs-accordion.tsx:116`

4) **Some PDP-only classes look like no-ops / drift**, leading to “broken polish”:
   - `scrollbar-none` is used but we only define `no-scrollbar` / `scrollbar-hide` in CSS:
     - `components/mobile/product/mobile-gallery-v2.tsx:182`
     - `components/desktop/product/desktop-gallery-v2.tsx:134`

5) **Layout spacing looks off on mobile**: we reserve bottom padding for a tab bar even when it’s hidden on product pages, *and* the PDP adds its own padding for the sticky buy bar:
   - Layout always adds: `pb-20` → `app/[locale]/(main)/layout.tsx:103`, `app/[locale]/[username]/layout.tsx:82`
   - Tab bar hides on PDP: `components/mobile/mobile-tab-bar.tsx:37` + `components/mobile/mobile-tab-bar.tsx:64`
   - PDP also adds: `pb-28` → `components/mobile/product/mobile-product-page.tsx:141`
   - Result: visible extra whitespace / “why is this so tall” feeling at the bottom.

---

## Tailwind Lane Phase 1 Audit — 2026-01-24

Ran:
- `pnpm -s styles:scan` → palette=0, gradient=0, arbitrary=0; hex only in expected places (`components/shared/filters/color-swatches.tsx`).

### Critical (blocks “Twitter theme” consistency)
- [ ] **Duplicate token source for PDP surfaces/text** → `app/globals.css:286`–`app/globals.css:297` vs `app/globals.css:590`–`app/globals.css:601` → Make PDP tokens derive from the shadcn/Twitter vars (and support `.dark`) by removing/rewiring the later overrides.
- [ ] **Muted text token mismatch (`text-muted` vs `text-muted-alt`)** → `app/globals.css:108`, `app/globals.css:203`, `app/globals.css:296`, `app/globals.css:600` → Standardize on one token name (prefer `text-muted-alt` per `docs/DESIGN.md`) and ensure it exists in both light+dark.

### High (visible “polish” regressions on PDP)
- [ ] **`scrollbar-none` doesn’t match our utilities** → `components/mobile/product/mobile-gallery-v2.tsx:182`, `components/desktop/product/desktop-gallery-v2.tsx:134` → Use `scrollbar-hide` (already supported) or add a canonical `scrollbar-none` utility.
- [ ] **`prose*` usage bypasses our tokenized rich text styling** → `components/mobile/product/mobile-specs-tabs.tsx:107`, `components/desktop/product/desktop-specs-accordion.tsx:116` → Use `.richtext` (from `app/utilities.css`) or explicitly install/standardize typography styling.

### Deferred (cleanup / consistency)
- [ ] **Border radius drift** (many `rounded-lg`/`rounded-xl` on PDP) → see hits like `components/shared/product/product-page-layout.tsx:229`, `components/desktop/product/desktop-buy-box-v2.tsx:172` → Align with `docs/DESIGN.md` (`rounded-md` for cards/containers, `rounded-full` for chips).

---

## Treido Audit — 2026-01-24 (PDP-specific UX/a11y/i18n drift)

### Critical (repo rails)
- [ ] **Hardcoded user strings (aria + empty states) inside PDP gallery** → `components/mobile/product/mobile-gallery-v2.tsx:100`, `components/mobile/product/mobile-gallery-v2.tsx:118`, `components/mobile/product/mobile-gallery-v2.tsx:130`, `components/mobile/product/mobile-gallery-v2.tsx:144`, `components/mobile/product/mobile-gallery-v2.tsx:243`, `components/mobile/product/mobile-gallery-v2.tsx:253` → Move to `next-intl` (`messages/en.json` + `messages/bg.json`).

### High
- [ ] **Condition badge color is always “new”** → `components/mobile/product/mobile-gallery-v2.tsx:160` → Map condition → semantic condition token (new/like new/good/fair) instead of always `bg-condition-new`.
- [ ] **Mobile bottom spacing duplication** (tab-bar padding + PDP buy bar padding) → `app/[locale]/(main)/layout.tsx:103`, `app/[locale]/[username]/layout.tsx:82`, `components/mobile/mobile-tab-bar.tsx:64`, `components/mobile/product/mobile-product-page.tsx:141` → Make padding conditional or move bottom-padding responsibility into the rendered bar.

---

## Suggested Fix Batches (small + verifiable)

1) **Theme/token correctness (fix the root cause)**
   - `app/globals.css`: remove or rewrite the later `--color-surface-*` / `--color-text-*` overrides so PDP tokens derive from `--surface-*` / `--text-*` and respect `.dark`.
   - Standardize on `--text-muted-alt` (and define it in `.dark`) or rename usage to match the chosen token.

2) **PDP polish**
   - Replace `scrollbar-none` → `scrollbar-hide` in `components/mobile/product/mobile-gallery-v2.tsx` and `components/desktop/product/desktop-gallery-v2.tsx`.
   - Replace `prose*` usage → `.richtext` (token-based) in PDP description rendering.

3) **Mobile spacing**
   - Reduce/remove `pb-20` on PDP where `MobileTabBar` is intentionally not rendered (or move the padding into a client wrapper that knows whether the bar is present).

