-- Update handle_new_user to respect account_type_intent from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  account_type_val text;
BEGIN
  -- Get account type from metadata (default to 'personal')
  account_type_val := COALESCE(
    NEW.raw_user_meta_data->>'account_type_intent',
    'personal'
  );

  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    role, 
    username,
    account_type
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'buyer',
    NULLIF(LOWER(NEW.raw_user_meta_data->>'username'), ''),
    account_type_val
  );
  
  INSERT INTO public.buyer_stats (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_verification (user_id, email_verified)
  VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;;
