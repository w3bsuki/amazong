"use client"

import { useRouter } from "@/i18n/routing"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ModalProps {
  children: React.ReactNode
  title?: string
  description?: string
  ariaLabel?: string
}

export function Modal({ children, title, description, ariaLabel }: ModalProps) {
  const router = useRouter()
  const hasHeading = Boolean(title || description)

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-4xl max-h-dialog overflow-y-auto"
        aria-label={!hasHeading ? ariaLabel : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
