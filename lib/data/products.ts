import "server-only"

export type { Product, UIProduct } from "./products/types"

export { normalizeProductRow, toUI } from "./products/normalize"

export {
  getBoostedProducts,
  getCategoryRowProducts,
  getNewestProducts,
  getProducts,
  getProductsByCategorySlug,
} from "./products/queries"
