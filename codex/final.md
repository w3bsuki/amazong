# 🔥 FINAL AUDIT — The Brutal Truth (2026-01-17)

*Consolidated from 4 audit documents. No sugarcoating. Only justified findings.*

---

## TL;DR — The Embarrassing Reality

This codebase is a **half-shipped refactor sitting on a foundation of spaghetti** that someone keeps adding parmesan to. You have:

- **3 ways to format a price** (pick one, delete the rest)
- **2 mobile home shells** (can't decide which one you like better)
- **Parallel desktop feeds** you're too scared to delete
- **Hardcoded URLs everywhere** that will blow up staging
- **Supabase triggers that double-decrement stock** (bye-bye inventory accuracy)
- **526 lint warnings you've just... accepted** (the "eh, it's fine" approach)

---

## 🚨 CRITICAL — Will Cause Production Incidents

### 1. Supabase Stock Decrement Runs TWICE

**The Crime:** Two triggers fire on `order_items` insert. Customer buys 1 item, stock drops by 2.

**Evidence:** [supabase/migrations/20260102130000_variant_id_cart_order_items.sql](supabase/migrations/20260102130000_variant_id_cart_order_items.sql)

**Why This Matters:** Every single order corrupts your inventory. This isn't a "nice to fix" — this is "your business data is wrong."

**Fix:** Delete one trigger. Test checkout. Ship it. Stop overthinking.

---

### 2. Avatars Bucket Doesn't Exist in Production

**The Crime:** App happily uploads to `avatars` bucket. Remote DB only has `product-images`. Uploads silently fail.

**Evidence:** [supabase/migrations/20251215000000_avatars_storage.sql](supabase/migrations/20251215000000_avatars_storage.sql) exists locally but never applied to prod.

**Why This Matters:** Every user trying to set a profile picture gets a broken experience. You've been shipping this for how long?

**Fix:** Run the migration on production. Takes 30 seconds.

---

### 3. Category Detail Pages Are Broken

**The Crime:** Duplicate footer, empty content area. Users land on a blank page.

**Evidence:** [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md)

**Why This Matters:** This is a core navigation flow. Broken = lost sales.

**Fix:** Audit the route layout composition. Someone nested a wrapper twice.

---

### 4. Gift Cards Page is Empty

**The Crime:** Route exists. Content doesn't. Just a header and footer staring at each other.

**Evidence:** Same as above.

**Why This Matters:** Either build it or hide it. A blank page screams "we don't know what we're doing."

---

## 🔴 HIGH — Architecture Rot That Will Bite You

### 5. Components Import Server Actions Directly

**The Crime:** `components/` folder imports from `app/actions/*`. This couples UI to routing layer.

**Files Guilty:**
- [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx)
- [components/seller/seller-rate-buyer-actions.tsx](components/seller/seller-rate-buyer-actions.tsx)
- [components/pricing/plans-modal.tsx](components/pricing/plans-modal.tsx)
- [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx)
- [components/buyer/buyer-order-actions.tsx](components/buyer/buyer-order-actions.tsx)
- [components/auth/post-signup-onboarding-modal.tsx](components/auth/post-signup-onboarding-modal.tsx)

**Why This Matters:** You can't reuse these components outside this app. You can't test them in isolation. Every refactor touches more files than it should.

**Fix:** Actions go in route layer. Pass handlers as props. This is basic dependency inversion.

---

### 6. `lib/` Contains React Rendering

**The Crime:** [lib/category-icons.tsx](lib/category-icons.tsx) returns JSX elements.

**Why This Matters:** `lib/` is supposed to be pure utilities. No React. No app imports. You've blurred the line so badly that nothing means anything anymore.

**Fix:** Move to `components/`. Keep `lib/` pure.

---

### 7. Price Formatting is a Disaster

**The Crime:** Three different implementations:
1. [lib/format-price.ts](lib/format-price.ts) — one way
2. [lib/currency.ts](lib/currency.ts) — different way
3. Inline formatters in [components/mobile/product/mobile-price-block.tsx](components/mobile/product/mobile-price-block.tsx) and [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx)

**Why This Matters:** Prices display differently across your app. €10.00 here, EUR 10 there. Great for confusing customers.

**Fix:** Pick one. Kill the others. Grep and replace. This is a 30-minute task you've avoided for months.

---

### 8. Two Mobile Home Shells

**The Crime:** `MobileHomeTabs` and `MobileHomeUnified` both exist. Both are used. Neither is deprecated.

**Evidence:** [components/mobile/mobile-home-tabs.tsx](components/mobile/mobile-home-tabs.tsx), [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx)

**Why This Matters:** Feature A gets added to one shell. Feature B to the other. Now you have two diverging mobile experiences. Pick one.

---

### 9. Mobile vs Desktop Product Pages Are Completely Separate

**The Crime:** [components/mobile/product/mobile-product-page.tsx](components/mobile/product/mobile-product-page.tsx) and [components/shared/product/product-page-layout.tsx](components/shared/product/product-page-layout.tsx) are parallel implementations.

**Why This Matters:** Bug fix on mobile? Don't forget desktop. New field on product? Change both. This doubles your maintenance forever.

**Fix:** Responsive design exists for a reason. Share the logic, branch the layout.

---

### 10. Layout-Level User Queries Make Everything Dynamic

**The Crime:** [app/[locale]/(main)/layout.tsx](app/[locale]/(main)/layout.tsx) calls `createClient()` and queries the DB for every page render.

**Why This Matters:** No static generation. No caching benefits. Every request hits your DB. Your hosting bill thanks you.

**Fix:** Move user-specific queries to route level or client boundary. Let layouts be static.

---

## 🟠 MEDIUM — Tech Debt Compounding Daily

### 11. Hardcoded URLs Everywhere

**The Crime:**
- `https://treido.eu` hardcoded in [lib/url-utils.ts](lib/url-utils.ts)
- `localhost:3000` fallbacks in [lib/stripe-locale.ts](lib/stripe-locale.ts)
- [app/[locale]/(checkout)/_actions/checkout.ts](app/%5Blocale%5D/(checkout)/_actions/checkout.ts)
- [app/actions/subscriptions.ts](app/actions/subscriptions.ts)

**Why This Matters:** Staging? QA? Feature branches with preview URLs? They all break or point to production. This is how you accidentally charge test cards in prod.

**Fix:** Required env vars. Fail fast if missing. No fallbacks.

---

### 12. i18n is Fake

**The Crime:** Hardcoded English strings everywhere:
- [components/support/support-chat-widget.tsx](components/support/support-chat-widget.tsx)
- [components/shared/product/seller-products-grid.tsx](components/shared/product/seller-products-grid.tsx)
- [components/shared/product/seller-banner.tsx](components/shared/product/seller-banner.tsx)
- [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx)
- Error pages: [app/global-error.tsx](app/global-error.tsx), [app/global-not-found.tsx](app/global-not-found.tsx)

**Why This Matters:** Bulgarian users see random English. Your i18n setup exists but nobody uses it consistently.

**Fix:** Grep for quoted user-facing strings. Move to message files. This is tedious but necessary.

---

### 13. Demo Routes Live in Production

**The Crime:** [app/[locale]/(main)/demo/desktop/page.tsx](app/%5Blocale%5D/(main)/demo/desktop/page.tsx) and demo mobile routes ship with production.

**Why This Matters:** Demo = mock data, test scenarios, possibly broken states. Production users can stumble into these. Professional.

**Fix:** Feature flag. Separate deploy. Or just delete them.

---

### 14. 526 Lint Warnings Accepted as Normal

**The Crime:** You've normalized ignoring warnings. "It still builds" is your quality bar.

**Evidence:** [TODO.md](TODO.md) explicitly mentions accepted warning count.

**Why This Matters:** New warnings hide in the noise. Actual problems get missed. Technical debt becomes invisible.

**Fix:** Fix warnings or disable rules intentionally. Zero-warning policy or nothing.

---

### 15. Legacy Backup Files in `app/`

**The Crime:** [app/globals.css.backup](app/globals.css.backup), [app/globals.css.old](app/globals.css.old), [temp_log_entry.md](temp_log_entry.md), [temp_search_overlay.txt](temp_search_overlay.txt)

**Why This Matters:** Noise. Confusion. "Which one is real?" Git exists for history.

**Fix:** `rm`. That's it.

---

### 16. Console Logging Ships to Users

**The Crime:** `console.error` and `console.log` in production hooks:
- [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts)
- [hooks/use-category-counts.ts](hooks/use-category-counts.ts)
- [hooks/use-badges.ts](hooks/use-badges.ts)

**Why This Matters:** Users see your debug logs in DevTools. Looks amateur. Potential PII leak.

**Fix:** Structured logging or silent fail in production.

---

## 🟡 LOW — Annoying But Survivable

### 17. Arbitrary Tailwind Values in UI Primitives

**The Crime:** `ring-[3px]`, `border-[1.5px]`, `text-[10px]`, `active:scale-95` scattered across:
- [components/ui/input.tsx](components/ui/input.tsx), [components/ui/textarea.tsx](components/ui/textarea.tsx), [components/ui/radio-group.tsx](components/ui/radio-group.tsx)
- [components/shared/product/freshness-indicator.tsx](components/shared/product/freshness-indicator.tsx)
- [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx)

**Why This Matters:** Your design system is lying. Tokens exist, nobody uses them. Consistency is random.

---

### 18. Duplicate Category Images

**Evidence:** [duplicate-hashes.txt](duplicate-hashes.txt) — 5 images with identical hashes.

**Why This Matters:** Wasted bytes. Slower loads. Sloppy.

---

### 19. Placeholder Social Links (#)

**Evidence:** Footer has social icons linking to `#`.

**Why This Matters:** Clicking does nothing. Users notice.

---

### 20. Mobile Nav Shows on Desktop

**Evidence:** [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md)

**Why This Matters:** Bad responsive gating. Extra DOM. Confusing.

---

## 💀 SUPABASE SPECIFIC ROAST

### 21. `validate_username` Defined THREE Times

**The Crime:** Three migrations, three different implementations:
- [supabase/migrations/20251215200000_unified_profile_system.sql](supabase/migrations/20251215200000_unified_profile_system.sql)
- [supabase/migrations/20251218000000_security_performance_audit_fixes.sql](supabase/migrations/20251218000000_security_performance_audit_fixes.sql)
- [supabase/migrations/20251219000000_phase12_security_performance_audit.sql](supabase/migrations/20251219000000_phase12_security_performance_audit.sql)

**Why This Matters:** Which one is the truth? Last one wins? Migration order matters? This is a time bomb.

---

### 22. Leaked Password Protection DISABLED

**The Crime:** Supabase Auth has a feature to check if passwords were in breaches. You turned it off.

**Why This Matters:** Users can sign up with `password123` from 47 breaches. Security theater.

---

### 23. Public RLS on Stats Tables

**The Crime:** `buyer_stats`, `seller_stats`, `store_followers` have `USING (true)` — fully public.

**Why This Matters:** Anyone can query everyone's stats. Maybe intentional. Probably not reviewed.

---

### 24. Cron Job Every 5 Minutes

**The Crime:** `cleanup_expired_boosts()` runs every 5 minutes, doing full table scans.

**Why This Matters:** Works fine with 100 products. Try 100,000.

---

### 25. Hardcoded `'admin'` Role String

**Evidence:** RLS policies and functions check `role = 'admin'` as a literal string.

**Why This Matters:** Rename your role? Every policy breaks. Zero type safety.

---

## 📊 BY THE NUMBERS

| Metric | Count | Verdict |
|--------|-------|---------|
| Critical production bugs | 4 | 🔥 Ship is on fire |
| Architecture violations | 6 | 🏚️ Foundation cracking |
| Duplicate implementations | 5 | 📋 Copy-paste engineering |
| Hardcoded values | 8+ | 💣 Waiting to explode |
| i18n bypasses | 10+ | 🇬🇧 English-only surprise |
| Accepted lint warnings | 526 | 🙈 See no evil |
| Supabase function drift | 3 | 🎲 Roll the dice |
| Backup/temp files | 4 | 🗑️ Digital hoarding |

---

## THE FIX PRIORITY (If You Actually Care)

### This Week (P0)
1. Fix double stock decrement trigger — **30 minutes**
2. Apply avatars bucket migration to prod — **5 minutes**
3. Fix category detail page layout — **1 hour**
4. Enable leaked password protection — **2 minutes**

### This Sprint (P1)
5. Remove localhost fallbacks in payment URLs — **30 minutes**
6. Pick one mobile home shell, delete the other — **2 hours**
7. Unify price formatting to one function — **1 hour**
8. Fix Gift Cards page or hide route — **30 minutes**

### This Month (P2)
9. Move server actions out of components layer — **4 hours**
10. Move category-icons to components — **30 minutes**
11. Migrate hardcoded strings to i18n — **4 hours**
12. Delete backup files — **2 minutes**
13. Fix Supabase `validate_username` drift — **1 hour**

### Eventually (P3)
14. Unify mobile/desktop product page logic
15. Reduce lint warnings to zero
16. Deduplicate category images
17. Review all public RLS policies

---

## VERDICT

You're building on quicksand while adding floors. The foundation has cracks. Some rooms are duplicated. The plumbing runs twice in places.

**Stop adding features. Fix the foundation. Then build.**

This codebase could ship to production, but it will hurt. Every bug fix will touch 3 files instead of 1. Every new feature will add to the mess. You'll wonder why everything takes so long.

The good news: Most of these fixes are small. The bad news: There are a lot of them.

**Pick P0. Ship it. Pick the next one. Repeat.**

---

*Generated from: codebase-audit-2026-01-17.md, codebase-audit-2026-01-17-deep.md, production-audit-2026-01-17.md, supabase-audit-2026-01-17.md*
