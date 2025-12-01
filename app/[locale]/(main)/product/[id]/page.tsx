import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Truck, ShieldCheck, ArrowCounterClockwise, Lightning } from "@phosphor-icons/react/dist/ssr"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { ReviewsSection } from "@/components/reviews-section"
import { AddToCart } from "@/components/add-to-cart"
import { getTranslations, getLocale } from "next-intl/server"
import { RatingScrollLink } from "@/components/rating-scroll-link"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ProductPrice } from "@/components/product-price"
import { formatDeliveryDate, getEstimatedDeliveryDate } from "@/lib/currency"
import { StickyAddToCart } from "@/components/sticky-add-to-cart"
import type { Metadata } from 'next'

// Tag configuration for badges
const TAG_CONFIG: Record<string, { color: string; label: string; labelBg: string }> = {
  new: { color: "bg-green-500", label: "NEW", labelBg: "НОВО" },
  sale: { color: "bg-red-500", label: "SALE", labelBg: "РАЗПРОДАЖБА" },
  limited: { color: "bg-purple-500", label: "LIMITED", labelBg: "ЛИМИТИРАНО" },
  trending: { color: "bg-orange-500", label: "TRENDING", labelBg: "ПОПУЛЯРНО" },
  bestseller: { color: "bg-yellow-500", label: "BESTSELLER", labelBg: "ТОП" },
  premium: { color: "bg-blue-600", label: "PREMIUM", labelBg: "ПРЕМИУМ" },
  handmade: { color: "bg-amber-600", label: "HANDMADE", labelBg: "РЪЧНА ИЗРАБОТКА" },
  "eco-friendly": { color: "bg-emerald-500", label: "ECO-FRIENDLY", labelBg: "ЕКОЛОГИЧЕН" },
}

interface ProductPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = await createClient();
  
  let product: any = null;
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("title, description, price, images")
      .eq("id", id)
      .single();
    product = data;
  }
  
  if (!product) {
    return {
      title: locale === 'bg' ? 'Продукт не е намерен' : 'Product Not Found',
    };
  }
  
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Shop ${product.title} at AMZN`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const t = await getTranslations('Product')
  const locale = await getLocale()

  // Get current user
  let currentUserId: string | null = null
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    currentUserId = user?.id || null
  }

  // Get estimated delivery date
  const deliveryDate = getEstimatedDeliveryDate(1)
  const formattedDeliveryDate = formatDeliveryDate(deliveryDate, locale)

  // Fetch product data
  let product: any = null
  let relatedProducts: any[] = []
  let category: any = null
  let parentCategory: any = null

  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
    } else {
      product = data
      category = data?.categories
      
      // Fetch parent category if this is a subcategory
      if (category?.parent_id) {
        const { data: parent } = await supabase
          .from("categories")
          .select("*")
          .eq("id", category.parent_id)
          .single()
        parentCategory = parent
      }
    }

    // Fetch related products (random for now)
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .neq("id", id)
      .limit(4)

    if (related) {
      relatedProducts = related
    }
  }

  // Product not found
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {/* Track this product as recently viewed */}
      <RecentlyViewedTracker 
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || null,
          slug: product.id
        }}
      />
      
      <div className="container py-4 sm:py-8">
        {/* Breadcrumb */}
        <AppBreadcrumb 
          items={[
            ...(parentCategory ? [{ label: parentCategory.name, href: `/search?category=${parentCategory.slug}` }] : []),
            ...(category ? [{ label: category.name, href: `/search?category=${category.slug}` }] : []),
            { label: product.title?.slice(0, 40) + (product.title?.length > 40 ? '...' : '') }
          ]} 
        />
        
        {/* Mobile-first responsive grid layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px_300px] gap-4 sm:gap-6 lg:gap-8 mt-4 items-start">

          {/* Images Section - Thumbnails left, main image right on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-fit order-1 items-start w-full">
            {/* Thumbnails - horizontal scroll on mobile, vertical on desktop */}
            <div className="hidden sm:flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar sm:w-[60px] pb-2 sm:pb-0 order-2 sm:order-1">
              {(product.images || [product.image]).slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="border border-product-card-border rounded-sm p-1 cursor-pointer hover:shadow-product transition-shadow shrink-0 w-14 sm:w-full">
                  <div className="relative w-full aspect-square">
                    <Image src={img || "/placeholder.svg"} alt="Thumbnail" fill className="object-contain" sizes="60px" />
                  </div>
                </div>
              ))}
            </div>
            {/* Main image - Full width on mobile */}
            <div className="relative w-full aspect-square sm:w-[calc(100%-76px)] sm:h-[500px] lg:h-[600px] sm:aspect-auto order-1 sm:order-2 bg-muted/30 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[0] || product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority
              />
            </div>
            {/* Mobile thumbnails - below main image */}
            <div className="flex sm:hidden gap-2 overflow-x-auto no-scrollbar pb-2 order-2">
              {(product.images || [product.image]).slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="border border-product-card-border rounded-sm p-1 cursor-pointer hover:shadow-product transition-shadow shrink-0 w-16">
                  <div className="relative w-full aspect-square">
                    <Image src={img || "/placeholder.svg"} alt="Thumbnail" fill className="object-contain" sizes="60px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: Product Details */}
          <div className="flex flex-col gap-2 order-2">
            {/* Tags Badges */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.is_boosted && (
                  <Badge className="bg-amber-500 text-white border-0 text-xs px-2 py-0.5 font-medium flex items-center gap-1">
                    <Lightning weight="fill" className="w-3 h-3" />
                    {locale === 'bg' ? 'Промотирано' : 'Boosted'}
                  </Badge>
                )}
                {product.tags.map((tag: string) => {
                  const config = TAG_CONFIG[tag]
                  if (!config) return null
                  return (
                    <Badge 
                      key={tag} 
                      className={`${config.color} text-white border-0 text-xs px-2 py-0.5 font-medium`}
                    >
                      {locale === 'bg' ? config.labelBg : config.label}
                    </Badge>
                  )
                })}
              </div>
            )}
            
            <h1 className="text-xl sm:text-2xl font-medium text-foreground leading-tight mb-1">{product.title}</h1>

            <RatingScrollLink 
              rating={product.rating || 0}
              ratingLabel={t('ratingLabel', { rating: product.rating || 0, max: 5 })}
              ratingsText={t('ratings', { count: product.reviews_count })}
            />

            <Separator className="my-2" />

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs text-link my-4">
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <ArrowCounterClockwise className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground group-hover:text-link" />
                <span className="group-hover:text-link-hover group-hover:underline text-[10px] sm:text-xs">{t('freeReturns')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground group-hover:text-link" />
                <span className="group-hover:text-link-hover group-hover:underline text-[10px] sm:text-xs">{t('freeDelivery')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground group-hover:text-link" />
                <span className="group-hover:text-link-hover group-hover:underline text-[10px] sm:text-xs">{t('secureTransaction')}</span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="text-sm text-foreground leading-relaxed">
              <h3 className="font-bold mb-2 text-[16px]">{t('aboutThisItem')}</h3>
              <p>{product.description || "No description available."}</p>
            </div>
          </div>

          {/* Right Column: Buy Box - Hidden on mobile, sticky on desktop */}
          <div className="hidden lg:block border border-border rounded-lg p-4 h-fit lg:sticky lg:top-4 bg-card order-3">
            <ProductPrice 
              price={product.price} 
              originalPrice={product.original_price}
              locale={locale} 
              size="md"
            />

            <div className="text-sm text-muted-foreground mb-4 mt-2">
              {t('freeDeliveryDate', { date: formattedDeliveryDate })}
            </div>

            <div className="text-[18px] text-stock-available font-medium mb-4">{t('inStock')}</div>

            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || product.image || "/placeholder.svg",
                seller_id: product.seller_id
              }}
              currentUserId={currentUserId}
            />

            <div className="mt-4 text-xs text-muted-foreground space-y-2">
              <div className="flex gap-2">
                <span className="w-24">{t('shipsFrom')}</span>
                <span className="text-foreground">{t('amazonStore')}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24">{t('soldBy')}</span>
                <span className="text-foreground">{t('amazonStore')}</span>
              </div>
            </div>
          </div>

        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Reviews Section - Above Related Products */}
        <div id="reviews">
          <ReviewsSection rating={product.rating || 0} reviewCount={product.reviews_count || product.review_count || 0} productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {relatedProducts.map((p: any, idx: number) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  image={p.images?.[0] || p.image || "/placeholder.svg"}
                  rating={p.rating || 0}
                  reviews={p.review_count || 0}
                  originalPrice={p.list_price}
                  tags={p.tags || []}
                  index={idx}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart 
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.svg",
          seller_id: product.seller_id
        }}
        locale={locale}
        currentUserId={currentUserId}
      />
    </div>
  )
}
