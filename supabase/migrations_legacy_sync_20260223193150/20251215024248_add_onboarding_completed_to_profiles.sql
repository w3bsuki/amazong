-- Add onboarding_completed column to profiles table
-- This tracks whether a user has completed the welcome/onboarding flow
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the user has completed the welcome/onboarding flow after email confirmation';;
