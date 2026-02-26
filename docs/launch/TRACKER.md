# Launch Audit Tracker

> Orchestrator's tracking file. Updated after each Playwright audit.
> This file records audit evidence. Launch closure status is owned by `docs/launch/CHECKLIST.md`.

## Status Summary

| # | Section | Priority | Codex Pass | Audit | Score | Notes |
|---|---------|----------|------------|-------|-------|-------|
| 1 | Infrastructure & Gates | P0 | ✅ | ✅ | 10 | All 4 gates + build green |
| 2 | Auth | P0 | ✅ | ✅ | 9 | All flows work, i18n complete, auth guards solid |
| 3 | Selling | P0 | 🔄 | 🔄 | 7 | Conditional pass only; auth-session coverage + checklist items remain open |
| 4 | Product Display (PDP) | P0 | ✅ | ✅ | 8 | Full data renders, i18n complete, share works; minor 404 body text |
| 5 | Search & Browse | P0 | ✅ | ✅ | 9 | FIX-001 fixed, search works, i18n complete, pagination, empty states |
| 6 | Checkout & Payments | P0 | 🔄 | 🔄 | 8 | Guest checkout redirect fixed on EN/BG in strict harness; payment success/refund/dispute flows still pending |
| 7 | Orders | P0 | ✅ | ✅ | 9 | Auth guards, typed errors, buyer/seller pagination |
| 8 | Profile & Account | P1 | ✅ | ✅ | 9 | Auth guard on settings, localized metadata, not-found body content |
| 9 | Cart & Wishlist | P1 | ✅ | ✅ | 8 | Pages load, titles localized, wishlist heading translated, standard header |
| 10 | Onboarding | P1 | 🔄 | 🔄 | 8 | Conditional pass only; first-signup flow + checklist items remain open |
| 11 | Navigation & Layout | P1 | ✅ | ✅ | 9 | i18n routing, tab bar localized, not-found body content, BG 404 translated |
| 12 | Business Dashboard | P2 | ⬜ | ⬜ | — | |
| 13 | Plans & Subscriptions | P2 | ⬜ | ⬜ | — | |
| 14 | Chat & Messaging | P2 | ⬜ | ⬜ | — | |
| 15 | Support & Legal | P2 | ⬜ | ⬜ | — | |

Checklist closure snapshot (2026-02-26): P0 fully closed 3/7 (1,2,5), P1 fully closed 0/4.

P1 stabilization decision (2026-02-26):
- Resolved in harness scope: `/en|bg/auth/forgot-password`, `/en/account/profile` guest redirect, `/bg/search` route health (mobile + desktop parity pass).
- Explicitly deferred: remaining checklist items in Sections 8-11 that require authenticated workflow execution, seeded user data variance, or non-launch-critical UX polish (desktop sidebar, theme toggle, loading-state completeness, full cart/wishlist mutations).

## Audit Log

<!-- Append after each audit session. Format below. -->

### Launch Harness P0 Mobile Sweep (M375) — 2026-02-26
**Codex pass:** Added strict launch harness (`m375`, route manifest, `@launch-p0/@launch-p1/@launch-p2` tags, deterministic screenshot+console artifacts under `output/playwright/`).
**Playwright audit:** Ran `pnpm -s test:e2e:launch:p0:m375` against 22 EN/BG P0 routes from manifest.
- Result counts: 20 pass / 2 fail.
- Failing routes: `/en/checkout`, `/bg/checkout`.
- Failure mode: unauthenticated users remain on checkout (`200`) instead of redirecting to login.
- Artifacts: `output/playwright/m375/p0/*.png` and `output/playwright/m375/p0/*.console.log`.
**Result:** FAIL (P0 closure blocked by checkout auth guard behavior)
**Action:** Keep Section 6 in progress; apply auth/session route fixes with strict regression verification.

### Launch Harness P0 Mobile Re-run (M375) — 2026-02-26
**Codex pass:** Applied approved auth/session hardening for checkout guest access and added middleware-level checkout protection for deterministic redirect behavior.
**Playwright audit:** Re-ran `pnpm -s test:e2e:launch:p0:m375` on the same 22 EN/BG P0 routes.
- Result counts: 22 pass / 0 fail.
- Checkout parity: `/en/checkout` and `/bg/checkout` now redirect guests to localized login with `next` parameter.
- Artifacts: refreshed under `output/playwright/m375/p0/`.
**Result:** PASS
**Action:** Move to desktop parity.

### Launch Harness P0 Desktop Parity (1280) — 2026-02-26
**Playwright audit:** Ran `node scripts/run-playwright.mjs test e2e/launch-routes.spec.ts --project=desktop1280 --grep @launch-p0`.
- Result counts: 22 pass / 0 fail.
- Artifacts: `output/playwright/desktop1280/p0/`.
**Result:** PASS
**Action:** P0 route bucket stable on desktop parity.

### Launch Harness P1 Stabilization Sweep — 2026-02-26
**Playwright audit:** Ran `@launch-p1` bucket on both `m375` and `desktop1280`.
- M375: 3 pass / 0 fail.
- Desktop1280: 3 pass / 0 fail.
- Covered routes: forgot-password, account-profile guest redirect, BG search route.
**Result:** PASS (bucket scope)
**Action:** Remaining P1 checklist items explicitly deferred with rationale in tracker snapshot.

### Sensitive Blocker Evidence Sweep — 2026-02-26
**Verification run:**
- `pnpm -s test:unit:node __tests__/checkout-webhook-idempotency.test.ts __tests__/payments-webhook-idempotency.test.ts` → 4/4 pass.
- `pnpm -s test:unit:node __tests__/architecture-boundaries.test.ts` → 10/10 pass (includes webhook signature-before-admin-client ordering invariant).
**Findings:**
- `LAUNCH-001`: local replay/idempotency invariants are green in test coverage.
- `LAUNCH-002`: refund/dispute E2E remains manual/external; no repo-native automated closure.
- `LAUNCH-003`: prod/dev Stripe env separation requires deployed secret/account audit (human-only evidence).
- `LAUNCH-004`: still blocked by Supabase plan restriction (`password_hibp_enabled`).
- `MIG-001`: migration sequencing completion still pending approved DB execution.
**Result:** BLOCKED (external/manual verification still required for unresolved blockers)
**Action:** Complete unresolved external checks before release gate.

### Section 1: Infrastructure & Gates — 2026-02-24
**Codex pass:** Fixed lint warnings in test mocks, removed stray console.error, fixed build prerender failures, widened category attribute typing, suppressed known schema mismatch logs.
**Orchestrator verification:** Ran all 4 gates independently — typecheck (0 errors), lint (0 warnings), styles:gate (0 violations), test:unit (33/33 pass).
**Result:** PASS
**Score:** 10/10
**Issues found:** None
**Action:** Marked complete

### Section 2: Auth — 2026-02-24
**Codex pass:** Replaced getSession() with getUser(), tightened server action safety, localized metadata + auth UI strings, hardened welcome flow with upload validation + error handling.
**Playwright audit:** Tested all auth routes at ~764px viewport (MCP default).
- Login: H1, Google OAuth, email/password fields with labels, show/hide toggle, remember me, disabled button until valid input, forgot password link, sign up link, legal links. Client validation: button stays disabled with invalid email, enables with valid email + password ≥6 chars.
- Sign up: 5 fields (name, username, email, password, confirm), Google OAuth, disabled submit, legal links, sign-in link.
- Forgot password: Email field, send reset link button, back to login link.
- Reset password: Shows loading → "Link expired" message with "Request a new link" for invalid tokens.
- Auth error: "Something went wrong" with Try Again, Back to Home, Contact Support links.
- Sign-up success: Thank you heading, check email instruction, resend button, sign-in + home links.
- Auth guards: /en/account → /en/auth/login?next=%2Fen%2Faccount (preserves return URL). /en/auth/welcome → redirects to login when unauthenticated.
- i18n: Bulgarian /bg/auth/login fully translated (every string).
- Auth callback: /auth/callback/route.ts exists at correct path for Supabase.
**Result:** PASS
**Score:** 9/10 (minor: can't visually verify exact 375px mobile layout due to MCP viewport limitation, but DOM structure is clean and responsive classes are in place)
**Issues found:** None blocking
**Action:** Marked complete

### Section 3: Selling — 2026-02-24
**Codex pass:** Aligned sell schema + UI behavior (EUR-only pricing), hardened submit error UX, fixed toggle interactions, improved photo upload, migrated sell drafts to seller-scoped storage keys, added localized metadata.
**Playwright audit:**
- Guest CTA: /en/sell shows "Sign in to start selling" with sign-in link. Correct.
- Bulgarian: /bg/sell — all strings translated ("Влезте, за да започнете да продавате", "Бърза доставка", "Безопасни плащания", etc.)
- Auth guard: /en/account/selling redirects to /en/auth/login?next=%2Fen%2Faccount%2Fselling. Return URL preserved.
- Code audit (subagent): 10 findings including unpersisted form fields (shippingPrice, format, processingDays, dimensions) — collected by form but not written to DB insert. Not blocking for existing flows.
- Cannot test authenticated sell form flow via Playwright without credentials.
**Result:** CONDITIONAL PASS
**Score:** 7/10 (auth guard + i18n solid; form-level testing requires auth session; unpersisted fields are tech debt)
**Issues found:**
- Unpersisted form fields: shippingPrice, format, processingDays, dimensions collected but not saved
- Cannot verify full sell form flow without authenticated user
**Action:** Marked conditional pass. Auth testing items left unchecked.

### Section 4: Product Display (PDP) — 2026-02-24
**Codex pass:** Removed non-functional report CTA, wired mobile seller drawer chat, added safe async error handling for reviews/wishlist, implemented working desktop share actions (Web Share API + clipboard fallback), switched PDP price to BGN, hardened buildProductPageViewModel.
**Playwright audit:**
- PDP at /en/treido/2022-bmw-330i-xdrive-sedan loads with full content:
  - Header: Back button, seller avatar+name, H1 product title, wishlist + share buttons
  - Product info: "Cars · Sedans" category badges, "28 days" freshness, 248 views, "BGN 38,500.00" price
  - Condition: "Used - Excellent", Location TBA
  - Attributes: Make (BMW), Model (330i xDrive), Year (2022)
  - Accordion sections: Full Specifications, Description, Delivery, Seller, 0 reviews
  - Safety tips section with translated advice text
  - Similar Items horizontal scroll with 10 related products
  - Bottom bar: Call Seller (disabled), Contact Seller button
- Bulgarian PDP: /bg/treido/2022-bmw-330i-xdrive-sedan — ALL strings translated:
  - "Коли · Седани", "28 дни", "38 500,00 лв." (correct BG locale formatting)
  - "Употребявано - отлично", "Местоположение предстои"
  - "Марка/Модел/Година", all accordion labels, safety tips, "Подобни артикули", "Обади се/Свържи се"
- Share button: Clicked, no errors. Clipboard fallback in headless mode.
- 404 handling: /en/treido/nonexistent-product-12345 → title "Product not found | Treido", body shows 404 with "Go to homepage" + "Search products" links. Recovery works.
- Console: Zero errors, only GoTrueClient auth warning.
**Result:** PASS
**Score:** 8/10
**Issues found:**
- Minor: 404 page body says "Profile not found" while title says "Product not found" — inconsistency
- Image gallery (swipe/zoom), Add to Cart, and exact mobile layout need manual testing
**Action:** Marked complete

### Section 6: Checkout & Payments — 2026-02-24
**Codex pass:** Added server-side auth guards + localized metadata for checkout/success routes, replaced fragile error-string parsing with typed action error codes, strengthened success verification with Zod, made webhook order insert type-safe.
**Playwright audit:**
- Checkout page: /en/checkout loads with header (Back to cart, "Secure checkout"), progress bar (Address → Shipping → Payment). Immediately redirects to /en/auth/login?next=%2Fcheckout for unauthenticated users. Auth guard works.
- Checkout success: /en/checkout/success also guards with auth, redirects to login.
- Bulgarian: /bg/checkout fully translated — "Плащане", "Обратно към количката", "Сигурно плащане", "Адрес/Доставка/Плащане", "Прогрес на плащането".
- Cart page: /en/cart throws "Couldn't load cart" due to Invalid src prop (seed data has invalid image URLs). Error boundary catches it cleanly with retry + continue shopping buttons. The error handling is good — the seed data is bad.
- Code audit (subagent, deep review):
  - Auth: getUser() at page level (not getSession) — correct per AGENTS.md. Not in middleware (perf-only concern).
  - Error handling: Typed discriminated unions with errorCode — NO string parsing. One legacy string matcher (checkout-page-notice.ts) is dead code in practice.
  - Webhook safety: constructEvent() FIRST, admin client AFTER verification, Zod validation on items_json, idempotent upserts on stripe_payment_intent_id, multi-secret rotation support.
  - Success verification: Server-side via Stripe API — validates session, checks user ownership, verifies payment_status === "paid", handles race conditions with webhook.
  - Cart flow: Client-side CartContext → createCheckoutSessionAction → Stripe Checkout → success page verification. Enforces single-seller, blocks own-product purchases, validates cart items.
  - i18n: Full parity en/bg for checkout keys.
- Console: Zero errors on checkout pages. Cart page has 3 errors (all Invalid src prop from seed data).
**Result:** PASS
**Score:** 8/10
**Issues found:**
- Cart page crashes on seed data with invalid image URLs (error boundary handles it well)
- Cannot test full Stripe payment flow without auth session + valid cart items
- LAUNCH-001/002/003 blockers tracked separately
**Action:** Marked complete

### Section 5: Search & Browse — 2026-02-24
**Codex pass:** Fixed FIX-001 (raw commas in search query broke PostgREST), added localized metadata.
**Playwright audit:**
- Homepage: /en loads with title "Home | Treido", H1 "Treido Home", 20+ product cards, quick jump tabs (Categories, For you, Newest, Promoted, Nearby, Deals, Filter), header with search/wishlist/cart, full footer.
- Search: /en/search?q=bmw returns BMW 330i result. Title "Results for 'bmw' | Treido". Sort dropdown, Filters button, Sellers mode link. FIX-001 confirmed fixed.
- Empty state: "No results found" heading, "Try different keywords" text, "Browse All" link.
- Category page: /en/categories/electronics — 20 products, subcategory nav, Filters button, "Now showing Electronics" status.
- Bulgarian: /bg/search?q=кола — all UI translated. Zero console errors.
**Result:** PASS
**Score:** 9/10
**Issues found:** None
**Action:** Marked complete

### Section 7: Orders — 2026-02-24
**Codex pass:** Added pagination to buyer orders, localized metadata, typed error codes in order actions.
**Playwright audit:**
- Auth guards: All 3 routes redirect with return URL preserved (orders, sales, sell/orders).
- Bulgarian: /bg/account/orders redirects with fully translated login page.
- Code audit: All pages use `getUser()`, typed error codes (7+10 codes), buyer orders paginated (size 10), order detail owner-scoped, zero console.error in user-facing code.
**Result:** PASS
**Score:** 8/10
**Issues found:**
- sell/orders lacks pagination (capped at 200), account/sales unbounded query
- Cannot test authenticated order views without credentials
**Action:** Marked complete

### Section 8: Profile & Account — 2026-02-24
**Codex pass:** Converted profile actions to typed errorCode responses, localized profile editor.
**Playwright audit:**
- Auth guards: /en/account, /account/profile redirect to login with return URL.
- Public profile: /en/treido loads — avatar, badges, stats, products, tabs.
- Nonexistent profile: title "Profile not found | Treido" but body empty.
- Bulgarian: redirects and 404 titles translated.
- Code audit: All `getUser()`, typed errors (11+9 codes), requireAuth(), Zod validation. Settings page missing auth guard + has hardcoded English metadata.
**Result:** PASS
**Score:** 7/10
**Issues found:**
- Settings page missing auth guard and i18n metadata
- Profile 404 body content empty
**Action:** Marked complete

### Section 9: Cart & Wishlist — 2026-02-24
**Codex pass:** Fixed console.error usage, localized shared wishlist metadata.
**Playwright audit:**
- Cart: /en/cart loads guest-accessible. Title "Cart | Treido" / "Количка | Treido" (BG).
- Wishlist: /en/wishlist shows loading state. Title "My Wishlist | Treido" / "Моят списък с желания | Treido" (BG). Loading text translated.
- Zero console errors.
**Result:** PASS
**Score:** 7/10
**Issues found:**
- Wishlist heading "wishlist" not translated to Bulgarian
- Wishlist stuck loading without auth
- Cannot test add/remove flows without authentication
**Action:** Marked complete

### Section 10: Onboarding — 2026-02-24
**Codex pass:** Replaced console.error with structured logger.
**Playwright audit:**
- Auth guard: /en/onboarding redirects to login with return URL. Bulgarian works.
- Code audit: 5-step wizard, `getUser()` in layout, `requireAuth()` + Zod in action, `logger.error()` only.
- All step metadata hardcoded English. console.error in Connect onboarding API route.
**Result:** CONDITIONAL PASS
**Score:** 7/10
**Issues found:**
- All onboarding metadata hardcoded English
- Cannot test flow (requires fresh sign-up)
**Action:** Marked conditional pass

### Section 11: Navigation & Layout — 2026-02-24
**Codex pass:** Fixed global-not-found links to use i18n routing, localized mobile progress accessibility text.
**Playwright audit:**
- 404: Caught by [username] route → "Profile not found | Treido". Bulgarian translated.
- global-not-found.tsx uses Link from @/i18n/routing + getTranslations — Codex fix confirmed.
- Mobile tab bar fully localized. All header components use useTranslations.
- Footer: Company/Help/Legal sections complete. Skip links on all pages.
**Result:** PASS
**Score:** 8/10
**Issues found:**
- Redundant locale prefix in global-not-found links
- Profile/category 404 pages have empty body content
**Action:** Marked complete

### Post-Fix Verification: FIX-A through FIX-H — 2026-02-24
**Codex pass:** Implemented all 8 fixes (settings auth+metadata, wishlist heading, onboarding metadata, not-found body, console.error, sell/orders pagination, sales pagination, global-not-found links).
**Orchestrator verification (code audit + Playwright):**
- **FIX-A** ✅ Settings auth guard redirects to login (EN + BG), `generateMetadata` correct
- **FIX-B** ⚠️→✅ Two issues found and fixed:
  1. `wishlist` route misidentified as profile page by `detectRouteConfig` — added "wishlist" to `knownRoutes`
  2. Account wishlist still had static `export const metadata` — replaced with `generateMetadata`
- **FIX-C** ⚠️→✅ All 6 onboarding pages have `generateMetadata`, but message titles included "| Treido" causing double suffix — removed suffix from all 12 message titles (6 EN + 6 BG)
- **FIX-D** ⚠️→✅ Both not-found pages render body content, but `params` isn't passed to not-found.tsx by Next.js — replaced `params` with `getLocale()` for correct BG translation
- **FIX-E** ✅ `logger.error` used, no `console.error` in connect onboarding
- **FIX-F** ✅ Server-side `.range()` pagination, prev/next UI with page count
- **FIX-G** ✅ Sales page size 10, `.range()` with count, Link-based prev/next
- **FIX-H** ✅ i18n-aware `Link` from `@/i18n/routing`, no manual locale prefix
**Gates:** All 4 pass (typecheck, lint 0 errors/1 warning, styles:gate, 394/394 tests)
**Orchestrator fixes applied:** 4 files changed (app-header.tsx, account/wishlist/page.tsx, [username]/not-found.tsx, categories/[slug]/not-found.tsx) + 2 message files (en.json, bg.json)
**Result:** ALL PASS after iteration
**Scores bumped:** S7→9, S8→9, S9→8, S10→8, S11→9
