import { z } from "zod"

export const sellFormSchema = z.object({
  // Step 1: Basics (Photos, Title, Description)
  images: z.array(z.string()).min(1, "At least one photo is required").max(12, "Maximum 12 photos allowed"),
  title: z.string().min(10, "Title must be at least 10 characters").max(80, "Title must be less than 80 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  condition: z.enum(["new", "like-new", "good", "fair", "poor"], {
    required_error: "Please select a condition",
  }),
  brand: z.string().optional(),

  // Step 2: Category
  categoryId: z.string().min(1, "Please select a category"),
  
  // Step 3: Attributes (Dynamic)
  attributes: z.record(z.string(), z.any()).optional(),
  
  // Step 4: Price & Shipping
  price: z.coerce.number().min(0.99, "Price must be at least $0.99"),
  shippingOption: z.enum(["free", "calculated", "flat"]),
  shippingCost: z.coerce.number().optional(),
})

export type SellFormData = z.infer<typeof sellFormSchema>

export const STEPS = [
  { id: "basics", title: "What are you selling?" },
  { id: "category", title: "Category" },
  { id: "attributes", title: "Item Specifics" },
  { id: "price", title: "Price & Shipping" },
] as const
