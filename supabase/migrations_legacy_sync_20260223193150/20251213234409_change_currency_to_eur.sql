-- Update all subscription plans to use EUR
UPDATE subscription_plans SET currency = 'EUR';

-- Update subscriptions table default (for new subscriptions)
ALTER TABLE subscriptions ALTER COLUMN currency SET DEFAULT 'EUR';;
