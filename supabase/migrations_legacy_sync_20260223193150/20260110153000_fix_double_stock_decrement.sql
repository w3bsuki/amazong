-- Fix: prevent double stock decrement on checkout
--
-- The table public.order_items historically had BOTH:
-- - BEFORE INSERT trigger: trg_order_items_decrement_stock -> order_items_decrement_stock()
-- - AFTER  INSERT trigger: update_product_stock_on_order   -> update_product_stock()
--
-- This caused stock to be decremented twice per order item (and was variant-unaware).
-- Keep the BEFORE trigger (variant-aware, atomic guard) and remove the legacy AFTER trigger.

DROP TRIGGER IF EXISTS update_product_stock_on_order ON public.order_items;
