"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconX,
  IconCheck,
  IconLoader2,
  IconPhoto,
  IconUpload,
  IconTrash,
  IconGripVertical,
  IconChevronRight,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Product form schema - matches database columns
const productFormSchema = z.object({
  title: z.string().min(1, "Product title is required").max(255),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(), // maps to list_price
  costPrice: z.coerce.number().min(0).optional(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(50).optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  trackInventory: z.boolean().default(true),
  categoryId: z.string().optional(),
  status: z.enum(["active", "draft", "archived", "out_of_stock"]).default("draft"),
  weight: z.coerce.number().min(0).optional(),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
  condition: z.enum(["new", "used", "refurbished", "like_new", "good", "fair"]).default("new"),
  images: z.array(z.string()).default([]),
})

export type ProductFormData = z.infer<typeof productFormSchema>

// Category type for hierarchical display
interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order?: number | null
  children?: Category[]
}

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: {
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
  } | null
  categories: Category[]
  onSubmit: (data: ProductFormData) => Promise<void>
}

// Cascading Category Selector Component
function CategorySelector({
  categories,
  value,
  onChange,
}: {
  categories: Category[]
  value: string | undefined
  onChange: (id: string) => void
}) {
  const findCategoryPath = React.useCallback((cats: Category[], targetId: string, path: Category[] = []): Category[] | null => {
    for (const cat of cats) {
      if (cat.id === targetId) {
        return [...path, cat]
      }
      if (cat.children?.length) {
        const found = findCategoryPath(cat.children, targetId, [...path, cat])
        if (found) return found
      }
    }
    return null
  }, [])

  const selectedPath = value ? findCategoryPath(categories, value) || [] : []
  
  const [l0, setL0] = React.useState<string>(selectedPath[0]?.id || "")
  const [l1, setL1] = React.useState<string>(selectedPath[1]?.id || "")
  const [l2, setL2] = React.useState<string>(selectedPath[2]?.id || "")
  const [l3, setL3] = React.useState<string>(selectedPath[3]?.id || "")

  const l0Categories = categories
  const l1Categories = l0 ? l0Categories.find(c => c.id === l0)?.children || [] : []
  const l2Categories = l1 ? l1Categories.find(c => c.id === l1)?.children || [] : []
  const l3Categories = l2 ? l2Categories.find(c => c.id === l2)?.children || [] : []

  const handleL0Change = (id: string) => {
    setL0(id)
    setL1("")
    setL2("")
    setL3("")
    const cat = l0Categories.find(c => c.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL1Change = (id: string) => {
    setL1(id)
    setL2("")
    setL3("")
    const cat = l1Categories.find(c => c.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL2Change = (id: string) => {
    setL2(id)
    setL3("")
    const cat = l2Categories.find(c => c.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL3Change = (id: string) => {
    setL3(id)
    onChange(id)
  }

  const breadcrumb = [
    l0 && l0Categories.find(c => c.id === l0)?.name,
    l1 && l1Categories.find(c => c.id === l1)?.name,
    l2 && l2Categories.find(c => c.id === l2)?.name,
    l3 && l3Categories.find(c => c.id === l3)?.name,
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          {breadcrumb.map((name, i) => (
            <React.Fragment key={i}>
              {i > 0 && <IconChevronRight className="size-3" />}
              <span className={i === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                {name}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Select value={l0} onValueChange={handleL0Change}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {l0Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l1} onValueChange={handleL1Change} disabled={!l0 || l1Categories.length === 0}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Subcategory" />
          </SelectTrigger>
          <SelectContent>
            {l1Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l2} onValueChange={handleL2Change} disabled={!l1 || l2Categories.length === 0}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {l2Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l3} onValueChange={handleL3Change} disabled={!l2 || l3Categories.length === 0}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Subtype" />
          </SelectTrigger>
          <SelectContent>
            {l3Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile: Stacked dropdowns */}
      <div className="sm:hidden space-y-2">
        <Select value={l0} onValueChange={handleL0Change}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {l0Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {l0 && l1Categories.length > 0 && (
          <Select value={l1} onValueChange={handleL1Change}>
            <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
            <SelectContent>
              {l1Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {l1 && l2Categories.length > 0 && (
          <Select value={l2} onValueChange={handleL2Change}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {l2Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {l2 && l3Categories.length > 0 && (
          <Select value={l3} onValueChange={handleL3Change}>
            <SelectTrigger><SelectValue placeholder="Select subtype" /></SelectTrigger>
            <SelectContent>
              {l3Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
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
        className="max-w-full w-full h-dvh sm:h-[98dvh] sm:w-[98vw] sm:max-w-none p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-xl border-0 sm:border"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="shrink-0 size-8"
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
                    <div className="size-2 rounded-full bg-gray-400" />
                    Draft
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="out_of_stock">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500" />
                    Out of Stock
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-400" />
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
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px]">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Title & Description */}
                <div className="bg-background rounded-lg p-4 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Nike Air Max 90"
                      {...register("title")}
                      className={cn("h-10", errors.title && "border-red-500")}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail..."
                      rows={4}
                      {...register("description")}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Media */}
                <div className="bg-background rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <IconPhoto className="size-5 text-muted-foreground" />
                    <h3 className="font-medium">Media</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border bg-muted overflow-hidden group"
                      >
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-1 left-1 text-2xs px-1.5 py-0" variant="secondary">
                            Main
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 bg-white/90 hover:bg-white text-black"
                          >
                            <IconGripVertical className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 bg-white/90 hover:bg-white text-red-600"
                            onClick={() => removeImage(index)}
                          >
                            <IconTrash className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <IconLoader2 className="size-5 animate-spin" />
                      ) : (
                        <>
                          <IconUpload className="size-5" />
                          <span className="text-2xs font-medium">Add</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Pricing & Inventory - Side by side */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Pricing */}
                  <div className="bg-background rounded-lg p-4 sm:p-6 space-y-4">
                    <h3 className="font-medium">Pricing</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="price" className="text-xs">Price <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">BGN</span>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={cn("pl-12 h-9", errors.price && "border-red-500")}
                            {...register("price")}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="compareAtPrice" className="text-xs">Compare-at price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">BGN</span>
                          <Input
                            id="compareAtPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-12 h-9"
                            {...register("compareAtPrice")}
                          />
                        </div>
                        {compareAtPrice && compareAtPrice > 0 && price && compareAtPrice > price && (
                          <p className="text-xs text-emerald-600 font-medium">
                            {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% off
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="costPrice" className="text-xs">Cost per item</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">BGN</span>
                          <Input
                            id="costPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-12 h-9"
                            {...register("costPrice")}
                          />
                        </div>
                      </div>

                      {profitMargin && (
                        <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-xs">
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            Profit: {profitMargin.profit.toFixed(2)} BGN ({profitMargin.margin.toFixed(0)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="bg-background rounded-lg p-4 sm:p-6 space-y-4">
                    <h3 className="font-medium">Inventory</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Track quantity</Label>
                        <Switch
                          checked={trackInventory}
                          onCheckedChange={(v) => setValue("trackInventory", v)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="sku" className="text-xs">SKU</Label>
                          <Input
                            id="sku"
                            placeholder="SKU-001"
                            className="h-9"
                            {...register("sku")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="barcode" className="text-xs">Barcode</Label>
                          <Input
                            id="barcode"
                            placeholder="UPC/EAN"
                            className="h-9"
                            {...register("barcode")}
                          />
                        </div>
                      </div>

                      {trackInventory && (
                        <div className="space-y-1.5">
                          <Label htmlFor="stock" className="text-xs">Quantity in stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            min="0"
                            placeholder="0"
                            className={cn("h-9 w-24", errors.stock && "border-red-500")}
                            {...register("stock")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-background rounded-lg p-4 sm:p-6 space-y-4">
                  <h3 className="font-medium">Shipping</h3>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="weight" className="text-xs">Weight</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        placeholder="0.0"
                        className="h-9"
                        {...register("weight")}
                      />
                    </div>
                    <div className="w-20 space-y-1.5">
                      <Label className="text-xs">Unit</Label>
                      <Select
                        value={watch("weightUnit")}
                        onValueChange={(v) => setValue("weightUnit", v as "kg" | "g" | "lb" | "oz")}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Category & Organization */}
              <div className="space-y-4">
                
                {/* Category Selector - Cascading */}
                <div className="bg-background rounded-lg p-4 sm:p-6">
                  <h3 className="font-medium mb-3">Category</h3>
                  <CategorySelector
                    categories={categories}
                    value={watch("categoryId")}
                    onChange={(id) => setValue("categoryId", id, { shouldDirty: true })}
                  />
                </div>

                {/* Condition */}
                <div className="bg-background rounded-lg p-4 sm:p-6">
                  <h3 className="font-medium mb-3">Condition</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["new", "like_new", "good", "used", "fair", "refurbished"] as const).map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setValue("condition", cond)}
                        className={cn(
                          "px-2 py-2 text-xs rounded-lg border transition-all capitalize",
                          watch("condition") === cond
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {cond.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Stats for editing */}
                {isEditing && (
                  <div className="bg-background rounded-lg p-4 sm:p-6">
                    <h3 className="font-medium mb-3">Quick Info</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded bg-muted">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{status.replace("_", " ")}</p>
                      </div>
                      <div className="p-2 rounded bg-muted">
                        <p className="text-xs text-muted-foreground">Images</p>
                        <p className="font-medium">{images.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">Tips for better listings</p>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Add 4+ high-quality images</li>
                    <li>• Write detailed descriptions</li>
                    <li>• Use SKU for inventory tracking</li>
                    <li>• Set competitive pricing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
