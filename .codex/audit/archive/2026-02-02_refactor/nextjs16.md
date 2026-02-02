# Next.js 16 App Router Audit

> Audit Date: 2026-02-02 | Auditor: spec-nextjs | Status: ✅ Complete

---

## Summary

**Overall Assessment:** Strong adherence to Next.js 16 best practices.

| Severity | Count | Top Issues |
|----------|-------|------------|
| 🔴 High | 2 | `cookies()` in search/deals pages causes ISR storms |
| 🟠 Medium | 8 | `new Date()` in cached functions, client-side waterfalls |
| 🟡 Low | 12 | Unnecessary "use client", missing generateStaticParams |

---

## Critical Findings (Phase 2)

| Path:Line | Severity | Issue | Fix | Phase |
|-----------|----------|-------|-----|-------|
| `app/[locale]/(main)/search/page.tsx:89` | 🔴 High | `cookies()` inside page breaks static caching | Extract shipping zone to layout, pass as searchParam | 2 |
| `app/[locale]/(main)/todays-deals/page.tsx:40` | 🔴 High | Same issue - `cookies()` breaks ISR | Same fix pattern | 2 |

---

## Medium Findings (Phase 3)

| Path:Line | Severity | Issue | Fix | Phase |
|-----------|----------|-------|-----|-------|
| `lib/data/products.ts` | 🟠 Medium | `new Date()` in cached functions | Use pre-computed timestamps or move date logic outside cache | 3 |
| Various client components | 🟠 Medium | Client-side waterfalls | Consider Suspense streaming | 3 |

---

## Low Findings (Phase 4)

| Path:Line | Severity | Issue | Fix | Phase |
|-----------|----------|-------|-----|-------|
| Various dynamic routes | 🟡 Low | Missing `generateStaticParams()` | Add for hot segments to prevent ISR spikes | 4 |
| Multiple components | 🟡 Low | Unnecessary `"use client"` | Audit and remove where not needed | 4 |

---

## Strengths (No Action Needed)

- ✅ Excellent `'use cache'` + `cacheTag()` + `cacheLife()` pattern in `lib/data/`
- ✅ Proper Supabase client separation (`createStaticClient` vs `createClient`)
- ✅ No `select('*')` queries in hot paths
- ✅ Good Suspense boundary usage for streaming

---

## Risk Assessment

| Category | Risk |
|----------|------|
| ISR Storms | 🔴 High - `cookies()` in pages |
| Performance | 🟡 Medium - Some optimization opportunities |
| RSC Boundaries | 🟢 Low - Generally correct |

---

*Generated: 2026-02-02*
