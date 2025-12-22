
import { ProductCard } from "@/components/shared/product/product-card"

export default function MergedCardsPage() {
  const carProduct = {
    id: "car-1",
    title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service History",
    price: 18500,
    originalPrice: 19900,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    rating: 4.8,
    reviews: 124,
    sellerName: "AutoPremium Sofia",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Sofia, BG",
    condition: "Used",
    year: "2016",
    make: "Volkswagen",
    model: "Golf 7",
    categorySlug: "cars",
    tags: ["Warranty", "Leasing"],
    isBoosted: true
  }

  const techProduct = {
    id: "tech-1",
    title: "MacBook Pro 14 M3 Pro · 18GB RAM · 512GB SSD",
    price: 3899,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
    rating: 5.0,
    reviews: 42,
    sellerName: "iStore Bulgaria",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    location: "Plovdiv, BG",
    condition: "New",
    brand: "Apple",
    categorySlug: "electronics",
    tags: ["In Stock", "Free Shipping"],
    isBoosted: false
  }

  return (
    <div className="container py-12 space-y-10 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">The Merged Solution</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Using the production <code>ProductCard</code> with <code>variant="featured"</code>.
          Clean Target-style design with seller header for promoted listings.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ProductCard 
          {...carProduct} 
          variant="featured" 
          showPills={true}
        />
        <ProductCard 
          {...techProduct} 
          variant="featured" 
          showPills={true}
        />
        <ProductCard 
          {...techProduct} 
          title="Sony WH-1000XM5" 
          price={599} 
          image="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"
          variant="featured" 
          showPills={true}
        />
         <ProductCard 
          {...carProduct} 
          title="Audi A4 Avant"
          price={22500}
          image="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"
          variant="featured" 
          showPills={true}
        />
      </div>
    </div>
  )
}
