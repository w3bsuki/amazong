-- Phase 4: Notifications System for Purchase, Order, and Message notifications
-- Following Next.js 16 best practices with server actions for cache invalidation

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'order_status', 'message', 'review', 'system', 'promotion')),
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  -- Links to related entities
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  -- Read status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Optional expiry for promotions
  expires_at TIMESTAMPTZ
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(user_id, type);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());

COMMENT ON TABLE public.notifications IS 'User notifications for purchases, order status changes, messages, and system alerts';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get unread notification count for a user
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM notifications
  WHERE user_id = auth.uid()
    AND is_read = false
    AND (expires_at IS NULL OR expires_at > now());
$$;

GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;

-- Mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = now()
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_notification_read(UUID) TO authenticated;

-- Mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  WITH updated AS (
    UPDATE notifications
    SET is_read = true, read_at = now()
    WHERE user_id = auth.uid()
      AND is_read = false
    RETURNING id
  )
  SELECT COUNT(*) INTO updated_count FROM updated;
  
  RETURN updated_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read() TO authenticated;

-- ============================================================================
-- TRIGGER: Auto-create notification on new message (except for sender)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv RECORD;
  recipient_id UUID;
  sender_name TEXT;
  conv_subject TEXT;
BEGIN
  -- Get conversation details
  SELECT * INTO conv FROM conversations WHERE id = NEW.conversation_id;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Determine recipient (the other party)
  IF NEW.sender_id = conv.buyer_id THEN
    recipient_id := conv.seller_id;
  ELSE
    recipient_id := conv.buyer_id;
  END IF;
  
  -- Get sender name
  SELECT full_name INTO sender_name 
  FROM profiles 
  WHERE id = NEW.sender_id;
  
  -- Get conversation subject or product title
  conv_subject := COALESCE(conv.subject, 'New message');
  
  -- Don't create notification for system messages
  IF NEW.message_type = 'system' THEN
    RETURN NEW;
  END IF;
  
  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, body, conversation_id, data)
  VALUES (
    recipient_id,
    'message',
    COALESCE(sender_name, 'Someone') || ' sent you a message',
    LEFT(NEW.content, 100),
    NEW.conversation_id,
    jsonb_build_object(
      'sender_id', NEW.sender_id,
      'sender_name', sender_name,
      'message_preview', LEFT(NEW.content, 100)
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger (if not exists pattern)
DROP TRIGGER IF EXISTS on_message_notify ON public.messages;
CREATE TRIGGER on_message_notify
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();

-- ============================================================================
-- TRIGGER: Auto-create notification on order status change
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  buyer_id UUID;
  product_title TEXT;
  status_title TEXT;
  status_body TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get buyer_id from order
  SELECT o.user_id INTO buyer_id
  FROM orders o WHERE o.id = NEW.order_id;
  
  -- Get product title
  SELECT p.title INTO product_title
  FROM products p WHERE p.id = NEW.product_id;
  
  -- Set notification content based on status
  CASE NEW.status
    WHEN 'received' THEN
      status_title := 'Order Confirmed';
      status_body := 'Seller has received your order for ' || COALESCE(product_title, 'your item');
    WHEN 'processing' THEN
      status_title := 'Order Processing';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' is being prepared';
    WHEN 'shipped' THEN
      status_title := 'Order Shipped! 📦';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' is on its way';
    WHEN 'delivered' THEN
      status_title := 'Order Delivered ✓';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' has been delivered';
    WHEN 'cancelled' THEN
      status_title := 'Order Cancelled';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' has been cancelled';
    ELSE
      RETURN NEW; -- Don't notify for other statuses
  END CASE;
  
  -- Create notification for buyer
  INSERT INTO notifications (user_id, type, title, body, order_id, product_id, data)
  VALUES (
    buyer_id,
    'order_status',
    status_title,
    status_body,
    NEW.order_id,
    NEW.product_id,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'tracking_number', NEW.tracking_number,
      'shipping_carrier', NEW.shipping_carrier
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_order_item_status_change_notify ON public.order_items;
CREATE TRIGGER on_order_item_status_change_notify
  AFTER UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_order_status_change();
