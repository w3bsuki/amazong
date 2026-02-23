import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { getCategoryName } from "@/lib/data/categories/display"
import { getCategoryIcon } from "@/components/shared/category-icons"

/** Icon circle — clean monochromatic brand style (accent bg + primary icon) */
function CategoryIconCircle({ slug }: { slug: string }) {
  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
      aria-hidden="true"
    >
      {getCategoryIcon(slug, { size: 20 })}
    </span>
  )
}

/** 2-col grid cell for a root category */
export function CategoryGridCell({
  category,
  locale,
  count,
  onClick,
}: {
  category: CategoryTreeNode
  locale: string
  count?: number | undefined
  onClick: () => void
}) {
  const name = getCategoryName(category, locale)
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5 text-left tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
    >
      <CategoryIconCircle slug={category.slug} />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold leading-tight text-foreground">
          {name}
        </span>
        {typeof count === "number" && (
          <span className="mt-0.5 block text-2xs text-muted-foreground">
            {count.toLocaleString(locale)}
          </span>
        )}
      </div>
    </button>
  )
}
