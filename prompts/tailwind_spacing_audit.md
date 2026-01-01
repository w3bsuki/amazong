# TAILWIND SPACING & DESIGN SYSTEM AUDIT

## Executive Summary

**Goal:** Align entire project with `design.md` Design System and achieve Temu-style density.

**Key Design System Rules (from design.md):**
- **Touch targets:** 40px MAX primary (`h-10`), 36px standard (`h-9`), 32px secondary (`h-8`)
- **Spacing:** `gap-1.5` (6px) mobile grids, `gap-3` (12px) desktop, `p-2` content padding
- **Radius:** `rounded-md` max on cards (6px), NEVER `rounded-xl` or larger on cards
- **Shadows:** `shadow-none` default, `shadow-sm` hover only
- **Font sizes:** Use tokens (`text-2xs`, `text-xs`, `text-sm`), NOT `text-[9px]`, `text-[13px]`

---

## 🔴 CRITICAL VIOLATIONS FOUND

### 1. UI CARD COMPONENT - WRONG BASE SPACING
**File:** `components/ui/card.tsx`

**Current (TOO SPACIOUS - not Temu-like):**
```tsx
Card: "gap-6 py-6"       // ❌ 24px gaps - way too much
CardHeader: "px-6"        // ❌ 24px padding
CardContent: "px-6"       // ❌ 24px padding
CardFooter: "px-6"        // ❌ 24px padding
```

**Should be (per design.md p-2/p-3 tokens):**
```tsx
Card: "gap-2 py-3"        // ✅ 8px gap, 12px vertical
CardHeader: "px-3"         // ✅ 12px padding
CardContent: "px-3"        // ✅ 12px padding  
CardFooter: "px-3"         // ✅ 12px padding
```

**Impact:** Every card in the app is too spacious!

---

### 2. DIALOG/ALERT-DIALOG - WRONG SPACING
**Files:** `components/ui/dialog.tsx`, `components/ui/alert-dialog.tsx`

**Current:**
```tsx
DialogContent: "gap-4 p-6"  // ❌ 16px gap, 24px padding
AlertDialogContent: "gap-4 p-6"
```

**Should be:**
```tsx
DialogContent: "gap-2 p-3 md:p-4"  // ✅ Dense mobile, room on desktop
AlertDialogContent: "gap-2 p-3 md:p-4"
```

---

### 3. TOAST COMPONENT - WRONG PADDING
**File:** `components/ui/toast.tsx`

**Current:**
```tsx
Toast: "p-6"  // ❌ 24px padding
```

**Should be:**
```tsx
Toast: "p-3"  // ✅ 12px padding per dense design
```

---

### 4. ROUNDED-XL/2XL VIOLATIONS ON CARDS
**Design.md states:** "Never use `rounded-lg`, `rounded-xl`, `rounded-2xl` on product cards"

**Files with rounded-xl on cards/containers:**
| File | Line | Current | Fix |
|------|------|---------|-----|
| `sidebar-menu.tsx` | 201 | `rounded-xl` | `rounded-md` |
| `sidebar-menu.tsx` | 326 | `rounded-xl` | `rounded-md` |
| `sidebar-menu.tsx` | 369+ | `rounded-2xl` | `rounded-md` |
| `input-group.tsx` | 16 | `rounded-xl` | `rounded-md` |
| `geo-welcome-modal.tsx` | 158 | `rounded-xl` | `rounded-md` |
| `desktop-filter-modal.tsx` | 201+ | `rounded-xl` | `rounded-md` |
| `prompt-input.tsx` | 105 | `rounded-xl` | `rounded-md` |
| `prompt-input.tsx` | 777+ | `rounded-xl` | `rounded-md` |

---

### 5. TOUCH TARGETS >40px VIOLATIONS

**Design.md Rule:** "Touch targets over 40px (except hero sections)" is FORBIDDEN

**Files with h-12+ (48px) or larger:**
| File | Element | Current | Fix |
|------|---------|---------|-----|
| `support-chat-widget.tsx` | FAB button | `h-14 w-14` (56px) | `h-10 w-10` (40px) or `h-12` max |
| `command.tsx` | Input wrapper | `h-12` (48px) | `h-10` (40px) |
| `mobile-product-header.tsx` | Header height | `h-14` (56px) | OK - header exception |
| `site-header.tsx` | Desktop header | `h-14 md:h-16` | `h-12 md:h-14` - reduce |

**Allowed exceptions (headers/navs):**
- Bottom nav bars can be 48-56px (h-12 to h-14)
- Header containers can be 48-56px
- Primary CTAs should NOT exceed 40px (h-10)

---

### 6. ARBITRARY FONT SIZE VIOLATIONS

**Per tailwind_tasks.md - use tokens instead:**

| Current | Replace With | Files |
|---------|--------------|-------|
| `text-[9px]` | `text-2xs` | seller-products-grid.tsx, newest-listings.tsx |
| `text-[10px]` | `text-2xs` | 15+ files (sidebar-menu, dropdowns, etc.) |
| `text-[11px]` | `text-xs` | 10+ files (product-buy-box, sidebar-menu, etc.) |
| `text-[13px]` | `text-sm` | product-card.tsx, sidebar-menu |

---

### 7. HARDCODED COLORS VIOLATIONS

**Per tailwind_tasks.md - use semantic tokens:**

| Current | Replace With | Files |
|---------|--------------|-------|
| `bg-white` | `bg-background` or `bg-card` | 20+ files |
| `bg-black/50` | `bg-overlay-dark` | dialog, sheet, drawer, alert-dialog |
| `bg-green-500` | `bg-success` | ai-chatbot.tsx, status badges |
| `bg-red-500` | `bg-error` | ai-chatbot.tsx, status badges |
| `gray-*` colors | `muted`, `border`, `foreground` tokens | 30+ files |

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. PADDING/GAP TOO LARGE IN COMPONENTS

**Design.md spacing rules:**
- Mobile grids: `gap-1.5` (6px)
- Desktop grids: `gap-3` (12px)
- Card content: `p-1.5` to `p-2` (6-8px) mobile

**Components using `p-4`/`gap-4` (16px) - too spacious:**
| File | Current | Should Be |
|------|---------|-----------|
| `sheet.tsx` | `gap-4`, `p-4` | `gap-2`, `p-3` |
| `drawer.tsx` | `p-4` | `p-3` |
| `popover.tsx` | `p-4` | `p-3` |
| `hover-card.tsx` | `p-4` | `p-3` |

---

### 9. PRODUCT CARD COMPLIANCE CHECK

**Current `product-card.tsx` - MOSTLY COMPLIANT ✅**

Good patterns found:
- ✅ Image aspect ratio 4:5
- ✅ Price is text-lg/xl (largest element)
- ✅ Touch targets: h-8 (32px) for buttons
- ✅ Spacing: `gap-0.5`, `py-1.5`, `px-0.5`
- ✅ Font sizes: `text-tiny`, `text-2xs` for meta

One violation:
- ❌ `text-[13px]` on line 404 → should be `text-sm`

---

### 10. MOBILE TAB BAR COMPLIANCE

**Current `mobile-tab-bar.tsx` - COMPLIANT ✅**
- ✅ Height: `h-12` (48px) - acceptable for navigation
- ✅ Icons: size-24 (using Phosphor icons, not size-*)
- ✅ Touch targets: `min-h-touch min-w-touch` tokens
- ✅ Font: `text-2xs` for labels

---

### 11. MOBILE PRODUCT HEADER COMPLIANCE

**Current `mobile-product-header.tsx` - MOSTLY COMPLIANT**
- ✅ Button touch targets: `size-10` (40px) via `size="icon-lg"`
- ✅ Header height: `h-14` (56px) - acceptable for headers
- ⚠️ Link touch target: `size-10` - correct

---

## 🟢 COMPLIANT PATTERNS (Reference)

### Main Page (`app/[locale]/(main)/page.tsx`)
- ✅ Uses `gap-1.5`, `gap-3` correctly
- ✅ Uses `px-(--page-inset)` token
- ✅ Mobile-first responsive patterns

### Button Component (`button.tsx`)
- ✅ `icon-lg: size-10` (40px max)
- ✅ `lg: h-9` (36px standard)
- ✅ `default: h-8` (32px secondary)

### Product Card (`product-card.tsx`)
- ✅ Dense content spacing
- ✅ Proper font scale tokens (mostly)
- ✅ 4:5 aspect ratio images

---

## FIX PRIORITY ORDER

### Batch 1: Base UI Components (HIGH IMPACT)
1. `card.tsx` - Reduce gap-6/py-6/px-6 → gap-2/py-3/px-3
2. `dialog.tsx` - Reduce p-6 → p-3 md:p-4
3. `alert-dialog.tsx` - Same as dialog
4. `toast.tsx` - Reduce p-6 → p-3
5. `sheet.tsx` - Reduce gap-4/p-4 → gap-2/p-3
6. `drawer.tsx` - Reduce p-4 → p-3
7. `popover.tsx` - Reduce p-4 → p-3
8. `hover-card.tsx` - Reduce p-4 → p-3

### Batch 2: Rounded Corner Fixes
1. `input-group.tsx` - rounded-xl → rounded-md
2. `geo-welcome-modal.tsx` - rounded-xl → rounded-md
3. `sidebar-menu.tsx` - rounded-xl/2xl → rounded-md
4. `desktop-filter-modal.tsx` - rounded-xl → rounded-md
5. `prompt-input.tsx` - rounded-xl → rounded-md

### Batch 3: Touch Target Fixes
1. `support-chat-widget.tsx` - h-14 w-14 → h-10 w-10 or h-12 max
2. `command.tsx` - h-12 → h-10 for input area

### Batch 4: Font Size Token Fixes
1. Replace all `text-[9px]` → `text-2xs`
2. Replace all `text-[10px]` → `text-2xs`
3. Replace all `text-[11px]` → `text-xs`
4. Replace all `text-[13px]` → `text-sm`

### Batch 5: Color Token Fixes (per tailwind_tasks.md)
- Follow existing plan in tailwind_tasks.md

---

## VALIDATION COMMANDS

```bash
# Find remaining arbitrary font sizes
grep -r "text-\[" components/ app/ --include="*.tsx" | grep -v node_modules

# Find rounded-xl/2xl on card-like elements
grep -r "rounded-xl\|rounded-2xl" components/ --include="*.tsx"

# Find p-4/p-5/p-6 padding (potentially too large)
grep -r "p-[456]\s\|p-[456]\"" components/ --include="*.tsx"

# Find gap-4/gap-5/gap-6 gaps (potentially too large)
grep -r "gap-[456]\s\|gap-[456]\"" components/ --include="*.tsx"

# Find touch targets over 40px
grep -r "h-1[1-9]\|h-[2-9][0-9]\|size-1[1-9]" components/ --include="*.tsx"

# Build check
pnpm build
```

---

## DESIGN TOKEN REFERENCE (from globals.css)

```css
/* Touch Targets */
--spacing-touch-xs: 1.5rem;    /* 24px - Minimum */
--spacing-touch-sm: 1.75rem;   /* 28px - Compact */
--spacing-touch: 2rem;         /* 32px - Standard */
--spacing-touch-lg: 2.25rem;   /* 36px - Primary CTA (max standard) */
/* Note: 40px (h-10) is MAX for buttons per design.md */

/* Spacing */
--page-inset: 0.5rem;          /* 8px - Mobile edge padding */
--page-inset-md: 0.75rem;      /* 12px - Tablet */
--page-inset-lg: 1rem;         /* 16px - Desktop */

/* Font Sizes */
--font-size-2xs: 0.625rem;     /* 10px - badges, tiny labels */
--text-tiny: 0.6875rem;        /* 11px - legal, helper, micro */
--text-body: 0.875rem;         /* 14px - standard body */
--text-price: 1rem;            /* 16px - price emphasis */
```

---

*Created: 2026-01-01*
*Source: design.md, tailwind_tasks.md, tailwind_audit.md*
