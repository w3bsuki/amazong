import { Pin as IconPin, Pin as IconPinFilled } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { AdminCardHoverActions } from "../../_components/admin-card-hover-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { AdminNote } from "./types"

interface NoteCardProps {
  note: AdminNote
  onTogglePin: () => void
  onEdit: () => void
  onDelete: () => void
}

export function NoteCard({ note, onTogglePin, onEdit, onDelete }: NoteCardProps) {
  const t = useTranslations("AdminNotes")
  const locale = useLocale()

  return (
    <Card className={cn("group", note.is_pinned && "border-selected-border bg-hover")}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{note.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 min-h-11 min-w-11 shrink-0"
            aria-label={note.is_pinned ? t("aria.unpin") : t("aria.pin")}
            title={note.is_pinned ? t("aria.unpin") : t("aria.pin")}
            onClick={onTogglePin}
          >
            {note.is_pinned ? (
              <IconPinFilled className="size-4 text-primary" />
            ) : (
              <IconPin className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {note.content ? (
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        ) : null}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {note.updated_at ? new Date(note.updated_at).toLocaleDateString(locale) : t("dateEmpty")}
          </span>
          <AdminCardHoverActions
            onEdit={onEdit}
            onDelete={onDelete}
            editLabel={t("aria.edit")}
            deleteLabel={t("aria.delete")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
