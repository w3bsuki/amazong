# 03 — Tailwind CSS v4: End Goal

---

## Modular CSS Architecture

### File Split (from monolith to modules)

```
app/
├── globals.css              ← Import orchestrator ONLY (~20 lines)
├── styles/
│   ├── tokens.css           ← All OKLCH tokens (:root + .dark)
│   ├── theme-bridge.css     ← @theme inline mappings
│   ├── base.css             ← Global resets, focus, body, selection
│   ├── overrides.css        ← Component-specific CSS (shadcn tweaks)
│   ├── marketplace.css      ← Marketplace-specific tokens (badges, categories, surfaces)
│   └── animations.css       ← @keyframes + animation utilities
├── utilities.css            ← Custom @utility definitions (clean, no collisions)
├── legacy-vars.css          ← REMOVED (migrated or deleted)
└── shadcn-components.css    ← shadcn component tokens (kept minimal)
```

### globals.css (orchestrator only)
```css
@import "tailwindcss";
@import "tw-animate-css";

@import "./styles/tokens.css";
@import "./styles/theme-bridge.css";
@import "./styles/marketplace.css";
@import "./styles/base.css";
@import "./styles/overrides.css";
@import "./styles/animations.css";
@import "./utilities.css";
@import "./shadcn-components.css";
```

---

## Token Governance

### Token Lifecycle
1. **Add** — Define in `:root` + `.dark` (tokens.css) → bridge in `@theme inline` (theme-bridge.css) → use in components
2. **Use** — Only via semantic classes (`bg-background`, `text-foreground`, etc.)
3. **Deprecate** — Add `/* DEPRECATED: use <replacement> */` comment + scan for usage
4. **Delete** — When 0 usages remain

### Legacy Token Cleanup

| Token | Action |
|-------|--------|
| `--success/--warning/--info/--error` → all map to `--primary` | **Remove** — misleading aliases. Use badge tokens instead. |
| `--text-strong/--text-default/--text-muted-alt/--text-subtle` | **Evaluate** — keep only if used, otherwise remove |
| Duplicate surface tokens | **Audit** — consolidate if any have 0 usage |

### Unused Token Detection
Run `rg "var(--<token>)" app/ components/` for every token in CSS. Any with 0 usage outside CSS definitions → candidate for deletion.

---

## Utility Cleanup

### Remove (collide with Tailwind v4)
- `@utility container` → **KEEP as customization** (Tailwind v4 docs say `@utility container { ... }` is the correct v4 pattern for customizing container). Review if current styles match intent; rename to `container-app` only if Tailwind default is also needed.
- `@utility w-20` → delete (Tailwind has `w-20 = 5rem`)
- `@utility touch-pan-x/y` → delete (Tailwind v4 built-in)
- `@utility touch-manipulation` → delete (Tailwind v4 built-in)
- `@utility z-60` → add `--z-index-60: 60` to `@theme` so `z-60` works natively (note: the v4 namespace is `--z-index-*`, NOT `--z-60`. Do NOT use `z-[60]` — arbitrary values fail `styles:gate`)

### Keep (clean extensions)
- `container-wide/content/narrow` — layout helpers
- `control-compact/default/primary` — touch target sizes
- `pb-tabbar-safe`, `pb-safe`, `pt-header-safe` — chrome spacing
- `aspect-*` — marketplace media ratios
- `grid-cols-product-*` — product grid layouts
- `animate-*` — custom animations

---

## Mobile Spacing Contract

### Current: Manual `pb-20` in 14 files
### Target: Layout-driven spacing via `pb-tabbar-safe`

Pages should NEVER set bottom padding for tab bar clearance. The layout shell provides it:

```tsx
// components/layout/page-shell.tsx (or equivalent)
<main className="pb-tabbar-safe md:pb-0">
  {children}
</main>
```

A styles gate rule should catch `pb-20` reintroductions:
```bash
# scripts/scan-tailwind-mobile-spacing.mjs
# Error if pb-20 appears in app/ or components/ (outside globals.css/utilities.css)
```

---

## Responsive Best Practices (from context7)

### Mobile-First Writing
```css
/* ✅ DO: Mobile-first */
.component { padding: 0.5rem; }
@media (min-width: 768px) { .component { padding: 1rem; } }

/* ❌ DON'T: Desktop-first override */
.component { padding: 1rem; }
@media (max-width: 768px) { .component { padding: 0.5rem; } }
```

### Tailwind v4 @theme Best Practice (from context7)
```css
@theme {
  --font-display: "Inter", sans-serif;
  --color-primary: oklch(0.62 0.20 255);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

All custom design tokens go through `@theme` — no direct `:root` usage for Tailwind utilities.

---

## Acceptance Criteria

- [ ] `globals.css` is <30 lines (import orchestrator only)
- [ ] Token definitions in `styles/tokens.css` (light + dark)
- [ ] Theme bridge in `styles/theme-bridge.css`
- [ ] Zero Tailwind-colliding utilities
- [ ] Legacy token aliases removed or justified
- [ ] `pb-tabbar-safe` used everywhere (zero `pb-20`)
- [ ] Token lifecycle documented
- [ ] `styles:gate` still passes after all changes
