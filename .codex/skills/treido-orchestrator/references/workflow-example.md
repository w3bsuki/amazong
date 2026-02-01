# Workflow Example (UI Bundle)

This is a concrete example of the **parallel audit → single-writer plan → execute → verify/test** workflow.

## Example User Prompt

> “Fix the mobile landing page styling.”

## Phase 1 — Orchestrator Selects Bundle

- Intent match: “styling / UI looks off / mobile styling”
- Bundle: **UI**
- Audit lane: `treido-frontend` (AUDIT)

Orchestrator spawns the lane audit and requires the payload contract:
`.codex/skills/treido-orchestrator/references/audit-payload.md`

## Phase 1 — Sample Auditor Payloads (Read-only)

```md
## TW4

### Scope
- Files:
  - app/[locale]/(marketing)/page.tsx
  - components/shared/Hero.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | app/[locale]/(marketing)/page.tsx:34 | Arbitrary spacing `px-[13px]` | Replace with token-safe spacing (example: `px-3`) |
| TW4-002 | Medium | components/shared/Hero.tsx:18 | Palette utility `text-slate-900` | Replace with semantic token (example: `text-foreground`) |

### Acceptance Checks
- [ ] `pnpm -s styles:gate` passes
- [ ] No gradients/arbitrary values/palette colors in touched files

### Risks
- If tokens don’t match design intent, confirm approved tokens in `.codex/project/DESIGN.md`
```

```md
## SHADCN

### Scope
- Files:
  - components/ui/button.tsx
  - components/shared/HeroCta.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Critical | components/ui/button.tsx:7 | Primitive imports app code (`@/app/...`) | Move app-specific logic into `components/shared/*`; keep `components/ui/*` primitive-only |

### Acceptance Checks
- [ ] `components/ui/*` has no imports from `app/**`
- [ ] No domain/data fetching code inside `components/ui/*`

### Risks
- Moving logic may require updating import paths across call sites
```

```md
## NEXTJS

### Scope
- Files:
  - app/[locale]/(marketing)/page.tsx
  - app/[locale]/(marketing)/_components/HeroCta.client.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | High | app/[locale]/(marketing)/page.tsx:1 | Page marked `"use client"` due to CTA click | Convert page to Server Component; isolate click handler into a small client component |

### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
- [ ] No `cookies()`/`headers()` usage inside cached functions

### Risks
- Ensure client component boundary doesn’t pull in server-only modules
```

## Phase 1.5 — Orchestrator Merges Into One Audit File (Single Writer)

Create: `.codex/audit/2026-01-29_mobile-landing-styling.md`

```md
# Audit — 2026-01-29 — Mobile Landing Styling

## TW4
... (payload section copied verbatim)

## SHADCN
... (payload section copied verbatim)

## NEXTJS
... (payload section copied verbatim)
```

## Phase 2 — Orchestrator Writes Tasks (Single Writer)

Append a small, prioritized set into `.codex/TASKS.md` (example format):

```md
### UI Bundle — Mobile Landing Styling (ISSUE-EXAMPLE)

- [ ] [EXEC] [treido-frontend] NEXTJS-001: Make landing page a Server Component; isolate CTA client handler (ISSUE-EXAMPLE)
  - Verify: `pnpm -s typecheck`

- [ ] [EXEC] [treido-frontend] SHADCN-001: Remove `app/**` imports from `components/ui/button.tsx` (ISSUE-EXAMPLE)
  - Verify: `pnpm -s typecheck`

- [ ] [EXEC] [treido-frontend] TW4-001: Replace arbitrary spacing with token-safe spacing on landing (ISSUE-EXAMPLE)
  - Verify: `pnpm -s styles:gate`
```

## Phase 3 — Implementation (Single Writer)

`treido-frontend` executes in 1–3 file batches:

1. Batch 1: `NEXTJS-001` (server/client boundary)
2. Batch 2: `SHADCN-001` (primitive boundary)
3. Batch 3: `TW4-001` / `TW4-002` (token compliance)

After each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

## Phase 4/5 — Verify + Tests

`treido-verify` runs gates and picks minimal tests:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
```
