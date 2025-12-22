"use client"

import { ProductCard as MarketplaceCard } from "@/components/shared/product/product-card"

// Minimal test data matching MarketplaceCard props
const testProducts = [
  // Default - Car
  {
    id: "1",
    title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service History",
    price: 18500,
    image: "/cozy-cabin-interior.jpg",
    condition: "Used · 142,000 km · 2019",
    sellerName: "AutoPremium Sofia",
    sellerVerified: true,
    sellerRating: 4.9,
    location: "Sofia",
  },
  // Promoted - Electronics
  {
    id: "2",
    title: "MacBook Pro 14\" M3 Pro · 18GB RAM · 512GB SSD",
    price: 3899,
    image: "/modern-computer-setup.png",
    condition: "New",
    sellerName: "iStore Bulgaria",
    sellerVerified: true,
    sellerRating: 5.0,
    location: "Plovdiv",
    freeShipping: true,
    isBoosted: true,
  },
  // Sale - Fashion
  {
    id: "3",
    title: "Nike Air Max 97 · Size 42 · Excellent Condition",
    price: 159,
    originalPrice: 219,
    image: "/diverse-fashion-collection.jpg",
    condition: "Like new",
    sellerName: "StreetCloset",
    sellerVerified: false,
    sellerRating: 4.7,
    location: "Varna",
  },
  // Deep discount - Furniture
  {
    id: "4",
    title: "Herman Miller Aeron Chair · Size B · Fully Loaded",
    price: 1200,
    originalPrice: 2400,
    image: "/cozy-cabin-interior.jpg",
    condition: "Refurbished",
    sellerName: "Office Comfort",
    sellerVerified: true,
    sellerRating: 4.9,
    location: "Sofia",
    freeShipping: true,
  },
  // Basic seller - Phones
  {
    id: "5",
    title: "iPhone 15 Pro Max 256GB · Natural Titanium",
    price: 2099,
    image: "/electronics-components.png",
    condition: "New",
    sellerName: "TechDeals",
    sellerVerified: false,
    sellerRating: 4.5,
    location: "Burgas",
  },
  // Promoted + Sale
  {
    id: "6",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 499,
    originalPrice: 699,
    image: "/diverse-people-listening-headphones.jpg",
    condition: "New",
    sellerName: "AudioWorld",
    sellerVerified: true,
    sellerRating: 4.8,
    location: "Sofia",
    freeShipping: true,
    isBoosted: true,
  },
]

export default function MarketplaceCardDemo() {
  return (
    <div className="container py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">MarketplaceCard</h1>
        <p className="text-muted-foreground">
          eBay/Vinted style · No buy button · Click goes to PDP
        </p>
        <p className="text-xs text-muted-foreground">
          ~200 lines · States: <code className="bg-muted px-1.5 py-0.5 rounded">default</code> · <code className="bg-muted px-1.5 py-0.5 rounded">promoted</code> · <code className="bg-muted px-1.5 py-0.5 rounded">sale</code>
        </p>
      </div>

      {/* 6-col Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6-Column Grid</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {testProducts.map((product, idx) => (
            <MarketplaceCard key={product.id} index={idx} {...product} />
          ))}
        </div>
      </section>

      {/* State Comparison */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">State Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          {/* Default */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Default</p>
            <MarketplaceCard
              id="demo-default"
              title="Standard Product Listing Without Special Treatment"
              price={299}
              image="/cozy-cabin-interior.jpg"
              condition="Good condition"
              sellerName="RegularSeller"
              sellerVerified={false}
              sellerRating={4.2}
              location="Stara Zagora"
            />
          </div>

          {/* Promoted */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Promoted (isBoosted)</p>
            <MarketplaceCard
              id="demo-promoted"
              title="Promoted Product With Extra Visibility"
              price={299}
              image="/cozy-cabin-interior.jpg"
              condition="New"
              sellerName="ProSeller"
              sellerVerified={true}
              sellerRating={4.9}
              location="Sofia"
              freeShipping
              isBoosted
            />
          </div>

          {/* Sale */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sale (originalPrice)</p>
            <MarketplaceCard
              id="demo-sale"
              title="Discounted Product With Original Price"
              price={149}
              originalPrice={299}
              image="/cozy-cabin-interior.jpg"
              condition="Like new"
              sellerName="DealHunter"
              sellerVerified={true}
              sellerRating={4.6}
              location="Plovdiv"
            />
          </div>
        </div>
      </section>

      {/* Feature Variations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Feature Variations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {/* Minimal */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Minimal (required only)</p>
            <MarketplaceCard
              id="minimal"
              title="Just Title and Price"
              price={50}
              image="/cozy-cabin-interior.jpg"
            />
          </div>

          {/* Free shipping */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Free shipping</p>
            <MarketplaceCard
              id="shipping"
              title="Product With Free Shipping"
              price={199}
              image="/cozy-cabin-interior.jpg"
              freeShipping
              sellerName="FastShip"
              location="Sofia"
            />
          </div>

          {/* Verified seller */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Verified seller</p>
            <MarketplaceCard
              id="verified"
              title="From Verified Seller"
              price={450}
              image="/cozy-cabin-interior.jpg"
              sellerName="TrustedShop"
              sellerVerified
              sellerRating={5.0}
            />
          </div>

          {/* Long title */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Long title (2-line clamp)</p>
            <MarketplaceCard
              id="long"
              title="This Is A Very Long Product Title That Should Wrap To Two Lines And Then Get Truncated With Ellipsis"
              price={99}
              image="/cozy-cabin-interior.jpg"
              condition="New in box"
              sellerName="Seller"
              location="Varna"
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-muted/30 rounded-xl p-6 border border-dashed max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">What&apos;s Different</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>No buy button</strong> - click card → go to product page (like eBay)</li>
          <li><strong>No category badge</strong> - context is clear from page/filters</li>
          <li><strong>No smart pills</strong> - condition shown as simple text</li>
          <li><strong>Price first</strong> - most important info at top</li>
          <li><strong>Seller row minimal</strong> - name + verified + rating + location in one line</li>
          <li><strong>~200 lines</strong> total (vs 880 original)</li>
        </ul>
      </section>
    </div>
  )
}
