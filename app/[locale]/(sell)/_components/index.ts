// ============================================================================
// Sell Page Components - Phase 5 Complete (December 21, 2025)
// Unified Form Architecture with FormProvider pattern
// Responsive Unification - single form handles desktop + mobile
// Performance Optimized - React.memo on all field components
// ============================================================================

// Authentication & Onboarding
export { SignInPrompt } from "./sign-in-prompt";

// Form Provider & Context
export { 
  SellFormProvider, 
  useSellFormContext, 
  useSellForm,
} from "./sell-form-provider";

// Re-export schema from lib (single source of truth)
export {
  sellFormSchemaV4,
  defaultSellFormValuesV4,
  calculateFormProgress,
  type SellFormDataV4,
  type ProgressItem,
} from "@/lib/sell/schema";

// Unified Field Components (with memoized versions)
export {
  PhotosField,
  CategoryField,
  ConditionField,
  TitleField,
  DescriptionField,
  BrandField,
  PricingField,
  ShippingField,
  AttributesField,
  ReviewField,
} from "./fields";

// Responsive Layouts
export { DesktopLayout, MobileLayout, StepperWrapper } from "./layouts";

// Main Form Component - handles both desktop and mobile
export { UnifiedSellForm } from "./sell-form-unified";

// AI Assistant
export { AiListingAssistant } from "./ai/ai-listing-assistant";

// Loading states & Error handling
export { SellSectionSkeleton, SellFormSkeleton } from "./ui/sell-section-skeleton";
export { SellErrorBoundary } from "./ui/sell-error-boundary";

// Types - Single source of truth
export * from "../_lib/types";

