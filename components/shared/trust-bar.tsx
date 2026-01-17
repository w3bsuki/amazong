import { ArrowCounterClockwise, Lock, ShieldCheck, Truck } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type TrustBarVariant = "mobile" | "desktop"

export function TrustBar({
  locale,
  variant = "mobile",
  className,
}: {
  locale: string
  variant?: TrustBarVariant
  className?: string
}) {
  const items = [
    {
      icon: Truck,
      text: locale === "bg" ? "Безплатна доставка 50€+" : "Free Shipping €50+",
    },
    {
      icon: ShieldCheck,
      text: locale === "bg" ? "Защита на купувача" : "Buyer Protection",
    },
    {
      icon: ArrowCounterClockwise,
      text: locale === "bg" ? "30 дни връщане" : "30-Day Returns",
    },
    {
      icon: Lock,
      text: locale === "bg" ? "Сигурно плащане" : "Secure Payment",
    },
  ]

  return (
    <section
      aria-label={locale === "bg" ? "Доверие" : "Trust"}
      className={cn(
        "w-full",
        "bg-muted/30 border border-border/50 rounded-md",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          "overflow-x-auto no-scrollbar",
          "py-2",
          variant === "desktop" ? "px-3" : "px-inset"
        )}
        role="list"
      >
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.text}
              role="listitem"
              className={cn(
                "shrink-0",
                "flex items-center gap-2",
                "min-h-9",
                "px-2",
                "rounded-sm",
                "bg-background/60"
              )}
            >
              <Icon size={16} weight="bold" className="text-foreground/80" aria-hidden="true" />
              <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">
                {item.text}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
