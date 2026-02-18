import Image from "next/image"
import { Package as IconPackage } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type OrderListStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "partially_shipped"
  | "delivered"
  | "cancelled"
  | string

interface OrderListStatusBadgeProps {
  status: OrderListStatus | null | undefined
  locale?: string | undefined
  label?: string | undefined
  className?: string | undefined
  icon?: ReactNode | undefined
}

interface OrderListProductThumbProps {
  imageSrc?: string | null | undefined
  alt: string
  className?: string | undefined
  imageClassName?: string | undefined
  fallbackClassName?: string | undefined
  sizes?: string | undefined
  overlay?: ReactNode | undefined
}

function normalizeStatus(status: OrderListStatus | null | undefined) {
  return typeof status === "string" && status.length > 0 ? status : "pending"
}

function getOrderListStatusClass(status: OrderListStatus | null | undefined) {
  switch (normalizeStatus(status)) {
    case "paid":
    case "delivered":
      return "bg-success/10 text-success border-success/20"
    case "pending":
      return "bg-warning/10 text-warning border-warning/20"
    case "processing":
      return "bg-order-processing/10 text-order-processing border-order-processing/20"
    case "shipped":
    case "partially_shipped":
      return "bg-order-shipped/10 text-order-shipped border-order-shipped/20"
    case "cancelled":
      return "bg-error/10 text-error border-error/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getOrderListStatusLabel(status: OrderListStatus | null | undefined, locale = "en") {
  const normalized = normalizeStatus(status)
  if (locale === "bg") {
    switch (normalized) {
      case "paid":
        return "Платена"
      case "pending":
        return "Изчакване"
      case "processing":
        return "Обработка"
      case "shipped":
        return "Изпратена"
      case "partially_shipped":
        return "Частично изпратена"
      case "delivered":
        return "Доставена"
      case "cancelled":
        return "Отменена"
      default:
        return normalized
    }
  }

  if (normalized === "partially_shipped") {
    return "Partially shipped"
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function OrderListStatusBadge({
  status,
  locale = "en",
  label,
  className,
  icon,
}: OrderListStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getOrderListStatusClass(status), className)}>
      {icon}
      {label || getOrderListStatusLabel(status, locale)}
    </Badge>
  )
}

export function OrderListProductThumb({
  imageSrc,
  alt,
  className,
  imageClassName,
  fallbackClassName,
  sizes,
  overlay,
}: OrderListProductThumbProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {imageSrc ? (
        <Image src={imageSrc} alt={alt} fill className={cn("object-cover", imageClassName)} sizes={sizes} />
      ) : (
        <div className={cn("flex size-full items-center justify-center", fallbackClassName)}>
          <IconPackage className="size-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      {overlay}
    </div>
  )
}
