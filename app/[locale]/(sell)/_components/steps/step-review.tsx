import { useTranslations } from "next-intl"
import { ReviewField } from "../fields/review-field"
import { useSellFormContext } from "../sell-form-provider"
import { StepLayout } from "./step-layout"

// ============================================================================
// STEP 5: REVIEW & PUBLISH - Preview + Validation + Publish
// Final check before going live. Build confidence.
// ============================================================================

export function StepReview() {
  const { setCurrentStep } = useSellFormContext()
  const tSell = useTranslations("Sell")

  // Map review edit requests to the new 5-step structure
  // ReviewField passes: 1=Photos & Title, 2=Category & Condition, 3=Pricing
  // New steps: 1=What, 2=Category, 3=Details, 4=Pricing, 5=Review
  const handleEditStep = (oldStep: number) => {
    const stepMapping: Record<number, number> = {
      1: 1, // Photos & Title → Step 1 (What - Title + 1 Photo)
      2: 3, // Category & Condition → Step 3 (Details - has condition & category-aware attributes)
      3: 4, // Price & Shipping → Step 4 (Pricing)
    }
    setCurrentStep(stepMapping[oldStep] || oldStep)
  }

  return (
    <StepLayout
      title={tSell("steps.review.title")}
      description={tSell("steps.review.description")}
      contentClassName="space-y-5"
    >
      <ReviewField onEditStep={handleEditStep} />
    </StepLayout>
  )
}
