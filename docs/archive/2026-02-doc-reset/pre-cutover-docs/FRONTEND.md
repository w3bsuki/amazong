# FRONTEND.md — Frontend Implementation Contract

> Canonical frontend guide for Treido. Consolidates legacy frontend guide materials.

| Scope | Frontend architecture, implementation patterns, design quality bar |
|-------|--------------------------------------------------------------------|
| Audience | AI agents, frontend engineers |
| Owner | treido-orchestrator |
| Last verified | 2026-02-12 |
| Refresh cadence | Weekly + whenever frontend standards change |
| Last updated | 2026-02-12 |

---

## 1) Source Of Truth

1. `docs/DESIGN.md` defines token contracts, anti-slop rules, and visual constraints.
2. `ARCHITECTURE.md` defines module boundaries and route-private conventions.
3. This file defines implementation defaults and quality expectations for frontend delivery.

If these docs conflict with runtime code, treat runtime as truth and update docs in the same change.

---

## 2) Component Placement Rules

| Location | Use |
|----------|-----|
| `components/ui/*` | Primitives only (no domain logic/API calls) |
| `components/shared/*` | Reusable business composites |
| `app/**/_components/*` | Route-private UI only |
| `hooks/*` | Shared client hooks |
| `lib/*` | Pure non-React utilities |

Do not import route-private components across route groups.

---

## 3) Implementation Defaults

- Default to Server Components; use `"use client"` only for state/effects/events.
- Keep client components prop-driven and narrow in scope.
- Use semantic token classes only (`bg-background`, `text-foreground`, `border-border`).
- Avoid palette literals (`text-blue-500`, hex colors) in app UI.
- Keep mobile-first behavior as default, then enhance desktop.

---

## 4) Design Quality Bar (Non-Negotiable)

Before shipping any UI surface, confirm:

1. Purpose and user state are explicit.
2. Clear typography hierarchy exists (size + weight + spacing).
3. Interaction states exist (hover, active, focus-visible, disabled, selected).
4. Layout is intentional (not generic card-grid repetition).
5. Motion adds feedback (press/transition), not decorative noise.
6. Touch targets meet 44px default and 48px for primary controls.
7. No horizontal overflow at mobile widths.

---

## 5) Anti-Slop Checks

Reject changes that include:

- Headings visually indistinguishable from body text.
- One-style-everywhere layouts with no rhythm/density changes.
- Purple-on-white default gradients or generic template aesthetics.
- Missing focus-visible states on interactive controls.
- Icon-only controls without accessible labels.
- Heavy shadows used as primary hierarchy (Treido is border-first).

---

## 6) Forms + Validation

- Use Zod schemas at input boundaries.
- Use `react-hook-form` + resolver patterns with explicit inferred types.
- Provide actionable, user-readable validation messages.
- Avoid exposing raw error objects in UI.

---

## 7) Data Fetching Patterns

Preferred:

- Server-side fetch in Server Components for initial data.
- Client fetching only when interaction requires client reactivity.
- Keep API response handling typed and bounded.

---

## 8) Accessibility Baseline

- Keyboard reachable flows for all primary actions.
- `focus-visible` indicators on all interactive elements.
- ARIA labels for icon-only actions.
- Respect `prefers-reduced-motion`.
- Maintain contrast and readable type at compact sizes.

---

## 9) Verification For Frontend Work

Always:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based (flow/logic changes):

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## 10) References

- Design system: `docs/DESIGN.md`
- Architecture boundaries: `ARCHITECTURE.md`
- Workflow/gates: `docs/WORKFLOW.md`
- Testing strategy: `docs/TESTING.md`

*Last updated: 2026-02-12*
