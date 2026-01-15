import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Storefront } from "@phosphor-icons/react/dist/ssr"

interface MarketplaceHeroProps {
  locale: string
}

/**
 * MarketplaceHero - Refined promotional banner 
 * 
 * OLX/Bazar-inspired but cleaner:
 * - Value proposition headline with clear hierarchy
 * - Benefit bullets with visual separation
 * - Single prominent CTA to sell
 */
export function MarketplaceHero({ locale }: MarketplaceHeroProps) {
  const isBg = locale === "bg"

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-cta-trust-blue">
      <div className="relative px-5 py-4 lg:px-6 lg:py-5">
        <div className="flex items-center justify-between gap-6">
          {/* Left Content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-xl font-semibold text-cta-trust-blue-text tracking-tight mb-1">
              {isBg ? "Купувай и продавай лесно" : "Buy and sell easily"}
            </h1>
            <p className="text-sm text-cta-trust-blue-text/85 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-cta-trust-blue-text/60" aria-hidden="true" />
                {isBg ? "Безплатно публикуване" : "Free listings"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-cta-trust-blue-text/60" aria-hidden="true" />
                {isBg ? "Без такси" : "No fees"}
              </span>
              <span className="inline-flex items-center gap-1.5 hidden sm:inline-flex">
                <span className="size-1.5 rounded-full bg-cta-trust-blue-text/60" aria-hidden="true" />
                {isBg ? "Бърза доставка" : "Fast shipping"}
              </span>
            </p>
          </div>

          {/* Right Content - CTA */}
          <Button asChild size="default" className="bg-cta-secondary text-cta-trust-blue hover:bg-cta-secondary-hover font-semibold shrink-0 shadow-sm">
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
