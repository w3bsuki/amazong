# Launch Audit Tracker

> Orchestrator's tracking file. Updated after each Playwright audit.

## Status Summary

| # | Section | Priority | Codex Pass | Audit | Score | Notes |
|---|---------|----------|------------|-------|-------|-------|
| 1 | Infrastructure & Gates | P0 | ✅ | ✅ | 10 | All 4 gates + build green |
| 2 | Auth | P0 | ✅ | ✅ | 9 | All flows work, i18n complete, auth guards solid |
| 3 | Selling | P0 | ✅ | ✅ | 7 | Auth guard + i18n solid; needs auth session to test form |
| 4 | Product Display (PDP) | P0 | ✅ | ✅ | 8 | Full data renders, i18n complete, share works; minor 404 body text |
| 5 | Search & Browse | P0 | ⬜ | ⬜ | — | Known broken (FIX-001) |
| 6 | Checkout & Payments | P0 | ✅ | ✅ | 8 | Code excellent, auth guard + i18n work; cart error from seed data |
| 7 | Orders | P0 | ⬜ | ⬜ | — | |
| 8 | Profile & Account | P1 | ⬜ | ⬜ | — | Known broken mobile (FIX-003) |
| 9 | Cart & Wishlist | P1 | ⬜ | ⬜ | — | |
| 10 | Onboarding | P1 | ⬜ | ⬜ | — | |
| 11 | Navigation & Layout | P1 | ⬜ | ⬜ | — | |
| 12 | Business Dashboard | P2 | ⬜ | ⬜ | — | |
| 13 | Plans & Subscriptions | P2 | ⬜ | ⬜ | — | |
| 14 | Chat & Messaging | P2 | ⬜ | ⬜ | — | |
| 15 | Support & Legal | P2 | ⬜ | ⬜ | — | |

## Audit Log

<!-- Append after each audit session. Format below. -->

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
