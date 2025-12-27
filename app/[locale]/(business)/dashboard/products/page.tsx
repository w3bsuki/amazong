import { requireDashboardAccess, getBusinessProducts } from "@/lib/auth/business"
import { ProductsTable } from "../../_components/products-table"
import { getBusinessDashboardCategories } from "../_lib/categories"

export default async function BusinessProductsPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { products, total } = await getBusinessProducts(businessSeller.id)
  const categories = await getBusinessDashboardCategories()
  
  return (
    <ProductsTable 
      initialProducts={products}
      categories={categories}
      total={total}
      sellerId={businessSeller.id}
    />
  )
}
