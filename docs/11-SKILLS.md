# 11-SKILLS.md — AI Skills Reference (V2)

> Minimal skill set for Treido. **No prefixes required** — describe the task and the assistant applies the right rules automatically.

| Scope | AI agent knowledge |
|-------|---------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Core Skills

| Skill | Use For | Verify With |
|------|---------|-------------|
| `treido-rails` | Project-wide rails: boundaries, pause conditions, verification | Gates (always) |
| `treido-frontend` | UI, routes, RSC/client boundaries, Tailwind v4 tokens, next-intl | Gates + unit tests (as needed) |
| `treido-backend` | Server actions, Supabase queries/RLS, Stripe/webhooks, caching/tagging | Gates + E2E smoke (as needed) |
| `codex-iteration` | Maintaining `.codex/skills/**` and skill tooling | `validate:skills` + `skills:sync` |

---

## How to Use (No Triggers)

Just ask in plain language:

- “Fix the button spacing on mobile” → `treido-frontend` + `treido-rails`
- “Add a server action for X” → `treido-backend` + `treido-rails`
- “Run the gates and tell me what failed” → `treido-rails`

---

## Pause Conditions (High Risk)

Human approval required before implementing:

- DB schema/migrations/RLS (`supabase/migrations/*`)
- Auth/access control/session changes
- Payments/Stripe/webhooks
- Destructive/bulk data operations

---

## Verification Gates

Always after each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Legacy Skills (Archived)

The previous “fleet” (orchestrator/spec/verify/UI/etc.) is kept only for reference at:

```
.codex/skills/.archive/
```

They are not validated/synced as active skills.

---

## Skill Tooling

```bash
# Validate repo + user skills structure
pnpm -s validate:skills

# Sync repo skills to $CODEX_HOME/skills (or ~/.codex/skills)
pnpm -s skills:sync
```

---

*Last updated: 2026-02-03*
