import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductEditClient } from "./_components/product-edit-client"
import { getBusinessDashboardCategories } from "../../../_lib/categories"

export default async function BusinessProductEditPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  const seller = await requireDashboardAccess()
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, title, description, price, list_price, cost_price, sku, barcode, stock, track_inventory, category_id, status, weight, weight_unit, condition, images"
    )
    .eq("id", productId)
    .eq("seller_id", seller.id)
    .single()

  if (!product) {
    notFound()
  }

  const categories = await getBusinessDashboardCategories()

  return <ProductEditClient product={product} categories={categories} />
}
