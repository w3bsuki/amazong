# Opus Remove — Deletion Candidates

Files and patterns that should be removed. Each item has evidence and verification steps.

---

## Removal Tiers

- **Tier 1**: Safe deletions (Knip confirmed unused, zero imports)
- **Tier 2**: Probable deletions (low/no usage, verify routes first)
- **Tier 3**: Consolidation candidates (duplicate implementations)
- **Tier 4**: Demo surfaces (decide post-launch)

---

## Tier 1: Safe Deletions (49 files from Knip)

### Config Files (2)
```
config/mega-menu-config.ts
config/subcategory-images.ts
```

### Desktop Components (6)
```
components/desktop/desktop-category-nav.tsx
components/desktop/desktop-category-rail.tsx
components/desktop/desktop-filter-tabs.tsx
components/desktop/desktop-hero-cta.tsx
components/desktop/hero-search.tsx
components/desktop/marketplace-hero.tsx
```

### Desktop Product (1)
```
components/desktop/product/index.ts
```

### Mobile Product (13)
```
components/mobile/product/index.ts
components/mobile/product/mobile-bottom-bar.tsx
components/mobile/product/mobile-buyer-protection-badge.tsx
components/mobile/product/mobile-description-section.tsx
components/mobile/product/mobile-details-section.tsx
components/mobile/product/mobile-gallery-olx.tsx
components/mobile/product/mobile-hero-specs.tsx
components/mobile/product/mobile-price-block.tsx
components/mobile/product/mobile-price-location-block.tsx
components/mobile/product/mobile-quick-specs.tsx
components/mobile/product/mobile-seller-card.tsx
components/mobile/product/mobile-seller-trust-line.tsx
components/mobile/product/mobile-sticky-bar-enhanced.tsx
components/mobile/product/mobile-trust-block.tsx
components/mobile/product/mobile-urgency-banner.tsx
```

### Layout (1)
```
components/layout/header/site-header-unified.tsx
```

### Promo (1)
```
components/promo/promo-card.tsx
```

### Sections (4)
```
components/sections/index.ts
components/sections/newest-listings-section.tsx
components/sections/newest-listings.tsx
components/sections/sign-in-cta.tsx
```

### Shared Filters (5)
```
components/shared/filters/control-bar.tsx
components/shared/filters/desktop-filter-sidebar.tsx
components/shared/filters/mobile-filters.tsx
components/shared/filters/quick-filter-chips.tsx
components/shared/filters/view-mode-toggle.tsx
```

### Shared Product (7)
```
components/shared/product/condition-badge.tsx
components/shared/product/item-specifics.tsx
components/shared/product/magnifier.tsx
components/shared/product/product-buy-box.tsx
components/shared/product/product-gallery-hybrid.tsx
components/shared/product/seller-banner.tsx
components/shared/product/sellers-note.tsx
```

### Shared Trust (1)
```
components/shared/trust-bar.tsx
```

### App Components (4)
```
app/[locale]/(main)/_components/more-ways-to-shop.tsx
app/[locale]/(main)/_components/promo-cards.tsx
app/[locale]/(main)/_components/sign-in-cta-skeleton.tsx
app/[locale]/(main)/cart/_components/mobile-cart-header.tsx
```

### Docs Site (2)
```
docs-site/.next/types/cache-life.d.ts
docs-site/.next/types/routes.d.ts
```

---

## Tier 2: Probable Deletions (Verify First)

### Unused Dependencies
```json
// package.json - remove after verifying no usage
"@capacitor/android": "^6.2.0",
"@capacitor/core": "^6.2.0"
```

### Unused Exports (Clean Up)
```typescript
// lib/supabase/database.types.ts
// Remove from exports (auto-generated, keep type definitions):
// - Constants, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes

// lib/env.ts
// - getStripeWebhookSecret (if unused)
// - getStripePublishableKey (if unused)

// lib/analytics-drawer.ts
// - trackDrawerCta
// - trackDrawerConversion  
// - getSessionDrawerMetrics

// lib/bulgarian-cities.ts
// - getCityLabel

// lib/feature-flags.ts
// - getFeatureFlags
```

---

## Tier 3: Consolidation Candidates

### Header Variants → Single Adaptive Header
Currently 7+ header variants. Target: 1 primary + 2 specialized.

**Keep**:
```
components/layout/header/app-header.tsx         # Primary adaptive
components/layout/header/minimal-header.tsx     # Checkout/auth
components/layout/header/dashboard-header.tsx   # Dashboard
```

**Consolidate/Remove**:
```
components/layout/header/mobile/default-header.tsx      → merge to app-header
components/layout/header/mobile/homepage-header.tsx     → merge to app-header
components/layout/header/mobile/contextual-header.tsx   → merge to app-header
components/layout/header/mobile/product-header.tsx      → merge to app-header
components/layout/header/mobile/minimal-header.tsx      → use root minimal
components/layout/header/desktop/standard-header.tsx    → merge to app-header
components/layout/header/desktop/minimal-header.tsx     → use root minimal
```

### Filter Implementations → Single FilterHub
Currently 14 filter files. Target: 3-4 files.

**Keep**:
```
components/shared/filters/filter-hub.tsx       # Main modal
components/shared/filters/filter-chips.tsx     # Quick chips
components/shared/filters/filter-list.tsx      # List rendering
components/shared/filters/price-slider.tsx     # Price input
components/shared/filters/sort-modal.tsx       # Sort options
```

**Remove** (already in Tier 1):
```
control-bar.tsx, desktop-filter-sidebar.tsx, mobile-filters.tsx,
quick-filter-chips.tsx, view-mode-toggle.tsx
```

### Sidebar Versions → Single Implementation
```
components/layout/sidebar/sidebar.tsx          # 700 LOC
components/layout/sidebar/sidebar-menu-v2.tsx  # 511 LOC
```
Verify which is active, delete the other.

---

## Tier 4: Demo Surfaces (32+ files)

**Decision needed**: Delete post-launch or keep for internal testing?

### Root Demo (`app/demo/`)
```
app/demo/page.tsx
app/demo/sell2/page.tsx               # 1077 LOC — largest
app/demo/sell6/page.tsx
app/demo/product-desktop/page.tsx
app/demo/product-desktop2/page.tsx
app/demo/product-desktop3/page.tsx
app/demo/product-mobile2/page.tsx
app/demo/product-mobile3/page.tsx
```

### Locale Demo (`app/[locale]/demo/`)
```
app/[locale]/demo/layout.tsx
app/[locale]/demo/page.tsx
app/[locale]/demo/product-adaptive/
app/[locale]/demo/product-desktop/
app/[locale]/demo/product-desktop2/
app/[locale]/demo/product-desktop3/
app/[locale]/demo/product-mobile/
app/[locale]/demo/product-mobile2/
app/[locale]/demo/product-mobile3/
app/[locale]/demo/sell/
app/[locale]/demo/sell2/
app/[locale]/demo/sell3/
app/[locale]/demo/sell4/
app/[locale]/demo/sell5/
app/[locale]/demo/sell6/
app/[locale]/demo/sell7/
```

**Impact of keeping**:
- Styling violations (arbitrary values, hardcoded colors)
- Increased bundle size
- Maintenance burden

**Impact of deleting**:
- Lose internal testing surfaces
- Need alternative way to prototype UI changes

---

## Verification Before Deletion

### Step 1: Run Knip Verification
```bash
pnpm knip --reporter json > knip-verify.json
```

### Step 2: Search for Imports
```bash
# For each file, verify zero imports
grep -r "from.*filename" --include="*.tsx" --include="*.ts" .
```

### Step 3: Check Route Usage
```bash
# Verify no dynamic imports
grep -r "dynamic.*import.*filename" --include="*.tsx" .
```

### Step 4: Test After Deletion
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Deletion Script Template

```bash
#!/bin/bash
# Safe deletion of Tier 1 files

# Desktop unused
rm components/desktop/desktop-category-nav.tsx
rm components/desktop/desktop-category-rail.tsx
rm components/desktop/desktop-filter-tabs.tsx
rm components/desktop/desktop-hero-cta.tsx
rm components/desktop/hero-search.tsx
rm components/desktop/marketplace-hero.tsx
rm components/desktop/product/index.ts

# Mobile product unused (entire folder)
rm -rf components/mobile/product/

# Layout unused
rm components/layout/header/site-header-unified.tsx

# Continue with other Tier 1 files...

# Verify
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

## Anti-Patterns to Avoid

1. **Don't delete without verification** — Always check imports first
2. **Don't batch too many deletions** — Delete in groups of 5-10 files, verify after each
3. **Don't delete shared code without checking all route groups**
4. **Don't delete providers without checking context consumers**
5. **Don't remove types/interfaces if they're exported from barrels**
