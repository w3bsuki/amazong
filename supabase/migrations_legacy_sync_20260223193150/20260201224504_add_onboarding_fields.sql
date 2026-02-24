-- Add interests column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- Add business fields to private_profiles
ALTER TABLE private_profiles 
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_website text,
ADD COLUMN IF NOT EXISTS business_category text;

COMMENT ON COLUMN profiles.interests IS 'User-selected interest categories from onboarding';
COMMENT ON COLUMN private_profiles.business_name IS 'Business display name for business accounts';
COMMENT ON COLUMN private_profiles.business_website IS 'Business website URL';
COMMENT ON COLUMN private_profiles.business_category IS 'Primary business category';;
