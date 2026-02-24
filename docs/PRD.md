# PRD — Treido

> Product context for AI agents. What we're building, who it's for, what ships at V1.
> Full product spec with competitive analysis, detailed journeys, and future roadmap: `docs/PRD-full.md`

---

## What Treido Is

A marketplace where individuals and businesses buy and sell products with secure card payments. Runs at treido.eu. Anyone can list something for sale. Businesses get a Shopify-like backend without needing developers.

**Currency:** EUR · **Languages:** English, Bulgarian · **Hosting:** Vercel

### What Makes It Different

1. **Secure payments.** Stripe card payments — no cash scams, no failed pickups.
2. **Business backend without Shopify.** Full dashboard (products, orders, analytics) with Treido as the storefront.
3. **AI-first future.** Photo → auto-fill listing in 10 seconds. AI shopping agents. Generative UI. (V2+)
4. **Premium UX.** Calm, scannable, touch-confident. Modal browsing on desktop (never lose scroll position).
5. **EU-native.** EUR, GDPR, multi-language. Launching Bulgaria, expanding Europe.

### Brand Personality

Premium & Clean. Feels like Stripe meets a modern marketplace — calm confidence, not visual noise. Trust, simplicity, professionalism. NOT playful (Vinted), NOT dense (Amazon), NOT cluttered (OLX).

---

## Users

| Persona | Need | Frustration |
|---------|------|-------------|
| **Casual seller** (Maria, 22) | List items fast on phone, get paid | OLX has no card payments, buyers flake |
| **Small business** (Stefan, 38) | Online storefront without Shopify + dev | Can't afford separate website |
| **Buyer** (Ivan, 28) | Find deals, pay with card, get order tracking | No checkout flow on OLX/Facebook |
| **Distributor** (future) | Bulk catalog, EU reach | V2+ scope |

---

## Core Journeys

**Browse → Buy:** Homepage/search → product modal (desktop) or PDP (mobile) → add to cart → checkout (auth required) → Stripe payment → order confirmation → track → receive → review.

**List an Item:** Click "Sell" → upload photos → title, description, category (L1→L4), price, condition → publish. Target: under 2 minutes. Future: 10 seconds with AI.

**Business Setup:** Sign up → business account type → business profile → connect Stripe → dashboard → add products → manage orders.

**Order Lifecycle:** `pending` → `confirmed` (seller) → `shipped` (seller + tracking) → `delivered` (buyer) → `completed` (payout). Cancellation before confirm. Auto-complete after 14 days if buyer silent.

---

## V1 Feature Inventory

**Auth:** Email/password, Google OAuth, password reset, session management, protected routes.
**Onboarding:** Account type → profile → interests → complete.
**Browsing:** Homepage feeds, search, category navigation (24 categories, 4 levels deep), filters, product grid.
**PDP:** Image gallery, product info, seller card, reviews, add to cart, wishlist, share. Desktop: modal overlay.
**Sell:** Multi-step form, image upload, category picker, condition, price. AI autofill scaffolded.
**Cart + Wishlist:** Add/remove, drawers, persistence, wishlist sharing.
**Checkout:** Address, shipping method, Stripe payment, confirmation. Auth required.
**Orders:** Status tracking, proof of delivery, chat link. Buyer + seller views.
**Chat:** Supabase Realtime, auto-created on purchase, image attachments, pre-purchase messaging toggle.
**Plans:** Pricing page, Stripe subscriptions, customer portal. Tiers: Free/Pro/Business (pricing TBD).
**Boosts:** Paid visibility upgrade, duration-based, plan limits.
**Reviews:** Star rating + text, seller ratings, buyer feedback.
**Profiles:** Public `/[username]`, listings, reviews, follow/unfollow.
**Business Dashboard:** Product CRUD, order management, analytics, business profile.
**Admin:** User/product/order management, moderation.
**i18n:** Full EN + BG, locale-prefixed URLs.

---

## Revenue Model

| Stream | How |
|--------|-----|
| **Buyer Protection** | Buyer pays transparent protection fee (% + fixed, capped) on every purchase. Primary revenue. |
| **Subscriptions** | 6 tiers: Personal Free/Plus/Pro + Business Free/Pro/Enterprise. Higher tier = more listings, lower buyer fees, boosts, tools. |
| **Boosts** | Paid listing visibility (€0.99/24h, €4.99/7d, €14.99/30d). Plan credits for 24h boosts. |

**Payouts:** Stripe Connect Express. Escrow — funds release after delivery confirmation (72h auto-confirm).
**Seller fees:** Personal = 0%. Business = 0.5–1.5% by plan.
**Full details:** `docs/business/monetization.md` and `docs/business/plans-pricing.md`.

---

## V1 Launch Criteria

Everything in this list must work before launch:

- [ ] Full auth flow (signup, login, reset, OAuth, sign out)
- [ ] Onboarding wizard complete
- [ ] Browse, search, filter products
- [ ] PDP with images, info, reviews
- [ ] Cart + wishlist
- [ ] Checkout with Stripe card payment
- [ ] Sell flow (list product with images, fields, publish)
- [ ] Order lifecycle end-to-end
- [ ] Chat between buyer and seller
- [ ] Plans page + subscription management
- [ ] Boosts purchase and display
- [ ] Business dashboard (products + orders)
- [ ] Public profiles
- [ ] Admin panel basics
- [ ] Full EN + BG translations
- [ ] Mobile + desktop UX quality bar
- [ ] Stripe webhook idempotency verified
- [ ] Refund/dispute flow tested
- [ ] Environment separation (no test keys in prod)
- [ ] Leaked password protection enabled
- [ ] RLS on all user data, `getUser()` everywhere
- [ ] Codebase < 700 files, < 35K LOC

---

## Open Questions

| ID | Question | Status |
|----|----------|--------|
| OPEN-001 | Plan tiers, limits, pricing? | **Resolved** — 6 tiers (Personal Free/Plus/Pro + Business Free/Pro/Enterprise). Limits decided. Subscription prices TBD. See `docs/business/plans-pricing.md` |
| OPEN-002 | Direct payout vs escrow? | **Resolved** — Escrow (Separate Charges and Transfers). Release after delivery confirmation or dispute resolution. |
| OPEN-003 | Buyer protection model? | **Resolved** — Hybrid Buyer Protection. Buyer pays % + fixed (capped). See `docs/business/monetization.md` |
| OPEN-004 | Auto-complete policy (14 or 30 days)? | **Resolved** — 72h after delivery |
| OPEN-005 | Unified feed or business/personal split? | Unified |
| OPEN-006 | Transaction fee % per plan? | **Resolved** — Fee table in `docs/business/monetization.md` (0% personal seller, 0.5–1.5% business seller, 2–4% buyer protection) |
| OPEN-007 | Pre-purchase messaging default? | Off |

---

## Glossary

| Term | Meaning |
|------|---------|
| **listing** | Product posted for sale |
| **PDP** | Product Detail Page |
| **server action** | `"use server"` function in `app/actions/` |
| **route handler** | GET/POST in `app/api/` |
| **envelope** | Standard `{ data, error }` return from server actions |
| **boost** | Paid visibility upgrade |
| **payout** | Money sent to seller (vs "payment" = buyer pays) |
| **dashboard** | Business seller interface at `/dashboard` |
| **admin panel** | Treido team interface (different from dashboard) |

---

*Last updated: 2026-02-18*
*Full product spec: `docs/PRD-full.md`*
