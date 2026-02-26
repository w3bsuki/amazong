import type { PromptSpec } from "@/lib/ai/prompts/registry"

export const LISTING_FIND_SIMILAR_PROMPT_ID = "listing.find-similar.v1.0"

export const listingFindSimilarPromptSpec: PromptSpec = {
  id: LISTING_FIND_SIMILAR_PROMPT_ID,
  version: "1.0",
  system:
    "You extract a short marketplace search query from an image. Return a compact query (2-6 words) and optional keywords.",
  inputTemplate:
    "Look at this product photo and produce a short search query to find similar items in our marketplace.",
  outputSchemaRef: "FindSimilarExtractedSchema",
  rolloutStatus: "active",
}

export function getListingFindSimilarPromptInput(): string {
  return listingFindSimilarPromptSpec.inputTemplate ?? ""
}
