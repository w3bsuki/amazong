---
name: treido-rails
description: Project-wide rules for Treido - file organization, naming, pause conditions, verification gates.
---

# treido-rails

Project conventions, verification gates, and pause conditions.

## When to Apply

- Starting any new work
- Creating new files or components
- Before implementing high-risk changes
- After completing any change

## File Organization

### App Structure

```
app/
├── [locale]/              # i18n routing
│   ├── (main)/           # Main layout group
│   │   ├── page.tsx      # Route page
│   │   └── _components/  # Route-private UI
│   ├── (auth)/           # Auth layout group
│   └── (seller)/         # Seller layout group
├── actions/              # Shared server actions
├── api/                  # Route handlers
└── globals.css           # Tailwind tokens SSOT
```

### Components Structure

```
components/
├── ui/                   # shadcn primitives ONLY
├── shared/              # Reusable composites
└── layout/              # Layout shells
```

### Support Structure

```
lib/
├── supabase/            # Supabase clients
├── utils/               # Pure utilities
└── data/                # Data fetching

messages/
├── en.json              # English
└── bg.json              # Bulgarian

supabase/
└── migrations/          # DB migrations (append-only)
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase + `use` | `useCart.ts` |
| Server actions | camelCase verb | `addToCart.ts` |
| Route handlers | `route.ts` | `app/api/webhook/route.ts` |
| Private folders | `_` prefix | `_components/` |

## Import Rules

| Rule | Description |
|------|-------------|
| Absolute imports | Use `@/` alias |
| No barrel imports | Import directly from file |
| Layer boundaries | `ui/` never imports from `app/`, `lib/` |

## Routing Rules

| Rule | Description |
|------|-------------|
| Use `proxy.ts` | All request routing/mutation logic |
| No root middleware | Do NOT create `middleware.ts` in project root |

## PAUSE CONDITIONS

**STOP and request human approval before:**

### Database Changes
- New tables or columns
- Column type changes
- Migration files
- RLS policy changes

### Security Changes
- Auth/access control logic
- Session handling
- Permission checks

### Payment Changes
- Stripe integration
- Billing logic
- Webhook handlers

### Data Operations
- Data deletion
- Data truncation
- Bulk updates

**How to pause:**
1. Describe the proposed change
2. Explain the risk
3. Wait for explicit "proceed"

## Verification Gates

### After Every Change

```powershell
pnpm -s typecheck      # TypeScript
pnpm -s lint           # ESLint
pnpm -s styles:gate    # Tailwind tokens
```

### After UI Changes

```powershell
pnpm -s test:unit
```

### After Auth/Checkout/Routing Changes

```powershell
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Before Deploy

```powershell
pnpm -s test:e2e
```

## Quick Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Type check | `pnpm -s typecheck` |
| Lint | `pnpm -s lint` |
| Style gate | `pnpm -s styles:gate` |
| Unit tests | `pnpm -s test:unit` |
| E2E smoke | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` |
| Full E2E | `pnpm -s test:e2e` |
| Build | `pnpm -s build` |

## SSOT Documents

| Topic | Location |
|-------|----------|
| Product requirements | `docs/01-PRD.md` |
| Features | `docs/02-FEATURES.md` |
| Architecture | `docs/03-ARCHITECTURE.md` |
| Design system | `docs/04-DESIGN.md` |
| Routes | `docs/05-ROUTES.md` |
| Database | `docs/06-DATABASE.md` |
| API | `docs/07-API.md` |
| Payments | `docs/08-PAYMENTS.md` |
| Auth | `docs/09-AUTH.md` |
| i18n | `docs/10-I18N.md` |

## Non-Negotiables Summary

| Category | Rule |
|----------|------|
| Tailwind | Semantic tokens only |
| i18n | All strings via `next-intl` |
| shadcn | `components/ui/*` = primitives only |
| Auth | Verify user before mutations |
| Webhooks | Verify signatures, be idempotent |
| Schema | Pause for human approval |
| Routing | Use `proxy.ts`, never root middleware |
