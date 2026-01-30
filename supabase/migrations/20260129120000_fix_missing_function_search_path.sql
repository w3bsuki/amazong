-- Fix Security Advisor: function_search_path_mutable
-- Ensure functions run with a fixed, non-mutable search_path.

ALTER FUNCTION public.reset_monthly_boosts()
  SET search_path = public;

ALTER FUNCTION public.init_subscription_boosts()
  SET search_path = public;

ALTER FUNCTION public.create_subscription_expiry_notifications()
  SET search_path = public;

ALTER FUNCTION public.expire_subscriptions()
  SET search_path = public;

ALTER FUNCTION public.queue_badge_evaluation()
  SET search_path = public;
