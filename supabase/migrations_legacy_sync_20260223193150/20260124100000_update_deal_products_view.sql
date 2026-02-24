-- Update deal_products view to:
-- - include category_ancestors (so category filters can query the view)
-- - exclude expired explicit sales (sale_end_date <= now())
--
-- This keeps Deals semantics consistent across API, search, and count endpoints.

DROP VIEW IF EXISTS public.deal_products;

CREATE VIEW public.deal_products
WITH (security_invoker = true)
AS
SELECT 
    id,
    seller_id,
    category_id,
    category_ancestors,
    title,
    description,
    price,
    list_price,
    stock,
    images,
    rating,
    review_count,
    search_vector,
    created_at,
    updated_at,
    tags,
    meta_title,
    meta_description,
    slug,
    brand_id,
    is_boosted,
    boost_expires_at,
    is_featured,
    listing_type,
    ships_to_bulgaria,
    ships_to_europe,
    ships_to_usa,
    ships_to_worldwide,
    pickup_only,
    attributes,
    ships_to_uk,
    sku,
    barcode,
    status,
    cost_price,
    weight,
    weight_unit,
    condition,
    track_inventory,
    is_on_sale,
    sale_percent,
    sale_end_date,
    free_shipping,
    is_prime,
    is_limited_stock,
    stock_quantity,
    featured_until,
    shipping_days,
    CASE
        WHEN is_on_sale AND sale_percent > 0 THEN sale_percent
        WHEN list_price IS NOT NULL AND list_price > price THEN round((list_price - price) / list_price * 100::numeric)::integer
        ELSE 0
    END AS effective_discount
FROM public.products p
WHERE (
    is_on_sale = true
    AND sale_percent > 0
    AND (sale_end_date IS NULL OR sale_end_date > now())
  )
   OR (list_price IS NOT NULL AND list_price > price)
ORDER BY (
    CASE
        WHEN is_on_sale AND sale_percent > 0 THEN sale_percent
        WHEN list_price IS NOT NULL AND list_price > price THEN round((list_price - price) / list_price * 100::numeric)::integer
        ELSE 0
    END
) DESC;

COMMENT ON VIEW public.deal_products IS 'Products currently on sale or with effective discounts. Uses security_invoker for RLS compliance.';

