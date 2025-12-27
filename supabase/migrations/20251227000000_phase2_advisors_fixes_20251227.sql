-- Phase 2 (Supabase): resolve current advisor warnings
-- Date: 2025-12-27

begin;

-- SECURITY: pin search_path to avoid role-mutable search_path
alter function public.set_notification_preferences_updated_at()
set search_path = public;

-- PERFORMANCE: avoid auth.* being re-evaluated per row in RLS
alter policy "Users can view own notification preferences"
  on public.notification_preferences
  using ((select auth.uid()) = user_id);

alter policy "Users can insert own notification preferences"
  on public.notification_preferences
  with check ((select auth.uid()) = user_id);

alter policy "Users can update own notification preferences"
  on public.notification_preferences
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- PERFORMANCE: cover FK lookups on cart_items.product_id
create index if not exists idx_cart_items_product_id
  on public.cart_items(product_id);

-- PERFORMANCE: remove duplicate wishlist unique index (keep the existing unique index)
drop index if exists public.idx_wishlists_user_product_unique;

commit;
