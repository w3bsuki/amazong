# TASKS-UIUX.md — UI/UX Refactor Execution

> **DEPRECATED (historical).** UI refactor docs were archived to `docs/archive/uirefactor/`. Active execution queue is `.codex/TASKS.md`.

**Created:** 2026-02-01  
**Status:** Phase 1 Complete ✅ | Phases 2-4 Ready  
**Total Phases:** 4 | **Total Tasks:** 14 | **Completed:** 7

---

## 📚 REQUIRED READING

**Before ANY task, agents MUST read these docs:**

| Priority | Document | Path |
|----------|----------|------|
| 🔴 Critical | Locked Decisions | `docs/archive/uirefactor/08-DECISIONS.md` |
| 🔴 Critical | Architecture + Rails | `docs/archive/uirefactor/10-ARCHITECTURE.md` |
| 🟡 High | Master Plan | `docs/archive/uirefactor/01-MASTER-PLAN.md` |
| 🟡 High | Current Features | `docs/archive/uirefactor/09-FEATURES.md` |

**Task-specific docs (read before starting that phase):**

| Phase | Document | Path |
|-------|----------|------|
| Phase 1 | Onboarding Flow | `docs/archive/uirefactor/02-ONBOARDING-FLOW.md` |
| Phase 2 | Navigation | `docs/archive/uirefactor/04-NAVIGATION.md` |
| Phase 3 | Business Features | `docs/archive/uirefactor/05-BUSINESS-FEATURES.md` |
| Phase 4 | Landing Page | `docs/archive/uirefactor/03-LANDING-PAGE.md` |
| All | Components | `docs/archive/uirefactor/06-COMPONENTS.md` |

---

## 🚫 RAILS (Hard Constraints)

**Violations = task failure. No exceptions.**

```
❌ NO gradients (use solid colors)
❌ NO arbitrary Tailwind values (use design tokens)
❌ NO hardcoded colors (rgba, hex, hsl)
❌ NO new decorative animations (use existing Vaul/Tailwind)
❌ NO middleware.ts routing (use proxy.ts)
❌ NO generic openDrawer() (use specific methods like openProductQuickView())
❌ DO NOT edit shadcn primitives in components/ui/ (customize via wrapper)
❌ DO NOT create new drawer primitives (use existing Vaul system)
```

Reference: `docs/archive/uirefactor/10-ARCHITECTURE.md`

---

## ✅ GATES (Run After EVERY Task)

```powershell
pnpm -s typecheck        # Must pass
pnpm -s lint             # Must pass  
pnpm -s styles:gate      # Must pass (no rails violations)
```

For UI changes, also verify visually:
```powershell
pnpm dev                 # Start server
# Check http://localhost:3000 on mobile viewport (375px)
```

---

## 🔥 PHASE 1: Onboarding (P0) — Week 1

**Required reading:** `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`

### Task 1.1: Account Type Selection Screen ✅
- **Priority:** P0
- **Create:**
  - `app/[locale]/(onboarding)/onboarding/page.tsx` (redirect to account-type)
  - `app/[locale]/(onboarding)/onboarding/account-type/page.tsx`
  - `components/onboarding/account-type-card.tsx`
- **Spec:** Screen 1 in `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`
- **Reference existing:**
  - `components/ui/card.tsx`
  - `components/ui/button.tsx`
- **Acceptance:**
  - [x] Two cards render (Personal / Business)
  - [x] Single selection only
  - [x] Continue → `/onboarding/profile?type={personal|business}`
  - [x] Gates pass

### Task 1.2: Remove Account Type from Signup ✅
- **Priority:** P0
- **Modify:**
  - `app/[locale]/(auth)/_components/sign-up-form.tsx`
  - `lib/validations/auth.ts` (remove account_type validation)
  - `app/[locale]/(auth)/_actions/auth.ts` (update signup action)
- **Spec:** Signup = email + password ONLY
- **Acceptance:**
  - [x] No account type field in form
  - [x] Signup still functional
  - [x] Gates pass
- **Note:** username/name fields retained per DB constraints; accountType removed

### Task 1.3: Personal Profile Setup ✅
- **Priority:** P0
- **Create:**
  - `app/[locale]/(onboarding)/onboarding/profile/page.tsx`
- **Spec:** Screen 2A in `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`
- **Reference existing:**
  - `lib/validations/auth.ts` (username validation)
  - `components/ui/input.tsx`
  - `components/ui/avatar.tsx`
- **Acceptance:**
  - [x] Username input with availability check
  - [x] Display name input
  - [x] Avatar upload works
  - [x] Progress: "Step 2 of 4"
  - [x] Gates pass

### Task 1.4: Business Profile Setup ✅
- **Priority:** P0
- **Create:**
  - `app/[locale]/(onboarding)/onboarding/business-profile/page.tsx`
- **Spec:** Screen 2B in `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`
- **Acceptance:**
  - [x] Business name input
  - [x] Username auto-suggests from business name
  - [x] Category dropdown
  - [x] Logo upload
  - [x] Gates pass

### Task 1.5: Interests Selection ✅
- **Priority:** P0
- **Create:**
  - `app/[locale]/(onboarding)/onboarding/interests/page.tsx`
  - `components/onboarding/interest-chip.tsx`
- **Spec:** Screen 3 in `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`
- **Acceptance:**
  - [x] Category chips render
  - [x] Multi-select (min 3 OR skip)
  - [x] Saves to profile
  - [x] Gates pass

### Task 1.6: Onboarding Complete ✅
- **Priority:** P0
- **Create:**
  - `app/[locale]/(onboarding)/onboarding/complete/page.tsx`
  - `app/[locale]/api/onboarding/complete/route.ts`
- **Spec:** Screen 4 in `docs/archive/uirefactor/02-ONBOARDING-FLOW.md`
- **Acceptance:**
  - [x] Success message
  - [x] CTA based on account type
  - [x] Sets `onboarding_completed: true`
  - [x] Gates pass

### Task 1.7: Update OnboardingProvider ✅
- **Priority:** P0
- **Modify:**
  - `app/[locale]/(main)/_providers/onboarding-provider.tsx`
- **Spec:** Gate on `onboarding_completed` flag, NOT username
- **Reference:** `docs/archive/uirefactor/10-ARCHITECTURE.md` (Onboarding section)
- **Acceptance:**
  - [x] Incomplete users → `/onboarding`
  - [x] Complete users → main app
  - [x] Auth routes always accessible
  - [x] Gates pass

---

## 🔥 PHASE 2: Navigation (P1) — Week 2

**Required reading:** `docs/archive/uirefactor/04-NAVIGATION.md`

**Dependencies:** Phase 1 complete

### Task 2.1: Bottom Navigation Redesign
- **Priority:** P1
- **Modify:**
  - `components/mobile/mobile-tab-bar.tsx`
- **Spec:** 5 icons per `docs/archive/uirefactor/04-NAVIGATION.md`
- **Reference existing:**
  - `components/providers/drawer-context.tsx` (drawer API)
- **Acceptance:**
  - [ ] Home, Search, Sell (+), Chat, Profile
  - [ ] Sell button centered + elevated
  - [ ] Search opens drawer (not navigate)
  - [ ] Gates pass

### Task 2.2: Category Circle → Drawer
- **Priority:** P1
- **Modify:**
  - `components/mobile/category-nav/category-circles.tsx`
  - `app/[locale]/(main)/page.tsx` (landing page)
- **Reference existing:**
  - `components/mobile/drawers/category-browse-drawer.tsx`
  - `openCategory()` in `components/mobile/category-nav/category-drawer-context.tsx`
- **Acceptance:**
  - [ ] Circle tap opens drawer
  - [ ] Correct category pre-selected
  - [ ] Gates pass

### Task 2.3: Search Drawer Integration
- **Priority:** P1
- **Modify/Create:**
  - `components/mobile/drawers/search-drawer.tsx` (create if needed)
  - `components/mobile/mobile-tab-bar.tsx` (wire search tap)
- **Reference existing:**
  - `components/shared/search/search-ai-chat.tsx`
  - `components/shared/search/mobile-search-overlay.tsx`
- **Acceptance:**
  - [ ] Opens from bottom nav
  - [ ] AI search integrated
  - [ ] Recent searches display
  - [ ] Gates pass

---

## 🔥 PHASE 3: Business Dashboard (P1) — Week 3

**Required reading:** `docs/archive/uirefactor/05-BUSINESS-FEATURES.md`

**Dependencies:** Phase 1 complete

### Task 3.1: Analytics Overview
- **Priority:** P1
- **Create:**
  - `app/[locale]/(business)/dashboard/analytics/page.tsx`
  - `components/seller/analytics-overview.tsx`
- **Spec:** Daily aggregates only, NO viewer_id
- **Reference existing:**
  - `app/[locale]/(business)/dashboard/` (layout)
- **Acceptance:**
  - [ ] Views, favorites, messages charts
  - [ ] Free: 7-day | Premium: 90-day
  - [ ] Gates pass

### Task 3.2: CSV Export (Premium)
- **Priority:** P1
- **Create:**
  - `components/seller/analytics-export-button.tsx`
  - `app/api/analytics/export/route.ts`
- **Acceptance:**
  - [ ] Button visible to all
  - [ ] Premium users can download
  - [ ] Free users see upgrade modal
  - [ ] Gates pass

---

## 🔥 PHASE 4: Landing Page (P2) — Week 4

**Required reading:** `docs/archive/uirefactor/03-LANDING-PAGE.md`

**Dependencies:** Phase 2 complete

### Task 4.1: Seller Feed Toggle
- **Priority:** P2
- **Modify:**
  - `components/mobile/mobile-home.tsx`
  - `components/desktop/desktop-home.tsx`
  - `components/desktop/feed-toolbar.tsx`
- **Spec:** Grid DEFAULT, feed opt-in
- **Acceptance:**
  - [ ] Grid loads by default
  - [ ] Toggle to feed view
  - [ ] Preference persists (localStorage)
  - [ ] Gates pass

---

## 📊 EXECUTION ORDER

```
SEQUENTIAL (must complete in order):
Phase 1: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7

PARALLEL (after Phase 1):
├── Phase 2: 2.1 → (2.2 | 2.3)
└── Phase 3: 3.1 → 3.2

AFTER Phase 2:
Phase 4: 4.1
```

---

## 🤖 SUBAGENT ASSIGNMENT

For Codex CLI parallel execution:

| Subagent | Tasks | Start Condition |
|----------|-------|-----------------|
| `onboarding` | 1.1–1.7 | Immediate |
| `navigation` | 2.1–2.3 | After Task 1.7 |
| `dashboard` | 3.1–3.2 | After Task 1.7 |
| `landing` | 4.1 | After Task 2.1 |

---

## 📁 FILE REFERENCE

| Component | Path |
|-----------|------|
| Drawer Context | `components/providers/drawer-context.tsx` |
| Global Drawers | `app/[locale]/global-drawers.tsx` |
| Category Drawer | `components/mobile/drawers/category-browse-drawer.tsx` |
| Category Drawer Context | `components/mobile/category-nav/category-drawer-context.tsx` |
| AI Search | `components/shared/search/search-ai-chat.tsx` |
| Bottom Nav | `components/mobile/mobile-tab-bar.tsx` |
| Onboarding Provider | `app/[locale]/(main)/_providers/onboarding-provider.tsx` |
| Signup Form | `app/[locale]/(auth)/_components/sign-up-form.tsx` |
| Auth Actions | `app/[locale]/(auth)/_actions/auth.ts` |
| Category Drawer Context | `components/mobile/category-nav/category-drawer-context.tsx` |
| Dashboard | `app/[locale]/(business)/dashboard/` |
| Design Tokens | `app/globals.css` |
| Proxy | `proxy.ts` |

---

## ✅ SUCCESS CRITERIA

All phases complete when:
- [ ] All gates pass on all tasks
- [ ] New user flow: signup → onboarding → home
- [ ] Bottom nav: 5 destinations working
- [ ] Category circles open drawers
- [ ] Dashboard shows analytics
- [ ] No rails violations
