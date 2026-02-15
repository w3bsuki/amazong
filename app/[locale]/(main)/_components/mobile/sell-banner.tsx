import { CaretRight, Storefront } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type SellBannerProps = {
  href: string
  title: string
  actionLabel: string
  className?: string
}

export function SellBanner({
  href,
  title,
  actionLabel,
  className,
}: SellBannerProps) {
  return (
    <Link
      href={href}
      aria-label={`${title}. ${actionLabel}`}
      data-testid="home-start-selling-cta"
      data-slot="home-sell-banner"
      className={cn(
        "group flex w-full min-h-(--control-primary) items-center gap-3 rounded-2xl border border-home-sell-cta-border bg-home-sell-cta-surface px-3 py-2.5 text-home-sell-cta-text",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "touch-manipulation transition-colors motion-reduce:transition-none hover:border-hover-border hover:bg-surface-card active:bg-active",
        className
      )}
    >
      <span className="inline-flex control-default shrink-0 items-center justify-center rounded-xl border border-home-sell-cta-icon-border bg-home-sell-cta-icon-surface text-home-sell-cta-icon-text transition-colors group-hover:bg-interactive-hover">
        <Storefront size={18} weight="fill" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block min-w-0 text-base font-semibold leading-tight tracking-tight line-clamp-1">
          {title}
        </span>
      </span>

      <span className="inline-flex min-h-(--control-default) shrink-0 items-center gap-1 text-sm font-semibold text-home-sell-cta-action">
        <span className="line-clamp-1">{actionLabel}</span>
        <CaretRight size={14} weight="bold" aria-hidden="true" />
      </span>
    </Link>
  )
}
