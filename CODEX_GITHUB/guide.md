# Execution Guide

## Guardrails
- No rewrites or redesigns; keep changes small (1–3 files/features per batch).
- Do not touch secrets; never log keys/JWTs/full request bodies.
- Respect boundaries: route-owned code stays within its route group; `components/ui` are primitives only; no app hooks there.
- Tailwind rules: no gradients; avoid arbitrary values; use tokens from `app/globals.css`; flat cards (`border` + `rounded-md`).
- Caching rules: pair `'use cache'` with `cacheLife(<profile>)` and `cacheTag()`; avoid per-user data in cached functions; `revalidateTag(tag, profile)` only.

## Workflow
1) Pick a task from `tasks.md` (stay within the current phase when possible).
2) Scope narrowly; avoid touching unrelated files. If drift appears, leave a note but keep the batch focused.
3) Implement with comments only where logic is non-obvious; avoid “busy” comments.
4) Verification (minimum for every batch):
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
   - Run additional targeted specs when touching auth/checkout/seller flows.
5) Write a short note for the batch: what changed + how verified.

## Frontend Execution Tips
- Use next-intl routing helpers (`@/i18n/routing`) for links and navigation on localized routes.
- Prefer Server Components; only mark `"use client"` where interactivity is required.
- Replace arbitrary Tailwind values with tokens; align spacing (gap-2 mobile, gap-3 desktop) and typography baselines (body `text-sm`, prices `text-base`, meta `text-xs`, tiny badges `text-2xs`).
- Check dark/light parity after styling changes; verify focus states and aria labeling on interactive elements.

## Backend Execution Tips
- For cached reads, use `createStaticClient()`; for authenticated server components/actions, use `createClient()`; for route handlers, use `createRouteHandlerClient()`; keep `createAdminClient()` server-only.
- Add `generateStaticParams()` for `[locale]` and key dynamic segments to reduce ISR writes.
- Tag responses for invalidation; ensure `revalidateTag()` uses both tag and profile arguments.
- Avoid `select('*')`; project only needed fields and clamp pagination/filter inputs.

## Testing and Perf
- Use bundle analyzer with `ANALYZE=true pnpm build` when adding large deps or touching heavy pages.
- Keep E2E stable: allow free-port selection in Playwright; reuse dev server when possible.
- When changing middleware/proxy, add unit tests for i18n + geo + session behavior.

## Documentation
- Update `issues.md` and `tasks.md` as you close items.
- Record any accepted exceptions (e.g., intentional BG default) in PR notes and relevant docs.
