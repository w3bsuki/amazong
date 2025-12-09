import * as z from "zod";

// Store creation schema
export const storeSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Store name can only contain letters, numbers, spaces, hyphens, and underscores"),
});

// Product listing schema with enhanced validation
export const productSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters")
    .regex(/^[^<>{}]+$/, "Title cannot contain special characters like <, >, {, }"),
  
  description: z
    .string()
    .min(20, "Please provide a more detailed description (at least 20 characters)")
    .max(5000, "Description cannot exceed 5000 characters"),
  
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Enter a valid price greater than 0")
    .refine((val) => parseFloat(val) <= 999999.99, "Price cannot exceed 999,999.99 лв."),
  
  listPrice: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      "Enter a valid compare-at price"
    ),
  
  stock: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Enter a valid stock quantity")
    .refine((val) => parseInt(val) <= 99999, "Stock cannot exceed 99,999 units"),
  
  tags: z
    .array(z.string())
    .max(5, "You can select up to 5 badges")
    .default([]),
  
  listingType: z
    .enum(["normal", "boosted"])
    .default("normal"),
  
  images: z
    .array(z.object({
      url: z.string().url("Invalid image URL"),
      thumbnailUrl: z.string().optional(),
      position: z.number().int().min(0),
    }))
    .min(1, "Please add at least one product image")
    .max(8, "You can upload up to 8 images"),
}).refine(
  (data) => {
    if (data.listPrice) {
      return parseFloat(data.listPrice) > parseFloat(data.price);
    }
    return true;
  },
  {
    message: "Compare-at price must be higher than selling price",
    path: ["listPrice"],
  }
);

export type StoreFormData = z.infer<typeof storeSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
