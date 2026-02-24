-- Hardening: set explicit search_path on fulfillment status functions
--
-- Supabase Security Advisor warns when function search_path is mutable.

ALTER FUNCTION public.recompute_order_fulfillment_status(uuid) SET search_path TO 'public';
ALTER FUNCTION public.trg_recompute_order_fulfillment_status() SET search_path TO 'public';
;
