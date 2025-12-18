# Purchase Notification & Order Communication System

## ✅ IMPLEMENTATION STATUS: COMPLETE

**Implemented on:** December 2024

### What Was Built:
1. **Database Migration** - Added status columns to `order_items` table with triggers for auto-conversation creation
2. **Server Actions** - Created `app/actions/orders.ts` with `updateOrderItemStatus`, `getSellerOrders`, `getBuyerOrders`
3. **UI Components** - Built `order-status-badge.tsx` and `order-status-actions.tsx`
4. **Seller Orders Page** - Created `/sell/orders` route for order management
5. **Buyer Orders Enhanced** - Updated `account-orders-grid.tsx` with item status and chat links
6. **Chat System Messages** - Enhanced `chat-interface.tsx` with beautiful system message styling

### Key Files:
- `lib/order-status.ts` - Status types, colors, and utilities
- `app/actions/orders.ts` - Server actions for order management
- `components/order-status-badge.tsx` - Status badge component
- `components/order-status-actions.tsx` - Actions dropdown with shipping dialog
- `app/[locale]/(sell)/sell/orders/` - Seller orders management page

---

## Executive Summary

This document outlines the implementation plan for a complete buyer-seller order communication system. When a purchase is made, both parties receive notifications through the chat system, can track order status, and communicate through a unified interface.

---

## Current State Analysis

### Existing Infrastructure ✅
- **Orders table**: `orders` with status tracking (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`)
- **Order Items**: `order_items` linking orders to products and sellers
- **Conversations**: Buyer-seller messaging with `order_id` support
- **Messages**: Support for `text`, `image`, `system`, and `order_update` types
- **Real-time**: Supabase Realtime already configured for messages
- **Chat UI**: Full messaging interface at `/chat`

### What's Missing ❌
1. **Order Item Level Status**: Each seller needs to track their own items separately
2. **Auto-conversation creation**: On purchase completion
3. **System messages**: Automated order updates in chat
4. **Seller Order Management**: UI for sellers to manage incoming orders
5. **Buyer Order Tracking**: Enhanced status visibility with chat integration
6. **Real-time notifications**: When order status changes

---

## Architecture Decision: Chat-Centric Communication

### Decision: All order updates flow through Chat ✅

**Why?**
1. **Single source of truth**: Users check one place for all communication
2. **Message history**: Complete audit trail of order lifecycle
3. **Real-time**: Existing Realtime infrastructure handles notifications
4. **Mobile-friendly**: Chat UI already optimized for mobile
5. **Simple UX**: Users understand chat paradigms

**Implementation**:
- Order status changes → System message in chat
- Users get unread count badges → Navigate to chat
- Orders page shows current status but links to chat for communication

---

## Database Schema Changes

### 1. Add `order_item_status` to `order_items` table

```sql
-- Migration: 20251213000001_order_item_status.sql

-- Add status tracking per order item (each seller manages their own items)
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'received', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Add timestamps for status changes
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS seller_received_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT;

-- Index for seller order queries
CREATE INDEX IF NOT EXISTS idx_order_items_status ON public.order_items(status);
CREATE INDEX IF NOT EXISTS idx_order_items_seller_status ON public.order_items(seller_id, status);

COMMENT ON COLUMN public.order_items.status IS 'Order item status: pending (new), received (seller acknowledged), processing (preparing), shipped (sent to courier), delivered (confirmed), cancelled';
```

### 2. Add RLS Policies for Order Item Updates

```sql
-- Sellers can update their own order items
CREATE POLICY "sellers_update_own_order_items"
  ON public.order_items FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());
```

### 3. Database Trigger for Auto-Conversation on Order

```sql
-- Trigger function to create conversation and send system message on new order item
CREATE OR REPLACE FUNCTION public.handle_new_order_item()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  product_title TEXT;
  product_url TEXT;
  order_total NUMERIC;
  buyer_id UUID;
BEGIN
  -- Get order details
  SELECT o.user_id, o.total_amount INTO buyer_id, order_total
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Get product details
  SELECT p.title INTO product_title
  FROM public.products p WHERE p.id = NEW.product_id;

  -- Check if conversation already exists for this order
  SELECT id INTO conv_id
  FROM public.conversations
  WHERE order_id = NEW.order_id 
    AND buyer_id = buyer_id 
    AND seller_id = NEW.seller_id
  LIMIT 1;

  -- If no conversation, create one
  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (buyer_id, seller_id, product_id, order_id, subject, status)
    VALUES (buyer_id, NEW.seller_id, NEW.product_id, NEW.order_id, 
            'Order: ' || LEFT(product_title, 50), 'open')
    RETURNING id INTO conv_id;
  END IF;

  -- Insert system message about the purchase
  INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
  VALUES (
    conv_id,
    buyer_id, -- Buyer initiated the purchase
    '🛒 **New Order Placed!**\n\n' ||
    '📦 Product: ' || product_title || '\n' ||
    '💰 Price: $' || NEW.price_at_purchase::TEXT || '\n' ||
    '📅 Date: ' || TO_CHAR(NOW(), 'Mon DD, YYYY at HH24:MI') || '\n' ||
    '🔢 Quantity: ' || NEW.quantity::TEXT || '\n\n' ||
    '_Order ID: ' || LEFT(NEW.order_id::TEXT, 8) || '..._',
    'system'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS on_order_item_created ON public.order_items;
CREATE TRIGGER on_order_item_created
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order_item();
```

### 4. Trigger for Status Change Notifications

```sql
-- Trigger function to send system message on order item status change
CREATE OR REPLACE FUNCTION public.handle_order_item_status_change()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  buyer_id UUID;
  status_emoji TEXT;
  status_message TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get buyer_id from order
  SELECT o.user_id INTO buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Find the conversation
  SELECT id INTO conv_id
  FROM public.conversations
  WHERE order_id = NEW.order_id 
    AND buyer_id = buyer_id 
    AND seller_id = NEW.seller_id
  LIMIT 1;

  -- Set emoji and message based on status
  CASE NEW.status
    WHEN 'received' THEN
      status_emoji := '✅';
      status_message := 'Seller has confirmed your order!';
      NEW.seller_received_at := NOW();
    WHEN 'processing' THEN
      status_emoji := '📦';
      status_message := 'Your order is being prepared for shipping.';
    WHEN 'shipped' THEN
      status_emoji := '🚚';
      status_message := 'Your order has been shipped!' || 
        CASE WHEN NEW.tracking_number IS NOT NULL 
          THEN E'\n📍 Tracking: ' || NEW.tracking_number 
          ELSE '' 
        END;
      NEW.shipped_at := NOW();
    WHEN 'delivered' THEN
      status_emoji := '🎉';
      status_message := 'Your order has been delivered!';
      NEW.delivered_at := NOW();
    WHEN 'cancelled' THEN
      status_emoji := '❌';
      status_message := 'This order has been cancelled.';
    ELSE
      status_emoji := '📋';
      status_message := 'Order status updated to: ' || NEW.status;
  END CASE;

  -- Insert system message if conversation exists
  IF conv_id IS NOT NULL THEN
    INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
    VALUES (
      conv_id,
      NEW.seller_id, -- Status changes come from seller
      status_emoji || ' **Order Update**\n\n' || status_message,
      'system'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS on_order_item_status_change ON public.order_items;
CREATE TRIGGER on_order_item_status_change
  BEFORE UPDATE OF status ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_item_status_change();
```

---

## Implementation Files

### File Structure
```
app/
  actions/
    orders.ts                    # NEW: Server actions for order management
  [locale]/
    (account)/
      account/
        orders/
          page.tsx               # MODIFY: Add chat link, status details
    (main)/
      sell/
        orders/
          page.tsx               # NEW: Seller order management
    (chat)/
      chat/
        page.tsx                 # EXISTING: Already handles order conversations

components/
  seller-orders-list.tsx         # NEW: Seller order management component
  order-status-badge.tsx         # NEW: Reusable status badge
  order-status-actions.tsx       # NEW: Seller action buttons
  
lib/
  order-status.ts                # NEW: Status utilities and types
```

---

## Implementation Steps

### Phase 1: Database Migration (Day 1)
1. ✅ Create migration file for `order_items` status columns
2. ✅ Add RLS policies for seller updates
3. ✅ Create triggers for auto-conversation and status messages

### Phase 2: Server Actions (Day 1-2)
1. Create `updateOrderItemStatus` action
2. Create `getSellerOrders` action  
3. Create `getBuyerOrdersWithStatus` action

### Phase 3: Seller Orders Page (Day 2)
1. Create `/sell/orders` route
2. Build `seller-orders-list.tsx` component
3. Add "Mark as Received", "Mark as Shipped" buttons
4. Add tracking number input for shipped status

### Phase 4: Buyer Orders Enhancement (Day 2-3)
1. Modify buyer orders page to show item-level status
2. Add "Open Chat" button for each order
3. Add status timeline view

### Phase 5: Chat Integration (Day 3)
1. Style system messages differently
2. Add order context header in chat
3. Filter conversations by order

---

## Server Actions Implementation

### `app/actions/orders.ts`

```typescript
"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type OrderItemStatus = 
  | "pending" 
  | "received" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled"

// Seller updates order item status
export async function updateOrderItemStatus(
  orderItemId: string,
  status: OrderItemStatus,
  trackingNumber?: string,
  shippingCarrier?: string
) {
  const supabase = await createClient()
  if (!supabase) return { error: "Database connection failed" }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Verify seller owns this order item
  const { data: orderItem } = await supabase
    .from("order_items")
    .select("id, seller_id, order_id")
    .eq("id", orderItemId)
    .eq("seller_id", user.id)
    .single()

  if (!orderItem) return { error: "Order item not found or not authorized" }

  // Update status
  const updateData: Record<string, unknown> = { status }
  if (trackingNumber) updateData.tracking_number = trackingNumber
  if (shippingCarrier) updateData.shipping_carrier = shippingCarrier

  const { error } = await supabase
    .from("order_items")
    .update(updateData)
    .eq("id", orderItemId)

  if (error) return { error: error.message }

  revalidatePath("/sell/orders")
  revalidatePath("/account/orders")
  revalidatePath("/chat")

  return { success: true }
}

// Get orders for seller
export async function getSellerOrders(status?: OrderItemStatus | "all") {
  const supabase = await createClient()
  if (!supabase) return { error: "Database connection failed", orders: [] }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", orders: [] }

  let query = supabase
    .from("order_items")
    .select(`
      id,
      order_id,
      product_id,
      quantity,
      price_at_purchase,
      status,
      seller_received_at,
      shipped_at,
      delivered_at,
      tracking_number,
      shipping_carrier,
      orders!inner (
        id,
        created_at,
        shipping_address,
        user_id,
        profiles:user_id (
          email,
          full_name
        )
      ),
      products (
        id,
        title,
        images
      )
    `)
    .eq("seller_id", user.id)
    .order("orders(created_at)", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) return { error: error.message, orders: [] }

  return { orders: data || [], error: null }
}
```

---

## UI Components

### Order Status Badge

```tsx
// components/order-status-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  pending: { label: "New Order", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  received: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-700 border-purple-200" },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200" },
}

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  return (
    <Badge variant="outline" className={cn("font-medium", config.color)}>
      {config.label}
    </Badge>
  )
}
```

### Seller Order Actions

```tsx
// components/order-status-actions.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateOrderItemStatus } from "@/app/actions/orders"
import { toast } from "sonner"

export function OrderStatusActions({ 
  orderItemId, 
  currentStatus 
}: { 
  orderItemId: string
  currentStatus: string 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    const result = await updateOrderItemStatus(
      orderItemId,
      newStatus as any,
      newStatus === "shipped" ? trackingNumber : undefined
    )
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Order status updated!")
    }
  }

  if (currentStatus === "pending") {
    return (
      <Button 
        onClick={() => handleStatusUpdate("received")}
        disabled={isLoading}
        size="sm"
      >
        ✅ Confirm Order
      </Button>
    )
  }

  if (currentStatus === "received") {
    return (
      <div className="flex gap-2 items-center">
        <Input 
          placeholder="Tracking # (optional)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-40"
        />
        <Button 
          onClick={() => handleStatusUpdate("shipped")}
          disabled={isLoading}
          size="sm"
        >
          🚚 Mark as Shipped
        </Button>
      </div>
    )
  }

  if (currentStatus === "shipped") {
    return (
      <Button 
        onClick={() => handleStatusUpdate("delivered")}
        disabled={isLoading}
        size="sm"
        variant="outline"
      >
        🎉 Confirm Delivery
      </Button>
    )
  }

  return null
}
```

---

## User Flow Diagrams

### Buyer Flow
```
1. Buyer completes checkout
   ↓
2. Order created → order_items created
   ↓
3. Trigger creates conversation + system message
   ↓
4. Buyer sees notification badge on Messages icon
   ↓
5. Buyer opens /chat → sees order conversation
   ↓
6. Seller marks "received" → system message appears
   ↓
7. Seller marks "shipped" → system message with tracking
   ↓
8. Buyer can also check /account/orders for status overview
```

### Seller Flow
```
1. New order arrives
   ↓
2. Notification badge appears on Messages icon
   ↓
3. Seller opens /chat → sees new order conversation
   ↓
4. OR: Seller opens /sell/orders → sees pending orders
   ↓
5. Seller clicks "Confirm Order" → status = received
   ↓
6. System message sent to buyer in chat
   ↓
7. Seller prepares order, clicks "Mark as Shipped"
   ↓
8. Enters tracking number (optional)
   ↓
9. System message sent to buyer
   ↓
10. Buyer confirms delivery OR auto-delivered after 7 days
```

---

## Message Types Display

### System Message Styling

```tsx
// In chat-interface.tsx, add special styling for system messages:

function MessageBubble({ message }: { message: Message }) {
  if (message.message_type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted/50 rounded-lg px-4 py-3 max-w-sm text-center border border-border/50">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {/* Parse markdown-like formatting */}
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={cn(
                line.startsWith('**') && line.endsWith('**') && "font-semibold text-foreground",
                line.startsWith('_') && line.endsWith('_') && "italic text-xs"
              )}>
                {line.replace(/\*\*/g, '').replace(/_/g, '')}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  }
  // ... regular message bubble
}
```

---

## Routes Summary

| Route | Purpose | User |
|-------|---------|------|
| `/chat` | All conversations, order updates | Both |
| `/account/orders` | Order history, status overview | Buyer |
| `/sell/orders` | Incoming orders management | Seller |
| `/account/sales` | Sales analytics (existing) | Seller |

---

## Implementation Priority

### Must Have (MVP)
1. ✅ Database migration for order_item status
2. ✅ Auto-conversation trigger on order
3. ✅ Status change → system message trigger
4. ✅ Seller orders page with status actions
5. ✅ "Open Chat" button on buyer orders

### Nice to Have (v2)
- Email notifications for status changes
- Push notifications (if PWA)
- Tracking number validation
- Auto-delivery confirmation after X days
- Buyer feedback/review prompt after delivery

---

## Testing Checklist

- [ ] Create test purchase: radevalentin@gmail.com buys from Indecisive Wear
- [ ] Verify conversation auto-created
- [ ] Verify system message appears in chat
- [ ] Seller marks as received → verify notification
- [ ] Seller marks as shipped with tracking → verify notification
- [ ] Check buyer orders page shows correct status
- [ ] Check seller orders page shows correct status
- [ ] Real-time updates work (no page refresh needed)

---

## Security Considerations

1. **RLS Policies**: Only sellers can update their own order items
2. **Server Actions**: Verify user ownership before any update
3. **Triggers**: Run as SECURITY DEFINER but with restricted search_path
4. **No Sensitive Data**: Don't expose full addresses in chat messages

---

## Estimated Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 2-3 hours | Database migration & triggers |
| Phase 2 | 3-4 hours | Server actions & API |
| Phase 3 | 4-5 hours | Seller orders UI |
| Phase 4 | 3-4 hours | Buyer orders enhancement |
| Phase 5 | 2-3 hours | Chat system message styling |
| **Total** | **14-19 hours** | Full implementation |

---

## Next Steps

1. Review and approve this plan
2. Run database migration
3. Implement server actions
4. Build UI components
5. Test end-to-end flow
6. Deploy to production
