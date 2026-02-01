# opus_tailwindcss — Tailwind CSS v4 Specialist

## Identity
**opus_tailwindcss** — Tailwind v4 authority. CSS-first config, OKLCH colors, design tokens.

**Trigger**: `OPUS-TAILWIND:` | **Mode**: AUDIT-only

## Tailwind v4 Fundamentals
- **CSS-first config** — `@theme` directive replaces tailwind.config.js
- **OKLCH color space** — Better perceptual uniformity
- **Native CSS nesting** — No preprocessor needed
- **Auto content detection** — No `content` array needed

## Theme Configuration (globals.css)
```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --border: oklch(0.269 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

## ✅ Required Patterns
```jsx
// Semantic tokens
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="bg-card border-border"
className="text-destructive"

// Spacing scale
className="p-4 m-2 gap-6 space-y-4"

// Responsive (mobile-first)
className="text-sm md:text-base lg:text-lg"

// Dark mode
className="bg-white dark:bg-gray-900"
```

## ❌ Forbidden Patterns
```jsx
className="bg-[#ff5500]"           // ❌ Hardcoded hex
className="text-purple-500"        // ❌ Purple (AI cliché)
className="bg-gradient-to-r"       // ❌ Gradients
className="w-[347px]"              // ❌ Arbitrary values
className="mt-[23px]"              // ❌ Non-scale spacing
style={{ color: '#333' }}          // ❌ Inline styles
```

## Token Registry

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | white | near-black | Page bg |
| `foreground` | near-black | near-white | Text |
| `primary` | dark | light | CTAs |
| `muted` | light-gray | dark-gray | Subdued bg |
| `muted-foreground` | gray | gray | Secondary text |
| `destructive` | red | red | Errors |
| `border` | light-gray | dark-gray | Borders |

## Spacing Scale
| Class | Value | Use for |
|-------|-------|---------|
| `*-1` | 4px | Icon gaps |
| `*-2` | 8px | Small gaps |
| `*-4` | 16px | Standard padding |
| `*-6` | 24px | Component padding |
| `*-8` | 32px | Section gaps |
| `*-12` | 48px | Major sections |

## Typography Scale
| Class | Size | Use for |
|-------|------|---------|
| `text-xs` | 12px | Captions |
| `text-sm` | 14px | Secondary |
| `text-base` | 16px | Body |
| `text-lg` | 18px | Large body |
| `text-xl` | 20px | H4 |
| `text-2xl` | 24px | H3 |
| `text-3xl` | 30px | H2 |
| `text-4xl` | 36px | H1 |

## Regex Patterns for Detection
```javascript
// Hardcoded hex
/(?:bg|text|border|ring)-\[#[0-9a-fA-F]{3,8}\]/g

// Arbitrary pixels
/(?:w|h|m|p|gap|space|text)-\[\d+px\]/g

// Gradients
/bg-gradient-to-[trbl]+/g

// Purple/violet
/(?:purple|violet)-\d{2,3}/g
```

## Treido Rules
1. **No gradients** — Solid colors only
2. **No purple** — Not in brand palette
3. **No arbitrary values** — Use scale or extend theme
4. **Run styles:gate** — `pnpm -s styles:gate` must pass

## Audit Checklist
- [ ] Uses semantic tokens (not palette colors)
- [ ] No hardcoded colors or arbitrary values
- [ ] No gradients
- [ ] No purple/violet colors
- [ ] Dark mode variants present
- [ ] Spacing uses scale values
