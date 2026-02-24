import type { Category } from "../../_lib/types"

export function findCategoryById(categories: Category[], categoryId: string): Category | null {
  const stack = [...categories]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue
    if (current.id === categoryId) return current
    if (current.children?.length) {
      for (const child of current.children) stack.push(child)
    }
  }
  return null
}
