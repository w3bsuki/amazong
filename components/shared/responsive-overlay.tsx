"use client"

import * as React from "react"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/routing"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerBody, DrawerClose, DrawerContent } from "@/components/ui/drawer"

type OverlayBlur = "none" | "sm" | "md" | "lg" | "xl"

export interface ResponsiveOverlayProps {
  title: string
  children: React.ReactNode
  className?: string

  /**
   * When true, closing the overlay uses `router.back()` (ideal for intercepting routes).
   * Defaults to false for non-routing overlays.
   */
  backOnClose?: boolean

  /**
   * Control the open state (optional).
   * If omitted, the overlay is uncontrolled and defaults to open.
   */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void

  /**
   * Desktop dialog sizing.
   * - default: standard dialog
   * - fullWidth: large "quick view" dialog
   */
  desktopVariant?: "default" | "fullWidth"

  /** Blur intensity for the overlay backdrop (desktop). */
  desktopOverlayBlur?: OverlayBlur
  /** Blur intensity for the overlay backdrop (mobile). */
  mobileOverlayBlur?: OverlayBlur
}

export function ResponsiveOverlay({
  title,
  children,
  className,
  backOnClose = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  desktopVariant = "fullWidth",
  desktopOverlayBlur = "md",
  mobileOverlayBlur = "md",
}: ResponsiveOverlayProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const t = useTranslations("Common")

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)

      if (!nextOpen && backOnClose) {
        router.back()
      }
    },
    [backOnClose, onOpenChange, openProp, router]
  )

  const closeLabel = t("close")

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        direction="bottom"
      >
        <DrawerContent
          aria-label={title}
          overlayBlur={mobileOverlayBlur}
          className={cn("p-0", className)}
        >
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-20 bg-surface-glass backdrop-blur-md border border-border shadow-sm hover:bg-hover active:bg-active"
            >
              <X className="size-5" />
              <span className="sr-only">{closeLabel}</span>
            </Button>
          </DrawerClose>

          <DrawerBody className="px-0">
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        variant={desktopVariant}
        overlayBlur={desktopOverlayBlur}
        className={cn("flex flex-col overflow-hidden p-0", className)}
        aria-label={title}
        aria-describedby={undefined}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-20 bg-surface-glass backdrop-blur-md border border-border shadow-sm hover:bg-hover active:bg-active"
          onClick={() => handleOpenChange(false)}
        >
          <X className="size-5" />
          <span className="sr-only">{closeLabel}</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
