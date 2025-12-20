import { z } from "zod";

// =============================================================================
// SELL FORM SCHEMA - Single Source of Truth
// =============================================================================

// -----------------------------------------------------------------------------
// Option Constants
// -----------------------------------------------------------------------------
export const CONDITION_OPTIONS = [
  { value: "new-with-tags", label: "New with tags", labelBg: "Ново с етикети" },
  { value: "new-without-tags", label: "New without tags", labelBg: "Ново без етикети" },
  { value: "used-like-new", label: "Like new", labelBg: "Като ново" },
  { value: "used-excellent", label: "Used - Excellent", labelBg: "Използвано - Отлично" },
  { value: "used-good", label: "Used - Good", labelBg: "Използвано - Добро" },
  { value: "used-fair", label: "Used - Fair", labelBg: "Използвано - Задоволително" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "BGN", label: "лв", symbol: "лв" },
  { value: "EUR", label: "€", symbol: "€" },
  { value: "USD", label: "$", symbol: "$" },
] as const;

// -----------------------------------------------------------------------------
// Sub-Schemas
// -----------------------------------------------------------------------------
export const imageSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  isPrimary: z.boolean().default(false),
});

export const attributeSchema = z.object({
  attributeId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  isCustom: z.boolean().default(false),
});

export const categoryPathSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

// -----------------------------------------------------------------------------
// Main Form Schema
// -----------------------------------------------------------------------------
export const sellFormSchema = z.object({
  // Photos
  images: z.array(imageSchema).min(1, "Add at least 1 photo").max(12),

  // Basic Info
  title: z.string().min(5, "Min 5 characters").max(80, "Max 80 characters"),
  categoryId: z.string().min(1, "Select a category"),
  categoryPath: z.array(categoryPathSchema).optional(),
  condition: z.enum([
    "new-with-tags", "new-without-tags", "used-like-new",
    "used-excellent", "used-good", "used-fair"
  ]),
  brandName: z.string().optional(),
  description: z.string().max(2000).optional().default(""),

  // Item Specifics
  attributes: z.array(attributeSchema).default([]),

  // Pricing
  price: z.string().min(1, "Enter price").refine(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
    "Must be greater than 0"
  ),
  currency: z.enum(["BGN", "EUR", "USD"]).default("BGN"),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  acceptOffers: z.boolean().default(false),

  // Shipping
  shippingRegions: z.object({
    bulgaria: z.boolean().default(true),
    europe: z.boolean().default(false),
    worldwide: z.boolean().default(false),
    pickup: z.boolean().default(false),
  }),
  shippingPrice: z.string().optional(),
  freeShipping: z.boolean().default(false),
});

export type SellFormData = z.infer<typeof sellFormSchema>;
export type ProductImage = z.infer<typeof imageSchema>;
export type ProductAttribute = z.infer<typeof attributeSchema>;

// -----------------------------------------------------------------------------
// Default Values
// -----------------------------------------------------------------------------
export const defaultFormValues: SellFormData = {
  images: [],
  title: "",
  categoryId: "",
  categoryPath: [],
  condition: "used-excellent",
  brandName: "",
  description: "",
  attributes: [],
  price: "",
  currency: "BGN",
  quantity: 1,
  acceptOffers: false,
  shippingRegions: {
    bulgaria: true,
    europe: false,
    worldwide: false,
    pickup: false,
  },
  shippingPrice: "",
  freeShipping: false,
};

// -----------------------------------------------------------------------------
// Progress Calculation
// -----------------------------------------------------------------------------
export function calculateProgress(data: Partial<SellFormData>) {
  const checks = [
    { key: "photos", done: (data.images?.length ?? 0) > 0, label: "Photos", labelBg: "Снимки" },
    { key: "title", done: (data.title?.length ?? 0) >= 5, label: "Title", labelBg: "Заглавие" },
    { key: "category", done: !!data.categoryId, label: "Category", labelBg: "Категория" },
    { key: "condition", done: !!data.condition, label: "Condition", labelBg: "Състояние" },
    { key: "price", done: !!data.price && parseFloat(data.price) > 0, label: "Price", labelBg: "Цена" },
  ];
  
  const completed = checks.filter(c => c.done).length;
  return {
    percentage: Math.round((completed / checks.length) * 100),
    items: checks,
  };
}
