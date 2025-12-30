# Codebase Cleanup & Production Hardening Plan (Next.js verified)

**Scope:** Remove bloat, dead code, and over-engineering; harden production build + deploy. **Verified against Next.js docs via Context7** (`/vercel/next.js`).

## Principles
- Keep git clean; no mass rewrites without checkpoints.
- Prefer deletion over comment-out; avoid global eslint disables.
- Keep UI/UX behavior stable; changes are refactors, not features.

## Phase 0: Baseline & Observability
- Run: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`.
- Static scans: `pnpm knip`, `pnpm ts-prune`, `pnpm depcheck`, `pnpm jscpd`, `npx madge --circular --extensions ts,tsx ./app ./components ./lib`.
- TODO/FIXME sweep: `rg "(TODO|FIXME|HACK)"` → ticket or resolve.

## Phase 1: Lint/Format Guardrails
- ESLint: keep `sonarjs` + `unicorn`; add `eslint-plugin-unused-imports`, `eslint-plugin-import` (`import/no-cycle`, `import/no-relative-parent-imports` scoped to app, `import/order`).
- Prettier: enforce with `prettier-plugin-tailwindcss` for class sorting; add `pnpm format` script.
- Husky/simple-git-hooks + lint-staged: run `eslint --cache` + `prettier --write` on staged files.

## Phase 2: Dead Code & Dependency Diet
- Remove unused exports flagged by `ts-prune`/`knip` unless explicitly re-exporting shadcn/ui or generated types (document ignores in `knip.json`).
- Delete unused devDeps from `depcheck`; keep false positives documented.
- Drop duplicate components already consolidated per `CODE_CLEANUP_GUIDE.md`.

## Phase 3: Build & Deploy Hardening (Next.js best practices)
- Enable **standalone output** for lean deploys: `next.config.ts -> output: 'standalone'` (Context7: output.mdx).
- Set **assetPrefix** for CDN when prod (Context7: assetPrefix.mdx) and copy static assets to standalone when self-hosting.
- Keep **TypeScript build errors enabled** (do NOT set `ignoreBuildErrors`) to avoid shipping broken types.
- Optional: `productionBrowserSourceMaps: true` only if required for debugging (increases build size).
- For monorepo/native deps, use `outputFileTracingIncludes` to bundle `sharp`/`aws-crt` binaries where needed.
- Add `pnpm build:analyze` using `next experimental-analyze --output` to watch bundle regressions; gate large jumps in CI.

## Phase 4: Performance & Caching (Next.js v16+ guidance)
- Use cache directives intentionally: `'use cache'` for static data, `'use cache: remote'` for shared runtime data (with `cacheTag`/`cacheLife`), `'use cache: private'` for per-user (Context7: use-cache-remote.mdx, cacheLife.mdx).
- Ensure `generateStaticParams` used for high-traffic dynamic routes; avoid over-prerendering where `SKIP_BUILD_STATIC_GENERATION` is desired.
- Mark LCP images with `priority`; avoid `fill` without explicit container dimensions.
- Prefer server-side heavy deps (e.g., syntax highlight) to keep client bundles thin (Context7: package-bundling.mdx).

## Phase 5: Security & Headers
- Add CSP with SRI (Context7: content-security-policy.mdx) + strict allowlist proxy headers to avoid leaking auth (Context7: next-response.mdx example).
- Ensure env secrets stay in `.env` (`SESSION_SECRET` etc.).

## Phase 6: Testing & CI Gates
- CI steps: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip --no-exit-code`, `pnpm ts-prune`, `pnpm depcheck`, `pnpm build` (or `build:analyze` on main).
- E2E: reuse existing Playwright suites; add per-PR smoke, nightly full.

## Phase 7: Docs, TODOs, Scripts
- Remove stale scripts in `package.json`; standardize on: `dev`, `lint`, `lint:fix`, `format`, `typecheck`, `test`, `test:e2e`, `knip`, `ts-prune`, `depcheck`, `clean` (rimraf .next/.turbo/dist/coverage), `build:analyze`.
- Archive superseded plans to `/cleanup/archive/` and link active ones from README/dev docs.
- Delete obsolete comments; keep rationale in docs or code-level short notes only where non-obvious.

## Rollout Order
1) Phase 0 baseline
2) Phase 1 lint/format
3) Phase 2 dead code + deps
4) Phase 3 build/deploy hardening
5) Phase 4 perf/caching
6) Phase 5 security
7) Phase 6/7 CI + docs cleanup

## Notes
- App already has `sonarjs` + `unicorn` configured; keep warnings non-blocking initially, then ratchet.
- Use `next start --keepAliveTimeout` to match downstream proxy timeouts if self-hosting (Context7: next.mdx).