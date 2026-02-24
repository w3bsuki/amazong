-- PHASE 3 — Data integrity fixes
--
-- 3a) Add missing updated_at triggers (using existing public.handle_updated_at()).
-- 3b) Ensure views are RLS-safe by enforcing security_invoker.

BEGIN;

-- -----------------------------------------------------------------------------
-- 3a) Add missing updated_at triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS set_updated_at ON public.brands;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.business_verification;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.business_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.buyer_feedback;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.buyer_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.buyer_stats;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.buyer_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.conversations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.product_variants;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.seller_feedback;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.seller_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.seller_stats;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.seller_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.subscriptions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.user_addresses;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.user_verification;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 3b) Fix view security (RLS-safe views in Postgres 15+: security_invoker)
-- -----------------------------------------------------------------------------

ALTER VIEW IF EXISTS public.deal_products SET (security_invoker = on);
ALTER VIEW IF EXISTS public.subscription_overview SET (security_invoker = on);

COMMIT;

-- Verify (run separately):
--   SELECT relname, reloptions
--   FROM pg_class
--   WHERE relname IN ('deal_products', 'subscription_overview');

