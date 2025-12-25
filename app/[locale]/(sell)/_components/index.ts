// ============================================================================
// Sell Page Components - Phase 5 Complete (December 21, 2025)
// Unified Form Architecture with FormProvider pattern
// Responsive Unification - single form handles desktop + mobile
// Performance Optimized - React.memo on all field components
// ============================================================================

// Authentication & Onboarding
export { SignInPrompt } from "./sign-in-prompt";
export { SellerOnboardingWizard } from "./seller-onboarding-wizard";

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
} from "@/lib/sell/schema-v4";

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
export { UnifiedSellForm, SellForm, SellFormStepper } from "./sell-form-unified";

// Header (renamed from sell-header-v3.tsx)
export { SellHeader, SellHeaderV3, MemoizedSellHeader } from "./sell-header";

// AI Assistant (with memoized and lazy versions)
export { 
  AiListingAssistant,
  MemoizedAiListingAssistant,
} from "./ai/ai-listing-assistant";

// UI Components
export { SmartCategoryPicker } from "./ui/smart-category-picker";
export { BrandPicker } from "./ui/brand-picker";
export { CategoryPicker } from "./ui/category-picker";
export { DrawerSelect, DrawerMultiSelect } from "./ui/drawer-select";

// Loading states & Error handling
export { SellSectionSkeleton, SellFormSkeleton } from "./ui/sell-section-skeleton";
export { SellErrorBoundary } from "./ui/sell-error-boundary";

// Types - Single source of truth
export * from "../_lib/types";
