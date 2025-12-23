import { getNewestProducts, toUI, type Product } from '@/lib/data/products'
import { NewestListingsSection as NewestListingsClient } from './newest-listings-section'

/**
 * Server component that fetches initial newest products.
 * Passes data to client component for infinite scroll.
 */
export async function NewestListings({ categories }: { categories?: any[] }) {
  // Fetch initial batch of newest products (12 items)
  const products = await getNewestProducts(12)
  
  // Transform to UI format
  const uiProducts = products.map((p: Product) => ({
    ...toUI(p),
  }))
  
  return (
    <NewestListingsClient 
      initialProducts={uiProducts}
      totalCount={100} // Assume there are more for now
      categories={categories}
    />
  )
}
