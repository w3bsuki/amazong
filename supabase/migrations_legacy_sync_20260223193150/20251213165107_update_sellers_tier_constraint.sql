-- Update sellers table to match new tier structure
-- Tiers: free, starter, professional, enterprise

-- First, update existing sellers to use correct tier names
UPDATE sellers 
SET tier = 'free' 
WHERE tier = 'basic' OR tier IS NULL;

-- Update the check constraint to match subscription_plans tiers
ALTER TABLE sellers 
DROP CONSTRAINT IF EXISTS sellers_tier_check;

ALTER TABLE sellers
ADD CONSTRAINT sellers_tier_check 
CHECK (tier IN ('free', 'starter', 'professional', 'enterprise'));

-- Update default values for new sellers to match free tier
ALTER TABLE sellers 
ALTER COLUMN tier SET DEFAULT 'free',
ALTER COLUMN final_value_fee SET DEFAULT 12.00,
ALTER COLUMN insertion_fee SET DEFAULT 0,
ALTER COLUMN per_order_fee SET DEFAULT 0,
ALTER COLUMN commission_rate SET DEFAULT 12.00;

-- Update existing sellers who are on free tier to have correct fees
UPDATE sellers 
SET 
  final_value_fee = 12.00,
  insertion_fee = 0,
  per_order_fee = 0,
  commission_rate = 12.00
WHERE tier = 'free' AND account_type = 'personal';

UPDATE sellers 
SET 
  final_value_fee = 10.00,
  insertion_fee = 0,
  per_order_fee = 0,
  commission_rate = 10.00
WHERE tier = 'free' AND account_type = 'business';;
