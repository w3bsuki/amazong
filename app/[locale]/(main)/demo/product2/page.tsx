import { DemoProductPageV2 } from "./_components/demo-product-page-v2";

// Mock product data for demo (same as product 1 but we can enhance if needed)
const mockProduct = {
  id: "demo-product-002",
  title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Midnight Blue",
  price: 599,
  list_price: 749,
  condition: "New",
  description: `The best noise cancelling headphones just got better.

Features:
• Industry-leading noise cancellation optimized for you
• Magnificent Sound, engineered to perfection
• Crystal clear hands-free calling
• Up to 30-hour battery life with quick charging
• Ultra-comfortable, lightweight design with soft fit leather
• Multipoint connection allows you to switch between devices
• Redesigned case for easy travel

Includes: Headphones, Carrying Case, Connection Cable, USB Cable.`,
  stock: 15,
  pickup_only: false,
  rating: 4.9,
  review_count: 342,
  viewers_count: 45,
  sold_count: 120,
  slug: "sony-wh-1000xm5-midnight-blue",
  seller_stats: {
    average_rating: 4.95,
    positive_feedback_pct: 99,
    total_sales: 5432,
    followers_count: 2100,
  },
};

const mockSeller = {
  id: "seller-002",
  username: "audio_experts",
  display_name: "Audio Experts Ltd",
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AE&backgroundColor=4f46e5",
  verified: true,
  created_at: "2022-03-10T00:00:00Z",
};

const mockImages = [
  {
    src: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    alt: "Sony WH-1000XM5 Front",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
    alt: "Sony WH-1000XM5 Side",
    width: 800,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    alt: "Sony WH-1000XM5 Lifestyle",
    width: 800,
    height: 800,
  },
];

const mockVariants = [
  { id: "var-1", name: "Midnight Blue", price_adjustment: 0, stock: 15, is_default: true },
  { id: "var-2", name: "Black", price_adjustment: 0, stock: 8, is_default: false },
  { id: "var-3", name: "Silver", price_adjustment: 0, stock: 0, is_default: false },
];

const mockSpecs = [
  { label: "Brand", value: "Sony" },
  { label: "Model", value: "WH-1000XM5" },
  { label: "Color", value: "Midnight Blue" },
  { label: "Type", value: "Over-ear" },
  { label: "Connectivity", value: "Bluetooth 5.2" },
  { label: "Battery Life", value: "30 Hours" },
  { label: "Noise Cancelling", value: "Yes, Active" },
  { label: "Weight", value: "250g" },
];

const mockReviews = [
  {
    id: "rev-1",
    user_name: "Alex M.",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 5,
    comment: "Best headphones I've ever owned. The noise cancellation is unreal.",
    created_at: "2025-12-15T10:00:00Z",
    helpful_count: 24,
  },
  {
    id: "rev-2",
    user_name: "Sarah J.",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 4,
    comment: "Great sound, but the earcups get a bit warm after a few hours.",
    created_at: "2025-11-20T14:30:00Z",
    helpful_count: 15,
  },
];

const mockRelatedProducts = [
  {
    id: "rel-1",
    title: "Sony WF-1000XM5 Earbuds",
    price: 299,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
    slug: "sony-wf-1000xm5",
    username: "audio_experts",
  },
  {
    id: "rel-2",
    title: "Bose QuietComfort Ultra",
    price: 429,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop",
    slug: "bose-qc-ultra",
    username: "audio_experts",
  },
];

export default function DemoProductPage2() {
  return (
    <DemoProductPageV2
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
