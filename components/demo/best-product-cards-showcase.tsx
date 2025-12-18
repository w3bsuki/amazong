import { ProductCard, type ProductCardProps } from "@/components/ui/product-card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

type CardRecipe = {
  id: string
  title: string
  description: string
  card: ProductCardProps
}

const recipes: CardRecipe[] = [
  {
    id: "everyday-default",
    title: "Everyday Grid",
    description: "Fast scan: image, title, price, wishlist + quick add.",
    card: {
      id: "demo-1",
      slug: "vw-golf-7-tdi-highline",
      title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service History",
      price: 18500,
      originalPrice: 19900,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80",
      categorySlug: "cars",
      make: "Volkswagen",
      model: "Golf 7",
      year: "2016",
      location: "Sofia",
      rating: 4.8,
      reviews: 124,
    },
  },
  {
    id: "trust-seller-first",
    title: "Trust (Seller-First)",
    description: "Best for high-value: seller credibility first, then product.",
    card: {
      id: "demo-2",
      slug: "bmw-320d-xdrive-msport",
      title: "BMW 320d xDrive M-Sport · Dealer Maintained",
      price: 22500,
      originalPrice: 24400,
      image: "https://images.unsplash.com/photo-1555215695-3004980adade?w=1200&q=80",
      variant: "featured",
      sellerName: "AutoPremium Sofia",
      sellerVerified: true,
      sellerAvatarUrl: "https://github.com/shadcn.png",
      rating: 4.9,
      reviews: 310,
      showPills: true,
      categorySlug: "cars",
      make: "BMW",
      model: "320d",
      year: "2018",
      location: "Sofia",
      tags: ["Warranty", "Leasing", "Inspected"],
    },
  },
  {
    id: "deal-focused",
    title: "Deal-Focused",
    description: "Clear discount + promoted state, strong price hierarchy.",
    card: {
      id: "demo-3",
      slug: "sony-wh-1000xm5-anc",
      title: "Sony WH-1000XM5 · Noise Cancelling · Black",
      price: 499,
      originalPrice: 629,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80",
      isBoosted: true,
      categorySlug: "electronics",
      brand: "Sony",
      condition: "New",
      year: "2024",
      location: "Sofia",
      tags: ["ANC", "Bluetooth", "Case"],
      rating: 4.7,
      reviews: 2847,
    },
  },
  {
    id: "clean-default",
    title: "Clean Default",
    description: "Default layout for dense grids and category pages.",
    card: {
      id: "demo-4",
      slug: "iphone-15-pro-max-256gb",
      title: "iPhone 15 Pro Max · 256GB · Like New",
      price: 2099,
      originalPrice: 2399,
      image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=1200&q=80",
      sellerName: "TechHub",
      sellerVerified: true,
      categorySlug: "electronics",
      brand: "Apple",
      condition: "Like new",
      year: "2024",
      location: "Plovdiv",
      rating: 5,
      reviews: 42,
    },
  },
  {
    id: "fashion",
    title: "Fashion Item",
    description: "Clean card with brand + condition info.",
    card: {
      id: "demo-5",
      slug: "nike-air-max-97-size-42",
      title: "Nike Air Max 97 · Size 42 · Clean",
      price: 159,
      originalPrice: 219,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      categorySlug: "fashion",
      brand: "Nike",
      condition: "Good",
      location: "Varna",
      tags: ["Authentic", "Fast ship", "Size 42"],
      rating: 4.7,
      reviews: 89,
    },
  },
  {
    id: "no-cta-browse",
    title: "Browse-Only (No CTA)",
    description: "Pure browsing: no cart/wishlist CTA clutter.",
    card: {
      id: "demo-6",
      slug: "herman-miller-aeron-size-b",
      title: "Herman Miller Aeron · Size B · Fully Adjustable",
      price: 999,
      originalPrice: 1299,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      showQuickAdd: false,
      showWishlist: false,
      categorySlug: "home",
      brand: "Herman Miller",
      condition: "Refurbished",
      location: "Burgas",
      rating: 4.9,
      reviews: 12,
    },
  },
  {
    id: "featured-hero",
    title: "Featured Hero",
    description: "Featured layout with seller header and smart pills.",
    card: {
      id: "demo-7",
      slug: "macbook-pro-14-m3-pro-18gb",
      title: "MacBook Pro 14 (M3 Pro) · 18GB · 512GB",
      price: 3899,
      originalPrice: 4299,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=1200&q=80",
      variant: "featured",
      sellerName: "iStore Bulgaria",
      sellerVerified: true,
      sellerAvatarUrl: "https://github.com/vercel.png",
      showPills: true,
      categorySlug: "electronics",
      brand: "Apple",
      condition: "New",
      year: "2024",
      location: "Plovdiv",
      tags: ["In stock", "Invoice", "Warranty"],
      rating: 5,
      reviews: 42,
    },
  },
  {
    id: "b2b-dense",
    title: "B2B / Spec Dense",
    description: "Data-first card: specs + clear unit price.",
    card: {
      id: "demo-8",
      slug: "steel-bolts-m8x40-box-1000",
      title: "Steel Bolts M8x40mm (Box of 1000) · Grade 8.8",
      price: 145.5,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
      variant: "featured",
      sellerName: "MetalPro Ltd",
      sellerVerified: true,
      showPills: true,
      categorySlug: "hardware",
      brand: "MetalPro",
      condition: "New",
      location: "Ruse",
      tags: ["MOQ 5", "Invoice", "Next-day"],
      showQuickAdd: false,
      rating: 4.9,
      reviews: 12,
    },
  },
  {
    id: "c2c-minimal",
    title: "C2C Minimal",
    description: "C2C-friendly: minimal, no cart.",
    card: {
      id: "demo-9",
      slug: "zara-summer-dress-m",
      title: "Zara Summer Dress · Size M",
      price: 25,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80",
      showQuickAdd: false,
      categorySlug: "fashion",
      condition: "Good",
      location: "Sofia",
    },
  },
  {
    id: "premium-curated",
    title: "Premium Curated",
    description: "Premium feel: seller trust + no hover CTAs.",
    card: {
      id: "demo-10",
      slug: "rolex-submariner-date-41",
      title: "Rolex Submariner Date · 41mm · Full Set",
      price: 24500,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80",
      variant: "featured",
      sellerName: "ChronoExclusive",
      sellerVerified: true,
      showPills: true,
      categorySlug: "luxury",
      brand: "Rolex",
      condition: "Like new",
      year: "2023",
      location: "Sofia",
      tags: ["Authenticated", "Insured ship", "Invoice"],
      showQuickAdd: false,
      rating: 5,
      reviews: 5,
    },
  },
]

export function BestProductCardsShowcase({
  heading = "Top 10 Marketplace Product Cards",
  subheading = "Clean, production-ready configurations. Two variants: default (Target-style) and featured (with seller header).",
}: {
  heading?: string
  subheading?: string
}) {
  return (
    <PageContainer size="wide" className="py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">{subheading}</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <section key={recipe.id} className="space-y-2">
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold text-foreground">{recipe.title}</h2>
              <p className="text-xs text-muted-foreground">{recipe.description}</p>
            </div>
            <div className={cn("min-w-0")}> 
              <ProductCard {...recipe.card} />
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  )
}
