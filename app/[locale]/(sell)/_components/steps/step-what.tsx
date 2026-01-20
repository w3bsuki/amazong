"use client";

import { useSellFormContext } from "../sell-form-provider";
import { TitleField, PhotosField } from "../fields";

// ============================================================================
// STEP 1: WHAT - Title + 1 Primary Photo
// Low-friction entry point. User names their item + shows us what it looks like.
// ~10 seconds to complete.
// ============================================================================

export function StepWhat() {
  const { isBg } = useSellFormContext();

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isBg ? "Какво продавате?" : "What are you selling?"}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {isBg 
            ? "Дайте име на артикула и добавете снимка" 
            : "Give your item a name and add a photo"}
        </p>
      </div>
      
      <div className="space-y-5">
        <TitleField compact />
        <PhotosField maxPhotos={1} compact />
      </div>
    </div>
  );
}
