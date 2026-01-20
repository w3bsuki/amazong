"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { ArrowUpRight, Link as LinkIcon, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProductModalWrapperProps {
  locale: string
  username: string
  productSlug: string
  title: string
  description?: string | null
  children: React.ReactNode
}

export function ProductModalWrapper({
  locale,
  username,
  productSlug,
  title,
  description,
  children,
}: ProductModalWrapperProps) {
  const tModal = useTranslations("ProductModal")
  const router = useRouter()

  const [open, setOpen] = React.useState(true)

  const handleClose = React.useCallback(() => {
    setOpen(false)
    router.back()
  }, [router])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) handleClose()
    },
    [handleClose],
  )

  const fullPagePath = `/${locale}/${username}/${productSlug}`

  const handleOpenFullPage = React.useCallback(() => {
    window.location.assign(fullPagePath)
  }, [fullPagePath])

  const handleCopyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success(tModal("linkCopied"))
    } catch {
      toast.error(tModal("copyFailed"))
    }
  }, [tModal])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-full w-full h-dvh sm:h-(--product-quickview-h) sm:w-(--product-quickview-w) sm:max-w-none p-0 gap-0 flex flex-col rounded-none sm:rounded-lg border-0 sm:border overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {description ?? title}
        </DialogDescription>

        {/* Header - fixed, never scrolls */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              aria-label={tModal("closeModal")}
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
            <span className="text-sm font-medium truncate max-w-xs sm:max-w-md">{title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenFullPage}
              className="hidden sm:inline-flex gap-1.5 text-xs h-8"
            >
              {tModal("viewFullPage")}
              <ArrowUpRight className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCopyLink}
              aria-label={tModal("copyLink")}
              className="shrink-0"
            >
              <LinkIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content - single scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

