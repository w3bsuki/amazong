# 🚀 Production Master Plan

> **Goal:** Ship a clean, production-ready Bulgarian marketplace  
> **Target:** amazong.bg  
> **Launch:** ASAP after completing this checklist  
> **Last Updated:** December 27, 2025

---

## 📊 Current State (Verified)

| Check | Status | Notes |
|-------|--------|-------|
| `pnpm lint` | ✅ | Zero errors |
| `pnpm typecheck` | ✅ | Zero errors |
| `pnpm test:unit` | ✅ | 4/4 passing |
| `pnpm test:e2e` | ⚠️ | 9/10 passing (1 skip) |
| `pnpm build` | ✅ | Builds successfully |
| Dev Server | ✅ | Responding on localhost:3000 (`/en` and `/bg` return 200; `/` should redirect to a locale) |

---

## 🎯 Phase Overview

| # | Phase | File | Status | Priority | Est. Time |
|---|-------|------|--------|----------|-----------|
| 0 | File Cleanup | [00-file-cleanup.md](./00-file-cleanup.md) | ⬜ | 🔴 Critical | 2-3 hrs |
| 1 | Next.js 16 | [01-nextjs.md](./01-nextjs.md) | ⬜ | 🔴 Critical | 2-4 hrs |
| 2 | Supabase | [02-supabase.md](./02-supabase.md) | ⚠️ | 🔴 Critical | 2-4 hrs |
| 3 | Tailwind v4 | [03-tailwind.md](./03-tailwind.md) | ⬜ | 🟡 Medium | 2-3 hrs |
| 4 | shadcn/ui | [04-shadcn.md](./04-shadcn.md) | ⬜ | 🟡 Medium | 1-2 hrs |
| 5 | i18n | [05-i18n.md](./05-i18n.md) | ✅ Done | - | - |
| 6 | Testing | [06-testing.md](./06-testing.md) | ⬜ | 🟡 Medium | 2-3 hrs |
| 7 | Performance | [07-performance.md](./07-performance.md) | ⬜ | 🔴 Critical | 2-3 hrs |
| 8 | Security | [08-security.md](./08-security.md) | ⬜ | 🔴 Critical | 2-4 hrs |
| 9 | Go-Live | [09-go-live.md](./09-go-live.md) | ⬜ | 🔴 Critical | 1-2 hrs |

**Total Estimated Time:** 15-25 hours

---

## 🏃 Execution Order (Optimized)

The phases are **dependency-ordered** - complete in this exact sequence:

### Sprint 1: Tech Stack Audit (Day 1-2)
```
Phase 1 → Phase 2 → Phase 8
```
1. **Phase 1 - Next.js 16** (2-4 hrs)  
   Server/client boundaries, caching strategy, async params

2. **Phase 2 - Supabase** (2-4 hrs)  
   Apply security fixes, optimize RLS policies, add indexes

3. **Phase 8 - Security** (2-4 hrs)  
   RLS audit, auth validation, env var check - **DO BEFORE PUBLIC**

> **Why tech stack first?** Refactoring reveals dead code. You'll discover what's actually used vs orphaned.

### Sprint 2: Polish & Testing (Day 2-3)
```
Phase 3 → Phase 4 → Phase 6
```
4. **Phase 3 - Tailwind v4** (2-3 hrs)  
   Fix palette violations, add semantic tokens

5. **Phase 4 - shadcn/ui** (1-2 hrs)  
   Update components, add accessibility fixes

6. **Phase 6 - Testing** (2-3 hrs)  
   Fix failing E2E test, add missing unit tests

### Sprint 3: Cleanup & Launch (Day 3)
```
Phase 0 → Phase 7 → Phase 9
```
7. **Phase 0 - File Cleanup** (30 min)  
   Delete noise files, merge vitest configs, remove console.logs  
   > **Now we know exactly what's dead code vs still needed**

8. **Phase 7 - Performance** (2-3 hrs)  
   Lighthouse audit, image optimization, bundle analysis

9. **Phase 9 - Go-Live** (1-2 hrs)  
   DNS, Vercel config, Supabase production, final checks

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

### Phase 0: File Cleanup
**Goal:** Remove noise before production  
**Key Actions:**
- Delete `cleanup/` folder (superseded by `production/`)
- Delete output files (`*-output.txt`, `*.json` reports)
- Merge vitest configs (keep `.mts`, delete `.ts`)
- Remove development console.logs
- Add `removeConsole` to next.config.ts

### Phase 1: Next.js 16
**Goal:** Best practices for server/client, caching  
**Key Actions:**
- Audit `"use client"` directives (push down)
- Implement `'use cache'` with custom cacheLife profiles
- Fix async `params` handling
- Add `<Suspense>` boundaries for streaming

### Phase 2: Supabase
**Goal:** Secure, optimized database  
**Key Actions:**
- Fix `function_search_path_mutable` warning
- Enable leaked password protection
- Optimize RLS with `(select auth.uid())` pattern
- Add missing indexes (`cart_items.product_id`)
- Remove duplicate index on wishlists

**Status (verified):**
- ✅ Resolved function `search_path` warning
- ✅ Optimized `notification_preferences` RLS policies
- ✅ Added `cart_items(product_id)` index
- ✅ Removed duplicate `wishlists` index
- ✅ Optimized `storage.objects` delete policy (no bare `auth.uid()`)
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
