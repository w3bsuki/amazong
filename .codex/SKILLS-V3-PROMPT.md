# Skills V3 Iteration Prompt

> Copy this into a new chat to continue refining the agent skills system.

---

## Context

We rebuilt Treido's agent skills from V1 (14 broken skills, 3000+ lines) to V2 (3 consolidated skills, ~490 lines). But V2 is still too monolithic.

**Key insight**: Each skill is loaded by a subagent. Smaller, focused skills = less context noise per subagent = better performance.

**New direction**: Split into 8-12 granular skills instead of 3 fat ones.

---

## Current State (V2)

Location: `.codex/skills/`

```
treido-frontend/SKILL.md   (151 lines) - UI, Tailwind, shadcn, i18n, RSC
treido-backend/SKILL.md    (201 lines) - Auth, Supabase, webhooks, caching, validation
treido-rails/SKILL.md      (139 lines) - File org, naming, pause conditions, verification
```

Copilot instructions: `.github/copilot-instructions.md` (47 lines)

---

## Proposed V3 Split

Split by **invocation context** - what subagent would need what knowledge:

### From treido-frontend (split into 4):

| Skill | Focus | When Invoked |
|-------|-------|--------------|
| `tailwind-tokens` | Semantic tokens, no palette/gradients/arbitrary | Styling any component |
| `shadcn-boundaries` | ui/* vs shared/* vs _components, no app logic in primitives | Creating/editing components |
| `i18n-nextintl` | All strings via next-intl, both locales | Any user-facing text |
| `rsc-patterns` | Server vs client components, small islands | Page/component architecture |

### From treido-backend (split into 4):

| Skill | Focus | When Invoked |
|-------|-------|--------------|
| `supabase-queries` | Explicit select, client context, RLS default | Any database query |
| `auth-security` | getUser() verification, no admin default, no log secrets | Auth-related code |
| `webhooks-stripe` | Signature verify, idempotency, no log payload | Webhook handlers |
| `caching-rules` | use cache constraints, revalidateTag, pure reads | Cached functions |

### From treido-rails (split into 2-3):

| Skill | Focus | When Invoked |
|-------|-------|--------------|
| `file-organization` | App structure, components structure, naming | Creating new files |
| `pause-conditions` | DB/auth/payments/deletion require human approval | High-risk changes |
| `verification-gates` | typecheck, lint, styles:gate, test commands | After any change |

---

## Skill Format (Vercel/Anthropic standard)

```markdown
---
name: skill-name
description: One-line description of when this skill applies
---

# skill-name

One sentence intro.

## When to Apply
- Context 1
- Context 2

## Rules

| Rule | Description |
|------|-------------|
| `rule-id` | Brief description |

## ✅ Do

\`\`\`tsx
// Good example
\`\`\`

## ❌ Don't

\`\`\`tsx
// Bad example
\`\`\`

## Verification
\`\`\`powershell
command
\`\`\`
```

**Target**: 50-80 lines per skill. Focused. No philosophy.

---

## Non-Negotiable Rules to Preserve

### Tailwind v4
```
✅ bg-background, text-foreground, border-border
❌ bg-gray-100, bg-gradient-to-r, bg-[#fff], bg-primary/10
```

### i18n
- All strings via `next-intl`
- Both `messages/en.json` and `messages/bg.json`

### shadcn
- `components/ui/*` = primitives only, no app logic
- `components/shared/*` = composites

### Auth
- Always `supabase.auth.getUser()` in server actions
- Never `createAdminClient()` without explicit guard

### Webhooks
- Always verify Stripe signatures
- Always idempotent (store processed event IDs)

### Caching
- `'use cache'` cannot use `cookies()`, `headers()`, auth
- Use `createStaticClient()` for cached reads

### Pause Conditions
Stop for human approval:
- Database schema/migrations/RLS
- Auth/access control
- Payments/Stripe
- Data deletion

### Routing
- Use `proxy.ts`
- Never create root `middleware.ts`

---

## Task

1. **Read current V2 skills** in `.codex/skills/treido-*/SKILL.md`
2. **Split into 8-12 granular skills** following the proposed structure
3. **Each skill 50-80 lines**, focused on one context
4. **Update `.github/copilot-instructions.md`** to reference new skills
5. **Archive V2** to `.codex/skills/.archive/v2/`

---

## Success Criteria

- [ ] 8-12 skill files, each 50-80 lines
- [ ] Each skill has clear "When to Apply" context
- [ ] All non-negotiable rules preserved
- [ ] copilot-instructions updated with skill table
- [ ] V2 archived

---

## File Locations

- Skills: `.codex/skills/{skill-name}/SKILL.md`
- Copilot config: `.github/copilot-instructions.md`
- Archive: `.codex/skills/.archive/`
- Entry point: `AGENTS.md`
