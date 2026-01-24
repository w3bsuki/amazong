import "server-only"

import { tool } from "ai"

import {
  SearchListingsInputSchema,
  type ListingCard,
  type ListingDetail,
} from "@/lib/ai/schemas/listings"
import { searchListings } from "@/lib/ai/tools/search-listings"
import { getListing, getListingToolInputSchema } from "@/lib/ai/tools/get-listing"

export const assistantTools = {
  searchListings: tool({
    inputSchema: SearchListingsInputSchema,
    description:
      "Search Treido listings by a short query. Use this to recommend items from our marketplace.",
    execute: async (input): Promise<ListingCard[]> => {
      return searchListings(input)
    },
  }),
  getListing: tool({
    inputSchema: getListingToolInputSchema,
    description: "Fetch full details for a single listing by id.",
    execute: async (input): Promise<ListingDetail | null> => {
      return getListing(input)
    },
  }),
}

