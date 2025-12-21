// ============================================================================
// SELL FORM FIELDS - Unified form fields using context pattern
// Phase 2: Unified Form Architecture
// Phase 4: Added ReviewField for responsive unification
// Phase 5: Added React.memo optimizations and JSDoc documentation
// ============================================================================

// Photo upload field
export { PhotosField, MemoizedPhotosField } from "./photos-field";

// Basic info fields
export { CategoryField, MemoizedCategoryField } from "./category-field";
export { ConditionField, MemoizedConditionField } from "./condition-field";
export { TitleField, MemoizedTitleField } from "./title-field";
export { DescriptionField, MemoizedDescriptionField } from "./description-field";
export { BrandField, MemoizedBrandField } from "./brand-field";

// Pricing & shipping fields
export { PricingField, MemoizedPricingField } from "./pricing-field";
export { ShippingField, MemoizedShippingField } from "./shipping-field";

// Item specifics
export { AttributesField, MemoizedAttributesField } from "./attributes-field";

// Review step
export { ReviewField } from "./review-field";
