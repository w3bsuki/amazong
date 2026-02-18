export interface AdminDoc {
  id: string
  title: string
  slug: string
  content: string | null
  category: string
  status: string
  author_id: string | null
  locale: string
  created_at: string | null
  updated_at: string | null
}

export type DocSavePayload = Partial<AdminDoc> & { id?: string }
