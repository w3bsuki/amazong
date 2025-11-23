import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { ReviewsSection } from "@/components/reviews-section"
import { AddToCart } from "@/components/add-to-cart"
import { getTranslations } from "next-intl/server"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const t = await getTranslations('Product')

  // Fetch product data
  let product: any = null
  let relatedProducts: any[] = []

  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
    } else {
      product = data
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
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_400px_300px] gap-8">

          {/* Left Column: Images */}
          <div className="flex gap-4 sticky top-4 h-fit">
            <div className="flex flex-col gap-3 w-[60px]">
              {(product.images || [product.image]).slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="border border-[#a2a6ac] rounded-[2px] p-1 cursor-pointer hover:shadow-[0_0_0_2px_#e77600] hover:border-[#e77600] transition-all">
                  <div className="relative w-full aspect-square">
                    <Image src={img || "/placeholder.svg"} alt="Thumbnail" fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 relative aspect-square max-h-[600px] min-h-[400px]">
              <Image
                src={product.images?.[0] || product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Middle Column: Product Details */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-medium text-[#0F1111] leading-tight mb-1">{product.title}</h1>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-[#f08804] text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-transparent stroke-current stroke-1 text-[#f08804]"}`}
                  />
                ))}
              </div>
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer text-sm font-medium">
                {t('ratings', { count: product.reviews_count })}
              </span>
            </div>

            <Separator className="my-2" />

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-sm align-top font-medium text-[#0F1111] relative top-1.5">$</span>
                <span className="text-[28px] font-medium text-[#0F1111]">{Math.floor(product.price)}</span>
                <span className="text-sm align-top font-medium text-[#0F1111] relative top-1.5">{(product.price % 1).toFixed(2).substring(1)}</span>
              </div>
              {product.is_prime && (
                <div className="flex items-center gap-1 text-[#007185] text-sm">
                  <span className="font-bold text-[#00a8e1]">prime</span>
                  <span className="text-[#565959]">One-Day</span>
                </div>
              )}
              <span className="text-sm text-[#0F1111]">{t('freeReturns')}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-[#007185] my-4">
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <RotateCcw className="h-8 w-8 text-gray-400 group-hover:text-[#e77600]" />
                <span className="group-hover:text-[#c7511f] group-hover:underline">{t('freeReturns')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <Truck className="h-8 w-8 text-gray-400 group-hover:text-[#e77600]" />
                <span className="group-hover:text-[#c7511f] group-hover:underline">{t('freeDelivery')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group cursor-pointer">
                <ShieldCheck className="h-8 w-8 text-gray-400 group-hover:text-[#e77600]" />
                <span className="group-hover:text-[#c7511f] group-hover:underline">{t('secureTransaction')}</span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="text-sm text-[#0F1111] leading-relaxed">
              <h3 className="font-bold mb-2 text-[16px]">{t('aboutThisItem')}</h3>
              <p>{product.description || "No description available."}</p>
            </div>
          </div>

          {/* Right Column: Buy Box */}
          <div className="border border-[#d5d9d9] rounded-[8px] p-4 h-fit sticky top-4 bg-white shadow-sm">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-sm align-top font-medium text-[#0F1111]">$</span>
              <span className="text-[28px] font-medium text-[#0F1111]">{Math.floor(product.price)}</span>
              <span className="text-sm align-top font-medium text-[#0F1111]">{(product.price % 1).toFixed(2).substring(1)}</span>
            </div>

            <div className="text-sm text-[#565959] mb-4">
              FREE delivery <span className="font-bold text-[#0F1111]">Monday, August 14</span>
            </div>

            <div className="text-[18px] text-[#007600] font-medium mb-4">{t('inStock')}</div>

            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || product.image || "/placeholder.svg"
              }}
            />

            <div className="mt-4 text-xs text-[#565959] space-y-2">
              <div className="flex gap-2">
                <span className="w-20">{t('shipsFrom')}</span>
                <span className="text-[#0F1111]">Amazon.com</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20">{t('soldBy')}</span>
                <span className="text-[#0F1111]">Amazon.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black mb-4">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

        <Separator className="my-8" />

        {/* Reviews Section */}
        <ReviewsSection rating={product.rating || 0} reviewCount={product.reviews_count || 0} />
      </div>
    </div>
  )
}
