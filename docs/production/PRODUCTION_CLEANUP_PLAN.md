# Production Cleanup Plan (Phased)

Goal: ship a clean, predictable, production-ready repo and release process.

This plan is intentionally **phased** so you can stop after any phase and still have a better project than before.

---

## Non-negotiables (production requirements)

- Next.js 16 proxy architecture: keep request interception in `proxy.ts`.
- No legacy middleware entry files.
- `/sell` is auth-gated and usable immediately after signup.
- `/sell` image uploads go to Supabase Storage (not Vercel) and are stored/delivered as WebP.
- Wishlist/reviews/engagement data persist in Supabase with RLS (no local-only state).
- Avoid Vercel bandwidth drain for large media (serve from Supabase/CDN directly).

---

## Rules of engagement (keep it sane)

- One PR per phase (small, reviewable, rollbackable).
- No “random refactors”. Every change must map to a checklist item below.
- “Green gates” required to merge:
  - `pnpm -s lint`
  - `pnpm -s typecheck`
  - `pnpm -s test:unit`
  - If phase touches E2E behavior: `pnpm -s test:e2e` (or at least smoke)

---

## Phase 0 — Freeze the noise (1–2 hours)

**Deliverables**
- Generated artifacts never committed.
- Reports always in a stable location.

**Checks**
- Playwright report opens from a single folder:
  - `pnpm exec playwright show-report playwright-report`
- Cleanup is one command:
  - `pnpm clean:artifacts`

---

## Phase 1 — Repo hygiene + structure (0.5–1 day)

**Deliverables**
- Clear folder conventions (what belongs where).
- Dead/stale docs moved into a single archive location.
- Duplicate configs removed (or explained).

**Actions**
- Create `docs/` (or keep root but enforce conventions):
  - `docs/production/` (go-live, env vars, ops)
  - `docs/dev/` (testing, architecture notes)
  - `docs/archive/` (old masterplans)
- Remove duplication:
  - Keep **one** Vitest config (either `.ts` or `.mts`).
- Add/verify `.editorconfig` + formatting rules if needed.

**Acceptance**
- A new dev can answer in < 5 minutes:
  - how to run dev
  - how to run unit tests
  - how to run e2e
  - where reports go

---

## Phase 2 — Testing consolidation (0.5–1 day)

Problem you described: “3–4 test folders, insane, don’t know latest results”.

**Deliverables**
- One canonical test entrypoint.
- Clear naming + tags + a small smoke suite.

**Actions**
- Standardize commands (keep these as the only ones you use daily):
  - Unit: `pnpm test:unit`
  - E2E smoke: `pnpm test:e2e` (or a dedicated `test:e2e:smoke`)
  - A11y: `pnpm test:a11y`
  - Full prod gate: `pnpm test:prod`
- Ensure Playwright `outputDir` and report folder are stable.
- Document “what failed last night” flow:
  - open report folder
  - inspect trace/video
  - rerun failing test pattern

**Acceptance**
- A single place to check results:
  - `playwright-report/` (HTML)
  - `test-results/` (artifacts)
  - `coverage/` (unit)

---

## Phase 3 — Bulgarian-native copy pass (1–3 days)

**Deliverables**
- All user-visible strings go through `next-intl` message keys.
- Bulgarian copy reviewed by a native speaker.

**Workflow**
1. **Inventory**: list all strings visible on:
   - Home
   - Product page
   - Checkout/payment flow
   - Auth flows
   - Error/empty states
2. **Centralize**:
   - ensure strings are message keys, not hardcoded
3. **Native review**:
   - one person edits Bulgarian messages only
   - one person sanity-checks English (if you keep it)
4. **QA**:
   - no broken layouts from longer/shorter strings

**Acceptance**
- No mixed-language UI.
- No “machine translated” tone.

---

## Phase 4 — UX polish (1–2 days)

Keep this extremely scoped: only fix what harms conversion.

**Targets (typical high ROI)**
- Form errors: clear, close to the field, consistent tone.
- Loading states: avoid blank content (skeleton/spinner where appropriate).
- Empty states: explain what to do next.
- Mobile: tap targets, spacing, sticky CTAs.

**Acceptance**
- No blocking flows without feedback.
- Mobile product page is stable across viewports.

---

## Phase 5 — Performance + SEO gate (0.5–1 day)

**Deliverables**
- Baseline bundle analysis captured.
- Lighthouse CI passes your target thresholds.

**Actions**
- Run:
  - `pnpm analyze`
  - `pnpm test:lighthouse`
- Fix worst offenders only:
  - large client bundles
  - unoptimized images
  - blocking scripts

**Acceptance**
- Lighthouse is consistently green enough for launch (choose thresholds and record them).

---

## Phase 6 — Security + data safety (0.5–2 days)

**Deliverables**
- Supabase RLS policies verified.
- No secrets in client code.
- Basic hardening headers.

**Acceptance**
- A logged-out user cannot access private resources.
- A logged-in user cannot access another user’s private resources.

---

## Phase 6.1 — Next.js 16 proxy alignment (0.5 day)

**Goal**: one interception layer, predictable auth/i18n behavior, no legacy entrypoints.

**Repo reality**
- Proxy implementation already lives in `proxy.ts`.
- Supabase session refresh + route protection already lives in `lib/supabase/middleware.ts` (`updateSession`).

**Actions**
- Ensure there is only one request interception entrypoint: `proxy.ts`.
- Delete any legacy “middleware entry” shims (the goal is: no `middleware.ts`, no wrapper files).
- Confirm `proxy.ts` matcher excludes:
  - `/_next/*`, `/_vercel/*`, `/api/*`, static assets
  - auth callback/confirm routes (so PKCE exchange isn’t disrupted)
- Tighten protected route list in `lib/supabase/middleware.ts`:
  - today it protects `/account/*`, `/sell/orders/*`, `/chat/*`
  - add `/sell/*` if the intent is “sell is always auth-gated” (server component already redirects, but proxy-level redirect is cheaper)

**Acceptance**
- Logged-out request to `/{locale}/sell` redirects to `/{locale}/auth/login` without rendering the page.
- No auth cookie loops in production (verify `AUTH_COOKIE_DOMAIN` behavior).

---

## Phase 6.2 — Supabase production correctness (0.5–1 day)

**Goal**: SSR auth is stable, env is correct, RLS is enforced, and runtime deps are correct.

**Actions**
- Verify env vars required in production:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only; only required if admin client is used)
  - `AUTH_COOKIE_DOMAIN` (only in production if you need explicit cookie domain)
- Fix runtime dependency placement:
  - `lib/supabase/server.ts` imports `@supabase/supabase-js` for static/admin clients
  - ensure `@supabase/supabase-js` is in `dependencies` (not only `devDependencies`) so production installs don’t break.
- Run Supabase advisor checks regularly and apply migrations (you already have a dedicated Supabase audit doc).

**Related docs in repo**
- `docs/production/02-supabase.md`

**Acceptance**
- `pnpm build` works in a production-like install.
- Route handlers and server components can read auth via SSR cookies.

---

## Phase 6.3 — Media pipeline: uploads + WebP + zero Vercel bandwidth (1 day)

**Goal**: all user uploads go to Supabase Storage, are normalized to WebP, and are delivered without routing image bytes through Vercel.

**What already exists (good)**
- Server-side upload endpoint that converts to WebP and stores in Supabase Storage:
  - `app/api/upload-image/route.ts`

**Actions**
- Ensure `/sell` uses the upload endpoint for all images (no base64-in-DB, no direct uploads to Vercel).
- Enforce “WebP-only” at the UX layer:
  - file input `accept` can be broad (`image/*`), but the server must always output WebP (already done).
- Decide and document bucket strategy:
  - Public bucket for product listing images, OR private bucket with signed URLs.
- Avoid Vercel image proxying for Supabase-hosted images:
  - Prefer serving images from Supabase Storage (or Supabase render endpoint) directly.
  - Keep `next.config.ts` `images.remotePatterns` scoped to your exact Supabase project hostname (avoid wildcard patterns).

**Acceptance**
- Uploading a JPG/PNG from `/sell` results in `.webp` stored in the `product-images` bucket.
- Product pages render images via Supabase URLs without downloading the bytes through `/_next/image`.

---

## Phase 6.4 — Wishlist, reviews, and engagement persistence (0.5–1 day)

**Goal**: all “user intent” state is in Supabase (not local-only), protected by RLS.

**What already exists (good)**
- Wishlist reads/writes through Supabase from the client:
  - `components/providers/wishlist-context.tsx`
- Reviews are handled via server actions and stored in Supabase:
  - `app/actions/reviews.ts`
- Schema work already exists in `supabase/migrations/*` (wishlist hardening, review triggers, notifications).

**Actions**
- Confirm there is no fallback/local-only wishlist implementation used in production.
- Ensure wishlist/reviews tables have:
  - unique constraints where needed
  - RLS policies using the optimized `(select auth.uid())` pattern
- If you still need a separate “likes” concept (distinct from wishlist), add a dedicated table and RLS (or unify semantics with `wishlists`).

**Acceptance**
- Reloading across devices retains wishlist/reviews.
- Users cannot read/write other users’ wishlist/reviews.

---

## Phase 7 — Go-live runbook (0.5 day)

**Deliverables**
- A single runbook page for launch day:
  - DNS steps
  - environment variables
  - deploy command
  - rollback plan
  - who is on-call

**Acceptance**
- Anyone on the team can deploy/rollback.

---

## Suggested execution order

If you want fastest path to production:
1) Phase 0 → 1 → 2 (stop the bleeding)
2) Phase 3 → 4 (conversion + trust)
3) Phase 5 → 6 (performance + safety)
4) Phase 7 (launch)

---

## Current project commands (baseline)

- Full local gate: `pnpm test:all`
- Full prod readiness: `pnpm test:full`
- Cleanup artifacts: `pnpm clean:artifacts`

