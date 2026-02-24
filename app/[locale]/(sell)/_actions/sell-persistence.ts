import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { toCategoryPolicy } from "@/lib/sell/category-policy"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import { logger } from "@/lib/logger"
import type { Database } from "@/lib/supabase/database.types"
import type {
  CreateListingFailure,
  ProductInsert,
  SellerAccess,
  SellFormData,
  SupabaseClient,
} from "./sell-shared"

async function verifyListingLimits(
  supabase: SupabaseClient,
  userId: string,
): Promise<CreateListingFailure | null> {
  const listingLimits = await getSellerListingLimitSnapshot(supabase, userId)
  if (!listingLimits) {
    return { success: false, error: "Failed to verify listing limits" }
  }

  if (listingLimits.needsUpgrade) {
    return {
      success: false,
      error: "LISTING_LIMIT_REACHED",
      message: `You have reached your listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan to add more listings.`,
      upgradeRequired: true,
    }
  }

  return null
}

type CategoryPolicyQueryResult = {
  data: Record<string, unknown> | null
  error: { message?: string; code?: string } | null
}

function isMissingColumnError(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false
  return error.code === "42703" || (typeof error.message === "string" && error.message.includes("column"))
}

async function selectCategoryPolicyRow(
  supabase: SupabaseClient,
  categoryId: string,
  selectClause: string,
): Promise<CategoryPolicyQueryResult> {
  return (await (supabase
    .from("categories")
    .select(selectClause)
    .eq("id", categoryId)
    .maybeSingle() as unknown as Promise<CategoryPolicyQueryResult>))
}

async function resolveCategoryPolicy(
  supabase: SupabaseClient,
  categoryId: string,
) {
  const withPricingSelect = [
    "allowed_listing_kinds",
    "allowed_transaction_modes",
    "allowed_fulfillment_modes",
    "allowed_pricing_modes",
    "default_fulfillment_mode",
  ].join(",")

  const withoutPricingSelect = [
    "allowed_listing_kinds",
    "allowed_transaction_modes",
    "allowed_fulfillment_modes",
    "default_fulfillment_mode",
  ].join(",")

  let { data, error } = await selectCategoryPolicyRow(supabase, categoryId, withPricingSelect)

  if (error && isMissingColumnError(error)) {
    ;({ data, error } = await selectCategoryPolicyRow(supabase, categoryId, withoutPricingSelect))
  }

  if (error || !data) {
    return toCategoryPolicy(null)
  }

  return toCategoryPolicy({
    allowed_listing_kinds: data.allowed_listing_kinds,
    allowed_transaction_modes: data.allowed_transaction_modes,
    allowed_fulfillment_modes: data.allowed_fulfillment_modes,
    allowed_pricing_modes: data.allowed_pricing_modes,
    default_fulfillment_mode: data.default_fulfillment_mode,
  })
}

async function insertProduct(
  supabase: SupabaseClient,
  productData: ProductInsert,
) {
  let insertResult = await (supabase
    .from("products")
    .insert(productData as Database["public"]["Tables"]["products"]["Insert"])
    .select("id, slug")
    .single() as unknown as {
    data: { id: string; slug: string | null } | null
    error: { message?: string; code?: string } | null
  })

  if (insertResult.error && isMissingColumnError(insertResult.error)) {
    const {
      listing_kind: _listingKind,
      transaction_mode: _transactionMode,
      fulfillment_mode: _fulfillmentMode,
      pricing_mode: _pricingMode,
      ...legacyProductData
    } = productData
    void _listingKind
    void _transactionMode
    void _fulfillmentMode
    void _pricingMode

    insertResult = await (supabase
      .from("products")
      .insert(legacyProductData as Database["public"]["Tables"]["products"]["Insert"])
      .select("id, slug")
      .single() as unknown as {
      data: { id: string; slug: string | null } | null
      error: { message?: string; code?: string } | null
    })
  }

  return insertResult
}

async function insertOptionalProductImages(
  supabase: SupabaseClient,
  productId: string,
  form: SellFormData,
) {
  const imageRecords = (form.images || []).map((image, index) => ({
    product_id: productId,
    image_url: image.url,
    thumbnail_url: image.thumbnailUrl || image.url,
    display_order: index,
    is_primary: index === 0,
  }))

  if (imageRecords.length > 0) {
    const { error: imagesError } = await supabase.from("product_images").insert(imageRecords)
    if (imagesError) {
      // Non-critical: product created but images failed
    }
  }
}

async function insertOptionalProductAttributes(
  supabase: SupabaseClient,
  productId: string,
  form: SellFormData,
) {
  if (!form.attributes || form.attributes.length === 0) return

  const attributeRecords = form.attributes.map((attribute) => ({
    product_id: productId,
    attribute_id: attribute.attributeId || null,
    name: attribute.name,
    value: attribute.value,
    is_custom: attribute.isCustom ?? false,
  }))

  const { error: attrError } = await supabase.from("product_attributes").insert(attributeRecords)
  if (attrError) {
    // Non-critical: product created but attributes failed
  }
}

async function updateDefaultSellerCity(
  supabase: SupabaseClient,
  userId: string,
  city: string | undefined,
) {
  if (!city) return

  try {
    await supabase
      .from("profiles")
      .update({ default_city: city })
      .eq("id", userId)
      .is("default_city", null)
  } catch {
    // ignore
  }
}

async function verifySellerAccess(
  supabase: SupabaseClient,
  sellerId: string,
  authenticatedUserId: string,
): Promise<SellerAccess | CreateListingFailure> {
  if (authenticatedUserId !== sellerId) {
    return { success: false, error: "Forbidden" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", authenticatedUserId)
    .single()

  if (profileError) {
    return { success: false, error: "Failed to load seller profile" }
  }

  if (!profile?.username) {
    return { success: false, error: "You must set up a username to sell items" }
  }

  return { userId: authenticatedUserId, username: profile.username }
}

async function buildAttributesPayload(
  supabase: SupabaseClient,
  form: SellFormData,
): Promise<{ attributesJson: Record<string, string>; condition: string }> {
  const attributesJson: Record<string, string> = {}
  const formAttributes = form.attributes || []

  const attributeIds = [
    ...new Set(
      formAttributes
        .map((attribute) => attribute.attributeId)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ]

  const attributeKeyById = new Map<string, string>()
  if (attributeIds.length > 0) {
    const { data: defs, error: defsError } = await supabase
      .from("category_attributes")
      .select("id, attribute_key, name")
      .in("id", attributeIds)

    if (defsError) {
      logger.error("[sell:createListing] Failed to resolve attribute_key", defsError)
    } else {
      for (const def of defs || []) {
        const key = (def.attribute_key ?? normalizeAttributeKey(def.name ?? "")).trim()
        if (def.id && key) {
          attributeKeyById.set(def.id, key)
        }
      }
    }
  }

  for (const attribute of formAttributes) {
    const keyFromId = attribute.attributeId ? attributeKeyById.get(attribute.attributeId) : null
    const key = (keyFromId ?? normalizeAttributeKey(attribute.name)).trim()
    if (!key) continue
    attributesJson[key] = attribute.value
  }

  const conditionRaw = typeof form.condition === "string" ? form.condition.trim() : ""
  const condition = conditionRaw || attributesJson.condition || "new"
  attributesJson.condition = condition

  return { attributesJson, condition }
}

export {
  buildAttributesPayload,
  insertOptionalProductAttributes,
  insertOptionalProductImages,
  insertProduct,
  resolveCategoryPolicy,
  updateDefaultSellerCity,
  verifyListingLimits,
  verifySellerAccess,
}
