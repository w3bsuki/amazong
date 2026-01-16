# Mobile Layout Audit Prompt

**Created:** 2026-01-15  
**Purpose:** Comprehensive mobile layout review for design consistency and token compliance

---

## How to Use

Copy the prompt below and paste it to start a mobile layout audit:

```
Run the mobile layout audit from docs/guides/MOBILE-LAYOUT-AUDIT-PROMPT.md on the codebase. 
Focus on mobile-only components and responsive sections.
Report findings with file paths, current values, and recommended fixes.
```

---

## Full Audit Prompt

Review the mobile layout implementation for design consistency and token usage.

### 1. Height Tokens (8px Grid Compliance)

Check that all mobile component heights use 8px multiples:

| Height | Rem | Use Case |
|--------|-----|----------|
| 32px | 2rem | Pills, tags, small buttons |
| 40px | 2.5rem | Header row, search, touch targets |
| 44px | 2.75rem | Inputs, buttons |
| 48px | 3rem | Bottom nav, large touch targets |
| 56px | 3.5rem | Category circles |
| 64-80px | 4-5rem | Banners, promos |

Scan for violations:

```bash
# Find arbitrary pixel heights
grep -rn "h-\[.*px\]" components/ app/ --include="*.tsx"

# Find non-8px grid heights (h-7=28px, h-9=36px, h-11=44px is OK)
grep -rn "h-7\|h-9" components/ app/ --include="*.tsx"
```

### 2. Touch Target Compliance

All interactive elements must be ≥40px (WCAG 2.2):

| Element | Required Size | Token/Class |
|---------|---------------|-------------|
| Header icons | 40px | `size-(--spacing-touch)` or `size-10` |
| Bottom nav | 48px | `h-(--spacing-touch-lg)` or `h-12` |
| Buttons | ≥40px | `min-h-10` or `min-h-11` |
| List items | ≥48px | `min-h-12` |
| Form inputs | ≥44px | `h-11` or `h-(--spacing-input)` |

Scan for small touch targets:

```bash
# Find potentially undersized interactive elements
grep -rn "size-6\|size-7\|size-8\|h-6\|h-7\|h-8" components/ --include="*.tsx" | grep -iE "button|link|click|tap"
```

### 3. Token Usage vs Hardcoded Values

Prefer design tokens over arbitrary values:

**✅ Good:**
```tsx
size-(--spacing-touch)
h-(--spacing-touch-lg)
size-10, size-12  // when matching token values
h-(--spacing-input)
```

**❌ Bad:**
```tsx
size-[40px]   // use size-(--spacing-touch) instead
h-[48px]      // use h-(--spacing-touch-lg) instead
w-[26px]      // use size={26} for Phosphor icons
```

Scan for arbitrary values:

```bash
grep -rn "size-\[.*px\]\|h-\[.*px\]\|w-\[.*px\]" components/ --include="*.tsx"
```

### 4. Mobile-Specific Files to Audit

Priority order:

1. `components/mobile/*.tsx` — All mobile-specific components
2. `components/layout/header/site-header.tsx` — Mobile header section
3. `components/layout/sidebar/sidebar-menu-v2.tsx` — Mobile menu
4. `components/dropdowns/*.tsx` — Mobile dropdown behavior
5. `components/shared/wishlist/*.tsx` — Mobile wishlist
6. `app/[locale]/**/page.tsx` — Mobile page views

### 5. Spacing Consistency (8px Grid)

Check padding/margins use standard scale:

| Class | Size | Use Case |
|-------|------|----------|
| `px-4` | 16px | Page inset (--page-inset) |
| `gap-2` | 8px | Tight grouping |
| `gap-3` | 12px | Default grouping |
| `gap-4` | 16px | Section spacing |
| `py-2` | 8px | Compact padding |
| `py-3` | 12px | Standard padding |
| `py-4` | 16px | Generous padding |

### 6. Typography Mobile Scale

| Element | Size | Class |
|---------|------|-------|
| Body | 14-16px | `text-sm` or `text-base` |
| Secondary | 12px | `text-xs` |
| Caption | 10-11px | `text-2xs` or `text-tiny` |
| H1 | 20-24px | `text-xl` or `text-2xl` |
| H2 | 18px | `text-lg` |

**Rule:** No text smaller than `text-2xs` (10px) on mobile.

### 7. Icon Sizing

| Context | Icon Size | Touch Target |
|---------|-----------|--------------|
| Header | 26px (`size={26}`) | 40px |
| Bottom nav | 24px (`size={24}`) | 48px container |
| Inline | 16-20px | N/A |
| Cards | 20-24px | Depends on action |

---

## Commands to Run

```bash
# Find all mobile components
find components -name "*mobile*" -o -name "*Mobile*"

# Check height consistency in mobile components
grep -rn "h-10\|h-11\|h-12" components/mobile/ --include="*.tsx"

# Find potential token violations
grep -rn "\[.*px\]" components/mobile/ --include="*.tsx"

# Find small sizes that might be touch target issues
grep -rn "size-[4-8]\b" components/ --include="*.tsx"

# Check for consistent touch token usage
grep -rn "spacing-touch" components/ --include="*.tsx"
```

---

## Report Format

For each issue found, report:

```markdown
### [Component Name]

**File:** `path/to/file.tsx`  
**Line:** 123  
**Issue:** Description of the problem  
**Current:** `h-9` (36px)  
**Recommended:** `h-10` (40px) or `h-(--spacing-touch)`  
**Priority:** P1
```

### Priority Levels

| Level | Description |
|-------|-------------|
| P0 | Touch target < 24px (WCAG violation) |
| P1 | Touch target < 40px (usability issue) |
| P2 | Non-8px grid height (visual inconsistency) |
| P3 | Hardcoded value where token exists (maintainability) |

---

## Expected Outcome

1. **List of files** with non-compliant heights
2. **Token usage recommendations** per file
3. **Touch target violations** with severity
4. **Overall mobile design score:**
   - ✅ Compliant — No P0/P1 issues
   - ⚠️ Needs work — Has P1/P2 issues
   - ❌ Critical — Has P0 issues

---

## Reference Docs

- [MOBILE-TOUCH-TARGETS.md](./MOBILE-TOUCH-TARGETS.md) — Touch target implementation guide
- [MOBILE-AUDIT-PLAN.md](./MOBILE-AUDIT-PLAN.md) — Full audit plan by route
- [../DESIGN.md](../DESIGN.md) — Design tokens reference
