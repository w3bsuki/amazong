import { z } from "zod"

// Product form schema - matches database columns.
export const productFormSchema = z.object({
  title: z.string().min(1, "Product title is required").max(255),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(),
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
