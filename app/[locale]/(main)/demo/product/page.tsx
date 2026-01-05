import { DemoMobileProductPage } from "./_components/demo-mobile-product-page";

// Mock product data for demo
const mockProduct = {
  id: "demo-product-001",
  title: "Apple iPhone 15 Pro Max 256GB Natural Titanium - Excellent Condition",
  price: 1899,
  list_price: 2199,
  condition: "Like New",
  description: `This iPhone 15 Pro Max is in excellent condition with minimal signs of use. 
  
Features:
• A17 Pro chip with 6-core GPU
• 6.7" Super Retina XDR display with ProMotion
• Pro camera system (48MP Main, 12MP Ultra Wide, 12MP Telephoto)
• Action button for quick access
• USB-C with USB 3 speeds
• Titanium design

Includes original box, USB-C cable, and SIM ejector tool. Battery health at 96%.`,
  stock: 3,
  pickup_only: false,
  rating: 4.8,
  review_count: 127,
  viewers_count: 12,
  sold_count: 45,
  slug: "iphone-15-pro-max-256gb",
  seller_stats: {
    average_rating: 4.9,
    positive_feedback_pct: 98,
    total_sales: 1247,
    followers_count: 892,
  },
};

const mockSeller = {
  id: "seller-001",
  username: "techdeals_bg",
  display_name: "TechDeals Bulgaria",
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=TD&backgroundColor=0ea5e9",
  verified: true,
  created_at: "2023-06-15T00:00:00Z",
};

const mockImages = [
  {
    src: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    alt: "iPhone 15 Pro Max front view",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&h=800&fit=crop",
    alt: "iPhone 15 Pro Max back view",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1699694927600-82fca440e8ea?w=800&h=800&fit=crop",
    alt: "iPhone 15 Pro Max camera detail",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1697916507792-0d36ebcce223?w=800&h=800&fit=crop",
    alt: "iPhone 15 Pro Max side view",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1710023038502-c9f4c936c778?w=800&h=800&fit=crop",
    alt: "iPhone 15 Pro Max in hand",
    width: 800,
    height: 800,
  },
];

const mockVariants = [
  { id: "var-1", name: "256GB", price_adjustment: 0, stock: 3, is_default: true },
  { id: "var-2", name: "512GB", price_adjustment: 200, stock: 2, is_default: false },
  { id: "var-3", name: "1TB", price_adjustment: 400, stock: 0, is_default: false },
];

const mockSpecs = [
  { label: "Storage", value: "256GB" },
  { label: "Color", value: "Natural Titanium" },
  { label: "Screen", value: '6.7"' },
  { label: "Battery", value: "96% Health" },
  { label: "Chip", value: "A17 Pro" },
  { label: "Camera", value: "48MP" },
  { label: "Warranty", value: "90 days" },
  { label: "Accessories", value: "Box, Cable" },
];

const mockReviews = [
  {
    id: "rev-1",
    user_name: "Maria K.",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
    comment: "Перфектно състояние! Доставката беше бърза и продавачът е много отзивчив.",
    created_at: "2026-01-02T10:00:00Z",
    helpful_count: 12,
  },
  {
    id: "rev-2",
    user_name: "Georgi P.",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Georgi",
    rating: 5,
    comment: "Excellent phone, exactly as described. Great seller!",
    created_at: "2025-12-28T14:30:00Z",
    helpful_count: 8,
  },
  {
    id: "rev-3",
    user_name: "Elena S.",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    rating: 4,
    comment: "Много добро качество, само малки драскотини на рамката, които не се виждат.",
    created_at: "2025-12-20T09:15:00Z",
    helpful_count: 5,
  },
];

const mockRelatedProducts = [
  {
    id: "rel-1",
    title: "iPhone 15 Pro Case",
    price: 29,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=200&fit=crop",
    slug: "iphone-15-pro-case",
    username: "techdeals_bg",
  },
  {
    id: "rel-2",
    title: "MagSafe Charger",
    price: 45,
    image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=200&h=200&fit=crop",
    slug: "magsafe-charger",
    username: "techdeals_bg",
  },
  {
    id: "rel-3",
    title: "AirPods Pro 2",
    price: 249,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop",
    slug: "airpods-pro-2",
    username: "techdeals_bg",
  },
];

export default function DemoProductPage() {
  return (
    <DemoMobileProductPage
      product={mockProduct}
      seller={mockSeller}
      images={mockImages}
      variants={mockVariants}
      specs={mockSpecs}
      reviews={mockReviews}
      relatedProducts={mockRelatedProducts}
    />
  );
}
