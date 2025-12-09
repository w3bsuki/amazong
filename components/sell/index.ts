// ============================================================================
// Sell Page Components
// ============================================================================

// Authentication
export { SignInPrompt } from "./sign-in-prompt";
export { CreateStoreForm } from "./create-store-form";

// Main Form
export { SellForm } from "./sell-form";
export { SellFormStepper } from "./sell-form-stepper"; // Mobile stepper flow
export { SellHeaderV3 } from "./sell-header-v3";

// Sidebar components
export { SellPreview } from "./sell-preview";
export { SellTips } from "./sell-tips";

// UI Components
export { SmartCategoryPicker } from "./ui/smart-category-picker";
export { BrandPicker } from "./ui/brand-picker";

// Sections
export { PhotosSection } from "./sections/photos-section";
export { DetailsSection } from "./sections/details-section";
export { PricingSection } from "./sections/pricing-section";
export { ShippingSection } from "./sections/shipping-section";

// Steps (for mobile stepper)
export { StepPhotos, StepCategory, StepPricing, StepReview } from "./steps";

// Category selection
export { CategoryPicker } from "./ui/category-picker";

// Loading states & Error handling
export { SellSectionSkeleton, SellFormSkeleton } from "./ui/sell-section-skeleton";
export { SellErrorBoundary } from "./ui/sell-error-boundary";

// Legacy export for backward compatibility
export { CategoryStepper, type Category } from "./category-stepper";

// Types - Single source of truth
export * from "./types";

// Schemas - Consolidated
export * from "./schemas";
