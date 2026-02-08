# AGENTS.md — Treido AI Execution Contract

> Single entry point for any AI agent. No hop chains — everything you need to find context is here.

---

## Context Loading

Read these files for full project understanding:

| Topic | File | What you'll find |
|-------|------|------------------|
| What to build | `REQUIREMENTS.md` (root) | 119 features with R{n}.{m} IDs, status, deep-dive pointers |
| What's active now | `TASKS.md` (root) | Current sprint / work queue |
| Design system | `DESIGN.md` (root) | Tokens, spacing, typography, components, app-feel §8.5 |
| Production status | `docs/PRODUCTION.md` | What's shipped, what's blocked, launch checklist |
| Feature deep-dives | `docs/features/{area}.md` | Per-feature specs (selling, buying, chat, etc.) |
| Architecture | `docs/ARCHITECTURE.md` | Directory structure, code patterns, module boundaries |
| Database schema | `docs/DATABASE.md` | 60+ tables, RLS policies, functions, triggers |
| API reference | `docs/API.md` | Server actions, API endpoints |
| Auth | `docs/AUTH.md` | Auth flows, protected routes, roles |
| Payments | `docs/PAYMENTS.md` | Stripe Connect, escrow, webhooks, refunds |
| Internationalization | `docs/I18N.md` | Locales (en/bg), namespaces, ICU patterns |
| Routes | `docs/ROUTES.md` | All routes with auth levels |

---

## Execution Rules

### Default Mode

- Implement directly for normal tasks (UI, styling, components, refactoring, tests, docs).
- Single-implementer workflow: the current agent owns planning, decisions, and code edits.
- Do not use delegated subagent or skill-fleet routing workflows.

### Verification (run after every change)

**Always:**

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

**Risk-based (when touching business logic):**

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### High-Risk Pause Domains

**Stop and explicitly align with a human before finalizing:**

- DB schema, migrations, or RLS policies
- Auth / session / access-control behavior
- Payments / webhooks / billing behavior
- Destructive or bulk data operations

### Source Precedence

1. Code and migrations are runtime truth.
2. `docs/**` is written SSOT.
3. If docs and code disagree, treat code as current truth and update docs.

### Legacy Exclusion

If legacy or numbered docs (e.g. `docs/01-PRD.md`) conflict with root files or `docs/*.md`, ignore legacy and follow active SSOT.

---

## Coding Conventions

### Project Structure

| Directory | Purpose | Rules |
|-----------|---------|-------|
| `app/` | Next.js App Router routes, layouts | Route-local logic only |
| `app/**/_components/` | Route-private components | Not importable outside route |
| `app/**/_actions/` | Route-private server actions | Not importable outside route |
| `app/actions/` | Shared server actions | Cross-route reuse |
| `components/ui/` | Primitives (shadcn/Radix) | No domain logic, no API calls |
| `components/shared/` | Reusable composites | No direct Supabase/Stripe calls |
| `lib/` | Pure utilities / domain helpers | No React, no side effects |
| `hooks/` | Shared React hooks | Client-only |
| `i18n/`, `messages/` | Localization config + translations | ICU message format |
| `__tests__/`, `test/` | Unit tests (Vitest) | `.test.ts(x)` suffix |
| `e2e/` | E2E tests (Playwright) | `.spec.ts` suffix |
| `public/` | Static assets | — |
| `supabase/` | DB config, migrations | High-risk (pause rule) |
| `scripts/` | Build/dev tooling | — |
| `docs/` | Documentation SSOT | — |

### Style

- 2-space indent, LF line endings, trailing whitespace trimmed, final newline (`.editorconfig`).
- TypeScript + React; lint with ESLint (`eslint.config.mjs`).
- Tailwind v4 semantic tokens only — see `DESIGN.md` for forbidden patterns.

### Testing

- Vitest in `jsdom` with setup in `test/setup.ts`.
- Coverage thresholds: lines 80%, functions 70%, branches 60%, statements 80%.
- Use `pnpm -s test:unit:coverage` when changing `lib/` or `hooks/`.

### Commits

Format: `<type>: <summary>` — short, imperative.
Types: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `polish:`, `docs:`, `test:`.

---

## Build & Dev Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies (pnpm@9.x, Node 20) |
| `pnpm dev` | Next.js dev server |
| `pnpm -s lint` | ESLint |
| `pnpm -s typecheck` | TypeScript `tsc --noEmit` |
| `pnpm -s ts:gate` | TypeScript CI gate |
| `pnpm -s styles:gate` | Tailwind palette/token scan |
| `pnpm -s test:unit` | Vitest unit tests |
| `pnpm -s test:unit:coverage` | Unit tests with coverage |
| `pnpm -s test:e2e` | Full Playwright E2E |
| `pnpm -s test:e2e:smoke` | Smoke suite only |
| `pnpm -s test:a11y` | Accessibility tests |
| `pnpm -s build` | Production build |
| `pnpm storybook` | Component explorer |

---

## Output Contract

Every implementation response must include:

1. **Files changed** — list of paths modified/created/deleted.
2. **Verification commands and outcomes** — which gates were run and pass/fail.
3. **Assumptions, risks, and deferred follow-ups** — anything not fully resolved.

---

## Workflow

Follow the 4-step shipping loop for every task:

1. **Frame** — Goal, Scope (paths/routes), Non-goals, Risk lane (low/high).
2. **Implement** — Small batches, scoped changes, direct fixes over rewrites.
3. **Verify** — Run appropriate gates (see Verification section above).
4. **Report** — Deliver the Output Contract items above.

See `docs/WORKFLOW.md` for the full workflow reference and prompt formatting guide.

---

*Last updated: 2026-02-08*
