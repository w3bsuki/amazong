-- Fix Unlimited (Personal) yearly price ID
UPDATE subscription_plans 
SET stripe_price_yearly_id = 'price_1Se2JlH2GXdb753wpfz95Jji'
WHERE tier = 'enterprise' AND account_type = 'personal';;
