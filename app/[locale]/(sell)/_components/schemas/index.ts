// ============================================================================
// Sell Page Schemas - Single Source of Truth
// ============================================================================

// Store schemas
export { storeSchema, type StoreFormData } from "./store.schema";

// Listing schemas
export {
  listingSchema,
  dimensionsSchema,
  conditionOptions,
  formatOptions,
  defaultListingFormValues,
  type ListingFormData,
  type DimensionsData,
  // Legacy aliases for backward compatibility
  sellFormSchemaV3,
  defaultSellFormValues,
  type SellFormDataV3,
} from "./listing.schema";
