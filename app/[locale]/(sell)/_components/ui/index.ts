// Barrel export for all sell form UI components
// Phase 1: Foundation & Extraction

// Drawer-based input components (from step-specifics.tsx)
export { ConditionSelector } from "./condition-selector";
export { FieldRow } from "./field-row";
export { TextInputDrawer } from "./text-input-drawer";
export { SelectDrawer } from "./select-drawer";
export { MultiSelectDrawer } from "./multi-select-drawer";
export { BooleanDrawer } from "./boolean-drawer";

// Header & navigation components (from sell-form.tsx)
export { ProgressHeader } from "./progress-header";
export { ChecklistSidebar } from "./checklist-sidebar";
export { MobileFooter } from "./mobile-footer";

// Photo upload components (from photos-section.tsx)
export { PhotoThumbnail } from "./photo-thumbnail";
export { UploadZone } from "./upload-zone";
export { ImagePreviewModal } from "./image-preview-modal";

// Pricing components (from pricing-section.tsx)
export { PriceSuggestionCard } from "./price-suggestion";
export { QuantityStepper } from "./quantity-stepper";

// Shipping components (from shipping-section.tsx)
export { ShippingRegionCard } from "./shipping-region-card";

// Category picker (existing)
export { CategorySelector } from "./category-modal";

// Brand components - Phase 3: shadcn alignment
export { BrandCombobox } from "./brand-combobox";
export type { Brand, BrandComboboxProps } from "./brand-combobox";

// Legacy brand picker (deprecated - use BrandCombobox instead)
export { BrandPicker } from "./brand-picker";

// Other existing components
export { DrawerSelect } from "./drawer-select";
export { SmartCategoryPicker } from "./smart-category-picker";
export { SellSectionSkeleton } from "./sell-section-skeleton";
export { SellErrorBoundary } from "./sell-error-boundary";
export { StepperHeader } from "./stepper-header";
export { StepperNavigation } from "./stepper-navigation";
