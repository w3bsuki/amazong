import * as React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { AdminDialogShell } from "../../_components/admin-dialog-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { AdminNote, NoteSavePayload } from "./types"

interface NoteDialogProps {
  note: AdminNote | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: NoteSavePayload) => void
}

export function NoteDialog({ note, open, onOpenChange, onSave }: NoteDialogProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const t = useTranslations("AdminNotes")

  React.useEffect(() => {
    if (open) {
      setTitle(note?.title || "")
      setContent(note?.content || "")
    }
  }, [open, note])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("toasts.titleRequired"))
      return
    }

    onSave({
      ...(note?.id ? { id: note.id } : {}),
      title,
      content: content || null,
    })
  }

  return (
    <AdminDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={note ? t("dialog.titleEdit") : t("dialog.titleNew")}
      cancelLabel={t("buttons.cancel")}
      submitLabel={note ? t("buttons.saveChanges") : t("buttons.createNote")}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="title">{t("labels.title")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("placeholders.title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t("labels.content")}</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("placeholders.content")}
          rows={8}
        />
      </div>
    </AdminDialogShell>
  )
}
