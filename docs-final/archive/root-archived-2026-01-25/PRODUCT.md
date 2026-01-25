# Product Guide

This doc is the product + scope "source of truth" for development decisions.

---

## Scope (Must Be Explicit)

The app is a **full marketplace** (Vinted-style), not a classifieds-only product.

Core scope:

- Listings + discovery (browse, search, categories)
- Chat (buyer ↔ seller)
- On-platform checkout (Stripe)
- Orders + status lifecycle
- Seller onboarding + payouts (Stripe Connect Express)
- Trust & safety (reports, blocks, moderation tooling)
- Ratings/reviews (minimum viable for launch)

---

## Roadmap (High Level)

- **V1 (launch):** marketplace core + Buyer Protection (no COD) + Stripe Connect payouts.
- **V1.1–V1.3:** shipping/tracking automation, dispute tooling, onboarding conversion, performance/SEO.
- **V2 (growth):** AI listing assistant + AI search assistant, advanced business tooling.
- **V3 (scale):** mobile apps + expansion + ops automation.

---

## Monetization (High Level)

- **Hybrid Buyer Protection (primary):**
  - Personal sellers: **0% seller fee** (reduce off-platform leakage)
  - Businesses: **small seller fee** (tiered by plan)
  - Buyers: transparent **Buyer Protection** fee (percent + fixed, capped)
- **Secondary:** optional boosts/promotions (visibility upgrades).

Payments/trust work must have hard gates around webhook correctness, refunds, and dispute/support process.

If monetization work is in scope, treat fee math and plan config as **data-driven** (DB-configured), never hardcoded.

---

## Buyer Protection Entry Points (V1)

- Buyers can report issues from their account orders list and order detail (creates a seller-facing message + notification).
- Conversation-level reports are available in chat for safety/moderation.

---

## DB Scope Inventory (Defer Deletions Until Post-Launch)

The following DB pieces are beyond V1 scope but already exist; keep them for now and re-evaluate after launch:

- Promotions: `listing_boosts`, `boost_prices` (+ related boost cron).
- Badges/gamification: `badge_definitions`, `user_badges`.
- Admin ops: `admin_docs`, `admin_tasks` (internal docs/tasks).
- Wishlist sharing RPCs: `enable_wishlist_sharing`, `disable_wishlist_sharing`, `get_shared_wishlist`.
