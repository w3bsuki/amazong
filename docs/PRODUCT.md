# Product Guide (Canonical)

This doc is the product + scope “source of truth” for development decisions.

---

## Scope (must be explicit)

The app contains both:
- classifieds-first patterns (listings + chat + boosts), and
- marketplace patterns (cart + checkout + orders + payouts).

When in doubt, write the current launch scope down in `TODO.md` as one sentence and keep the UI consistent with it.

---

## Roadmap (high level)

- **V1 (classifieds-first):** listings + search + chat; monetization via boosts/promotions.
- **V2 (marketplace payments):** checkout + orders; Stripe webhooks; (optionally) Stripe Connect payouts; refunds/support.
- **V3 (scale):** mobile apps + expansion + advanced seller tooling.

---

## Monetization (high level)

- V1: visibility upgrades (boosts) with minimal ops risk.
- V2: fees tied to a clear value proposition (payments + trust), with hard gates around webhook correctness and support/refund process.

If monetization work is in scope, treat fee math and plan config as **data-driven** (DB-configured), never hardcoded.

