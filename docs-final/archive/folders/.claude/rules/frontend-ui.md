---
paths: components/**/*.{ts,tsx}, app/**/_components/**/*.{ts,tsx}
---

# Frontend (Design + UI Implementation)

Single frontend playbook: **visual direction** + **implementation** fitting the existing system.

**House style**: modern utilitarian marketplace (dense-but-readable like Amazon/eBay/Target): sharp-ish radius, neutral surfaces, strong hierarchy, minimal effects.

## Non-negotiables

- Use existing shadcn primitives in `components/ui/` — don't invent new primitives
- Follow Tailwind v4: global CSS in `app/globals.css`
- Route-specific UI → `app/[locale]/.../_components/`
- Shared composites → `components/shared/` or `components/layout/`

## Design Direction

Before coding, commit to a direction:

- **Purpose**: what the screen helps the user do
- **Tone**: utilitarian marketplace (or explicit vibe if requested)
- **Differentiator**: one memorable detail

Guidelines:

- **Typography**: strong hierarchy, ~14px body, semibold for price
- **Composition**: dense info grouped into sections; grid-aligned; consistent gaps
- **Color**: neutral surfaces + single brand/CTA accent (existing tokens)
- **Effects**: minimal shadows/gradients; borders and spacing do the work
- **Motion**: small affordance transitions only

## "Make it less generic" Process

1. Propose **2–3 directions** (1–2 sentences each):
   - a) Dense marketplace (info-first)
   - b) Editorial marketplace (strong header, calmer cards)
   - c) Tech/utilitarian (tighter grid, sharper separators)
2. Pick one and state the **design contract**
3. Implement highest-impact first: layout → sectioning → typography → polish

## Workflow

1. Where does the UI live?
   - Route-owned → `app/[locale]/(group)/.../_components/`
   - Shared → `components/shared/` or `components/layout/`
   - Primitive only → `components/ui/`

2. Use import aliases: `@/components/ui/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`

3. Build from primitives (Button, Card, Dialog, Form)
4. Keep components small and focused
5. Accessibility basics: labels, focus order, keyboard for dialogs/menus

## Quality Bar

- **Hierarchy**: user scans price/title/state in <2 seconds
- **Consistency**: spacing, radius, borders align with tokens
- **Accessibility**: focus visible, labels/aria, no color-only meaning
- **Performance**: avoid heavy effects; stable layout

## Trigger Prompts

- "Build a shadcn-based settings form"
- "Make this card layout responsive"
- "Replace custom markup with @/components/ui primitives"
- "Make it feel less generic / more polished"
