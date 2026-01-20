"use client";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import {
  StepWhat,
  StepCategory,
  StepDetails,
  StepPricing,
  StepReview,
} from "../steps";
import { StepperWrapper } from "./stepper-wrapper";
import type { SellFormDataV4 } from "@/lib/sell/schema-v4";

// ============================================================================
// MOBILE LAYOUT - Premium 5-step wizard with Framer Motion animations
// New flow: What → Category → Details → Pricing → Review
// Following the PLAN-sell-form-masterpiece.md spec
// ============================================================================

// Step configuration for mobile wizard (5-step flow)
// 1) What: title + 1 photo (low friction entry)
// 2) Category: full-screen picker (determines subsequent fields)
// 3) Details: condition + attributes + description + additional photos
// 4) Pricing: price + shipping options
// 5) Review: final validation + publish
const MOBILE_STEPS = [
  { id: 1, title: { en: "What", bg: "Какво" }, fields: ["title", "images"] },
  { id: 2, title: { en: "Category", bg: "Категория" }, fields: ["categoryId"] },
  { id: 3, title: { en: "Details", bg: "Детайли" }, fields: ["condition"] },
  { id: 4, title: { en: "Price", bg: "Цена" }, fields: ["price", "shippingPrice", "sellerCity"] },
  { id: 5, title: { en: "Review", bg: "Преглед" }, fields: [] },
];

interface MobileLayoutProps {
  onSubmit: (data: SellFormDataV4) => void;
  isSubmitting?: boolean;
}

export function MobileLayout({ onSubmit, isSubmitting = false }: MobileLayoutProps) {
  const form = useSellForm();
  const { currentStep, setCurrentStep } = useSellFormContext();

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

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepWhat />;
      case 2:
        return <StepCategory />;
      case 3:
        return <StepDetails />;
      case 4:
        return <StepPricing />;
      case 5:
        return <StepReview />;
      default:
        return null;
    }
  };

  return (
    <StepperWrapper 
      steps={MOBILE_STEPS} 
      onSubmit={handleSubmit} 
      onNext={handleNext}
      isSubmitting={isSubmitting}
    >
      {renderStepContent()}
    </StepperWrapper>
  );
}
