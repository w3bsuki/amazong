import { Link } from "@/i18n/routing"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatCircle, Package, WarningCircle } from "@phosphor-icons/react/dist/ssr"

interface PendingActionsProps {
  locale: string
  ordersToShipCount: number
  unreadMessagesCount: number
  lowStockCount: number
}

export function PendingActions({
  locale,
  ordersToShipCount,
  unreadMessagesCount,
  lowStockCount,
}: PendingActionsProps) {
  const hasAny = ordersToShipCount > 0 || unreadMessagesCount > 0 || lowStockCount > 0

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">
              {locale === "bg" ? "Нуждае се от внимание" : "Needs Attention"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bg"
                ? "Бързи действия за магазина ви"
                : "Quick actions for your store"}
            </p>
          </div>
          {!hasAny && (
            <Badge variant="secondary">{locale === "bg" ? "Всичко е наред" : "All clear"}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {locale === "bg" ? "Поръчки за изпращане" : "Orders to ship"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={ordersToShipCount > 0 ? "default" : "secondary"}>
              {ordersToShipCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={ordersToShipCount === 0}>
              <Link href={`/${locale}/account/sales`}>
                {locale === "bg" ? "Преглед" : "View"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChatCircle className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {locale === "bg" ? "Непрочетени съобщения" : "Unread messages"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadMessagesCount > 0 ? "default" : "secondary"}>
              {unreadMessagesCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={unreadMessagesCount === 0}>
              <Link href={`/${locale}/chat`}>
                {locale === "bg" ? "Отвори" : "Open"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WarningCircle className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {locale === "bg" ? "Ниска наличност" : "Low stock"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={lowStockCount > 0 ? "default" : "secondary"}>
              {lowStockCount}
            </Badge>
            <Button asChild size="sm" variant="outline" disabled={lowStockCount === 0}>
              <Link href={`/${locale}/account/selling`}>
                {locale === "bg" ? "Управление" : "Manage"}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
