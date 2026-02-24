-- Fix security vulnerability: Set immutable search_path for functions
-- This prevents SQL injection via search path manipulation

-- Fix handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Fix check_not_own_product function  
ALTER FUNCTION public.check_not_own_product() SET search_path = public;

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to create profile when new user signs up. search_path secured.';
COMMENT ON FUNCTION public.check_not_own_product() IS 'Validates user is not reviewing their own product. search_path secured.';;
