import { z } from "zod";

// ============================================================================
// Listing Form Schema (V3 Single-Page Form)
// ============================================================================

export const conditionOptions = [
  { value: "new-with-tags", label: "New with tags" },
  { value: "new-without-tags", label: "New without tags" },
  { value: "used-excellent", label: "Used - Excellent" },
  { value: "used-good", label: "Used - Good" },
  { value: "used-fair", label: "Used - Fair" },
] as const;

export const formatOptions = [
  { value: "fixed", label: "Fixed Price", description: "Buy it now" },
  { value: "auction", label: "Auction", description: "Accept bids" },
] as const;

export const dimensionsSchema = z.object({
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
});

export const listingSchema = z.object({
  // Photos (required, 1-12)
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one photo is required")
    .max(12, "Maximum 12 photos allowed"),

  // Details
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(80, "Title must be 80 characters or less"),
  categoryId: z.string().min(1, "Please select a category"),
  condition: z.enum([
    "new-with-tags",
    "new-without-tags",
    "used-excellent",
    "used-good",
    "used-fair",
  ]),
  description: z.string().max(2000, "Description cannot exceed 2,000 characters").optional(),

  // Pricing
  format: z.enum(["fixed", "auction"]).default("fixed"),
  price: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Please enter a valid price"
    )
    .refine((val) => parseFloat(val) <= 999999.99, "Price cannot exceed $999,999.99"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").default(1),
  acceptOffers: z.boolean().default(false),

  // Shipping
  standardShipping: z.boolean().default(true),
  localPickup: z.boolean().default(false),
  dimensions: dimensionsSchema.optional(),

  // Category-specific attributes
  attributes: z.record(z.string(), z.string()).optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
export type DimensionsData = z.infer<typeof dimensionsSchema>;

// Default form values
export const defaultListingFormValues: Partial<ListingFormData> = {
  images: [],
  title: "",
  categoryId: "",
  condition: "used-excellent",
  description: "",
  format: "fixed",
  price: "",
  quantity: 1,
  acceptOffers: false,
  standardShipping: true,
  localPickup: false,
  dimensions: {
    length: "",
    width: "",
    height: "",
    weight: "",
  },
  attributes: {},
};

// Legacy alias for backward compatibility
export const sellFormSchemaV3 = listingSchema;
export type SellFormDataV3 = ListingFormData;
export const defaultSellFormValues = defaultListingFormValues;
