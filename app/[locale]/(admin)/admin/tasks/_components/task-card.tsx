import { Calendar as IconCalendar } from "lucide-react"
import { useTranslations } from "next-intl"

import { AdminCardHoverActions } from "../../_components/admin-card-hover-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { PRIORITY_COLORS } from "./tasks-content.constants"
import type { AdminTask, TaskStatusOption } from "./types"

interface TaskCardProps {
  task: AdminTask
  statusOptions: TaskStatusOption[]
  onStatusChange: (id: string, status: string) => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({
  task,
  statusOptions,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const t = useTranslations("AdminTasks")

  return (
    <Card className="group">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Badge className={cn("text-xs shrink-0", PRIORITY_COLORS[task.priority])}>
            {t(`priority.${task.priority}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        {task.description ? (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        ) : null}
        {task.due_date ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <IconCalendar className="size-3" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <Select
            value={task.status}
            onValueChange={(value) => onStatusChange(task.id, value)}
          >
            <SelectTrigger className="h-7 text-xs w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
