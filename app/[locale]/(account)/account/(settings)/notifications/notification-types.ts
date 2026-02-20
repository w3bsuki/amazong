export type NotificationType =
  | "purchase"
  | "order_status"
  | "message"
  | "review"
  | "system"
  | "promotion"

export interface NotificationRow {
  id: string
  type: NotificationType
  title: string
  body: string | null
  data: Record<string, unknown> | null
  order_id: string | null
  product_id: string | null
  conversation_id: string | null
  is_read: boolean
  created_at: string
}
