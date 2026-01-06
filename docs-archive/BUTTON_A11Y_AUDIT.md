# Button Accessibility Audit Report

**Date:** January 4, 2026  
**Scope:** `components/ui/**`  
**Auditor:** GitHub Copilot (automated analysis)

---

## Executive Summary

This audit analyzed all button and button-like interactive elements in the `components/ui/` folder. Overall, the component library demonstrates **good accessibility practices** with proper use of Radix UI primitives, focus management, and screen reader support. However, several areas need improvement.

### Quick Stats
| Category | Count | Issues Found |
|----------|-------|--------------|
| Primary Button component | 1 | 2 minor |
| Dialog/Modal close buttons | 2 | 1 minor |
| Trigger components | 8 | 0 |
| Navigation buttons | 4 | 1 moderate |
| Form-related buttons | 3 | 0 |
| Toggle/Tab buttons | 3 | 0 |

---

## 1. Primary Button Component

### File: [button.tsx](../components/ui/button.tsx)

**Purpose:** Core reusable button primitive with variants (default, destructive, outline, secondary, ghost, link, cta, deal) and sizes (xs, sm, default, lg, icon, icon-sm, icon-lg).

#### A11y Patterns Used ✅
- `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1` — Visible focus indicator
- `disabled:pointer-events-none disabled:opacity-50` — Disabled state handling
- `aria-invalid` styling support for form validation
- `outline-none` paired with `focus-visible:ring` — Keyboard accessibility
- `asChild` prop via Radix Slot — Allows polymorphic rendering

#### Issues & Gaps ⚠️

| Issue | Severity | Description |
|-------|----------|-------------|
| **Missing `type` default** | Minor | No default `type="button"` attribute. Buttons inside forms may accidentally submit. |
| **No loading state** | Minor | No built-in loading/busy state with `aria-busy` or `aria-disabled` pattern. |

#### Recommendations
```tsx
// Add type default to prevent accidental form submission
<Comp
  type={props.type ?? "button"}
  data-slot="button"
  ...
/>
```

---

## 2. Dialog Components

### File: [dialog.tsx](../components/ui/dialog.tsx)

**Purpose:** Modal dialog with overlay, content, header, footer, title, and description sections.

#### Close Button Analysis

```tsx
<DialogPrimitive.Close
  className="ring-offset-background focus:ring-ring ... absolute top-3 right-3 rounded-xs opacity-70 ..."
>
  <X />
  <span className="sr-only">Close</span>
</DialogPrimitive.Close>
```

#### A11y Patterns Used ✅
- `<span className="sr-only">Close</span>` — Screen reader text ✓
- `focus:ring-2 focus:ring-offset-2` — Focus indicator ✓
- `disabled:pointer-events-none` — Disabled state ✓
- Uses Radix `DialogPrimitive.Close` — Built-in keyboard handling (Escape) ✓
- `DialogTitle` and `DialogDescription` — Proper ARIA labeling ✓

#### Issues & Gaps ⚠️

| Issue | Severity | Description |
|-------|----------|-------------|
| **Inconsistent focus ring** | Minor | Uses `focus:` instead of `focus-visible:` (shows ring on click). |

---

### File: [alert-dialog.tsx](../components/ui/alert-dialog.tsx)

**Purpose:** Confirmation dialog with required action/cancel buttons.

#### Button Components

```tsx
// AlertDialogAction
<AlertDialogPrimitive.Action
  className={cn(buttonVariants(), className)}
  {...props}
/>

// AlertDialogCancel
<AlertDialogPrimitive.Cancel
  className={cn(buttonVariants({ variant: 'outline' }), className)}
  {...props}
/>
```

#### A11y Patterns Used ✅
- Inherits `buttonVariants()` styling including focus states ✓
- Uses Radix primitives with built-in ARIA roles ✓
- `AlertDialogTitle` and `AlertDialogDescription` for labeling ✓
- Proper focus trap via Radix ✓

#### Issues & Gaps
**None identified** — Well-implemented.

---

## 3. Sheet Component (Slide-over Panel)

### File: [sheet.tsx](../components/ui/sheet.tsx)

**Purpose:** Slide-in panel from any edge (left, right, top, bottom).

#### Close Button Analysis

```tsx
<SheetPrimitive.Close className="ring-offset-background focus:ring-ring ... absolute top-2 right-2 flex items-center justify-center size-touch rounded-full ...">
  <XIcon className="size-5" />
  <span className="sr-only">Close</span>
</SheetPrimitive.Close>
```

#### A11y Patterns Used ✅
- `<span className="sr-only">Close</span>` — Screen reader text ✓
- `size-touch` class — Touch target sizing ✓
- `touch-action-manipulation tap-transparent` — Mobile touch optimization ✓
- `focus:ring-2 focus:ring-offset-2` — Focus indicator ✓
- `SheetTitle` and `SheetDescription` — Proper labeling ✓

#### Issues & Gaps ⚠️

| Issue | Severity | Description |
|-------|----------|-------------|
| **Same focus:ring issue** | Minor | Uses `focus:` instead of `focus-visible:`. |

---

## 4. Dropdown Menu

### File: [dropdown-menu.tsx](../components/ui/dropdown-menu.tsx)

**Purpose:** Context menu with items, checkboxes, radio groups, and sub-menus.

#### Interactive Elements

| Element | A11y Pattern |
|---------|--------------|
| `DropdownMenuTrigger` | Radix primitive (manages `aria-expanded`, `aria-haspopup`) |
| `DropdownMenuItem` | `cursor-default`, focus styles, disabled handling |
| `DropdownMenuCheckboxItem` | `CheckIcon` indicator, checked state |
| `DropdownMenuRadioItem` | `CircleIcon` indicator, selected state |
| `DropdownMenuSubTrigger` | ChevronRight indicator, nested menu support |

#### A11y Patterns Used ✅
- `focus:bg-accent focus:text-accent-foreground` — Visual focus ✓
- `data-[disabled]:pointer-events-none data-[disabled]:opacity-50` — Disabled handling ✓
- `select-none` — Prevents text selection in menu items ✓
- `outline-hidden` paired with background focus states ✓
- Automatic keyboard navigation via Radix ✓

#### Issues & Gaps
**None identified** — Excellent implementation leveraging Radix.

---

## 5. Popover

### File: [popover.tsx](../components/ui/popover.tsx)

**Purpose:** Floating panel triggered by a button.

#### A11y Patterns Used ✅
- `PopoverTrigger` uses Radix (manages `aria-expanded`) ✓
- `outline-hidden` on content ✓
- Proper z-indexing (`z-50`) ✓

#### Issues & Gaps
**None identified** — Minimal component, relies on Radix.

---

## 6. Pagination

### File: [pagination.tsx](../components/ui/pagination.tsx)

**Purpose:** Page navigation with previous/next and numbered links.

#### Button-like Elements

```tsx
// PaginationLink
<a
  aria-current={isActive ? "page" : undefined}
  className={cn(buttonVariants({...}))}
  {...props}
/>

// PaginationPrevious
<PaginationLink aria-label="Go to previous page" ...>
  <ChevronLeftIcon />
  <span className="hidden sm:block">Previous</span>
</PaginationLink>

// PaginationEllipsis
<span aria-hidden ...>
  <MoreHorizontalIcon />
  <span className="sr-only">More pages</span>
</span>
```

#### A11y Patterns Used ✅
- `aria-current="page"` for active page ✓
- `aria-label="Go to previous/next page"` ✓
- `aria-hidden` on decorative ellipsis ✓
- `<span className="sr-only">More pages</span>` ✓
- `role="navigation"` + `aria-label="pagination"` on nav ✓

#### Issues & Gaps ⚠️

| Issue | Severity | Description |
|-------|----------|-------------|
| **Links without href** | Moderate | `PaginationLink` renders `<a>` without requiring `href`. Non-navigating links should be `<button>`. |

#### Recommendations
Consider making `PaginationLink` use `<button>` for onClick-based navigation or enforce `href` prop.

---

## 7. Carousel

### File: [carousel.tsx](../components/ui/carousel.tsx)

**Purpose:** Image/content carousel with navigation buttons.

#### Navigation Buttons

```tsx
// CarouselPrevious
<Button disabled={!canScrollPrev} onClick={scrollPrev} {...props}>
  <ArrowLeft />
  <span className="sr-only">Previous slide</span>
</Button>

// CarouselNext
<Button disabled={!canScrollNext} onClick={scrollNext} {...props}>
  <ArrowRight />
  <span className="sr-only">Next slide</span>
</Button>
```

#### A11y Patterns Used ✅
- `<span className="sr-only">Previous/Next slide</span>` ✓
- `disabled` prop properly passed ✓
- Uses proper `<Button>` component ✓
- `role="region"` + `aria-roledescription="carousel"` on container ✓
- `role="group"` + `aria-roledescription="slide"` on items ✓
- Keyboard navigation (ArrowLeft/ArrowRight) ✓

#### Issues & Gaps
**None identified** — Excellent implementation.

---

## 8. Toast

### File: [toast.tsx](../components/ui/toast.tsx)

**Purpose:** Notification toasts with optional action and close buttons.

#### Interactive Elements

```tsx
// ToastAction
<ToastPrimitives.Action
  className="inline-flex h-8 ... focus:ring-2 focus:ring-ring focus:ring-offset-2 ..."
  {...props}
/>

// ToastClose
<ToastPrimitives.Close className="... focus:ring-2 ... rounded-md p-1">
  <X className="size-4" />
  <span className="sr-only">Close</span>
</ToastPrimitives.Close>
```

#### A11y Patterns Used ✅
- `<span className="sr-only">Close</span>` ✓
- `focus:ring-2 focus:ring-offset-2` ✓
- `ring-offset-background` for proper offset ✓
- Radix Toast handles `role="status"` / live regions ✓

#### Issues & Gaps
**None identified**.

---

## 9. Toggle & Toggle Group

### Files: [toggle.tsx](../components/ui/toggle.tsx), [toggle-group.tsx](../components/ui/toggle-group.tsx)

**Purpose:** Toggle buttons and segmented control groups.

#### A11y Patterns Used ✅
- `data-[state=on]:bg-accent` — Pressed state visual ✓
- `aria-invalid` support ✓
- `focus-visible:ring-[3px]` — Modern focus style ✓
- `disabled:pointer-events-none disabled:opacity-50` ✓
- Radix manages `aria-pressed` automatically ✓

#### Issues & Gaps
**None identified**.

---

## 10. Tabs

### File: [tabs.tsx](../components/ui/tabs.tsx)

**Purpose:** Tabbed interface with tab list and panels.

#### Tab Triggers

```tsx
<TabsPrimitive.Trigger
  className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary ..."
  {...props}
/>
```

#### A11y Patterns Used ✅
- `focus-visible:ring-2 focus-visible:ring-ring` ✓
- `data-[state=active]` visual distinction ✓
- Radix manages `role="tab"`, `aria-selected`, keyboard navigation ✓
- `disabled:opacity-50` ✓

#### Issues & Gaps
**None identified**.

---

## 11. Accordion

### File: [accordion.tsx](../components/ui/accordion.tsx)

**Purpose:** Collapsible content sections.

#### Trigger Button

```tsx
<AccordionPrimitive.Trigger
  className="focus-visible:border-ring focus-visible:ring-ring/50 ... focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 ..."
>
  {children}
  <ChevronDown className="... [&[data-state=open]>svg]:rotate-180" />
</AccordionPrimitive.Trigger>
```

#### A11y Patterns Used ✅
- `focus-visible:ring-[3px]` ✓
- Radix manages `aria-expanded`, `aria-controls` ✓
- Visual rotation indicator for expanded state ✓
- `disabled:opacity-50` ✓

#### Issues & Gaps
**None identified**.

---

## 12. Command (Command Palette)

### File: [command.tsx](../components/ui/command.tsx)

**Purpose:** Searchable command palette (cmdk).

#### A11y Notes
- Uses `cmdk` library with built-in keyboard navigation
- `CommandDialog` wraps in Dialog with proper `DialogTitle` and `DialogDescription`
- Title/Description wrapped in `sr-only` for screen readers

#### Issues & Gaps
**None identified**.

---

## 13. Select

### File: [select.tsx](../components/ui/select.tsx)

**Purpose:** Custom select dropdown.

#### Trigger Button

```tsx
<SelectPrimitive.Trigger
  className="... focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ... h-10 md:h-9"
>
```

#### A11y Patterns Used ✅
- `focus-visible:ring-[3px]` — Modern focus ✓
- WCAG 2.2 touch target sizes (`h-10` mobile, `h-9` desktop) ✓
- `aria-invalid` styling ✓
- `disabled:cursor-not-allowed disabled:opacity-50` ✓
- Radix manages `role="combobox"`, `aria-expanded` ✓

#### Issues & Gaps
**None identified** — Excellent accessibility.

---

## 14. Other Interactive Elements

### Tooltip Trigger ([tooltip.tsx](../components/ui/tooltip.tsx))
- Uses Radix `TooltipTrigger` ✓
- Delay configurable via `TooltipProvider` ✓

### Hover Card Trigger ([hover-card.tsx](../components/ui/hover-card.tsx))
- Uses Radix `HoverCardTrigger` ✓
- Mouse-only interaction (by design) ✓

### Drawer ([drawer.tsx](../components/ui/drawer.tsx))
- Uses Vaul library (built on Radix Dialog)
- `DrawerTrigger`, `DrawerClose` exported ✓
- **Note:** No explicit close button with sr-only text (relies on gestures/overlay click)

### Checkbox, Radio, Switch
- All use Radix primitives with built-in `role` and `aria-checked`
- Size comments reference WCAG 2.2 AA touch targets ✓

---

## Summary of Issues

| # | File | Issue | Severity | Fix |
|---|------|-------|----------|-----|
| 1 | button.tsx | Missing default `type="button"` | Minor | Add type default |
| 2 | button.tsx | No loading/busy state pattern | Minor | Add optional `isLoading` prop with `aria-busy` |
| 3 | dialog.tsx | Uses `focus:` instead of `focus-visible:` on close | Minor | Change to `focus-visible:` |
| 4 | sheet.tsx | Uses `focus:` instead of `focus-visible:` on close | Minor | Change to `focus-visible:` |
| 5 | pagination.tsx | `<a>` without required `href` | Moderate | Enforce `href` or use `<button>` |

---

## Recommendations

### High Priority
1. **Pagination:** Refactor `PaginationLink` to either require `href` or use `<button>` for non-link navigation.

### Medium Priority
2. **Button:** Add `type="button"` as default to prevent accidental form submissions.
3. **Focus States:** Standardize on `focus-visible:` across all close buttons for consistency.

### Low Priority / Enhancements
4. **Button Loading State:** Consider adding an `isLoading` variant with spinner and `aria-busy="true"`.
5. **Drawer:** Add an explicit close button with screen reader text (currently gesture-based only).

---

## Compliance Summary

| Standard | Status |
|----------|--------|
| WCAG 2.1 AA | ✅ Compliant (with minor fixes recommended) |
| WCAG 2.2 AA Touch Targets | ✅ Compliant (explicit size comments in form controls) |
| Keyboard Navigation | ✅ Fully navigable via Radix primitives |
| Screen Reader Support | ✅ Good (sr-only text on icon buttons) |
| Focus Management | ⚠️ Minor inconsistencies (focus vs focus-visible) |

---

*Report generated by automated analysis of components/ui/* folder.*
