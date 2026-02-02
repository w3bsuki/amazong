# Desktop Header Improvement Plan

> **Target:** treido-ui agent  
> **Scope:** `components/layout/header/desktop/standard-header.tsx`  
> **Date:** 2026-02-02  
> **Status:** Ready for implementation

---

## Executive Summary

The desktop header currently "looks like text on white background, not a header." This audit combines Tailwind v4 rail violations and shadcn composition issues into a single improvement plan.

**Key Problems:**
1. No visual containment (missing border/distinct background)
2. Opacity hacks on semantic tokens
3. Button primitive overridden at callsite (10+ utility classes)
4. Raw Links styled as buttons instead of using `asChild`

---

## Spec Agent Audit Results

### TW4 Findings

| ID | Severity | Issue | Location |
|----|----------|-------|----------|
| TW4-001 | 🔴 High | `hover:border-header-text/20` - opacity modifier on semantic token | L58, L82 |
| TW4-002 | 🟡 Medium | Missing bottom border - header blends into page | L31 |
| TW4-003 | 🟢 Low | Redundant `hover:text-header-text` | L58, L82 |

### SHADCN Findings

| ID | Severity | Issue | Location |
|----|----------|-------|----------|
| SHADCN-001 | 🔴 High | Button className override explosion (~10 utilities on `size="icon"`) | L57-66 |
| SHADCN-002 | 🔴 High | Login Link styled manually, should use `Button asChild` | L73-78 |
| SHADCN-003 | 🔴 High | Register Link styled manually, should use `Button asChild` | L79-84 |
| SHADCN-004 | 🟡 Medium | `<Link><Button>` should use `asChild` pattern | L55-66 |
| SHADCN-005 | 🟢 Low | Raw `<div>` instead of `<header>` semantic element | L33 |

---

## Design Options for Visual Presence

The user question: *"container with border or full width? black? or other improvements?"*

### Option A: Full-width with bottom border (Recommended)

```tsx
<header className="hidden md:block bg-header-bg text-header-text border-b border-header-border">
  <div className="container h-16 flex items-center justify-between gap-4">
    ...
  </div>
</header>
```

**Pros:** Minimal change, works with existing tokens, clean separation  
**Cons:** Still "light" if `header-bg` = `background`

### Option B: Distinct header background token

Update `app/globals.css`:
```css
--color-header-bg: var(--surface-page); /* or a dedicated shade */
```

**Pros:** Clear visual distinction without border  
**Cons:** Requires token decision, theme awareness

### Option C: Dark header (inverted)

Create new tokens:
```css
--color-header-bg: oklch(0.2 0 0);        /* near-black */
--color-header-text: oklch(0.98 0 0);     /* near-white */
--color-header-border: oklch(0.3 0 0);    /* subtle dark border */
```

**Pros:** Strong visual hierarchy, premium feel, matches reference screenshot  
**Cons:** Requires new tokens across light/dark themes

**Recommendation:** Start with **Option A** (immediate), then evaluate **Option C** as a design decision.

---

## Implementation Tasks for treido-ui

### Phase 1: Rail Fixes (Required)

#### Task 1.1: Remove opacity hacks
Replace both instances:
```diff
- hover:border-header-text/20
+ hover:border-header-border
```

#### Task 1.2: Add bottom border
```diff
- <div className="hidden md:block bg-header-bg text-header-text">
+ <header className="hidden md:block bg-header-bg text-header-text border-b border-header-border">
```

#### Task 1.3: Remove redundant hover text
```diff
- hover:text-header-text hover:bg-header-hover
+ hover:bg-header-hover
```

### Phase 2: shadcn Composition (Required)

#### Task 2.1: Add `header-ghost` variant to Button

In `components/ui/button.tsx`:
```tsx
const buttonVariants = cva(
  // ... base
  {
    variants: {
      variant: {
        // ... existing variants
        "header-ghost": 
          "text-header-text hover:bg-header-hover border border-transparent hover:border-header-border",
      },
      // ...
    },
  }
)
```

#### Task 2.2: Refactor icon buttons
```tsx
// Before (10+ utilities)
<Link href="/sell" aria-label={t("createListing")}>
  <Button
    variant="ghost"
    size="icon"
    className="size-10 [&_svg]:size-6 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
  >
    <Camera weight="regular" />
  </Button>
</Link>

// After (variant + asChild)
<Button variant="header-ghost" size="icon" asChild>
  <Link href="/sell" aria-label={t("createListing")}>
    <Camera weight="regular" />
  </Link>
</Button>
```

#### Task 2.3: Refactor Login/Register links
```tsx
// Before
<Link
  href="/auth/login"
  className="text-sm font-medium text-header-text hover:bg-header-hover px-3 py-2 rounded-md transition-colors"
>
  {t("signIn")}
</Link>

// After
<Button variant="header-ghost" size="sm" asChild>
  <Link href="/auth/login">{t("signIn")}</Link>
</Button>
```

```tsx
// Before
<Link
  href="/auth/sign-up"
  className="text-sm font-medium bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover px-4 py-2 rounded-md transition-colors"
>
  {t("register")}
</Link>

// After
<Button variant="secondary" size="sm" asChild>
  <Link href="/auth/sign-up">{t("register")}</Link>
</Button>
```

### Phase 3: Design Enhancement (Optional)

#### Task 3.1: Evaluate dark header

If approved, update `app/globals.css` in `:root`:
```css
/* Desktop header - dark variant */
--color-header-bg: oklch(0.15 0 0);
--color-header-text: oklch(0.95 0 0);
--color-header-text-muted: oklch(0.7 0 0);
--color-header-border: oklch(0.25 0 0);
--color-header-hover: oklch(0.25 0 0);
```

And in `.dark`:
```css
--color-header-bg: oklch(0.1 0 0);
/* ... */
```

---

## Acceptance Criteria

- [ ] No opacity modifiers on semantic tokens
- [ ] Header has visible bottom border
- [ ] Button variant `header-ghost` exists
- [ ] All Links using button styles use `Button asChild`
- [ ] Button className overrides reduced to ≤2 utilities
- [ ] `<header>` semantic element used
- [ ] `pnpm -s styles:gate` passes
- [ ] `pnpm -s typecheck` passes
- [ ] Visual inspection confirms header has distinct presence

---

## Propagation Note

The same pattern issues exist in:
- `components/dropdowns/account-dropdown.tsx`
- `components/dropdowns/wishlist-dropdown.tsx`
- `components/dropdowns/messages-dropdown.tsx`
- `components/dropdowns/notifications-dropdown.tsx`
- `components/layout/header/cart/cart-dropdown.tsx`

After fixing `standard-header.tsx`, apply the `header-ghost` variant to all dropdown trigger buttons for consistency.

---

## Summary for treido-ui

**Trigger:** `UI: Improve desktop header visual presence and fix rail violations`

**Files to modify:**
1. `components/ui/button.tsx` - add `header-ghost` variant
2. `components/layout/header/desktop/standard-header.tsx` - refactor per Phase 1+2
3. `app/globals.css` - add `--color-header-border-hover` if needed (or skip if using `header-border`)

**Estimated batch:** 2 files (Button + Header), verify, then optionally Phase 3
