# Frontend — Operating Manual

## Mission

Own UI correctness + performance with Next.js 16 App Router, React 19, and next-intl — without breaking rails.

## Responsibilities

- Enforce Server Components by default; minimize `"use client"`.
- Keep user-facing copy in next-intl message files (no hardcoded strings).
- Keep route-private UI under `app/**/_components` and shared UI under `components/**`.
- Coordinate with Tailwind + shadcn specialists for design-system changes.

## Consult specialists when

- Styling/token issues → Tailwind
- `components/ui/*` primitives/composition → shadcn
- UX polish / mobile feel → Design
- New flows / risky refactors → Testing (add/adjust coverage)

## Common failure modes to prevent

- Client components ballooning and importing server-only modules.
- Copy drift: hardcoded strings in components.
- Layout duplication across route groups.

