import type { ReactNode } from "react"
import { Link } from "@/i18n/routing"

import { OrderListProductThumb, OrderListStatusBadge } from "@/components/shared/order-list-item"
import { cn } from "@/lib/utils"

interface OrderSummaryThumb {
  imageSrc?: string | null | undefined
  alt: string
  className?: string | undefined
  imageClassName?: string | undefined
  fallbackClassName?: string | undefined
  sizes?: string | undefined
  overlay?: ReactNode | undefined
  href?: string | undefined
  linkClassName?: string | undefined
}

interface OrderSummaryStatus {
  value: string | null | undefined
  locale?: string | undefined
  label?: string | undefined
  className?: string | undefined
  icon?: ReactNode | undefined
  wrapperClassName?: string | undefined
}

interface OrderSummaryLineProps {
  className?: string | undefined
  thumb?: OrderSummaryThumb | undefined
  contentClassName?: string | undefined
  title?: ReactNode | undefined
  subtitle?: ReactNode | undefined
  status?: OrderSummaryStatus | undefined
  statusSlot?: ReactNode | undefined
  amount?: number | null | undefined
  formatAmount?: ((value: number) => string) | undefined
  amountClassName?: string | undefined
  trailing?: ReactNode | undefined
  children?: ReactNode | undefined
}

export function OrderSummaryLine({
  className,
  thumb,
  contentClassName,
  title,
  subtitle,
  status,
  statusSlot,
  amount,
  formatAmount,
  amountClassName,
  trailing,
  children,
}: OrderSummaryLineProps) {
  const thumbNode = thumb ? (
    <OrderListProductThumb
      imageSrc={thumb.imageSrc}
      alt={thumb.alt}
      className={thumb.className}
      imageClassName={thumb.imageClassName}
      sizes={thumb.sizes}
      fallbackClassName={thumb.fallbackClassName}
      overlay={thumb.overlay}
    />
  ) : null

  const hasAmount = typeof amount === "number" && Number.isFinite(amount) && typeof formatAmount === "function"
  const hasContent = Boolean(title || subtitle || status || statusSlot || hasAmount || children)

  return (
    <div className={cn("flex gap-3", className)}>
      {thumbNode ? (
        thumb?.href ? (
          <Link href={thumb.href} className={thumb.linkClassName}>
            {thumbNode}
          </Link>
        ) : (
          thumbNode
        )
      ) : null}

      {hasContent ? (
        <div className={cn("min-w-0 flex-1", contentClassName)}>
          {title}
          {subtitle}
          {statusSlot ? (
            statusSlot
          ) : status ? (
            <div className={status.wrapperClassName}>
              <OrderListStatusBadge
                status={status.value}
                locale={status.locale}
                label={status.label}
                className={status.className}
                icon={status.icon}
              />
            </div>
          ) : null}
          {hasAmount ? (
            <p className={amountClassName}>{formatAmount(amount)}</p>
          ) : null}
          {children}
        </div>
      ) : null}

      {trailing}
    </div>
  )
}
