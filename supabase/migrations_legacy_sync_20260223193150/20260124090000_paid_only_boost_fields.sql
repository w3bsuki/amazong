-- Paid-only boost enforcement (DB-side)
-- Date: 2026-01-24
--
-- Prevent authenticated clients from directly writing boost flags.
-- Canonical write path for boosts is Stripe webhook(s) via service role.

BEGIN;

CREATE OR REPLACE FUNCTION public.prevent_direct_boost_field_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  request_role text;
BEGIN
  request_role := (SELECT auth.role());

  -- Allow server-side/admin operations (service role) and internal DB jobs.
  IF request_role IS NULL OR request_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Disallow setting boost fields on insert.
  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.is_boosted, false) IS TRUE OR NEW.boost_expires_at IS NOT NULL THEN
      RAISE EXCEPTION 'Boost fields are managed by payments' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  -- Disallow direct updates to boost fields.
  IF NEW.is_boosted IS DISTINCT FROM OLD.is_boosted
    OR NEW.boost_expires_at IS DISTINCT FROM OLD.boost_expires_at
  THEN
    RAISE EXCEPTION 'Boost fields are managed by payments' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_direct_boost_field_updates ON public.products;
CREATE TRIGGER trg_prevent_direct_boost_field_updates
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.prevent_direct_boost_field_updates();

COMMENT ON FUNCTION public.prevent_direct_boost_field_updates IS
  'Blocks authenticated clients from setting products.is_boosted / products.boost_expires_at directly.';

COMMIT;

