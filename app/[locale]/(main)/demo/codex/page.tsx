import { Metadata } from "next";
import {
  ArrowRight,
  Flame,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CountBadge } from "@/components/shared/count-badge";
import { PageShell } from "@/components/shared/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Demo — Codex Marketplace Reference",
  robots: { index: false, follow: false },
};

type ProductCondition = "new" | "likenew" | "good" | "fair" | "used" | "refurb";

const CATEGORIES = [
  { id: "all", labelKey: "categories.all" },
  { id: "electronics", labelKey: "categories.electronics" },
  { id: "fashion", labelKey: "categories.fashion" },
  { id: "homeGarden", labelKey: "categories.homeGarden" },
  { id: "sports", labelKey: "categories.sports" },
  { id: "collectibles", labelKey: "categories.collectibles" },
] as const;

const PRODUCTS: Array<{
  id: string;
  emoji: string;
  titleKey: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  watchers: number;
  condition: ProductCondition;
  deal?: boolean;
  hot?: boolean;
  promoted?: boolean;
  freeShipping?: boolean;
  verified?: boolean;
  lowStock?: boolean;
}> = [
  {
    id: "iphone",
    emoji: "📱",
    titleKey: "products.iphone.title",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 124,
    watchers: 24,
    condition: "likenew",
    deal: true,
    hot: true,
    freeShipping: true,
    verified: true,
  },
  {
    id: "nike",
    emoji: "👟",
    titleKey: "products.nike.title",
    price: 120,
    rating: 5.0,
    reviews: 8,
    watchers: 6,
    condition: "new",
    promoted: true,
    verified: true,
  },
  {
    id: "dualsense",
    emoji: "🎮",
    titleKey: "products.dualsense.title",
    price: 45,
    originalPrice: 69,
    rating: 4.5,
    reviews: 67,
    watchers: 12,
    condition: "good",
    freeShipping: true,
    lowStock: true,
  },
  {
    id: "books",
    emoji: "📚",
    titleKey: "products.books.title",
    price: 35,
    rating: 4.2,
    reviews: 12,
    watchers: 8,
    condition: "fair",
  },
];

export default async function DemoCodexPage() {
  const t = await getTranslations("DemoCodex");

  return (
    <PageShell variant="muted">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">treido</span>
            <Badge variant="outline" className="text-muted-foreground">
              {t("badge")}
            </Badge>
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-9"
                aria-label={t("searchAria")}
              />
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm">{t("locationPill")}</span>
            </Button>
            <Button variant="black" size="sm" className="gap-2">
              <Sparkles className="size-4" />
              {t("ctaSell")}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <IconCountButton
              icon={<Heart className="size-5" />}
              label={t("favoritesAria")}
              count={3}
              badgeClassName="bg-notification text-white"
            />
            <IconCountButton
              icon={<ShoppingCart className="size-5" />}
              label={t("cartAria")}
              count={2}
              badgeClassName="bg-cart-badge text-white"
            />
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
            {CATEGORIES.map((category) => (
              <Chip key={category.id} selected={category.id === "all"}>
                {t(category.labelKey)}
              </Chip>
            ))}
            <div className="ml-auto flex items-center gap-2 sm:hidden">
              <Button variant="outline" size="sm" className="gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                {t("locationPill")}
              </Button>
              <Button variant="black" size="sm">
                {t("ctaSell")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="outline" className="w-fit border-primary/20 bg-selected text-primary">
                {t("heroBadge")}
              </Badge>
              <CardTitle className="mt-2 text-2xl leading-tight">
                {t("heroTitle")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("heroSubtitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="shipping">
                  <Truck />
                  {t("pillFreeShipping")}
                </Badge>
                <Badge variant="verified">
                  <ShieldCheck />
                  {t("pillVerified")}
                </Badge>
                <Badge variant="deal">{t("pillDeals")}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="gap-2">
                  {t("ctaExplore")}
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline">{t("ctaBrowseCategories")}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("trustTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("trustSubtitle")}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <TrustRow
                icon={<ShieldCheck className="size-4 text-primary" />}
                title={t("trust.buyerProtection.title")}
                description={t("trust.buyerProtection.description")}
              />
              <TrustRow
                icon={<Truck className="size-4 text-primary" />}
                title={t("trust.fastShipping.title")}
                description={t("trust.fastShipping.description")}
              />
              <TrustRow
                icon={<Sparkles className="size-4 text-primary" />}
                title={t("trust.cleanSignals.title")}
                description={t("trust.cleanSignals.description")}
              />
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{t("gridTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("gridSubtitle")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("ctaViewAll")}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                t={t}
              />
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
          {t("footer")}
        </footer>
      </main>
    </PageShell>
  );
}

function IconCountButton({
  icon,
  label,
  count,
  badgeClassName,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  badgeClassName: string;
}) {
  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={label}>
      {icon}
      <CountBadge
        count={count}
        className={cn("absolute -right-1 -top-1", badgeClassName)}
      />
    </Button>
  );
}

function Chip({ children, selected }: { children: React.ReactNode; selected?: boolean }) {
  return (
    <button
      className={cn(
        "h-touch-sm rounded-full border px-3 text-sm font-medium transition-colors",
        selected
          ? "border-selected-border bg-selected text-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-hover hover:text-foreground"
      )}
      type="button"
    >
      {children}
    </button>
  );
}

function TrustRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex size-7 items-center justify-center rounded-full border border-border bg-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  t,
}: {
  product: (typeof PRODUCTS)[number];
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <Card className="group overflow-hidden transition-colors hover:border-hover-border">
      <div className="relative aspect-square bg-muted">
        <div className="flex h-full items-center justify-center text-5xl">
          {product.emoji}
        </div>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.deal && <Badge variant="deal">{t("badges.deal")}</Badge>}
          {product.promoted && <Badge variant="promoted">{t("badges.promoted")}</Badge>}
          {product.hot && (
            <Badge variant="outline" className="border-hot/20 bg-hot-bg text-hot">
              <Flame />
              {t("badges.hot")}
            </Badge>
          )}
        </div>

        <div className="absolute right-2 top-2">
          <ConditionBadge condition={product.condition} t={t} />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute bottom-2 right-2 rounded-full border border-border bg-surface-floating text-muted-foreground hover:text-wishlist-active"
          aria-label={t("favoriteItemAria")}
        >
          <Heart />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm leading-snug">
          <span className="line-clamp-2">{t(product.titleKey)}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        <Rating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-base font-semibold",
              product.deal ? "text-price-sale" : "text-foreground"
            )}
          >
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-price-original line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {product.freeShipping && (
            <Badge variant="shipping">
              <Truck />
              {t("pillFreeShipping")}
            </Badge>
          )}
          {product.verified && (
            <Badge variant="verified">
              <ShieldCheck />
              {t("pillVerified")}
            </Badge>
          )}
          {product.lowStock && <Badge variant="stock-urgent">{t("badges.lowStock")}</Badge>}
          {!product.lowStock && (
            <Badge variant="info">
              <span className="text-2xs">{t("watching", { count: product.watchers })}</span>
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border pt-3">
        <div className="flex w-full items-center justify-between gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            {t("ctaDetails")}
          </Button>
          <Button variant={product.deal ? "deal" : "default"} size="sm" className="flex-1">
            {t("ctaBuy")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function ConditionBadge({
  condition,
  t,
}: {
  condition: ProductCondition;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const styleByCondition: Record<ProductCondition, string> = {
    new: "bg-condition-new",
    likenew: "bg-condition-likenew",
    good: "bg-condition-good",
    fair: "bg-condition-fair",
    used: "bg-condition-used",
    refurb: "bg-condition-refurb",
  };

  const labelByCondition: Record<ProductCondition, string> = {
    new: t("conditions.new"),
    likenew: t("conditions.likenew"),
    good: t("conditions.good"),
    fair: t("conditions.fair"),
    used: t("conditions.used"),
    refurb: t("conditions.refurb"),
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-transparent text-2xs font-semibold text-white",
        styleByCondition[condition]
      )}
    >
      {labelByCondition[condition]}
    </Badge>
  );
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  const rounded = Math.round(rating);
  const stars = [1, 2, 3, 4, 5] as const;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= rounded;
          return (
            <Star
              key={star}
              className={cn(
                "size-3.5",
                filled ? "fill-rating text-rating" : "fill-rating-empty text-rating-empty"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-foreground tabular-nums">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        ({reviews})
      </span>
    </div>
  );
}
