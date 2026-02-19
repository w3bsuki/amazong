import type { HomeDiscoveryScope } from "@/lib/home-browse-href"
import type { UIProduct } from "@/lib/types/products"

export interface HomeInitialPools {
  forYou: UIProduct[]
  newest?: UIProduct[]
  promoted?: UIProduct[]
  nearby?: UIProduct[]
  deals?: UIProduct[]
}

export interface UseHomeDiscoveryFeedOptions {
  initialPools: HomeInitialPools
  initialCategoryProducts?: Record<string, UIProduct[]>
  initialScope?: HomeDiscoveryScope
  limit?: number
}

export type HomePoolMap = Record<HomeDiscoveryScope, UIProduct[]>
