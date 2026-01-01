# SHADCN PRODUCTION REFACTOR TASKS

> **Generated**: 2024-12-31  
> **Goal**: Production-ready shadcn/ui with 0 over-engineering, best practices only  
> **Priority**: P0 = Must fix, P1 = Should fix, P2 = Nice to have

---

## AUDIT SUMMARY

### ✅ What's Good
- `components.json` properly configured (new-york style, RSC enabled, proper aliases)
- `cn()` utility correctly uses `clsx` + `twMerge`
- Most ui/ components follow shadcn patterns
- CSS variables properly set up in `globals.css`
- Form system (`ui/form.tsx`) correctly integrated with react-hook-form
- Good accessibility on core components (Spinner, Pagination, Carousel)

### ⚠️ Issues Found
1. **Icon library inconsistency** - Mix of Phosphor and Lucide icons in ui/
2. **3 custom components in ui/** that don't belong there
3. **Toast uses old forwardRef pattern** instead of function components
4. **Some inline styles** where Tailwind could be used
5. **Missing animation transitions** on some overlay components

---

## P0 TASKS (Production Blockers)

### Task 1: Standardize Icon Library in ui/
**Problem**: ui/ components mix `@phosphor-icons/react` and `lucide-react`

| File | Current | Should Be |
|------|---------|-----------|
| `accordion.tsx` | Phosphor (CaretDown) | Lucide (ChevronDown) |
| `carousel-scroll-button.tsx` | Phosphor (CaretLeft/Right) | Lucide (ChevronLeft/Right) |
| `command.tsx` | Phosphor (MagnifyingGlass) | Lucide (Search) |
| `dialog.tsx` | Phosphor (X) | Lucide (X) ✅ |
| `radio-group.tsx` | Phosphor (Circle) | Lucide (Circle) |
| `spinner.tsx` | Phosphor (SpinnerGap) | Lucide (Loader2) |
| `toast.tsx` | Phosphor (X) | Lucide (X) |

**Action**: Standardize all ui/ components to `lucide-react` (shadcn default).

```bash
# Files to update:
components/ui/accordion.tsx
components/ui/carousel-scroll-button.tsx  
components/ui/command.tsx
components/ui/dialog.tsx
components/ui/radio-group.tsx
components/ui/spinner.tsx
components/ui/toast.tsx
```

**Note**: `components.json` has `"iconLibrary": "lucide"` - enforce this.

---

### Task 2: Move Custom Components Out of ui/
**Problem**: 3 files in `ui/` are custom, not shadcn primitives

| File | Type | Move To |
|------|------|---------|
| `count-badge.tsx` | Custom badge variant | `components/common/count-badge.tsx` |
| `spinner.tsx` | Custom loading indicator | `components/common/spinner.tsx` |
| `carousel-scroll-button.tsx` | Custom carousel button | `components/common/carousel-scroll-button.tsx` |

**Action**: Move these files and update all imports across codebase.

**Rule**: `components/ui/` = shadcn primitives ONLY. Custom = `components/common/`.

---

### Task 3: Convert Toast to Function Components
**Problem**: `toast.tsx` uses old `forwardRef` pattern while other components use function pattern

**Current** (old pattern):
```tsx
const ToastViewport = React.forwardRef<...>(...)
ToastViewport.displayName = ...
```

**Should be** (modern pattern):
```tsx
function ToastViewport({ className, ...props }: React.ComponentProps<...>) {
  return <ToastPrimitives.Viewport data-slot="toast-viewport" ... />
}
```

**Action**: Refactor `toast.tsx` to match `dialog.tsx`, `sheet.tsx`, `drawer.tsx` patterns.

---

## P1 TASKS (Should Fix)

### Task 4: Add data-slot Attributes Consistently
**Problem**: Some components missing `data-slot` for debugging/styling

**Missing data-slot**:
- `toast.tsx` - all subcomponents
- `chart.tsx` - chart containers

**Action**: Add `data-slot="component-name"` to all component roots.

---

### Task 5: Remove Unnecessary Inline Styles
**Problem**: Some inline styles should be Tailwind classes

**Files with inline styles to review**:
```
components/ui/chart.tsx - line 216, 298 (may be necessary for charts)
components/ui/input.tsx - line 20 (unnecessary wrapper)
components/ui/progress.tsx - line 25 (transform - keep as is)
```

**Action for input.tsx**:
```tsx
// REMOVE: style={normalizedStyle}
// The empty object fallback is unnecessary
```

---

### Task 6: Verify Dialog/Sheet/Drawer Animation Consistency
**Problem**: Overlay animations may be inconsistent

**Check these components have matching animation patterns**:
- `dialog.tsx` - DialogOverlay
- `sheet.tsx` - SheetOverlay  
- `drawer.tsx` - DrawerOverlay

**Expected**: All should have `bg-black/50` overlay with smooth fade.

---

### Task 7: Audit Button Variants for Marketplace
**Current custom variants in button.tsx**:
```tsx
cta: "bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover"
deal: "bg-deal text-white hover:bg-deal/90"
```

**Status**: ✅ These are acceptable marketplace-specific variants.

**Verify**: These variants use CSS variables defined in `globals.css`.

---

### Task 8: Audit Badge Variants for Marketplace
**Current custom variants in badge.tsx**:
```tsx
verified: "border-transparent bg-verified text-white"
deal: "border-transparent bg-deal text-white"
shipping: "border-transparent bg-shipping-free/10 text-shipping-free"
stock: "border-transparent bg-stock-low/10 text-stock-low"
"top-rated": "border-transparent bg-top-rated/10 text-top-rated"
```

**Status**: ✅ These are acceptable marketplace-specific variants.

---

## P2 TASKS (Nice to Have)

### Task 9: Document Custom Field Component
**File**: `components/common/field.tsx`

This is a well-designed custom field system that parallels shadcn's Form.
**Action**: Add JSDoc comments explaining when to use Field vs Form.

```tsx
/**
 * Field - Lightweight field wrapper for simple forms
 * Use when: Single fields, no validation needed, quick prototypes
 * 
 * Form (ui/form.tsx) - React Hook Form integration
 * Use when: Complex forms, validation, multi-step flows
 */
```

---

### Task 10: Verify Form Pattern Consistency
**Current form usage in codebase**:
- `sell-form-provider.tsx` - uses zodResolver ✅
- `product-form-modal.tsx` - uses zodResolver ✅
- `reset-password-client.tsx` - uses zodResolver ✅
- `product-buy-box.tsx` - uses zodResolver ✅

**Status**: ✅ All forms consistently use Zod + React Hook Form.

---

### Task 11: Check for Missing sr-only Labels
**Files with close buttons to verify**:
- `dialog.tsx` - has `<span className="sr-only">Close</span>` ✅
- `sheet.tsx` - has `<span className="sr-only">Close</span>` ✅
- `toast.tsx` - missing sr-only label ⚠️

**Action**: Add sr-only label to ToastClose.

---

## IMPLEMENTATION CHECKLIST

```markdown
## Phase 1: Icon Standardization (P0)
- [x] Update accordion.tsx (CaretDown → ChevronDown)
- [x] Update command.tsx (MagnifyingGlass → Search)
- [x] Update radio-group.tsx (Circle → Circle from lucide)
- [x] Update spinner.tsx (SpinnerGap → Loader2) - MOVED to common/
- [x] Update toast.tsx (X from phosphor → X from lucide)
- [x] Update dialog.tsx (X from phosphor → X from lucide)
- [x] Update carousel-scroll-button.tsx (CaretLeft/Right → ChevronLeft/Right) - MOVED to common/

## Phase 2: Component Organization (P0)
- [x] Move count-badge.tsx to common/
- [x] Move spinner.tsx to common/
- [x] Move carousel-scroll-button.tsx to common/
- [x] Update all imports across codebase
- [x] Verify no broken imports (grep for old paths)

## Phase 3: Toast Refactor (P0)
- [x] Convert ToastViewport to function component
- [x] Convert Toast to function component
- [x] Convert ToastAction to function component
- [x] Convert ToastClose to function component
- [x] Convert ToastTitle to function component
- [x] Convert ToastDescription to function component
- [x] Add data-slot attributes
- [x] Add sr-only label to ToastClose

## Phase 4: Cleanup (P1)
- [x] Remove unnecessary style prop from input.tsx
- [ ] Add missing data-slot attributes to chart.tsx (optional - charts are special)
- [x] Verify overlay animations are consistent
- [x] Run typecheck: pnpm -s exec tsc --noEmit

## Phase 5: Documentation (P2)
- [ ] Add JSDoc to field.tsx
- [x] Verify all form patterns documented
```

---

## COMMANDS

```bash
# Typecheck after changes
pnpm -s exec tsc -p tsconfig.json --noEmit

# Find all Phosphor imports in ui/
grep -r "@phosphor-icons" components/ui/

# Find all imports of moved components
grep -r "from.*ui/count-badge" --include="*.tsx" .
grep -r "from.*ui/spinner" --include="*.tsx" .
grep -r "from.*ui/carousel-scroll-button" --include="*.tsx" .

# Update shadcn components (if needed)
pnpm dlx shadcn@latest add toast --overwrite
```

---

## FINAL STATE

After completing all tasks:

```
components/
├── ui/           # ONLY shadcn primitives
│   ├── accordion.tsx     (lucide icons)
│   ├── button.tsx        (with marketplace variants)
│   ├── badge.tsx         (with marketplace variants)
│   ├── dialog.tsx        (lucide icons)
│   ├── toast.tsx         (refactored, lucide icons)
│   └── ...
├── common/       # Custom/composed components
│   ├── count-badge.tsx   (moved from ui/)
│   ├── spinner.tsx       (moved from ui/)
│   ├── carousel-scroll-button.tsx (moved from ui/)
│   ├── field.tsx         (documented)
│   └── ...
└── [feature]/    # Feature-specific components
```

**Icons**: All `components/ui/*.tsx` use `lucide-react` only  
**Forms**: All complex forms use `Form` + `zod` + `react-hook-form`  
**Variants**: Marketplace variants (cta, deal, shipping, etc.) in button/badge only
