-- Fix the trigger function to not rely on auth.uid() since it may be called
-- from service_role context where auth.uid() returns null
-- Instead, we get the buyer from the order itself

CREATE OR REPLACE FUNCTION public.handle_new_order_item()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  product_title TEXT;
  v_buyer_id UUID;
  existing_conv UUID;
BEGIN
  -- Get buyer from the order (not from auth context)
  SELECT o.user_id INTO v_buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Skip if no buyer
  IF v_buyer_id IS NULL THEN
    RAISE WARNING 'No buyer found for order: %', NEW.order_id;
    RETURN NEW;
  END IF;

  -- Get product details
  SELECT p.title INTO product_title
  FROM public.products p WHERE p.id = NEW.product_id;

  -- Check if conversation already exists for this order+seller combo
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
    -- Create new conversation - INSERT directly bypassing RLS since we're SECURITY DEFINER
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
  -- Log error with more details
  RAISE WARNING 'Error in handle_new_order_item for order % item %: % (SQLSTATE: %)', 
    NEW.order_id, NEW.id, SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Make sure RLS doesn't block the trigger by temporarily disabling it for this operation
-- Or grant the trigger function execution role
ALTER FUNCTION public.handle_new_order_item() SET row_security = off;;
