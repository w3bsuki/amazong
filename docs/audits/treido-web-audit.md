# Treido External Web Audit (Dec 31, 2025)

**Scope**: Black-box run on https://www.treido.eu with headless Playwright. I created a test account and attempted to proceed as a buyer; flows that require email confirmation or payments remain blocked without inbox/keys. No server logs or Supabase keys were accessed.

## Accounts / Auth
- Test account created: `auditbuyer02.treido@gmail.com` / `Str0ngPass!42` (Personal). Sign-up succeeded and redirected to `/en/auth/sign-up-success` with “Check your email” prompt. Login is currently blocked by “Email not confirmed.” (no inbox access). Resend option exists.
- Sign-up UX: validation works (invalid domain rejected), password strength meter, username availability indicator. Confirmation required.
- Login UX: shows “Email not confirmed” error when attempting to sign in pre-verification.

## Routes Covered
- Home `/en`: Loads; category tabs + product grid render; cookie banner present; mobile menu exposes auth/register and categories.
- Sign-up `/en/auth/sign-up`: End-to-end form submission works; landing on success page; email verification required.
- Login `/en/auth/login`: Renders; blocks unverified account; forgot-password link present.
- Sell `/en/sell`: Redirects to login (requires auth).
- Search `/en/search`: Navigation returns `net::ERR_ABORTED` (domcontentloaded aborted) via Playwright; needs verification.

## Issues / Blocks
1. Search route `/en/search` aborts load (ERR_ABORTED). Needs investigation (routing/middleware/client error?).
2. Auth requires email confirmation; without inbox access cannot proceed to buyer/seller flows. Provide test inbox or disable verification for test users to continue checkout/listing/chat tests.
3. Sell link hard-redirects to login; functional but abrupt (no pre-login context/upsell).
4. Cookie banner + language/menu modal can stack after first menu tap, adding friction on first interaction.

## Warnings
- Console shows multiple preload warnings (fonts/CSS preloaded but unused). Trim preload hints.

## Not Yet Tested (blocked by email verification/payment keys)
- Post-login flows: profile, address book, notification settings, password reset.
- Buyer flows: search/browse filters, PDP, cart, checkout (Stripe test mode), orders list, returns/cancellations.
- Seller flows: create listing, upload images, pricing/fees, draft/publish, manage orders.
- Chat/messaging: send/receive, unread badges, attachments.
- Wishlist/watchlist, registry, gift cards, support/help flows.

## Next Steps to Complete Audit
1. Supply a test inbox or disable email verification for whitelisted test users so I can log in with `auditbuyer02.treido@gmail.com` (or provide service role key to mark verified via Supabase MCP if permitted).
2. Provide/confirm Stripe test-mode path so I can run checkout end-to-end with test cards.
3. After verification, I will: create a seller test account, publish a listing, run buyer cart/checkout, exercise chat, orders, returns, and update this report with pass/fail per route.
