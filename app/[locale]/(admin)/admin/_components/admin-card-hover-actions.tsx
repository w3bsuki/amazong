import { Pencil as IconEdit, Trash as IconTrash } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AdminCardHoverActionsProps {
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

export function AdminCardHoverActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: AdminCardHoverActionsProps) {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="size-7 min-h-11 min-w-11"
        onClick={onEdit}
        aria-label={editLabel}
        title={editLabel}
      >
        <IconEdit className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 min-h-11 min-w-11"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <IconTrash className="size-3.5" />
      </Button>
    </div>
  )
}
