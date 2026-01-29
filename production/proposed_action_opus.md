```markdown
# Proposed Action Plan — Opus (Claude Opus 4.5)

> **Comprehensive production roadmap for Treido V1 launch.**

**Created:** January 29, 2026  
**Author:** Opus (Claude Opus 4.5)  
**Purpose:** Define the complete path from current state to production deployment

---

## Executive Summary

Treido is at **86% feature completion** (102/119 features). The core marketplace flows work. What remains is:

1. **Security hardening** (5 critical items)
2. **Type safety cleanup** (verified complete ✅)
3. **Frontend polish** (8 P1 blockers)
4. **Ops tooling** (admin surfaces, support playbooks)
5. **Code hygiene** (knip/dupes cleanup)

**Estimated time to production: 6-8 working days**

---

## Current State Analysis

### Shipping Gates Status

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm -s typecheck` | ✅ Pass | No TypeScript errors |
| `pnpm -s lint` | ✅ Pass | 0 errors, 569 warnings |
| `pnpm -s styles:gate` | ✅ Pass | Tailwind compliance |
| `pnpm -s knip` | ⚠️ Warning | 29 unused files, 8 unused exports |
| `pnpm -s dupes` | ⚠️ Warning | 316 clone groups (~3.4% duplication) |
| Unit tests | ✅ Pass | Core logic covered |
| E2E smoke | ✅ Pass | Critical paths verified |

### Feature Readiness

| Category | Done | WIP | Not Started |
|----------|------|-----|-------------|
| Auth & Accounts | 8/8 | 0 | 0 |
| Profiles | 4/6 | 1 | 1 |
| Discovery | 6/7 | 0 | 1 |
| Cart & Checkout | 11/11 | 0 | 0 |
| Messaging | 7/7 | 0 | 0 |
| Reviews | 8/8 | 0 | 0 |
| **Core flows** | **~95%** | — | — |
| **Total** | **102** | **11** | **6** |

### PRD Hard Gates (V1 Launch Requirements)

| Gate | Status | Action Required |
|------|--------|-----------------|
| Webhook idempotency | 🔄 Needs verification | Manual replay test |
| Refund/dispute flow E2E | 🔄 Needs testing | Full flow verification |
| Support playbooks | ❌ Not written | Create documentation |
| Stripe env separation | 🔄 Needs verification | Env vars audit |
| RLS on all user tables | ✅ Done | Already verified |
| No secrets in logs | ✅ Done | Console.log cleanup complete |

---

## Phase-by-Phase Execution Plan

### Phase 1: Critical Security & Backend (Days 1-2)

**Goal:** Eliminate all security blockers

| Task ID | Task | Priority | Estimated |
|---------|------|----------|-----------|
| B-SEC-01 | Verify webhook idempotency with replay test | P1 | 2h |
| B-SEC-02 | Verify Stripe test/live env separation | P1 | 1h |
| B-SEC-03 | Enable leaked password protection (Supabase) | P1 | 15m |
| B-SEC-04 | Run Supabase Security Advisor + document | P1 | 1h |
| B-SEC-05 | Test refund flow end-to-end | P1 | 3h |
| B-SEC-06 | Audit remaining console.log statements | P1 | 2h |

**Verification:**
```bash
# After each task
pnpm -s typecheck
pnpm -s lint

# After webhook changes
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

**Exit Criteria:**
- [ ] Webhook replay creates no duplicates
- [ ] Stripe dashboard shows correct env keys
- [ ] Leaked password protection enabled
- [ ] Security Advisor shows green (or documented exceptions)
- [ ] Refund flow completes seller → buyer → Stripe
- [ ] No sensitive data in production logs

---

### Phase 2: Frontend Critical (Days 2-4)

**Goal:** Fix all P1 user-facing issues

| Task ID | Task | Priority | Files |
|---------|------|----------|-------|
| F-P1-01 | Fix mixed locale content (BG on EN pages) | P1 | i18n keys, page components |
| F-P1-02 | Fix footer year 2025 → 2026 | P1 | `site-footer.tsx` |
| F-P1-03 | Fix page titles (Checkout, Account) | P1 | Page metadata |
| F-P1-04 | Add screen reader labels to icon buttons | P1 | Button components |
| F-P1-05 | Verify touch targets ≥44px | P1 | Product cards, buttons |
| F-P1-06 | Fix cart badge count discrepancy | P1 | Header cart component |
| F-P1-07 | Remove test products from display | P1 | DB cleanup + cache invalidation |
| F-P1-08 | Fix product categorization errors | P1 | Product data |

**Verification:**
```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

**Exit Criteria:**
- [ ] EN pages show only English content
- [ ] Footer shows 2026
- [ ] All pages have descriptive titles
- [ ] All icon buttons have aria-labels
- [ ] Touch targets verified at 44px+
- [ ] Cart badge matches actual cart contents
- [ ] No test data visible to users

---

### Phase 3: Ops & Support (Days 4-5)

**Goal:** Enable support team to handle issues

| Task ID | Task | Priority | Deliverable |
|---------|------|----------|-------------|
| OPS-01 | Write dispute/refund playbook | P1 | `docs-site/support/refund-playbook.md` |
| OPS-02 | Write prohibited items policy | P1 | `docs-site/legal/prohibited-items.md` |
| OPS-03 | Define SLAs and escalation paths | P1 | `docs-site/support/slas.md` |
| OPS-04 | Admin: handle reports UI | P2 | Admin routes completion |
| OPS-05 | Admin: user management basics | P2 | Block/unblock, notes |
| OPS-06 | Admin: "who did what" audit log | P2 | Action logging |

**Exit Criteria:**
- [ ] Support team has written playbooks
- [ ] Prohibited items policy published
- [ ] Admin can view and action reports
- [ ] Admin can manage users
- [ ] Actions are logged for compliance

---

### Phase 4: Quality Polish (Days 5-6)

**Goal:** Fix P2 issues, improve UX

| Task ID | Task | Priority | Impact |
|---------|------|----------|--------|
| F-P2-01 | Consolidate ProductCard variants | P2 | Code maintainability |
| F-P2-02 | Standardize rounding (`rounded-md`) | P2 | Visual consistency |
| F-P2-03 | Add sell wizard step indicator | P2 | UX improvement |
| F-P2-04 | Standardize price formatting | P2 | Consistency |
| F-P2-05 | Add pagination to product grids | P2 | Performance |
| F-P2-09 | Add error boundaries for API failures | P2 | Resilience |
| F-P2-11 | Verify modal focus trap | P2 | Accessibility |

**Exit Criteria:**
- [ ] One ProductCard pattern documented
- [ ] Visual audit shows consistent rounding
- [ ] Sell flow has clear progress indication
- [ ] All prices formatted consistently

---

### Phase 5: Code Hygiene (Days 6-7)

**Goal:** Reduce tech debt without breaking features

| Task ID | Task | Priority | Metric |
|---------|------|----------|--------|
| CLEAN-01 | Knip cleanup (unused files) | P2 | 29 → 0 unused files |
| CLEAN-02 | Knip cleanup (unused exports) | P2 | 8 → 0 unused exports |
| CLEAN-03 | Remove unused devDependencies | P2 | 3 → 0 unused deps |
| CLEAN-04 | Reduce top duplication clusters | P3 | Focus on checkout/cards |
| CLEAN-05 | ESLint warnings reduction | P3 | 569 → <200 warnings |

**Verification:**
```bash
pnpm -s knip          # Should show 0 unused
pnpm -s dupes         # Document remaining clusters
pnpm -s lint          # Reduced warnings
```

**Exit Criteria:**
- [ ] `pnpm -s knip` is clean
- [ ] Top 5 duplication clusters addressed or documented
- [ ] ESLint warnings significantly reduced

---

### Phase 6: Pre-Deploy Verification (Day 7)

**Goal:** Full verification before production

| Task | Command/Action | Expected |
|------|----------------|----------|
| TypeScript | `pnpm -s typecheck` | 0 errors |
| Lint | `pnpm -s lint` | 0 errors |
| Style drift | `pnpm -s styles:gate` | Pass |
| Unit tests | `pnpm -s test:unit` | Pass |
| E2E smoke | `pnpm -s test:e2e:smoke` | Pass |
| Unused code | `pnpm -s knip` | Clean |
| Build | `pnpm build` | Success |
| Lighthouse | Manual audit | ≥75 performance |
| Accessibility | Axe audit | 0 critical issues |

**Manual Checks:**
- [ ] Supabase Security Advisor: clean
- [ ] Stripe dashboard: live keys in prod
- [ ] Vercel env vars: correct per environment
- [ ] Support playbooks: published and shared

---

### Phase 7: Deploy & Monitor (Day 8)

**Goal:** Safe production deployment

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Merge to main | CI passes |
| 2 | Deploy to staging | Smoke tests pass |
| 3 | Deploy to production | Health check passes |
| 4 | Verify critical paths | Manual checkout flow |
| 5 | Monitor 24h | Error tracking, webhooks |

**Post-Deploy Monitoring:**
- [ ] Error tracking dashboard (Sentry/Vercel)
- [ ] Stripe webhook dashboard
- [ ] Supabase connection metrics
- [ ] User feedback channels active

---

## Risk Assessment

### High Risk Items

| Risk | Mitigation | Fallback |
|------|------------|----------|
| Webhook duplicates | Replay testing before deploy | Idempotency key hardening |
| Stripe env confusion | Explicit env var audit | Feature flag to disable payments |
| Data inconsistency | Test product cleanup | Manual DB audit |
| Performance regression | Lighthouse gates | CDN caching increase |

### Medium Risk Items

| Risk | Mitigation | Fallback |
|------|------------|----------|
| i18n missing keys | Full locale audit | Fallback to EN |
| Cart sync failures | RPC verification | Client-side fallback |
| Admin surface gaps | MVP scope definition | Support team manual process |

---

## Resource Allocation

### Backend Focus (Codex)

- Security hardening (B-SEC-*)
- Webhook verification
- Database cleanup
- API fixes

### Frontend Focus (Opus)

- UI polish (F-P1-*, F-P2-*)
- i18n fixes
- Accessibility improvements
- Visual consistency

### Shared Work

- Support playbooks (collaborative)
- Testing verification
- Deploy monitoring

---

## Success Metrics for V1 Launch

### Technical

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | ≥75 | Automated audit |
| Lighthouse Accessibility | ≥90 | Automated audit |
| TypeScript errors | 0 | CI gate |
| ESLint errors | 0 | CI gate |
| P1 bugs | 0 | Issue tracker |
| P2 bugs | <5 | Issue tracker |

### Operational

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | >99.5% | Monitoring |
| Error rate | <1% | Error tracking |
| Support response | <24h | Ticket system |
| Dispute rate | <2% | Stripe dashboard |

---

## Timeline Summary

| Day | Focus | Key Deliverables |
|-----|-------|------------------|
| 1 | Security | Webhook verification, env separation |
| 2 | Security + Frontend | Leaked password, refund test, locale fixes |
| 3 | Frontend | P1 UI fixes (titles, accessibility) |
| 4 | Frontend + Ops | P1 completion, playbook drafts |
| 5 | Ops + Polish | Support docs, P2 fixes start |
| 6 | Polish | P2 completion, code cleanup |
| 7 | Verification | Full gate verification, Lighthouse |
| 8 | Deploy | Production deployment + monitoring |

---

## Deferred to V1.1

These items are explicitly out of scope for initial launch:

| Feature | Reason | Target |
|---------|--------|--------|
| Saved searches | Not MVP | V1.1 |
| Related items | Requires ML | V1.1 |
| Recently viewed | UX polish | V1.1 |
| Wishlist sharing | Low priority | V1.1 |
| Listing analytics | Business tier | V1.1 |
| Email notifications | Backend complexity | V1.1 |
| Advanced admin | Ops iteration | V1.1 |

---

## Decision Points

### Requires User Input

1. **Deploy date:** Target February 1, 2026? Or flexible?
2. **Buyer cancel order:** Launch without or implement P1?
3. **Email notifications:** Stripe receipts only for V1?
4. **Admin minimum:** What's the MVP for ops?

### Agent Agreement Needed

All resolved in `opus_codex.md`:
- ✅ Task ownership protocol
- ✅ Verification gate conditions
- ✅ Priority definitions
- ✅ Communication workflow

---

## Appendix: File References

### Security-Critical Files

- `app/api/payments/webhook/route.ts` — Stripe payment webhook
- `app/api/connect/webhook/route.ts` — Stripe Connect webhook
- `app/api/checkout/webhook/route.ts` — Checkout webhook
- `lib/supabase/*` — Database client configuration

### Frontend-Critical Files

- `components/layout/footer/site-footer.tsx` — Footer year
- `components/layout/header/*` — Cart badge, navigation
- `messages/en.json`, `messages/bg.json` — i18n strings
- `components/shared/product/*` — Product cards

### Support Documentation (To Create)

- `docs-site/support/refund-playbook.md`
- `docs-site/support/dispute-resolution.md`
- `docs-site/legal/prohibited-items.md`
- `docs-site/support/slas.md`

---

## Next Steps

1. **Immediate:** User confirms timeline and answers decision points
2. **Day 1:** Begin Phase 1 (Security)
3. **Ongoing:** Update `opus_codex.md` with progress
4. **End:** Celebrate launch 🚀

---

*Created: January 29, 2026*  
*Author: Opus (Claude Opus 4.5)*  
*Status: Ready for execution*

```
