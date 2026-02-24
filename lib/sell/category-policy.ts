const LISTING_KINDS = ["item", "service", "classified"] as const
const TRANSACTION_MODES = ["checkout", "contact"] as const
const FULFILLMENT_MODES = ["shipping", "pickup", "digital", "onsite"] as const
const PRICING_MODES = ["fixed", "auction", "tiered"] as const

export type ListingKind = (typeof LISTING_KINDS)[number]
export type TransactionMode = (typeof TRANSACTION_MODES)[number]
export type FulfillmentMode = (typeof FULFILLMENT_MODES)[number]
export type PricingMode = (typeof PRICING_MODES)[number]

const DEFAULT_LISTING_KIND: ListingKind = "item"
const DEFAULT_TRANSACTION_MODE: TransactionMode = "checkout"
const DEFAULT_FULFILLMENT_MODE: FulfillmentMode = "shipping"
const DEFAULT_PRICING_MODE: PricingMode = "fixed"

export interface ListingModes {
  listingKind: ListingKind
  transactionMode: TransactionMode
  fulfillmentMode: FulfillmentMode
  pricingMode: PricingMode
}

export interface CategoryPolicy {
  allowedListingKinds: ListingKind[]
  allowedTransactionModes: TransactionMode[]
  allowedFulfillmentModes: FulfillmentMode[]
  allowedPricingModes: PricingMode[]
  defaultFulfillmentMode: FulfillmentMode
}

export interface CategoryPolicySource {
  allowed_listing_kinds?: unknown
  allowed_transaction_modes?: unknown
  allowed_fulfillment_modes?: unknown
  allowed_pricing_modes?: unknown
  default_fulfillment_mode?: unknown
}

export const DEFAULT_CATEGORY_POLICY: CategoryPolicy = {
  allowedListingKinds: [DEFAULT_LISTING_KIND],
  allowedTransactionModes: [DEFAULT_TRANSACTION_MODE],
  allowedFulfillmentModes: [DEFAULT_FULFILLMENT_MODE],
  allowedPricingModes: [DEFAULT_PRICING_MODE],
  defaultFulfillmentMode: DEFAULT_FULFILLMENT_MODE,
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
}

function parseAllowedModes<TMode extends string>(
  value: unknown,
  validModes: readonly TMode[],
  fallback: readonly TMode[],
): TMode[] {
  const validSet = new Set(validModes)
  const parsed = asStringArray(value)
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry): entry is TMode => validSet.has(entry as TMode))

  if (parsed.length === 0) return [...fallback]
  return [...new Set(parsed)]
}

function toValidMode<TMode extends string>(
  value: unknown,
  validModes: readonly TMode[],
  fallback: TMode,
): TMode {
  if (typeof value !== "string") return fallback
  const normalized = value.trim().toLowerCase()
  return (validModes as readonly string[]).includes(normalized) ? (normalized as TMode) : fallback
}

function firstOrFallback<TMode extends string>(allowed: readonly TMode[], fallback: TMode): TMode {
  return allowed[0] ?? fallback
}

export function toCategoryPolicy(source?: CategoryPolicySource | null): CategoryPolicy {
  if (!source) return DEFAULT_CATEGORY_POLICY

  const allowedListingKinds = parseAllowedModes(
    source.allowed_listing_kinds,
    LISTING_KINDS,
    DEFAULT_CATEGORY_POLICY.allowedListingKinds,
  )
  const allowedTransactionModes = parseAllowedModes(
    source.allowed_transaction_modes,
    TRANSACTION_MODES,
    DEFAULT_CATEGORY_POLICY.allowedTransactionModes,
  )
  const allowedFulfillmentModes = parseAllowedModes(
    source.allowed_fulfillment_modes,
    FULFILLMENT_MODES,
    DEFAULT_CATEGORY_POLICY.allowedFulfillmentModes,
  )
  const allowedPricingModes = parseAllowedModes(
    source.allowed_pricing_modes,
    PRICING_MODES,
    DEFAULT_CATEGORY_POLICY.allowedPricingModes,
  )

  const defaultFulfillmentModeCandidate = toValidMode(
    source.default_fulfillment_mode,
    FULFILLMENT_MODES,
    DEFAULT_CATEGORY_POLICY.defaultFulfillmentMode,
  )
  const defaultFulfillmentMode = allowedFulfillmentModes.includes(defaultFulfillmentModeCandidate)
    ? defaultFulfillmentModeCandidate
    : firstOrFallback(allowedFulfillmentModes, DEFAULT_CATEGORY_POLICY.defaultFulfillmentMode)

  return {
    allowedListingKinds,
    allowedTransactionModes,
    allowedFulfillmentModes,
    allowedPricingModes,
    defaultFulfillmentMode,
  }
}

function resolveAllowedOrFallback<TMode extends string>(
  requested: TMode | undefined,
  allowed: readonly TMode[],
  fallback: TMode,
): TMode {
  if (requested && allowed.includes(requested)) return requested
  return firstOrFallback(allowed, fallback)
}

export function clampModesToPolicy(
  modes: Partial<ListingModes>,
  policy: CategoryPolicy,
): ListingModes {
  return {
    listingKind: resolveAllowedOrFallback(
      modes.listingKind,
      policy.allowedListingKinds,
      DEFAULT_LISTING_KIND,
    ),
    transactionMode: resolveAllowedOrFallback(
      modes.transactionMode,
      policy.allowedTransactionModes,
      DEFAULT_TRANSACTION_MODE,
    ),
    fulfillmentMode: resolveAllowedOrFallback(
      modes.fulfillmentMode ?? policy.defaultFulfillmentMode,
      policy.allowedFulfillmentModes,
      DEFAULT_FULFILLMENT_MODE,
    ),
    pricingMode: resolveAllowedOrFallback(
      modes.pricingMode,
      policy.allowedPricingModes,
      DEFAULT_PRICING_MODE,
    ),
  }
}
