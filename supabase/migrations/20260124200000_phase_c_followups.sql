-- Phase C follow-ups: small performance + integrity hardening
--
-- 1) Add missing FK index for product_private.seller_id
-- 2) Avoid per-row auth.* initplans in RLS policies
-- 3) Enforce product_private.seller_id matches products.seller_id (prevents DoS/claiming)
-- 4) Revoke anon grants on private tables (RLS already blocks; reduce surface)

-- =============================================================================
-- 1) Performance: cover FK with index
-- =============================================================================

CREATE INDEX IF NOT EXISTS product_private_seller_id_idx
ON public.product_private (seller_id);

-- =============================================================================
-- 2) Performance: RLS initplan optimizations
-- =============================================================================

ALTER POLICY private_profiles_select_own
ON public.private_profiles
USING (id = (select auth.uid()) OR (select is_admin()));

ALTER POLICY private_profiles_insert_own
ON public.private_profiles
WITH CHECK (id = (select auth.uid()) OR (select is_admin()));

ALTER POLICY private_profiles_update_own
ON public.private_profiles
USING (id = (select auth.uid()) OR (select is_admin()))
WITH CHECK (id = (select auth.uid()) OR (select is_admin()));

ALTER POLICY product_private_select_own
ON public.product_private
USING (seller_id = (select auth.uid()) OR (select is_admin()));

ALTER POLICY product_private_insert_own
ON public.product_private
WITH CHECK (
  (seller_id = (select auth.uid()) OR (select is_admin()))
  AND seller_id = (SELECT p.seller_id FROM public.products p WHERE p.id = product_id)
);

ALTER POLICY product_private_update_own
ON public.product_private
USING (seller_id = (select auth.uid()) OR (select is_admin()))
WITH CHECK (
  (seller_id = (select auth.uid()) OR (select is_admin()))
  AND seller_id = (SELECT p.seller_id FROM public.products p WHERE p.id = product_id)
);

ALTER POLICY product_private_delete_own
ON public.product_private
USING (seller_id = (select auth.uid()) OR (select is_admin()));

-- =============================================================================
-- 3) Integrity: prevent mismatched seller_id (DoS vector)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.enforce_product_private_owner_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  expected_seller_id uuid;
BEGIN
  SELECT p.seller_id INTO expected_seller_id
  FROM public.products p
  WHERE p.id = NEW.product_id;

  IF expected_seller_id IS NULL THEN
    RAISE EXCEPTION 'product_private.product_id % does not exist', NEW.product_id
      USING ERRCODE = '23503';
  END IF;

  IF NEW.seller_id IS DISTINCT FROM expected_seller_id THEN
    RAISE EXCEPTION 'product_private.seller_id % must match products.seller_id % for product %',
      NEW.seller_id, expected_seller_id, NEW.product_id
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS enforce_product_private_owner_match ON public.product_private;
CREATE TRIGGER enforce_product_private_owner_match
BEFORE INSERT OR UPDATE ON public.product_private
FOR EACH ROW EXECUTE FUNCTION public.enforce_product_private_owner_match();

-- =============================================================================
-- 4) Grants: remove anon access to private tables
-- =============================================================================

REVOKE ALL ON TABLE public.private_profiles FROM anon;
REVOKE ALL ON TABLE public.product_private FROM anon;

