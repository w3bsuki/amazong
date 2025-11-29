import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Truck, ShieldCheck, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { ReviewsSection } from "@/components/reviews-section"
import { AddToCart } from "@/components/add-to-cart"
import { getTranslations, getLocale } from "next-intl/server"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ProductPrice } from "@/components/product-price"
import { formatDeliveryDate, getEstimatedDeliveryDate } from "@/lib/currency"
import { StickyAddToCart } from "@/components/sticky-add-to-cart"
import type { Metadata } from 'next'

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

  // Fallback for mock data if DB is empty or connection fails
  if (!product) {
    // Check if it's one of our mock IDs
    const mockProducts = [
      {
        id: "1",
        title: "Wireless Noise Cancelling Headphones",
        price: 299.99,
        image: "/diverse-people-listening-headphones.jpg",
        rating: 4.5,
        reviews_count: 120,
        description: "Experience world-class noise cancellation with these premium headphones. Perfect for travel, work, or just relaxing with your favorite tunes. Features 30-hour battery life and plush ear cushions for all-day comfort.",
        is_prime: true
      },
      {
        id: "2",
        title: "Smartphone 5G 128GB Unlocked",
        price: 699.0,
        image: "/modern-smartphone.jpg",
        rating: 4.8,
        reviews_count: 85,
        description: "The latest 5G smartphone with a stunning display and pro-grade camera system. Unlocked for all carriers.",
        is_prime: true
      },
      {
        id: "3",
        title: "4K Ultra HD Smart TV 55 Inch",
        price: 449.99,
        image: "/retro-living-room-tv.jpg",
        rating: 4.2,
        reviews_count: 200,
        description: "Immerse yourself in 4K Ultra HD resolution. Smart functionality lets you stream your favorite content instantly.",
        is_prime: false
      },
      {
        id: "4",
        title: "Professional DSLR Camera Kit",
        price: 1299.0,
        image: "/vintage-camera-still-life.jpg",
        rating: 4.9,
        reviews_count: 45,
        description: "Capture life's moments in stunning detail with this professional DSLR kit. Includes 18-55mm lens and carrying case.",
        is_prime: true
      },
    ]
    product = mockProducts.find(p => p.id === id)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-10">
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-fit order-1 items-start">
            {/* Thumbnails - horizontal scroll on mobile, vertical on desktop */}
            <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar sm:w-[60px] pb-2 sm:pb-0 order-2 sm:order-1">
              {(product.images || [product.image]).slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="border border-product-card-border rounded-sm p-1 cursor-pointer hover:shadow-product transition-shadow shrink-0 w-14 sm:w-full">
                  <div className="relative w-full aspect-square">
                    <Image src={img || "/placeholder.svg"} alt="Thumbnail" fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="relative w-full sm:w-[calc(100%-76px)] h-[400px] sm:h-[500px] lg:h-[600px] order-1 sm:order-2">
              <Image
                src={product.images?.[0] || product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain object-top"
                priority
              />
            </div>
          </div>

          {/* Middle Column: Product Details */}
          <div className="flex flex-col gap-2 order-2">
            <h1 className="text-xl sm:text-2xl font-medium text-foreground leading-tight mb-1">{product.title}</h1>

            <div className="flex items-center gap-2 mb-2">
              <div 
                role="img" 
                aria-label={t('ratingLabel', { rating: product.rating || 0, max: 5 })}
                className="flex text-rating text-sm"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"}
                    className="h-4 w-4"
                  />
                ))}
              </div>
              <span className="text-link hover:text-link-hover hover:underline cursor-pointer text-sm font-medium">
                {t('ratings', { count: product.reviews_count })}
              </span>
            </div>

            <Separator className="my-2" />

            <div className="flex flex-col gap-1">
              <ProductPrice 
                price={product.price} 
                originalPrice={product.original_price}
                locale={locale} 
                size="md"
              />
              {product.is_prime && (
                <div className="flex items-center gap-1 text-link text-sm">
                  <span className="font-bold text-shipping-prime">prime</span>
                  <span className="text-muted-foreground">{t('primeOneDay')}</span>
                </div>
              )}
              <span className="text-sm text-foreground">{t('freeReturns')}</span>
            </div>

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

          {/* Right Column: Buy Box - Full width on mobile, sticky on desktop */}
          <div className="border border-border rounded-lg p-4 h-fit lg:sticky lg:top-4 bg-card order-3">
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
                image: product.images?.[0] || product.image || "/placeholder.svg"
              }}
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {relatedProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  image={p.images?.[0] || p.image || "/placeholder.svg"}
                  rating={p.rating}
                  reviews={p.reviews_count}
                />
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6 sm:my-8" />

        {/* Reviews Section */}
        <ReviewsSection rating={product.rating || 0} reviewCount={product.reviews_count || product.review_count || 0} productId={product.id} />
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart 
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.svg"
        }}
        locale={locale}
      />
    </div>
  )
}
