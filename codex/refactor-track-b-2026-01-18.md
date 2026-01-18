# Refactor Audit — Track B (Backend/Data) — 2026-01-18

Scope: app/api/, app/actions/, lib/data/, supabase/.
Focus: auth/redirect safety, env/URL hardcoding, data integrity, RLS/policies, duplication.
Method: Parallel discovery (3 subagents) + targeted evidence review. No edits.

## Executive Summary

- **Redirect URLs are built from untrusted `Origin` headers** in payments flows (open‑redirect risk).
- **Base URL fallbacks to localhost** appear in subscription/payments flows; risk of misdirected redirects if env is missing in prod.
- **Username lookups use `.ilike()`** without escaping wildcards, which can cause ambiguous matches and silent failures.
- **Public materialized view exposure** flagged by Supabase advisors; validate whether public access is intended.
- **Small duplication hotspots** (UUID regex + base URL helper) suggest utility extraction.

---

## Findings

### 1) Untrusted `Origin` used to build redirect URLs
**Severity:** Medium

**Why it matters:** `Origin` is client‑controlled. Using it to construct Stripe redirect URLs can enable off‑site redirects (phishing) if a malicious client sets `Origin`.

**Evidence:**
- [app/api/payments/setup/route.ts](app/api/payments/setup/route.ts#L46)
- [app/actions/payments.ts](app/actions/payments.ts#L59-L67)

**Fix direction:** Use a trusted server base URL (e.g., `APP_URL` / `NEXT_PUBLIC_APP_URL`) and/or validate against an allow‑list of hosts. Avoid raw `Origin` for redirects.

---

### 2) Localhost fallbacks in redirect base URL
**Severity:** Low (Medium if env missing in production)

**Why it matters:** Falling back to `http://localhost:3000` can misroute users in production and masks misconfiguration.

**Evidence:**
- [app/api/payments/setup/route.ts](app/api/payments/setup/route.ts#L46)
- [app/actions/payments.ts](app/actions/payments.ts#L59)
- [app/api/subscriptions/portal/route.ts](app/api/subscriptions/portal/route.ts#L7-L9)
- [app/actions/subscriptions.ts](app/actions/subscriptions.ts#L60-L62)

**Fix direction:** Require a server‑only base URL (fail fast if missing) and keep localhost fallback strictly in dev/test helpers.

---

### 3) Redirect URLs use `NEXT_PUBLIC_APP_URL` without validation
**Severity:** Low

**Why it matters:** If `NEXT_PUBLIC_APP_URL` is missing or malformed, Stripe success/cancel URLs can be invalid.

**Evidence:**
- [app/api/boost/checkout/route.ts](app/api/boost/checkout/route.ts#L130-L131)

**Fix direction:** Centralize a `getAppBaseUrl()` helper that validates env once and throws on invalid config.

---

### 4) Dev env inspection endpoint (info leakage in non‑prod)
**Severity:** Low (Informational)

**Why it matters:** Exposes env state in non‑prod. Guard exists, but ensure it stays non‑public outside staging/dev.

**Evidence:**
- [app/api/health/env/route.ts](app/api/health/env/route.ts#L18-L29)

**Fix direction:** Keep prod 404; consider additional guard (auth/allowlist) for shared staging.

---

### 5) Username lookups use `.ilike()` without escaping wildcards
**Severity:** Low–Medium

**Why it matters:** `%` and `_` in input can match multiple rows. Combined with `.single()`/`.maybeSingle()`, this can return unexpected results or null when multiple rows match.

**Evidence:**
- [lib/data/profile-page.ts](lib/data/profile-page.ts#L120)
- [lib/data/profile-page.ts](lib/data/profile-page.ts#L299)
- [lib/data/product-page.ts](lib/data/product-page.ts#L150)

**Fix direction:** Prefer `.eq("username", safeUsername)` when the column is unique, or escape `%`/`_` before using `.ilike()`.

---

### 6) Orphan categories are silently dropped in tree build
**Severity:** Low

**Why it matters:** Categories whose parent is missing are neither added to root nor reported, hiding data integrity problems.

**Evidence:**
- [lib/data/categories.ts](lib/data/categories.ts#L186-L191)

**Fix direction:** Log or collect orphans; optionally surface them in a diagnostics report to aid data cleanup.

---

### 7) Duplication — UUID regex in multiple data modules
**Severity:** Low

**Evidence:**
- [lib/data/product-page.ts](lib/data/product-page.ts#L49)
- [lib/data/product-reviews.ts](lib/data/product-reviews.ts#L6)

**Fix direction:** Extract to a shared `lib/validation` helper to avoid drift.

---

### 8) Duplication — `getAppUrl()` helper repeated across modules
**Severity:** Low

**Evidence:**
- [app/api/subscriptions/portal/route.ts](app/api/subscriptions/portal/route.ts#L5-L10)
- [app/actions/subscriptions.ts](app/actions/subscriptions.ts#L58-L65)

**Fix direction:** Centralize in a server‑only helper (e.g., `lib/env/app-url.ts`) and reuse across actions/routes.

---

## Supabase MCP Advisor Signals (RLS/Policies)

### 9) Public materialized view exposed via Data API
**Severity:** Medium (review intent)

**Why it matters:** Supabase advisor reports a materialized view selectable by anon/authenticated. Ensure the data is intended to be public.

**Evidence:**
- Migration grants public SELECT: [supabase/migrations/20260112000000_category_stats_view.sql](supabase/migrations/20260112000000_category_stats_view.sql#L54)
- Supabase advisor: “Materialized View in API” (public.category_stats)
  - Remediation link: https://supabase.com/docs/guides/database/database-linter?lint=0016_materialized_view_in_api

**Fix direction:** If intended public, document and keep. If not, revoke grants and add RLS‑safe access via RPC.

---

### 10) Leaked password protection disabled (Supabase Auth)
**Severity:** Medium

**Evidence:**
- Supabase advisor: “Leaked Password Protection Disabled”
  - Remediation link: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Task note: [TASK-enable-leaked-password-protection.md](TASK-enable-leaked-password-protection.md)

**Fix direction:** Enable in Supabase Auth settings; document exceptions in [supabase_tasks.md](supabase_tasks.md).

---

### 11) RLS policy performance warnings (auth_rls_initplan)
**Severity:** Low (Perf)

**Evidence:**
- Supabase advisor warns `admin_docs_admin_only`, `admin_tasks_admin_only`, `admin_notes_admin_only` policies re‑evaluate auth per row.
  - Remediation link: https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

**Fix direction:** Update policies to wrap auth calls with `(select auth.uid())` per Supabase guidance.

---

## Fix Direction Summary

1) **Redirect safety:** Use trusted base URL helpers; avoid untrusted headers.
2) **Env validation:** Centralize and validate base URL once; fail fast in prod.
3) **Data integrity:** Replace `.ilike()` for unique usernames or escape wildcards.
4) **RLS review:** Confirm `category_stats` exposure; address advisor warnings.
5) **Duplication:** Extract UUID regex and `getAppUrl()` into shared server utilities.
