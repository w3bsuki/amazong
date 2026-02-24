
-- Restore indexes for foreign keys - these are needed for FK performance
-- The "unused" status was because these are newer tables with low usage

CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_business_verification_verified_by ON business_verification(verified_by) WHERE verified_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_order_id ON buyer_feedback(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON conversations(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listing_boosts_product_id ON listing_boosts(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_product_id ON notifications(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_conversation_id ON notifications(conversation_id) WHERE conversation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_seller_feedback_order_id ON seller_feedback(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
;
