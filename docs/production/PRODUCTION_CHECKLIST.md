# Production Checklist (Next.js + Supabase + Stripe)

This is a practical, “ship it without surprises” checklist. Treat it as a release gate.

---

## 1) Domain + DNS

- Pick registrar (Cloudflare / Namecheap / Porkbun) and decide **where DNS is hosted**.
- Configure DNS:
  - `@` apex → hosting provider (A/ALIAS)
  - `www` → CNAME to provider (or redirect to apex)
- Set up redirects:
  - `http → https`
  - `www → non-www` (or the opposite, but choose one)
- Verify:
  - SSL issued
  - TTL reasonable (e.g. 300–3600s during cutover)

---

## 2) Hosting + Build

- Decide deployment target (recommended for Next.js: Vercel).
- Confirm:
  - Node + pnpm versions are pinned in CI (and ideally in `package.json` `engines`).
  - `pnpm-lock.yaml` is committed and used.
- Release command should be deterministic:
  - `pnpm -s lint && pnpm -s typecheck && pnpm -s test:unit && pnpm -s build`

---

## 3) Environment Variables (stop “works on my machine”)

- Inventory all `process.env.*` usage and document required vars.
- Ensure **prod** has:
  - Supabase URL + keys (and service role only on server)
  - Stripe keys + webhook secret
  - Any AI provider keys (keep off client)
  - `NEXT_PUBLIC_*` vars reviewed (public by definition)
- Verify local/dev/prod parity:
  - missing vars fail fast with clear error messages

---

## 4) Security + Data Safety

- Supabase:
  - RLS enabled on all user tables
  - Policies tested for read/write boundaries
  - Storage bucket policies correct
- Auth cookies/session:
  - `Secure`, `HttpOnly`, `SameSite` correct for your auth flows
- Next.js headers:
  - Basic security headers in `next.config.ts` (CSP if you can, but don’t break the app)

---

## 5) Performance + SEO

- Run `pnpm analyze` and remove obvious bundle bloat.
- Ensure images are optimized (Next Image or known strategy) and `sharp` works in prod.
- Verify:
  - `app/robots.txt` and `app/sitemap.ts` correct for prod domain
  - canonical URLs and metadata are correct

---

## 6) Monitoring + Operations

- Add error reporting (Sentry or equivalent) and basic uptime checks.
- Log hygiene:
  - no secrets in logs
  - structured server logs (request id / user id where appropriate)
- Backups:
  - DB backups enabled and restore procedure understood

---

## 7) Testing + Reports (make it sane)

- Decide the **single source of truth** for tests:
  - Unit: `vitest`
  - E2E: Playwright in `e2e/`
- Standard outputs:
  - Playwright HTML report defaults to `playwright-report/`
  - Test artifacts default to `test-results/`
- Cleanup command (safe):
  - `pnpm clean:artifacts:dry`
  - `pnpm clean:artifacts`

---

## 8) Release Process

- Define:
  - versioning strategy (tags/releases)
  - rollback strategy
  - “release captain” checklist
- Do one staged rollout if possible:
  - deploy to a preview/staging domain
  - run `pnpm test:prod` against staging

