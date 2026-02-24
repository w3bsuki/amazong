-- Add missing indexes on foreign keys for optimal performance
-- These indexes are recommended by Supabase advisor for JOIN performance

-- business_verification.verified_by_fkey
CREATE INDEX IF NOT EXISTS idx_business_verification_verified_by 
ON public.business_verification(verified_by);

-- buyer_feedback.order_id_fkey
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_order_id 
ON public.buyer_feedback(order_id);

-- cart_items.product_id_fkey
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id 
ON public.cart_items(product_id);

-- conversations.order_id_fkey
CREATE INDEX IF NOT EXISTS idx_conversations_order_id 
ON public.conversations(order_id);

-- listing_boosts.product_id_fkey
CREATE INDEX IF NOT EXISTS idx_listing_boosts_product_id 
ON public.listing_boosts(product_id);

-- notifications (multiple FKs)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
ON public.notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_order_id 
ON public.notifications(order_id);

CREATE INDEX IF NOT EXISTS idx_notifications_product_id 
ON public.notifications(product_id);

CREATE INDEX IF NOT EXISTS idx_notifications_conversation_id 
ON public.notifications(conversation_id);

-- order_items.product_id_fkey
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
ON public.order_items(product_id);

-- product_variants.product_id_fkey
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
ON public.product_variants(product_id);

-- seller_feedback.order_id_fkey
CREATE INDEX IF NOT EXISTS idx_seller_feedback_order_id 
ON public.seller_feedback(order_id);

-- user_badges.badge_id_fkey
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id 
ON public.user_badges(badge_id);

-- wishlists.product_id_fkey
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id 
ON public.wishlists(product_id);;
