# Checkout Page Audit — January 28, 2026

> **Status**: 🔴 Critical Issues Found  
> **Files**: `app/[locale]/(checkout)/_components/checkout-page-client.tsx`, `checkout-header.tsx`, `checkout-footer.tsx`  
> **Framework**: Next.js 16 + Tailwind v4 + shadcn/ui (new-york style)

---

## Executive Summary

The checkout page has significant visual and UX issues on both desktop and mobile. The implementation deviates from shadcn patterns, uses inconsistent spacing, and has a broken desktop grid layout that wastes screen real estate.

**Screenshot reviewed**: Bulgarian locale desktop view showing cramped 2-column layout with order summary sidebar.

---

## 🚨 Critical Issues

### 1. Desktop Layout is Fundamentally Broken

**Problem**: Using `container-narrow` (max-width: 48rem/768px) with a 12-column grid split (7/5). This creates an absurdly cramped checkout on desktop monitors.

```tsx
// CURRENT (broken)
<div className="container-narrow">
  <div className="grid grid-cols-12 gap-8">
    <div className="col-span-7">...</div>  // ~450px for entire checkout form
    <div className="col-span-5">...</div>  // ~320px for sidebar
  </div>
</div>
```

**Impact**: 
- Form fields are squeezed into ~450px width
- Massive unused whitespace on either side of checkout
- Looks amateurish compared to Amazon/Stripe checkout flows

**Fix**:
```tsx
// FIXED
<div className="container max-w-5xl">
  <div className="grid lg:grid-cols-[1fr,380px] gap-6 lg:gap-8">
    <div>...</div>  // Main content - fluid width
    <div>...</div>  // Sidebar - fixed 380px
  </div>
</div>
```

---

### 2. Not Using shadcn Card Components

**Problem**: Raw divs with manual border/padding instead of shadcn `Card` primitives.

```tsx
// CURRENT (inconsistent)
<section className="bg-card border border-border/60 rounded-lg overflow-hidden">
  <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
    <div className="flex items-center gap-2.5">
      <MapPin className="size-5 text-brand" weight="fill" />
      <h2 className="text-base font-semibold">{t("shippingAddress")}</h2>
    </div>
  </div>
  <div className="p-5">...</div>
</section>
```

**Fix**:
```tsx
// FIXED (shadcn Card)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader className="border-b">
    <CardTitle className="flex items-center gap-2 text-base">
      <MapPin className="size-5 text-primary" weight="fill" />
      {t("shippingAddress")}
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-5">...</CardContent>
</Card>
```

---

### 3. Ugly Mobile Section Dividers

**Problem**: Using `<div className="h-2 bg-muted" />` as section dividers — a dated Android 2018 pattern.

```tsx
// CURRENT (ugly)
<div className="bg-card px-4 pt-4 pb-3">...</div>
<div className="h-2 bg-muted" />  {/* UGLY GRAY BAR */}
<div className="bg-card px-4 py-3">...</div>
<div className="h-2 bg-muted" />  {/* UGLY GRAY BAR */}
```

**Fix**: Use proper card spacing or subtle borders:
```tsx
// FIXED
<div className="space-y-3 px-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
// OR use subtle 1px dividers:
<div className="h-px bg-border" />
```

---

### 4. Color Token Inconsistency

**Problem**: Mixing `text-brand`/`bg-brand` with `text-primary`/`bg-primary`. The `--brand` token is just an alias for `--primary` but creates confusion.

**Current usage in checkout**:
- `text-brand` — 12 occurrences
- `bg-brand/5`, `bg-brand/10` — 6 occurrences
- `border-brand` — 3 occurrences

**Fix**: Normalize to shadcn convention:
- `text-brand` → `text-primary`
- `bg-brand` → `bg-primary`
- `border-brand` → `border-primary`

---

### 5. Form Design Issues

**Problems**:
- No use of shadcn `Form`/`FormField` components (using raw Label + Input)
- Inline validation errors crowd the UI
- Inconsistent placeholder styling
- Labels are plain `text-sm font-medium` with red asterisks

**Current**:
```tsx
<div className="space-y-1.5">
  <Label htmlFor="firstName" className="text-sm font-medium">
    {t("firstName")} <span className="text-destructive">*</span>
  </Label>
  <Input ... />
  {touched.firstName && errors.firstName && (
    <p className="text-xs text-destructive flex items-center gap-1">
      <WarningCircle className="size-3.5" />
      <span>{errors.firstName}</span>
    </p>
  )}
</div>
```

**Recommendation**: Migrate to shadcn Form with react-hook-form for proper validation UX.

---

### 6. Order Summary Sidebar Styling

**Problems**:
- Total section uses `bg-muted/30 p-4 rounded-lg` — looks like a sticky note
- `text-2xl font-bold text-brand` for total price is visually screaming
- Trust badges are cramped afterthoughts

**Current**:
```tsx
<div className="rounded-lg bg-muted/30 p-4">
  <div className="flex justify-between items-baseline">
    <span className="text-base font-semibold">{t("total")}</span>
    <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
  </div>
</div>
```

**Fix**:
```tsx
<div className="border-t pt-4 mt-4">
  <div className="flex justify-between items-baseline">
    <span className="text-base font-semibold">{t("total")}</span>
    <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
  </div>
</div>
```

---

### 7. Mobile Sticky Footer Issues

**Problems**:
- Hardcoded `pb-24` on content container
- `pb-safe` utility may not be sufficient for all devices
- No backdrop blur for modern glass effect

**Current**:
```tsx
<div className="lg:hidden pb-24">...</div>
<div className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border pb-safe z-40">
```

**Fix**:
```tsx
<div className="lg:hidden pb-[calc(5rem+env(safe-area-inset-bottom))]">...</div>
<div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-md border-t">
  <div className="pb-safe">...</div>
</div>
```

---

## 📋 Compliance Checklist

| Requirement | Status | Notes |
|------------|--------|-------|
| shadcn Card component usage | ❌ | Using raw divs with manual styling |
| shadcn Form/FormField | ❌ | Manual Label + Input + error handling |
| Consistent color tokens | ❌ | Mixing `brand` and `primary` tokens |
| Tailwind v4 @theme compliance | ⚠️ | Some tokens used, but inconsistently |
| Responsive design | ⚠️ | Hard `lg:` breakpoint split only |
| Container strategy | ❌ | `container-narrow` too cramped |
| Touch target sizing | ⚠️ | Shipping options OK, form fields tight |
| Accessibility | ⚠️ | Has aria-invalid/describedby, needs Form |
| Dark mode support | ✅ | Inherits from global tokens |

---

## 🎯 Implementation Plan

### Priority 1: Layout Fix (High Impact)
- [ ] Replace `container-narrow` with `container max-w-5xl`
- [ ] Change grid to `grid-cols-[1fr,380px]` for fluid/fixed split
- [ ] Add proper `xl:` breakpoint for larger screens

### Priority 2: Card Migration (Medium Impact)
- [ ] Import and use shadcn `Card`, `CardHeader`, `CardTitle`, `CardContent`
- [ ] Apply to Address section, Shipping section, Order Items section
- [ ] Apply to Order Summary sidebar

### Priority 3: Kill Ugly Dividers (Quick Win)
- [ ] Remove all `<div className="h-2 bg-muted" />` dividers
- [ ] Use `space-y-3` or `space-y-4` between Card components
- [ ] Or use subtle `h-px bg-border` if separation needed

### Priority 4: Color Normalization (Quick Win)
- [ ] Global find/replace `text-brand` → `text-primary` in checkout files
- [ ] Replace `bg-brand` → `bg-primary`
- [ ] Replace `border-brand` → `border-primary`

### Priority 5: Sidebar Refinement (Medium Impact)
- [ ] Remove `bg-muted/30` wrapper on total
- [ ] Tone down total price styling
- [ ] Add proper spacing for trust badges

### Priority 6: Mobile Polish (Lower Priority)
- [ ] Add `backdrop-blur-md` to sticky footer
- [ ] Fix content bottom padding calculation
- [ ] Ensure safe area handling is robust

### Priority 7: Form Migration (Future)
- [ ] Consider react-hook-form + shadcn Form integration
- [ ] Move validation to Zod schema
- [ ] Better inline validation UX

---

## Files to Modify

| File | Changes |
|------|---------|
| `checkout-page-client.tsx` | Layout grid, Card components, color tokens, dividers |
| `checkout-header.tsx` | Minor: `text-brand` → `text-primary` |
| `checkout-footer.tsx` | No changes needed |
| `app/utilities.css` | Consider adding checkout-specific container |

---

## Reference Screenshots

### Current State (Bulgarian locale)
- Desktop: Cramped 768px container with 7/5 grid split
- Visible issues: Squeezed form, gray divider bars, inconsistent spacing

### Target State
- Desktop: Full-width checkout up to 1024px, fluid main + 380px fixed sidebar
- Mobile: Card-based sections with subtle spacing, glass-effect sticky footer
- Reference: Stripe Checkout, Shopify checkout, modern e-commerce best practices

---

## Notes

- The `--color-brand` token in `globals.css` (line 682) just aliases `--primary`. Consider deprecating.
- `container-narrow` utility is 48rem (768px) — only appropriate for text-heavy content pages, not checkout.
- Checkout uses Phosphor icons (`@phosphor-icons/react`) which is correct for the project.

---

*Audit by: Claude | Date: January 28, 2026*
