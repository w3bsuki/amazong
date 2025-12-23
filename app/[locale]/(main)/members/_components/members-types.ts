export type MembersFilter = "all" | "sellers" | "buyers" | "business"

export type MembersSort = "rating" | "sales" | "purchases" | "newest" | "active"

export interface MembersSearchParams {
  filter?: MembersFilter
  sort?: MembersSort
  page?: string
  q?: string
}
