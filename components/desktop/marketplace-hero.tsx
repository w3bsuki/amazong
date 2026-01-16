import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Storefront, Package, Tag, Truck } from "@phosphor-icons/react/dist/ssr"

interface MarketplaceHeroProps {
  locale: string
  variant?: "standalone" | "embedded" | "strip"
}

/**
 * MarketplaceHero - Desktop promotional banner
 * 
 * Clean, impactful design with:
 * - Strong headline with value proposition
 * - Benefit badges with icons
 * - Clear primary CTA
 * 
 * Design rules (from DESIGN.md):
 * - Use rounded-md for cards (not rounded-lg)
 * - Semantic tokens for colors
 * - Dense spacing: gap-3 for desktop
 */
export function MarketplaceHero({ locale, variant = "standalone" }: MarketplaceHeroProps) {
  const isBg = locale === "bg"
  const isEmbedded = variant === "embedded"
  const isStrip = variant === "strip"

  const benefits = [
    {
      icon: Package,
      label: isBg ? "Безплатно публикуване" : "Free listings",
    },
    {
      icon: Tag,
      label: isBg ? "Без такси" : "No fees",
    },
    {
      icon: Truck,
      label: isBg ? "Бърза доставка" : "Fast shipping",
    },
  ]

  if (isStrip) {
    return (
      <div className="w-full rounded-md bg-muted/60">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Package size={14} weight="fill" className="text-foreground/60" />
              {isBg ? "Безплатно публикуване" : "Free listings"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tag size={14} weight="fill" className="text-foreground/60" />
              {isBg ? "Без такси" : "No fees"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={14} weight="fill" className="text-foreground/60" />
              {isBg ? "Бърза доставка" : "Fast shipping"}
            </span>
          </div>
          <Link
            href="/sell"
            className="inline-flex items-center gap-1 rounded-md text-xs font-semibold text-foreground/80 hover:text-foreground"
          >
            <Storefront weight="fill" className="size-3.5" />
            {isBg ? "Продай" : "Sell"}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        isEmbedded
          ? "w-full overflow-hidden rounded-md border border-border bg-card"
          : "w-full overflow-hidden rounded-md border border-border bg-card"
      }
    >
      <div className={isEmbedded ? "px-4 py-3 lg:px-5 lg:py-4" : "px-5 py-4 lg:px-6 lg:py-5"}>
        <div className="flex items-start justify-between gap-6">
          {/* Left Content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-xl font-semibold text-foreground tracking-tight">
              {isBg ? "Купувай и продавай лесно" : "Buy and sell easily"}
            </h1>
            
            {/* Benefits as inline badges */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-foreground"
                >
                  <benefit.icon size={14} weight="fill" className="text-muted-foreground" />
                  <span className="font-medium text-foreground/90">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - CTA */}
          <Button asChild size="lg" className="font-semibold shrink-0 h-11 px-5">
            <Link href="/sell">
              <Storefront weight="fill" className="size-4.5 mr-2" />
              {isBg ? "Продай" : "Sell"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
