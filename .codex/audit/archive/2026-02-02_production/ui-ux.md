# UI/UX Audit Report

> **Date**: 2026-02-02  
> **Auditor**: treido-ui + spec-tailwind + spec-shadcn  
> **Scope**: Tailwind v4, shadcn purity, Component consistency, Accessibility, Responsive, Loading/Error states

---

## Executive Summary

| Category | Status | Issues |
|----------|--------|--------|
| Tailwind v4 Compliance | ⚠️ Warning | 4 opacity hack patterns |
| shadcn Component Purity | ⚠️ Warning | Story files in ui/ |
| Component Consistency | ✅ Pass | Well-designed system |
| Accessibility | ✅ Pass | Good coverage |
| Responsive Design | ✅ Pass | Mobile/desktop handled |
| Loading States | ✅ Pass | 57 loading.tsx + 12 skeletons |
| Error States | ✅ Pass | Good validation |
| Visual Polish | ✅ Pass | Consistent tokens |

**Overall Grade**: ✅ **Production Ready with Minor Fixes**

---

## Positive Findings ✅

### Tailwind v4 Rails — Mostly Clean

| Pattern | Status |
|---------|--------|
| Palette colors (`bg-gray-*`) | ✅ Clean |
| Gradients (`bg-gradient-to-*`) | ✅ Clean |
| Arbitrary colors (`bg-[#fff]`) | ✅ Clean |
| Hardcoded (`bg-white`, `text-black`) | ✅ Clean |

### Design System Excellent

1. **Touch target system**: `h-touch-*` tokens (32-56px)
2. **Button sizes**: 6 variants from xs to xl
3. **Semantic tokens**: OKLCH-based color system
4. **Status tokens**: success/warning/error/info with subtle variants

### Accessibility Good

| Check | Status |
|-------|--------|
| Focus rings | ✅ `focus-visible:ring-2` |
| Touch targets | ✅ ≥32px via `h-touch-*` |
| ARIA labels | ✅ 50+ usages |
| Keyboard nav | ✅ Radix primitives |
| Color contrast | ✅ Defined tokens |

---

## Tailwind v4 Violations — Opacity Hacks

### UI-001: Status badge opacity hacks

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **File** | `app/[locale]/(business)/_components/products-table.tsx#L417` |
| **Pattern** | `bg-success/10`, `bg-warning/10`, `bg-destructive/10` |
| **Fix** | Use `--success-subtle`, `--warning-subtle`, `--destructive-subtle` tokens |
| **Phase** | 2 |

---

### UI-002: Profile overlay opacity hacks

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **File** | `app/[locale]/[username]/profile-client.tsx#L224-L258` |
| **Pattern** | `bg-background/40`, `border-success/20`, `bg-success/10` |
| **Fix** | Create semantic overlay variants |
| **Phase** | 2 |

---

### UI-003: Admin activity badge opacity hacks

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **File** | `app/[locale]/(admin)/_components/admin-recent-activity.tsx#L63-L101` |
| **Pattern** | Status badges with `/10`, `/20` opacity |
| **Fix** | Extract to shared badge variants |
| **Phase** | 2 |

---

### UI-004: Sell form validation opacity hacks

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Files** | Various in `app/[locale]/(sell)/_components/` |
| **Pattern** | `destructive/5`, `destructive/50`, `success/10` |
| **Fix** | Create form validation semantic tokens |
| **Phase** | 3 |

---

## shadcn Boundary Violations

### UI-005: Storybook files in components/ui/

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Directory** | `components/ui/` |
| **Count** | 35 `.stories.tsx` files |
| **Fix** | Move to `.storybook/stories/` or configure exclusion |
| **Phase** | 3 |

---

## External Violations (temp-tradesphere-audit/)

**Not part of main codebase** — should be excluded or cleaned up:
- `text-red-300`, `text-red-50`, `ring-red-400` in toast.tsx
- `bg-black/80` in dialog.tsx, drawer.tsx, sheet.tsx

**Recommendation**: Delete or exclude from build.

---

## Component Consistency ✅

### Button Sizes Verified

| Size | Height | Touch-Safe |
|------|--------|------------|
| xs | 32px | ⚠️ Mobile min |
| sm | 36px | ⚠️ Compact |
| default | 44px | ✅ Standard |
| lg | 48px | ✅ |
| xl | 56px | ✅ Hero |
| icon | 44px | ✅ |

### Card Patterns Verified
- Consistent flat design (border, no shadow)
- Proper tokens: `bg-card`, `text-card-foreground`, `border-border`
- Composable: Header, Title, Description, Content, Footer, Action

---

## Loading States ✅

### Skeleton Components (12 files)
- `skeleton.tsx` — Base primitive
- `product-grid-skeleton.tsx`
- `quick-view-skeleton.tsx`
- `chat-skeleton.tsx`
- `sellers-loading-skeleton.tsx`
- `seller-dashboard-loading-skeleton.tsx`
- `members-loading-skeleton.tsx`
- `sell-section-skeleton.tsx`
- `gift-cards-loading-skeleton.tsx`
- `about-page-skeleton.tsx`

### Route Loading (57 files)
All major routes have `loading.tsx` files.

---

## Error States ✅

### Form Validation
```tsx
"aria-invalid:border-destructive aria-invalid:ring-destructive/20"
```

### Error Boundaries
- `sell-error-boundary.tsx`
- `error-boundary-ui.tsx`

### Empty States
- `empty-state-cta.tsx`
- `sellers-empty-state.tsx`
- Category modal empty states

---

## Summary by Phase

### Phase 2 — High Priority (3 items)
- UI-001: Fix products-table status badge opacity
- UI-002: Fix profile-client overlay opacity
- UI-003: Fix admin-recent-activity badge opacity

### Phase 3 — Medium Priority (2 items)
- UI-004: Fix sell form validation opacity
- UI-005: Move story files out of components/ui/

### Maintenance
- Delete or exclude `temp-tradesphere-audit/` folder

---

## Recommendations

### Create Badge Variants

Add to `components/ui/badge.tsx`:
```tsx
const badgeVariants = cva(..., {
  variants: {
    variant: {
      // Add these
      successSubtle: "bg-success-subtle text-success border-success-subtle-border",
      warningSubtle: "bg-warning-subtle text-warning border-warning-subtle-border",
      infoSubtle: "bg-info-subtle text-info border-info-subtle-border",
      destructiveSubtle: "bg-destructive-subtle text-destructive border-destructive-subtle-border",
    }
  }
})
```

### Document Touch Tokens

Add to design docs:
```markdown
## Touch Target System
- `h-touch-xs`: 32px (minimum mobile)
- `h-touch-sm`: 36px (compact)
- `h-touch`: 44px (standard)
- `h-touch-lg`: 48px (prominent)
```

### Run Regularly

```bash
pnpm -s styles:gate  # Catches new violations
```

---

## Effort Estimates

| Phase | Items | Est. Hours |
|-------|-------|------------|
| 2 | 3 | 2h |
| 3 | 2 | 1h |
| **Total** | **5** | **3h** |

---

*Audit complete — 2026-02-02*
