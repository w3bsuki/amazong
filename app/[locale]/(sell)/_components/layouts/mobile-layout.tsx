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

// Step configuration for mobile wizard (low-friction flow)
// 1) Basics: title + category + condition
// 2) Photos: at least 1 photo
// 3) Pricing: price (+ shipping)
// 4) Review: final validation + publish
const MOBILE_STEPS = [
  { id: 1, title: { en: "Basics", bg: "Основно" }, fields: ["title", "categoryId", "condition"] },
  { id: 2, title: { en: "Photos", bg: "Снимки" }, fields: ["images"] },
  { id: 3, title: { en: "Price", bg: "Цена" }, fields: ["price", "quantity", "shippingPrice", "sellerCity"] },
  { id: 4, title: { en: "Review", bg: "Преглед" }, fields: [] },
];

interface MobileLayoutProps {
  onSubmit: (data: SellFormDataV4) => void;
}

export function MobileLayout({ onSubmit }: MobileLayoutProps) {
  const form = useSellForm();
  const { currentStep, setCurrentStep, isBg } = useSellFormContext();

  // Handle submission
  const handleSubmit = () => {
    form.handleSubmit(
      (data) => onSubmit(data),
      () => { /* Validation errors handled by fields */ }
    )();
  };

  const handleNext = async () => {
    const stepFields = MOBILE_STEPS[currentStep - 1]?.fields ?? [];
    const ok = stepFields.length > 0 ? await form.trigger(stepFields as never) : true;
    if (!ok) return;
    if (currentStep < MOBILE_STEPS.length) setCurrentStep(currentStep + 1);
  };

  // Render current step content - clean, consistent spacing
  const renderStepContent = () => {
    const categoryId = form.watch("categoryId");

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Section header - more compact */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Какво продавате?" : "What are you selling?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Изберете категория и добавете основните детайли" : "Pick a category and add the basics"}
              </p>
            </div>
            
            <div className="space-y-5">
              <TitleField compact />
              <CategoryField compact />

              {/* Item specifics should appear immediately after category on mobile */}
              <AttributesField compact />

              <ConditionField compact />
              
              {/* Only show BrandField if no category is selected or if it's a generic category */}
              {!categoryId && <BrandField compact />}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Снимки" : "Photos"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Добавете поне 1 снимка" : "Add at least 1 photo"}
              </p>
            </div>
            
            <div className="space-y-5">
              <PhotosField maxPhotos={12} compact />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Цена и доставка" : "Pricing & shipping"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Задайте цена и изберете опции за доставка" : "Set your price and choose shipping options"}
              </p>
            </div>
            
            <div className="space-y-5">
              <PricingField compact />
              <ShippingField compact />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isBg ? "Преглед и публикуване" : "Review & publish"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Прегледайте обявата преди публикуване" : "Review your listing before publishing"}
              </p>
            </div>
            
            <div className="space-y-5">
              <ReviewField onEditStep={(step) => setCurrentStep(step)} />
              <DescriptionField compact />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <StepperWrapper steps={MOBILE_STEPS} onSubmit={handleSubmit} onNext={handleNext}>
      {renderStepContent()}
    </StepperWrapper>
  );
}
