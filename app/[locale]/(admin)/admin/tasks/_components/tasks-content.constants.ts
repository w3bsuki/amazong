import type { TaskStatusColumn } from "./types"

export const STATUS_COLUMNS: TaskStatusColumn[] = [
  { id: "todo", labelKey: "columns.todo", color: "bg-muted" },
  { id: "in_progress", labelKey: "columns.in_progress", color: "bg-admin-in-progress-bg" },
  { id: "review", labelKey: "columns.review", color: "bg-admin-review-bg" },
  { id: "done", labelKey: "columns.done", color: "bg-admin-published-bg" },
]

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-admin-urgent text-badge-fg-on-solid",
  high: "bg-admin-high text-badge-fg-on-solid",
  medium: "bg-admin-medium text-foreground",
  low: "bg-muted text-muted-foreground",
}

export const PRIORITY_ORDER: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}
