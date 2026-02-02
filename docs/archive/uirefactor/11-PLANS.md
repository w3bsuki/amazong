# Implementation Plans

**Status:** Active Planning  
**Timeline:** 6-7 weeks for production-ready UI/UX

---

## 🎯 Priority Matrix

### P0 - Must Launch (Week 1-2)
Critical for production. Cannot ship without these.

| Task | Est. | Owner | Status |
|------|------|-------|--------|
| Remove account_type from signup form | 2h | - | ⬜ |
| Create OnboardingModal component | 8h | - | ⬜ |
| Account type selection step | 4h | - | ⬜ |
| Profile setup step (personal) | 4h | - | ⬜ |
| Profile setup step (business) | 6h | - | ⬜ |
| Username selection step | 4h | - | ⬜ |
| Location picker step | 4h | - | ⬜ |
| Onboarding completion + CTA | 2h | - | ⬜ |
| Bottom nav relabel (Обяви → Search) | 1h | - | ⬜ |
| Fix onboarding provider gating | 2h | - | ⬜ |

### P1 - Should Launch (Week 2-4)
Important for good UX, but can soft-launch without.

| Task | Est. | Owner | Status |
|------|------|-------|--------|
| Category circles → drawer (landing) | 8h | - | ⬜ |
| Remove inline contextual pills | 4h | - | ⬜ |
| Unified search drawer | 8h | - | ⬜ |
| AI search integration in drawer | 6h | - | ⬜ |
| URL-driven drawer state | 4h | - | ⬜ |
| Search tab opens drawer (not page) | 2h | - | ⬜ |
| Sell button prominence (center) | 2h | - | ⬜ |
| Business dashboard shell | 16h | - | ⬜ |
| Dashboard products list | 8h | - | ⬜ |
| Dashboard basic stats | 8h | - | ⬜ |

### P2 - Nice to Have (Week 4-6)
Enhances experience, can iterate post-launch.

| Task | Est. | Owner | Status |
|------|------|-------|--------|
| CSV export functionality | 8h | - | ⬜ |
| CSV import with mapping | 12h | - | ⬜ |
| Analytics charts (views/revenue) | 12h | - | ⬜ |
| Seller feed view (optional toggle) | 16h | - | ⬜ |
| View toggle (Feed/Grid) | 4h | - | ⬜ |
| Premium gating for dashboard features | 4h | - | ⬜ |
| Username change limit enforcement | 2h | - | ⬜ |

### P3 - Future (Post-Launch)
Track for later, don't block launch.

| Task | Est. | Owner | Status |
|------|------|-------|--------|
| Push notifications | - | - | ⬜ |
| Advanced analytics | - | - | ⬜ |
| API access for businesses | - | - | ⬜ |
| Bulk product actions | - | - | ⬜ |

---

## 📅 Week-by-Week Plan

### Week 1: Foundation
**Goal:** Core onboarding flow working

- [ ] Remove account_type from signup
- [ ] Create OnboardingModal shell
- [ ] Step 1: Account type selector
- [ ] Step 2: Personal profile setup
- [ ] Step 2B: Business profile setup
- [ ] Fix provider to trigger without username
- [ ] Unit tests for onboarding

**Deliverable:** New users see onboarding after signup

### Week 2: Onboarding + Nav Start
**Goal:** Complete onboarding, start nav changes

- [ ] Step 3: Username selection (with availability check)
- [ ] Step 4: Location picker
- [ ] Step 5: Completion with CTAs
- [ ] Bottom nav relabel (Search)
- [ ] E2E tests for onboarding flow

**Deliverable:** Full onboarding flow complete

### Week 3: Navigation Overhaul
**Goal:** Drawer-based navigation

- [ ] Category circles → drawer behavior
- [ ] Create UnifiedSearchDrawer
- [ ] Remove inline pills from landing
- [ ] AI search in drawer
- [ ] URL-driven drawer state
- [ ] Search tab opens drawer

**Deliverable:** New navigation pattern live

### Week 4: Business Dashboard Start
**Goal:** Basic dashboard for business users

- [ ] Dashboard layout (protected route)
- [ ] Products list view
- [ ] Basic stats (views, messages)
- [ ] Stat cards UI
- [ ] Premium gate (dashboard access)

**Deliverable:** Business users can access dashboard

### Week 5: Dashboard Features
**Goal:** Full dashboard functionality

- [ ] CSV export
- [ ] CSV import (with preview)
- [ ] Product bulk selection
- [ ] Analytics charts
- [ ] Edit product from dashboard

**Deliverable:** Feature-complete dashboard

### Week 6: Polish & Desktop
**Goal:** Production-ready

- [ ] Desktop layout verification
- [ ] Animation polish
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Full E2E test suite
- [ ] Bug fixes

**Deliverable:** Ready for production

### Week 7: Buffer
**Goal:** Handle overflow, QA

- [ ] Bug fixes from testing
- [ ] User feedback integration
- [ ] Documentation updates
- [ ] Final QA pass

---

## 🔧 Technical Prerequisites

Before starting implementation:

1. **Database migration** for `onboarding_completed` if not exists
2. **Server action** for updating profile (privileged, allows account_type)
3. **Premium feature flag** system for dashboard gating
4. **Analytics aggregation** tables (not raw events)

---

## 🚫 Out of Scope

These are explicitly NOT in this refactor:

- New payment features
- New shipping features
- Community/social features
- Native mobile app
- Major backend changes
- New product types (auctions, etc.)

---

## 📏 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Onboarding completion rate | > 80% | Analytics |
| Time to first listing | < 5 min | Analytics |
| Search to product view | < 3 taps | UX testing |
| Dashboard adoption (business) | > 50% | Analytics |
| Mobile LCP | < 1.5s | Web Vitals |
| Mobile CLS | < 0.1 | Web Vitals |

---

## 🔄 Review Checkpoints

| Checkpoint | When | Focus |
|------------|------|-------|
| Onboarding review | End of Week 2 | Flow completeness, edge cases |
| Navigation review | End of Week 3 | Drawer UX, performance |
| Dashboard review | End of Week 5 | Business features, premium gate |
| Production review | End of Week 6 | Full QA, performance |
