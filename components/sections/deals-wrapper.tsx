import { getGlobalDeals, toUI, type Product, type ShippingZone } from '@/lib/data/products'
import { DealsSection } from '@/components/sections/deals-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

// Category slugs for filtering
const TECH_CATEGORIES = ['electronics', 'computers', 'gaming', 'smart-home', 'phones-tablets', 'audio']
const HOME_CATEGORIES = ['home', 'home-kitchen', 'kitchen', 'furniture', 'bedding', 'decor', 'garden']
const FASHION_CATEGORIES = ['fashion', 'women', 'men', 'shoes', 'bags', 'accessories']

/**
 * Async server component that fetches deals data.
 * Filters by user's selected shipping zone (from header dropdown).
 */
export async function DealsWrapper() {
  const locale = await getLocale()
  
  // Read user's shipping zone from cookie (set by header "Доставка до" dropdown)
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone
  
  // Fetch deals already filtered by zone (WW = show all)
  const rawDeals = await getGlobalDeals(80, userZone)
  const zonedDeals = rawDeals.slice(0, 30)
  
  // Transform to UI format
  const allDeals = zonedDeals.map(toUI)
  
  // Filter by category for tabs (using category_slug from zoned data, then transform)
  const filterAndTransform = (products: Product[], categories: string[]) =>
    products.filter(d => categories.includes(d.category_slug || '')).map(toUI)
  
  const techDeals = filterAndTransform(zonedDeals, TECH_CATEGORIES)
  const homeDeals = filterAndTransform(zonedDeals, HOME_CATEGORIES)
  const fashionDeals = filterAndTransform(zonedDeals, FASHION_CATEGORIES)
  
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
