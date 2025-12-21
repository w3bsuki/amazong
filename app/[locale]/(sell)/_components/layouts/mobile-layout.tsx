"use client";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import {
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
} from "../fields";
import { StepperWrapper } from "./stepper-wrapper";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";

// ============================================================================
// MOBILE LAYOUT - Clean step-by-step wizard with proper mobile UX
// Following shadcn/ui + Tailwind v4 best practices:
// - text-sm/text-base for body, text-lg for headings
// - h-12 (48px) touch targets minimum
// - Consistent spacing-6 (24px) between sections
// - No card-in-card visual noise
// ============================================================================

// Step configuration for mobile wizard
const MOBILE_STEPS = [
  { id: 1, title: { en: "Item", bg: "Артикул" }, fields: ["title", "images"] },
  { id: 2, title: { en: "Details", bg: "Детайли" }, fields: ["categoryId", "condition", "brandId", "description", "attributes"] },
  { id: 3, title: { en: "Price", bg: "Цена" }, fields: ["price", "quantity", "shippingPrice", "sellerCity"] },
  { id: 4, title: { en: "Review", bg: "Преглед" }, fields: [] },
];

interface MobileLayoutProps {
  onSubmit: (data: SellFormDataV4) => void;
}

export function MobileLayout({ onSubmit }: MobileLayoutProps) {
  const form = useSellForm();
  const { currentStep, isBg } = useSellFormContext();

  // Handle submission
  const handleSubmit = () => {
    form.handleSubmit(
      (data) => onSubmit(data),
      () => { /* Validation errors handled by fields */ }
    )();
  };

  // Render current step content - clean, consistent spacing
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-section">
            {/* Section header - larger, clearer */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Какво продавате?" : "What are you selling?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Добавете заглавие и снимки на вашия артикул" : "Add a title and photos of your item"}
              </p>
            </div>
            
            {/* Title field */}
            <div className="space-y-form-sm">
              <TitleField compact />
            </div>
            
            {/* Photos section - clear label */}
            <div className="space-y-form-sm">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isBg ? "Снимки" : "Photos"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isBg ? "До 12 снимки. Първата е основна." : "Up to 12 photos. First one is the main image."}
                </p>
              </div>
              <PhotosField maxPhotos={12} compact />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-section">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Детайли за артикула" : "Item details"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Помогнете на купувачите да намерят вашия артикул" : "Help buyers find your item"}
              </p>
            </div>
            
            <div className="space-y-section">
              <CategoryField compact />
              <ConditionField compact />
              <BrandField compact />
              <AttributesField compact />
              <DescriptionField compact />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-section">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Цена и доставка" : "Pricing & shipping"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Задайте цена и изберете опции за доставка" : "Set your price and choose shipping options"}
              </p>
            </div>
            
            <div className="space-y-section">
              <PricingField compact />
              <ShippingField compact />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-section">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Преглед и публикуване" : "Review & publish"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Прегледайте обявата преди публикуване" : "Review your listing before publishing"}
              </p>
            </div>
            
            <ReviewField />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <StepperWrapper steps={MOBILE_STEPS} onSubmit={handleSubmit}>
      {renderStepContent()}
    </StepperWrapper>
  );
}
