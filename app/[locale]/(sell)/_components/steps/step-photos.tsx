import { useTranslations } from "next-intl"
import { PhotosField } from "../fields/photos-field"
import { StepLayout } from "./step-layout"

// ============================================================================
// STEP 1: PHOTOS - Upload + reorder + set cover
// ============================================================================

export function StepPhotos() {
  const tSell = useTranslations("Sell")

  return (
    <StepLayout
      title={tSell("steps.photos.title")}
      description={tSell("steps.photos.description")}
      contentClassName="space-y-5"
    >
      <PhotosField compact maxPhotos={12} />
    </StepLayout>
  )
}

