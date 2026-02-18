import type { ProductFormData } from "./product-form-modal"
import type { Product } from "./products-table.types"

export function toUpdatedProduct(previous: Product, data: ProductFormData): Product {
  return {
    ...previous,
    title: data.title,
    price: data.price,
    list_price: data.compareAtPrice || null,
    cost_price: data.costPrice || null,
    sku: data.sku || null,
    barcode: data.barcode || null,
    stock: data.stock,
    track_inventory: data.trackInventory ?? true,
    status: data.status || "draft",
    weight: data.weight || null,
    weight_unit: data.weightUnit || "kg",
    condition: data.condition || "new",
    images: data.images,
    category_id: data.categoryId || null,
    updated_at: new Date().toISOString(),
  }
}

export function toNewProduct(productId: string, data: ProductFormData): Product {
  return {
    id: productId,
    title: data.title,
    slug: null,
    price: data.price,
    list_price: data.compareAtPrice || null,
    cost_price: data.costPrice || null,
    sku: data.sku || null,
    barcode: data.barcode || null,
    stock: data.stock,
    track_inventory: data.trackInventory ?? true,
    status: data.status || "draft",
    weight: data.weight || null,
    weight_unit: data.weightUnit || "kg",
    condition: data.condition || "new",
    images: data.images,
    rating: null,
    review_count: null,
    created_at: new Date().toISOString(),
    category_id: data.categoryId || null,
  }
}
