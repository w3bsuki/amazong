"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProductFormModal, type ProductFormData } from "../../../../../_components/product-form-modal"
import { updateProduct } from "../../../../../../../actions/products"

type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order?: number | null
  children?: Category[]
}

type Product = {
  id: string
  title: string
  description?: string | null
  price: number
  list_price?: number | null
  cost_price?: number | null
  sku?: string | null
  barcode?: string | null
  stock: number
  track_inventory?: boolean | null
  category_id?: string | null
  status?: string | null
  weight?: number | null
  weight_unit?: string | null
  condition?: string | null
  images?: string[] | null
}

export function ProductEditClient({
  product,
  categories,
}: {
  product: Product
  categories: Category[]
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      router.push("/dashboard/inventory")
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true)
    try {
      const result = await updateProduct(product.id, data)
      if (!result.success) {
        toast.error(result.error || "Failed to update product")
        return
      }
      toast.success("Product updated")
      router.refresh()
      setOpen(false)
      router.push("/dashboard/inventory")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProductFormModal
      open={open}
      onOpenChange={onOpenChange}
      product={product}
      categories={categories}
      onSubmit={async (data) => {
        if (isSaving) return
        await onSubmit(data)
      }}
    />
  )
}
