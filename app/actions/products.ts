"use server"

export type { ActionResult, ProductAttributeInput, ProductInput } from "./products-shared"
export { bulkDeleteProducts, bulkUpdateProductStatus } from "./products-bulk"
export { createProduct, duplicateProduct } from "./products-create"
export { clearProductDiscount, setProductDiscountPrice } from "./products-discounts"
export { deleteProduct, updateProduct } from "./products-update"

