# Consolidated Refactor Plan (Best-of CODEX_GITHUB, GPT_GITHUB, opus)

## Sources and merge notes
- CODEX_GITHUB: guide.md, tasks.md, issues.md, frontend.md, backend.md
- GPT_GITHUB: guide.md, tasks.md, issues.md, frontend.md, backend.md
- opus: README.md, guide.md, tasks.md, issues.md, frontend.md, backend.md
- Merge rule: keep OPUS task granularity and metrics, add GPT/CODEX guardrails (i18n, cache tagging, boundaries, verification).
- Conflicts resolved:
  - i18n coverage: OPUS states complete, GPT/CODEX call out missing keys. Treat as audit item until verified.
  - Cache components: OPUS says lib/data is correct, GPT/CODEX warn about other cached paths. Audit outside lib/data and route handlers.

## Goals and success metrics
- Gradient violations: 13 -> 0
- Arbitrary Tailwind values: 189 -> < 20 (document remaining exceptions)
- Supabase security advisors: 0 critical warnings; leaked password protection enabled
- Cache correctness: every cached function has `cacheLife` + `cacheTag`; no per-user data in cached blocks; `revalidateTag(tag, profile)` only
- i18n: all localized routes use `@/i18n/routing`; strings covered in `messages/en.json` + `messages/bg.json`
- Tests: minimum gates green per batch; final release gate green

## Guardrails (non-negotiable)
- No rewrites, no redesigns, no new architectural layers.
- Max 1-3 files per batch (up to 5 only if a single behavior requires it).
- No gradients, no arbitrary Tailwind values unless documented.
- `components/ui` stays primitive-only; no app hooks or data fetching.
- Use Supabase clients by context: `createStaticClient` for cached reads, `createClient` for auth, `createRouteHandlerClient` for API routes, `createAdminClient` server-only.
- Cache rules: pair `use cache` with `cacheLife(<profile>)` and `cacheTag()`; avoid cookies/headers inside cached blocks.
- Never log secrets; no service role key in client bundles.

## Phase 0: Baseline and gates
- Run gradient/arbitrary scans in `cleanup/` and record counts.
- Verify gates: `pnpm -s exec tsc -p tsconfig.json --noEmit` and `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`.
- Inventory cacheable data paths and current cache tags/profiles.

## Phase 1: Security and blockers (ship stoppers)
- Stripe readiness: create products/prices, set webhook secrets, ensure idempotency and signature verification. (THIS IS DONE U MONKEY?)
- Env verification: confirm production URLs and auth email links.
- Middleware: confirm BG geo default and cookie duration are intended.

## Phase 2: Design system alignment
- Remove 13 gradient violations (priority files first: wishlist-page-client.tsx, toast.tsx, home page, desktop-layout).
- Replace arbitrary Tailwind values with tokens; start with top offenders (products-table, chat/loading, sidebar, plan-card, drawer).
- Execute typography audit (AGENT-1), spacing/layout audit (AGENT-2), colors/theming audit (AGENT-3).
- Close dark mode token gaps in `app/globals.css` and verify on priority pages.
- Verification: tsc + e2e:smoke; re-run scan scripts to confirm counts drop.

## Phase 3: Frontend boundaries, i18n, client split, a11y
- Enforce component boundaries: move composites out of `components/ui`; prevent cross-route group imports.
- i18n routing: use `@/i18n/routing` helpers for localized routes; ensure locale-agnostic hrefs.
- String coverage: audit and fill missing keys in `messages/en.json` + `messages/bg.json`.
- Client/server split: remove unnecessary `use client`; move data fetching to server components or actions.
- Accessibility sweep: focus states, aria labels/roles, keyboard navigation for dialogs/menus; prioritize auth, checkout, seller flows.

## Phase 4: Backend caching, data hygiene, and API correctness
- Audit all cached functions/components (including outside `lib/data/`):
  - Ensure `use cache` + `cacheLife` + `cacheTag`.
  - Remove cookies/headers usage in cached blocks.
- `revalidateTag(tag, profile)` two-arg usage everywhere.
- `generateStaticParams()` coverage for `[locale]` and other static segments beyond existing root/main layouts.
- Route handler field projection (replace `select('*')`), clamp pagination/filter inputs.
- Add or expand zod validation for mutations and route handlers.
- Supabase performance advisors: document recommendations, add indexes if needed.
- Middleware/proxy tests: i18n + geo + session update; keep matcher exclusions for static assets.
- Stripe webhooks: verify idempotency and plan ID consistency.

## Phase 5: Architecture polish, tooling, and release
- Add MessageProvider to `locale-providers.tsx` (chat context).
- Audit and remove unnecessary `use client` directives (simple display components).
- Dead code cleanup via `pnpm exec knip` (review manually before deletion).
- E2E port handling in `playwright.config.ts` and scripts (free port selection).
- Structured logging around API/actions (redacted).
- Final gates: tsc, unit tests, full e2e, build; run manual acceptance checklist.

## Batch template (use per change)
- Scope: 1-3 files, one behavior.
- Verification: tsc + e2e:smoke (add unit or targeted e2e when touching auth/checkout/seller/payments).
- Notes: what changed, why, how verified.

## Definition of done
- Security advisors clear.
- Stripe checkout + webhook verified end-to-end.
- Gradient violations 0; arbitrary values < 20 with documented exceptions.
- Cache correctness verified; `revalidateTag` two-arg usage everywhere.
- i18n routing and messages coverage complete.
- All gates green; manual acceptance complete; production deploy verified.
