import { createClient } from "@/lib/supabase/server"
import { getLocale } from "next-intl/server"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Sellers | Amazong',
  description: 'Discover top-rated sellers on Amazong. Shop from verified merchants with great reviews.',
}

interface Seller {
  id: string
  store_name: string
  description: string | null
  verified: boolean
  created_at: string
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export default async function SellersPage() {
  const supabase = await createClient()
  const locale = await getLocale()
  
  // Fetch sellers with product count and average rating
  let sellers: any[] = []
  if (supabase) {
    const { data } = await supabase
      .from("sellers")
      .select(`
        id,
        store_name,
        description,
        verified,
        created_at,
        profiles!sellers_id_fkey (
          avatar_url
        ),
        products (
          id,
          rating
        )
      `)
      .order("verified", { ascending: false })
      .order("created_at", { ascending: false })
    sellers = data || []
  }
  
  // Transform data to include product count and average rating
  const sellersWithStats: Seller[] = (sellers || []).map((seller: any) => {
    const products = seller.products || []
    const validRatings = products.filter((p: any) => p.rating !== null && p.rating > 0)
    const avgRating = validRatings.length > 0 
      ? validRatings.reduce((sum: number, p: any) => sum + p.rating, 0) / validRatings.length
      : null
    
    return {
      id: seller.id,
      store_name: seller.store_name,
      description: seller.description,
      verified: seller.verified,
      created_at: seller.created_at,
      product_count: products.length,
      total_rating: avgRating,
      avatar_url: seller.profiles?.avatar_url || null
    }
  })
  
  // Sort by product count (top sellers have more products)
  sellersWithStats.sort((a, b) => b.product_count - a.product_count)

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-amber-500 via-amber-500 to-amber-400 text-white py-6 sm:py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="[&_nav]:border-white/20 [&_nav]:mb-2 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb 
              items={[
                { label: locale === 'bg' ? 'Начало' : 'Home', href: '/' },
                { label: locale === 'bg' ? 'Топ продавачи' : 'Top Sellers' }
              ]}
              homeLabel={locale === "bg" ? "Начало" : "Amazong"}
            />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="size-6 sm:size-7 text-white" fill="currentColor" viewBox="0 0 256 256">
                <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Zm-64,80a24,24,0,0,1-24,24H112a24,24,0,0,1-24-24V48a8,8,0,0,1,8-8H168a8,8,0,0,1,8,8Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {locale === 'bg' ? 'Топ продавачи' : 'Top Sellers'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                {locale === "bg" 
                  ? "Открийте най-добрите продавачи в платформата" 
                  : "Discover the best sellers on our platform"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{sellersWithStats.length}</span>{" "}
          {locale === "bg" ? "продавачи" : "sellers"}
        </p>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sellersWithStats.map((seller) => (
            <Link href={`/search?seller=${seller.id}`} key={seller.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border rounded-lg overflow-hidden group">
                <CardContent className="p-4">
                  {/* Seller Avatar and Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-14 rounded-full bg-linear-to-br from-brand to-brand/70 flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
                      {seller.avatar_url ? (
                        <img 
                          src={seller.avatar_url} 
                          alt={seller.store_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        seller.store_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {seller.store_name}
                        </h3>
                        {seller.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-1.5 py-0 shrink-0">
                            {locale === 'bg' ? 'Потвърден' : 'Verified'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {locale === 'bg' ? 'Член от' : 'Member since'}{' '}
                        {new Date(seller.created_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {seller.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {seller.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="font-medium text-foreground">{seller.product_count}</span>
                      <span>{locale === 'bg' ? 'продукта' : 'products'}</span>
                    </div>
                    {seller.total_rating && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <svg className="size-4 text-rating fill-current" viewBox="0 0 256 256">
                          <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34L128,200.26,76.93,229.68a16,16,0,0,1-23.84-17.34l13.51-58.6L21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
                        </svg>
                        <span className="font-medium text-foreground">{seller.total_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {sellersWithStats.length === 0 && (
          <div className="text-center py-12">
            <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="size-8 text-muted-foreground" fill="currentColor" viewBox="0 0 256 256">
                <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === "bg" ? "Все още няма продавачи" : "No sellers yet"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {locale === "bg" 
                ? "Бъдете първият продавач в нашата платформа" 
                : "Be the first seller on our platform"}
            </p>
            <Link href="/sell">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                {locale === 'bg' ? 'Започни да продаваш' : 'Start Selling'}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
