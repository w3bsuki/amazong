# Copilot Instructions

**Treido** - Next.js 16 App Router marketplace with Tailwind v4, shadcn/ui, Supabase, Stripe, next-intl.

## Skills (Auto-Applied)

| Skill | When | File |
|-------|------|------|
| Frontend | UI, routing, styling, i18n | `.codex/skills/treido-frontend/SKILL.md` |
| Backend | Server actions, Supabase, Stripe | `.codex/skills/treido-backend/SKILL.md` |
| Rails | Conventions, verification, pauses | `.codex/skills/treido-rails/SKILL.md` |

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

```powershell
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

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
