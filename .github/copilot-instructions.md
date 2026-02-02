# Copilot Instructions

> This file makes Treido skills visible in VS Code's Agent Skills UI.
> Full skill definitions live in `.codex/skills/`.

## Quick Navigation

- **Entry point**: [AGENTS.md](../AGENTS.md)
- **Docs index**: [docs/00-INDEX.md](../docs/00-INDEX.md)
- **Active tasks**: [.codex/TASKS.md](../.codex/TASKS.md)
- **Workflow spec**: [.codex/WORKFLOW.md](../.codex/WORKFLOW.md)

---

## Project Context

This is **Treido** — a Next.js 16 App Router marketplace with:
- **Tailwind v4** semantic tokens (no palette colors/gradients)
- **shadcn/ui** primitives (`components/ui/*`)
- **Supabase** with RLS everywhere
- **Stripe** payments
- **next-intl** for i18n

---

## Skills Reference

### Execution Lanes

| Trigger | Skill | Purpose |
|---------|-------|---------|
| `ORCH:` | [treido-orchestrator](../.codex/skills/treido-orchestrator/SKILL.md) | Coordinates work end-to-end |
| `FRONTEND:` | [treido-frontend](../.codex/skills/treido-frontend/SKILL.md) | UI/routing implementation |
| `BACKEND:` | [treido-backend](../.codex/skills/treido-backend/SKILL.md) | Server actions, Supabase, Stripe |
| `UI:` / `DESIGN:` | [treido-ui](../.codex/skills/treido-ui/SKILL.md) | Premium UI implementation |
| `VERIFY:` | [treido-verify](../.codex/skills/treido-verify/SKILL.md) | QA gates and tests |
| `ALIGNMENT:AUDIT` | [treido-alignment](../.codex/skills/treido-alignment/SKILL.md) | Data contract auditing |

### Spec Agents (Audit-Only)

| Domain | Skill |
|--------|-------|
| Tailwind v4 | [spec-tailwind](../.codex/skills/spec-tailwind/SKILL.md) |
| shadcn/ui | [spec-shadcn](../.codex/skills/spec-shadcn/SKILL.md) |
| Next.js | [spec-nextjs](../.codex/skills/spec-nextjs/SKILL.md) |
| Supabase | [spec-supabase](../.codex/skills/spec-supabase/SKILL.md) |
| TypeScript | [spec-typescript](../.codex/skills/spec-typescript/SKILL.md) |

---

## Non-Negotiable Rails

### Tailwind v4 Tokens Only
```
✅ bg-background, bg-card, bg-surface-page
✅ text-foreground, text-muted-foreground
✅ border-border

❌ bg-gray-100, text-blue-600 (palette)
❌ bg-gradient-to-r (gradients)
❌ bg-[#fff] (arbitrary)
❌ bg-primary/10 (opacity hacks)
```

### shadcn Boundaries
- **Primitives**: `components/ui/*` — no app logic
- **Composites**: `components/shared/*` — reusable features
- **Route-private**: `app/[locale]/(group)/**/_components/*`

### i18n Required
All user-facing strings must use `next-intl`:
- Messages: `messages/en.json`, `messages/bg.json`
- Never hardcode strings in TSX

### Request Routing
- Use `proxy.ts` for request routing/mutation
- Do NOT create root `middleware.ts`

---

## Verification Gates

```powershell
# Always run after changes
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

# After UI changes
pnpm -s test:unit

# After auth/checkout/routing changes
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Pause Conditions (Human Approval Required)

Stop and escalate before implementing:
- Database schema/migrations/RLS/policies
- Auth/access control changes
- Payments/Stripe/billing changes
- Data deletion or truncation

---

## File Organization

| Type | Location |
|------|----------|
| Server actions | `app/actions/*` |
| Route handlers | `app/api/**/route.ts` |
| UI primitives | `components/ui/*` |
| Shared composites | `components/shared/*` |
| Layout shells | `components/layout/*` |
| Supabase clients | `lib/supabase/*` |
| Migrations | `supabase/migrations/*` |
| Tokens | `app/globals.css` |

---

## Common Commands

```powershell
# Development
pnpm dev                    # Start dev server

# Quality gates
pnpm -s typecheck          # TypeScript check
pnpm -s lint               # ESLint
pnpm -s styles:gate        # Tailwind rail check

# Testing
pnpm -s test:unit          # Unit tests
pnpm -s test:e2e           # Full E2E suite
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke  # Smoke tests
```

---

## Full Skill Docs

For complete skill definitions with decision trees, fix recipes, and anti-patterns:

```
.codex/skills/
├── treido-orchestrator/SKILL.md
├── treido-frontend/SKILL.md
├── treido-backend/SKILL.md
├── treido-ui/SKILL.md
├── treido-verify/SKILL.md
├── treido-alignment/SKILL.md
├── codex-iteration/SKILL.md
├── spec-tailwind/SKILL.md
├── spec-shadcn/SKILL.md
├── spec-nextjs/SKILL.md
├── spec-supabase/SKILL.md
└── spec-typescript/SKILL.md
```

Each skill folder contains:
- `SKILL.md` — Main skill definition
- `references/` — Decision trees, playbooks, examples
- `scripts/` — Automation helpers (where applicable)
