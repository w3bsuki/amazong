# DESIGN — Treido Design System

> SSOT for UI/UX styling rules in Treido.
> This document is implementation-aligned and mobile-first.

| Scope | Visual language, tokens, component behavior, interaction quality bar |
|---|---|
| Audience | Engineers, designers, AI agents |
| Stack | Next.js App Router + Tailwind CSS v4 + shadcn/ui (open code) + Radix |
| Primary Token Source | `app/globals.css` |
| Frontend Implementation Guide | `docs/FRONTEND.md` |
| Last Updated | 2026-02-11 |

---

## 1) Source Of Truth And Precedence

1. Runtime code and tokens are truth:
`app/globals.css`, `app/utilities.css`, `components/ui/*`, route components.
2. This file is the design SSOT for implementation decisions.
3. If docs conflict with runtime, follow runtime and update docs in the same batch.
4. Ignore legacy numbered docs when they conflict with this file or `docs/*.md`.

Normative language in this document:

- MUST: required for merge
- SHOULD: strong default; deviations need explicit rationale
- MAY: optional, context-dependent

---

## 2) 2026 Product Design Direction

Treido should feel like a modern marketplace app, not a template.

- Calm base: neutral surfaces and clear spacing.
- Strong actions: primary blue for revenue-driving CTAs and key intent.
- Fast scanning: compact but readable hierarchy for feed browsing.
- Touch confidence: controls are easy to hit with one hand.
- Minimal decoration: shadows only for overlays, not everyday cards.

Color usage ratio target:

- 70% neutral surfaces (`background`, `surface-subtle`, `card`)
- 20% neutral contrast (`foreground`, `muted-foreground`, borders)
- 10% accent/status (`primary`, `destructive`, badges)

### 2.1) Design Thinking (Before Coding)

Before building or modifying any UI surface, answer these four questions:

1. **Purpose**: What user goal does this surface serve? Who sees it, and what's their state of mind? (Browsing buyer? Anxious seller? Returning customer?) Does every visible element earn its place?
2. **Tone**: What's the emotional register for this surface?
   - Treido baseline: calm confidence with sharp moments of delight.
   - Surface-specific: editorial (product detail), transactional urgency (checkout), celebratory (order confirmed), professional trust (seller dashboard).
3. **Memorable detail**: What's the one thing that makes this feel *designed*? A typographic moment, a micro-interaction, an unexpected layout choice? If you can't name it, the surface is generic.
4. **Brand check**: Does this feel like *Treido* — calm, scannable, touch-confident — or like a shadcn starter template?

### 2.2) Anti-Slop Rules (Banned Patterns)

These patterns signal low-effort AI-generated UI and MUST be avoided:

**Typography slop:**
- All-same-weight text walls (everything `font-normal`, no hierarchy)
- Missing letter-spacing on headings (`--letter-spacing-tight` exists — use it)
- Headings that look the same as body text
- No weight contrast between labels and values

**Layout slop:**
- Every section is a centered card on white background
- Symmetrical grids with identical spacing everywhere (vary density: feed is tight, detail pages breathe)
- No visual rhythm — equal gaps between unrelated sections
- Ignoring the difference between scannable density and reading comfort

**Color slop:**
- Purple gradients on white (the universal AI cliché)
- Every surface using `bg-card` identically without surface hierarchy
- Missing state differentiation (hover/active/selected all look the same)
- Not using the category tone system for browsing cues (`--category-*-bg/fg/ring` exist — use them)
- Evenly-distributed weak palettes — trust the 70/20/10 ratio

**Motion slop:**
- Every element has the same fade-in
- Decorative animation on static content
- Missing press feedback on touch targets
- Ignoring `prefers-reduced-motion`

**Component slop:**
- Gratuitous card shadows (Treido is border-based; shadows for overlays only per §5.3)
- Filler microcopy ("Lorem ipsum", "Welcome to our platform", "John Doe")
- Icon-only buttons without aria-labels
- Buttons that all look the same regardless of hierarchy
- Skeleton-loader-everywhere without real loading states

### 2.3) Quality Compounds

- **Micro-polish**: Border-radius consistency, spacing rhythm alignment to tokens, transition timing matching `--ease-*` / `--duration-*`. Small details distinguish polished products from templates.
- **Restraint is design**: In Treido's calm aesthetic, what you *leave out* matters as much as what you add. Fewer competing elements with precise spacing reads as more intentional than a busy surface.
- **Context-specific character**: The same component in different contexts (home feed vs. seller dashboard vs. checkout) SHOULD feel cohesive but tuned to its context.
- **Intentionality over intensity**: A single well-placed typographic detail beats scattered decorative noise.

---

## 3) Mobile UX Quality Bar (2026)

Treido must meet these defaults:

- Default touch target: 44px (`--control-default`)
- Primary target/sticky bars: 48px (`--control-primary`)
- Dense secondary only: 36px (`--control-compact`)
- No horizontal page overflow (`documentElement.scrollWidth` must equal viewport width)
- Respect safe areas (`pt-safe`, `pb-safe`, `pt-app-header`, `pb-tabbar-safe`)
- Reduced motion support (`prefers-reduced-motion`)
- Focus visible on all interactive controls
- Core interactions should feel instant on mobile; optimize for low interaction latency
- Core mobile interaction targets SHOULD stay under 200ms INP in production telemetry

External baselines:

- Apple touch guidance: minimum tappable area ~44pt
- Web.dev touch guidance: at least ~48px with spacing
- WCAG 2.2 SC 2.5.8: minimum target size 24px in constrained cases
- No horizontal scrolling for primary page content in mobile layouts

---

## 4) Tailwind v4 + shadcn/ui Rules

### 4.1 Token Architecture

Use this chain:

`CSS vars (:root/.dark) -> @theme inline mapping -> semantic utility classes`

Never bypass semantic tokens for normal UI surfaces.

### 4.2 Allowed Patterns

- Semantic classes: `bg-background`, `text-foreground`, `border-border`
- Token-variable utilities: `w-(--token)`, `h-(--token)`, `gap-(--token)`
- Component variants through shadcn/CVA (`Button`, `Badge`, `Card`, etc.)

### 4.3 Forbidden Patterns

- Palette utilities: `text-blue-500`, `bg-gray-100`, `border-zinc-300`
- Hardcoded color literals in TSX/CSS-in-JS for app UI (`#...`, raw `oklch(...)`)
- Brand alpha shortcuts for interactive states (`bg-primary/10`)
- Unbounded one-off arbitrary sizes (`w-[347px]`) when token equivalents exist
- Card/list shadows as a default styling crutch

Exception:

- Product swatches may use raw color values in dedicated swatch components.

Note:

- Rails can use `overflow-x-auto` intentionally, but this MUST NOT create page-level overflow.

### 4.4 shadcn/ui Usage Contract

- `components/ui/*` are primitives only (no domain logic, no API calls).
- Treat shadcn as open code you own; keep variants lean and token-based.
- Reusable business composites belong in `components/shared/*`.
- Route-private UI belongs in `app/**/_components/*`.

---

## 5) Core Tokens (Current Runtime Contract)

Primary source: `app/globals.css`.

### 5.1 Controls

| Token | Value | Usage |
|---|---:|---|
| `--control-compact` | 36px | Dense chips/icon actions only |
| `--control-default` | 44px | Default interactive controls |
| `--control-primary` | 48px | Primary CTA and key bars |

### 5.2 Home Spacing

| Token | Value | Usage |
|---|---:|---|
| `--spacing-home-inset` | 12px | Mobile page side inset |
| `--spacing-home-card-gap` | 10px | Grid/rail card gap |
| `--spacing-home-section-gap` | 16px | Vertical section rhythm |
| `--spacing-home-card-column-w` | calc token | 2-column feed width |

### 5.3 Surfaces

- `bg-background`: page base
- `bg-surface-subtle`: low-emphasis containers
- `bg-card`: card body
- `bg-surface-elevated`: fixed bars/docks
- `bg-popover`: sheet/dialog/popover

### 5.4 Radius

- Base token: `--radius: 0.5rem` (8px)
- Standard controls/cards: `rounded-xl` (~12px with token scale)
- Sheets/dialogs: `rounded-2xl`
- Chips/pills: `rounded-full`

### 5.5 Typography

#### Font Stack (Tiered)

| Tier | Token | Current Value | Role |
|------|-------|--------------|------|
| **Display** | `--font-display` | *(planned — see upgrade note)* | Hero headings, marketing, landing pages |
| **UI / Body** | `--font-sans` | Inter (via `next/font/google`) | Body text, labels, form fields, descriptions |
| **Serif accent** | `--font-serif` | Source Serif 4 | Editorial moments, trust indicators |
| **Mono** | `--font-mono` | JetBrains Mono | Tracking IDs, code, technical values |

**Display font upgrade note**: Inter is serviceable for body text but generic at display sizes. A distinctive display font SHOULD be added for hero headings and marketing surfaces. Requirements:
- Cyrillic support (Bulgarian locale is mandatory)
- Variable weight axis for nuanced hierarchy
- Geometric-modern but distinct from Inter
- Candidates: **Onest**, **Manrope**, **Commissioner**, **Golos Text**, **Wix Madefor Display**
- Load via `next/font/google` with `display: "swap"`, `subsets: ["latin", "cyrillic"]`
- Register as `--font-display` in `globals.css` `@theme` block

#### Type Scale Tokens

- `text-2xs`, `text-tiny`, `text-xs`, `text-compact`, `text-body`, `text-reading`, `text-price`
- `text-heading-1`, `text-heading-2`, `text-heading-3` (CMS/rich text)

#### Typographic Rules

- **Headings**: MUST use `font-semibold` or `font-bold` with `--letter-spacing-tight`. Never leave headings at default weight/spacing.
- **Prices**: `text-price` + `font-semibold` minimum. Price is the most important number on product surfaces.
- **Labels/metadata**: `text-compact` or `text-xs` with `text-muted-foreground`. Quiet but readable.
- **Body text**: `text-body` with token line-height. Don't compress line-height on readable content.
- **Weight contrast**: Create hierarchy through weight, not just size. A `text-body font-semibold` label above `text-body font-normal` value is clearer than making the label bigger.
- **Letter spacing**: Use `--letter-spacing-tight` on large text (headings, prices), `--letter-spacing-wide` on small uppercase labels.
- Use `text-2xs` sparingly for dense metadata only; primary readable UI SHOULD be `text-xs` or larger.

---

## 6) Mobile Home Contract (`/` on mobile)

Primary implementation:

- `app/[locale]/(main)/_components/mobile-home.tsx`
- `components/layout/header/mobile/homepage-header.tsx`
- `components/mobile/category-nav/category-circles-simple.tsx`
- `app/[locale]/(main)/_components/mobile/home-feed-controls.tsx`
- `app/[locale]/(main)/_components/mobile/home-sticky-category-pills.tsx`
- `components/shared/product/card/mobile.tsx`
- `app/[locale]/_components/mobile-tab-bar.tsx`

### 6.1 Structure Order (Current)

1. Fixed homepage header (hamburger, logo, inline search, wishlist/cart)
2. Category circle rail (horizontal)
3. Sticky category pills (appear after scroll past circles)
4. Sell CTA banner (primary blue)
5. Feed controls rail (promoted/all + sort chips + nearby)
6. Discovery product grid (2 columns)
7. Optional curated horizontal rail
8. Bottom tab bar dock

### 6.2 Home-Specific Behavior Rules

- Keep only one high-emphasis blue block above the fold (sell CTA).
- Feed controls must be compact chips, not full-width segmented tabs.
- Active chips use strong contrast (foreground inversion) for rapid state recognition.
- Nearby location is a lightweight toggle with optional city configuration.
- Category pills and feed chips must remain horizontally scrollable without page overflow.

### 6.3 Product Card Rules (Home Feed)

- Max two image overlays:
1. One promo badge (when applicable)
2. Wishlist action
- Title: one line by default in feed
- Price row: left price, right freshness timestamp
- Seller row stays compact and identity-focused

---

## 7) Component Rules

### 7.1 Buttons

Current runtime variants are defined in `components/ui/button.tsx`.

- `default`: primary CTA
- `secondary`: low-emphasis neutral surface (not dark-only)
- `outline`: bordered secondary
- `ghost`: minimal actions/icons
- `destructive`: destructive flows
- `deal`: urgency/promotional action

### 7.2 Chips And Pills

- Base shape: `rounded-full`
- Dense height allowed (36px) for secondary chip rails
- Must always include visible selected state (`aria-pressed` + visual inversion)
- Touch rings are required (`focus-visible:ring-2`)
- Dense 36px controls MUST NOT be used for primary navigation or destructive confirmation actions

### 7.3 Bottom Navigation

- Exactly five primary items on mobile tab bar
- Dock uses elevated surface + top border
- Content area must reserve space with `pb-tabbar-safe`
- Tabs stay icon-only in the visible UI; provide accessible names via `aria-label`
- Sell action remains filled primary (`bg-primary text-primary-foreground`) with ring treatment, without drop shadow
- Profile tab uses avatar treatment: guest fallback avatar + authenticated user avatar, with active/inactive ring states

---

## 8) Motion And Feedback

### 8.1 Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | Sheets, drawers, spring-like interactions |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard UI transitions |
| `--duration-instant` | 50ms | Immediate state changes |
| `--duration-fast` | 100ms | Press feedback, micro-interactions |
| `--duration-normal` | 200ms | Standard transitions (hover, expand) |
| `--duration-slow` | 300ms | Maximum for UI transitions — longer feels sluggish on mobile |

### 8.2 Principles

- **One hero moment per page load**: A well-orchestrated entrance (staggered reveals with `animation-delay`, 20-40ms per item, cap at ~10 items) creates more delight than everything fading in at once.
- **Interaction feedback > decoration**: Press states, hover transitions, and loading skeletons matter more than ambient animation.
- **Use existing tokens**: Do not invent bespoke easing/duration values when `--ease-*` / `--duration-*` tokens exist.

### 8.3 Required Patterns

- Press feedback via background tint: `active:bg-active` on touch targets (subtle enough to not be jarring during accidental `touchstart` while scrolling)
- `tap-transparent` (`-webkit-tap-highlight-color: transparent`) on all mobile interactive elements
- Transition on hover states (desktop): `transition-colors duration-fast` minimum
- Sheet/drawer spring: use `--ease-snappy` for native-feeling open/close
- Skeleton → content: loading states use subtle pulse, then cross-fade
- Honor `prefers-reduced-motion` globally (use `motion-safe:` prefix or `@media` query)

### 8.4 Don'ts

- **Never use `active:scale-*` on mobile touch targets.** On touch devices, `:active` fires on `touchstart` before the browser knows if the gesture is a tap or a scroll. This causes elements to visually shrink/bounce during normal scrolling and dragging — it looks broken, not polished. Use `active:bg-active` (background tint) instead.
- Never animate layout-triggering properties (`width`, `height`, `top`, `left`) — use `transform` and `opacity`
- Never exceed `--duration-slow` (300ms) for UI transitions
- Avoid decorative motion on static surfaces
- Don't add ambient animation that doesn't serve a functional purpose

---

## 9) Accessibility Contract

Non-negotiable:

- Text contrast: WCAG AA minimum (4.5:1 body text, 3:1 large text/UI components)
- Keyboard/focus support for all interactive elements
- Explicit labels/aria labels for icon-only controls
- No hover-only critical actions
- Focus ring visible against both light and dark backgrounds
- Tap targets below 44px are allowed only in constrained secondary contexts and must still satisfy WCAG 2.5.8 spacing/equivalent exceptions

---

## 10) Drift Guard (Keep SSOT Honest)

When changing these files, update this doc in the same PR:

- `app/globals.css` (tokens, typography, spacing, radii, colors)
- `components/ui/button.tsx` (button variants/sizes)
- `app/[locale]/(main)/_components/mobile-home.tsx` (home layout contract)
- `components/shared/product/card/mobile.tsx` (home card behavior)
- `app/[locale]/_components/mobile-tab-bar.tsx` (mobile nav behavior)

PR review checklist:

1. Tokens only (no palette leak)
2. No horizontal overflow on 390px and 393px widths
3. Touch targets honor 36/44/48 contract by intent
4. Home structure still matches Section 6 order
5. States present: default, active, focus, disabled/loading where relevant
6. Accessibility checks completed (contrast, keyboard/focus, icon-label coverage)
7. If interaction density changes, verify `HomeFeedControls` and `MobileTabBar` target sizing rules

---

## 11) Verification

Run after any design-related change:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based when behavior changes:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Recommended targeted visual/UX checks for Home:

```bash
pnpm -s test:e2e --grep "Mobile Home Feed Controls"
```

---

## 12) References

Internal:

- `app/globals.css`
- `app/utilities.css`
- `components/ui/button.tsx`
- `app/[locale]/(main)/_components/mobile-home.tsx`
- `components/layout/header/mobile/homepage-header.tsx`
- `components/shared/product/card/mobile.tsx`
- `app/[locale]/_components/mobile-tab-bar.tsx`
- `docs/FRONTEND.md` (frontend implementation + design quality bar)

External:

- Tailwind CSS v4 release notes: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind CSS v4 theme variables: https://tailwindcss.com/docs/theme
- shadcn/ui intro (open code): https://ui.shadcn.com/docs
- shadcn/ui `components.json`: https://ui.shadcn.com/docs/components-json
- Apple UI design tips (44pt hit target): https://developer.apple.com/design/tips/
- Apple accessibility HIG: https://developer.apple.com/design/human-interface-guidelines/accessibility
- web.dev accessible tap targets: https://web.dev/articles/accessible-tap-targets
- WCAG 2.2 updates: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- WCAG 2.2 SC 2.5.8 Target Size: https://www.w3.org/TR/WCAG22/#target-size-minimum

Reference set last verified: 2026-02-11
