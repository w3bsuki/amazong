"use client"

import * as React from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check as IconCheck, LoaderCircle as IconLoader2, X as IconX } from "lucide-react"

import { ProductFormMainColumn } from "./product-form-modal-main-column"
import { productFormSchema, type ProductFormData } from "./product-form-modal.schema"
import { ProductFormSideColumn } from "./product-form-modal-side-column"
import type { ProductFormModalProps } from "./product-form-modal.types"

export type { ProductFormData } from "./product-form-modal.schema"

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductFormModalProps) {
  const isEditing = !!product?.id
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [uploadingImages, setUploadingImages] = React.useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormData>,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      compareAtPrice: undefined,
      costPrice: undefined,
      sku: "",
      barcode: "",
      stock: 0,
      trackInventory: true,
      categoryId: "",
      status: "draft",
      weight: undefined,
      weightUnit: "kg",
      condition: "new",
      images: [],
    },
  })
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = form

  // Reset form with product data when modal opens or product changes
  React.useEffect(() => {
    if (open) {
      reset({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        compareAtPrice: product?.list_price || undefined,
        costPrice: product?.cost_price || undefined,
        sku: product?.sku || "",
        barcode: product?.barcode || "",
        stock: product?.stock || 0,
        trackInventory: product?.track_inventory ?? true,
        categoryId: product?.category_id || "",
        status: (product?.status as "active" | "draft" | "archived" | "out_of_stock") || "draft",
        weight: product?.weight || undefined,
        weightUnit: (product?.weight_unit as "kg" | "g" | "lb" | "oz") || "kg",
        condition: (product?.condition as "new" | "used" | "refurbished" | "like_new" | "good" | "fair") || "new",
        images: product?.images || [],
      })
    }
  }, [open, product, reset])

  const images = watch("images")
  const status = watch("status")
  const trackInventory = watch("trackInventory")
  const price = watch("price")
  const compareAtPrice = watch("compareAtPrice")
  const costPrice = watch("costPrice")
  const categoryId = watch("categoryId")
  const condition = watch("condition")
  const weightUnit = watch("weightUnit")

  // Calculate profit margin
  const profitMargin = React.useMemo(() => {
    if (!price || !costPrice) return null
    const profit = price - costPrice
    const margin = (profit / price) * 100
    return { profit, margin }
  }, [price, costPrice])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    const newImages: string[] = []

    for (const file of files) {
      const url = URL.createObjectURL(file)
      newImages.push(url)
    }

    setValue("images", [...images, ...newImages], { shouldDirty: true })
    setUploadingImages(false)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setValue("images", newImages, { shouldDirty: true })
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-full w-full h-dvh sm:h-(--product-form-modal-h) sm:w-(--product-form-modal-w) sm:max-w-none p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-md border-0 sm:border"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="shrink-0 size-8 min-h-11 min-w-11"
              aria-label="Close product form"
            >
              <IconX className="size-5" />
            </Button>
            <div>
              <DialogTitle className="text-base font-semibold">
                {isEditing ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground hidden sm:block">
                {isEditing ? "Update your product details" : "Create a new product listing"}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={status}
              onValueChange={(v) => setValue("status", v as "active" | "draft" | "archived" | "out_of_stock")}
            >
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-muted" />
                    Draft
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-success" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="out_of_stock">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-warning" />
                    Out of Stock
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-destructive" />
                    Archived
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="hidden sm:flex"
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="size-4 mr-1 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <IconCheck className="size-4 mr-1" />
                  {isEditing ? "Save" : "Create"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-surface-subtle">
          <div className="max-w-7xl mx-auto p-4 sm:p-4 lg:p-4">
            <div className="grid gap-4 product-form-grid lg:grid-cols-2">
              <ProductFormMainColumn
                form={form}
                images={images}
                price={price}
                compareAtPrice={compareAtPrice}
                trackInventory={trackInventory}
                weightUnit={weightUnit}
                uploadingImages={uploadingImages}
                profitMargin={profitMargin}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onTrackInventoryChange={(next) => setValue("trackInventory", next)}
                onWeightUnitChange={(next) => setValue("weightUnit", next)}
              />

              <ProductFormSideColumn
                categories={categories}
                categoryId={categoryId || ""}
                condition={condition}
                isEditing={isEditing}
                status={status}
                imagesCount={images.length}
                onCategoryChange={(id) => setValue("categoryId", id, { shouldDirty: true })}
                onConditionChange={(next) => setValue("condition", next)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
