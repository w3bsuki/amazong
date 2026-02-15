# Feature Inventory (Launch Hardening)

Legend:

- `complete`: feature is implemented and production-usable
- `partial`: implemented but has known functional/stability/UX gaps
- `missing`: not implemented for launch target

## Canonical Feature Map

| Domain | Scope | Requirement IDs | Maturity | Evidence |
|---|---|---|---|---|
| Authentication | Login/signup/email confirm/password reset/session persistence | R1.1-R1.6 | complete | `app/[locale]/(auth)/**`, `lib/auth/server-actions.ts`, `app/auth/confirm/route.ts` |
| Onboarding | Post-signup onboarding and seller gating | R1.7, R2.1 | complete | `app/[locale]/(onboarding)/onboarding/page.tsx`, `app/actions/onboarding.ts`, `app/[locale]/(sell)/sell/page.tsx` |
| Protected Routing | Locale proxy and protected route auth gates | R1.8 | complete | `proxy.ts`, `lib/supabase/middleware.ts`, `lib/auth/require-auth.ts` |
| Selling | Multi-step listing creation/edit/delete/publish | R2.2-R2.7 | complete | `app/[locale]/(sell)/**`, `app/[locale]/(sell)/_actions/sell.ts`, `lib/sell/schema-v4.ts` |
| Selling Analytics | Seller listing analytics | R2.8 | missing | `REQUIREMENTS.md` |
| Cart & Checkout | Cart CRUD, checkout, buyer protection fee, webhook->order | R3.1-R3.8 | complete | `app/[locale]/(main)/cart/**`, `app/[locale]/(checkout)/**`, `app/api/checkout/webhook/route.ts` |
| Buyer Orders | Orders list/detail/status/report/confirm delivery | R4.1-R4.4, R4.6 | complete | `app/[locale]/(account)/account/orders/**`, `app/actions/orders.ts` |
| Buyer Cancel | Pre-shipment cancellation | R4.5 | partial | `REQUIREMENTS.md`, `TASKS.md` |
| Seller Orders | Seller order list/detail/ship/deliver | R5.1-R5.4, R5.6 | complete | `app/[locale]/(sell)/sell/orders/**`, `app/actions/orders.ts` |
| Seller Refund | Refund processing flow | R5.5 | partial | `REQUIREMENTS.md`, `TASKS.md` |
| Stripe Connect Payouts | Connect onboarding and payout eligibility/status | R6.1-R6.6 | complete | `app/api/connect/**`, `lib/stripe-connect.ts`, `app/[locale]/(sell)/sell/page.tsx` |
| Discovery | Home feed, categories, search, filters, sorting | R7.1-R7.6 | complete | `app/[locale]/(main)/page.tsx`, `app/[locale]/(main)/categories/**`, `app/[locale]/(main)/search/**` |
| Saved Searches | Persisted saved searches + alerts | R7.7 | partial | `app/[locale]/(main)/_components/search-controls/save-search-button.tsx` |
| Product Detail | PDP gallery, seller card, attributes, sharing, recently viewed | R8.1-R8.6, R8.8 | complete | `app/[locale]/[username]/[productSlug]/**` |
| PDP Related Items | Related items module | R8.7 | missing | `REQUIREMENTS.md` |
| Wishlist | Add/remove/list/count | R9.1-R9.4 | complete | `app/[locale]/(main)/wishlist/**`, `app/api/wishlist/**` |
| Wishlist Sharing | Share wishlist | R9.5 | partial | `REQUIREMENTS.md` |
| Messaging / Chat | Conversations, realtime thread, unread, image attachments, report/block | R10.1-R10.7 | complete | `app/[locale]/(chat)/**`, `app/actions/blocked-users.ts` |
| Reviews / Ratings | Create/display/helpful/delete + duplicate guards | R11.1-R11.8 | complete | `app/actions/reviews.ts`, PDP/profile surfaces |
| Profiles & Account | Public profile, profile edit, account settings, address book | R12.1-R12.4 | complete | `app/[locale]/(account)/**`, `app/actions/profile.ts`, `app/[locale]/[username]/profile-client.tsx` |
| Notifications (in-app) | Preferences + in-app notifications | R12.5 | partial | `app/[locale]/(account)/account/(settings)/notifications/**`, `hooks/use-notification-count.ts` |
| Email Notifications | Transactional email notifications | R12.6 | partial | `REQUIREMENTS.md`, `TASKS.md` |
| Trust & Safety Core | Report product/user/conversation + block user | R13.1-R13.4 | complete | `app/actions/orders.ts`, `app/[locale]/(chat)/_actions/report-conversation.ts`, `app/actions/blocked-users.ts` |
| Moderation / Enforcement | Admin moderation + prohibited items enforcement | R13.5-R13.6 | partial | `REQUIREMENTS.md`, `app/[locale]/(admin)/**` |
| Business Dashboard | Access gating, business profile/listings/orders/subscriptions | R14.1-R14.4, R14.6 | complete | `app/[locale]/(business)/**`, `app/[locale]/(plans)/**` |
| Business Analytics | Business analytics dashboard depth | R14.5 | partial | `REQUIREMENTS.md` |
| Plans / Subscriptions | Plans page + checkout + portal/downgrade | R14.6 and plans scope | complete | `app/[locale]/(plans)/**`, `app/actions/subscriptions.ts` |
| Admin | Admin route gating + health endpoint | R15.1, R15.5 | complete | `app/[locale]/(admin)/admin/**`, `app/api/health/route.ts` |
| Admin Operations | Admin metrics/users/content moderation surfaces | R15.2-R15.4 | partial | `REQUIREMENTS.md`, `app/[locale]/(admin)/admin/**` |
| Localization | Locale routing, EN/BG, locale switching, currency presentation | R16.1-R16.5 | complete | `proxy.ts`, `i18n/**`, `messages/*.json`, `lib/currency.ts` |
| Accessibility | Keyboard/focus/touch targets | R17.1-R17.3 | complete | `REQUIREMENTS.md`, UI primitives |
| Accessibility Completion | Screen reader + full WCAG AA completion | R17.4-R17.5 | partial | `REQUIREMENTS.md` |
| Infrastructure | Deployment, Supabase, Stripe, boundaries, health/revalidate | R18.1-R18.6 | complete | `ARCHITECTURE.md`, `app/api/health/route.ts`, `app/api/revalidate/route.ts` |

## Hardcoding / Overengineering Flags

- Shipping region booleans are highly granular (`ships_to_*`) and rigid for long-term scaling.
- Saved searches are client-local storage only; not persisted server-side.
- Notification defaults and demo notification surfaces include hardcoded/fallback behavior.
- Styling drift exists between `PageShell` and `DesktopShell` variant recipes.
