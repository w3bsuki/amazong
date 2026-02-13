# DESIGN.md — UI Design Contract

> Runtime-backed design rules for Treido UI. This is not a component catalog.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever style gates change |

## Scope

Semantic tokens, spacing, typography, motion, and mobile UX constraints. This file exists to prevent "looks fine" UI drift and to make `styles:gate` failures actionable.

## Runtime Truth Paths

- `app/globals.css` (token source of truth)
- `app/utilities.css` (safe-area + layout utilities)
- `components/ui/**` (primitive layer)
- `components/shared/**` (composites)
- `scripts/scan-tailwind-*.mjs` (enforced style rails)

## 1) Token Contracts (Enforced By `styles:gate`)

### 1.1 Semantic Tokens Only

- Use semantic token utilities (`bg-background`, `text-foreground`, `border-border`, `ring-ring`, etc.).
- Add new semantic color tokens as `--color-<token-name>` in `app/globals.css`.
- Prefer token-variable utilities for sizing/spacing: `h-(--control-default)`, `gap-(--spacing-*)`, etc.

### 1.2 Forbidden Patterns (Expect Gate Failures)

These are mechanically enforced by the scanners in `scripts/`:

- Palette utilities: `bg-gray-100`, `text-slate-900`, `border-blue-200`, `fill-orange-400`, etc. (`scripts/scan-tailwind-palette.mjs`)
- Mono shortcuts: `bg-white`, `text-black`, `border-white/10`, etc. (`scripts/scan-tailwind-palette.mjs`)
- Gradients: `bg-gradient-to-*` clusters and `from-*/to-*/via-*`, plus raw `*-gradient(...)` usage (`scripts/scan-tailwind-palette.mjs`)
- Arbitrary values: `w-[560px]`, `text-[13px]`, `rounded-[10px]`, `shadow-[...]`, etc. (`scripts/scan-tailwind-arbitrary.mjs`)
- Raw colors in TSX/JS: hex (`#fff`) or `oklch(...)` literals (`scripts/scan-tailwind-arbitrary.mjs`)
- Token alpha hacks: `bg-primary/10`, `ring-ring/20`, `border-border/40`, `bg-destructive/10`, `bg-surface-*/50`, etc. (`scripts/scan-tailwind-token-alpha.mjs`)

### 1.3 Allowed Exceptions

- `app/globals.css` is the token source of truth and intentionally contains raw `oklch(...)`.
- `components/shared/filters/controls/color-swatches.tsx` may contain raw swatch values.

## 2) Pre-Flight (Before Coding UI)

Color usage ratio target:

- 70% neutral surfaces (`background`, `surface-subtle`, `card`)
- 20% neutral contrast (`foreground`, `muted-foreground`, borders)
- 10% accent/status (`primary`, `destructive`, badges)

### 2.1) Design Thinking (Before Coding)

Before building or modifying any UI surface, answer these four questions:

1. **Purpose:** What user goal does this surface serve? Who sees it and what’s their state of mind? Does every visible element earn its place?
2. **Tone:** What’s the emotional register for this surface?
3. **Memorable detail:** What’s the one thing that makes this feel designed (a typographic moment, micro-interaction, or layout choice)?
4. **Brand check:** Does this feel like Treido (calm, scannable, touch-confident), or like a generic starter template?

### 2.2) Anti-Slop Rules (Banned Patterns)

These patterns signal low-effort UI and must be avoided:

- Typography slop: no hierarchy, headings indistinguishable from body, ignoring `--letter-spacing-tight`.
- Layout slop: endless identical cards, uniform spacing everywhere, no rhythm/density changes.
- Color slop: palette leaks, generic purple-on-white gradients, missing hover/active/selected differentiation.
- Motion slop: decorative animation, identical fade-ins, missing press feedback, ignoring reduced motion.
- Component slop: default heavy shadows, icon-only buttons without labels, “skeleton everywhere” without real states.

### 2.3) Quality Compounds

- Micro-polish matters: radius consistency, token-aligned spacing rhythm, timing via `--duration-*` + `--ease-*`.
- Restraint is design: fewer elements with precise spacing reads more intentional than “more stuff”.
- Context-specific character: home feed vs seller dashboard vs checkout should feel cohesive but tuned.

## 3) Mobile UX Quality Bar (Non-Negotiable)

- Default touch target: `--control-default` (44px), primary: `--control-primary` (48px), compact-only: `--control-compact` (36px).
- Respect safe areas: prefer `pt-safe`, `pb-safe`, `pt-app-header`, `pb-tabbar-safe` utilities from `app/utilities.css`.
- No page-level horizontal overflow: primary layouts must not require sideways scrolling on mobile.
- Reduced motion: respect `prefers-reduced-motion` for non-essential animation.
- Focus visible: all interactive controls must have a keyboard-visible focus state.

## 4) Core Layout + Motion Tokens (Current Runtime Contract)

- Bottom nav spacing: `--spacing-bottom-nav` is `3rem` (48px) in `app/globals.css` and is consumed by `components/ui/mobile-bottom-nav.tsx` and `app/utilities.css`.
- Radii: base `--radius` plus `--radius-card`, `--radius-lg`, etc are defined in `app/globals.css`.
- Type + tracking: `--font-*` and `--letter-spacing-*` are defined in `app/globals.css`.
- Motion: `--duration-*` and `--ease-*` are defined in `app/globals.css`.

## 5) Verification

- Style rails: `pnpm -s styles:gate`
- Docs contracts (when updating these rules): `pnpm -s docs:check`

## See Also

- `docs/ui/FRONTEND.md`
- `docs/QA.md`
- `ARCHITECTURE.md`

*Last updated: 2026-02-13*

