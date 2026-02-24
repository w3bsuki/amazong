-- Fix handle_new_user trigger to properly handle account_type_intent from signup
-- This was accidentally removed in phase2_security_performance.sql migration

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  account_type_val TEXT;
  username_val TEXT;
  full_name_val TEXT;
BEGIN
  -- Extract account_type from signup metadata, default to 'personal'
  account_type_val := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'account_type_intent'), ''),
    'personal'
  );
  
  -- Validate account_type is either 'personal' or 'business'
  IF account_type_val NOT IN ('personal', 'business') THEN
    account_type_val := 'personal';
  END IF;
  
  -- Extract username (lowercase, trimmed)
  username_val := NULLIF(LOWER(TRIM(NEW.raw_user_meta_data->>'username')), '');
  
  -- Extract full_name 
  full_name_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name'
  );

  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    role, 
    username,
    display_name,
    account_type
  )
  VALUES (
    NEW.id,
    NEW.email,
    full_name_val,
    NEW.raw_user_meta_data->>'avatar_url',
    'buyer',
    username_val,
    full_name_val,
    account_type_val
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    username = COALESCE(EXCLUDED.username, public.profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    account_type = COALESCE(EXCLUDED.account_type, public.profiles.account_type, 'personal'),
    updated_at = NOW();
  
  -- Initialize buyer_stats
  INSERT INTO public.buyer_stats (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize user_verification
  INSERT INTO public.user_verification (user_id, email_verified)
  VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

-- Also fix any existing NULL account_type values in profiles
UPDATE public.profiles
SET account_type = 'personal'
WHERE account_type IS NULL;

-- Add NOT NULL constraint with default
ALTER TABLE public.profiles 
  ALTER COLUMN account_type SET DEFAULT 'personal';

-- Make sure the column doesn't allow NULL going forward
ALTER TABLE public.profiles ALTER COLUMN account_type SET NOT NULL;;
