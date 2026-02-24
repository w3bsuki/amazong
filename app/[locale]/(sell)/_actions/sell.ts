"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { clampModesToPolicy } from "@/lib/sell/category-policy"
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"
import {
  buildAttributesPayload,
  insertOptionalProductAttributes,
  insertOptionalProductImages,
  insertProduct,
  resolveCategoryPolicy,
  updateDefaultSellerCity,
  verifyListingLimits,
  verifySellerAccess,
} from "./sell-persistence"
import {
  isCreateListingFailure,
  mapInsertError,
  parseArgs,
  parseForm,
  validatePricing,
  type CreateListingResult,
} from "./sell-shared"

export type { CreateListingResult } from "./sell-shared"

export async function createListing(args: { sellerId: string; data: unknown }): Promise<CreateListingResult> {
  const parsedArgs = parseArgs(args)
  if (isCreateListingFailure(parsedArgs)) return parsedArgs

  const { sellerId, data } = parsedArgs
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Unauthorized" }
  }

  const parsedForm = parseForm(data)
  if (isCreateListingFailure(parsedForm)) return parsedForm
  const form = parsedForm

  const supabase = auth.supabase
  const sellerAccessResult = await verifySellerAccess(supabase, sellerId, auth.user.id)
  if (isCreateListingFailure(sellerAccessResult)) return sellerAccessResult
  const sellerAccess = sellerAccessResult

  const listingLimitsFailure = await verifyListingLimits(supabase, sellerAccess.userId)
  if (listingLimitsFailure) return listingLimitsFailure

  const pricingResult = validatePricing(form)
  if (isCreateListingFailure(pricingResult)) return pricingResult
  const pricing = pricingResult

  const categoryResolution = await resolveLeafCategoryForListing({
    supabase,
    selectedCategoryId: form.categoryId || null,
    context: {
      title: form.title,
      description: form.description,
      tags: form.tags,
      attributes: (form.attributes || []).map((attribute) => ({
        name: attribute.name,
        value: attribute.value,
      })),
    },
  })
  if (!categoryResolution.ok) {
    return {
      success: false,
      error: categoryResolution.error,
      message: categoryResolution.message,
    }
  }

  const categoryPolicy = await resolveCategoryPolicy(supabase, categoryResolution.categoryId)
  const constrainedModes = clampModesToPolicy(
    {
      listingKind: form.listingKind,
      transactionMode: form.transactionMode,
      fulfillmentMode: form.fulfillmentMode,
      pricingMode: form.format === "auction" ? "auction" : form.pricingMode,
    },
    categoryPolicy,
  )

  const { attributesJson, condition } = await buildAttributesPayload(supabase, form)
  const imageUrls = (form.images || []).map((img) => img.url)

  const isShippingMode = constrainedModes.fulfillmentMode === "shipping"
  const isPickupMode = constrainedModes.fulfillmentMode === "pickup"

  const shippingFlags = isShippingMode
    ? {
        ships_to_bulgaria: form.shipsToBulgaria ?? true,
        ships_to_uk: form.shipsToUK ?? false,
        ships_to_europe: form.shipsToEurope ?? false,
        ships_to_usa: form.shipsToUSA ?? false,
        ships_to_worldwide: form.shipsToWorldwide ?? false,
        pickup_only: form.pickupOnly ?? false,
      }
    : {
        ships_to_bulgaria: false,
        ships_to_uk: false,
        ships_to_europe: false,
        ships_to_usa: false,
        ships_to_worldwide: false,
        pickup_only: isPickupMode,
      }

  const productData = {
    seller_id: sellerAccess.userId,
    title: form.title,
    description: form.description || "",
    price: pricing.price,
    list_price: pricing.hasDiscount ? pricing.listPrice : null,
    is_on_sale: pricing.hasDiscount,
    sale_percent: pricing.salePercent,
    sale_end_date: null,
    category_id: categoryResolution.categoryId,
    brand_id: form.brandId || null,
    listing_kind: constrainedModes.listingKind,
    transaction_mode: constrainedModes.transactionMode,
    fulfillment_mode: constrainedModes.fulfillmentMode,
    pricing_mode: constrainedModes.pricingMode,
    tags: form.tags || [],
    images: imageUrls,
    stock: form.quantity ?? 1,
    listing_type: "normal",
    status: "active",
    is_boosted: false,
    boost_expires_at: null,
    seller_city: form.sellerCity || null,
    ...shippingFlags,
    free_shipping: form.freeShipping ?? false,
    // Keep condition in the dedicated column too (canonical for the DB)
    condition,
    attributes: attributesJson,
  }

  const { data: product, error } = await insertProduct(supabase, productData)

  if (error) {
    return mapInsertError(error)
  }
  if (!product) {
    return { success: false, error: "Failed to create product" }
  }

  await insertOptionalProductImages(supabase, product.id, form)
  await insertOptionalProductAttributes(supabase, product.id, form)
  await updateDefaultSellerCity(supabase, sellerAccess.userId, form.sellerCity || undefined)

  return {
    success: true,
    id: product.id,
    sellerUsername: sellerAccess.username,
    product: {
      id: product.id,
      slug: product.slug ?? null,
    },
  }
}
