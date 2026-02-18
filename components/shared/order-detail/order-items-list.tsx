import type { ReactNode } from "react"

import { Link } from "@/i18n/routing"
import { OrderListProductThumb } from "@/components/shared/order-list-item"
import { cn } from "@/lib/utils"

interface OrderItemsListProps {
  children: ReactNode
  className?: string | undefined
  divided?: boolean | undefined
}

interface OrderDetailItemShellProps {
  imageSrc?: string | null | undefined
  imageAlt: string
  imageHref?: string | undefined
  imageClassName?: string | undefined
  imageObjectClassName?: string | undefined
  imageSizes?: string | undefined
  itemClassName?: string | undefined
  contentClassName?: string | undefined
  content: ReactNode
  trailing?: ReactNode | undefined
}

export function OrderItemsList({ children, className, divided = false }: OrderItemsListProps) {
  return <div className={cn(divided ? "divide-y" : "space-y-4", className)}>{children}</div>
}

export function OrderDetailItemShell({
  imageSrc,
  imageAlt,
  imageHref,
  imageClassName,
  imageObjectClassName,
  imageSizes,
  itemClassName,
  contentClassName,
  content,
  trailing,
}: OrderDetailItemShellProps) {
  const imageNode = (
    <OrderListProductThumb
      imageSrc={imageSrc}
      alt={imageAlt}
      className={cn("size-20 rounded-md bg-muted shrink-0", imageClassName)}
      imageClassName={imageObjectClassName}
      sizes={imageSizes}
      fallbackClassName="text-muted-foreground"
    />
  )

  return (
    <div className={cn("flex gap-4 p-3 rounded-lg border bg-card", itemClassName)}>
      {imageHref ? <Link href={imageHref} className="shrink-0">{imageNode}</Link> : imageNode}
      <div className={cn("min-w-0 flex-1", contentClassName)}>{content}</div>
      {trailing}
    </div>
  )
}
