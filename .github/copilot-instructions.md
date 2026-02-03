# Copilot Instructions (Treido)

Keep this file **thin** to avoid drift. SSOT lives in `docs/`.

## Start here

- Always-read repo entry: `AGENTS.md`
- Docs hub: `docs/00-INDEX.md`
- Rails + boundaries: `docs/AGENTS.md`
- Workflow + gates: `docs/WORKFLOW.md`
- Skills index: `docs/11-SKILLS.md` (definitions in `.codex/skills/`)

## Non-negotiables (quick)

- Tailwind v4 semantic tokens only (no palette classes, no gradients, no arbitrary values)
- All user-facing copy via `next-intl` (`messages/en.json` + `messages/bg.json`)
- `components/ui/*` primitives only; app composites live in `components/shared/*`
- Default to Server Components; `"use client"` only when required
- Use `proxy.ts` (no root `middleware.ts`)
- Pause for approval on DB/auth/payments/destructive ops

## Verification

Use the gate checklist in `docs/WORKFLOW.md`.
