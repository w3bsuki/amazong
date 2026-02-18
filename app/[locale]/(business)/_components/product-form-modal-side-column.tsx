import * as React from "react"

import { cn } from "@/lib/utils"
import { ProductCategorySelector } from "./product-form-modal-category-selector"
import type { Category } from "./product-form-modal.types"
import type { ProductFormData } from "./product-form-modal.schema"

interface ProductFormSideColumnProps {
  categories: Category[]
  categoryId: string
  condition: ProductFormData["condition"]
  isEditing: boolean
  status: ProductFormData["status"]
  imagesCount: number
  onCategoryChange: (id: string) => void
  onConditionChange: (condition: ProductFormData["condition"]) => void
}

export function ProductFormSideColumn({
  categories,
  categoryId,
  condition,
  isEditing,
  status,
  imagesCount,
  onCategoryChange,
  onConditionChange,
}: ProductFormSideColumnProps) {
  return (
    <div className="space-y-4">
      <div className="bg-background rounded-lg p-4 sm:p-4">
        <h3 className="font-medium mb-3">Category</h3>
        <ProductCategorySelector
          categories={categories}
          value={categoryId}
          onChange={onCategoryChange}
        />
      </div>

      <div className="bg-background rounded-lg p-4 sm:p-4">
        <h3 className="font-medium mb-3">Condition</h3>
        <div className="grid grid-cols-3 gap-2">
          {(["new", "like_new", "good", "used", "fair", "refurbished"] as const).map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => onConditionChange(cond)}
              className={cn(
                "px-2 py-2 text-xs rounded-lg border transition-all capitalize",
                condition === cond
                  ? "border-selected-border bg-selected text-primary font-medium"
                  : "border-border hover:border-hover-border"
              )}
            >
              {cond.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="bg-background rounded-lg p-4 sm:p-4">
          <h3 className="font-medium mb-3">Quick Info</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 rounded bg-muted">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{status.replace("_", " ")}</p>
            </div>
            <div className="p-2 rounded bg-muted">
              <p className="text-xs text-muted-foreground">Images</p>
              <p className="font-medium">{imagesCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-info/20 bg-info/10 p-4 text-xs text-foreground">
        <p className="mb-2 font-medium text-info">Tips for better listings</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Add 4+ high-quality images</li>
          <li>• Write detailed descriptions</li>
          <li>• Use SKU for inventory tracking</li>
          <li>• Set competitive pricing</li>
        </ul>
      </div>
    </div>
  )
}
