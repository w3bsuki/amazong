-- Fix: Change subscription_plans.currency default from 'BGN' to 'EUR'
-- Bulgaria joined the Eurozone; all new plans should default to EUR

ALTER TABLE public.subscription_plans 
  ALTER COLUMN currency SET DEFAULT 'EUR';

COMMENT ON COLUMN public.subscription_plans.currency IS 'Currency for plan pricing (default: EUR since Eurozone transition)';;
