import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight, ShieldCheck, CreditCard, ChatCircleDots } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

interface StartSellingBannerProps {
  locale?: string
  className?: string
  /** Full-bleed variant for hero placement above filters */
  variant?: "default" | "full-bleed"
  /** When using full-bleed, optionally render trust items inside the banner */
  showTrustRow?: boolean
}

export async function StartSellingBanner({
  locale = "en",
  className,
  variant = "default",
  showTrustRow = false
}: StartSellingBannerProps) {
  const t = await getTranslations({ locale, namespace: "Sell" })

  const trustItems = [
    { icon: ShieldCheck, text: t("startSellingBanner.trust.buyerProtection") },
    { icon: CreditCard, text: t("startSellingBanner.trust.securePayment") },
    { icon: ChatCircleDots, text: t("startSellingBanner.trust.support247") },
  ]

  // Full-bleed: INVERTED banner for primary CTA emphasis
  if (variant === "full-bleed") {
    return (
      <div className="px-inset bg-background">
        <Link
          href="/sell"
          className={cn(
            "block w-full rounded-md",
            "bg-foreground text-background",
            "px-3.5 py-2.5",
            "active:opacity-90 transition-opacity",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
        >
          <div className="flex items-center justify-between w-full gap-3">
            {/* Left: Text */}
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-snug tracking-tight">
                {t("startSellingBanner.fullBleed.title")}
              </p>
              <p className="text-xs text-background/70">
                {t("startSellingBanner.fullBleed.subtitle")}
              </p>
            </div>

            {/* Right: Arrow pill - inverted back to light */}
            <span
              className="size-9 shrink-0 rounded-md bg-background text-foreground flex items-center justify-center"
              aria-hidden="true"
            >
              <ArrowRight size={18} weight="bold" />
            </span>
          </div>
        </Link>

        {/* Trust badges - separate row below banner */}
        {showTrustRow && (
          <div className="flex items-center justify-between mt-2 px-1">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
                <item.icon size={16} weight="regular" />
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default: compact inline variant for use within filter areas
  return (
    <Link
      href="/sell"
      className={cn(
        "flex items-center justify-between w-full gap-3",
        "border border-border bg-secondary text-foreground",
        "px-3 py-2.5 rounded-md",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-100",
        className
      )}
    >
      {/* Left Icon Block */}
      <span
        className="size-9 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center"
        aria-hidden="true"
      >
        <Storefront size={16} weight="fill" />
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0 text-left space-y-0.5">
        <span className="block text-sm font-semibold leading-tight">
          {t("startSellingBanner.compact.title")}
        </span>
        <span className="block text-xs text-muted-foreground font-medium truncate">
          {t("startSellingBanner.compact.subtitle")}
        </span>
      </span>

      {/* Right Arrow */}
      <span
        className="size-8 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center"
        aria-hidden="true"
      >
        <ArrowRight size={14} weight="bold" />
      </span>
    </Link>
  )
}
