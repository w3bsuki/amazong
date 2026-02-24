-- Add stripe_payment_intent_id column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Update status check constraint to include 'paid' status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text]));

-- Add index for faster lookup by payment intent
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent 
ON orders(stripe_payment_intent_id);;
