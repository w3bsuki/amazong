"use client"

import { UltimateMarketplaceCard } from "@/components/perfect-marketplace-card"

const sampleProducts = [
  {
    id: "perf-1",
    title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service History",
    price: 18500,
    originalPrice: 19900,
    image: "/cozy-cabin-interior.jpg",
    rating: 4.8,
    reviews: 124,
    seller: {
      name: "AutoPremium Sofia",
      verified: true,
      rating: 4.9,
      location: "Sofia, BG",
      avatar: "https://github.com/shadcn.png"
    },
    attributes: [
      { label: "Fuel", value: "Diesel" },
      { label: "Trans", value: "Automatic" },
      { label: "Year", value: "2016" },
      { label: "Km", value: "142,000 km" }
    ],
    badges: ["Warranty", "Leasing"],
    tags: ["Diesel", "Automatic", "2016"],
    isBoosted: true,
    condition: "Used",
    brand: "Volkswagen",
    categorySlug: "cars"
  },
  {
    id: "perf-2",
    title: "MacBook Pro 14 M3 Pro · 18GB RAM · 512GB SSD",
    price: 3899,
    originalPrice: 4299,
    image: "/modern-computer-setup.png",
    rating: 5.0,
    reviews: 42,
    seller: {
      name: "iStore Bulgaria",
      verified: true,
      rating: 5.0,
      location: "Plovdiv, BG",
      avatar: "https://github.com/vercel.png"
    },
    attributes: [
      { label: "Chip", value: "M3 Pro" },
      { label: "RAM", value: "18GB" },
      { label: "SSD", value: "512GB" }
    ],
    badges: ["In Stock"],
    tags: ["M3 Pro", "18GB", "512GB"],
    shipping: "Free Shipping",
    condition: "New",
    brand: "Apple",
    categorySlug: "electronics"
  },
  {
    id: "perf-3",
    title: "Vintage Leather Biker Jacket · Handcrafted",
    price: 249,
    image: "/diverse-fashion-collection.jpg",
    rating: 4.7,
    reviews: 89,
    seller: {
      name: "Urban Vintage",
      verified: false,
      rating: 4.7,
      location: "Varna, BG",
      avatar: "https://github.com/nextjs.png"
    },
    attributes: [
      { label: "Size", value: "L" },
      { label: "Material", value: "Leather" }
    ],
    tags: ["Leather", "Vintage", "Size L"],
    isBoosted: true,
    shipping: "+ 5.00 BGN",
    condition: "Used",
    brand: "Generic",
    categorySlug: "fashion"
  },
  {
    id: "perf-4",
    title: "Industrial Steel Bolts M8x40mm (Box of 1000)",
    price: 145.50,
    image: "/electronics-components.png",
    rating: 4.9,
    reviews: 12,
    seller: {
      name: "MetalPro Ltd",
      verified: true,
      rating: 4.9,
      location: "Ruse, BG",
      avatar: "https://github.com/shadcn.png"
    },
    attributes: [
      { label: "Material", value: "Steel 8.8" },
    ],
    tags: ["Steel", "M8", "Bulk"],
    shipping: "Free Shipping",
    condition: "New",
    brand: "Generic",
    categorySlug: "industrial"
  },
  {
    id: "perf-5",
    title: "Sony WH-1000XM5 · Noise Cancelling",
    price: 599,
    originalPrice: 699,
    image: "/diverse-people-listening-headphones.jpg",
    rating: 4.8,
    reviews: 230,
    seller: {
      name: "AudioWorld",
      verified: true,
      rating: 4.8,
      location: "Sofia, BG",
      avatar: "https://github.com/shadcn.png"
    },
    tags: ["ANC", "Wireless", "Black"],
    shipping: "Free Shipping",
    condition: "New",
    brand: "Sony",
    categorySlug: "electronics"
  },
  {
    id: "perf-6",
    title: "Herman Miller Aeron · Size B · Fully Loaded",
    price: 1200,
    originalPrice: 2400,
    image: "/office-chair.jpg",
    rating: 4.9,
    reviews: 56,
    seller: {
      name: "Office Comfort",
      verified: true,
      rating: 5.0,
      location: "Sofia, BG",
      avatar: "https://github.com/shadcn.png"
    },
    tags: ["Ergonomic", "Mesh", "Size B"],
    condition: "Refurbished",
    brand: "Herman Miller",
    categorySlug: "furniture"
  }
]

export default function PerfectCardsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">The Ultimate Marketplace Card</h1>
        <p className="text-muted-foreground text-lg">
          Combining the best of trust, density, and conversion. 
          Features a seller-first header, smart attribute pills, desktop hover actions, and mobile-optimized footer.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sampleProducts.map((product) => (
          <UltimateMarketplaceCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
      
      <div className="p-8 bg-muted/30 rounded-xl border border-dashed">
        <h2 className="text-xl font-semibold mb-4">Why this is the "Perfect" Card:</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Trust Header:</strong> Immediately establishes seller credibility (Avatar, Name, Verified, Rating).</li>
          <li><strong className="text-foreground">Smart Image Area:</strong> Clean badges (Sponsored, Discount) + Wishlist. Desktop hover "Add to Cart" saves vertical space.</li>
          <li><strong className="text-foreground">Information Density:</strong> Title + Smart Pills (Brand, Condition, Key Tag) + Location Meta.</li>
          <li><strong className="text-foreground">Mobile Optimized:</strong> Hover actions are replaced by a dedicated cart button in the footer on mobile.</li>
          <li><strong className="text-foreground">Conversion Focused:</strong> Clear price hierarchy, shipping info, and always-accessible call-to-action.</li>
        </ul>
      </div>
    </div>
  )
}
