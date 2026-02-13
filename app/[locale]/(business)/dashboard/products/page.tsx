import { requireDashboardAccess, getBusinessProducts } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import {
  bulkDeleteProducts,
  bulkUpdateProductStatus,
  createProduct,
  deleteProduct,
  duplicateProduct,
  updateProduct,
} from "@/app/actions/products"
import { ProductsTable } from "../../_components/products-table"
import { getBusinessDashboardCategories } from "../_lib/categories"

export default async function BusinessProductsPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { products, total } = await getBusinessProducts(businessSeller.id)
  const categories = await getBusinessDashboardCategories()
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", businessSeller.id)
    .maybeSingle()
  
  return (
    <ProductsTable 
      initialProducts={products}
      categories={categories}
      total={total}
      sellerId={businessSeller.id}
      sellerUsername={profile?.username ?? null}
      actions={{
        createProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        bulkUpdateProductStatus,
        duplicateProduct,
      }}
    />
  )
}
