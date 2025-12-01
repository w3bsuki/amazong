-- User Addresses for saved delivery addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    label text NOT NULL DEFAULT 'Home', -- e.g., "Home", "Work", "Other"
    full_name text NOT NULL,
    phone text,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text,
    postal_code text NOT NULL,
    country text NOT NULL DEFAULT 'Bulgaria',
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Payment Methods (stores Stripe payment method references)
CREATE TABLE IF NOT EXISTS public.user_payment_methods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_method_id text NOT NULL UNIQUE,
    stripe_customer_id text NOT NULL,
    card_brand text, -- visa, mastercard, amex, etc.
    card_last4 text, -- last 4 digits
    card_exp_month integer,
    card_exp_year integer,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON public.user_addresses(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON public.user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_stripe ON public.user_payment_methods(stripe_customer_id);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_addresses
CREATE POLICY "Users can view own addresses" ON public.user_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses" ON public.user_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.user_addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.user_addresses
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_payment_methods
CREATE POLICY "Users can view own payment methods" ON public.user_payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment methods" ON public.user_payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON public.user_payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON public.user_payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION public.handle_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE public.user_addresses 
        SET is_default = false, updated_at = now()
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_default = true;
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger for default address
DROP TRIGGER IF EXISTS on_address_default_change ON public.user_addresses;
CREATE TRIGGER on_address_default_change
    BEFORE INSERT OR UPDATE OF is_default ON public.user_addresses
    FOR EACH ROW
    WHEN (NEW.is_default = true)
    EXECUTE FUNCTION public.handle_default_address();

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION public.handle_default_payment_method()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE public.user_payment_methods 
        SET is_default = false
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_default = true;
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger for default payment method
DROP TRIGGER IF EXISTS on_payment_method_default_change ON public.user_payment_methods;
CREATE TRIGGER on_payment_method_default_change
    BEFORE INSERT OR UPDATE OF is_default ON public.user_payment_methods
    FOR EACH ROW
    WHEN (NEW.is_default = true)
    EXECUTE FUNCTION public.handle_default_payment_method();

-- Add stripe_customer_id to profiles for reuse
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS phone text;

-- Update timestamp trigger for addresses
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_address_updated ON public.user_addresses;
CREATE TRIGGER on_address_updated
    BEFORE UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
