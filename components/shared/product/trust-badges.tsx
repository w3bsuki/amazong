import { RotateCcw, ShieldCheck, Truck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function TrustBadges(props: { locale: string; verifiedSeller?: boolean }) {
  const { locale, verifiedSeller } = props

  const t = {
    title: locale === "bg" ? "Защита на купувача" : "Buyer protection",
    protection: locale === "bg" ? "Парите се държат до потвърждение на доставка" : "Funds are held until delivery is confirmed",
    returns: locale === "bg" ? "30 дни връщане" : "30-day returns",
    returnsSub: locale === "bg" ? "Връщане при несъответствие" : "Return if item is not as described",
    shipping: locale === "bg" ? "Доставка" : "Shipping",
    shippingSub: locale === "bg" ? "Проследяване и поддръжка" : "Tracking and support",
  }

  return (
    <Card className="border border-border/50">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-muted/40 p-2">
            <ShieldCheck className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{t.title}{verifiedSeller ? "" : ""}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.protection}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-muted/40 p-2">
            <RotateCcw className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{t.returns}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.returnsSub}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-muted/40 p-2">
            <Truck className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{t.shipping}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.shippingSub}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
