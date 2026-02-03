# Skills Guide — Prompting the Treido Specialist Fleet

This guide explains how to prompt AI agents to leverage Treido’s **`treido-*` specialist skills**.

For the canonical inventory, see `docs/11-SKILLS.md`.

All Treido skills live in `.codex/skills/` and are prefixed `treido-*`.

## Active Skills (Treido-maintained)

| Skill | Use Case |
|-------|----------|
| `treido-rails` | Non-negotiables + pause conditions (PII/i18n/tokens/caching) |
| `treido-structure` | File placement + boundaries |
| `treido-design` | UI/UX design specs + polish |
| `treido-mobile-ux` | Touch + safe areas + iOS feel |
| `treido-nextjs-16` | App Router + caching + request conventions |
| `treido-tailwind-v4` | Tailwind v4 tokens + forbidden patterns |
| `treido-shadcn-ui` | UI primitives + Radix composition |
| `treido-supabase` | SSR clients + queries + RLS mindset |
| `treido-stripe` | Webhooks + payments safety |
| `treido-skillsmith` | Skill system maintenance |

---

## Prompt Templates

### 1) UI/UX Review (Design + Mobile)

```
Review [component/page] for UI/UX quality and native-app feel.
Focus on hierarchy, spacing rhythm, states (loading/empty/error), and touch targets.
```

### 2) Tailwind Token Fix

```
Scan [file/component] for Tailwind v4 rail violations.
Replace palette/gradient/arbitrary values with semantic tokens and stable patterns.
```

### 3) Next.js 16 / Caching Review

```
Review [page/data function] for Next.js 16 App Router correctness.
Validate RSC vs client boundaries and caching constraints ('use cache' purity).
```

### 4) Supabase Query Review

```
Review this Supabase query for security and stability:
- correct client (user/static/admin)
- explicit select (no select('*') on hot paths)
- RLS-safe identity checks
```

### 5) Stripe Webhook Review

```
Review the Stripe webhook handler for:
- signature verification
- idempotency (event.id dedupe)
- safe logging (no PII/payloads)
```

### 6) File Placement Question

```
Where should this new file/component live?
Explain placement choice using Treido boundaries (ui/shared/_components/actions/api).
```

---

## Power Prompts (Multi-Skill)

### Full Page “Ship Readiness” Pass
```
Audit this page for ship readiness:
1) UI/UX + mobile feel
2) Tailwind token rails
3) Next.js boundaries + caching constraints
4) i18n (no hardcoded user-facing strings)
```

### Payments Safety Pass
```
Audit checkout/webhooks for correctness:
- Stripe signature + idempotency
- Supabase client selection + explicit selects
- No secrets/PII in logs
```

---

## Best Practices for Prompting

- Be explicit about scope: file paths, routes, and what “done” means.
- Ask for a short **design spec** before implementation for UI-heavy work.
- For high-risk domains (DB/auth/payments/destructive ops), ask for a plan first (see `treido-rails` pause conditions).
