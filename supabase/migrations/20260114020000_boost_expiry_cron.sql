-- =====================================================
-- Boost expiry cleanup + scheduled job
-- =====================================================
-- Goal:
-- 1) Periodically deactivate expired boosts in listing_boosts
-- 2) Keep products.is_boosted / products.boost_expires_at in sync
-- 3) Prevent expired boosts from lingering indefinitely
--
-- Note: App-side ranking must still treat boosts as active only when boost_expires_at > now()
--       so that a delayed cron run never causes expired items to float to the top.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

CREATE OR REPLACE FUNCTION public.cleanup_expired_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- 1) Deactivate expired boost purchases
  UPDATE public.listing_boosts
  SET is_active = false
  WHERE is_active = true
    AND expires_at <= now();

  -- 2) Mark products as boosted when they have an active, non-expired boost
  WITH active AS (
    SELECT lb.product_id, MAX(lb.expires_at) AS max_expires
    FROM public.listing_boosts lb
    WHERE lb.is_active = true
      AND lb.expires_at > now()
    GROUP BY lb.product_id
  )
  UPDATE public.products p
  SET is_boosted = true,
      boost_expires_at = a.max_expires
  FROM active a
  WHERE p.id = a.product_id;

  -- 3) Clear boost state for everything else (expired or inconsistent)
  UPDATE public.products p
  SET is_boosted = false,
      boost_expires_at = NULL
  WHERE (p.is_boosted = true OR p.boost_expires_at IS NOT NULL)
    AND NOT EXISTS (
      SELECT 1
      FROM public.listing_boosts lb
      WHERE lb.product_id = p.id
        AND lb.is_active = true
        AND lb.expires_at > now()
    );
END;
$function$;

REVOKE ALL ON FUNCTION public.cleanup_expired_boosts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_boosts() TO service_role;

-- Schedule cron job every 5 minutes (idempotent)
DO $$
DECLARE
  existing_job_id integer;
BEGIN
  SELECT jobid
  INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'cleanup_expired_boosts';

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;

  PERFORM cron.schedule(
    'cleanup_expired_boosts',
    '*/5 * * * *',
    $cron$SELECT public.cleanup_expired_boosts();$cron$
  );
END $$;
