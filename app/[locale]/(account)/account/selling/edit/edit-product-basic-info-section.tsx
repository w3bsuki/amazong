"use client"

import { useTranslations } from "next-intl"
import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type EditProductBasicInfoSectionProps = {
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  stock: string
  setStock: (value: string) => void
}

export function EditProductBasicInfoSection({
  title,
  setTitle,
  description,
  setDescription,
  stock,
  setStock,
}: EditProductBasicInfoSectionProps) {
  const t = useTranslations("SellerManagement")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="size-5" />
          {t("selling.edit.sections.basicInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("selling.edit.fields.title.label")}</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("selling.edit.fields.title.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("selling.edit.fields.description.label")}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("selling.edit.fields.description.placeholder")}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">{t("selling.edit.fields.stock.label")}</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
