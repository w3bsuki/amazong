"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

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
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}
