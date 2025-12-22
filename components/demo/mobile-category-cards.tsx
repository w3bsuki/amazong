import { cn } from "@/lib/utils"
import { CategoryBrowseCard } from "@/components/category/category-browse-card"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

export type DemoMobileCategory = {
  id: string
  name: string
  name_bg: string
  slug: string
  icon: PhosphorIcon
}

export function DemoMobileCategoryCards({
  categories,
  locale,
  className,
}: {
  categories: DemoMobileCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  const getName = (cat: DemoMobileCategory) => (locale === "bg" ? cat.name_bg : cat.name)

  return (
    <div className={cn("px-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <CategoryBrowseCard
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              title={getName(cat)}
              icon={Icon}
              meta="Shop"
              className="min-h-touch-lg"
              iconClassName="text-link"
            />
          )
        })}
      </div>
    </div>
  )
}
