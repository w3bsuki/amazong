"use client"

import { ShieldCheck, CaretRight } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface QuickViewSellerCardProps {
  sellerName?: string | null | undefined
  sellerAvatarUrl?: string | null | undefined
  sellerVerified?: boolean | undefined
  onNavigateToProduct: () => void
}

export function QuickViewSellerCard({
  sellerName,
  sellerAvatarUrl,
  sellerVerified,
  onNavigateToProduct,
}: QuickViewSellerCardProps) {
  const tProduct = useTranslations("Product")

  return (
    <button
      type="button"
      onClick={onNavigateToProduct}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-md text-left",
        "bg-muted/50 border border-border",
        "hover:bg-muted/80 transition-colors duration-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={sellerAvatarUrl ?? undefined} alt={sellerName ?? ""} />
        <AvatarFallback className="bg-muted text-sm font-medium">
          {sellerName?.slice(0, 2).toUpperCase() ?? "??"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{sellerName ?? "Seller"}</p>
        {sellerVerified && (
          <span className="flex items-center gap-1 text-xs text-verified">
            <ShieldCheck size={14} weight="fill" />
            {tProduct("verifiedSeller")}
          </span>
        )}
      </div>
      <CaretRight size={16} className="text-muted-foreground shrink-0" />
    </button>
  )
}
