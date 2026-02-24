-- Fix the ambiguous buyer_id column reference in the trigger
-- The issue is that both orders and conversations have buyer_id columns

CREATE OR REPLACE FUNCTION public.handle_new_order_item()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  product_title TEXT;
  v_buyer_id UUID;  -- Use a variable with different name
  existing_conv UUID;
BEGIN
  -- Get order details - store in a variable to avoid ambiguity
  SELECT o.user_id INTO v_buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Skip if no buyer (shouldn't happen but safety check)
  IF v_buyer_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get product details
  SELECT p.title INTO product_title
  FROM public.products p WHERE p.id = NEW.product_id;

  -- Check if conversation already exists for this order+seller combo
  -- Use fully qualified column names to avoid ambiguity
  SELECT c.id INTO existing_conv
  FROM public.conversations c
  WHERE c.order_id = NEW.order_id 
    AND c.buyer_id = v_buyer_id 
    AND c.seller_id = NEW.seller_id
  LIMIT 1;

  -- If conversation exists, just add a message for this item
  IF existing_conv IS NOT NULL THEN
    conv_id := existing_conv;
  ELSE
    -- Create new conversation
    INSERT INTO public.conversations (buyer_id, seller_id, product_id, order_id, subject, status)
    VALUES (v_buyer_id, NEW.seller_id, NEW.product_id, NEW.order_id, 
            'Order: ' || COALESCE(LEFT(product_title, 50), 'New Order'), 'open')
    RETURNING id INTO conv_id;
  END IF;

  -- Insert system message about the purchase
  INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
  VALUES (
    conv_id,
    v_buyer_id,
    '🛒 **New Order Placed!**' || E'\n\n' ||
    '📦 Product: ' || COALESCE(product_title, 'Item') || E'\n' ||
    '💰 Price: $' || NEW.price_at_purchase::TEXT || E'\n' ||
    '🔢 Quantity: ' || NEW.quantity::TEXT || E'\n' ||
    '📅 Date: ' || TO_CHAR(NOW(), 'Mon DD, YYYY at HH24:MI') || E'\n\n' ||
    '_Waiting for seller confirmation..._',
    'system'
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the order creation
  RAISE WARNING 'Error in handle_new_order_item: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;;
