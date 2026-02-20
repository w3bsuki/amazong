import * as React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { AdminDialogWithTitleField } from "../../_components/admin-dialog-with-title-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type { AdminTask, TaskSavePayload } from "./types"

interface TaskDialogProps {
  task: AdminTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: TaskSavePayload) => void
}

export function TaskDialog({ task, open, onOpenChange, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState(task?.priority || "medium")
  const [dueDate, setDueDate] = useState(task?.due_date || "")
  const t = useTranslations("AdminTasks")

  React.useEffect(() => {
    if (open) {
      setTitle(task?.title || "")
      setDescription(task?.description || "")
      setPriority(task?.priority || "medium")
      setDueDate(task?.due_date || "")
    }
  }, [open, task])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("toasts.titleRequired"))
      return
    }

    onSave({
      ...(task?.id ? { id: task.id } : {}),
      title,
      description: description || null,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <AdminDialogWithTitleField
      open={open}
      onOpenChange={onOpenChange}
      title={task ? t("dialog.titleEdit") : t("dialog.titleNew")}
      cancelLabel={t("buttons.cancel")}
      submitLabel={task ? t("buttons.saveChanges") : t("buttons.createTask")}
      onSubmit={handleSubmit}
      titleLabel={t("labels.title")}
      titlePlaceholder={t("placeholders.title")}
      titleValue={title}
      onTitleValueChange={setTitle}
    >
      <div className="space-y-2">
        <Label htmlFor="description">{t("labels.description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("placeholders.description")}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("labels.priority")}</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">{t("priority.urgent")}</SelectItem>
              <SelectItem value="high">{t("priority.high")}</SelectItem>
              <SelectItem value="medium">{t("priority.medium")}</SelectItem>
              <SelectItem value="low">{t("priority.low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">{t("labels.dueDate")}</Label>
          <Input
            id="due_date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </AdminDialogWithTitleField>
  )
}
