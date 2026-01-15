# Feature Map (Routes → Actions/APIs → DB → Tests)

Use this as a navigation index when auditing or fixing a specific feature.

## Authentication & onboarding

- Routes: `/[locale]/auth/*` (`app/[locale]/(auth)/auth/*`)
- Server actions: `app/[locale]/(auth)/_actions/auth.ts`
- Auth callbacks: `app/auth/confirm/route.ts`, `app/auth/callback/route.ts`
- DB: `profiles` (onboarding flags, username, account type intent)
- Tests: `e2e/auth.spec.ts`, `e2e/smoke.spec.ts` (login/signup page loads)

## Personal account

- Routes: `/[locale]/account/*` (`app/[locale]/(account)/account/*`)
- Actions: `app/actions/profile.ts`, `app/actions/orders.ts`, `app/actions/payments.ts`, `app/actions/subscriptions.ts`
- DB: `profiles`, `orders`, `order_items`, `user_addresses`, `user_payment_methods`, `subscriptions`
- Tests: `e2e/orders.spec.ts` (orders), `e2e/profile.spec.ts` (profile)

## Marketplace browse/search/product pages

- Routes: `/[locale]`, `/[locale]/categories/*`, `/[locale]/search`, `/{username}/{productSlug}`
- APIs: `app/api/products/*`, `app/api/categories/*`
- Data fetchers: `lib/data/products.ts`, `lib/data/product-page.ts`
- Tests: `e2e/smoke.spec.ts` (home/categories/search), `e2e/reviews.spec.ts` (PDP reviews section)

## Seller listing flow

- Routes: `/[locale]/sell` (`app/[locale]/(sell)/sell/*`)
- Actions: `app/[locale]/(sell)/_actions/sell.ts`, `app/actions/products.ts`, `app/actions/onboarding.ts`
- Upload: `app/api/upload-image/route.ts` (product images), avatars bucket for profile images
- DB: `products`, `product_variants`, category attributes tables
- Tests: `e2e/seller-create-listing.spec.ts`, `e2e/seller-routes.spec.ts`

## Messaging (buyer/seller chat)

- Routes: `/[locale]/chat` (`app/[locale]/(chat)/chat/page.tsx`)
- Actions: `app/[locale]/(chat)/_actions/report-conversation.ts`
- RPC: `get_or_create_conversation`, `mark_messages_read`, unread counters
- DB: `conversations`, `messages`, `blocked_users`, `notifications`
- Tests: `e2e/smoke.spec.ts` (auth redirect), mobile UX audits, and manual QA

## Cart + checkout + orders (if in-scope)

- Routes: `/[locale]/cart`, `/[locale]/checkout`, `/[locale]/account/orders`, `/[locale]/sell/orders`
- Checkout actions: `app/[locale]/(checkout)/_actions/checkout.ts`
- Webhooks:
  - Goods checkout: `app/api/checkout/webhook/route.ts`
  - Saved payment methods: `app/api/payments/webhook/route.ts`
- DB: `orders`, `order_items`, stock triggers/functions in Supabase migrations
- Tests: `e2e/orders.spec.ts`, `e2e/smoke.spec.ts`

## Reviews/ratings & seller feedback

- Actions: `app/actions/reviews.ts`, `app/actions/seller-feedback.ts`, `app/actions/buyer-feedback.ts`
- Data: `lib/data/product-reviews.ts`
- DB: `reviews`, `seller_feedback`, `seller_stats`, `notifications`
- Tests: `e2e/reviews.spec.ts`

## Business dashboard (paid)

- Routes: `/[locale]/dashboard/*` (`app/[locale]/(business)/dashboard/*`)
- Gate: `lib/auth/business.ts` (`requireDashboardAccess`)
- DB: `profiles` (account_type/tier), `subscriptions`, plus orders/products
- Tests: `e2e/seller-routes.spec.ts`

## Admin

- Routes: `/[locale]/admin/*` (`app/[locale]/(admin)/admin/*`)
- Gate: `lib/auth/admin.ts` (`requireAdmin`)
- DB: uses admin client for metrics
- Tests: none dedicated (recommend adding post-launch)

