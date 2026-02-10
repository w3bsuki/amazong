"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import type { Seller } from "../_lib/top-sellers-types"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import SellersGrid from "./sellers-grid"

type SortKey = "newest" | "rating" | "products"

export default function SellersDirectoryClient({ sellers }: { sellers: Seller[] }) {
  const t = useTranslations("SellersDirectory")
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("products")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let next = sellers
    if (q) {
      next = next.filter((s) => s.store_name.toLowerCase().includes(q))
    }

    next = [...next].sort((a, b) => {
      if (sortKey === "rating") {
        const ar = a.total_rating ?? -1
        const br = b.total_rating ?? -1
        return br - ar
      }
      if (sortKey === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      // products
      return b.product_count - a.product_count
    })

    return next
  }, [query, sellers, sortKey])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10"
          />
        </div>
        <div className="w-full sm:w-52">
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder={t("sortLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="products">{t("sortProducts")}</SelectItem>
              <SelectItem value="rating">{t("sortRating")}</SelectItem>
              <SelectItem value="newest">{t("sortNewest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SellersGrid sellers={filtered} />
    </div>
  )
}
