import * as React from "react"
import Image from "next/image"
import { GripVertical as IconGripVertical, Image as IconPhoto, LoaderCircle as IconLoader2, Trash as IconTrash, Upload as IconUpload } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ProductFormData } from "./product-form-modal.schema"

interface ProductFormMainColumnProps {
  form: UseFormReturn<ProductFormData>
  images: string[]
  price: number
  compareAtPrice: number | undefined
  trackInventory: boolean
  weightUnit: ProductFormData["weightUnit"]
  uploadingImages: boolean
  profitMargin: { profit: number; margin: number } | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onTrackInventoryChange: (next: boolean) => void
  onWeightUnitChange: (next: ProductFormData["weightUnit"]) => void
}

export function ProductFormMainColumn({
  form,
  images,
  price,
  compareAtPrice,
  trackInventory,
  weightUnit,
  uploadingImages,
  profitMargin,
  onImageUpload,
  onRemoveImage,
  onTrackInventoryChange,
  onWeightUnitChange,
}: ProductFormMainColumnProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-4 sm:p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g. Nike Air Max 90"
            {...register("title")}
            className={cn("h-10", errors.title && "border-destructive")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your product in detail..."
            rows={4}
            {...register("description")}
            className="resize-none"
          />
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 sm:p-4">
        <div className="flex items-center gap-2 mb-4">
          <IconPhoto className="size-5 text-muted-foreground" />
          <h3 className="font-medium">Media</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
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
              <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 bg-background hover:bg-hover text-foreground"
                >
                  <IconGripVertical className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 bg-background hover:bg-hover text-destructive"
                  onClick={() => onRemoveImage(index)}
                >
                  <IconTrash className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <label className="aspect-square rounded-lg border-2 border-dashed border-border-subtle hover:border-hover-border hover:bg-hover active:bg-active cursor-pointer transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={onImageUpload}
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-background rounded-lg p-4 sm:p-4 space-y-4">
          <h3 className="font-medium">Pricing</h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs">Price <span className="text-destructive">*</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">BGN</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={cn("pl-12 h-9", errors.price && "border-destructive")}
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
                <p className="text-xs text-success font-medium">
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
              <div className="p-2 rounded bg-success/10 text-xs">
                <span className="text-success font-medium">
                  Profit: {profitMargin.profit.toFixed(2)} BGN ({profitMargin.margin.toFixed(0)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 sm:p-4 space-y-4">
          <h3 className="font-medium">Inventory</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Track quantity</Label>
              <Switch
                checked={trackInventory}
                onCheckedChange={onTrackInventoryChange}
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
                  className={cn("h-9 w-24", errors.stock && "border-destructive")}
                  {...register("stock")}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 sm:p-4 space-y-4">
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
              value={weightUnit}
              onValueChange={(next) => onWeightUnitChange(next as ProductFormData["weightUnit"])}
            >
              <SelectTrigger size="sm">
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
  )
}
