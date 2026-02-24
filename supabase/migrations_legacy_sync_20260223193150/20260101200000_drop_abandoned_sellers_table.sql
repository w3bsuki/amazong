-- Phase 1 cleanup: remove abandoned `public.sellers` table (legacy identity system)
--
-- Production already uses `public.profiles` as the single identity table for sellers.
-- This migration is intentionally idempotent and only runs if `public.sellers` exists
-- (e.g. in older local DBs created from early migrations).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'sellers'
  ) THEN
    -- Best-effort data migration from legacy sellers table into profiles.
    -- Only fills blanks; does not overwrite existing profile fields.
    UPDATE public.profiles p
    SET
      is_seller = TRUE,
      verified = COALESCE(p.verified, FALSE) OR COALESCE(s.verified, FALSE),
      display_name = COALESCE(p.display_name, s.store_name),
      bio = COALESCE(p.bio, s.description)
    FROM public.sellers s
    WHERE s.id = p.id;

    -- Re-point known seller_id foreign keys from sellers(id) -> profiles(id).
    -- Use IF EXISTS to keep this safe across environments.
    ALTER TABLE IF EXISTS public.products
      DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
    ALTER TABLE IF EXISTS public.products
      ADD CONSTRAINT products_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.order_items
      DROP CONSTRAINT IF EXISTS order_items_seller_id_fkey;
    ALTER TABLE IF EXISTS public.order_items
      ADD CONSTRAINT order_items_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.store_followers
      DROP CONSTRAINT IF EXISTS store_followers_seller_id_fkey;
    ALTER TABLE IF EXISTS public.store_followers
      ADD CONSTRAINT store_followers_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.subscriptions
      DROP CONSTRAINT IF EXISTS subscriptions_seller_id_fkey;
    ALTER TABLE IF EXISTS public.subscriptions
      ADD CONSTRAINT subscriptions_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.listing_boosts
      DROP CONSTRAINT IF EXISTS listing_boosts_seller_id_fkey;
    ALTER TABLE IF EXISTS public.listing_boosts
      ADD CONSTRAINT listing_boosts_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.seller_feedback
      DROP CONSTRAINT IF EXISTS seller_feedback_seller_id_fkey;
    ALTER TABLE IF EXISTS public.seller_feedback
      ADD CONSTRAINT seller_feedback_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.buyer_feedback
      DROP CONSTRAINT IF EXISTS buyer_feedback_seller_id_fkey;
    ALTER TABLE IF EXISTS public.buyer_feedback
      ADD CONSTRAINT buyer_feedback_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.business_verification
      DROP CONSTRAINT IF EXISTS business_verification_seller_id_fkey;
    ALTER TABLE IF EXISTS public.business_verification
      ADD CONSTRAINT business_verification_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    ALTER TABLE IF EXISTS public.seller_stats
      DROP CONSTRAINT IF EXISTS seller_stats_seller_id_fkey;
    ALTER TABLE IF EXISTS public.seller_stats
      ADD CONSTRAINT seller_stats_seller_id_fkey
      FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

    -- Finally, drop the legacy table.
    DROP TABLE public.sellers CASCADE;
  END IF;
END $$;
