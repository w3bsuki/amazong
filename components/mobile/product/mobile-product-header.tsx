"use client"

import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function MobileProductHeader({ 
  }: Record<string, never>) {
  const t = useTranslations("Product")
  const router = useRouter()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full min-h-12 bg-background/90 backdrop-blur-md border-b border-border/50 lg:hidden pt-safe-top">
      <div className="h-12 flex items-center justify-between px-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={t("back")}
          title={t("back")}
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t("share")}
            title={t("share")}
            onClick={handleShare}
          >
            <Share2 className="size-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t("moreOptions")}
            title={t("moreOptions")}
            onClick={() => {
              // Placeholder for a future menu / report / share sheet.
            }}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
