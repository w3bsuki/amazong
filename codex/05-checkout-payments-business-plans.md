# Checkout, Payments, Business, And Plans Audit

## Scope

- `app/[locale]/(checkout)`
- `app/[locale]/(business)`
- `app/[locale]/(plans)`
- `app/api/checkout/webhook/route.ts`
- `app/api/payments/webhook/route.ts`
- `app/api/subscriptions/webhook/route.ts`
- `app/api/connect/webhook/route.ts`
- `app/actions/payments.ts`
- `lib/stripe.ts`
- `lib/stripe-connect.ts`

## Current State Summary

- Core flow is production-oriented and security-conscious.
- Repetition exists in validation, metadata parsing, auth guards, and webhook signature handling.

## Findings

## P0 (Safe Refactor Candidates)

- Duplicated cart item validation and metadata parsing across checkout server actions and webhook path.
- Repeated authenticated Supabase user guard blocks in payment/subscription-related actions.
- Repeated webhook signature verification loop pattern across webhook routes.

## P1

- Shipping/address metadata normalization appears in multiple payment paths.
- Plan selection field sets can diverge if not centralized.

## P2

- Response and error handling shape is largely consistent but still partially duplicated at route/action boundaries.

## High-Risk Pause Areas (Require Approval)

- `app/api/*/webhook/route.ts` logic changes.
- Order creation and dedupe behavior in checkout webhook/order verification paths.
- Connect payout status update behavior.
- Any payment metadata contract changes.

## Simplification Targets

1. Extract shared payment metadata schemas and serializers.
2. Extract shared webhook signature verification utility.
3. Extract shared authenticated-action guard helper.
4. Keep webhooks thin, idempotent, and behavior-identical.

## Success Criteria

- Fewer repeated auth/validation blocks.
- One canonical metadata schema for checkout/order paths.
- No behavior change in webhooks, idempotency, or payout gating.
