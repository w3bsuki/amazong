"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
        "rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/40",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-muted-foreground shrink-0 uppercase tracking-wider">
            {labels?.findSimilarFrom ?? "More from"}
          </span>
          <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
            <Avatar className="h-6 w-6 border border-border shrink-0">
              <AvatarImage src={seller.avatar_url ?? undefined} alt={seller.display_name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                {(seller.display_name || "S").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link
              href={storeHref}
              className="text-xs sm:text-sm font-bold text-foreground hover:text-primary truncate transition-colors"
            >
              {seller.display_name}
            </Link>
          </div>
        </div>

        {/* Desktop Thumbnails - Inline */}
        {safeThumbnails.length > 0 && (
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center overflow-hidden px-4">
            {safeThumbnails.slice(0, 4).map((t, idx) => (
              <div
                key={`${t.src}-${idx}`}
                className="relative h-10 w-10 shrink-0 rounded-lg border border-border bg-background overflow-hidden"
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
          <Button asChild variant="link" className="h-auto p-0 text-xs sm:text-sm font-bold text-primary hover:no-underline group">
            <Link href={storeHref} className="flex items-center gap-1">
              {labels?.shopStore ?? "Shop store"}
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile-only horizontal scroll images */}
      <div className="mt-4 flex md:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {safeThumbnails.map((t, idx) => (
          <div key={`${t.src}-${idx}`} className="h-14 w-14 shrink-0 rounded-xl border border-border bg-background p-1 relative overflow-hidden">
            <Image
              src={t.src}
              alt={t.alt}
              fill
              sizes="56px"
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
