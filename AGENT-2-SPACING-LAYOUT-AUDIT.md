# AGENT-2: Spacing & Layout Audit

> **Parallel Agent** - Run alongside AGENT-1 and AGENT-3 after AGENT-0 completes.
> **Scope**: Spacing, padding, margins, gaps, layout grids, containers ONLY
> **Do NOT touch**: Typography (font sizes, weights), Colors, Shadows

---

## Mission

Audit and fix ALL spacing/layout inconsistencies across the codebase:
1. Standardize gap values (mobile vs desktop)
2. Fix padding/margin inconsistencies
3. Ensure proper container usage
4. Remove arbitrary spacing values
5. Fix layout grids and flex patterns

---

## MCP Tools Available

- **Playwright MCP**: Visual regression testing, responsive screenshots
- **Context7 MCP**: Look up Tailwind CSS v4 spacing best practices

### Context7 MCP Usage

```
// Query spacing best practices
context7.search("Tailwind CSS v4 spacing scale")
context7.search("shadcn/ui dense spacing patterns")
context7.search("marketplace UI spacing best practices")
```

### Playwright MCP Usage

```javascript
// Screenshot at different viewports
await page.setViewportSize({ width: 375, height: 812 }); // Mobile
await page.screenshot({ path: 'mobile-sell-page.png', fullPage: true });

await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
await page.screenshot({ path: 'desktop-sell-page.png', fullPage: true });
```

---

## Spacing Scale Reference

### Gap Values (ONLY use these)

| Class | Pixels | Use Case |
|-------|--------|----------|
| `gap-0.5` | 2px | Icon + text inline (very tight) |
| `gap-1` | 4px | Inline items, badges |
| `gap-1.5` | 6px | Tight groups |
| `gap-2` | 8px | **Mobile default** |
| `gap-3` | 12px | **Desktop default** |
| `gap-4` | 16px | Section spacing |
| `gap-6` | 24px | Major sections |
| `gap-8` | 32px | Page sections |

### Padding Values

| Class | Use Case |
|-------|----------|
| `p-1` / `p-1.5` | Tiny elements, badges |
| `p-2` | Card content (mobile) |
| `p-3` | Card content (desktop) |
| `px-3 py-2` | Standard component padding |
| `p-4` | Section padding |
| `px-4` | Container horizontal padding |

### Section Spacing

| Class | Use Case |
|-------|----------|
| `py-4` | Compact section |
| `py-6` | Standard section |
| `py-8` | Feature section |
| `space-y-2` | Mobile stack spacing |
| `space-y-3` | Desktop stack spacing |

---

## Phase 1: Audit Priority Pages (45 min)

### High Priority Routes to Audit

Screenshot each page at mobile (375px) and desktop (1440px) BEFORE changes:

1. **`/sell`** - Product listing form (spacing issues in form sections)
2. **`/account`** - Account dashboard
3. **`/plans`** - Pricing/plans page
4. **`/product/[slug]`** - Product detail page
5. **`/cart`** - Cart page

### What to Look For

```bash
# Find arbitrary spacing values
grep -rE "(gap|p|m|px|py|mx|my)-\[\d+px\]" --include="*.tsx" app/ components/

# Find inconsistent gaps
grep -rE "gap-(1|2|3|4|5|6)" --include="*.tsx" app/[locale]/(sell)/
```

**Red Flags:**
- `gap-[6px]` → should be `gap-1.5`
- `p-[10px]` → should be `p-2.5` or `p-3`
- `py-[14px]` → should be `py-3` or `py-4`
- Mixed gap values in same context (e.g., `gap-2` and `gap-3` in same form)
- Different padding on similar cards

---

## Phase 2: Container Audit (20 min)

### Container Classes Available

| Class | Max Width | Use Case |
|-------|-----------|----------|
| `container` | 1440px | Standard page width |
| `container-content` | 1152px | Narrower content areas |
| `container-narrow` | 768px | Forms, auth pages |
| `container-wide` | 1536px | Full-width sections |
| `container-bleed` | 1440px | No padding variant |
| `container-bleed-content` | 1152px | No padding, narrow |

### Audit Container Usage

```bash
# Find container usage
grep -r "container" --include="*.tsx" app/ | grep -v "node_modules"

# Find arbitrary max-widths
grep -rE "max-w-\[\d+px\]" --include="*.tsx" app/ components/
```

### Standard Page Layout

```tsx
// Full page with standard container
<main className="container py-6">
  {content}
</main>

// Form page with narrow container
<main className="container-narrow py-8">
  {form}
</main>

// Content page with content-width container
<main className="container-content py-6">
  {content}
</main>
```

---

## Phase 3: /sell Route Spacing Fix (30 min)

### Files to Audit

```
app/[locale]/(sell)/_components/
├── fields/          # Form field spacing
├── layouts/         # Layout containers
├── steps/           # Step spacing
└── ui/              # UI component spacing
```

### Standard Form Spacing Pattern

```tsx
// Form container
<div className="space-y-6">
  {/* Form sections */}
</div>

// Form section
<div className="space-y-4">
  <div className="border-b pb-3">
    <h3>Section Title</h3>
    <p>Description</p>
  </div>
  
  {/* Form fields */}
  <div className="space-y-3">
    {fields}
  </div>
</div>

// Form field
<div className="space-y-1.5">
  <Label>Label</Label>
  <Input />
  <p>Helper text</p>
</div>

// Field group (horizontal on desktop)
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
  {fields}
</div>
```

### Fix Checklist for /sell

- [ ] Form container uses `space-y-6`
- [ ] Form sections use `space-y-4`
- [ ] Form fields use `space-y-1.5` or `space-y-2`
- [ ] Field groups use `gap-3` (mobile) / `gap-4` (desktop)
- [ ] No arbitrary spacing values
- [ ] Consistent section padding

---

## Phase 4: /account Route Spacing Fix (30 min)

### Files to Audit

```
app/[locale]/(account)/account/
├── _components/     # Shared account components
├── orders/          # Orders spacing
├── sales/           # Sales spacing
├── billing/         # Billing spacing
└── page.tsx         # Main page layout
```

### Standard Account Page Spacing

```tsx
// Page layout
<main className="container-content py-6 md:py-8">
  <div className="space-y-6 md:space-y-8">
    {sections}
  </div>
</main>

// Section
<section className="space-y-4">
  <h2>Section Title</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {cards}
  </div>
</section>

// Stat cards grid
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
  {stats}
</div>

// Table container
<div className="overflow-x-auto">
  <table className="w-full">
    {/* cells with px-3 py-2 */}
  </table>
</div>
```

---

## Phase 5: Product Grid Spacing (20 min)

### Files to Audit

```
components/shared/product/product-grid.tsx
components/sections/tabbed-product-feed.tsx
app/[locale]/(main)/search/
```

### Standard Product Grid

```tsx
// Product grid - responsive
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
  {products.map(p => <ProductCard key={p.id} {...p} />)}
</div>

// Product card internal spacing
<article className="space-y-2">
  <AspectRatio ratio={3/4}>
    <Image />
  </AspectRatio>
  <div className="space-y-1 p-0 pt-2 lg:p-2">
    <h3>{title}</h3>
    <p>{price}</p>
  </div>
</article>
```

---

## Phase 6: Touch Target Audit (20 min)

### Touch Target Tokens

| Class | Size | Use Case |
|-------|------|----------|
| `h-touch-xs` / `size-touch-xs` | 24px | Minimum (inline icons) |
| `h-touch-sm` / `size-touch-sm` | 28px | Compact buttons |
| `h-touch` / `size-touch` | 32px | **Standard** |
| `h-touch-lg` / `size-touch-lg` | 36px | Primary CTA |
| `min-h-10` | 40px | Large touch areas |

### Audit Touch Targets

```bash
# Find potential touch target issues
grep -rE "h-(4|5|6)" --include="*.tsx" components/ | grep -i button
grep -rE "size-(4|5|6)" --include="*.tsx" components/ | grep -i button
```

### Standard Touch Patterns

```tsx
// Icon button
<button className="size-touch flex items-center justify-center">
  <Icon className="size-4" />
</button>

// Primary CTA
<Button size="lg" className="h-touch-lg">
  Buy Now
</Button>

// Mobile bottom nav item
<button className="flex flex-col items-center justify-center gap-1 h-touch-lg min-w-touch-lg">
  <Icon className="size-5" />
  <span className="text-2xs">Label</span>
</button>
```

---

## Phase 7: Global Layout Patterns (20 min)

### Mobile vs Desktop Layout

```tsx
// Responsive layout wrapper
<main className="min-h-screen bg-background">
  {/* Mobile layout */}
  <div className="md:hidden">
    <MobileComponent />
  </div>

  {/* Desktop layout */}
  <div className="hidden md:block">
    <div className="container py-6">
      <DesktopComponent />
    </div>
  </div>
</main>
```

### Sidebar Layout

```tsx
// Content with sidebar
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
  <aside className="hidden lg:block">
    {sidebar}
  </aside>
  <main>
    {content}
  </main>
</div>
```

### Horizontal Scroll List

```tsx
// Scrollable horizontal list (mobile)
<div className="overflow-x-auto no-scrollbar -mx-4 px-4">
  <div className="flex items-center gap-2 w-max">
    {items}
  </div>
</div>
```

---

## Verification Checklist

After each file edit, verify:

- [ ] No arbitrary spacing values (`p-[Npx]`, `gap-[Npx]`, `m-[Npx]`)
- [ ] Mobile uses `gap-2`, desktop uses `gap-3`
- [ ] Cards use `p-2` (mobile) / `p-3` (desktop)
- [ ] Sections use `py-6` or `py-8`
- [ ] Touch targets meet 24px minimum (prefer 32px+)
- [ ] Consistent spacing in similar contexts
- [ ] Container classes used appropriately

### Run Gates

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# Visual check
pnpm test:e2e:smoke
```

---

## Files to NOT Touch

These are handled by other agents:

- ❌ Typography (`text-*`, `font-*`) - AGENT-1
- ❌ Colors (`bg-*`, `text-<color>`, `border-<color>`) - AGENT-3
- ❌ Shadows (`shadow-*`) - AGENT-3
- ❌ Border radius (`rounded-*`) - AGENT-3

---

## Commit Strategy

Make small, focused commits:

```bash
git commit -m "fix(spacing): standardize /sell form spacing"
git commit -m "fix(spacing): standardize /account page layout"
git commit -m "fix(spacing): standardize product grid gaps"
git commit -m "fix(spacing): standardize touch targets"
```

---

## Success Criteria

- [ ] Zero arbitrary spacing values in scan report
- [ ] All forms use consistent field spacing (`space-y-1.5`)
- [ ] All grids use consistent gaps (`gap-4` or `gap-6`)
- [ ] All cards use consistent padding (`p-2`/`p-3`)
- [ ] All touch targets meet WCAG AA (24px min, prefer 32px+)
- [ ] Container classes used consistently
- [ ] Mobile/desktop breakpoints are consistent
- [ ] Typecheck passes
- [ ] Visual regression acceptable
