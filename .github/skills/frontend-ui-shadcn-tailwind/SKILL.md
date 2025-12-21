---
name: frontend-ui-shadcn-tailwind
description: Frontend design + UI implementation for this repo (modern utilitarian marketplace look). Use when asked to “make it look better/less generic”, redesign/polish layouts, add new UI sections, refactor components, or improve a11y/responsiveness using shadcn/ui + Tailwind v4.
---

# Frontend (Design + UI Implementation)

This skill is the single frontend playbook for this repo: it covers **visual direction** (so the UI doesn’t look generic) and **implementation** (so the code fits the existing system).

Default house style for this repo: **modern utilitarian marketplace** (dense-but-readable like Amazon/eBay/Target): sharp-ish radius, neutral surfaces, strong hierarchy, minimal effects.

This skill should *not* make you timid: when the request is open-ended, explore 2–3 distinct directions quickly, then commit to one and implement it cleanly.

## Non-negotiables for this repo

- Use existing shadcn primitives in `components/ui/` instead of inventing new UI primitives.
- Follow Tailwind v4 conventions: global CSS is in `app/globals.css` (see `components.json`).
- Respect the repo’s structure rules in `STRUCTURE.md`:
  - `components/ui` is primitives only.
  - Route-specific UI lives under `app/[locale]/.../_components/`.
  - Shared composites belong in `components/common/` or `components/layout/`.

## Design direction (avoid generic UI)

Before coding, commit to a direction in 2–4 bullets:

- **Purpose**: what the screen helps the user do.
- **Tone**: utilitarian marketplace by default; if the user asks, pick an explicit vibe (editorial, luxury, brutalist, industrial, playful).
- **Differentiator**: one memorable detail (layout move, standout header, tiny motion cue, or distinctive density/structure).

Guidelines that work well for this repo’s marketplace style:

- **Typography**: strong hierarchy, $14\text{px}$-ish body, semibold for price, careful leading/tracking.
- **Composition**: dense information grouped into clear sections; align to a grid; consistent paddings/gaps.
- **Color**: mostly neutral surfaces with a single brand/CTA accent (use existing tokens in `app/globals.css`).
- **Effects**: minimal shadows/gradients; borders and spacing do most of the work.
- **Motion**: small affordance transitions only; don’t add “flashy” effects to critical flows.

### “Give it space to be great” (how to explore without thrashing)

If the user asks for “great” / “premium” / “less generic” and doesn’t prescribe a specific vibe:

1. Propose **2–3 direction sketches** (each 1–2 sentences):
   - a) *Dense marketplace* (information-first)
   - b) *Editorial marketplace* (strong header, calmer cards)
   - c) *Tech/utilitarian* (tighter grid, sharper separators)
2. Pick one and state the **design contract** (spacing rhythm, type scale, card density, CTA emphasis).
3. Implement the highest-impact changes first: layout grid → sectioning → typography → component polish.

## Workflow

1. Identify where the UI should live:
   - Route-owned component → colocate under the owning route group: `app/[locale]/(group)/.../_components/`.
   - Shared component used across routes → place under `components/` (prefer `components/common/` or `components/layout/`).
   - Primitive UI building blocks only → `components/ui/`.

2. Use the existing import aliases from `components.json`:
   - `@/components/ui/*`
   - `@/components/*`
   - `@/lib/*`
   - `@/hooks/*`

3. When adding UI:
   - Prefer composition: build from primitives (Button, Card, Dialog, Form, etc.).
   - Keep components small and focused.
   - Ensure accessibility basics: labels, focus order, keyboard for dialogs/menus.

4. After changes:
   - If you need to validate or the user asks for verification, run typecheck once: `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`.
   - If the change is user-flow critical (navigation, checkout, auth, locale switching), run Playwright: `pnpm test:e2e`.

## Quality bar (ship-ready)

- **Hierarchy**: user can scan price/title/state in <2 seconds.
- **Consistency**: spacing, radius, borders align with existing tokens.
- **Accessibility**: focus visible, labels/aria where needed, no color-only meaning.
- **Performance**: avoid heavy effects; keep images sized and layout stable.

## Practical patterns

- Forms: prefer `react-hook-form` + `zod` (already in deps) and the existing shadcn `Form` primitives.
- Modals/drawers/menus: use `Dialog`, `Drawer`, `DropdownMenu` from `components/ui`.
- Avoid new theme tokens: use existing Tailwind tokens/CSS variables already defined in `app/globals.css`.

### Design quality (within this repo’s design system)

When the user asks to “make it look better / less generic / more polished,” focus on **composition and typography** rather than inventing new colors, fonts, or primitives.

- Pick a clear direction for the screen: minimal and calm, dense and data-heavy, editorial, playful, etc.
- Strengthen hierarchy using existing tokens: spacing rhythm, font sizes/weights, and consistent alignment.
- Prefer a few high-impact improvements over lots of small tweaks (e.g., one strong header + improved section grouping).
- Keep components coherent: consistent padding, border radii, and gaps across cards/sections.
- Avoid introducing new design system primitives, new global theme variables, or new font stacks.

## Examples (prompts that should trigger this skill)

- “Build a shadcn-based settings form for the sell flow.”
- “Make this card layout responsive and consistent with the rest of the app.”
- “Replace custom markup with `@/components/ui` primitives.”
- “Improve spacing/typography and overall polish; make it feel less generic.”
- “Do a quick design direction pass: 3 options, pick one, implement.”
