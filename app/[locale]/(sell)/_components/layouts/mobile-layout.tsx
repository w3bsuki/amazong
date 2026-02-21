"use client";

import { useMemo } from "react";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { StepCategory } from "../steps/step-category";
import { StepDetails } from "../steps/step-details";
import { StepPhotos } from "../steps/step-photos";
import { StepPricing } from "../steps/step-pricing";
import { StepReview } from "../steps/step-review";
import { StepperWrapper } from "./stepper-wrapper";
import type { SellFormDataV4 } from "@/lib/sell/schema";

// ============================================================================
// MOBILE LAYOUT - Premium 5-step wizard with Framer Motion animations
// New flow: Photos → Details → Category → Pricing → Review
// Following the PLAN-sell-form-masterpiece.md spec
// ============================================================================

// Step configuration for mobile wizard (5-step flow)
// 1) Photos: upload + reorder + cover photo
// 2) Details: title + description + condition
// 3) Category: hierarchical picker (+ optional specifics)
// 4) Pricing: price + shipping + location
// 5) Review: summary + publish
const MOBILE_STEPS = [
  { id: 1, fields: ["images"] },
  { id: 2, fields: ["title", "description", "condition"] },
  { id: 3, fields: ["categoryId", "brandId", "brandName", "attributes"] },
  { id: 4, fields: ["format", "price", "compareAtPrice", "quantity", "shippingPrice", "sellerCity"] },
  { id: 5, fields: [] },
];

interface MobileLayoutProps {
  onSubmit: (data: SellFormDataV4) => void;
  isSubmitting?: boolean;
}

export function MobileLayout({ onSubmit, isSubmitting = false }: MobileLayoutProps) {
  const form = useSellForm();
  const { currentStep, setCurrentStep } = useSellFormContext();

  const images = form.watch("images");
  const title = form.watch("title");
  const categoryId = form.watch("categoryId");
  const condition = form.watch("condition");
  const description = form.watch("description");
  const price = form.watch("price");

  const canContinue = useMemo(() => {
    if (currentStep === 1) {
      const hasPhotos = Boolean(images && images.length > 0);
      return hasPhotos;
    }

    if (currentStep === 2) {
      const hasTitle = Boolean(title && title.trim().length >= 5);
      const hasDescription = Boolean(description && description.trim().length >= 50);
      const hasCondition = Boolean(condition);
      return hasTitle && hasDescription && hasCondition;
    }

    if (currentStep === 3) {
      return Boolean(categoryId);
    }

    if (currentStep === 4) {
      return Boolean(price && Number.parseFloat(price) > 0);
    }

    return true;
  }, [categoryId, condition, currentStep, description, images, price, title]);

  const isPublishDisabled = useMemo(() => {
    const hasPhotos = Boolean(images && images.length > 0);
    const hasTitle = Boolean(title && title.trim().length >= 5);
    const hasCategory = Boolean(categoryId);
    const hasCondition = Boolean(condition);
    const hasDescription = Boolean(description && description.trim().length >= 50);
    const hasPrice = Boolean(price && Number.parseFloat(price) > 0);
    return !(hasPhotos && hasTitle && hasCategory && hasCondition && hasDescription && hasPrice);
  }, [categoryId, condition, description, images, price, title]);

  // Handle submission
  const handleSubmit = () => {
    form.handleSubmit(
      (data) => onSubmit(data),
      (errors) => {
        const errorKeys = Object.keys(errors);
        const firstError = errorKeys[0];
        if (!firstError) return;

        if (firstError === "images") {
          setCurrentStep(1);
          return;
        }

        if (firstError === "title" || firstError === "description" || firstError === "condition") {
          setCurrentStep(2);
          return;
        }

        if (
          firstError === "categoryId" ||
          firstError === "categoryPath" ||
          firstError === "attributes" ||
          firstError === "brandId" ||
          firstError === "brandName"
        ) {
          setCurrentStep(3);
          return;
        }

        setCurrentStep(4);
      }
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
        return <StepPhotos />;
      case 2:
        return <StepDetails />;
      case 3:
        return <StepCategory />;
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
      isNextDisabled={!canContinue}
      isSubmitDisabled={isPublishDisabled}
    >
      {renderStepContent()}
    </StepperWrapper>
  );
}


