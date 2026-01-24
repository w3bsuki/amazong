-- Phase C hardening: remove private/seller-only columns from public tables
--
-- Goals (minimal blast radius, staging-first):
-- 1) Move PII + fee fields off `public.profiles` → `public.private_profiles`
-- 2) Move seller-only product fields off `public.products` → `public.product_private`
-- 3) Remove `profiles.email` from `public.subscription_overview`
-- 4) Ensure `public.deal_products` never exposes seller-only fields
-- 5) Revoke EXECUTE on maintenance SECURITY DEFINER RPCs from PUBLIC/anon/authenticated

-- =============================================================================
-- 1) Private profiles (PII + fee fields)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.private_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  email text,
  phone text,
  stripe_customer_id text,
  vat_number text,
  commission_rate numeric(5, 2) DEFAULT 12.00,
  final_value_fee numeric(5, 2) DEFAULT 12.00,
  insertion_fee numeric(5, 2) DEFAULT 0,
  per_order_fee numeric(5, 2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.private_profiles ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS handle_private_profiles_updated_at ON public.private_profiles;
CREATE TRIGGER handle_private_profiles_updated_at
BEFORE UPDATE ON public.private_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP POLICY IF EXISTS private_profiles_select_own ON public.private_profiles;
CREATE POLICY private_profiles_select_own
ON public.private_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS private_profiles_insert_own ON public.private_profiles;
CREATE POLICY private_profiles_insert_own
ON public.private_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS private_profiles_update_own ON public.private_profiles;
CREATE POLICY private_profiles_update_own
ON public.private_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR is_admin())
WITH CHECK (id = auth.uid() OR is_admin());

-- =============================================================================
-- 2) Private product fields (seller-only)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.product_private (
  product_id uuid PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  cost_price numeric,
  sku varchar(100),
  barcode varchar(50),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.product_private ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS handle_product_private_updated_at ON public.product_private;
CREATE TRIGGER handle_product_private_updated_at
BEFORE UPDATE ON public.product_private
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP POLICY IF EXISTS product_private_select_own ON public.product_private;
CREATE POLICY product_private_select_own
ON public.product_private
FOR SELECT
TO authenticated
USING (seller_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS product_private_insert_own ON public.product_private;
CREATE POLICY product_private_insert_own
ON public.product_private
FOR INSERT
TO authenticated
WITH CHECK (seller_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS product_private_update_own ON public.product_private;
CREATE POLICY product_private_update_own
ON public.product_private
FOR UPDATE
TO authenticated
USING (seller_id = auth.uid() OR is_admin())
WITH CHECK (seller_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS product_private_delete_own ON public.product_private;
CREATE POLICY product_private_delete_own
ON public.product_private
FOR DELETE
TO authenticated
USING (seller_id = auth.uid() OR is_admin());

-- =============================================================================
-- 3) Backfill private tables from existing columns (before dropping)
-- =============================================================================

INSERT INTO public.private_profiles (
  id,
  email,
  phone,
  stripe_customer_id,
  vat_number,
  commission_rate,
  final_value_fee,
  insertion_fee,
  per_order_fee
)
SELECT
  id,
  email,
  phone,
  stripe_customer_id,
  vat_number,
  commission_rate,
  final_value_fee,
  insertion_fee,
  per_order_fee
FROM public.profiles
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  stripe_customer_id = EXCLUDED.stripe_customer_id,
  vat_number = EXCLUDED.vat_number,
  commission_rate = EXCLUDED.commission_rate,
  final_value_fee = EXCLUDED.final_value_fee,
  insertion_fee = EXCLUDED.insertion_fee,
  per_order_fee = EXCLUDED.per_order_fee,
  updated_at = timezone('utc'::text, now());

INSERT INTO public.product_private (
  product_id,
  seller_id,
  cost_price,
  sku,
  barcode
)
SELECT
  id,
  seller_id,
  cost_price,
  sku,
  barcode
FROM public.products
ON CONFLICT (product_id) DO UPDATE SET
  seller_id = EXCLUDED.seller_id,
  cost_price = EXCLUDED.cost_price,
  sku = EXCLUDED.sku,
  barcode = EXCLUDED.barcode,
  updated_at = timezone('utc'::text, now());

-- =============================================================================
-- 4) Keep auth/profile hydration working after dropping `profiles.email`
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

  -- Public profile surface (no PII columns)
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    role,
    username,
    display_name,
    account_type
  )
  VALUES (
    NEW.id,
    full_name_val,
    NEW.raw_user_meta_data->>'avatar_url',
    'buyer',
    username_val,
    full_name_val,
    account_type_val
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    username = COALESCE(EXCLUDED.username, public.profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    account_type = COALESCE(EXCLUDED.account_type, public.profiles.account_type, 'personal'),
    updated_at = NOW();

  -- Private profile surface (PII)
  INSERT INTO public.private_profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

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

-- =============================================================================
-- 5) Subscription functions: keep tier on profiles, fees on private_profiles
-- =============================================================================

CREATE OR REPLACE FUNCTION public.sync_seller_from_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  plan_commission numeric;
BEGIN
  plan_commission := COALESCE(
    (SELECT commission_rate FROM public.subscription_plans WHERE tier = NEW.plan_type LIMIT 1),
    12.00
  );

  IF NEW.status = 'active' THEN
    UPDATE public.profiles
    SET
      tier = NEW.plan_type,
      is_seller = TRUE,
      updated_at = NOW()
    WHERE id = NEW.seller_id;

    INSERT INTO public.private_profiles (id, commission_rate)
    VALUES (NEW.seller_id, plan_commission)
    ON CONFLICT (id) DO UPDATE SET
      commission_rate = EXCLUDED.commission_rate,
      updated_at = timezone('utc'::text, now());
  ELSIF NEW.status IN ('cancelled', 'expired') THEN
    UPDATE public.profiles
    SET
      tier = 'free',
      updated_at = NOW()
    WHERE id = NEW.seller_id;

    INSERT INTO public.private_profiles (id, commission_rate)
    VALUES (NEW.seller_id, 12.00)
    ON CONFLICT (id) DO UPDATE SET
      commission_rate = EXCLUDED.commission_rate,
      updated_at = timezone('utc'::text, now());
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Mark expired subscriptions
  UPDATE public.subscriptions
  SET status = 'expired', auto_renew = false
  WHERE status = 'active' AND expires_at < NOW();

  -- Reset seller tier to free when subscription expires
  UPDATE public.profiles p
  SET tier = 'free'
  FROM public.subscriptions sub
  WHERE sub.seller_id = p.id AND sub.status = 'expired';

  -- Reset seller fees (private surface)
  UPDATE public.private_profiles pp
  SET final_value_fee = 12.00,
      updated_at = timezone('utc'::text, now())
  FROM public.subscriptions sub
  WHERE sub.seller_id = pp.id AND sub.status = 'expired';
END;
$function$;

-- =============================================================================
-- 6) Views: remove private columns from public surfaces
-- Note: Postgres does not allow OR REPLACE to *drop* columns from an existing view.
-- =============================================================================

DROP VIEW IF EXISTS public.subscription_overview;
CREATE VIEW public.subscription_overview
WITH (security_invoker = true)
AS
SELECT
  s.id AS subscription_id,
  s.seller_id,
  s.status,
  s.starts_at,
  s.expires_at,
  s.auto_renew,
  s.plan_type,
  sp.name AS plan_name,
  sp.tier,
  sp.price_monthly,
  sp.price_yearly,
  sp.max_listings,
  sp.boosts_included,
  sp.final_value_fee,
  p.full_name
FROM public.subscriptions s
JOIN public.subscription_plans sp ON s.plan_type = sp.tier
JOIN public.profiles p ON s.seller_id = p.id;

DROP VIEW IF EXISTS public.deal_products;
CREATE VIEW public.deal_products
WITH (security_invoker = true)
AS
SELECT
  id,
  seller_id,
  category_id,
  category_ancestors,
  title,
  description,
  price,
  list_price,
  stock,
  images,
  rating,
  review_count,
  is_prime,
  search_vector,
  created_at,
  updated_at,
  tags,
  meta_title,
  meta_description,
  slug,
  brand_id,
  is_boosted,
  boost_expires_at,
  is_featured,
  listing_type,
  ships_to_bulgaria,
  ships_to_europe,
  ships_to_usa,
  ships_to_worldwide,
  pickup_only,
  attributes,
  ships_to_uk,
  status,
  weight,
  weight_unit,
  condition,
  track_inventory,
  is_on_sale,
  sale_percent,
  sale_end_date,
  free_shipping,
  is_limited_stock,
  stock_quantity,
  featured_until,
  shipping_days,
  CASE
    WHEN is_on_sale AND sale_percent > 0 THEN sale_percent
    WHEN list_price IS NOT NULL AND list_price > price THEN round((list_price - price) / list_price * 100::numeric)::integer
    ELSE 0
  END AS effective_discount
FROM public.products p
WHERE (
  is_on_sale = true
  AND sale_percent > 0
  AND (sale_end_date IS NULL OR sale_end_date > now())
)
OR (list_price IS NOT NULL AND list_price > price)
ORDER BY effective_discount DESC;

COMMENT ON VIEW public.deal_products IS 'Products currently on sale or with effective discounts. Safe public surface (no seller-only fields). Uses security_invoker for RLS compliance.';

-- =============================================================================
-- 7) Drop private/seller-only columns from public tables (close the leak)
-- =============================================================================

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS vat_number,
  DROP COLUMN IF EXISTS commission_rate,
  DROP COLUMN IF EXISTS final_value_fee,
  DROP COLUMN IF EXISTS insertion_fee,
  DROP COLUMN IF EXISTS per_order_fee;

ALTER TABLE public.products
  DROP COLUMN IF EXISTS cost_price,
  DROP COLUMN IF EXISTS sku,
  DROP COLUMN IF EXISTS barcode;

-- =============================================================================
-- 8) Maintenance RPCs: restrict EXECUTE to cron/service_role only
-- =============================================================================

REVOKE EXECUTE ON FUNCTION public.refresh_category_stats() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_boosts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.expire_listing_boosts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_subscription_expiry() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_category_stats() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_boosts() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.expire_listing_boosts() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.check_subscription_expiry() TO postgres, service_role;
