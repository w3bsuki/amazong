-- Drop the problematic policies
DROP POLICY IF EXISTS orders_select_own_or_seller ON orders;
DROP POLICY IF EXISTS order_items_select_buyer_or_seller ON order_items;

-- Create simpler, non-recursive policies for orders
-- Users can see their own orders
CREATE POLICY orders_select_own ON orders
FOR SELECT USING (auth.uid() = user_id);

-- Sellers can see orders that contain their products (using a simpler approach)
CREATE POLICY orders_select_as_seller ON orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = orders.id 
    AND p.seller_id = auth.uid()
  )
);

-- Create simpler policies for order_items
-- Buyers can see items in their own orders
CREATE POLICY order_items_select_own ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_items.order_id 
    AND o.user_id = auth.uid()
  )
);

-- Sellers can see items they sold
CREATE POLICY order_items_select_seller ON order_items
FOR SELECT USING (seller_id = auth.uid());;
