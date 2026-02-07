# Skills Guide — Prompting the Treido Specialist Fleet

This guide explains how to prompt AI agents to leverage Treido’s **`treido-*` specialist skills**.

For the canonical inventory, see `docs/SKILLS.md`.

Canonical Treido skills live in `.claude/skills/` and are mirrored to `.agents/skills/` for Codex compatibility.

## Active Skills (Consolidated, 7)

| Skill | Use Case |
|-------|----------|
| `treido-styling` | Tailwind v4 semantic-token rails + shadcn boundary-safe styling |
| `treido-design` | UI/UX design specs + polish |
| `treido-nextjs` | App Router boundaries, Server vs Client, caching purity, request conventions |
| `treido-data` | Supabase data + auth query/client patterns |
| `treido-payments` | Stripe checkout/webhooks/idempotency safety |
| `treido-testing` | Playwright + Next.js reliability and CI stability |
| `treido-a11y` | WCAG 2.2 AA semantics, focus, keyboard, and screen-reader support |

---

## Prompt Templates (By Domain)

### 1) UI/UX + Accessibility Review

```
Review [component/page] for UI/UX quality and native-app feel.
Focus on hierarchy, spacing rhythm, states (loading/empty/error), touch targets, and WCAG 2.2 AA issues.
```

### 2) Styling Rail Fix (Tailwind v4 + shadcn)

```
Scan [file/component] for Tailwind v4 rail violations.
Replace palette/gradient/arbitrary values with semantic tokens and stable patterns.
```

### 3) Next.js App Router / Caching Review

```
Review [page/data function] for Next.js App Router correctness.
Validate RSC vs client boundaries and caching constraints ('use cache' purity).
```

### 4) Data + Auth Boundary Review

```
Review this Supabase access path for security and stability:
- correct client selection
- explicit select shape on hot paths
- safe auth/session handling
```

### 5) Stripe Webhook Review

```
Review the Stripe webhook handler for:
- signature verification
- idempotency (event.id dedupe)
- safe logging (no PII/payloads)
```

### 6) Test Reliability Pass

```
Review this test or flow for stability:
- selector quality
- auth state strategy
- flake risk and CI reliability
```

---

## Power Prompts (Multi-Skill)

### Full Page “Ship Readiness” Pass
```
Audit this page for ship readiness:
1) Styling rails (Tailwind v4 semantic tokens only)
2) UI/UX + accessibility quality
3) Next.js boundaries + caching constraints
4) i18n copy hygiene (no hardcoded user-facing strings)
```

### Payments Safety Pass
```
Audit checkout/webhooks for correctness:
- Stripe signature + idempotency
- Supabase client selection + query safety
- No secrets/PII in logs
```

---

## Best Practices for Prompting

- Be explicit about scope: file paths, routes, and what “done” means.
- Ask for a short **design spec** before implementation for UI-heavy work.
- For high-risk domains (DB/auth/payments/destructive ops), request a plan first and follow root `AGENTS.md` pause rules.

