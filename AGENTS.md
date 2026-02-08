# Repository Guidelines

Canonical boundaries and output contract: `docs/AGENTS.md`.

## Project Structure & Module Organization
- Application code lives in `app/` (Next.js App Router), grouped by locale and route groups (for example `app/[locale]/(main)` and `app/[locale]/(account)`).
- Shared UI primitives are in `components/ui/`; cross-feature composites are in `components/shared/`; reusable logic lives in `lib/` and `hooks/`.
- Unit tests live in `__tests__/` and alongside modules as `*.test.ts(x)`; end-to-end tests are in `e2e/`.
- Database artifacts are in `supabase/` (`migrations/`, `schema.sql`, seeds). Product and ops documentation lives in `docs/` and `docs-site/`.

## Build, Test, and Development Commands
- `pnpm dev`: run local Next.js dev server.
- `pnpm build` / `pnpm start`: build and run production bundle.
- `pnpm -s lint`: run ESLint across repo.
- `pnpm -s typecheck`: run strict TypeScript checks (`tsc --noEmit`).
- `pnpm -s styles:gate`: enforce Tailwind/token style constraints.
- `pnpm -s test:unit`: run Vitest suite.
- `pnpm -s test:e2e` or `pnpm -s test:e2e:smoke`: run Playwright coverage/smoke tests.
- `pnpm -s test:all`: full pre-merge gate (lint, TS, unit, e2e, a11y).

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF endings, final newline, 2-space indentation for JS/TS/CSS/JSON/YAML.
- Prefer TypeScript with strict typing; avoid `any` unless justified.
- File naming: kebab-case for files (`product-card.tsx`), hooks as `use-*.ts`, tests as `*.test.ts(x)` or `*.spec.ts`.
- Keep route-local UI in route folders (`_components/`, `_lib/`) and promote only truly shared code to `components/shared` or `lib`.
- Use `proxy.ts` conventions for request entry behavior (do not introduce `middleware.ts`).

## Testing Guidelines
- Frameworks: Vitest (`jsdom`) for unit/integration, Playwright for e2e, axe project for accessibility checks.
- Coverage thresholds (Vitest): lines/statements 80%, functions 70%, branches 60%.
- Add/update tests with behavior changes; prefer deterministic selectors (`data-testid`) in e2e paths.

## Commit & Pull Request Guidelines
- Use Conventional Commit style seen in history: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`, `docs: ...`, `style: ...`.
- Keep commits focused and reviewable; include affected area in subject when useful (example: `refactor(ui): extract category grid`).
- PRs should include: goal, scope, risk level, files changed summary, and verification commands with pass/fail notes.
- Link related issues and include screenshots/GIFs for user-visible UI changes.
