// =============================================================================
// DEMO PRODUCTS DATA
// =============================================================================
// Mock data for different category types to demonstrate adaptive UI.
// Each category type has different "hero specs" that are prominently displayed.
// =============================================================================

export type ProductCategory = "electronics" | "automotive" | "fashion" | "real-estate"

export interface HeroSpec {
  label: string
  value: string
}

export interface ProductSeller {
  id: string
  name: string
  avatar: string
  verified: boolean
  rating: number
  reviews: number
  responseTime: string
  memberSince: string
  location: string
  ordersCompleted: number
}

export interface DemoProduct {
  id: string
  category: ProductCategory
  /** Breadcrumb path: [L0, L1, L2, ...] */
  categoryPath: string[]
  title: string
  subtitle?: string
  price: number
  originalPrice?: number
  currency: string
  condition: "new" | "like-new" | "excellent" | "good" | "fair"
  /** The 4 key specs shown prominently - varies by category */
  heroSpecs: HeroSpec[]
  /** All specifications */
  specifications: { label: string; value: string }[]
  description: string
  images: string[]
  seller: ProductSeller
  stats: {
    views: number
    saves: number
    sold?: number
  }
  shipping: {
    free: boolean
    estimatedDays: string
    provider?: string
  }
  location: string
  postedAt: string
  /** Category-specific badges/tags */
  tags?: string[]
}

// =============================================================================
// SELLER (shared across demos)
// =============================================================================

const DEMO_SELLER: ProductSeller = {
  id: "seller-001",
  name: "TechZone Pro",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  verified: true,
  rating: 4.9,
  reviews: 1247,
  responseTime: "< 1 hour",
  memberSince: "2021",
  location: "Sofia, Bulgaria",
  ordersCompleted: 3420,
}

// =============================================================================
// ELECTRONICS - Headphones
// =============================================================================

const ELECTRONICS_PRODUCT: DemoProduct = {
  id: "elec-001",
  category: "electronics",
  categoryPath: ["Electronics", "Audio", "Headphones"],
  title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  subtitle: "Industry-leading noise cancellation",
  price: 349.99,
  originalPrice: 399.99,
  currency: "BGN",
  condition: "new",
  heroSpecs: [
    { label: "Brand", value: "Sony" },
    { label: "Model", value: "WH-1000XM5" },
    { label: "Condition", value: "New" },
    { label: "Warranty", value: "2 years" },
  ],
  specifications: [
    { label: "Brand", value: "Sony" },
    { label: "Model", value: "WH-1000XM5" },
    { label: "Driver Unit", value: "30mm" },
    { label: "Frequency Response", value: "4Hz-40kHz" },
    { label: "Battery Life", value: "30 hours" },
    { label: "Charging Time", value: "3.5 hours" },
    { label: "Weight", value: "250g" },
    { label: "Bluetooth", value: "5.2" },
    { label: "Codecs", value: "SBC, AAC, LDAC" },
    { label: "Noise Cancellation", value: "Active (ANC)" },
  ],
  description: `Experience exceptional sound quality with the Sony WH-1000XM5 wireless headphones. Featuring industry-leading noise cancellation technology, these headphones deliver an immersive audio experience.

The newly designed 30mm driver unit delivers a wider frequency range. With up to 30 hours of battery life and quick charging, enjoy your music all day.

What's included:
• Sony WH-1000XM5 headphones
• Carrying case
• USB-C charging cable
• 3.5mm audio cable
• Airplane adapter`,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
  ],
  seller: DEMO_SELLER,
  stats: { views: 2341, saves: 156, sold: 847 },
  shipping: { free: true, estimatedDays: "2-3", provider: "Speedy" },
  location: "Sofia, Bulgaria",
  postedAt: "2 hours ago",
  tags: ["Free Shipping", "Top Rated"],
}

// =============================================================================
// AUTOMOTIVE - Car
// =============================================================================

const AUTOMOTIVE_PRODUCT: DemoProduct = {
  id: "auto-001",
  category: "automotive",
  categoryPath: ["Automotive", "Cars", "SUV"],
  title: "2022 BMW X5 xDrive40i M Sport Package",
  subtitle: "One owner, full service history",
  price: 89500,
  originalPrice: 95000,
  currency: "BGN",
  condition: "excellent",
  heroSpecs: [
    { label: "Make", value: "BMW" },
    { label: "Model", value: "X5 xDrive40i" },
    { label: "Year", value: "2022" },
    { label: "Mileage", value: "28,500 km" },
  ],
  specifications: [
    { label: "Make", value: "BMW" },
    { label: "Model", value: "X5 xDrive40i" },
    { label: "Year", value: "2022" },
    { label: "Mileage", value: "28,500 km" },
    { label: "Engine", value: "3.0L Turbo I6" },
    { label: "Power", value: "340 hp" },
    { label: "Transmission", value: "8-Speed Automatic" },
    { label: "Drivetrain", value: "xDrive AWD" },
    { label: "Fuel Type", value: "Petrol" },
    { label: "Color", value: "Alpine White" },
    { label: "Interior", value: "Cognac Leather" },
    { label: "VIN", value: "WBAJB***5N5L12345" },
  ],
  description: `Stunning 2022 BMW X5 xDrive40i with the desirable M Sport package. One careful owner from new, full BMW service history, all services done at authorized dealer.

Features:
• M Sport Package (exterior & interior)
• Panoramic sunroof
• Harman Kardon surround sound
• Head-up display
• Adaptive LED headlights
• Parking assistant plus
• Driving assistant professional

Just serviced, new brakes all around. No accidents, clean Carfax. Serious buyers only.`,
  images: [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
  ],
  seller: {
    ...DEMO_SELLER,
    name: "AutoPremium BG",
  },
  stats: { views: 1892, saves: 89 },
  shipping: { free: false, estimatedDays: "Pickup only" },
  location: "Sofia, Bulgaria",
  postedAt: "1 day ago",
  tags: ["Verified Seller", "Financing Available"],
}

// =============================================================================
// FASHION - Designer Bag
// =============================================================================

const FASHION_PRODUCT: DemoProduct = {
  id: "fash-001",
  category: "fashion",
  categoryPath: ["Fashion", "Women", "Bags & Accessories"],
  title: "Louis Vuitton Neverfull MM Monogram Canvas",
  subtitle: "Authentic with receipt",
  price: 1850,
  originalPrice: 2100,
  currency: "BGN",
  condition: "like-new",
  heroSpecs: [
    { label: "Brand", value: "Louis Vuitton" },
    { label: "Size", value: "MM (Medium)" },
    { label: "Condition", value: "Like New" },
    { label: "Material", value: "Canvas" },
  ],
  specifications: [
    { label: "Brand", value: "Louis Vuitton" },
    { label: "Model", value: "Neverfull MM" },
    { label: "Size", value: "MM (31 x 28 x 14 cm)" },
    { label: "Material", value: "Monogram Canvas" },
    { label: "Lining", value: "Cherry Textile" },
    { label: "Hardware", value: "Gold-tone" },
    { label: "Date Code", value: "SD4***" },
    { label: "Year", value: "2023" },
    { label: "Included", value: "Pouch, Dust bag, Receipt" },
  ],
  description: `Authentic Louis Vuitton Neverfull MM in the classic Monogram Canvas with cherry red interior lining.

Purchased in June 2023 from Louis Vuitton Sofia. Used only a handful of times - practically new condition. No patina on the vachetta leather handles yet.

Comes with:
• Original receipt
• Removable pouch
• Dust bag

I authenticate all my items. Happy to meet at LV store for verification. Price is firm - this is below retail and in pristine condition.`,
  images: [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80",
  ],
  seller: {
    ...DEMO_SELLER,
    name: "LuxuryFinds",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  stats: { views: 3421, saves: 287 },
  shipping: { free: true, estimatedDays: "1-2", provider: "Econt" },
  location: "Sofia, Bulgaria",
  postedAt: "3 hours ago",
  tags: ["Authenticated", "With Receipt"],
}

// =============================================================================
// REAL ESTATE - Apartment
// =============================================================================

const REAL_ESTATE_PRODUCT: DemoProduct = {
  id: "realestate-001",
  category: "real-estate",
  categoryPath: ["Real Estate", "For Sale", "Apartments"],
  title: "Luxury 3-Bedroom Apartment in Lozenets with City Views",
  subtitle: "New construction, ready to move in",
  price: 385000,
  currency: "EUR",
  condition: "new",
  heroSpecs: [
    { label: "Bedrooms", value: "3" },
    { label: "Area", value: "142 m²" },
    { label: "Floor", value: "8 of 12" },
    { label: "Year", value: "2024" },
  ],
  specifications: [
    { label: "Type", value: "Apartment" },
    { label: "Bedrooms", value: "3" },
    { label: "Bathrooms", value: "2" },
    { label: "Total Area", value: "142 m²" },
    { label: "Living Area", value: "128 m²" },
    { label: "Balcony", value: "14 m²" },
    { label: "Floor", value: "8 of 12" },
    { label: "Year Built", value: "2024" },
    { label: "Heating", value: "Central + A/C" },
    { label: "Parking", value: "Underground (1 spot)" },
    { label: "Storage", value: "Yes (8 m²)" },
    { label: "Elevator", value: "2 high-speed" },
  ],
  description: `Stunning 3-bedroom apartment in a brand new luxury building in the heart of Lozenets. South-facing with panoramic city views.

Features:
• Open-plan living/dining area (45 m²)
• Modern kitchen with Bosch appliances
• Master bedroom with en-suite bathroom
• Two additional bedrooms
• Guest bathroom
• Large balcony with city views
• Underground parking spot included
• Storage room in basement

Building amenities:
• 24/7 security and concierge
• Gym and spa on rooftop
• Children's playground
• Beautifully landscaped gardens

Act 16 issued. Ready for immediate occupancy. Perfect for families or as an investment property.`,
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
  ],
  seller: {
    ...DEMO_SELLER,
    name: "Prime Properties BG",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
  },
  stats: { views: 4521, saves: 312 },
  shipping: { free: false, estimatedDays: "N/A" },
  location: "Lozenets, Sofia",
  postedAt: "5 days ago",
  tags: ["New Construction", "Act 16"],
}

// =============================================================================
// EXPORT
// =============================================================================

export const DEMO_PRODUCTS: Record<ProductCategory, DemoProduct> = {
  electronics: ELECTRONICS_PRODUCT,
  automotive: AUTOMOTIVE_PRODUCT,
  fashion: FASHION_PRODUCT,
  "real-estate": REAL_ESTATE_PRODUCT,
}
