# Product Guide (Canonical)

This doc is the product + scope “source of truth” for development decisions.

---

## Scope (must be explicit)

The app is a **full marketplace** (Vinted-style), not a classifieds-only product.

Core scope:

- Listings + discovery (browse, search, categories)
- Chat (buyer ↔ seller)
- On-platform checkout (Stripe)
- Orders + status lifecycle
- Seller onboarding + payouts (Stripe Connect Express)
- Trust & safety (reports, blocks, moderation tooling)
- Ratings/reviews (minimum viable for launch)

When in doubt, write the current launch scope down in `TODO.md` as one sentence and keep the UI consistent with it.

---

## Roadmap (high level)

- **V1 (launch):** marketplace core + Buyer Protection (no COD) + Stripe Connect payouts.
- **V1.1–V1.3:** shipping/tracking automation, dispute tooling, onboarding conversion, performance/SEO.
- **V2 (growth):** AI listing assistant + AI search assistant, advanced business tooling.
- **V3 (scale):** mobile apps + expansion + ops automation.

---

## Monetization (high level)

- **Hybrid Buyer Protection (primary):**
  - Personal sellers: **0% seller fee** (reduce off-platform leakage)
  - Businesses: **small seller fee** (tiered by plan)
  - Buyers: transparent **Buyer Protection** fee (percent + fixed, capped)
- **Secondary:** optional boosts/promotions (visibility upgrades).

Payments/trust work must have hard gates around webhook correctness, refunds, and dispute/support process.

If monetization work is in scope, treat fee math and plan config as **data-driven** (DB-configured), never hardcoded.
