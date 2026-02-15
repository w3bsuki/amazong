import { setRequestLocale } from "next-intl/server"

import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"

import { DemoV4Home } from "./demo-v4-home"

const DEMO_CATEGORIES: CategoryTreeNode[] = [
  {
    id: "cat-fashion",
    name: "Fashion",
    name_bg: "Мода",
    slug: "fashion",
    children: [
      { id: "cat-fashion-women", name: "Women", name_bg: "Дамски", slug: "fashion-womens" },
      { id: "cat-fashion-men", name: "Men", name_bg: "Мъжки", slug: "fashion-mens" },
      { id: "cat-fashion-shoes", name: "Shoes", name_bg: "Обувки", slug: "shoes" },
      { id: "cat-fashion-bags", name: "Bags", name_bg: "Чанти", slug: "bags" },
    ],
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    name_bg: "Техника",
    slug: "electronics",
    children: [
      { id: "cat-el-phones", name: "Phones", name_bg: "Телефони", slug: "phones" },
      { id: "cat-el-laptops", name: "Laptops", name_bg: "Лаптопи", slug: "laptops" },
      { id: "cat-el-audio", name: "Audio", name_bg: "Аудио", slug: "audio" },
      { id: "cat-el-gaming", name: "Gaming", name_bg: "Гейминг", slug: "gaming" },
    ],
  },
  {
    id: "cat-home",
    name: "Home",
    name_bg: "Дом",
    slug: "home",
    children: [
      { id: "cat-home-furniture", name: "Furniture", name_bg: "Мебели", slug: "furniture" },
      { id: "cat-home-lighting", name: "Lighting", name_bg: "Осветление", slug: "lighting" },
      { id: "cat-home-kitchen", name: "Kitchen", name_bg: "Кухня", slug: "home-kitchen" },
      { id: "cat-home-decor", name: "Decor", name_bg: "Декорация", slug: "decor" },
    ],
  },
  {
    id: "cat-automotive",
    name: "Automotive",
    name_bg: "Авто",
    slug: "automotive",
    children: [
      { id: "cat-auto-parts", name: "Parts", name_bg: "Части", slug: "auto-parts" },
      { id: "cat-auto-tires", name: "Tires", name_bg: "Гуми", slug: "tires" },
      { id: "cat-auto-interior", name: "Interior", name_bg: "Интериор", slug: "auto-interior" },
      { id: "cat-auto-tools", name: "Tools", name_bg: "Инструменти", slug: "auto-tools" },
    ],
  },
  {
    id: "cat-beauty",
    name: "Beauty",
    name_bg: "Красота",
    slug: "beauty",
    children: [
      { id: "cat-beauty-skincare", name: "Skincare", name_bg: "Грижа за кожа", slug: "skincare" },
      { id: "cat-beauty-makeup", name: "Makeup", name_bg: "Грим", slug: "makeup" },
      { id: "cat-beauty-fragrance", name: "Fragrance", name_bg: "Парфюми", slug: "fragrance" },
      { id: "cat-beauty-wellness", name: "Wellness", name_bg: "Уелнес", slug: "health-wellness" },
    ],
  },
  {
    id: "cat-gaming",
    name: "Gaming",
    name_bg: "Гейминг",
    slug: "gaming",
    children: [
      { id: "cat-gaming-consoles", name: "Consoles", name_bg: "Конзоли", slug: "gaming-consoles" },
      { id: "cat-gaming-accessories", name: "Accessories", name_bg: "Аксесоари", slug: "gaming-accessories" },
      { id: "cat-gaming-games", name: "Games", name_bg: "Игри", slug: "games" },
      { id: "cat-gaming-streaming", name: "Streaming", name_bg: "Стрийминг", slug: "streaming" },
    ],
  },
]

const BASE_PRODUCTS: UIProduct[] = [
  {
    id: "p-01",
    title: "Nike Air Max 97",
    price: 149,
    listPrice: 189,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 240,
    categorySlug: "shoes",
    categoryRootSlug: "fashion",
    categoryPath: [
      { slug: "fashion", name: "Fashion", nameBg: "Мода" },
      { slug: "shoes", name: "Shoes", nameBg: "Обувки" },
    ],
    slug: "nike-air-max-97",
    storeSlug: "urban-vault",
    sellerName: "urban-vault",
    sellerTier: "premium",
    sellerVerified: true,
    freeShipping: true,
    location: "Sofia",
  },
  {
    id: "p-02",
    title: "Leather Shoulder Bag",
    price: 89,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 98,
    categorySlug: "bags",
    categoryRootSlug: "fashion",
    categoryPath: [
      { slug: "fashion", name: "Fashion", nameBg: "Мода" },
      { slug: "bags", name: "Bags", nameBg: "Чанти" },
    ],
    slug: "leather-shoulder-bag",
    storeSlug: "atelier-mode",
    sellerName: "atelier-mode",
    sellerTier: "basic",
  },
  {
    id: "p-03",
    title: "Women’s Oversized Blazer",
    price: 74,
    listPrice: 94,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 122,
    categorySlug: "fashion-womens",
    categoryRootSlug: "fashion",
    categoryPath: [
      { slug: "fashion", name: "Fashion", nameBg: "Мода" },
      { slug: "fashion-womens", name: "Women", nameBg: "Дамски" },
    ],
    slug: "womens-oversized-blazer",
    storeSlug: "atelier-mode",
    sellerName: "atelier-mode",
    sellerTier: "premium",
    sellerVerified: true,
  },
  {
    id: "p-04",
    title: "iPhone 14 Pro 256GB",
    price: 899,
    listPrice: 999,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 411,
    categorySlug: "phones",
    categoryRootSlug: "electronics",
    categoryPath: [
      { slug: "electronics", name: "Electronics", nameBg: "Техника" },
      { slug: "phones", name: "Phones", nameBg: "Телефони" },
    ],
    slug: "iphone-14-pro-256gb",
    storeSlug: "tech-hub",
    sellerName: "tech-hub",
    sellerTier: "business",
    sellerVerified: true,
    location: "Plovdiv",
  },
  {
    id: "p-05",
    title: "MacBook Air M3",
    price: 1269,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 268,
    categorySlug: "laptops",
    categoryRootSlug: "electronics",
    categoryPath: [
      { slug: "electronics", name: "Electronics", nameBg: "Техника" },
      { slug: "laptops", name: "Laptops", nameBg: "Лаптопи" },
    ],
    slug: "macbook-air-m3",
    storeSlug: "tech-hub",
    sellerName: "tech-hub",
    sellerTier: "business",
    sellerVerified: true,
    freeShipping: true,
  },
  {
    id: "p-06",
    title: "Sony WH-1000XM5",
    price: 279,
    listPrice: 349,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 352,
    categorySlug: "audio",
    categoryRootSlug: "electronics",
    categoryPath: [
      { slug: "electronics", name: "Electronics", nameBg: "Техника" },
      { slug: "audio", name: "Audio", nameBg: "Аудио" },
    ],
    slug: "sony-wh-1000xm5",
    storeSlug: "audio-lab",
    sellerName: "audio-lab",
    sellerTier: "premium",
  },
  {
    id: "p-07",
    title: "Solid Oak Dining Table",
    price: 499,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 64,
    categorySlug: "furniture",
    categoryRootSlug: "home",
    categoryPath: [
      { slug: "home", name: "Home", nameBg: "Дом" },
      { slug: "furniture", name: "Furniture", nameBg: "Мебели" },
    ],
    slug: "solid-oak-dining-table",
    storeSlug: "home-space",
    sellerName: "home-space",
    sellerTier: "premium",
    location: "Varna",
  },
  {
    id: "p-08",
    title: "Nordic Floor Lamp",
    price: 119,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 74,
    categorySlug: "lighting",
    categoryRootSlug: "home",
    categoryPath: [
      { slug: "home", name: "Home", nameBg: "Дом" },
      { slug: "lighting", name: "Lighting", nameBg: "Осветление" },
    ],
    slug: "nordic-floor-lamp",
    storeSlug: "home-space",
    sellerName: "home-space",
    sellerTier: "basic",
  },
  {
    id: "p-09",
    title: "Non-stick Cookware Set",
    price: 159,
    listPrice: 199,
    image: "/placeholder.svg",
    rating: 4.4,
    reviews: 102,
    categorySlug: "home-kitchen",
    categoryRootSlug: "home",
    categoryPath: [
      { slug: "home", name: "Home", nameBg: "Дом" },
      { slug: "home-kitchen", name: "Kitchen", nameBg: "Кухня" },
    ],
    slug: "non-stick-cookware-set",
    storeSlug: "kitchen-pro",
    sellerName: "kitchen-pro",
    sellerTier: "basic",
  },
  {
    id: "p-10",
    title: "All-season Tire Set 17\"",
    price: 389,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 134,
    categorySlug: "tires",
    categoryRootSlug: "automotive",
    categoryPath: [
      { slug: "automotive", name: "Automotive", nameBg: "Авто" },
      { slug: "tires", name: "Tires", nameBg: "Гуми" },
    ],
    slug: "all-season-tire-set-17",
    storeSlug: "auto-garage",
    sellerName: "auto-garage",
    sellerTier: "business",
    sellerVerified: true,
    location: "Burgas",
  },
  {
    id: "p-11",
    title: "Car Interior Detail Kit",
    price: 49,
    listPrice: 69,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 86,
    categorySlug: "auto-interior",
    categoryRootSlug: "automotive",
    categoryPath: [
      { slug: "automotive", name: "Automotive", nameBg: "Авто" },
      { slug: "auto-interior", name: "Interior", nameBg: "Интериор" },
    ],
    slug: "car-interior-detail-kit",
    storeSlug: "auto-garage",
    sellerName: "auto-garage",
    sellerTier: "business",
  },
  {
    id: "p-12",
    title: "Ceramic Serum 30ml",
    price: 32,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 164,
    categorySlug: "skincare",
    categoryRootSlug: "beauty",
    categoryPath: [
      { slug: "beauty", name: "Beauty", nameBg: "Красота" },
      { slug: "skincare", name: "Skincare", nameBg: "Грижа за кожа" },
    ],
    slug: "ceramic-serum-30ml",
    storeSlug: "glow-market",
    sellerName: "glow-market",
    sellerTier: "premium",
    freeShipping: true,
  },
  {
    id: "p-13",
    title: "Matte Lip Kit",
    price: 27,
    listPrice: 39,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 97,
    categorySlug: "makeup",
    categoryRootSlug: "beauty",
    categoryPath: [
      { slug: "beauty", name: "Beauty", nameBg: "Красота" },
      { slug: "makeup", name: "Makeup", nameBg: "Грим" },
    ],
    slug: "matte-lip-kit",
    storeSlug: "glow-market",
    sellerName: "glow-market",
    sellerTier: "basic",
  },
  {
    id: "p-14",
    title: "PlayStation 5 Slim",
    price: 549,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 226,
    categorySlug: "gaming-consoles",
    categoryRootSlug: "gaming",
    categoryPath: [
      { slug: "gaming", name: "Gaming", nameBg: "Гейминг" },
      { slug: "gaming-consoles", name: "Consoles", nameBg: "Конзоли" },
    ],
    slug: "playstation-5-slim",
    storeSlug: "game-zone",
    sellerName: "game-zone",
    sellerTier: "business",
    sellerVerified: true,
  },
  {
    id: "p-15",
    title: "RGB Mechanical Keyboard",
    price: 109,
    listPrice: 139,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 188,
    categorySlug: "gaming-accessories",
    categoryRootSlug: "gaming",
    categoryPath: [
      { slug: "gaming", name: "Gaming", nameBg: "Гейминг" },
      { slug: "gaming-accessories", name: "Accessories", nameBg: "Аксесоари" },
    ],
    slug: "rgb-mechanical-keyboard",
    storeSlug: "game-zone",
    sellerName: "game-zone",
    sellerTier: "premium",
    location: "Sofia",
  },
  {
    id: "p-16",
    title: "DualSense Wireless Controller",
    price: 69,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 311,
    categorySlug: "gaming-accessories",
    categoryRootSlug: "gaming",
    categoryPath: [
      { slug: "gaming", name: "Gaming", nameBg: "Гейминг" },
      { slug: "gaming-accessories", name: "Accessories", nameBg: "Аксесоари" },
    ],
    slug: "dualsense-wireless-controller",
    storeSlug: "game-zone",
    sellerName: "game-zone",
    sellerTier: "premium",
  },
]

function groupByRootCategory(products: UIProduct[]): Record<string, UIProduct[]> {
  return products.reduce<Record<string, UIProduct[]>>((acc, product) => {
    const rootSlug = product.categoryRootSlug ?? product.categorySlug
    if (!rootSlug) return acc
    if (!acc[rootSlug]) acc[rootSlug] = []
    acc[rootSlug].push(product)
    return acc
  }, {})
}

const CATEGORY_PRODUCTS = groupByRootCategory(BASE_PRODUCTS)
const NEWEST_PRODUCTS = BASE_PRODUCTS
const PROMOTED_PRODUCTS = BASE_PRODUCTS.filter((product) => product.sellerVerified).slice(0, 10)
const DEALS_PRODUCTS = BASE_PRODUCTS.filter(
  (product) => typeof product.listPrice === "number" && product.listPrice > product.price
)
const NEARBY_PRODUCTS = BASE_PRODUCTS.filter(
  (product) => typeof product.location === "string" && product.location.trim().length > 0
)
const FOR_YOU_PRODUCTS = [
  ...(CATEGORY_PRODUCTS.fashion ?? []),
  ...(CATEGORY_PRODUCTS.electronics ?? []),
].slice(0, 12)

export default async function DemoV4Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <DemoV4Home
      locale={locale}
      categories={DEMO_CATEGORIES}
      newestProducts={NEWEST_PRODUCTS}
      promotedProducts={PROMOTED_PRODUCTS.length > 0 ? PROMOTED_PRODUCTS : NEWEST_PRODUCTS.slice(0, 8)}
      nearbyProducts={NEARBY_PRODUCTS.length > 0 ? NEARBY_PRODUCTS : NEWEST_PRODUCTS.slice(0, 8)}
      dealsProducts={DEALS_PRODUCTS.length > 0 ? DEALS_PRODUCTS : NEWEST_PRODUCTS.slice(0, 8)}
      forYouProducts={FOR_YOU_PRODUCTS.length > 0 ? FOR_YOU_PRODUCTS : NEWEST_PRODUCTS.slice(0, 8)}
      categoryProducts={CATEGORY_PRODUCTS}
    />
  )
}
