import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { AdminDialogShell } from "./admin-dialog-shell"

interface AdminDialogWithTitleFieldProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  cancelLabel: string
  submitLabel: string
  onSubmit: () => void
  titleLabel: string
  titlePlaceholder: string
  titleValue: string
  onTitleValueChange: (value: string) => void
  children: ReactNode
}

export function AdminDialogWithTitleField({
  open,
  onOpenChange,
  title,
  cancelLabel,
  submitLabel,
  onSubmit,
  titleLabel,
  titlePlaceholder,
  titleValue,
  onTitleValueChange,
  children,
}: AdminDialogWithTitleFieldProps) {
  return (
    <AdminDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      cancelLabel={cancelLabel}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="title">{titleLabel}</Label>
        <Input
          id="title"
          value={titleValue}
          onChange={(e) => onTitleValueChange(e.target.value)}
          placeholder={titlePlaceholder}
        />
      </div>

      {children}
    </AdminDialogShell>
  )
}

