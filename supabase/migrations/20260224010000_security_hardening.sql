-- PHASE 1 — Security hardening
--
-- Goals:
-- 1) Ensure dangerous maintenance RPCs are not callable by anon/authenticated.
-- 2) Ensure trigger-only functions are not callable directly.
-- 3) Restrict increment_view_count to authenticated only.
-- 4) Remove duplicate pg_cron job (keep cleanup_expired_boosts, drop expire-listing-boosts).

BEGIN;

-- -----------------------------------------------------------------------------
-- 1a) Revoke anon EXECUTE from dangerous RPCs
-- -----------------------------------------------------------------------------

-- Cron/service_role only (revoke from anon + authenticated + PUBLIC; grant service_role only)
REVOKE ALL ON FUNCTION public.expire_subscriptions() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO service_role;

REVOKE ALL ON FUNCTION public.create_subscription_expiry_notifications() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_subscription_expiry_notifications() TO service_role;

REVOKE ALL ON FUNCTION public.init_subscription_boosts() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.init_subscription_boosts() TO service_role;

REVOKE ALL ON FUNCTION public.reset_monthly_boosts() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_monthly_boosts() TO service_role;

-- Trigger functions (revoke from anon + PUBLIC; called only by triggers)
REVOKE ALL ON FUNCTION public.enforce_products_category_is_leaf() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.handle_category_attribute_key_normalization() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.handle_product_attributes_sync() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.sync_product_attributes_jsonb(uuid) FROM anon, authenticated, PUBLIC;

-- Restrict to authenticated only (revoke from anon + PUBLIC; grant authenticated)
REVOKE ALL ON FUNCTION public.increment_view_count(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO authenticated;

-- -----------------------------------------------------------------------------
-- 1b) Drop duplicate cron job: expire-listing-boosts (keep cleanup_expired_boosts)
-- -----------------------------------------------------------------------------

DO $$
DECLARE
  v_jobid integer;
BEGIN
  SELECT jobid INTO v_jobid
  FROM cron.job
  WHERE jobname = 'expire-listing-boosts';

  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

COMMIT;

-- Verify (run separately):
-- 1) Function privileges:
--    SELECT routine_name, grantee, privilege_type
--    FROM information_schema.routine_privileges
--    WHERE routine_schema = 'public'
--      AND routine_name IN (
--        'expire_subscriptions',
--        'create_subscription_expiry_notifications',
--        'init_subscription_boosts',
--        'reset_monthly_boosts',
--        'increment_view_count',
--        'enforce_products_category_is_leaf',
--        'handle_category_attribute_key_normalization',
--        'handle_product_attributes_sync',
--        'sync_product_attributes_jsonb'
--      )
--    ORDER BY routine_name, grantee, privilege_type;
--
-- 2) Cron jobs (should NOT include expire-listing-boosts):
--    SELECT schedule, jobname, command FROM cron.job ORDER BY jobname;
