import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { MOBILE_ACTION_CHIP_CLASS as ACTION_CHIP_CLASS } from "@/components/mobile/chrome/mobile-control-recipes"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface MobileHomeCategoryPickerProps {
  categories: CategoryTreeNode[]
  activeCategorySlug: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPickCategory: (slug: string) => void
  onResetAll: () => void
  getCategoryLabel: (category: CategoryTreeNode) => string
  tV4: Translate
}

export function MobileHomeCategoryPicker({
  categories,
  activeCategorySlug,
  open,
  onOpenChange,
  onPickCategory,
  onResetAll,
  getCategoryLabel,
  tV4,
}: MobileHomeCategoryPickerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        data-testid="home-v4-category-picker"
        className="max-h-dialog overflow-hidden rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-border-subtle px-4 pr-14">
          <SheetTitle>{tV4("picker.title")}</SheetTitle>
          <SheetDescription>{tV4("picker.description")}</SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onResetAll()
              }}
              className={ACTION_CHIP_CLASS}
            >
              {tV4("actions.reset")}
            </button>
            <Link
              href="/categories"
              onClick={() => onOpenChange(false)}
              className={ACTION_CHIP_CLASS}
            >
              {tV4("actions.openCategories")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            {categories.map((category) => {
              const active = activeCategorySlug === category.slug
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onPickCategory(category.slug)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border-subtle bg-surface-subtle text-foreground"
                  )}
                >
                  <span className="truncate">{getCategoryLabel(category)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
