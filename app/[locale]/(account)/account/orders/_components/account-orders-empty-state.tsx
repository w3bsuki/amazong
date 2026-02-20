"use client"

import { Link } from "@/i18n/routing"
import { ShoppingBag as IconShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type AccountOrdersEmptyStateText = {
  noOrders: string
  noOrdersDesc: string
  startShopping: string
}

export function AccountOrdersEmptyState({
  t,
  cardClassName,
}: {
  t: AccountOrdersEmptyStateText
  cardClassName?: string
}) {
  return (
    <Card className={cardClassName}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
          <IconShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">{t.noOrders}</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">{t.noOrdersDesc}</p>
        <Button asChild className="mt-6">
          <Link href="/">{t.startShopping}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

