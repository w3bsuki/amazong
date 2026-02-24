"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Download as DownloadSimple } from "lucide-react";

import { useTranslations } from "next-intl"

function toYmd(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function parseFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition)
  return decodeURIComponent(match?.[1] || match?.[2] || "") || null
}

interface ExportSalesProps {
  defaultFrom?: string
  defaultTo?: string
}

export function ExportSales({ defaultFrom, defaultTo }: ExportSalesProps) {
  const t = useTranslations("SellerManagement")
  const [from, setFrom] = React.useState(defaultFrom || toYmd(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
  const [to, setTo] = React.useState(defaultTo || toYmd(new Date()))
  const [isDownloading, setIsDownloading] = React.useState(false)

  const download = async () => {
    if (!from || !to || from > to) {
      toast.error(t("sales.export.errors.invalidRange"))
      return
    }

    setIsDownloading(true)
    try {
      const url = `/api/sales/export?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      const res = await fetch(url)
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      const blob = await res.blob()
      const filename = parseFilename(res.headers.get("content-disposition")) || `sales-${from}_to_${to}.csv`

      const href = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = href
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(href)
    } catch {
      toast.error(t("sales.export.errors.failed"))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{t("sales.export.from")}</div>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{t("sales.export.to")}</div>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={download} disabled={isDownloading} variant="outline" size="sm">
        <DownloadSimple className="size-4 mr-2" />
        {t("sales.export.cta")}
      </Button>
    </div>
  )
}
