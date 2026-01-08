import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight, ShieldCheck, CreditCard, ChatCircleDots } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface StartSellingBannerProps {
  locale?: string
  className?: string
  /** Full-bleed variant for hero placement above filters */
  variant?: "default" | "full-bleed"
  /** When using full-bleed, optionally render trust items inside the banner */
  showTrustRow?: boolean
}

export function StartSellingBanner({ 
  locale = "en", 
  className,
  variant = "default",
  showTrustRow = false
}: StartSellingBannerProps) {
  const isBg = locale === "bg"

  const trustItems = isBg
    ? [
        { icon: ShieldCheck, text: "Защита на купувача" },
        { icon: CreditCard, text: "Сигурно плащане" },
        { icon: ChatCircleDots, text: "Поддръжка 24/7" },
      ]
    : [
        { icon: ShieldCheck, text: "Buyer protection" },
        { icon: CreditCard, text: "Secure payment" },
        { icon: ChatCircleDots, text: "24/7 support" },
      ]
  
  // Full-bleed: prominent banner but respects page rhythm
  if (variant === "full-bleed") {
    return (
      <div className="px-(--page-inset) py-2 bg-background">
        <Link
          href="/sell"
          className={cn(
            "block w-full rounded-lg",
            "bg-brand",
            "text-white",
            "px-3 py-3",
            "hover:bg-brand-dark",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "transition-colors duration-150",
            className
          )}
        >
          <div className="flex items-center justify-between w-full gap-3">
            {/* Left: Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">
                {isBg ? "Регистрирай се, за да продаваш" : "Sign up to start selling"}
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {isBg
                  ? "Създай обява за минути. Достигни купувачи."
                  : "List in minutes. Reach buyers faster."}
              </p>
            </div>

            {/* Right: Arrow pill */}
            <span
              className="size-8 shrink-0 rounded-full bg-white/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <ArrowRight size={16} weight="bold" />
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
        "border border-brand/30 bg-brand/5 text-foreground",
        "px-3 py-2.5 rounded-md",
        "hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-100",
        className
      )}
    >
      {/* Left Icon Block */}
      <span 
        className="size-9 shrink-0 rounded-md border border-brand/20 bg-brand/10 text-brand flex items-center justify-center" 
        aria-hidden="true"
      >
        <Storefront size={16} weight="fill" />
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0 text-left space-y-0.5">
        <span className="block text-sm font-semibold leading-tight">
          {isBg ? "Регистрирай се, за да продаваш" : "Sign up to start selling"}
        </span>
        <span className="block text-xs text-muted-foreground font-medium truncate">
          {isBg
            ? "Създай обява за минути. Достигни купувачи."
            : "List in minutes. Reach buyers faster."}
        </span>
      </span>

      {/* Right Arrow */}
      <span 
        className="size-8 shrink-0 rounded-md border border-brand/20 bg-brand/10 text-brand flex items-center justify-center" 
        aria-hidden="true"
      >
        <ArrowRight size={14} weight="bold" />
      </span>
    </Link>
  )
}
