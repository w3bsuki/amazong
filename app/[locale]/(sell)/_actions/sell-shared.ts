import { z } from "zod"
import { sellFormSchemaV4 } from "@/lib/sell/schema"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type CreateListingResult =
  | {
      success: true
      id: string
      sellerUsername: string
      product: {
        id: string
        slug: string | null
      }
    }
  | {
      success: false
      error: string
      message?: string
      issues?: Array<{ path: string[]; message: string }>
      upgradeRequired?: boolean
    }

export type CreateListingFailure = Extract<CreateListingResult, { success: false }>
export type SellFormData = z.infer<typeof sellFormSchemaV4>
export type SupabaseClient = Awaited<ReturnType<typeof createClient>>
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"] & Record<string, unknown>
export type SellerAccess = { userId: string; username: string }
type PricingResult = {
  price: number
  listPrice: number | null
  hasDiscount: boolean
  salePercent: number
}

const createListingArgsSchema = z.object({
  sellerId: z.string().min(1),
  data: z.unknown(),
})
type CreateListingArgs = z.infer<typeof createListingArgsSchema>

function mapValidationFailure(error: z.ZodError): CreateListingFailure {
  return {
    success: false,
    error: "Validation failed",
    issues: error.issues.map((issue) => ({ path: issue.path.map(String), message: issue.message })),
  }
}

export function isCreateListingFailure(value: unknown): value is CreateListingFailure {
  if (!value || typeof value !== "object") return false
  if (!("success" in value)) return false
  return value.success === false
}

export function parseArgs(args: {
  sellerId: string
  data: unknown
}): CreateListingArgs | CreateListingFailure {
  const parsedArgs = createListingArgsSchema.safeParse(args)
  if (!parsedArgs.success) {
    return { success: false, error: "Invalid input" } satisfies CreateListingFailure
  }
  return parsedArgs.data
}

export function parseForm(data: unknown): SellFormData | CreateListingFailure {
  const parsed = sellFormSchemaV4.safeParse(data)
  if (!parsed.success) {
    return mapValidationFailure(parsed.error)
  }
  return parsed.data
}

export function validatePricing(form: SellFormData): PricingResult | CreateListingFailure {
  const price = Number.parseFloat(form.price)
  if (!Number.isFinite(price) || price <= 0) {
    return {
      success: false,
      error: "Validation failed",
      issues: [{ path: ["price"], message: "validation.priceInvalid" }],
    } satisfies CreateListingFailure
  }

  const listPrice = form.compareAtPrice ? Number.parseFloat(form.compareAtPrice) : null
  const hasDiscount =
    Number.isFinite(price) &&
    typeof listPrice === "number" &&
    Number.isFinite(listPrice) &&
    listPrice > price

  if (typeof listPrice === "number" && Number.isFinite(listPrice) && !hasDiscount) {
    return {
      success: false,
      error: "Validation failed",
      issues: [{ path: ["compareAtPrice"], message: "validation.compareAtMustBeHigher" }],
    } satisfies CreateListingFailure
  }

  const salePercent =
    hasDiscount && listPrice > 0
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0

  return {
    price,
    listPrice,
    hasDiscount,
    salePercent,
  }
}

export function mapInsertError(error: {
  message?: string
  code?: string
}): CreateListingFailure {
  if (error.message?.includes("LISTING_LIMIT_REACHED") || error.code === "P0001") {
    return {
      success: false,
      error: "LISTING_LIMIT_REACHED",
      message: "You have reached your listing limit. Please upgrade your plan to add more listings.",
      upgradeRequired: true,
    }
  }

  if (error.code === "23514" && error.message?.includes("Category must be a leaf category")) {
    return {
      success: false,
      error: "LEAF_CATEGORY_REQUIRED",
      message: "Please select a more specific category (leaf category)",
    }
  }

  return { success: false, error: error.message || "Failed to create product" }
}
