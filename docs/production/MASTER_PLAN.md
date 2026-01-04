# 🚀 Production Master Plan

> **Goal:** Ship a clean, production-ready Bulgarian marketplace  
> **Target:** treido.eu  
> **Launch:** ASAP after completing this checklist  
> **Last Updated:** January 4, 2026

## 📦 Tech Stack (Current Versions)

| Package | Version | Status |
|---------|---------|--------|
| Next.js | 16.0.7 | ✅ Latest |
| React | 19.2.1 | ✅ Latest |
| Tailwind CSS | 4.1.17 | ✅ v4 CSS-first |
| @supabase/ssr | 0.8.0 | ✅ Latest |
| next-intl | 4.5.5 | ✅ Latest |
| shadcn/ui | New York style | ✅ Configured |

---

## 📊 Current State (Verified January 2026)

| Check | Status | Notes |
|-------|--------|-------|
| `pnpm lint` | ✅ | Zero errors |
| `pnpm typecheck` | ✅ | Zero errors |
| `pnpm test:unit` | ✅ | 4/4 passing |
| `pnpm test:e2e` | ⚠️ | 9/10 passing (1 Performance API issue) |
| `pnpm build` | ✅ | Builds successfully |
| Dev Server | ✅ | `/en` and `/bg` return 200 |

### Implementation Status Summary

| Area | Status | Notes |
|------|--------|-------|
| **Next.js 16** | ✅ Implemented | Cache components, async params, proxy.ts |
| **Supabase** | ✅ Implemented | SSR client, RLS optimized, getUser() in middleware |
| **Tailwind v4** | ✅ Implemented | CSS-first config, OKLCH colors, custom tokens |
| **shadcn/ui** | ✅ Implemented | 42+ components, New York style |
| **i18n** | ✅ Complete | next-intl 4.x, EN/BG, locale routing |
| **Testing** | ⚠️ Partial | Unit + E2E setup, needs coverage expansion |
| **Security** | ✅ Implemented | RLS, auth validation, env separation |
| **Performance** | ⚠️ Needs Audit | Config ready, needs Lighthouse verification |

---

## 🎯 Phase Overview

| # | Phase | File | Status | Priority | Est. Time |
|---|-------|------|--------|----------|-----------|
| 0 | File Cleanup | [00-file-cleanup.md](./00-file-cleanup.md) | ⚠️ Partial | 🟡 Medium | 1-2 hrs |
| 1 | Next.js 16 | [01-nextjs.md](./01-nextjs.md) | ✅ Done | - | - |
| 2 | Supabase | [02-supabase.md](./02-supabase.md) | ✅ Done | - | - |
| 3 | Tailwind v4 | [03-tailwind.md](./03-tailwind.md) | ⚠️ Partial | 🟡 Medium | 2-3 hrs |
| 4 | shadcn/ui | [04-shadcn.md](./04-shadcn.md) | ✅ Done | - | - |
| 5 | i18n | [05-i18n.md](./05-i18n.md) | ✅ Done | - | - |
| 6 | Testing | [06-testing.md](./06-testing.md) | ⚠️ Partial | 🟡 Medium | 2-3 hrs |
| 7 | Performance | [07-performance.md](./07-performance.md) | ⬜ Audit Needed | 🔴 Critical | 2-3 hrs |
| 8 | Security | [08-security.md](./08-security.md) | ⚠️ Dashboard Action | 🔴 Critical | 1 hr |
| 9 | Go-Live | [09-go-live.md](./09-go-live.md) | ⬜ Ready | 🔴 Critical | 2-4 hrs |

**Remaining Work:** ~10-15 hours

### What's Actually Left:

1. **File Cleanup (Phase 0)** - Remove dead code, console.logs, duplicate configs
2. **Tailwind Palette (Phase 3)** - Fix ~1000 hardcoded color violations
3. **Testing Coverage (Phase 6)** - Fix E2E test, add more unit tests
4. **Performance Audit (Phase 7)** - Run Lighthouse, verify metrics
5. **Security Dashboard (Phase 8)** - Enable leaked password protection in Supabase
6. **Go-Live (Phase 9)** - DNS, env vars, deploy

---

## 🏃 Execution Order (Updated)

Since most tech stack phases are complete, focus on the remaining items:

### Sprint 1: Cleanup & Testing (Day 1)
```
Phase 0 → Phase 6
```
1. **Phase 0 - File Cleanup** (1-2 hrs)  
   Remove dead files, console.logs, merge vitest configs

2. **Phase 6 - Testing** (2-3 hrs)  
   Fix failing E2E test, add coverage thresholds

### Sprint 2: Performance & Security (Day 2)
```
Phase 7 → Phase 8
```
3. **Phase 7 - Performance** (2-3 hrs)  
   Run Lighthouse, verify Core Web Vitals, check bundle size

4. **Phase 8 - Security** (1 hr)  
   Enable leaked password protection in Supabase Dashboard

### Sprint 3: Polish & Launch (Day 2-3)
```
Phase 3 → Phase 9
```
5. **Phase 3 - Tailwind** (2-3 hrs, optional)  
   Fix palette violations in high-traffic components

6. **Phase 9 - Go-Live** (2-4 hrs)  
   Configure Vercel, DNS, Supabase production, deploy

---

## ✅ Quality Gates (Must Pass Before Launch)

These are **hard gates**. If any gate fails, you are *not* launch-ready.

### Gate A — Green CI-style checks (must all exit 0)

Prefer VS Code Tasks where available (the repo already defines them).

```bash
pnpm -s lint
pnpm -s typecheck
pnpm -s test:unit
pnpm -s test:e2e
pnpm -s build
```

### Gate B — E2E completeness

- **No skips** in the launch-critical Playwright suite.
- If a test is skipped today, it must be either:
   - removed from the launch gate explicitly (with rationale), or
   - fixed and re-enabled.

### Gate C — Performance targets (minimum)

Targets below must be met on representative pages (Home, Product, Checkout/Auth flows) using the repo’s Lighthouse flow.

```bash
pnpm -s test:lighthouse
```

### Gate D — Security / data safety

- Supabase advisors: **0 security warnings** (especially `function_search_path_mutable`).
- Leaked password protection: **enabled** (Dashboard).
- RLS: verified for read/write boundaries on all user tables + storage.
- Client bundle: **no** `SUPABASE_SERVICE_ROLE_KEY`.

### Gate E — Go-live operational readiness

- DNS + TLS issued and verified for `amazong.bg`.
- Vercel production env vars set (and validated at runtime).
- CI environment parity: Node + pnpm versions pinned, and `pnpm-lock.yaml` is used.
- Monitoring: basic uptime checks + error reporting configured (or explicitly deferred).
- Supabase production backups enabled.

---

## 🧭 Working Rules (Follow This While Executing)

To keep execution consistent and avoid random one-off commands:

- **Prefer VS Code Tasks** (the repo already defines them) for `dev`, `typecheck`, and E2E.
- **Prefer Next.js MCP tool calls** (runtime inspection) for routes/errors/logs when you’re working with an AI agent.
- **Fallback:** use the Next.js dev overlay + terminal logs + Playwright traces when MCP isn’t available.
- **Use terminal commands only when there is no task/tool** that accomplishes the same thing.
- **When this plan shows “commands,” treat them as checklists**—if a task exists, run the task.

```bash
# All commands must exit 0
pnpm lint              # Zero ESLint errors
pnpm typecheck         # Zero TypeScript errors
pnpm test:unit         # All unit tests pass
pnpm test:e2e          # All E2E tests pass
pnpm build             # Production build succeeds
```

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥80 |
| Lighthouse Accessibility | ≥90 |
| Lighthouse SEO | ≥90 |
| LCP | ≤2.5s |
| INP | ≤200ms |
| CLS | ≤0.1 |

### Security Checklist
- [ ] All RLS policies tested
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` in client bundle
- [ ] Auth flows work E2E (sign up, sign in, sign out)
- [ ] Leaked password protection enabled

---

## 🔧 Key Commands

```bash
# Development
pnpm dev              # Start dev server (webpack)
pnpm build            # Production build
pnpm start            # Start production server

# Quality Checks
pnpm lint             # ESLint
pnpm typecheck        # TypeScript (tsc --noEmit)
pnpm test:unit        # Vitest unit tests
pnpm test:e2e         # Playwright E2E tests
pnpm test:all         # Full test suite

# Cleanup
pnpm clean            # Remove generated artifacts
pnpm clean:next       # Delete .next folder
```

---

## 📁 Target Directory Structure

After cleanup, the project should look like:

```
amazong/
├── app/                    # Next.js 16 App Router
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── common/             # Shared components
│   ├── mobile/             # Mobile-specific
│   └── desktop/            # Desktop-specific
├── config/                 # App configuration
├── e2e/                    # Playwright E2E tests
├── hooks/                  # Custom React hooks
├── i18n/                   # next-intl config
├── lib/                    # Utilities & helpers
│   └── supabase/           # Supabase clients
├── messages/               # Translation JSON files
│   ├── en.json
│   └── bg.json
├── proxy.ts                # Next.js 16 Proxy entrypoint (i18n + auth + geo)
├── production/             # These planning docs
├── public/                 # Static assets
├── scripts/                # Build scripts
├── supabase/               # Migrations & schema
├── test/                   # Test setup files
├── types/                  # TypeScript types
└── __tests__/              # Vitest unit tests
```

**Deleted in Phase 0:**
- `cleanup/` folder
- `*-output.txt` files
- `playwright-report-*/` folders
- Duplicate `vitest.config.ts`
- Old root `.md` files

---

## 📝 Phase Summaries

### Phase 0: File Cleanup ⚠️ Partial
**Goal:** Remove noise before production  
**Status:** Dead code identified, cleanup pending  
**Key Actions:**
- Delete unused files (4 files from knip-report)
- Remove development console.logs
- Merge vitest configs
- Run `pnpm clean:artifacts`

### Phase 1: Next.js 16 ✅ Complete
**Goal:** Best practices for server/client, caching  
**Status:** Implemented correctly
- `cacheComponents: true` enabled
- Custom `cacheLife` profiles configured
- `proxy.ts` middleware with async params
- Server/client boundaries correct

### Phase 2: Supabase ✅ Complete
**Goal:** Secure, optimized database  
**Status:** All code fixes applied
- ✅ Fixed `function_search_path_mutable` warning
- ✅ Optimized RLS with `(select auth.uid())` pattern
- ✅ Added `cart_items(product_id)` index
- ✅ Removed duplicate wishlists index
- ⚠️ **Dashboard action needed:** Enable leaked password protection
- Enable leaked password protection
- Optimize RLS with `(select auth.uid())` pattern
- Add missing indexes (FK-covering indexes like `cart_items.product_id`)
- Remove duplicate index on wishlists
- Stop bypassing RLS in user-facing API routes (avoid service-role client)
- Remove mock browser client fallback (fail fast on missing env)
- Remove over-engineered RPC wrappers; keep types in sync

**Status (verified):**
- ✅ Resolved function `search_path` warning
- ✅ Optimized `notification_preferences` RLS policies
- ✅ Added `cart_items(product_id)` index
- ✅ Removed duplicate `wishlists` index
- ✅ Optimized `storage.objects` delete policy (no bare `auth.uid()`)
- ✅ Removed service-role usage from user-facing routes; RLS now enforced in API writes
- ✅ Applied cleanup migration removing RPC wrappers + unused indexes; restored FK-covering indexes after advisor flagged gaps
- ✅ Regenerated Supabase types and synced `lib/supabase/database.types.ts` to match live DB
- ⬜ Leaked password protection still disabled (Dashboard action required)

### Phase 3: Tailwind v4
**Goal:** Consistent design system  
**Key Actions:**
- Add semantic color tokens
- Fix 1000+ palette violations in 80 files
- Consolidate dark mode variables
- Use CSS variables instead of `theme()`

### Phase 4: shadcn/ui
**Goal:** Updated, accessible components  
**Key Actions:**
- Run `npx shadcn@latest diff` for updates
- Add `aria-invalid` to all form inputs
- Verify dialog/modal accessibility
- Standardize on the existing Field system in `components/common/field.tsx` (do not introduce a second “Field” component) and ensure labels/errors are wired correctly

### Phase 5: i18n ✅
**Status:** Already production-ready  
- next-intl 4.x configured
- Type-safe locale routing + navigation helpers
- Bulgarian (bg) + English (en)

### Phase 6: Testing
**Goal:** Reliable test suite  
**Key Actions:**
- Delete duplicate `vitest.config.ts`
- Fix failing sell page E2E test
- Add unit tests for auth/cart utilities
- Configure coverage thresholds

### Phase 7: Performance
**Goal:** Fast Core Web Vitals  
**Key Actions:**
- Run Lighthouse, fix issues
- Analyze bundle with `ANALYZE=true pnpm build`
- Optimize images (add `priority` to LCP images)
- Verify caching is working

### Phase 8: Security
**Goal:** Production-secure before public launch  
**Key Actions:**
- Verify `getUser()` not `getSession()` in middleware
- Audit all RLS policies
- Check env vars (no secrets in client)
- Enable auth protections in Supabase dashboard

### Phase 9: Go-Live
**Goal:** Zero-downtime launch  
**Key Actions:**
- Set Vercel env vars (production)
- Configure DNS for amazong.bg
- Run final E2E on production URL
- Enable Supabase backups

---

## 🚨 Critical Items (Do First)

These are **blockers** that must be fixed before launch:

1. **Security Advisor Warnings** (Phase 2)
   - `function_search_path_mutable` on `set_notification_preferences_updated_at`
   - Leaked password protection disabled

2. **RLS Performance** (Phase 2)
   - `notification_preferences` policies use bare `auth.uid()` (fix with `(select ...)`)

3. **Missing Index** (Phase 2)
   - `cart_items.product_id_fkey` needs covering index

4. **Console Logs in Production** (Phase 0)
   - Several `console.log` statements ship to production
   - Add `removeConsole` compiler option

---

## 🎯 Launch Checklist

Final verification before going live:

```bash
# 1. Clean build
pnpm clean
pnpm build

# 2. All tests pass
pnpm test:unit
pnpm test:e2e

# 3. Lighthouse
pnpm test:lighthouse

# 4. Security
# - Supabase advisors: 0 warnings
# - RLS tested manually
# - Auth flow E2E verified
```

- [ ] All phases complete
- [ ] Quality gates pass
- [ ] Lighthouse targets met
- [ ] Domain DNS configured
- [ ] Vercel production env vars set
- [ ] Supabase production project ready
- [ ] Git tagged: `git tag v1.0.0-launch`

---

## 📞 Support Links

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side)
- [Tailwind v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl.dev)
- [Playwright](https://playwright.dev)

---

**Start here:** [Phase 0 - File Cleanup](./00-file-cleanup.md)

**Note:** Read Phase 0 first, but execute phases in the Sprint order above (Phase 1 → Phase 2 → …). Phase 0 cleanup is scheduled later because audits/refactors can reveal what’s truly dead.
