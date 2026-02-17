"use client"

import { Link } from "@/i18n/routing"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle as ChatCircle, Package, CircleAlert as WarningCircle } from "lucide-react";

import { useTranslations } from "next-intl"

interface PendingActionsProps {
  ordersToShipCount: number
  unreadMessagesCount: number
  lowStockCount: number
}

export function PendingActions({
  ordersToShipCount,
  unreadMessagesCount,
  lowStockCount,
}: PendingActionsProps) {
  const t = useTranslations("SellerManagement")
  const hasAny = ordersToShipCount > 0 || unreadMessagesCount > 0 || lowStockCount > 0

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">
              {t("sales.pendingActions.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("sales.pendingActions.description")}
            </p>
          </div>
          {!hasAny && (
            <Badge variant="secondary">{t("sales.pendingActions.allClear")}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {t("sales.pendingActions.items.ordersToShip")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={ordersToShipCount > 0 ? "default" : "secondary"}>
              {ordersToShipCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={ordersToShipCount === 0}>
              <Link href="/account/sales">
                {t("sales.pendingActions.actions.view")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChatCircle className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {t("sales.pendingActions.items.unreadMessages")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadMessagesCount > 0 ? "default" : "secondary"}>
              {unreadMessagesCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={unreadMessagesCount === 0}>
              <Link href="/chat">
                {t("sales.pendingActions.actions.open")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WarningCircle className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {t("sales.pendingActions.items.lowStock")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={lowStockCount > 0 ? "default" : "secondary"}>
              {lowStockCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={lowStockCount === 0}>
              <Link href="/account/selling">
                {t("sales.pendingActions.actions.manage")}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
