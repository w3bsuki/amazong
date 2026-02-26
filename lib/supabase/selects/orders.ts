export const ORDER_ITEM_LIST_SELECT = `
  id,
  order_id,
  product_id,
  seller_id,
  quantity,
  price_at_purchase,
  status,
  seller_received_at,
  shipped_at,
  delivered_at,
  tracking_number,
  shipping_carrier,
  product:products(id, title, images, slug),
  order:orders(id, user_id, total_amount, status, shipping_address, created_at)
` as const

export const ORDER_ITEM_DETAIL_SELECT = `
  id,
  order_id,
  product_id,
  seller_id,
  quantity,
  price_at_purchase,
  status,
  seller_received_at,
  shipped_at,
  delivered_at,
  tracking_number,
  shipping_carrier,
  product:products(id, title, images, slug),
  seller:profiles!order_items_seller_id_fkey(id, full_name, avatar_url, username)
` as const

