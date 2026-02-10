# DESIGN.md — Treido Design System

> SSOT for UI/UX styling rules in Treido.
> This document is implementation-aligned and mobile-first.

| Scope | Visual language, tokens, component behavior, interaction quality bar |
|---|---|
| Audience | Engineers, designers, AI agents |
| Stack | Next.js App Router + Tailwind CSS v4 + shadcn/ui (open code) + Radix |
| Primary Token Source | `app/globals.css` |
| Last Updated | 2026-02-10 |

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

Primary type tokens in runtime include:

- `text-2xs`, `text-xs`, `text-compact`, `text-body`, `text-reading`, `text-price`
- Keep product title compact and scannable; keep price visually dominant
- Use `text-2xs` sparingly for dense metadata only; primary readable UI copy SHOULD be `text-xs` or larger

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

---

## 8) Motion And Feedback

- Use subtle transitions only (`duration-fast` or `duration-normal`)
- Avoid decorative motion for static surfaces
- Press feedback via `active:bg-active` and/or slight opacity change
- Honor reduced motion globally
- Avoid introducing bespoke easing/animation tokens when existing `--ease-*` and `--duration-*` tokens suffice

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

Reference set last verified: 2026-02-10
