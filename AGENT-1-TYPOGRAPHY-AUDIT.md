# AGENT-1: Typography Audit & Standardization

> **Parallel Agent** - Run alongside AGENT-2 and AGENT-3 after AGENT-0 completes.
> **Scope**: Typography ONLY - font sizes, weights, line heights, letter spacing
> **Do NOT touch**: Colors, spacing, padding, layout, shadows

---

## Mission

Audit and fix ALL typography inconsistencies across the codebase:
1. Standardize font sizes to the defined scale
2. Fix font weight usage
3. Ensure proper line heights and letter spacing
4. Remove arbitrary font-related values

---

## MCP Tools Available

- **Playwright MCP**: Take screenshots before/after changes for visual regression
- **Context7 MCP**: Look up Tailwind CSS v4 typography best practices

### Context7 MCP Usage

```
// Query typography best practices
context7.search("Tailwind CSS v4 typography scale")
context7.search("shadcn/ui text sizing patterns")
context7.search("Inter font best practices line height")
```

### Playwright MCP Usage

```javascript
// Before making changes, screenshot the page
await page.goto('/sell');
await page.screenshot({ path: 'before-sell-typography.png', fullPage: true });

// After changes
await page.screenshot({ path: 'after-sell-typography.png', fullPage: true });
```

---

## Typography Scale Reference

### Font Sizes (ONLY use these)

| Class | Size | Use Case |
|-------|------|----------|
| `text-2xs` | 10px | Tiny badges, micro labels |
| `text-xs` | 12px | Meta text, captions, helper text |
| `text-sm` | 14px | **Body text (DEFAULT)** |
| `text-base` | 16px | Prices, emphasis |
| `text-lg` | 18px | Section titles |
| `text-xl` | 20px | Page titles |
| `text-2xl` | 24px | Hero headlines only |
| `text-3xl`+ | 30px+ | Marketing/hero only |

### Font Weights

| Class | Weight | Use Case |
|-------|--------|----------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, navigation, emphasis |
| `font-semibold` | 600 | Prices, CTAs, headings |
| `font-bold` | 700 | Hero headlines ONLY |

### Line Clamping

```tsx
// Single line truncation
className="line-clamp-1"

// Title truncation (2 lines)
className="line-clamp-2"

// Description truncation (3 lines)
className="line-clamp-3"
```

---

## Phase 1: Audit Priority Pages (45 min)

### High Priority Routes to Audit

Screenshot each page BEFORE making any changes:

1. **`/sell`** - Product listing form (BIGGEST typography issues reported)
2. **`/account`** - Account dashboard
3. **`/plans`** - Pricing/plans page
4. **`/product/[slug]`** - Product detail page
5. **`/`** - Homepage

### What to Look For

```bash
# Find arbitrary font sizes
grep -r "text-\[" --include="*.tsx" app/ components/ | grep -E "text-\[\d+px\]"

# Find font size inconsistencies in /sell
grep -r "text-" --include="*.tsx" app/\[locale\]/\(sell\)/
```

**Red Flags:**
- `text-[13px]` → should be `text-sm`
- `text-[15px]` → should be `text-sm` or `text-base`
- `text-[11px]` → should be `text-xs` or `text-2xs`
- Mixed weights in same context (e.g., some labels `font-medium`, others `font-semibold`)

---

## Phase 2: /sell Route Typography Fix (30 min)

### Files to Audit

```
app/[locale]/(sell)/_components/
├── fields/          # Form field components
├── layouts/         # Layout wrappers
├── steps/           # Multi-step form steps
└── ui/              # Route-specific UI
```

### Standard Form Typography Pattern

```tsx
// Form section header
<h3 className="text-sm font-semibold text-foreground">
  Section Title
</h3>

// Form description
<p className="text-xs text-muted-foreground mt-1">
  Helper description text
</p>

// Form label
<Label className="text-sm font-medium text-foreground">
  Field Label
</Label>

// Input text
<Input className="text-sm" />

// Helper text
<p className="text-xs text-muted-foreground">
  Additional instructions
</p>

// Error text
<p className="text-xs text-destructive">
  Error message
</p>
```

### Fix Checklist for /sell

- [ ] All form labels use `text-sm font-medium`
- [ ] All helper text uses `text-xs text-muted-foreground`
- [ ] All section headers use `text-sm font-semibold` or `text-base font-semibold`
- [ ] All input text is `text-sm`
- [ ] No arbitrary font sizes
- [ ] Consistent weight across similar elements

---

## Phase 3: /account Route Typography Fix (30 min)

### Files to Audit

```
app/[locale]/(account)/account/
├── _components/     # Shared account components
├── orders/          # Orders section
├── sales/           # Sales section
├── billing/         # Billing section
└── page.tsx         # Main account page
```

### Standard Account Page Typography

```tsx
// Page title
<h1 className="text-xl font-semibold text-foreground">
  Account Settings
</h1>

// Section title
<h2 className="text-lg font-semibold text-foreground">
  Orders
</h2>

// Stat value
<span className="text-2xl font-semibold text-foreground">
  {count}
</span>

// Stat label
<span className="text-xs text-muted-foreground">
  Total Orders
</span>

// Table header
<th className="text-xs font-medium text-muted-foreground">
  Column Name
</th>

// Table cell
<td className="text-sm text-foreground">
  Cell content
</td>
```

---

## Phase 4: /plans Route Typography Fix (20 min)

### Files to Audit

```
components/pricing/plan-card.tsx
app/[locale]/(main)/plans/ (if exists)
```

### Standard Pricing Typography

```tsx
// Plan name
<h3 className="text-lg font-semibold text-foreground">
  Pro Plan
</h3>

// Price
<span className="text-3xl font-bold text-foreground">
  $29
</span>

// Period
<span className="text-sm text-muted-foreground">
  /month
</span>

// Feature list item
<li className="text-sm text-foreground">
  Feature description
</li>

// Feature checkmark
<Check className="size-4 text-success" />
```

---

## Phase 5: Product Page Typography Fix (20 min)

### Files to Audit

```
app/[locale]/(main)/product/[slug]/
components/shared/product/
components/mobile/product/
```

### Standard Product Typography

```tsx
// Product title
<h1 className="text-lg md:text-xl font-semibold text-foreground line-clamp-2">
  {product.name}
</h1>

// Price - regular
<span className="text-xl font-semibold text-foreground">
  ${price}
</span>

// Price - sale
<span className="text-xl font-semibold text-price-sale">
  ${salePrice}
</span>

// Original price (strikethrough)
<span className="text-sm text-muted-foreground line-through">
  ${originalPrice}
</span>

// Seller name
<span className="text-sm text-foreground">
  {seller.name}
</span>

// Product description
<div className="text-sm text-foreground leading-relaxed">
  {description}
</div>

// Meta info (SKU, category, etc.)
<span className="text-xs text-muted-foreground">
  SKU: {sku}
</span>
```

---

## Phase 6: Global Components Typography Audit (20 min)

### Files to Check

```
components/ui/button.tsx      # Button text sizes
components/ui/badge.tsx       # Badge text sizes
components/ui/card.tsx        # Card text patterns
components/common/            # Shared components
components/layout/header/     # Header typography
components/layout/footer/     # Footer typography
```

### Button Text Standards

```tsx
// Button sizes
size="xs"     → text-xs
size="sm"     → text-sm
size="default" → text-sm
size="lg"     → text-sm (not larger!)
```

### Badge Text Standards

```tsx
// All badges should use
className="text-2xs" // 10px for tiny badges
// or
className="text-xs"  // 12px for readable badges
```

---

## Verification Checklist

After each file edit, verify:

- [ ] No arbitrary font sizes (`text-[Npx]`)
- [ ] No arbitrary font weights (`font-[500]`)
- [ ] Weights match context (labels=medium, headings=semibold, body=normal)
- [ ] Line clamp used for truncation (not `overflow-hidden text-ellipsis`)
- [ ] Proper hierarchy (h1 > h2 > h3 visually distinct)

### Run Gates

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# Visual check with Playwright
pnpm test:e2e:smoke
```

---

## Files to NOT Touch

These are handled by other agents:

- ❌ Spacing (`gap-*`, `p-*`, `m-*`) - AGENT-2
- ❌ Colors (`bg-*`, `text-<color>`) - AGENT-3
- ❌ Shadows (`shadow-*`) - AGENT-3
- ❌ Borders (`border-*`, `rounded-*`) - AGENT-3
- ❌ Layout (`grid`, `flex`, `container`) - AGENT-2

---

## Commit Strategy

Make small, focused commits:

```bash
git commit -m "fix(typography): standardize /sell form typography"
git commit -m "fix(typography): standardize /account page typography"
git commit -m "fix(typography): standardize pricing cards typography"
git commit -m "fix(typography): standardize product page typography"
```

---

## Success Criteria

- [ ] Zero arbitrary font sizes in scan report
- [ ] All body text uses `text-sm`
- [ ] All meta text uses `text-xs`
- [ ] All prices use `text-base` or larger with `font-semibold`
- [ ] All page titles use `text-xl`
- [ ] All section titles use `text-lg`
- [ ] Consistent weight usage across similar elements
- [ ] Typecheck passes
- [ ] Visual regression acceptable (screenshots compare well)
