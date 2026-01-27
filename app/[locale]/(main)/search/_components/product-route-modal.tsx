"use client"

import type { ReactNode } from "react"
import { useRouter } from "@/i18n/routing"
import { useState } from "react"
import { X } from "lucide-react"

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ProductRouteModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

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
          className="flex h-[85dvh] flex-col overflow-hidden p-0"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          {/* Scrollable content area - no header, cleaner look */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Floating close button - top right */}
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 z-20 size-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-sm hover:bg-background"
            >
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
