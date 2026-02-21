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

  return (
    <StepLayout
      title={tSell("steps.review.title")}
      description={tSell("steps.review.description")}
      contentClassName="space-y-5"
    >
      <ReviewField onEditStep={setCurrentStep} />
    </StepLayout>
  )
}
