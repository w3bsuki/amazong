-- Stripe webhook idempotency: enforce uniqueness on Stripe identifiers

create unique index if not exists orders_stripe_payment_intent_id_unique
on public.orders (stripe_payment_intent_id)
where stripe_payment_intent_id is not null;

create unique index if not exists subscriptions_stripe_subscription_id_unique
on public.subscriptions (stripe_subscription_id)
where stripe_subscription_id is not null;
