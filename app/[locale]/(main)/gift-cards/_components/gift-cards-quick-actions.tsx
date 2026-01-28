import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Gift, Printer } from "@phosphor-icons/react/dist/ssr"
import { EnvelopeSimple as Mail } from "@phosphor-icons/react/dist/ssr"

export default function GiftCardsQuickActions({ t }: { t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <Card className="hover:border-hover-border cursor-pointer transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-4 space-y-4">
          <Mail className="w-12 h-12 text-link" />
          <span className="font-bold text-center">{t("eGiftCards")}</span>
        </CardContent>
      </Card>
      <Card className="hover:border-hover-border cursor-pointer transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-4 space-y-4">
          <Printer className="w-12 h-12 text-link" />
          <span className="font-bold text-center">{t("printAtHome")}</span>
        </CardContent>
      </Card>
      <Card className="hover:border-hover-border cursor-pointer transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-4 space-y-4">
          <Gift className="w-12 h-12 text-link" />
          <span className="font-bold text-center">{t("mail")}</span>
        </CardContent>
      </Card>
      <Card className="hover:border-hover-border cursor-pointer transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-4 space-y-4">
          <CreditCard className="w-12 h-12 text-link" />
          <span className="font-bold text-center">{t("reloadBalance")}</span>
        </CardContent>
      </Card>
    </div>
  )
}
