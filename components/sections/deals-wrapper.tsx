import { getGlobalDeals } from '@/lib/data/products'
import { DealsSection } from '@/components/deals-section'
import { getLocale } from 'next-intl/server'

// Category slugs for filtering
const TECH_CATEGORIES = ['electronics', 'computers', 'gaming', 'smart-home', 'phones-tablets', 'audio']
const HOME_CATEGORIES = ['home', 'home-kitchen', 'kitchen', 'furniture', 'bedding', 'decor', 'garden']
const FASHION_CATEGORIES = ['fashion', 'women', 'men', 'shoes', 'bags', 'accessories']

/**
 * Async server component that fetches deals data.
 * Uses cached data function - returns all deals, categorized for tabs.
 */
export async function DealsWrapper() {
  const locale = await getLocale()
  
  // Fetch all deals from cache
  const allDeals = await getGlobalDeals(30)
  
  // Filter by category for tabs
  const techDeals = allDeals.filter(d => TECH_CATEGORIES.includes(d.categorySlug || ''))
  const homeDeals = allDeals.filter(d => HOME_CATEGORIES.includes(d.categorySlug || ''))
  const fashionDeals = allDeals.filter(d => FASHION_CATEGORIES.includes(d.categorySlug || ''))
  
  return (
    <DealsSection
      title={locale === "bg" ? "Оферти на деня" : "Deals of the Day"}
      tabs={[
        {
          id: "all",
          label: locale === "bg" ? "Всички" : "All Deals",
          deals: allDeals,
        },
        {
          id: "electronics",
          label: locale === "bg" ? "Техника" : "Tech",
          deals: techDeals.length > 0 ? techDeals : allDeals.slice(0, 4),
        },
        {
          id: "home",
          label: locale === "bg" ? "За дома" : "Home",
          deals: homeDeals.length > 0 ? homeDeals : allDeals.slice(0, 4),
        },
        {
          id: "fashion",
          label: locale === "bg" ? "Мода" : "Fashion",
          deals: fashionDeals.length > 0 ? fashionDeals : allDeals.slice(0, 4),
        },
      ]}
      ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
      ctaHref="/todays-deals"
    />
  )
}
