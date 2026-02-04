# Full Codebase Production Audit (Treido) — 2026-02-04

**Scope:** full repo audit (all tracked folders/files via `git ls-files`) + current working tree deltas (untracked + modified).  
**Mode:** audit + safe cleanup (no DB/auth/payments changes; no git reverts; no stashing).  
**Primary rails:** `docs/AGENTS.md`, `docs/03-ARCHITECTURE.md`, `docs/04-DESIGN.md`, `docs/WORKFLOW.md`.

---

## 0) Baseline snapshot

- **HEAD:** `9daa9985`
- **Working tree:** **DIRTY** (large set of unrelated UI/UX/TW4/shadcn edits in progress in another terminal; explicitly not touched/reverted here).
- **Notable local artifacts (expected):** `.next/`, `node_modules/`, `playwright-report/`, `test-results/` (should remain untracked).

### Tracked file distribution (top-level)
From `git ls-files` grouping:

| Top-level | Tracked files | Justification | Keep? |
|---|---:|---|---|
| `app/` | 447 | Next.js App Router routes/layouts/actions; production code | ✅ |
| `components/` | 299 | shared UI (must follow boundary rules) | ✅ |
| `lib/` | 71 | pure utilities + data access helpers | ✅ |
| `supabase/` | 89 | migrations + edge functions | ✅ (high-risk lane) |
| `hooks/` | 16 | reusable hooks | ✅ |
| `i18n/` | 3 | next-intl routing config | ✅ |
| `messages/` | 3 | translation JSON (SSOT for copy) | ✅ |
| `docs/` | 61 | stable SSOT docs | ✅ |
| `docs-site/` | 217 | docs website | ✅ |
| `scripts/` | 24 | tooling (gates, scans, ops scripts) | ✅ |
| `e2e/` | 24 | Playwright specs/fixtures | ✅ |
| `__tests__/` | 26 | Vitest unit tests | ✅ |
| `public/` | 39 | static assets | ✅ |
| `.codex/` | 374 | allowed agent state + skills + audits | ✅ |
| `.claude/` | 204 | Claude skill packs | ✅ (optional; consider consolidating long-term) |
| `.storybook/` | 2 | Storybook config | ✅ (optional; don’t ship in prod) |
| `.github/` | 2 | GitHub workflows/config | ✅ |
| `.agent/`, `.agents/`, `.qwen/`, `.trae/`, `.windsurf/` | 203 each | **Forbidden tool folders** (must not exist in repo) | ❌ (delete; already removed locally) |

**Important:** `.gitignore` already includes the forbidden folders list. (`.gitignore:5`)

### Inventory artifacts (full coverage)
- Tracked paths: `.codex/audit/2026-02-04_git-ls-files.txt`
- Untracked paths: `.codex/audit/2026-02-04_untracked.txt`
- Top-level counts: `.codex/audit/2026-02-04_top-level-counts.txt`

---

## 1) Verification (what’s green / what’s red)

Ran (Windows):

- ✅ `pnpm -s docs:gate`
- ✅ `pnpm -s styles:gate` (0 palette/arbitrary/gradients/missing-tokens)
- ✅ `pnpm -s lint` (**0 errors**, 545 warnings)
- ✅ `pnpm -s ts:gate` (OK; fixed 14 new unsafe TS patterns in this run)
- ✅ `pnpm -s typecheck`
- ✅ `pnpm -s test:unit`
- ✅ `pnpm -s knip` (after cleanup; see Debloat section)

---

## 2) Security & privacy (CRITICAL)

### CRIT-SEC-001 — Public edge function uses service-role key without explicit auth gate

- **Risk:** service role bypasses RLS; if the function expands beyond current query shape or accepts arbitrary inputs, it becomes a high-impact data exfil surface.
- **Evidence:** `supabase/functions/ai-shopping-assistant/index.ts:207`, `supabase/functions/ai-shopping-assistant/index.ts:248`
- **Action (requires explicit approval; auth/access-control lane):**
  - Require a valid Supabase JWT (verify `Authorization` header) before using service role.
  - Minimize what service-role can query; prefer RLS-safe queries using user JWT where possible.
  - Add an allowlist of tables/queries; avoid any “query by user-provided filters” with service role.

### CRIT-SEC-002 — User messages may be forwarded to 3rd-party LLMs without redaction

- **Risk:** users can type PII into chats/prompts; forwarding raw conversation history can exfiltrate PII.
- **Evidence:** `supabase/functions/ai-shopping-assistant/index.ts:308`, `supabase/functions/ai-shopping-assistant/index.ts:394`
- **Action (requires explicit approval; external integration):**
  - Add redaction for common PII patterns (email/phone/address/payment intents).
  - Provide user-facing notice + opt-out for model usage where required.

### MED-SEC-003 — Edge function CORS can degrade to `*`

- **Risk:** if allowlist env is empty/misconfigured, any origin can call the function.
- **Evidence:** `supabase/functions/ai-shopping-assistant/index.ts:10`
- **Action:** default deny; require explicit allowlist env in prod.

### MED-SEC-004 — trending search strings exposed to `anon`

- **Risk:** aggregated queries can still contain PII (names, phone numbers).
- **Evidence:** `supabase/migrations/20251127_add_search_history.sql:76`, `supabase/migrations/20251127_add_search_history.sql:87`
- **Action:** filter/redact at write-time; or restrict to authenticated; or minimum k-anonymity threshold.

### HIGH-SEC-005 — Structured log redaction misses common PII keys

- **Risk:** any server logs containing `{ email, phone, address, full_name }` may be logged raw.
- **Evidence:** `lib/structured-log.ts:9`, `lib/structured-log.ts:40`
- **Action:** expand redaction keys list + recursively redact nested meta.

---

## 3) Next.js caching correctness (CRITICAL)

### CRIT-CACHE-001 — Cookie-derived zone passed into cached product functions (cache purity violation)

- **Risk:** cached results can be served across users/zones; leaks preferences and shows incorrect inventory.
- **Evidence:**
  - `app/[locale]/(main)/todays-deals/page.tsx:36` (reads cookies)
  - `app/[locale]/(main)/todays-deals/page.tsx:39` (passes zone)
  - `lib/data/products.ts:333` (uses `'use cache'`)
  - `lib/data/products.ts:353` (filters by `zone`)
- **Action:**
  - If `zone` comes from cookies: bypass cached functions (dynamic fetch / `noStore()`).
  - Only cache when `zone` is an explicit request param treated as cache-safe.

### CRIT-CACHE-002 — API route uses cookie-derived zone + cached function

- **Risk:** even if the route uses `noStore`, it can still call into cached functions producing cross-user leaks.
- **Evidence:**
  - `app/api/products/category/[slug]/route.ts:32` (cookie zone)
  - `app/api/products/category/[slug]/route.ts:35` (cached call)
  - `lib/data/products.ts:282` (uses `'use cache'`)
  - `lib/data/products.ts:301` (filters by `zone`)
- **Action:** introduce uncached variants or gate cached calls to explicit cache-safe inputs.

### Cache purity check

- Cached helpers in `lib/data/*` appear to consistently use `createStaticClient()` and avoid `cookies()`/`headers()` inside cached functions (spot-checked via grep).

---

## 4) Tailwind v4 + shadcn/ui (rails + debloat)

### What’s green
- `pnpm -s styles:gate` is clean (no palette/arbitrary/gradients/missing semantic tokens).

### TW4-001 — Token opacity hacks (not caught by current gate)
- **Risk:** visual drift and inconsistent contrast across light/dark; violates `docs/04-DESIGN.md` (“No `bg-primary/10` style hacks”).
- **Evidence:**
  - primitives: `components/ui/accordion.tsx:38`, `components/ui/alert.tsx:13`, `components/ui/slider.tsx:60`
  - shared: `components/support/support-chat-widget.tsx:302`, `components/desktop/desktop-filter-modal.tsx:195`
- **Action:** introduce explicit semantic tokens for these states (`bg-hover`, `bg-selected`, `ring-*` variants) and ban `/xx` on semantic tokens via a new scan.

### TW4-002 — Arbitrary container query breakpoints in charts
- **Evidence:** `components/charts/chart-area-interactive.tsx:173`, `components/charts/chart-area-interactive.tsx:176`, `components/charts/chart-area-interactive.tsx:184`, `components/charts/chart-area-interactive.tsx:192`
- **Action:** replace with standardized breakpoints/tokens.

---

## 5) Components boundaries & duplication (debloat targets)

### HIGH-COMP-001 — Shared component does Supabase auth/data fetching
- **Risk:** violates `components/AGENTS.md` (“no direct data fetching from shared components”), makes RSC boundaries hard.
- **Evidence:** `components/support/support-chat-widget.tsx:4`, `components/support/support-chat-widget.tsx:52`, `components/support/support-chat-widget.tsx:97`
- **Action:** move data fetching to `app/**` (route or server action), pass data down as props.

### MED-COMP-002 — Mobile category browser duplication
- **Evidence:** `components/mobile/mobile-category-browser-traditional.tsx:18`, `components/mobile/mobile-category-browser-contextual.tsx:11`, `components/mobile/mobile-category-browser.tsx:7`
- **Action:** extract shared base; keep thin adapters per “traditional/contextual” mode.

### LOW-COMP-003 — Storybook-only components
- **Evidence:** `components/shared/verified-avatar.tsx:148`, `components/shared/verified-avatar.stories.tsx:5`, `components/shared/design-system/design-system-client.tsx:187`
- **Action:** move to Storybook-only folder or delete if not shipped.

---

## 6) Data/performance hotspots

### MED-PERF-001 — `ensureOrderConversations` is N+1 per seed
- **Evidence:** `lib/order-conversations.ts:35`, `lib/order-conversations.ts:44`
- **Action:** batch via RPC or set-based upsert.

### MED-PERF-002 — Product page fallback fans out into sequential queries
- **Evidence:** `lib/data/product-page.ts:138`, `lib/data/product-page.ts:159`, `lib/data/product-page.ts:184`, `lib/data/product-page.ts:199`
- **Action:** single RPC/joined query for PDP view model.

### LOW-MAINT-003 — `lib/data/categories.ts` is oversized / mixed concerns
- **Evidence:** `lib/data/categories.ts:343`, `lib/data/categories.ts:807`
- **Action:** split by concern (tree/context/attributes) after stabilization.

---

## 7) External best practices (latest)

Fetched **Vercel Web Interface Guidelines** (2026-02-04) from:
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

### Immediate fix applied from guidelines
- Replaced `div onClick` wrapper with proper button click handling (clickable div anti-pattern).
- **Evidence:** `app/[locale]/(sell)/_components/ui/brand-combobox.tsx:321` (removed)

### Follow-ups to align with guidelines
- **Avoid `transition-all`** (guideline: never transition all). Found many occurrences; prioritize shared UI shells first.
- **Ensure icon-only buttons have `aria-label`**. Start with Storybook components and shared headers.

---

## 8) Debloat / cleanup scoreboard (applied in this run)

### ✅ Security cleanup (PII)
- Removed hardcoded test credentials from audit scripts; now require env vars.
  - `scripts/audit-treido.mjs`
  - `scripts/audit-treido-v2.mjs`
- Redacted test account PII from audit markdown files:
  - `.codex/audit/TREIDO_MOBILE_UX_AUDIT_2026-01-28.md`
  - `.codex/audit/archive/TREIDO_PRODUCTION_AUDIT_2026-01-27.md`
  - `.codex/audit/archive/SELL_FORM_AUDIT_2026-01-27.md`
- Default-redacted `scripts/verify-e2e-login.mjs` output (use `SHOW_SECRETS=1` to print).

### ✅ Code deletion (confirmed unused by Knip + grep)
Deleted:
- `components/mobile/subcategory-circles.tsx`
- `lib/utils/format-time.ts`
- `components/shared/product/product-card-b2b-badges.tsx`
- `components/shared/product/product-card-wishlist-button.tsx`
- `components/mobile/category-nav/category-pill-grid.tsx`
- `components/mobile/category-nav/contextual-filter-bar.tsx`
- `components/mobile/category-nav/quick-picks-row.tsx`
- `app/[locale]/(chat)/_components/message-provider-wrapper.tsx`
- `app/[locale]/(main)/_components/modal-slot.tsx`

### ✅ API surface cleanup (Knip)
- Removed unused exports / dead code:
  - `lib/boost/boost-status.ts` (removed `isBoostActive` export)
  - `lib/data/categories.ts` (removed `getCategoryAncestryFull` + its private type)

### ✅ i18n cleanup (unused namespaces)
- Removed unused `QuickPicks` message namespace (it was only referenced by deleted, unused UI).

### Remaining Knip findings (post-cleanup)
- Unused file: `components/shared/product/product-card-seller.tsx` (currently modified elsewhere — do not delete blindly).
- Unused files under `.codex/skills/treido-tailwind-v4-shadcn/templates/*` (referenced by the skill docs, not by app runtime).

---

## 9) Execution plan (small batches, gate-gated)

### Batch A — TS Safety Gate (DONE)
- `pnpm -s ts:gate` + `pnpm -s typecheck` are green again.
- Key touchpoints: category routes, category page types, AI listing assistant typing, public-docs parsing.

### Batch B — Cache purity (prevent cross-user cache leaks)
- Introduce uncached variants for zone-cookie cases; keep cached versions only for explicit cache-safe inputs.
- Gates: `pnpm -s typecheck && pnpm -s test:unit` (E2E later once UI stabilizes)

### Batch C — Edge function hardening (PAUSE: needs explicit approval)
- Add JWT auth gate and CORS deny-by-default for `ai-shopping-assistant`.
- Add PII redaction before calling external LLMs.

### Batch D — Debloat (low risk)
- Remove/inline unused exports from Knip (unless intentionally kept as public API).
- Start consolidating duplicated mobile category browser implementations.

---

## Appendix: Commands run

- `git rev-parse --short HEAD`
- `git status --porcelain`
- `git diff --stat`
- `pnpm -s docs:gate`
- `pnpm -s styles:gate`
- `pnpm -s lint`
- `pnpm -s ts:gate`
- `pnpm -s typecheck`
- `pnpm -s test:unit`
- `pnpm -s knip`
- `rg` scans for env keys + PII patterns
