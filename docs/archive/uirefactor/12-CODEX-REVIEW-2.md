# Codex MCP Review – Iteration #2

**Reviewed:** February 1, 2026  
**Reviewer:** Codex MCP  
**Status:** ✅ Most issues RESOLVED in iteration #3 fixes

---

## 🚨 Issues Found in Iteration #2

### 1. Route Paths Wrong in Architecture Doc

**Issue:** Doc says `/[locale]/p/[slug]` and `/[locale]/seller/[username]`  
**Reality:** Repo uses `/[username]` and `/[username]/[productSlug]`

**Files to fix:**
- `uirefactor/10-ARCHITECTURE.md:60`
- `uirefactor/09-FEATURES.md:17`

---

### 2. Dashboard Already Exists

**Issue:** Docs say "Dashboard not built"  
**Reality:** Dashboard exists at `app/[locale]/(business)/dashboard/page.tsx`

**Files to fix:**
- `uirefactor/09-FEATURES.md:137`

---

### 3. Landing Page Doc Contradicts Decision

**Issue:** `03-LANDING-PAGE.md` still makes feed default for new users  
**Decision:** Grid is default (per `08-DECISIONS.md`)

**Files to fix:**
- `uirefactor/03-LANDING-PAGE.md:209`

---

### 4. Navigation Doc Still Claims Same Tap Count

**Issue:** Doc says "Tap count same" for drawer vs pills  
**Reality:** Drawer adds at least one tap for subcategories

**Files to fix:**
- `uirefactor/04-NAVIGATION.md:194`

---

### 5. Analytics Raw vs Aggregated Conflict

**Issue:** Business features doc proposes raw `product_views` table with `viewer_id`  
**Decision:** Should use daily aggregates, no `viewer_id` (PII concern)

**Also:** Repo currently has NO real views tracking (approximates views)

**Files to fix:**
- `uirefactor/05-BUSINESS-FEATURES.md:315`

---

### 6. Username Policy Reality Check

**Issue:** Doc says "1 free change, premium unlimited"  
**Reality:** Repo has 14-day cooldown logic (`app/actions/username.ts:121`)

**Decision needed:** Align doc with existing logic or change logic?

---

### 7. Business → Personal Downgrade

**Issue:** Doc says "Business → Personal requires support"  
**Reality:** Self-serve downgrade action exists (`app/actions/username.ts:432`)

**Decision needed:** Keep self-serve or require support?

---

### 8. Gradients/Animations Still in Docs

**Issue:** Rails forbid gradients + new animations  
**Found in:**
- `uirefactor/01-MASTER-PLAN.md:127`
- `uirefactor/02-ONBOARDING-FLOW.md:330`
- `uirefactor/06-COMPONENTS.md:162`

---

### 9. DrawerManager Still Proposed

**Issue:** Still proposes new drawer system  
**Reality:** Existing drawer system:
- `components/providers/drawer-context.tsx`
- `app/[locale]/global-drawers.tsx`

**Files to fix:**
- `uirefactor/06-COMPONENTS.md:37`

---

### 10. Folder Structure Ignores Conventions

**Issue:** Proposes `components/onboarding/*`, `components/drawers/*`  
**Convention:** Route-private components under `app/[locale]/(group)/_components/*`

---

### 11. Onboarding Provider Gating Blocker

**Issue:** Provider opens modal only when `profile.username` exists  
**Location:** `app/[locale]/(main)/_providers/onboarding-provider.tsx:124`

**But:** We want username selection IN onboarding, not before

**Fix needed:** Update provider gating logic

---

### 12. Account Type Changes Need Privileged Path

**Issue:** Users can't update `account_type` directly (restricted)  
**Location:** `supabase/migrations/20260125090000_profiles_revoke_sensitive_updates.sql:9`

**Solution:** Reuse admin-backed upgrade action (`app/actions/username.ts:352`)

---

## ✅ What's Correct

- `proxy.ts` usage (correct, it's project convention)
- Onboarding triggered via `?onboarding=true` (correct)
- Client-side modal approach (correct)
- NOT middleware redirect (correct)

---

## 📝 Action Items (Updated)

| Priority | Issue | Action | Status |
|----------|-------|--------|--------|
| P0 | Route paths | Fix in ARCHITECTURE + FEATURES docs | ✅ Done |
| P0 | Dashboard exists | Update FEATURES doc | ✅ Done |
| P0 | Feed default conflict | Fix LANDING-PAGE doc | ✅ Done |
| P0 | Onboarding provider gating | Document fix needed in provider | ⚠️ Noted |
| P1 | Tap count claim | Fix in NAVIGATION doc | ✅ Done |
| P1 | Analytics raw vs aggregate | Fix in BUSINESS-FEATURES doc | ✅ Done |
| P1 | Gradients/animations | Remove from all docs | ✅ Done |
| P1 | DrawerManager | Remove from COMPONENTS doc | ✅ Done |
| P2 | Username policy | Decision: 1 change + premium | ✅ Decided |
| P2 | Business downgrade | Decision: Require support | ✅ Decided |
| P2 | Folder structure | Update COMPONENTS doc conventions | ✅ Done |

---

## ❓ Decisions Made

1. **Username changes:** ✅ "1 free change, premium unlimited" - Will update code to match

2. **Business → Personal:** ✅ Require support ticket - Will disable self-serve action

3. **Views tracking:** ✅ Build real tracking with daily aggregates (no PII)
