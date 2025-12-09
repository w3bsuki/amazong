import * as z from "zod";

// ============================================================================
// Store Creation Schema
// ============================================================================

export const storeSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Store name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

export type StoreFormData = z.infer<typeof storeSchema>;
