import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AdminDialogShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  cancelLabel: string
  submitLabel: string
  onSubmit: () => void
  children: ReactNode
}

export function AdminDialogShell({
  open,
  onOpenChange,
  title,
  cancelLabel,
  submitLabel,
  onSubmit,
  children,
}: AdminDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
