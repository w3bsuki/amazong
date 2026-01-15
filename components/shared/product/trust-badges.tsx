import { useTranslations } from "next-intl"
import { RotateCcw, ShieldCheck, Truck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function TrustBadges(props: { verifiedSeller?: boolean }) {
  const { verifiedSeller } = props
  const t = useTranslations("Product")

  return (
    <Card className="border border-border/50">
      <CardContent className="p-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted/40 p-2">
              <ShieldCheck className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {t("buyerProtectionBadgeTitle")}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("buyerProtectionBadgeSubtitle")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted/40 p-2">
              <Truck className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{t("freeShipping")}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("freeShippingSubtitle")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted/40 p-2">
              <RotateCcw className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{t("returnsTitle")}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("returnsSubtitle")}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
