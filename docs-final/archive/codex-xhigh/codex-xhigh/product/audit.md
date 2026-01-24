# Product Audit Checklist (Launch-Focused)

## Onboarding
- [ ] Sign up → onboarding completes without drift between profile DB state and UI.
- [ ] Account type selection is enforced (either at signup or during onboarding, but not both inconsistently).
- [ ] Badge is assigned/derived correctly after onboarding.

## Plans/subscriptions
- [ ] Purchase subscription → `subscriptions` updates and UI reflects it.
- [ ] Upgrade/downgrade → correct proration/portal handling.
- [ ] Business route gating uses the same “account status” logic everywhere.

## Seller payouts (Connect)
- [ ] If payouts are required to sell: `/sell` is gated until Connect is complete.

## Trust signals
- [ ] Reviews/ratings are real (derived from DB), not placeholders.

