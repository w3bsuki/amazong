"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Package,
  Eye,
  MapPin,
  User,
  Clock,
} from "@phosphor-icons/react"
import type { SaleItem } from "../types"

interface SalesTableProps {
  sales: SaleItem[]
  locale: string
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  paid: "bg-selected text-primary",
  processing: "bg-order-processing/10 text-order-processing",
  shipped: "bg-order-shipped/10 text-order-shipped",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<string, { en: string; bg: string }> = {
  pending: { en: "Pending", bg: "Изчакване" },
  paid: { en: "Paid", bg: "Платено" },
  processing: { en: "Processing", bg: "В обработка" },
  shipped: { en: "Shipped", bg: "Изпратено" },
  delivered: { en: "Delivered", bg: "Доставено" },
  cancelled: { en: "Cancelled", bg: "Отказано" },
}

export function SalesTable({ sales, locale }: SalesTableProps) {
  if (sales.length === 0) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">{locale === "bg" ? "Продукт" : "Product"}</TableHead>
            <TableHead>{locale === "bg" ? "Купувач" : "Buyer"}</TableHead>
            <TableHead className="text-right">{locale === "bg" ? "Количество" : "Qty"}</TableHead>
            <TableHead className="text-right">{locale === "bg" ? "Приходи" : "Revenue"}</TableHead>
            <TableHead>{locale === "bg" ? "Статус" : "Status"}</TableHead>
            <TableHead>{locale === "bg" ? "Дата" : "Date"}</TableHead>
            <TableHead className="pr-6 text-right">{locale === "bg" ? "Действия" : "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              {/* Product */}
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    {sale.product?.images?.[0] && sale.product.images[0].startsWith("http") ? (
                      <Image
                        src={sale.product.images[0]}
                        alt={sale.product?.title || "Product"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${sale.product_id}`}
                      className="font-medium text-sm hover:underline line-clamp-1"
                    >
                      {sale.product?.title || "Unknown Product"}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(Number(sale.price_at_purchase))} {locale === "bg" ? "на бройка" : "each"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Buyer */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="size-4 text-muted-foreground" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {sale.order?.buyer?.full_name || sale.order?.buyer?.email?.split("@")[0] || "Unknown"}
                    </p>
                    {sale.order?.shipping_address?.city && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {sale.order.shipping_address.city}
                        {sale.order.shipping_address.country && `, ${sale.order.shipping_address.country}`}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Quantity */}
              <TableCell className="text-right">
                <span className="font-medium">{sale.quantity}</span>
              </TableCell>

              {/* Revenue */}
              <TableCell className="text-right">
                <span className="font-semibold text-success">
                  {formatCurrency(Number(sale.price_at_purchase) * sale.quantity)}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant="secondary" className={`${statusColors[sale.status] || statusColors.pending} border-0`}>
                  {statusLabels[sale.status]?.[locale === "bg" ? "bg" : "en"] || sale.status}
                </Badge>
              </TableCell>

              {/* Date */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {new Date(sale.created_at).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="pr-6 text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/account/orders/${sale.order_id}`}>
                    <Eye className="size-4 mr-1.5" />
                    {locale === "bg" ? "Виж" : "View"}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
