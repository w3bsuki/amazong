import type { ReactNode } from "react";
import {
  BadgeCheck,
  Bell,
  Cpu,
  Flag,
  Heart,
  Maximize2,
  MessageSquare,
  Quote,
  Search,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

type Seller = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  verified?: boolean | null;
};

type RelatedProduct = {
  id: string;
  title: string;
  price: number;
  list_price?: number | null;
  images?: string[] | null;
};

type Product = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  list_price?: number | null;
  images?: string[] | null;
  rating?: number | null;
  review_count?: number | null;
  condition?: string | null;
  attributes?: Record<string, unknown> | null;
  ships_to_bulgaria?: boolean | null;
};

function formatBgn(amount: number) {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} лв.`;
}

function safeSrc(url: string | null | undefined) {
  return url && url.trim().length > 0 ? url : "/placeholder.svg";
}

export function UltimateC2CProductPage(props: {
  locale: string;
  username: string;
  productSlug: string;
  product: Product;
  seller: Seller;
  relatedProducts: RelatedProduct[];
  technicalId?: string;
  sellerNote?: string;
  breadcrumbs?: { label: string; href?: string }[];
  rightRailExtra?: ReactNode;
}) {
  const {
    product,
    seller,
    relatedProducts,
    technicalId = "ID: 8492-AC",
    sellerNote =
      "Received this as a gift but I prefer the smaller model. The phone has been activated but never used as a daily driver. Comes with original box, unused USB-C cable, and all documentation. Screen protector applied since day one.",
    breadcrumbs = [
      { label: "Electronics", href: "#" },
      { label: "Apple", href: "#" },
      { label: product.title },
    ],
  } = props;

  const mainImage = safeSrc(product.images?.[0] ?? null);
  const thumb1 = safeSrc(product.images?.[0] ?? null);
  const thumb2 = safeSrc(product.images?.[1] ?? null);
  const thumb3 = safeSrc(product.images?.[2] ?? null);

  const sellerName = seller.display_name || seller.username || "Seller";

  const price = typeof product.price === "number" ? product.price : 0;
  const listPrice = typeof product.list_price === "number" ? product.list_price : null;
  const hasDiscount = listPrice != null && listPrice > price;
  const discountPct = hasDiscount ? Math.round(((listPrice - price) / listPrice) * 100) : null;

  const rating = product.rating ?? 0;
  const reviewCount = product.review_count ?? 0;

  return (
    <div className="bg-white text-gray-900 antialiased">
      {/* Navbar: Minimal, Technical */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="text-lg font-semibold tracking-tighter text-black uppercase">
              Market<span className="text-gray-400">/</span>Place
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
              <a href="#" className="text-gray-900 hover:text-black transition-colors">
                Browse
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Selling
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Messages
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Saved
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center w-64 bg-gray-50 border border-gray-200 rounded-md px-3 h-9 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
              />
              <span className="text-xs text-gray-400 font-mono">/</span>
            </div>
            <button className="relative p-1 hover:bg-gray-100 rounded-md transition-colors" type="button">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200" />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Media Gallery & Specs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                const key = `${crumb.label}-${idx}`;

                if (isLast) {
                  return (
                    <span key={key} className="text-gray-900">
                      {crumb.label}
                    </span>
                  );
                }

                return (
                  <span key={key} className="flex items-center gap-2">
                    <a href={crumb.href || "#"} className="hover:text-black transition-colors">
                      {crumb.label}
                    </a>
                    <span className="text-gray-300">/</span>
                  </span>
                );
              })}
            </div>

            {/* Bento Grid Gallery */}
            <div className="grid grid-cols-2 gap-2 aspect-[4/3] md:aspect-[16/10] w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <div className="col-span-2 row-span-2 relative group bg-white">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 md:p-8 hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="bg-white border border-gray-200 p-2 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    aria-label="Maximize"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-2 h-24 sm:h-32">
              <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-white hover:ring-2 hover:ring-gray-900 cursor-pointer transition-all">
                <img src={thumb1} alt="Thumbnail 1" className="w-full h-full object-cover" />
              </div>
              <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-white hover:ring-2 hover:ring-gray-900 cursor-pointer transition-all">
                <img src={thumb2} alt="Thumbnail 2" className="w-full h-full object-cover" />
              </div>
              <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-white hover:ring-2 hover:ring-gray-900 cursor-pointer transition-all">
                <img src={thumb3} alt="Thumbnail 3" className="w-full h-full object-cover" />
              </div>
              <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:ring-2 hover:ring-gray-900 cursor-pointer flex items-center justify-center transition-all group">
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900">+3 more</span>
              </div>
            </div>

            {/* Product Data Grid (Technical Specs) */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Technical Specifications</h3>
                </div>
                <span className="text-xs text-gray-500 font-mono px-2 py-0.5 bg-white border border-gray-200 rounded">
                  {technicalId}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">
                <div className="divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Condition</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {product.condition || "Open Box"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Battery Health</span>
                    <span className="text-sm font-medium text-gray-900">100% (2 Cycles)</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Model Region</span>
                    <span className="text-sm font-medium text-gray-900">EU (A3102)</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Storage</span>
                    <span className="text-sm font-medium text-gray-900">256 GB</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Warranty</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      AppleCare+
                      <br />
                      <span className="text-xs text-gray-400 font-normal">Expires 10/25</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Accessories</span>
                    <span className="text-sm font-medium text-gray-900">Box &amp; Cable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Action & Info (Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Header Group */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                      {product.title}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1.5 font-medium">Space Titanium · 256GB · Unlocked</p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-gray-50 transition-all"
                    aria-label="Save"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                </div>

                {/* Price Tag */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-semibold tracking-tight text-gray-900">{formatBgn(price)}</span>
                  {listPrice != null ? (
                    <span className="text-sm text-gray-400 line-through">{formatBgn(listPrice)}</span>
                  ) : null}
                  {discountPct != null ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                      -{discountPct}%
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Seller Card (High Trust) */}
              <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={seller.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=shop4e"}
                        alt={sellerName}
                        className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 border-[2.5px] border-white rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">{sellerName}</span>
                        {seller.verified ? (
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span>({reviewCount || 52} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded bg-white transition-colors"
                  >
                    View Profile
                  </button>
                </div>

                {/* Seller Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mb-4">
                  <div className="text-center group cursor-default">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-medium group-hover:text-gray-600 transition-colors">
                      Response
                    </span>
                    <span className="block text-sm font-medium text-gray-900 mt-0.5">&lt; 1hr</span>
                  </div>
                  <div className="text-center border-l border-gray-100 group cursor-default">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-medium group-hover:text-gray-600 transition-colors">
                      Shipped
                    </span>
                    <span className="block text-sm font-medium text-gray-900 mt-0.5">24hrs</span>
                  </div>
                  <div className="text-center border-l border-gray-100 group cursor-default">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-medium group-hover:text-gray-600 transition-colors">
                      Since
                    </span>
                    <span className="block text-sm font-medium text-gray-900 mt-0.5">2021</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    className="w-full bg-gray-900 hover:bg-black text-white font-medium text-sm py-3 px-4 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      Chat
                    </button>
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm py-2.5 px-4 rounded-md transition-colors"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller's Note (Moved here) */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3 ml-1">Seller's Note</h3>
                <div className="relative bg-gray-50/50 rounded-lg p-4 border border-gray-200">
                  <Quote className="w-4 h-4 text-gray-300 absolute top-3 left-3" />
                  <p className="text-sm text-gray-600 leading-relaxed indent-6">{sellerNote}</p>
                </div>
              </div>

              {/* Safety & Logistics */}
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex gap-3.5">
                  <div className="mt-0.5 p-1.5 bg-blue-50 rounded-full h-fit text-blue-600">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Buyer Protection</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Money is held securely until item is confirmed delivered and as described.
                    </p>
                  </div>
                </div>
                <div className="p-4 flex gap-3.5">
                  <div className="mt-0.5 p-1.5 bg-gray-100 rounded-full h-fit text-gray-600">
                    <Truck className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">Standard Shipping</p>
                      <span className="text-xs font-mono text-gray-500">~6.50 лв.</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Delivery to Sofia by <span className="text-gray-900 font-medium">Tue, Oct 24</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Listing Info (Footer of Sidebar) */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-medium">PAYMENTS</span>
                  <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="h-4 w-7 bg-gray-200 rounded-sm" />
                    <div className="h-4 w-7 bg-gray-200 rounded-sm" />
                    <div className="h-4 w-7 bg-gray-200 rounded-sm" />
                  </div>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">
                  <Flag className="w-3 h-3" />
                  Report
                </button>
              </div>

              {props.rightRailExtra}
            </div>
          </div>
        </div>

        {/* Section: Other Listings (Grid) */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">More from {sellerName}</h2>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              View all (12)
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {(relatedProducts || []).slice(0, 5).map((p, idx) => {
              const image = safeSrc(p.images?.[0] ?? null);
              const badge = idx === 0 ? "USED" : idx === 2 ? "NEW" : null;

              const isHiddenOnLg = idx === 4;

              return (
                <div
                  key={p.id}
                  className={`group cursor-pointer${isHiddenOnLg ? " hidden lg:block" : ""}`}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100 mb-3 relative">
                    <img
                      src={image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {badge ? (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-900 shadow-sm border border-gray-100">
                        {badge}
                      </div>
                    ) : null}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 leading-tight group-hover:underline">{p.title}</h3>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{formatBgn(p.price)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
