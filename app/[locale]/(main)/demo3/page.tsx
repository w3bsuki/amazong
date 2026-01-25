import { Metadata } from "next";
import { Star, Truck, ShieldCheck, Clock, Heart, Eye, Flame, CheckCircle2, Package, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "E-commerce Tokens Demo",
  robots: { index: false, follow: false },
};

/**
 * MINIMAL FIXES PHILOSOPHY:
 * 
 * 1. Keep distinct hues for conditions (users need to tell them apart!)
 * 2. Just add dark mode for status colors
 * 3. Slightly lower saturation (C: 0.18→0.15 where screaming)
 * 4. Info = Primary (same thing)
 * 5. That's it. Don't over-engineer.
 */

export default function EcommerceDemo() {
  return (
    <div className="min-h-screen bg-surface-page">
      {/* Header Preview */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-primary">treido</span>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-notification text-[10px] text-white">3</span>
            </button>
            <button className="relative">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cart-badge text-[10px] text-white">2</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* Category Pills */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Category Navigation</h2>
          <div className="flex flex-wrap gap-2">
            <CategoryPill active>All</CategoryPill>
            <CategoryPill>Electronics</CategoryPill>
            <CategoryPill>Fashion</CategoryPill>
            <CategoryPill>Home & Garden</CategoryPill>
            <CategoryPill>Sports</CategoryPill>
            <CategoryPill>Collectibles</CategoryPill>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Product Cards (All Badge Types)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Hot Deal */}
            <ProductCard
              image="📱"
              title="iPhone 15 Pro Max 256GB"
              price={899}
              originalPrice={1199}
              condition="likenew"
              badges={["deal", "hot"]}
              rating={4.8}
              reviews={124}
              freeShipping
              verified
            />
            
            {/* Card 2: New with promotion */}
            <ProductCard
              image="👟"
              title="Nike Air Max 90 - Size 10"
              price={120}
              condition="new"
              badges={["promoted"]}
              rating={5.0}
              reviews={8}
              verified
            />
            
            {/* Card 3: Good condition, low stock */}
            <ProductCard
              image="🎮"
              title="PS5 DualSense Controller"
              price={45}
              originalPrice={69}
              condition="good"
              badges={["lowstock"]}
              rating={4.5}
              reviews={67}
              freeShipping
            />
            
            {/* Card 4: Fair, watching */}
            <ProductCard
              image="📚"
              title="Vintage Book Collection (12pc)"
              price={35}
              condition="fair"
              badges={["watching"]}
              rating={4.2}
              reviews={12}
            />
            
          </div>
        </section>

        {/* Condition Badges - The Real Test */}
        <section className="mb-12">
          <h2 className="mb-2 text-lg font-semibold">Condition Badges</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Must be instantly distinguishable — color = quality signal
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Current */}
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Current (distinct hues ✓)</p>
              <div className="flex flex-wrap gap-2">
                <ConditionBadge condition="new" />
                <ConditionBadge condition="likenew" />
                <ConditionBadge condition="good" />
                <ConditionBadge condition="fair" />
                <ConditionBadge condition="used" />
                <ConditionBadge condition="refurb" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                ✅ Users can instantly identify quality level by color
              </p>
            </div>
            
            {/* Refined - same hues, bit calmer */}
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Refined (same hues, -10% chroma)</p>
              <div className="flex flex-wrap gap-2">
                <Badge bg="oklch(0.52 0.14 155)">New</Badge>
                <Badge bg="oklch(0.52 0.12 230)">Like New</Badge>
                <Badge bg="oklch(0.58 0.12 80)">Good</Badge>
                <Badge bg="oklch(0.56 0.12 50)">Fair</Badge>
                <Badge bg="oklch(0.55 0.02 260)">Used</Badge>
                <Badge bg="oklch(0.52 0.12 290)">Refurbished</Badge>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                ✅ Still distinct, less screaming
              </p>
            </div>
          </div>
        </section>

        {/* Status Colors - Light vs Dark */}
        <section className="mb-12">
          <h2 className="mb-2 text-lg font-semibold">Status Colors (Dark Mode Fix)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The real problem: current status colors don&apos;t adapt to dark backgrounds
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Light */}
            <div className="rounded-xl border bg-white p-6">
              <p className="mb-4 text-sm font-medium text-neutral-500">Light Mode</p>
              <div className="space-y-3">
                <StatusAlert type="success" light>Order confirmed! Shipping tomorrow.</StatusAlert>
                <StatusAlert type="warning" light>Low stock — only 3 left!</StatusAlert>
                <StatusAlert type="error" light>Payment declined. Try again.</StatusAlert>
                <StatusAlert type="info" light>Price drop alert enabled.</StatusAlert>
              </div>
            </div>
            
            {/* Dark */}
            <div className="rounded-xl bg-neutral-900 p-6">
              <p className="mb-4 text-sm font-medium text-neutral-400">Dark Mode (fixed)</p>
              <div className="space-y-3">
                <StatusAlert type="success">Order confirmed! Shipping tomorrow.</StatusAlert>
                <StatusAlert type="warning">Low stock — only 3 left!</StatusAlert>
                <StatusAlert type="error">Payment declined. Try again.</StatusAlert>
                <StatusAlert type="info">Price drop alert enabled.</StatusAlert>
              </div>
            </div>
          </div>
        </section>

        {/* Order Status Timeline */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Order Status Timeline</h2>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatus status="received" label="Received" active />
              <Arrow />
              <OrderStatus status="processing" label="Processing" active />
              <Arrow />
              <OrderStatus status="shipped" label="Shipped" active />
              <Arrow />
              <OrderStatus status="delivered" label="Delivered" />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <OrderPill status="pending">Pending</OrderPill>
              <OrderPill status="processing">Processing</OrderPill>
              <OrderPill status="shipped">Shipped</OrderPill>
              <OrderPill status="delivered">Delivered</OrderPill>
              <OrderPill status="cancelled">Cancelled</OrderPill>
            </div>
          </div>
        </section>

        {/* Seller Verification */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Seller Verification Tiers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <VerificationCard tier="email" label="Email Verified" />
            <VerificationCard tier="phone" label="Phone Verified" />
            <VerificationCard tier="id" label="ID Verified" />
            <VerificationCard tier="business" label="Business Verified" />
          </div>
        </section>

        {/* Price Display Variants */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Price Display</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <PriceCard label="Regular" price={99.99} />
            <PriceCard label="On Sale" price={79.99} originalPrice={129.99} savings={38} />
            <PriceCard label="Deal" price={49.99} originalPrice={99.99} savings={50} isDeal />
          </div>
        </section>

        {/* Social Proof Indicators */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Social Proof</h2>
          <div className="flex flex-wrap gap-4">
            <SocialProof icon={<Eye className="h-4 w-4" />} label="24 watching" type="watching" />
            <SocialProof icon={<Flame className="h-4 w-4" />} label="Hot item" type="hot" />
            <SocialProof icon={<Clock className="h-4 w-4" />} label="Listed 2h ago" type="fresh" />
            <SocialProof icon={<Heart className="h-4 w-4" />} label="142 favorites" type="favorite" />
          </div>
        </section>

        {/* Final Spec */}
        <section className="rounded-xl border-2 border-primary/20 bg-card p-6">
          <h2 className="text-lg font-semibold">Minimal Fixes Summary</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-success">✓ Keep</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Distinct condition badge hues</li>
                <li>• Order status color progression</li>
                <li>• Marketplace semantics (rating, deal, etc.)</li>
                <li>• Twitter core theme</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-primary">→ Fix</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Add dark mode for status colors</li>
                <li>• Remove 21 dead tokens</li>
                <li>• Info = Primary (same hue 243)</li>
                <li>• Lower chroma 0.18→0.15 where loud</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ============ COMPONENTS ============ */

function CategoryPill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
      active 
        ? "bg-foreground text-background" 
        : "bg-background text-muted-foreground border border-border hover:bg-hover hover:text-foreground"
    }`}>
      {children}
    </button>
  );
}

function ProductCard({ 
  image, title, price, originalPrice, condition, badges, rating, reviews, freeShipping, verified 
}: { 
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: "new" | "likenew" | "good" | "fair" | "used" | "refurb";
  badges?: ("deal" | "hot" | "promoted" | "lowstock" | "watching")[];
  rating: number;
  reviews: number;
  freeShipping?: boolean;
  verified?: boolean;
}) {
  const hasDeal = badges?.includes("deal");
  
  return (
    <div className="group rounded-lg border bg-card overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-muted flex items-center justify-center text-5xl">
        {image}
        
        {/* Top badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {badges?.includes("deal") && (
            <span className="rounded bg-deal px-2 py-0.5 text-xs font-bold text-deal-foreground">DEAL</span>
          )}
          {badges?.includes("promoted") && (
            <span className="rounded bg-badge-promoted-bg border border-badge-promoted-border px-2 py-0.5 text-xs font-medium text-badge-promoted-text">Promoted</span>
          )}
          {badges?.includes("hot") && (
            <span className="flex items-center gap-1 rounded bg-hot-bg px-2 py-0.5 text-xs font-medium text-hot">
              <Flame className="h-3 w-3" /> Hot
            </span>
          )}
        </div>
        
        {/* Condition badge */}
        <div className="absolute right-2 top-2">
          <ConditionBadge condition={condition} small />
        </div>
        
        {/* Wishlist */}
        <button className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground hover:text-wishlist-active transition-colors">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Rating */}
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-rating text-rating" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        
        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-lg font-bold ${hasDeal ? "text-price-sale" : "text-foreground"}`}>
            ${price}
          </span>
          {originalPrice && (
            <span className="text-sm text-price-original line-through">${originalPrice}</span>
          )}
        </div>
        
        {/* Meta badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {freeShipping && (
            <span className="flex items-center gap-1 rounded bg-badge-shipping-bg border border-badge-shipping-border px-1.5 py-0.5 text-[10px] font-medium text-badge-shipping-text">
              <Truck className="h-3 w-3" /> Free
            </span>
          )}
          {verified && (
            <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-verified">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
          {badges?.includes("lowstock") && (
            <span className="rounded bg-urgency-stock-bg px-1.5 py-0.5 text-[10px] font-medium text-urgency-stock-text">
              Low stock
            </span>
          )}
          {badges?.includes("watching") && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Eye className="h-3 w-3" /> 8 watching
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ConditionBadge({ condition, small }: { condition: string; small?: boolean }) {
  const styles: Record<string, string> = {
    new: "bg-condition-new",
    likenew: "bg-condition-likenew", 
    good: "bg-condition-good",
    fair: "bg-condition-fair",
    used: "bg-condition-used",
    refurb: "bg-condition-refurb",
  };
  
  const labels: Record<string, string> = {
    new: "New",
    likenew: "Like New",
    good: "Good", 
    fair: "Fair",
    used: "Used",
    refurb: "Refurb",
  };
  
  return (
    <span className={`rounded-full ${styles[condition]} ${small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"} font-medium text-white`}>
      {labels[condition]}
    </span>
  );
}

function Badge({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: bg }}>
      {children}
    </span>
  );
}

function StatusAlert({ type, children, light }: { type: "success" | "warning" | "error" | "info"; children: React.ReactNode; light?: boolean }) {
  // Light mode values
  const lightStyles: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: "oklch(0.95 0.03 155)", border: "oklch(0.85 0.08 155)", text: "oklch(0.40 0.12 155)" },
    warning: { bg: "oklch(0.95 0.04 85)", border: "oklch(0.85 0.10 85)", text: "oklch(0.45 0.12 85)" },
    error: { bg: "oklch(0.95 0.03 25)", border: "oklch(0.85 0.10 25)", text: "oklch(0.45 0.15 25)" },
    info: { bg: "oklch(0.95 0.02 243)", border: "oklch(0.85 0.06 243)", text: "oklch(0.45 0.12 243)" },
  };
  
  // Dark mode values  
  const darkStyles: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: "oklch(0.25 0.04 155)", border: "oklch(0.35 0.08 155)", text: "oklch(0.75 0.12 155)" },
    warning: { bg: "oklch(0.28 0.05 85)", border: "oklch(0.38 0.10 85)", text: "oklch(0.82 0.12 85)" },
    error: { bg: "oklch(0.25 0.05 25)", border: "oklch(0.35 0.10 25)", text: "oklch(0.75 0.14 25)" },
    info: { bg: "oklch(0.25 0.04 243)", border: "oklch(0.35 0.08 243)", text: "oklch(0.75 0.12 243)" },
  };
  
  const styles = light ? lightStyles[type] : darkStyles[type];
  if (!styles) return null;
  
  return (
    <div 
      className="rounded-lg px-3 py-2 text-sm"
      style={{ 
        background: styles.bg,
        borderWidth: 1,
        borderColor: styles.border,
        color: styles.text,
      }}
    >
      {children}
    </div>
  );
}

function OrderStatus({ status, label, active }: { status: string; label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
        active ? "bg-order-" + status + " text-white" : "bg-muted text-muted-foreground"
      }`}>
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Arrow() {
  return <div className="h-0.5 w-6 bg-border" />;
}

function OrderPill({ status, children }: { status: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    pending: "bg-order-pending",
    processing: "bg-order-processing",
    shipped: "bg-order-shipped",
    delivered: "bg-order-delivered",
    cancelled: "bg-order-cancelled",
  };
  
  return (
    <span className={`rounded-full ${styles[status]} px-3 py-1 text-xs font-medium text-white`}>
      {children}
    </span>
  );
}

function VerificationCard({ tier, label }: { tier: "email" | "phone" | "id" | "business"; label: string }) {
  const styles: Record<string, string> = {
    email: "bg-verify-email",
    phone: "bg-verify-phone",
    id: "bg-verify-id",
    business: "bg-verify-business",
  };
  
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles[tier]} text-white`}>
        <ShieldCheck className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function PriceCard({ label, price, originalPrice, savings, isDeal }: { 
  label: string; 
  price: number; 
  originalPrice?: number; 
  savings?: number;
  isDeal?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${isDeal ? "text-deal" : originalPrice ? "text-price-sale" : "text-price-regular"}`}>
          ${price}
        </span>
        {originalPrice && (
          <span className="text-sm text-price-original line-through">${originalPrice}</span>
        )}
      </div>
      {savings && (
        <p className="mt-1 text-sm font-medium text-price-savings">Save {savings}%</p>
      )}
    </div>
  );
}

function SocialProof({ icon, label, type }: { icon: React.ReactNode; label: string; type: string }) {
  const styles: Record<string, string> = {
    watching: "text-muted-foreground",
    hot: "text-hot",
    fresh: "text-fresh",
    favorite: "text-favorite",
  };
  
  return (
    <div className={`flex items-center gap-1.5 text-sm ${styles[type]}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
