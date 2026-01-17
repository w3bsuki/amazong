# Audit Report — app/components/hooks/lib/i18n/messages/config/public

Scope: app/, components/, hooks/, lib/, i18n/, messages/, config/, public/

## Evidence sources
- codex/knip-report.md (unused files/exports)
- folder-inventory.md

## Suspected unused files (from knip)
app/[locale]/(main)/_components/more-ways-to-shop.tsx
app/[locale]/(main)/_components/promo-cards.tsx
app/[locale]/(main)/_components/sign-in-cta-skeleton.tsx
app/[locale]/(main)/demo/desktop/_components/desktop-breadcrumb-row.tsx
app/[locale]/(main)/demo/desktop/_components/marketplace-sidebar.tsx
app/[locale]/(main)/demo/desktop/_components/unified-desktop-feed-v3.tsx
app/[locale]/(main)/demo/desktop/_components/unified-desktop-feed.tsx
components/desktop/desktop-category-nav.tsx
components/desktop/desktop-category-rail.tsx
components/desktop/desktop-filter-tabs.tsx
components/desktop/desktop-hero-cta.tsx
components/desktop/hero-search.tsx
components/desktop/marketplace-hero.tsx
components/mobile/product/mobile-price-block.tsx
components/mobile/product/mobile-quick-specs.tsx
components/mobile/product/mobile-seller-trust-line.tsx
components/mobile/product/mobile-sticky-bar-enhanced.tsx
components/promo/promo-card.tsx
components/sections/index.ts
components/sections/newest-listings-section.tsx
components/sections/newest-listings.tsx
components/sections/sign-in-cta.tsx
components/shared/filters/control-bar.tsx
components/shared/filters/desktop-filter-sidebar.tsx
components/shared/filters/mobile-filters.tsx
components/shared/filters/quick-filter-chips.tsx
components/shared/filters/view-mode-toggle.tsx
components/shared/product/condition-badge.tsx
components/shared/trust-bar.tsx
components/ui/sidebar.tsx

## Unused exports (from knip)
components/mobile/category-nav/sticky-category-tabs.tsx: StickyCategoryTabs
components/providers/currency-context.tsx: useCurrency
lib/bulgarian-cities.ts: getCityLabel
lib/env.ts: getStripePublishableKey
lib/env.ts: getStripeWebhookSecret

## Public assets audit (needs grep confirmation)
Suspected unused .jpg duplicates where .png versions exist:
public/abstract-beauty.jpg
public/colorful-toy-collection.jpg
public/cozy-cabin-interior.jpg
public/diverse-fashion-collection.jpg
public/diverse-people-listening-headphones.jpg
public/modern-smartphone.jpg
public/retro-living-room-tv.jpg
public/vintage-camera-still-life.jpg

Possible unused placeholders (verify by grep):
public/placeholder.jpg
public/placeholder-user.jpg

## Risky deletions (verify before removal)
- Any demo routes under app/[locale]/(main)/demo/** and app/[locale]/(demo)/** (may be used for internal demos)
- Any locale message files in messages/

## Next steps
1) Confirm each knip unused file via repo-wide grep.
2) Confirm public asset references via grep against app/, components/, config/.
3) Remove confirmed-unused items in a single batch.
4) Re-run Typecheck + E2E smoke.
