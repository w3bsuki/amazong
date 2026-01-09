# Treido Mock Design System — Complete Reference

> **Source:** https://github.com/w3bsuki/treido-mock
> **Live Demo:** https://treido-mock.vercel.app
> **Last synced:** January 2026

---

## 1. Core Philosophy: "Technical Density"

**Objective:** Create a mobile-first marketplace interface that feels native, utilitarian, and instant.
**Reference Style:** eBay Mobile, Vinted, Native iOS Settings, Linear.app, Vercel Dashboard, Swiss Design.

| Principle | Implementation |
|-----------|----------------|
| **Color Space** | Strict **OKLCH** — better perceptual uniformity than HSL |
| **Geometry** | **Tight** — radius 4px-6px, gaps 4px-8px |
| **Density** | **High** — reduce padding, reduce whitespace |

---

## 2. OKLCH Color Palette (Tailwind v4)

The theme is defined directly in CSS using OKLCH variables (`Lightness Chroma Hue` format).

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* BACKGROUNDS */
  --background: 1 0 0;             /* Pure White */
  --foreground: 0.20 0.02 286;     /* Deep Zinc (Almost Black) */

  /* CARDS (Flat, Technical) */
  --card: 1 0 0;
  --card-foreground: 0.20 0.02 286;

  /* POPOVERS */
  --popover: 1 0 0;
  --popover-foreground: 0.20 0.02 286;

  /* SECONDARY / MUTED (The Framework) */
  --primary: 0.20 0.02 286;           /* Deep Zinc */
  --primary-foreground: 0.98 0 0;     /* White */

  --secondary: 0.96 0.003 286;        /* Light Zinc (Zinc 100 equiv) */
  --secondary-foreground: 0.20 0.02 286;

  --muted: 0.96 0.003 286;            /* Light Zinc */
  --muted-foreground: 0.55 0.01 286;  /* Mid Zinc (Zinc 500 equiv) */

  --accent: 0.96 0.003 286;           /* Hover States */
  --accent-foreground: 0.20 0.02 286;

  /* BORDERS & RINGS */
  --border: 0.92 0.005 286;           /* Zinc 200 equiv */
  --input: 0.92 0.005 286;
  --ring: 0.20 0.02 286;

  /* RADIUS (Tight / Technical) */
  --radius: 0.375rem;                 /* 6px (Default) */
}

@theme {
  /* Semantic Color Mapping using OKLCH */
  --color-background: oklch(var(--background));
  --color-foreground: oklch(var(--foreground));
  
  --color-card: oklch(var(--card));
  --color-card-foreground: oklch(var(--card-foreground));
  
  --color-popover: oklch(var(--popover));
  --color-popover-foreground: oklch(var(--popover-foreground));
  
  --color-primary: oklch(var(--primary));
  --color-primary-foreground: oklch(var(--primary-foreground));
  
  --color-secondary: oklch(var(--secondary));
  --color-secondary-foreground: oklch(var(--secondary-foreground));
  
  --color-muted: oklch(var(--muted));
  --color-muted-foreground: oklch(var(--muted-foreground));
  
  --color-accent: oklch(var(--accent));
  --color-accent-foreground: oklch(var(--accent-foreground));
  
  --color-border: oklch(var(--border));
  --color-input: oklch(var(--input));
  --color-ring: oklch(var(--ring));

  /* TIGHT RADIUS SYSTEM */
  --radius-lg: var(--radius);            /* 6px */
  --radius-md: calc(var(--radius) - 2px); /* 4px */
  --radius-sm: calc(var(--radius) - 4px); /* 2px */
  
  /* Safe Areas */
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
}
```

---

## 3. Simplified Color Reference (Hex Fallbacks)

For quick reference (use semantic tokens in code):

| Variable | Tailwind Class | Hex (Reference) | Usage |
|----------|----------------|-----------------|-------|
| Background | `bg-white` | #FFFFFF | Cards, Headers, Modals |
| Canvas | `bg-zinc-50` | #FAFAFA | App Background, Inputs |
| Text Primary | `text-zinc-900` | #18181B | Headings, Prices |
| Text Secondary | `text-zinc-500` | #71717A | Metadata, Subtitles |
| Border | `border-zinc-200` | #E4E4E7 | Dividers, Inputs |
| Brand/Action | `bg-zinc-900` | #18181B | Primary Buttons (Black) |

---

## 4. Core Design Principles

### A. The "No Scale" Rule
- **Forbidden:** `active:scale-95` or bouncy animations
- **Required:** `active:opacity-70` or `active:bg-zinc-100` for touch feedback
- **Reasoning:** Scale animations feel "webby" and slow. Opacity/color changes feel "native" and instant.

### B. The "Border Over Shadow" Rule
- **Forbidden:** Deep drop shadows (`shadow-xl`, `shadow-2xl`) for cards
- **Required:** 1px borders (`border border-zinc-100` or `border-zinc-200`)
- **Reasoning:** Flat designs with distinct borders are easier to scan on mobile screens

### C. Typography & Density
- **Font:** Inter (or San Francisco)
- **Sizes:**
  - `text-[11px]` + Uppercase + Bold for Labels (Metadata)
  - `text-[16px]` for Body (prevents iOS zoom on inputs)
  - `text-[22px]+` for Prices/Headlines
- **Spacing:** Use `gap-2` or `gap-3` by default. Avoid `gap-6` or `gap-8` unless separating major sections.

---

## 5. Mobile Ergonomics

| Aspect | Implementation |
|--------|----------------|
| **Touch Targets** | Minimum height `42px` for buttons |
| **Safe Areas** | Always use `pb-safe` for fixed footers |
| **Sticky Elements** | Headers and Action Footers should be `sticky` or `fixed` |
| **iOS Input Zoom** | Use `text-[16px]` on inputs to prevent auto-zoom |

---

## 6. Usage Rules (High Density)

### Tight Spacing
- Use `gap-1` (4px) or `gap-2` (8px) for related items
- Avoid `gap-4` or `gap-6` inside cards

### Micro-Borders
- Components should feel "assembled"
- Use `border-border` extensively
- Use `h-full border-r` to separate horizontal items

### Typography
- Headings: `tracking-tight` (tight letter spacing)
- Labels: `text-xs font-medium text-muted-foreground`

---

## 7. Actual CSS from Treido Mock (index.html)

```html
<style>
  :root {
    --background: #ffffff;
    --foreground: #09090b;         /* Zinc 950 */
    --card: #ffffff;
    --card-foreground: #09090b;
    --popover: #ffffff;
    --popover-foreground: #09090b;
    --primary: #18181b;            /* Zinc 900 */
    --primary-foreground: #fafafa; /* Zinc 50 */
    --secondary: #f4f4f5;          /* Zinc 100 */
    --secondary-foreground: #18181b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;   /* Zinc 500 */
    --accent: #f4f4f5;
    --accent-foreground: #18181b;
    --destructive: #ef4444;
    --destructive-foreground: #fafafa;
    --border: #e4e4e7;             /* Zinc 200 */
    --input: #e4e4e7;
    --ring: #18181b;
    --radius: 0.375rem;            /* 6px */
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: #fafafa;     /* Zinc 50 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--foreground);
  }

  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Safe Areas */
  .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
  .pt-safe-top { padding-top: env(safe-area-inset-top); }

  /* Tight Letter Spacing */
  .tracking-tight { letter-spacing: -0.025em; }
</style>
```

---

## 8. Key Component Classes from Live App

### Product Card
```tsx
<div className="group border border-border rounded-md bg-white overflow-hidden">
  <div className="aspect-square bg-secondary relative">
    <img src="..." className="object-cover" />
  </div>
  <div className="p-2.5">
    <h3 className="text-sm font-medium leading-tight truncate">Title</h3>
    <p className="text-xs text-muted-foreground mt-1">Meta</p>
    <div className="mt-2 text-sm font-bold">120 лв.</div>
  </div>
</div>
```

### Sticky Header (Glassmorphism)
```tsx
<div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200">
  <div className="pt-safe-top">
    <div className="h-[48px] px-4 flex items-center justify-between">
      <h1 className="text-[16px] font-bold text-zinc-900">Header</h1>
    </div>
  </div>
</div>
```

### Fixed Action Footer
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe z-50">
  <div className="flex items-center gap-2 px-4 py-2">
    <button className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white text-zinc-900 font-bold text-[14px]">
      Secondary
    </button>
    <button className="flex-1 h-[44px] flex items-center justify-center rounded-md bg-zinc-900 text-white font-bold text-[14px]">
      Primary
    </button>
  </div>
</div>
```

### Product Grid (Tight)
```tsx
<div className="grid grid-cols-2 gap-2 px-3">
  {products.map(product => <ProductCard key={product.id} />)}
</div>
```

### Filter Strip
```tsx
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar pl-3">
  <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-zinc-900 text-[12px] font-semibold whitespace-nowrap">
    <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
    Filters
  </button>
</div>
```

### Property List (Key-Value)
```tsx
<div className="px-4 py-4 border-b border-zinc-100">
  <h3 className="text-[13px] font-bold text-zinc-900 mb-3 uppercase tracking-wide">Details</h3>
  <div className="space-y-2">
    {Object.entries(specs).map(([key, value]) => (
      <div key={key} className="flex justify-between text-[13px]">
        <span className="text-zinc-500">{key}</span>
        <span className="text-zinc-900 font-semibold">{value}</span>
      </div>
    ))}
  </div>
</div>
```

### Promo Banner (Dark)
```tsx
<div className="px-3 pt-3">
  <div className="group relative overflow-hidden bg-zinc-900 rounded-md p-4 shadow-none border border-zinc-900">
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
        <h2 className="text-[15px] font-bold text-white tracking-tight leading-none">Title</h2>
        <p className="text-[12px] text-zinc-400 font-medium leading-tight">Subtitle</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
    </div>
  </div>
</div>
```

---

## 9. Quick Checklist

- [ ] No gradients anywhere
- [ ] No `shadow-lg` / `shadow-xl` on cards (use borders)
- [ ] No `rounded-xl` / `rounded-2xl` (max `rounded-md` = 6px)
- [ ] No `gap-6` inside cards (use `gap-2` or `gap-3`)
- [ ] All buttons: `shadow-none`, `h-[44px]` minimum
- [ ] Use `active:opacity-90` instead of `active:scale-95`
- [ ] Use semantic colors: `bg-secondary`, `text-muted-foreground`, etc.
- [ ] Fixed footers: always include `pb-safe`
- [ ] Inputs: `text-[16px]` to prevent iOS zoom
- [ ] Labels: `text-[11px] font-bold uppercase tracking-wide`

---

## 10. Mobile App Wrapper (Desktop Preview)

```tsx
<div className="min-h-screen bg-zinc-100 flex justify-center font-sans antialiased text-zinc-900">
  <div className="w-full max-w-[430px] bg-white min-h-screen relative border-x border-zinc-200 pb-safe shadow-none">
    {/* App content */}
  </div>
</div>
```

---

**Reference Files:**
- `guide/01_THEME_AND_TOKENS.md`
- `guide/02_SHADCN_OVERRIDES.md`
- `guide/03_LAYOUT_PATTERNS.md`
- `guide/PROMPT_FOR_AGENT.md`
- `docs/AGENT_GUIDE_DESIGN_PHILOSOPHY.md`
- `docs/AGENT_GUIDE_LAYOUT_PATTERNS.md`
- `docs/AGENT_GUIDE_TAILWIND_V4_SHADCN.md`
