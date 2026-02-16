# PHASE 2 — Feature Alignment & Launch Finalization

> **Prerequisite:** Phase 1 cleanup sweep must be COMPLETE and committed first.  
> **Goal:** Ensure every shipped feature works end-to-end. Fix auth latency, state sync bugs, and frontend↔backend misalignments. Polish mobile-first UI. Ship-ready by end of session.  
> **Safety:** Do NOT modify DB schema, RLS policies, or payment webhook logic without human approval.

---

## 0. BEFORE YOU START

Read these files in order:
```
AGENTS.md              — Project rules (non-negotiable)
ARCHITECTURE.md        — System architecture + module map
REQUIREMENTS.md        — Feature checklist (103/119 done, 87%)
docs/DOMAINS.md        — Auth/DB/payments/API/routes/i18n contracts
docs/DESIGN.md         — UI/frontend design tokens + mobile-first rules
```

### What Was Already Built (87% complete)
- Auth (100%), Cart/Checkout (100%), Stripe Connect (100%), Messaging (100%), Reviews (100%), i18n (100%), Infrastructure (100%)
- Selling (88%), Discovery (86%), Product Pages (88%), Orders (83%), Business Dashboard (83%)
- Profiles (67%), Trust & Safety (67%), Admin (40%), Accessibility (60%)

### What This Phase Fixes
1. **Auth state sync bugs** (CRITICAL — blocks everything)
2. **Feature flow verification** (end-to-end for every major flow)
3. **Mobile UI polish** (mobile-first marketplace)
4. **Desktop layout fixes** (responsive breakpoints)

---

## 1. AUTH STATE SYNC — FIX FIRST (CRITICAL)

### Known Bugs
1. **Hamburger menu login → requires hard refresh** to see authenticated state
2. **Bottom tab bar auth drawer login → slow but eventually works**
3. **General auth latency is too high** after login

### Root Cause Analysis

The `AuthStateManager` (`components/providers/auth-state-manager.tsx`) has two session refresh paths:

1. **`onAuthStateChange` listener** — fires for client-side auth events (Supabase browser client)
2. **Route-change detection** — when navigating away from `/auth/*` routes, triggers `refreshWithThrottle(true)`

**Problem:** When login happens via a drawer (hamburger menu → auth drawer), there's no route change from `/auth/*` to non-auth. The user stays on the same page. The `onAuthStateChange` might not fire if the auth was performed server-side (server action sets cookies but browser client doesn't know).

### Fix Strategy

**A. Auth Drawer Login Callback:**
Find the auth drawer login handler. After successful login (server action returns success), it must explicitly call `refreshSession({ forceRetry: true })` to force the `AuthStateManager` to re-read cookies.

Check these files for the login flow:
- `components/mobile/drawers/auth-drawer.tsx` — mobile auth entry
- `components/auth/login-form-body.tsx` — the actual login form
- `app/[locale]/(auth)/_actions/` — server actions for login
- `app/[locale]/(auth)/_components/` — auth route components

**B. Reduce refresh latency:**
- The `forceRetry` path has a 180ms sleep before retry — reduce to 80ms or remove if not needed
- The 30s throttle window (`refreshWithThrottle`) should NOT block force-retry refreshes (verify this works correctly)
- After `setSession()` on the singleton client, the `onAuthStateChange` should fire immediately — verify this chain works

**C. Session sync after drawer-based auth:**
- When auth happens in a drawer (no route change), the route-change detection path never fires
- Add a mechanism where the login form body calls a callback prop on success, which the parent drawer uses to trigger `refreshSession`
- OR: have `login-form-body.tsx` directly import and call `useAuth().refreshSession({ forceRetry: true })` after successful login

**D. Verify the fix works in ALL auth entry points:**
1. `/auth/login` page (direct navigation)
2. Hamburger menu → auth drawer → login
3. Bottom tab bar → account → auth drawer → login
4. "Sell" CTA → redirects to auth → login → back
5. OAuth (Google) callback → `/auth/callback` → redirect

### Testing
```bash
# After fixing, run:
pnpm -s typecheck && pnpm -s lint
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## 2. FEATURE FLOW VERIFICATION

### Methodology
For each feature flow below, use a subagent to:
1. Trace the code path from UI trigger → server action/API → database → response → UI update
2. Identify any broken imports, missing handlers, or state sync gaps
3. Fix issues found
4. Verify with typecheck

### Priority Order (by launch criticality)

#### TIER 1 — Must work perfectly (launch blockers)

**Flow 2.1: Browse → Search → Filter → View Product**
```
Homepage → category click OR search → filter/sort → product card click → PDP
```
Files to trace:
- `app/[locale]/(main)/page.tsx` → homepage
- `app/[locale]/(main)/search/` → search results
- `app/[locale]/(main)/categories/` → category browsing
- `app/[locale]/[username]/[productSlug]/` → product detail page
- `components/shared/product/` → product cards
- `hooks/use-product-search.ts` → search logic
- `lib/data/` → data fetchers

**Flow 2.2: Add to Cart → Checkout → Payment**
```
PDP → Add to Cart → Cart page → Checkout → Stripe → Success
```
Files to trace:
- Cart context: `components/providers/cart-context.tsx`
- Cart page: `app/[locale]/(main)/cart/`
- Checkout: `app/[locale]/(checkout)/`
- Actions: `app/actions/payments.ts`
- Webhook: `app/api/checkout/webhook/route.ts`

**Flow 2.3: Sell Item**
```
Auth → /sell → listing wizard → image upload → publish
```
Files to trace:
- Sell route: `app/[locale]/(sell)/sell/`
- Actions: `app/actions/products.ts`
- Upload: `app/api/upload-image/`, `lib/upload/`
- Listing schema: `lib/sell/`

**Flow 2.4: Messaging**
```
PDP seller card → Start conversation → Chat → Send message → Real-time update
```
Files to trace:
- Chat route: `app/[locale]/(chat)/chat/`
- Chat actions: `app/[locale]/(chat)/_actions/`
- Order conversations: `lib/order-conversations.ts`

#### TIER 2 — Must work (important for trust)

**Flow 2.5: Orders (Buyer)**
```
Account → Orders → Order detail → Track → Confirm received
```

**Flow 2.6: Orders (Seller)**
```
Sell → Orders → Order detail → Mark shipped → Mark delivered
```

**Flow 2.7: Reviews**
```
Order completed → Leave review → View on PDP → View on profile → Helpful vote
```

**Flow 2.8: Profile**
```
Account → Edit profile → Save → View public profile
```

**Flow 2.9: Wishlist**
```
PDP → Add to wishlist → Wishlist page → Remove
```

#### TIER 3 — Should work (nice to have for launch)

**Flow 2.10: Stripe Connect onboarding**
**Flow 2.11: Business dashboard**
**Flow 2.12: Subscription plans**
**Flow 2.13: Boost listings**

---

## 3. MOBILE UI POLISH

### Priorities
This is a mobile-first marketplace. Mobile must be flawless.

**3.1 Mobile Tab Bar**
- Verify all 5 tabs work: Home, Categories, Sell, Messages, Account
- Auth-gated tabs should show auth drawer when tapped by guests
- Active state indicator is correct for current route
- Badge counts update (messages, cart)

**3.2 Mobile Drawers**  
- Auth drawer: login/signup works, state syncs immediately (see Section 1)
- Cart drawer: items display, quantities update, checkout navigates correctly  
- Account drawer: shows correct auth state, navigation works
- Category browse drawer: navigates to correct categories
- Product quick view drawer: shows product details, add to cart works

**3.3 Mobile Homepage**
- Discovery feed loads and scrolls smoothly
- Category chips/filters work
- City picker works (geo-based)
- Promoted listings display
- Pull-to-refresh if implemented

**3.4 Mobile Navigation**
- All breadcrumbs work
- Back navigation is correct (no broken history states)
- Deep links resolve correctly

**3.5 Touch Targets**
- All interactive elements ≥ 44px for primary actions, ≥ 32px minimum (per DESIGN.md)
- No overlapping touch targets

### Testing Mobile
```bash
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```
Also manually check responsive layout at 375px, 390px, 428px widths.

---

## 4. DESKTOP FIXES

Desktop is secondary but must not be broken.

**4.1 Layout**
- Header: logo, search bar, nav links, auth state, cart indicator
- Sidebar: category navigation, filters
- Footer: links, legal pages
- Product grid: responsive columns (2→3→4 based on viewport)

**4.2 Desktop-Specific Components**
- `components/desktop/` — verify these render correctly
- `app/[locale]/(main)/_components/desktop/` — desktop home, filters sidebar
- Product quick view dialog (vs mobile drawer)

---

## 5. SUBAGENT EXECUTION PLAN

### How to Execute

Use subagents. One per flow/section. In priority order:

```
SUBAGENT 1: Auth state sync fix (Section 1)
  → MUST complete before other subagents start
  → Verify: typecheck + lint + e2e smoke

SUBAGENT 2: Flow 2.1 — Browse/Search/Filter/View
SUBAGENT 3: Flow 2.2 — Cart/Checkout/Payment
SUBAGENT 4: Flow 2.3 — Sell Item
SUBAGENT 5: Flow 2.4 — Messaging
  → Run 2-5 sequentially after auth is fixed
  → Verify after each: typecheck

SUBAGENT 6: Flows 2.5-2.9 — Orders/Reviews/Profile/Wishlist
SUBAGENT 7: Section 3 — Mobile UI polish
SUBAGENT 8: Section 4 — Desktop fixes

FINAL: Full verification gate
  pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
  pnpm -s test:unit
  REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Subagent Prompt Template

```
CONTEXT: You are finalizing the Treido marketplace for production launch.
Read AGENTS.md and ARCHITECTURE.md for project rules.
Read docs/DOMAINS.md for the specific domain you're working on.

IMPORTANT: Another terminal previously ran a cleanup sweep (file renames, dead code deletion).
The codebase is now cleaner. Trust the current file structure — do not recreate deleted files.

TASK: Verify and fix [FLOW NAME] end-to-end.

STEPS:
1. Trace the complete code path from UI trigger to database to response to UI update.
2. Check each file in the path for:
   - Broken imports (especially after cleanup renames)
   - Missing error handling
   - Auth checks where needed (getUser() not getSession())
   - Correct Supabase client per context
   - Proper i18n usage (getTranslations/useTranslations)
   - Loading/error states
3. Fix any issues found.
4. Run: pnpm -s typecheck && pnpm -s lint
5. Report: what was broken, what was fixed, what works, what needs manual testing.

CONSTRAINTS:
- Do NOT modify DB schema or RLS policies
- Do NOT modify webhook signature verification logic  
- Do NOT change payment amounts or fee calculations
- Server Components by default, "use client" only when needed
- Semantic tokens only (no raw colors/hex)
```

---

## 6. KNOWN ISSUES LOG

Track issues discovered during verification:

```
ISSUE: <description>
SEVERITY: critical | high | medium | low
STATUS: fixed | needs-manual-test | wont-fix-v1
FILES: <affected files>
FIX: <what was done>
```

Write to `.codex/LAUNCH-ISSUES.md` as you go.

---

## 7. VERIFICATION GATES

### After Each Subagent
```bash
pnpm -s typecheck
pnpm -s lint
```

### After All Subagents Complete
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Final Manual Checks (Human)
- [ ] Sign up → verify email → complete onboarding
- [ ] Login from hamburger menu → see auth state immediately
- [ ] Login from bottom tab → see auth state immediately
- [ ] Browse → search → filter → view product
- [ ] Add to cart → checkout → pay (test mode)
- [ ] Create listing with images → publish → see on profile
- [ ] Message a seller → receive response
- [ ] Leave a review → see on product page
- [ ] Switch language (EN↔BG)
- [ ] Check on real mobile device (not just responsive mode)

---

## 8. CONSTRAINTS

- **NO DB schema changes** without human approval
- **NO RLS policy changes** without human approval  
- **NO payment logic changes** without human approval
- **NO new dependencies** (no `pnpm add`)
- **Mobile-first always** — test mobile before desktop
- **Semantic tokens only** — never raw hex/palette classes
- **Server Components by default** — `"use client"` only when truly needed
- **getUser() not getSession()** for security checks
- **Correct Supabase client** per context (server/static/route/admin/browser)

---

## 9. SUCCESS CRITERIA

Launch-ready means:
1. All TIER 1 flows work end-to-end without errors
2. Auth state syncs instantly after login from ANY entry point
3. Mobile UI has no layout breaks at 375px–428px
4. Desktop layout has no visual breaks at 1024px+
5. `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate` passes
6. `pnpm -s test:unit` passes  
7. `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` passes
8. No console errors in browser dev tools during feature flows
9. `.codex/LAUNCH-ISSUES.md` documents all findings
