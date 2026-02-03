# treido-rails

Project-wide rules for Treido: file organization, pause conditions, verification gates, and conventions that apply across all domains.

## When to Apply

- Starting any new work
- Creating new files or components
- Before implementing high-risk changes
- After completing any change (verification)

---

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
├── api/                  # Route handlers (webhooks, APIs)
└── globals.css           # Tailwind tokens SSOT
```

### Components Structure

```
components/
├── ui/                   # shadcn primitives ONLY
│   ├── button.tsx       # No app logic, no feature imports
│   ├── card.tsx
│   └── dialog.tsx
├── shared/              # Reusable composites
│   ├── page-shell.tsx   # Layout wrapper
│   ├── product-card.tsx # Feature component
│   └── filters/         # Filter components
└── layout/              # Layout shells
    ├── header.tsx
    └── footer.tsx
```

### Support Structure

```
lib/
├── supabase/            # Supabase clients and types
│   ├── server.ts        # createClient, createStaticClient, createAdminClient
│   ├── client.ts        # Browser client
│   └── database.types.ts # Generated types
├── utils/               # Pure utilities
└── data/                # Data fetching functions

messages/
├── en.json              # English translations
└── bg.json              # Bulgarian translations

supabase/
└── migrations/          # Database migrations (append-only)
```

---

## Conventions

### Request Routing

| Rule | Description |
|------|-------------|
| Use `proxy.ts` | All request routing/mutation logic goes in `proxy.ts` |
| No root middleware | Do NOT create `middleware.ts` in project root |

### Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase with `use` prefix | `useCart.ts` |
| Server actions | camelCase verb | `addToCart.ts` |
| Route handlers | `route.ts` | `app/api/webhook/route.ts` |
| Private folders | `_` prefix | `_components/`, `_actions/` |

### Imports

| Rule | Description |
|------|-------------|
| Absolute imports | Use `@/` alias: `import { Button } from '@/components/ui/button'` |
| No barrel imports | Import directly from file, not index |
| Layer boundaries | `ui/` never imports from `app/`, `lib/`, or feature code |

---

## Pause Conditions

**STOP and request human approval before implementing:**

### Database Changes
- New tables or columns
- Column type changes
- Migration files (`supabase/migrations/*`)
- RLS policy changes (create, alter, drop)

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
1. Describe the proposed change clearly
2. Explain the risk
3. Wait for explicit "proceed" before implementing

---

## Verification Gates

### After Every Change

```powershell
pnpm -s typecheck      # TypeScript compilation
pnpm -s lint           # ESLint rules
pnpm -s styles:gate    # Tailwind token compliance
```

### After UI Changes

```powershell
pnpm -s test:unit      # Component/unit tests
```

### After Auth/Checkout/Routing Changes

```powershell
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Full Test Suite (Before Deploy)

```powershell
pnpm -s test:e2e       # All E2E tests
```

---

## Quick Commands

| Task | Command |
|------|---------|
| Start dev server | `pnpm dev` |
| Type check | `pnpm -s typecheck` |
| Lint | `pnpm -s lint` |
| Style gate | `pnpm -s styles:gate` |
| Unit tests | `pnpm -s test:unit` |
| E2E smoke | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` |
| Full E2E | `pnpm -s test:e2e` |
| Build | `pnpm -s build` |

---

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
| UI/UX plan | `docs/14-UI-UX-PLAN.md` |

---

## Task Tracking (Optional)

If tracking tasks, use `.codex/TASKS.md` with simple markdown:

```markdown
## In Progress
- [ ] Fix button spacing on product page

## Done
- [x] Add Bulgarian translations for checkout
```

No formal workflow required. Update as you go.

---

## Decision Log (Optional)

If documenting decisions, use `.codex/DECISIONS.md`:

```markdown
## 2026-02-03: Use Sheet for mobile, Dialog for desktop
**Context:** Product quick view needs responsive behavior
**Decision:** Sheet (bottom) on mobile, Dialog (modal) on desktop
**Rationale:** Preserves thumb zone on mobile, better focus on desktop
```

---

## Non-Negotiables Summary

| Category | Rule |
|----------|------|
| Tailwind | Semantic tokens only (`bg-background`, not `bg-gray-100`) |
| i18n | All user strings through `next-intl` |
| shadcn | `components/ui/*` = primitives only, no app logic |
| Auth | Always verify user before mutations |
| Webhooks | Always verify signatures, always idempotent |
| Schema | Pause for human approval on any DB changes |
| Routing | Use `proxy.ts`, never create root `middleware.ts` |
