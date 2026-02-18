import { requireDashboardAccess, getBusinessProducts } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { bulkDeleteProducts, bulkUpdateProductStatus } from "@/app/actions/products-bulk"
import { createProduct, duplicateProduct } from "@/app/actions/products-create"
import { deleteProduct, updateProduct } from "@/app/actions/products-update"
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
