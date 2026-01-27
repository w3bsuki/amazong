"use client"

import type { ReactNode } from "react"
import { useRouter } from "@/i18n/routing"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowSquareOut } from "@phosphor-icons/react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ProductRouteModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const t = useTranslations("ProductModal")

  const handleViewFullPage = () => {
    setOpen(false)
    // Navigate forward to the real product page instead of going back
    // The current URL path already points to the product, so we can use it
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      router.push(path)
    }
  }

  return (
    <div className="hidden md:block">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setOpen(false)
            router.back()
            return
          }
          setOpen(true)
        }}
      >
        <DialogContent 
          variant="fullWidth" 
          className="flex flex-col overflow-hidden"
          aria-describedby={undefined}
        >
          {/* Sticky header with visible title */}
          <div className="flex items-center justify-between gap-4 border-b border-border bg-background px-5 py-3 pr-14">
            <DialogTitle className="truncate text-base font-semibold text-foreground">
              {title}
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleViewFullPage}
            >
              {t("viewFullPage")}
              <ArrowSquareOut size={16} weight="bold" />
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
