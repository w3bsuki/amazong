# Workflow Example (UI Bundle)

## Example User Prompt

> “Fix the mobile landing page styling.”

## Phase 1 — Orchestrator Selects Bundle

- Bundle: **UI**
- Auditors: `treido-audit-nextjs` + `treido-audit-tw4` + `treido-audit-shadcn`
- Contract: `.claude/skills/treido-orchestrator/references/audit-payload.md`

## Phase 1 — Sample Auditor Payloads (Read-only)

```md
## TW4
### Scope
- Files:
  - app/[locale]/(marketing)/page.tsx
### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | app/[locale]/(marketing)/page.tsx:34 | Arbitrary spacing `px-[13px]` | Replace with token-safe spacing (example: `px-3`) |
### Acceptance Checks
- [ ] `pnpm -s styles:gate` passes
### Risks
- Confirm approved tokens in `docs/DESIGN.md`
```

```md
## SHADCN
### Scope
- Files:
  - components/ui/button.tsx
### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Critical | components/ui/button.tsx:7 | Primitive imports app code (`@/app/...`) | Move app logic into `components/shared/*`; keep `components/ui/*` primitive-only |
### Acceptance Checks
- [ ] `components/ui/*` has no imports from `app/**`
### Risks
- Update call sites after moving logic
```

```md
## NEXTJS
### Scope
- Files:
  - app/[locale]/(marketing)/page.tsx
### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | High | app/[locale]/(marketing)/page.tsx:1 | Page marked `"use client"` due to CTA click | Convert page to Server Component; isolate click handler to a small client component |
### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
### Risks
- Ensure client boundary doesn’t pull in server-only modules
```

## Phase 1.5 — Merged Audit File (Single Writer)

Create: `audit/2026-01-29_mobile-landing-styling.md`

```md
# Audit — 2026-01-29 — Mobile Landing Styling
## TW4
... (payload copied verbatim)
## SHADCN
... (payload copied verbatim)
## NEXTJS
... (payload copied verbatim)
```

## Phase 2 — TASKS.md Entries (Single Writer)

```md
- [ ] [EXEC] [treido-impl-frontend] NEXTJS-001: Make landing page a Server Component; isolate CTA client handler (ISSUE-EXAMPLE)
  - Verify: `pnpm -s typecheck`
- [ ] [EXEC] [treido-impl-frontend] SHADCN-001: Remove `app/**` imports from `components/ui/button.tsx` (ISSUE-EXAMPLE)
  - Verify: `pnpm -s typecheck`
- [ ] [EXEC] [treido-impl-frontend] TW4-001: Replace arbitrary spacing with token-safe spacing on landing (ISSUE-EXAMPLE)
  - Verify: `pnpm -s styles:gate`
```

## Phase 3–5 — Execute + Verify

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
```

