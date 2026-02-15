# DESIGN.md — UI + Frontend Contract

> Consolidated design and frontend implementation contract for Treido delivery.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-15 |
| Refresh cadence | Weekly + whenever style gates or frontend contracts change |

## Runtime Truth Paths

### Token + Utility Source

- `app/globals.css` is the token source of truth.
- `app/utilities.css` defines shared layout and safe-area utilities.
- Raw color definitions belong in CSS token files only.

### Component + Route Layers

- `components/ui/**`: primitive UI building blocks.
- `components/shared/**`: reusable composed UI.
- `components/layout/**`: shell/navigation/footer structures.
- `components/providers/**`: thin providers and app wiring.
- `app/[locale]/**`: route-level composition and page behavior.
- `hooks/**`: reusable client hooks.
- `lib/**`: pure shared logic/clients (no React UI).

### Enforcement Rails

- `scripts/scan-tailwind-palette.mjs`
- `scripts/scan-tailwind-arbitrary.mjs`
- `scripts/scan-tailwind-semantic-tokens.mjs`
- `scripts/scan-tailwind-token-alpha.mjs`
- `scripts/scan-mobile-chrome-consistency.mjs`
- `scripts/scan-control-overrides.mjs`

## Token Contract

### Semantic Tokens Only

- Use semantic utility classes (`bg-background`, `text-foreground`, `border-border`, `ring-ring`, `bg-card`, `text-muted-foreground`).
- Add new color semantics as `--color-<token-name>` in `app/globals.css`.
- Prefer token-based sizing/spacing utilities over hardcoded values.
- Keep component styling expressed through semantics, not literal palette values.
- Treat token naming as API: clear names, stable meaning, no alias chains that hide intent.

### Forbidden Patterns

The patterns below are expected to fail style gates:

| Pattern | Examples | Enforced by |
|---|---|---|
| Palette utilities | `bg-gray-100`, `text-slate-900`, `border-blue-200`, `fill-orange-400` | `scan-tailwind-palette.mjs` |
| Mono shortcuts | `bg-white`, `text-black`, `border-white/10` | `scan-tailwind-palette.mjs` |
| Gradient clusters | `bg-gradient-to-*`, `from-*`, `via-*`, `to-*`, raw `*-gradient(...)` | `scan-tailwind-palette.mjs` |
| Arbitrary class values | `w-[560px]`, `text-[13px]`, `rounded-[10px]`, `shadow-[...]` | `scan-tailwind-arbitrary.mjs` |
| Raw TSX/JS colors | `#fff`, `#000000`, `oklch(...)` literals | `scan-tailwind-arbitrary.mjs` |
| Token-alpha shortcuts | `bg-primary/10`, `ring-ring/20`, `border-border/40` | `scan-tailwind-token-alpha.mjs` |

Design intent of these bans:

- Keep visual language coherent across features.
- Prevent one-off classes from bypassing shared tokens.
- Maintain reliable theme and brand adjustments from a single token layer.

### Allowed Exceptions

- `app/globals.css` intentionally contains raw `oklch(...)` token definitions.
- `components/shared/filters/controls/color-swatches.tsx` may contain raw swatch values.
- Any additional exception must be explicit, file-scoped, and documented in the same PR.

## Component Boundaries

| Location | Use |
|---|---|
| `components/ui/*` | Primitives only; no domain logic or direct data fetching |
| `components/shared/*` | Reusable composites (cards, filters, fields) |
| `components/layout/*` | App shells (header/nav/footer/chrome) |
| `components/providers/*` | Thin context providers and wiring |
| `app/**/_components/*` | Route-private UI composition |
| `hooks/*` | Shared client hooks |
| `lib/*` | Pure utilities/clients; no React and no `app/` imports |

Boundary invariants:

- Route-private `_components/`, `_actions/`, `_lib/`, `_providers/` never cross route-group boundaries.
- Shared behavior graduates into `components/shared/*`, `hooks/*`, or `lib/*`.
- `components/ui/*` is editable open code, but stays primitive-only.

## Server vs Client Defaults

- Default to Server Components for rendering and data composition.
- Add `"use client"` only for state, effects, DOM APIs, or event handlers.
- Keep client components prop-driven.
- Keep auth checks and core data access server-side.
- If client state mirrors server truth, document ownership and invalidation rules.

## Data Fetching + Caching

Primary rules:

- Prefer Server Component fetches for initial render.
- Use cached functions (`"use cache"`, `cacheLife`, `cacheTag`) only with `createStaticClient()`.
- Avoid `cookies()` or `headers()` within cached functions.
- Avoid `select('*')` in hot paths; project required columns explicitly.
- Use stable query ordering for predictable cache behavior.

Safe vs unsafe patterns:

| Pattern | Status | Rationale |
|---|---|---|
| Server-rendered initial fetch | Preferred | Keeps data and auth checks close to server truth |
| `createStaticClient()` inside cache | Required | Avoids request-specific state in cached paths |
| Cookie/header reads inside cache | Forbidden | Breaks cache correctness and can cause subtle leaks |
| Client-side mini data layer for server-owned data | Avoid | Duplicates ownership and increases state drift |

## Design Thinking

Apply this pre-flight before coding or revising a surface:

1. Purpose: What user outcome is this surface responsible for right now?
2. Tone: What emotional register should the user feel in this moment?
3. Memorable detail: What one detail makes this feel intentionally designed?
4. Brand check: Does this feel like Treido (calm, scannable, touch-confident)?

Pre-flight output expected in implementation notes:

- One-sentence purpose statement.
- One tone adjective (or short pair).
- One intentional detail to preserve during iteration.

Color usage ratio target:

- 70% neutral surfaces (`background`, `surface-subtle`, `card`)
- 20% neutral contrast (`foreground`, `muted-foreground`, borders)
- 10% accent/status (`primary`, `destructive`, badges)

## Anti-Slop Rules

Avoid shipping these patterns:

- Typography slop: weak hierarchy, heading/body parity, ignored tracking tokens.
- Layout slop: repeated card grids with no rhythm, uniform spacing everywhere.
- Color slop: palette leaks, generic gradient defaults, missing state contrast.
- Motion slop: decorative animation loops, repeated fade-ins, missing press feedback.
- Component slop: default-heavy shadows, unlabeled icon-only actions, skeleton-only UX without meaningful state.

Corrective moves when slop appears:

- Reduce visual noise before adding new elements.
- Reassert hierarchy with type scale, spacing rhythm, and contrast.
- Replace decorative motion with feedback-driven transitions.
- Add explicit empty/loading/error states tied to user intent.

## Mobile UX Quality Bar

### Touch Targets

- Default interactive controls: `--control-default` (44px).
- Primary controls: `--control-primary` (48px).
- Compact controls: `--control-compact` (36px) only where density requires it.

### Safe Areas

Use safe-area utilities from `app/utilities.css` where relevant:

- `pt-safe`
- `pb-safe`
- `pt-app-header`
- `pb-tabbar-safe`

### Overflow

- No page-level horizontal scrolling on mobile widths.
- Content that can overflow must intentionally scroll within bounded containers.

### Motion

- Motion should communicate response and structure, not decoration.
- Honor `prefers-reduced-motion` for non-essential animation.

### Focus

- Keyboard focus must be visible for all interactive controls.
- Focus indicators must remain legible against semantic surfaces.

## Ship Criteria

Every new or modified surface must satisfy all checks:

1. Purpose and user state are explicit.
2. Typographic hierarchy is visible and intentional.
3. Interaction states exist where relevant (hover, active, focus-visible, disabled, selected).
4. Layout rhythm is deliberate, with density changes where useful.
5. Motion is feedback-first and reduced-motion aware.
6. Touch target sizing meets mobile baseline requirements.
7. Mobile widths avoid horizontal overflow.

## Accessibility Baseline

- Primary flows are keyboard reachable end-to-end.
- All interactive elements expose visible focus states.
- Icon-only controls include explicit labels.
- Non-essential animations respect reduced-motion preferences.
- Semantics and landmarks support assistive navigation.
- State feedback (loading, error, success) is perceivable without color-only cues.

## Layout + Motion Tokens

Current runtime token contract:

- Bottom nav spacing: `--spacing-bottom-nav` (`3rem`) used by `components/ui/mobile-bottom-nav.tsx` and utilities.
- Radius tokens: `--radius`, `--radius-card`, `--radius-lg`, and related derivatives in `app/globals.css`.
- Typography tokens: `--font-*` and `--letter-spacing-*` in `app/globals.css`.
- Motion tokens: `--duration-*` and `--ease-*` in `app/globals.css`.

Implementation guidance:

- Use token references for timing/spacing/radius instead of one-off literals.
- Keep interaction timing consistent across equivalent controls.
- Reserve stronger motion curves for high-intent transitions.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

*Last updated: 2026-02-15*
