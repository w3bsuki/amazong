"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface SimilarItemsBarProps {
  seller: {
    id: string
    username?: string | null
    display_name: string
    avatar_url?: string | null
  }
  thumbnails: Array<{
    src: string
    alt: string
  }>
  className?: string
  labels?: {
    findSimilarFrom?: string
    shopStore?: string
    sponsored?: string
  }
}

export function SimilarItemsBar({
  seller,
  thumbnails,
  className,
  labels,
}: SimilarItemsBarProps) {
  const storeHref = `/${seller.username || seller.id}`

  const safeThumbnails = thumbnails.filter((t) => !!t?.src).slice(0, 6)

  return (
    <div
      className={cn(
        "rounded-lg border border-cta-trust-blue/20 bg-cta-trust-blue/5 p-1.5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-form-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">
            {labels?.findSimilarFrom ?? "Find similar items from"}
          </span>
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={seller.avatar_url ?? undefined} alt={seller.display_name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
              {(seller.display_name || "S").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-baseline gap-1 min-w-0">
            <Link
              href={storeHref}
              className="text-xs sm:text-sm font-bold text-foreground underline decoration-1 underline-offset-2 truncate hover:text-cta-trust-blue"
            >
              {seller.display_name}
            </Link>
          </div>
        </div>

        {/* Desktop Thumbnails - Inline */}
        {safeThumbnails.length > 0 && (
          <div className="hidden md:flex items-center gap-2 mx-form flex-1 overflow-hidden">
            {safeThumbnails.slice(0, 4).map((t, idx) => (
              <div
                key={`${t.src}-${idx}`}
                className="relative h-10 w-8 shrink-0 rounded border border-border bg-muted overflow-hidden shadow-sm"
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="shrink-0 ml-auto">
          <Link
            href={storeHref}
            className="text-xs sm:text-sm font-bold text-cta-trust-blue hover:underline whitespace-nowrap flex items-center gap-1"
          >
            {labels?.shopStore ?? "Shop store"}
          </Link>
        </div>
      </div>

      {/* Mobile-only horizontal scroll images */}
      <div className="mt-form-sm flex md:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {safeThumbnails.map((t, idx) => (
          <div key={`${t.src}-${idx}`} className="h-12 w-12 shrink-0 rounded border border-border bg-background p-0.5">
            <div className="relative h-full w-full">
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
