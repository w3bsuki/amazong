
-- Fix function search_path security warnings with correct signatures
ALTER FUNCTION public.get_category_hierarchy(p_slug text, p_depth integer) SET search_path = public;
ALTER FUNCTION public.transliterate_bulgarian(input_text text) SET search_path = public;
ALTER FUNCTION public.generate_product_slug(title text, product_id uuid) SET search_path = public;
ALTER FUNCTION public.auto_generate_product_slug() SET search_path = public;
ALTER FUNCTION public.generate_store_slug(store_name text) SET search_path = public;
ALTER FUNCTION public.auto_generate_store_slug() SET search_path = public;
;
