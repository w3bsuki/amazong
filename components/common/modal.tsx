"use client"

import { useRouter } from "@/i18n/routing"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ModalProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function Modal({ children, title, description }: ModalProps) {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
