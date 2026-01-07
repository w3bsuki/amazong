# Design System Status - Baseline Audit

> **Generated**: 2026-01-07
> **Agent**: AGENT-0 (Foundation)
> **Status**: ✅ Audit Complete - Ready for Parallel Agents

---

## 📊 Executive Summary

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Gradient violations | 13 | 0 | 🔴 Needs fix |
| Arbitrary values | 189 | < 20 | 🔴 Needs fix |
| Palette violations | 0 | 0 | ✅ Clean |
| Hex color violations | 1 | 0 | 🟡 Minor |
| OKLCH inline violations | 0 | 0 | ✅ Clean |
| Dark mode token parity | ~95% | 100% | 🟡 Minor gaps |

---

## ✅ Phase 1: Token Inventory - COMPLETE

### Typography Tokens ✅

| Token | Value | Purpose |
|-------|-------|---------|
| `--text-tiny` | 0.6875rem (11px) | Legal, helper, micro text |
| `--text-body` | 0.875rem (14px) | Standard body text |
| `--text-price` | 1rem (16px) | Price emphasis |
| `--font-size-2xs` | 0.625rem (10px) | Badges, tiny labels |
| `--letter-spacing-tight` | -0.01em | Tight tracking |
| `--letter-spacing-normal` | 0 | Normal tracking |
| `--letter-spacing-wide` | 0.01em | Wide tracking |
| `--letter-spacing-wider` | 0.02em | Wider tracking |

**Note for Agent-1**: Use Tailwind's built-in scale (`text-xs`, `text-sm`, `text-base`) and these semantic tokens. Custom `text-2xs` class available for 10px text.

### Spacing Tokens ✅

| Token | Value | Purpose |
|-------|-------|---------|
| `--spacing-touch-xs` | 1.5rem (24px) | Minimum touch (inline icons) |
| `--spacing-touch-sm` | 1.75rem (28px) | Compact buttons |
| `--spacing-touch` | 2rem (32px) | Standard touch target |
| `--spacing-touch-lg` | 2.25rem (36px) | Primary CTA |
| `--page-inset` | 0.5rem (8px) | Mobile edge padding |
| `--page-inset-md` | 0.75rem (12px) | Tablet edge padding |
| `--page-inset-lg` | 1rem (16px) | Desktop edge padding |
| `--spacing-form` | 1rem (16px) | Form element spacing |
| `--spacing-section` | 1.5rem (24px) | Section spacing |
| `--category-circle-mobile` | 3.25rem (52px) | Mobile category circles |

**Note for Agent-2**: Touch target utilities available: `h-touch`, `min-h-touch`, `h-touch-xs`, `h-touch-sm`, `h-touch-lg`. Use gap-2 (mobile), gap-3 (desktop).

### Container Tokens ✅

| Token | Value | Purpose |
|-------|-------|---------|
| `--container-3xs` | 16rem (256px) | Tiny containers |
| `--container-2xs` | 18rem (288px) | Extra small |
| `--container-xs` | 20rem (320px) | Small |
| `--container-gallery` | 36rem (576px) | Product gallery |
| `--container-header-content` | 72rem (1152px) | Header content |
| `--container-dropdown-sm` | 22rem (352px) | Compact dropdowns |
| `--container-dropdown` | 24rem (384px) | Standard dropdowns |
| `--container-dropdown-lg` | 35rem (560px) | Large dropdowns |
| `--container-modal-sm` | 25rem (400px) | Compact modals |
| `--container-modal` | 35rem (560px) | Standard modals |
| `--container-modal-lg` | 56.25rem (900px) | Large modals |

**Note for Agent-2**: Use these tokens instead of arbitrary widths like `w-[560px]`.

### Scroll Area Tokens ✅

| Token | Value | Purpose |
|-------|-------|---------|
| `--spacing-scroll-sm` | 11.25rem (180px) | Compact scroll |
| `--spacing-scroll-md` | 18.75rem (300px) | Standard scroll |
| `--spacing-scroll-lg` | 25rem (400px) | Large scroll |
| `--spacing-scroll-xl` | 31.25rem (500px) | Extra large scroll |
| `--dialog-max-h` | 90dvh | Default dialog |
| `--dialog-max-h-sm` | 75dvh | Compact dialog |
| `--dialog-max-h-lg` | 95dvh | Full-screen dialog |

### Radius Tokens ✅

| Token | Value | Purpose |
|-------|-------|---------|
| `--radius-none` | 0 | No rounding |
| `--radius-xs` | 0.0625rem (1px) | Extra small |
| `--radius-sm` | 0.125rem (2px) | Small |
| `--radius-md` | 0.25rem (4px) | Medium |
| `--radius-lg` | 0.375rem (6px) | Large |
| `--radius-xl` | 0.5rem (8px) | Extra large |
| `--radius-2xl` | 0.75rem (12px) | 2x large |
| `--radius-pill` | 9999px | Pill shape |
| `--radius-full` | 9999px | Full circle |

**Note for Agent-3**: Maximum radius for cards is `rounded-md`. No heavy shadows.

### Shadow Tokens ✅ (Flat Marketplace Style)

| Token | Value | Notes |
|-------|-------|-------|
| `--shadow-2xs` | none | Disabled |
| `--shadow-xs` | none | Disabled |
| `--shadow-sm` | 0 1px 2px 0 hsl(0 0% 0% / 0.05) | Minimal |
| `--shadow-md` | 0 2px 4px 0 hsl(0 0% 0% / 0.08) | Light |
| `--shadow-lg` | 0 2px 4px 0 hsl(0 0% 0% / 0.08) | Same as md |
| `--shadow-xl` | 0 2px 4px 0 hsl(0 0% 0% / 0.08) | Same as md |
| `--shadow-2xl` | 0 2px 4px 0 hsl(0 0% 0% / 0.10) | Slightly more |
| `--shadow-dropdown` | 0 2px 4px 0 hsl(0 0% 0% / 0.10) | Dropdowns |
| `--shadow-modal` | 0 4px 8px 0 hsl(0 0% 0% / 0.12) | Modals |
| `--shadow-product` | none | Product cards |
| `--shadow-product-hover` | none | Product hover |

**Note for Agent-3**: This is intentional flat marketplace styling. Do not add heavy shadows.

### Color Tokens ✅

**Shadcn-Compatible (Light Mode)**:
- `--color-background`, `--color-foreground`
- `--color-card`, `--color-card-foreground`
- `--color-popover`, `--color-popover-foreground`
- `--color-primary`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-foreground`
- `--color-muted`, `--color-muted-foreground`
- `--color-accent`, `--color-accent-foreground`
- `--color-destructive`, `--color-destructive-foreground`
- `--color-border`, `--color-input`, `--color-ring`

**Marketplace Semantic Colors**:
- `--color-brand`, `--color-brand-light`, `--color-brand-dark`, `--color-brand-muted`
- `--color-cta-primary`, `--color-cta-trust-blue`, `--color-cta-secondary`
- `--color-price-regular`, `--color-price-sale`, `--color-price-original`, `--color-price-savings`
- `--color-deal`, `--color-deal-light`, `--color-deal-badge`
- `--color-stock-available`, `--color-stock-low`, `--color-stock-out`, `--color-stock-urgent-*`
- `--color-urgency-*` (stock, sale, viewers, hot variants)
- `--color-shipping-free`, `--color-shipping-express`
- `--color-verified`, `--color-top-rated`, `--color-rating`
- `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- `--color-header-*`, `--color-footer-*`, `--color-sidebar-*`
- `--color-product-card-*`, `--color-seller-card-*`
- `--color-form-section-*`, `--color-account-*`
- `--color-social-*` (instagram, tiktok, youtube, twitter, generic)

---

## ✅ Phase 2: Dark Mode Parity Check

### Verified Dark Mode Tokens ✅

All critical tokens have dark mode overrides in `.dark {}`:

- ✅ Shadcn core tokens (background, foreground, card, popover, primary, etc.)
- ✅ Semantic status colors (success, warning, error, info)
- ✅ Brand colors (brand, brand-light, brand-dark)
- ✅ CTA tokens (cta-primary, cta-trust-blue, cta-secondary)
- ✅ Header/subheader tokens
- ✅ Interactive tokens
- ✅ Filter tokens
- ✅ Product card tokens
- ✅ Seller card tokens
- ✅ Category badge tokens
- ✅ Professional badge tokens (condition, shipping, stock)
- ✅ Product container tokens
- ✅ Shadows (dropdown, modal, product)
- ✅ Form section tokens
- ✅ Account dashboard tokens
- ✅ Discount badge tokens
- ✅ Urgency banner tokens (all 4 variants)
- ✅ Sidebar tokens (HSL-based)

### Minor Dark Mode Gaps

The following tokens are defined in light mode but inherit/use refs in dark mode (acceptable):

- `--color-canvas-default` → Uses refs
- `--color-surface-card` → Uses refs
- `--color-order-*` → Uses status color refs

**Status**: No critical dark mode gaps found.

---

## 🔴 Phase 3: Gradient Violations (13 Total)

### Files with Gradients to Fix

| File | Count | Priority |
|------|-------|----------|
| [wishlist-page-client.tsx](../app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx) | 3 | High |
| [toast.tsx](../components/ui/toast.tsx) | 3 | High |
| [page.tsx](../app/[locale]/(main)/page.tsx) | 1 | High |
| [wishlist/shared/[token]/page.tsx](../app/[locale]/(main)/wishlist/shared/[token]/page.tsx) | 1 | Medium |
| [wishlist/[token]/page.tsx](../app/[locale]/(main)/wishlist/[token]/page.tsx) | 1 | Medium |
| [desktop-layout.tsx](../app/[locale]/(sell)/_components/layouts/desktop-layout.tsx) | 1 | High |
| [cookie-consent.tsx](../components/layout/cookie-consent.tsx) | 1 | Medium |
| [start-selling-banner.tsx](../components/sections/start-selling-banner.tsx) | 1 | Medium |
| [mobile-filters.tsx](../components/shared/filters/mobile-filters.tsx) | 1 | Medium |

### Gradient Replacement Guide (for Agent-3)

```tsx
// ❌ BAD - gradient
className="bg-gradient-to-r from-blue-500 to-blue-600"

// ✅ GOOD - solid semantic token
className="bg-cta-trust-blue"
// or
className="bg-primary"
// or  
className="bg-brand"
```

---

## 🔴 Phase 4: Arbitrary Value Violations (189 Total)

### Top Offenders (6 arbitrary values each)

| File | Count | Agent |
|------|-------|-------|
| [products-table.tsx](../app/[locale]/(business)/_components/products-table.tsx) | 6 | Agent-2 |
| [chat/loading.tsx](../app/[locale]/(chat)/chat/loading.tsx) | 6 | Agent-2 |
| [sidebar.tsx](../components/layout/sidebar/sidebar.tsx) | 6 | Agent-2 |
| [plan-card.tsx](../components/pricing/plan-card.tsx) | 6 | Agent-1/2 |
| [sidebar-menu.tsx](../components/layout/sidebar/sidebar-menu.tsx) | 5 | Agent-2 |
| [drawer.tsx](../components/ui/drawer.tsx) | 5 | Agent-2 |

### Arbitrary Value Replacement Guide

| Pattern | Replace With |
|---------|-------------|
| `w-[560px]` | `w-(--container-modal)` (35rem) |
| `w-[400px]` | `w-(--container-modal-sm)` (25rem) |
| `w-[352px]` | `w-(--container-dropdown-sm)` (22rem) |
| `w-[384px]` | `w-(--container-dropdown)` (24rem) |
| `max-w-[300px]` | `max-w-(--spacing-scroll-md)` |
| `h-[42px]` | `h-10` (40px) or `h-11` (44px) |
| `h-[36px]` | `h-touch-lg` (36px) |
| `h-[32px]` | `h-touch` (32px) |
| `h-[28px]` | `h-touch-sm` (28px) |
| `h-[24px]` | `h-touch-xs` (24px) |
| `text-[13px]` | `text-sm` (14px) |
| `text-[11px]` | `text-xs` (12px) or `text-tiny` |
| `text-[10px]` | `text-2xs` (10px) |
| `gap-[6px]` | `gap-1.5` (6px) |
| `gap-[8px]` | `gap-2` (8px) |
| `p-[6px]` | `p-1.5` |
| `rounded-[4px]` | `rounded-md` (4px) |
| `rounded-[8px]` | `rounded-xl` (8px) |

---

## 📋 Reference Sheets for Parallel Agents

### Typography Reference (Agent-1)

```
Tiny badges:     text-2xs (10px)
Meta/caption:    text-xs (12px)
Body text:       text-sm (14px) ← Default
Prices:          text-base (16px) font-semibold
Section titles:  text-lg (18px)
Page titles:     text-xl (20px)
Hero titles:     text-2xl (24px)

Font weights:
- Body: font-normal (400)
- Emphasis: font-medium (500)
- Strong: font-semibold (600)
- Prices: font-semibold (600)
- Headings: font-semibold (600)

Line heights:
- Tight: leading-tight (1.25)
- Snug: leading-snug (1.375)
- Normal: leading-normal (1.5)
- Use text-* classes which include line-height
```

### Spacing Reference (Agent-2)

```
Micro:          gap-0.5 (2px), gap-1 (4px)
Mobile gap:     gap-2 (8px)
Desktop gap:    gap-3 (12px)
Section gap:    gap-4 (16px) to gap-6 (24px)

Card padding:   p-2 (mobile), p-3 (desktop)
Section:        py-6 (24px) or py-8 (32px)

Touch targets:
- min-h-touch-xs: 24px (minimum per WCAG 2.2)
- min-h-touch-sm: 28px (compact buttons)
- min-h-touch:    32px (standard)
- min-h-touch-lg: 36px (primary CTA)

Container utilities:
- container:         max-w-[90rem] + responsive padding
- container-wide:    max-w-[96rem] + responsive padding
- container-content: max-w-[72rem] + responsive padding
- container-narrow:  max-w-[48rem] + responsive padding
```

### Color Reference (Agent-3)

```
Backgrounds:
- bg-background      (page background)
- bg-card            (card surfaces)
- bg-muted           (muted sections)
- bg-primary         (primary brand)

Text:
- text-foreground        (primary text)
- text-muted-foreground  (secondary text)
- text-primary           (brand text)

Borders:
- border-border      (standard borders)
- border-input       (form inputs)

Interactive:
- bg-cta-trust-blue text-cta-trust-blue-text
- bg-cta-primary text-cta-primary-text
- bg-primary text-primary-foreground

Prices:
- text-price-regular (normal price)
- text-price-sale    (sale/discount)
- text-price-original line-through (was price)
- text-price-savings (you save)

Status:
- text-success / bg-success
- text-warning / bg-warning
- text-error / bg-error
- text-info / bg-info

NO GRADIENTS - Use solid colors only!
```

---

## ✅ Verification Gate Results

```
Typecheck: ✅ PASSED (0 errors)
Palette violations: ✅ 0
Hex violations: 🟡 1 (minor)
OKLCH inline: ✅ 0
```

---

## 🚀 Handoff to Parallel Agents

This audit is complete. Launch the following agents simultaneously:

1. **AGENT-1-TYPOGRAPHY-AUDIT.md** - Fix typography inconsistencies
2. **AGENT-2-SPACING-LAYOUT-AUDIT.md** - Fix spacing, arbitrary widths/heights
3. **AGENT-3-COLORS-THEMING-AUDIT.md** - Eliminate gradients, fix color tokens

Each agent has:
- Non-overlapping file scope
- Clear token reference sheets
- Specific violation lists to fix

**Total estimated time**: ~3 hours parallel work

---

## 📝 Tokens Added/Modified

No new tokens were needed - the existing `app/globals.css` has comprehensive coverage:
- 100+ color tokens (light + dark mode)
- Complete typography scale
- Touch target utilities
- Container width tokens
- Scroll area tokens
- Shadow tokens (flat style)
- Border radius tokens

The design system foundation is solid. The issues are in **usage**, not **definitions**.
