import { useTranslations } from "next-intl"
import { PhotosField } from "../fields/photos-field"
import { TitleField } from "../fields/title-field"
import { StepLayout } from "./step-layout"

// ============================================================================
// STEP 1: WHAT - Title + 1 Primary Photo
// Low-friction entry point. User names their item + shows us what it looks like.
// ~10 seconds to complete.
// ============================================================================

export function StepWhat() {
  const tSell = useTranslations("Sell")

  return (
    <StepLayout
      title={tSell("steps.what.title")}
      description={tSell("steps.what.description")}
      contentClassName="space-y-5"
    >
      <TitleField compact />
      <PhotosField compact maxPhotos={8} />
    </StepLayout>
  )
}

