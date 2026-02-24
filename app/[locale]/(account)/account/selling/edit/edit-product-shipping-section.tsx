"use client"

import { useTranslations } from "next-intl"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type EditProductShippingSectionProps = {
  locale: string
  shipsBulgaria: boolean
  setShipsBulgaria: (value: boolean) => void
  shipsEurope: boolean
  setShipsEurope: (value: boolean) => void
  shipsUSA: boolean
  setShipsUSA: (value: boolean) => void
  shipsWorldwide: boolean
  setShipsWorldwide: (value: boolean) => void
  sellerCity: string
  setSellerCity: (value: string) => void
}

export function EditProductShippingSection({
  locale,
  shipsBulgaria,
  setShipsBulgaria,
  shipsEurope,
  setShipsEurope,
  shipsUSA,
  setShipsUSA,
  shipsWorldwide,
  setShipsWorldwide,
  sellerCity,
  setSellerCity,
}: EditProductShippingSectionProps) {
  const t = useTranslations("SellerManagement")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("selling.edit.sections.shipping.title")}</CardTitle>
        <CardDescription>{t("selling.edit.sections.shipping.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {shipsBulgaria && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("selling.edit.fields.city.label")}</Label>
            <Select value={sellerCity} onValueChange={setSellerCity}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder={t("selling.edit.fields.city.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {BULGARIAN_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value} className="font-medium">
                    {locale === "bg" ? city.labelBg : city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("selling.edit.fields.city.help")}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇧🇬</span>
              <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.bulgaria")}</span>
            </div>
            <Switch checked={shipsBulgaria} onCheckedChange={setShipsBulgaria} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇪🇺</span>
              <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.europe")}</span>
            </div>
            <Switch checked={shipsEurope} onCheckedChange={setShipsEurope} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.usa")}</span>
            </div>
            <Switch checked={shipsUSA} onCheckedChange={setShipsUSA} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.worldwide")}</span>
            </div>
            <Switch checked={shipsWorldwide} onCheckedChange={setShipsWorldwide} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
