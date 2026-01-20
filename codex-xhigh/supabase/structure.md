# Supabase — Target Backend Shape

## Invariants (non-negotiable)
- All schema/RLS/triggers via `supabase/migrations/*` (no ad-hoc prod edits).
- RLS enabled on user-facing tables; policies are minimal and intentional.
- Storage buckets/policies must match app behavior (`avatars`, `product-images`).
- Avoid “RPC over-engineering”: prefer normal table access + views unless a single
  RPC is the clear best option (e.g., conversation creation, complex category tree).

## Data model primitives (conceptual)
- Identity: `auth.users` + `profiles`
- Marketplace: `products`, `product_variants`, category tables
- Orders: `orders`, `order_items`, stock management triggers
- Messaging: `conversations`, `messages`, notifications
- Trust: `reviews`, `seller_feedback`, `seller_stats`
- Monetization: `subscription_plans`, `subscriptions`, `listing_boosts`
- Connect: `seller_payout_status` (Stripe Connect readiness)

