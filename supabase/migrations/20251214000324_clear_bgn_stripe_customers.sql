-- Clear old BGN Stripe customer IDs so new EUR customers get created
-- The old customer cus_TWVStXyTX33umH has BGN currency locked
UPDATE sellers SET stripe_customer_id = NULL WHERE stripe_customer_id IS NOT NULL;;
