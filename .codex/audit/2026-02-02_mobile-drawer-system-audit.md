# Mobile Drawer System Audit

**Date:** 2026-02-02  
**Auditor:** GitHub Copilot  
**Scope:** All drawer implementations in Treido marketplace

---

## Executive Summary

| Component | shadcn Compliance | Tailwind v4 | UX Patterns | Overall |
|-----------|-------------------|-------------|-------------|---------|
| `ui/drawer.tsx` (base) | ✅ Excellent | ✅ Clean | ✅ Well-designed | ✅ Pass |
| `cart-drawer.tsx` | ⚠️ Minor issues | ✅ Clean | ⚠️ Close button style | ⚠️ Review |
| `product-quick-view-drawer.tsx` | ✅ Good | ✅ Clean | ✅ Good | ✅ Pass |
| `messages-drawer.tsx` | ⚠️ Minor issues | ✅ Clean | ⚠️ Close button style | ⚠️ Review |
| `account-drawer.tsx` | ⚠️ Minor issues | ✅ Clean | ⚠️ Close button style | ⚠️ Review |
| `category-browse-drawer.tsx` | ❌ Issues | ⚠️ Minor issue | ⚠️ Mixed patterns | ❌ Needs fixes |
| `wishlist-drawer.tsx` | ⚠️ Minor issues | ✅ Clean | ⚠️ Close button style | ⚠️ Review |

---

## 1. Base Primitive: `components/ui/drawer.tsx`

### A) shadcn Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ✅ | Well-implemented with responsive text alignment |
| DrawerBody | ✅ | Includes `data-vaul-no-drag`, `overscroll-contain`, `touch-pan-y` |
| DrawerFooter | ✅ | Includes safe area padding `pb-safe-max` |
| DrawerTitle | ✅ | Uses semantic `text-foreground font-semibold` |
| DrawerDescription | ✅ | Uses `text-muted-foreground text-sm` |
| DrawerClose | ✅ | Properly wraps vaul primitive |
| DrawerOverlay | ✅ | Uses `DrawerClose asChild` pattern, configurable blur |
| a11y | ✅ | Auto-injects sr-only title if missing, proper aria handling |

**Strengths:**
- Excellent iOS-specific handling (`isIOSDevice()` with proper defaults)
- Configurable overlay blur with design system tokens
- Auto-accessibility injection for missing titles
- Proper `data-slot` attributes for styling hooks
- Direction-aware styling (bottom, top, left, right)

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | Uses semantic tokens only |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | `bg-background`, `text-foreground`, `border-border`, `bg-muted`, `bg-muted-foreground`, `bg-overlay-dark` |

### C) UX Patterns ✅

| Check | Status | Notes |
|-------|--------|-------|
| Draggable area | ✅ | Entire content draggable by default |
| `data-vaul-no-drag` | ✅ | Present in `DrawerBody` |
| Touch handling | ✅ | `touch-pan-y`, `overscroll-contain` in DrawerBody |
| Close mechanism | ✅ | Provides `DrawerClose` primitive |

---

## 2. `components/mobile/drawers/cart-drawer.tsx`

### A) shadcn Compliance ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ✅ | Used properly |
| DrawerBody | ✅ | Used with `px-inset`, max-height |
| DrawerFooter | ✅ | Used properly |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ✅ | sr-only, proper accessibility |
| DrawerClose | ⚠️ | **Uses text button "close" instead of X icon** |

**Issue at line 51-58:**
```tsx
<DrawerClose asChild>
  <button
    className="text-xs text-muted-foreground hover:text-foreground h-touch-xs px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
    aria-label={t("close")}
  >
    {t("close")}  // ← Shows "ЗАТВОРИ" in Bulgarian
  </button>
</DrawerClose>
```

**Recommendation:** Consider X icon for visual consistency with other drawers.

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-background`, `text-destructive`, `bg-hover` |

### C) UX Patterns ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ✅ | Uses default DrawerContent |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ✅ | Uses `touch-action-manipulation tap-transparent` on buttons |
| Close mechanism | ⚠️ | Text button inconsistent with product-quick-view-drawer |

---

## 3. `components/mobile/drawers/product-quick-view-drawer.tsx`

### A) shadcn Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ❌ Not used | Uses custom header div instead |
| DrawerBody | ✅ | Used properly (px-0 py-0 override) |
| DrawerFooter | ❌ Not used | Footer handled by ProductQuickViewContent |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ✅ | sr-only, proper accessibility |
| DrawerClose | ✅ | **Uses X icon - good pattern!** |

**Note:** Custom header is acceptable here for layout flexibility.

**Close button implementation (line 73-82):**
```tsx
<DrawerClose asChild>
  <Button
    variant="ghost"
    size="icon-sm"
    className="shrink-0 -mr-2 rounded-full hover:bg-muted touch-manipulation"
  >
    <X className="size-4" />
    <span className="sr-only">{t("close")}</span>
  </Button>
</DrawerClose>
```

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | `text-foreground`, `border-border/30`, `bg-muted` |

**Note:** `border-border/30` uses opacity modifier - acceptable per Tailwind v4.

### C) UX Patterns ✅

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ✅ | `showHandle` enabled |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ✅ | `touch-pan-y` on DrawerContent, `touch-manipulation` on close button |
| Close mechanism | ✅ | X icon button - best pattern |

### D) Loading/Fetching Issues ✅

**Hook Analysis (`use-product-quick-view-details.ts`):**

| Check | Status | Notes |
|-------|--------|-------|
| Anti-pattern avoidance | ✅ | Uses `useMemo` for derived state, not useEffect |
| Duplicate request prevention | ✅ | Uses `fetchedKeyRef` to track fetched keys |
| Abort controller | ✅ | Properly aborts on unmount |
| State handling | ✅ | Stores fetched data with product ID for safe merging |
| Reset on close | ✅ | Clears state when `open` becomes false |

**The hook is well-designed** - no unnecessary refetching detected.

---

## 4. `components/mobile/drawers/messages-drawer.tsx`

### A) shadcn Compliance ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ✅ | Used properly |
| DrawerBody | ✅ | Used with px-0 override for edge-to-edge items |
| DrawerFooter | ✅ | Used properly |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ✅ | sr-only, proper accessibility |
| DrawerClose | ⚠️ | **Uses text button "close" instead of X icon** |

**Issue at line 61-68:**
```tsx
<DrawerClose asChild>
  <button
    className="text-xs text-muted-foreground hover:text-foreground h-touch-xs px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
    aria-label={t("close")}
  >
    {t("close")}
  </button>
</DrawerClose>
```

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | All semantic: `text-destructive`, `text-muted-foreground`, `bg-muted`, `bg-hover`, `bg-active`, `border-border` |

### C) UX Patterns ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ✅ | Default behavior |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ✅ | `touch-action-manipulation tap-transparent` on interactive items |
| Close mechanism | ⚠️ | Text button, inconsistent with product drawer |

---

## 5. `components/mobile/drawers/account-drawer.tsx`

### A) shadcn Compliance ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ✅ | Used properly |
| DrawerBody | ✅ | Used with px-0 override |
| DrawerFooter | ✅ | Used properly |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ✅ | sr-only, proper accessibility |
| DrawerClose | ⚠️ | **Uses text button "close" instead of X icon** |

**Issue at line 118-125:**
```tsx
<DrawerClose asChild>
  <button
    className="text-xs text-muted-foreground hover:text-foreground h-touch-xs px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
    aria-label={tAccount("close")}
  >
    {tAccount("close")}
  </button>
</DrawerClose>
```

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | `text-rating`, `text-destructive`, `bg-destructive/10`, `text-status-warning`, `bg-status-warning/10`, `bg-muted`, `bg-hover`, `bg-active`, `border-border` |

### C) UX Patterns ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ✅ | Default behavior |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ✅ | `touch-action-manipulation tap-transparent` on all interactive elements |
| Close mechanism | ⚠️ | Text button, inconsistent |

---

## 6. `components/mobile/drawers/category-browse-drawer.tsx`

### A) shadcn Compliance ❌

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ⚠️ | Used but overrides flex direction (`flex-row`) |
| DrawerBody | ✅ | Used properly with `pb-safe-max` |
| DrawerFooter | ❌ Not used | Uses inline button instead |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ❌ **MISSING** | **No description provided - a11y issue** |
| DrawerClose | ❌ | **Uses custom button, not DrawerClose primitive** |

**Issue at line 92-105:**
```tsx
<button
  type="button"
  onClick={close}  // ← Should use DrawerClose instead
  className={cn(
    "p-2 -mr-2 rounded-full",
    "hover:bg-accent transition-colors",  // ← Uses `bg-accent` - not defined as semantic?
    "shrink-0"
  )}
  aria-label="Close"
>
  <X size={20} weight="bold" />
</button>
```

**Issues:**
1. Uses manual `onClick={close}` instead of `DrawerClose` primitive
2. Missing `DrawerDescription` entirely - accessibility violation
3. Hardcoded aria-label "Close" instead of i18n

### B) Tailwind v4 Compliance ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ⚠️ | Uses `bg-accent` - need to verify this is a defined token |
| **Issue** | ⚠️ | `bg-foreground text-background` on "See all" button may be opinionated |

**Line 140-146:**
```tsx
className={cn(
  "w-full mt-4 py-3 rounded-lg",
  "bg-foreground text-background",  // ← Inverted colors - unconventional
  "text-sm font-medium",
  "active:opacity-90 transition-opacity"
)}
```

### C) UX Patterns ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ⚠️ | No `showHandle` specified (inherits default) |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ❌ | No explicit touch handling classes |
| Close mechanism | ⚠️ | X icon but using custom button not DrawerClose |

**Additional Issues:**
1. **Hardcoded strings:** Lines 82 and 112 have hardcoded Bulgarian/English strings instead of using next-intl
   ```tsx
   return locale === "bg" ? "Категории" : "Categories"  // Line 82
   {locale === "bg" ? "Подкатегории" : "Subcategories"}  // Line 112
   {locale === "bg" ? "Няма подкатегории" : "No subcategories available"}  // Line 122
   ```

---

## 7. `components/shared/wishlist/wishlist-drawer.tsx`

### A) shadcn Compliance ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| DrawerHeader | ✅ | Used properly |
| DrawerBody | ✅ | Used with px-inset, max-height |
| DrawerFooter | ✅ | Used properly |
| DrawerTitle | ✅ | Used properly |
| DrawerDescription | ✅ | sr-only, proper accessibility |
| DrawerTrigger | ✅ | **Only drawer using DrawerTrigger** (self-contained) |
| DrawerClose | ⚠️ | **Uses text button "close" instead of X icon** |

**Issue at line 58-65:**
```tsx
<DrawerClose asChild>
  <button
    className="text-xs text-muted-foreground hover:text-foreground h-touch-lg px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
    aria-label={t("close")}
  >
    {t("close")}
  </button>
</DrawerClose>
```

### B) Tailwind v4 Compliance ✅

| Check | Status | Notes |
|-------|--------|-------|
| Palette colors | ✅ None | — |
| Arbitrary values | ✅ None | — |
| Gradients | ✅ None | — |
| Semantic tokens | ✅ | `text-wishlist`, `bg-muted`, `border-muted`, `text-primary`, `bg-surface-subtle`, `bg-hover`, `text-destructive`, `border-border` |

### C) UX Patterns ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Draggable | ✅ | Default behavior |
| `data-vaul-no-drag` | ✅ | DrawerBody includes it |
| Touch handling | ✅ | `touch-action-manipulation tap-transparent` on buttons |
| Close mechanism | ⚠️ | Text button, inconsistent with product drawer |

---

## Consolidated Issues

### Critical (Must Fix)

| ID | Component | Issue | Location |
|----|-----------|-------|----------|
| C1 | category-browse-drawer | Missing `DrawerDescription` - a11y violation | Line 96-105 |
| C2 | category-browse-drawer | Hardcoded strings instead of next-intl | Lines 82, 112, 122-124, 138-139 |
| C3 | category-browse-drawer | Uses custom close button instead of `DrawerClose` primitive | Lines 96-105 |

### Medium (Should Fix)

| ID | Component | Issue | Location |
|----|-----------|-------|----------|
| M1 | cart-drawer | Uses text "close" button instead of X icon | Lines 51-58 |
| M2 | messages-drawer | Uses text "close" button instead of X icon | Lines 61-68 |
| M3 | account-drawer | Uses text "close" button instead of X icon | Lines 118-125 |
| M4 | wishlist-drawer | Uses text "close" button instead of X icon | Lines 58-65 |
| M5 | category-browse-drawer | No `touch-action-manipulation` on close button | Line 96 |

### Low (Consider)

| ID | Component | Issue | Location |
|----|-----------|-------|----------|
| L1 | category-browse-drawer | `bg-foreground text-background` is unconventional for CTA | Line 143 |
| L2 | category-browse-drawer | Verify `bg-accent` is a defined semantic token | Line 100 |

---

## Recommendations

### 1. Standardize Close Button Pattern

**Current state:** 
- `product-quick-view-drawer.tsx` uses X icon ✅ (best pattern)
- All others use text "close" button

**Recommendation:** Align all drawers to use X icon pattern for visual consistency:

```tsx
// Recommended pattern (from product-quick-view-drawer)
<DrawerClose asChild>
  <Button
    variant="ghost"
    size="icon-sm"
    className="shrink-0 rounded-full hover:bg-muted touch-manipulation"
  >
    <X className="size-4" />
    <span className="sr-only">{t("close")}</span>
  </Button>
</DrawerClose>
```

### 2. Fix category-browse-drawer

```tsx
// Add DrawerDescription
<DrawerDescription className="sr-only">
  {t("browseCategories")}
</DrawerDescription>

// Replace custom button with DrawerClose
<DrawerClose asChild>
  <Button variant="ghost" size="icon-sm" className="shrink-0 -mr-2 rounded-full">
    <X size={20} weight="bold" />
    <span className="sr-only">{t("close")}</span>
  </Button>
</DrawerClose>

// Move hardcoded strings to messages/en.json and messages/bg.json
```

### 3. Create Shared Drawer Header Component

Consider extracting a reusable `DrawerHeaderWithClose` component to enforce consistency:

```tsx
// components/shared/drawer-header-with-close.tsx
export function DrawerHeaderWithClose({ 
  title, 
  icon: Icon, 
  badge 
}: DrawerHeaderWithCloseProps) {
  const t = useTranslations("Common")
  return (
    <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={16} weight="regular" className="text-muted-foreground" />}
          <DrawerTitle className="text-sm font-semibold">{title}</DrawerTitle>
          {badge}
        </div>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon-sm" className="shrink-0 -mr-2">
            <X className="size-4" />
            <span className="sr-only">{t("close")}</span>
          </Button>
        </DrawerClose>
      </div>
    </DrawerHeader>
  )
}
```

---

## Appendix: Token Usage Summary

| Token | Used In |
|-------|---------|
| `bg-background` | drawer.tsx |
| `bg-muted` | all drawers |
| `bg-hover` | cart, messages, account, wishlist |
| `bg-active` | messages, account |
| `bg-overlay-dark` | drawer.tsx |
| `bg-surface-subtle` | wishlist |
| `text-foreground` | all drawers |
| `text-muted-foreground` | all drawers |
| `text-primary` | cart, wishlist |
| `text-destructive` | messages, account, wishlist |
| `text-wishlist` | wishlist |
| `text-rating` | account |
| `text-status-warning` | account |
| `border-border` | all drawers |
| `border-border/30` | product-quick-view |

All tokens are valid Tailwind v4 semantic tokens ✅

---

## Conclusion

The drawer system is **generally well-implemented** with the base primitive (`ui/drawer.tsx`) being excellent. Main areas for improvement:

1. **Critical:** `category-browse-drawer.tsx` needs accessibility fixes and i18n compliance
2. **Medium:** Standardize close button pattern across all drawers (prefer X icon)
3. **Low:** Consider shared header component to prevent drift

The `product-quick-view-drawer.tsx` is the gold standard implementation - other drawers should follow its patterns.
