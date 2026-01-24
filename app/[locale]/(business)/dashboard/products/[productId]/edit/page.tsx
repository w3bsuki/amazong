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

  const [{ data: product }, { data: productPrivate }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, title, description, price, list_price, stock, track_inventory, category_id, status, weight, weight_unit, condition, images"
      )
      .eq("id", productId)
      .eq("seller_id", seller.id)
      .single(),

    supabase
      .from("product_private")
      .select("cost_price, sku, barcode")
      .eq("product_id", productId)
      .eq("seller_id", seller.id)
      .maybeSingle(),
  ])

  if (!product) {
    notFound()
  }

  const productWithPrivate = {
    ...product,
    cost_price: productPrivate?.cost_price ?? null,
    sku: productPrivate?.sku ?? null,
    barcode: productPrivate?.barcode ?? null,
  }

  const categories = await getBusinessDashboardCategories()

  return <ProductEditClient product={productWithPrivate} categories={categories} />
}
