import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Storefront } from "@phosphor-icons/react/dist/ssr"

interface MarketplaceHeroProps {
  locale: string
}

/**
 * MarketplaceHero - Slim promotional banner (no search - header handles that)
 * 
 * OLX/Bazar-inspired but cleaner:
 * - Trust badge with user count
 * - Value proposition headline
 * - Single CTA to sell
 */
export function MarketplaceHero({ locale }: MarketplaceHeroProps) {
  const isBg = locale === "bg"

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-cta-trust-blue">
      <div className="relative px-5 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Content */}
          <div className="min-w-0">
            <h1 className="text-base lg:text-lg font-semibold text-cta-trust-blue-text tracking-tight">
              {isBg ? "Купувай и продавай лесно" : "Buy and sell easily"}
            </h1>
            <p className="text-xs text-cta-trust-blue-text/80 hidden sm:block">
              {isBg ? "Безплатно публикуване • Без такси • Бърза доставка" : "Free listings • No fees • Fast shipping"}
            </p>
          </div>

          {/* Right Content - CTA */}
          <Button asChild size="sm" className="bg-cta-secondary text-cta-trust-blue hover:bg-cta-secondary-hover font-semibold shrink-0">
            <Link href="/sell">
              <Storefront weight="fill" className="size-4 mr-1.5" />
              {isBg ? "Продай" : "Sell"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
