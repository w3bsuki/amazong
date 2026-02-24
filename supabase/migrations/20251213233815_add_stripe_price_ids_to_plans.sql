-- Personal Plans
-- Plus (starter tier, personal)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se2FRH2GXdb753wrugGPL8L',
    stripe_price_yearly_id = 'price_1Se2G3H2GXdb753w6a77MbRz'
WHERE tier = 'starter' AND account_type = 'personal';

-- Pro (professional tier, personal)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se2GcH2GXdb753wnT6ihe88',
    stripe_price_yearly_id = 'price_1Se2H1H2GXdb753wqCsaJqmX'
WHERE tier = 'professional' AND account_type = 'personal';

-- Power (business tier, personal)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se2IcH2GXdb753wVI7wGRB3',
    stripe_price_yearly_id = 'price_1Se2IxH2GXdb753w2TPSbyV5'
WHERE tier = 'business' AND account_type = 'personal';

-- Unlimited (enterprise tier, personal)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se2JXH2GXdb753w0QtSKwnT',
    stripe_price_yearly_id = 'price_1Se2JXH2GXdb753w0QtSKwnT'
WHERE tier = 'enterprise' AND account_type = 'personal';

-- Business Plans
-- Business Starter (starter tier, business)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se281H2GXdb753wYMO0NJd6',
    stripe_price_yearly_id = 'price_1Se281H2GXdb753wuzPupdqy'
WHERE tier = 'starter' AND account_type = 'business';

-- Business Pro (professional tier, business)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se29aH2GXdb753wykAfNqLS',
    stripe_price_yearly_id = 'price_1Se29aH2GXdb753wDIYDHW5O'
WHERE tier = 'professional' AND account_type = 'business';

-- Business Enterprise (enterprise tier, business)
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_1Se2AnH2GXdb753wcy0C0Xql',
    stripe_price_yearly_id = 'price_1Se2AnH2GXdb753wwCu2FHr1'
WHERE tier = 'enterprise' AND account_type = 'business';;
