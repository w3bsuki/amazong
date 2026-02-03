# Copilot Instructions

**Treido** - Next.js 16 App Router marketplace with Tailwind v4, shadcn/ui, Supabase, Stripe, next-intl.

## Skills (Auto-Applied)

| Skill | When | File |
|-------|------|------|
| Rails | Non-negotiables + pauses | `.codex/skills/treido-rails/SKILL.md` |
| Structure | File placement + boundaries | `.codex/skills/treido-structure/SKILL.md` |
| Next.js 16 | App Router + caching | `.codex/skills/treido-nextjs-16/SKILL.md` |
| Tailwind v4 | Token rails + forbidden patterns | `.codex/skills/treido-tailwind-v4/SKILL.md` |
| shadcn/ui | UI primitives + composition | `.codex/skills/treido-shadcn-ui/SKILL.md` |
| Design | UI/UX specs + polish | `.codex/skills/treido-design/SKILL.md` |
| Mobile UX | Touch + safe areas + iOS feel | `.codex/skills/treido-mobile-ux/SKILL.md` |
| Supabase | SSR clients + queries + RLS | `.codex/skills/treido-supabase/SKILL.md` |
| Stripe | Webhooks + payments safety | `.codex/skills/treido-stripe/SKILL.md` |
| Skill system | Skills/docs/tooling maintenance | `.codex/skills/treido-skillsmith/SKILL.md` |

No prefixes needed. Context determines which rules apply.

## Navigation

- Entry: `AGENTS.md`
- Docs: `docs/00-INDEX.md`
- Workflow: `docs/WORKFLOW.md`

## Non-Negotiables

### Tailwind v4
```
OK: bg-background, text-foreground, border-border
NO: bg-gray-100, bg-gradient-to-r, bg-[#fff], bg-primary/10
```

### i18n
All strings via `next-intl`. Both `messages/en.json` and `messages/bg.json`.

### shadcn
- `components/ui/*` = primitives only
- `components/shared/*` = composites

### Routing
Use `proxy.ts`. Never create root `middleware.ts`.

## Verification

See `docs/WORKFLOW.md` for the current gate checklist.

## Pause Conditions

Stop and ask human before:
- Database schema/migrations/RLS
- Auth/access control
- Payments/Stripe
- Data deletion

## File Organization

| Type | Location |
|------|----------|
| Server actions | `app/actions/*` |
| Route handlers | `app/api/**/route.ts` |
| UI primitives | `components/ui/*` |
| Shared composites | `components/shared/*` |
| Supabase clients | `lib/supabase/*` |
| Tokens | `app/globals.css` |
