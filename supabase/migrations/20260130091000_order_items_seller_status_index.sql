-- Migration: Add composite index for seller dashboard order queries
-- Hot path: getSellerOrders() filters by seller_id + status
-- Creates now while table is small to avoid lock issues at scale

CREATE INDEX IF NOT EXISTS idx_order_items_seller_id_status
  ON public.order_items (seller_id, status);

-- NOTE: After deployment, verify via EXPLAIN that this index is used
-- Then consider dropping idx_order_items_seller_id if it becomes redundant
