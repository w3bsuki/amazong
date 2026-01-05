# Phase 3: Tailwind CSS v4 Best Practices Audit ⚠️ PARTIAL

> **Priority:** 🟡 Medium  
> **Status:** Config complete, ~1000 palette violations need cleanup  
> **Estimated Time:** 2-3 hours (for high-traffic components)  
> **Goal:** Modern Tailwind v4 CSS-first architecture, semantic design tokens, zero hardcoded values

---

## 📋 Current State Assessment

### ✅ Already Implemented (Well Done!)
- [x] Tailwind v4 installed with `@import "tailwindcss"` (CSS-first config)
- [x] PostCSS configured with `@tailwindcss/postcss` (see `postcss.config.mjs`)
- [x] `@plugin "tailwindcss-animate"` for animations
- [x] `@custom-variant dark (&:is(.dark *))` for class-based dark mode
- [x] `@theme` block with extensive design tokens
- [x] OKLCH color space for perceptually uniform colors
- [x] Custom `@utility` definitions (container variants)
- [x] Touch target tokens (WCAG 2.1 AA compliant)
- [x] Dense spacing scale for marketplace UI

### ⚠️ Needs Attention (From Scan Reports)

This repo uses **scan reports** as the source of truth for what to fix next:

```bash
# Tailwind palette colors + gradients
pnpm -s exec node scripts/scan-tailwind-palette.mjs

# Arbitrary values (e.g. w-[560px]) + hardcoded hex colors
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs
```

Reports:
- `cleanup/palette-scan-report.txt`
- `cleanup/arbitrary-scan-report.txt`

---

## 🎯 Tailwind v4 Best Practices Checklist

### 1. CSS Variables First (v4 Core Pattern)

**Best Practice:** Prefer `var(--color-*)` theme variables over the legacy `theme()` function.

Note: `theme()` still exists in v4, but it’s mainly for compatibility/edge cases (for example, media queries where CSS variables can’t be used). In v4, the media-query form uses CSS variable names like `theme(--breakpoint-xl)`.

```css
/* ⚠️ Legacy (v3-style): theme() function */
.my-class {
  background-color: theme(colors.red.500);
}

/* ✅ BEST: CSS variables directly */
.my-class {
  background-color: var(--color-red-500);
}

/* ✅ BEST: In components, use utility classes or CSS vars */
@layer components {
  .typography p {
    color: var(--color-gray-700);
    font-size: var(--text-base);
  }
}
```

**Action Items:**
- [ ] Avoid adding new `theme()` usages; migrate to `var(--color-*)` when touching old CSS
- [ ] If you must use `theme()` in media queries, use the v4 form (e.g. `theme(--breakpoint-xl)`), not dot-notation
- [ ] Use `var(--color-*)` in custom CSS layers
- [ ] For CSS Modules / component-scoped styles: use `@reference` when you need `@apply`/`@variant` without duplicating output CSS

---

### 2. Semantic Color Tokens (Audit for Gaps, Avoid Duplicates)

**Best Practice:** Define domain-specific semantic tokens, not just raw colors.

**Repo reality check:** `app/globals.css` already has a large semantic token surface (including shadcn-compatible tokens like `--color-background`, `--color-foreground`, `--color-muted-foreground`, `--color-border`, `--color-ring`, plus domain tokens like `--color-cta-*`, `--color-header-*`, `--color-price-*`, etc.).

Before introducing a parallel `--color-text-*` system, decide whether existing tokens already cover the need.

```css
@theme {
  /* ✅ EXISTING: Good semantic tokens */
  --color-canvas-default: oklch(0.985 0 0);
  --color-surface-card: oklch(1 0 0);
  
  /* Optional: only add tokens that are truly missing */
  
  /* Text hierarchy */
  --color-text-primary: oklch(0.12 0 0);
  --color-text-secondary: oklch(0.45 0 0);
  --color-text-tertiary: oklch(0.60 0 0);
  --color-text-inverse: oklch(1 0 0);
  --color-text-on-brand: oklch(1 0 0);
  
  /* Interactive states (consolidated) */
  --color-interactive-default: var(--color-brand);
  --color-interactive-hover: var(--color-brand-dark);
  --color-interactive-active: oklch(0.35 0.24 260);
  --color-interactive-disabled: oklch(0.75 0.02 260);
  
  /* Focus ring (WCAG 2.1) */
  --color-focus-ring: oklch(0.55 0.22 260);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  
  /* Dividers & borders */
  --color-divider-default: oklch(0.92 0 0);
  --color-divider-strong: oklch(0.85 0 0);
  
  /* Elevation surfaces */
  --color-surface-elevated: oklch(1 0 0);
  --color-surface-sunken: oklch(0.97 0 0);
  --color-surface-overlay: oklch(0 0 0 / 50%);
}
```

**Action Items:**
- [ ] Audit current semantic tokens in `app/globals.css` and map usage patterns (foreground/muted-foreground/border/ring, CTA, header, etc.)
- [ ] Only add new semantic tokens if there is a real gap (avoid duplicate token names for the same concept)
- [ ] If you add new tokens, ensure they have dark-mode equivalents

---

### 3. Dark Mode Strategy (Match the App)

**Best Practice:** Keep a single source of truth in CSS variables and switch them via `.dark` (current approach) or a `[data-theme="dark"]` attribute.

```css
/* Example: base values */
:root {
  --acme-canvas: oklch(0.985 0 0);
  --acme-text: oklch(0.12 0 0);
}

[data-theme="dark"], .dark {
  --acme-canvas: oklch(0.18 0.02 250);
  --acme-text: oklch(0.95 0 0);
}

/* Optional: use @theme inline when aliasing variables and you want Tailwind to inline/resolve them in generated utilities */
@theme inline {
  --color-canvas: var(--acme-canvas);
  --color-text: var(--acme-text);
}
```

**Current State (this repo):** You already have a `.dark { ... }` overrides block and an `@theme inline { ... }` block in `app/globals.css`.

**Action Items:**
- [ ] Keep `.dark {}` as the default (works well with `next-themes`)
- [ ] Optional: prefer `[data-theme="dark"]` if you want theme scoping without a global `.dark` class
- [ ] Use `@theme inline` specifically for variable aliasing (not required for dark mode by itself)

---

### 4. Typography Tokens (v4 Pattern with Line Heights)

**Best Practice:** Use Tailwind v4's built-in `--text-*--line-height` pattern (and optional `--text-*--letter-spacing` / `--text-*--font-weight` defaults)

```css
@theme {
  /* ✅ EXISTING: Good custom type scale */
  --text-tiny: 0.6875rem;
  --text-tiny--line-height: 1rem;
  
  /* 🆕 MISSING: Complete the semantic type scale */
  --text-display: 2.25rem;        /* 36px - hero headings */
  --text-display--line-height: 2.5rem;
  
  --text-heading: 1.5rem;         /* 24px - section headings */
  --text-heading--line-height: 2rem;
  
  --text-subheading: 1.125rem;    /* 18px - card titles */
  --text-subheading--line-height: 1.5rem;
  
  --text-label: 0.75rem;          /* 12px - form labels, captions */
  --text-label--line-height: 1rem;

  /* Optional: per-size defaults (Tailwind supports these suffixes) */
  --text-label--font-weight: 500;
  --text-label--letter-spacing: 0.02em;
}
```

**Action Items:**
- [ ] Add `--text-display`, `--text-heading`, `--text-subheading`, `--text-label`
- [ ] Standardize font weight usage across components

---

### 5. Spacing Tokens (v4 Multiplier Pattern)

**Best Practice:** Tailwind v4 spacing utilities are generated from a single `--spacing` base unit (defaults exist; only set this if you want to change the base)

```css
@theme {
  /* Optional override: keep 0.25rem unless you have a strong reason */
  --spacing: 0.25rem;
  
  /* Your dense tokens are good for marketplace-specific spacing */
  --spacing-d1: 0.125rem; /* 2px */
  --spacing-d2: 0.25rem;  /* 4px */
  /* ... */
}
```

**Action Items:**
- [ ] Verify whether you need to override `--spacing` at all (default is typically fine)
- [ ] Document which tokens to use where (dense vs standard)

---

### 6. Animation Tokens (v4 Keyframes Pattern)

**Best Practice:** Define animations inside `@theme` for tree-shaking

```css
@theme {
  /* 🆕 MISSING: Marketplace-specific animations */
  --animate-slide-up: slide-up 0.2s ease-out;
  --animate-slide-down: slide-down 0.2s ease-out;
  --animate-scale-in: scale-in 0.15s ease-out;
  --animate-fade-in: fade-in 0.2s ease-out;
  
  @keyframes slide-up {
    from { transform: translateY(4px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slide-down {
    from { transform: translateY(-4px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

**Action Items:**
- [ ] Move custom animations into `@theme` block for tree-shaking
- [ ] Create marketplace-specific micro-interactions

---

### 7. Gradient Color Stops (v4 OKLCH Interpolation)

**Repo rule:** Gradients are **not allowed** in the marketplace UI.

**Action Items:**
- [ ] Audit gradient usages found in scan reports
- [ ] Replace gradients with solid semantic tokens (e.g. `bg-card`, `bg-muted`, `bg-cta-trust-blue`)

---

### 8. Container Queries (v4 Native Support)

**Best Practice:** Use container queries for component-level responsiveness

```css
@theme {
  /* 🆕 ADD: Container query breakpoints */
  --container-xs: 20rem;   /* 320px */
  --container-sm: 24rem;   /* 384px */
  --container-md: 28rem;   /* 448px */
  --container-lg: 32rem;   /* 512px */
  --container-xl: 36rem;   /* 576px */
}
```

```html
<!-- Use in product cards for responsive layouts -->
<div class="@container">
  <div class="@sm:flex @sm:gap-4 @lg:gap-6">
    <!-- Card content adapts to container, not viewport -->
  </div>
</div>
```

**Action Items:**
- [ ] Only add new `--container-*` tokens if you need custom container breakpoints (the repo already defines some like `--container-3xs`, `--container-2xs`, `--container-xs`)
- [ ] Use `@container` in complex cards where viewport breakpoints are too blunt

---

### 9. Custom Properties Syntax (v4 Shorthand)

**Best Practice:** In v4, use the parentheses syntax when referencing CSS custom properties as values (Tailwind wraps them in `var(...)` automatically)

```html
<!-- ❌ OLD (v3): CSS variable reference in square brackets -->
<div class="bg-[--brand-color]">

<!-- ✅ NEW (v4): Parentheses syntax (wraps in var()) -->
<div class="bg-(--brand-color)">

<!-- ✅ Opacity patterns (v4): use a variable or an arbitrary percentage for alpha -->
<div class="bg-cyan-400/(--my-alpha-value)">
<div class="bg-pink-500/[71.37%]">
```

**Action Items:**
- [ ] Update legacy `[...]` CSS-variable references like `bg-[--brand-color]` to `bg-(--brand-color)`
- [ ] Keep square brackets for non-variable arbitrary values (hex, calc, gradients, etc.)
- [ ] If Tailwind can’t infer the type, use a hint like `text-(color:--my-var)`

---

### 10. Prefix Strategy (v4 Variant Syntax)

**Current:** No prefix (global namespace)

**Best Practice:** Consider prefix if integrating with other CSS

```css
/* If needed for isolation */
@import "tailwindcss" prefix(tw);

/* Then use: */
<div class="tw:flex tw:bg-brand">
```

**Action Items:**
- [ ] Document decision: No prefix (recommended for app-only projects)

---

## 🔧 High-Priority Fixes

### Fix 1: Clean Up Top Offending Files

```bash
# Files to refactor (in priority order):
1. app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-client.tsx  (~39 violations)
2. app/[locale]/(business)/_components/products-table.tsx  (~37)
3. app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx  (~36)
```

**Pattern to fix:**
```tsx
// ❌ Hardcoded colors
<div className="bg-[#f3f4f6] text-[#1f2937] border-[#e5e7eb]">

// ✅ Use semantic tokens
<div className="bg-card text-foreground border-border">
```

---

### Fix 2: Missing Tokens to Add

This section is intentionally **not** a “copy/paste these tokens” recipe — the repo already has strong shadcn-compatible tokens (`--color-background`, `--color-foreground`, `--color-muted(-foreground)`, `--color-border`, `--color-ring`, `--color-card`, etc.) and also some domain badge tokens (for example `--color-category-badge-*`).

Prefer defining *semantic aliases* that point at existing tokens. Aliases automatically adapt to `.dark` when the underlying tokens change, which avoids duplicating token systems.

```css
@theme {
  /* === TEXT HIERARCHY (ALIASES) === */
  --color-text-primary: var(--color-foreground);
  --color-text-secondary: var(--color-muted-foreground);
  --color-text-inverse: var(--color-background);

  /* === SURFACE STATES (DERIVED, NO NEW RAW COLORS) === */
  --color-surface-hover: color-mix(in oklch, var(--color-card), var(--color-foreground) 4%);
  --color-surface-active: color-mix(in oklch, var(--color-card), var(--color-foreground) 6%);

  /* === SKELETON/LOADING (DERIVED) === */
  --color-skeleton-base: var(--color-muted);
  --color-skeleton-highlight: color-mix(in oklch, var(--color-muted), var(--color-background) 40%);

  /* === BADGES === */
  /* Prefer reusing existing domain badge tokens (e.g. --color-category-badge-*) or aliasing to existing shadcn tokens */
  
  /* === MISSING TRANSITION TOKENS === */
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

---

### Fix 3: Dark Mode Token Parity

Ensure **new concrete tokens** (new raw colors) have dark-mode equivalents. If you instead define *aliases* (like `--color-text-primary: var(--color-foreground)`), you often **don’t need** extra `.dark {}` entries because `.dark` already overrides the underlying tokens.

```css
.dark {
  /* Prefer overriding the base tokens (e.g. --color-foreground, --color-background, --color-card, --color-muted, etc.) */
  /* Semantic aliases defined as var(...) automatically follow. */
}
```

---

## 📊 Validation Commands

```powershell
# 1. Run palette scan (check progress)
pnpm -s exec node scripts/scan-tailwind-palette.mjs

# 2. Find hardcoded hex colors (PowerShell)
pwsh -NoProfile -Command "Select-String -Path components/**/*.tsx,app/**/*.tsx -Pattern '#[0-9a-fA-F]{3,8}'"

# 3. Find arbitrary hex colors in utilities (PowerShell)
pwsh -NoProfile -Command "Select-String -Path components/**/*.tsx,app/**/*.tsx -Pattern '(bg|text|border)-\\[#'"

# 4. Find legacy theme() usage in CSS (PowerShell)
pwsh -NoProfile -Command "Select-String -Path app/**/*.css -Pattern 'theme\\('"

# 5. Find legacy v3 CSS-variable bracket syntax like bg-[--foo] (PowerShell)
pwsh -NoProfile -Command "Select-String -Path components/**/*.tsx,app/**/*.tsx -Pattern '\\[--'"

# 6. Check CSS bundle output folder
pnpm build
```

---

## ✅ Phase 3 Completion Checklist

### Design Tokens
- [ ] All semantic color tokens defined in `@theme`
- [ ] Text hierarchy tokens added (`--color-text-*`)
- [ ] Badge variant tokens added
- [ ] Loading/skeleton tokens added
- [ ] Transition timing tokens added

### Dark Mode
- [ ] 100% token parity between light/dark
- [ ] No hardcoded colors in `.dark {}` block
- [ ] Contrast ratios verified (WCAG AA)

### Code Quality
- [ ] Palette scan shows < 50 violations (currently 1019)
- [ ] No hardcoded hex/rgb in components
- [ ] Avoid adding new `theme()` function usage (migrate to `var(--color-*)` when touching old CSS)
- [ ] Prefer `(--var)` syntax over legacy `[...]` CSS-variable references like `[--var]`

### Performance
- [ ] No gradients (replace with solid tokens)
- [ ] Animations defined in `@theme` for tree-shaking
- [ ] CSS bundle < 50KB gzipped

### Best Practices Applied
- [ ] `@theme inline` for dynamic variables
- [ ] Container queries for responsive components
- [ ] Focus ring tokens for accessibility
- [ ] Custom utilities via `@utility` directive

---

## 🏁 Next Step

→ Proceed to [Phase 4: shadcn/ui](./04-shadcn.md)
