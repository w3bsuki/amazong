"use client";

import { useSellFormContext } from "../sell-form-provider";
import { ReviewField } from "../fields";

// ============================================================================
// STEP 5: REVIEW & PUBLISH - Preview + Validation + Publish
// Final check before going live. Build confidence.
// ============================================================================

export function StepReview() {
  const { isBg, setCurrentStep } = useSellFormContext();

  // Map review edit requests to the new 5-step structure
  // ReviewField passes: 1=Photos & Title, 2=Category & Condition, 3=Pricing
  // New steps: 1=What, 2=Category, 3=Details, 4=Pricing, 5=Review
  const handleEditStep = (oldStep: number) => {
    const stepMapping: Record<number, number> = {
      1: 1, // Photos & Title → Step 1 (What - Title + 1 Photo)
      2: 3, // Category & Condition → Step 3 (Details - has condition & category-aware attributes)
      3: 4, // Price & Shipping → Step 4 (Pricing)
    };
    setCurrentStep(stepMapping[oldStep] || oldStep);
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isBg ? "Преглед и публикуване" : "Review & publish"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isBg 
            ? "Прегледайте обявата преди публикуване" 
            : "Review your listing before publishing"}
        </p>
      </div>
      
      <ReviewField onEditStep={handleEditStep} />
    </div>
  );
}
