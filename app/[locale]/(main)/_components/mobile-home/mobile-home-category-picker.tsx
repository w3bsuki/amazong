import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { MOBILE_ACTION_CHIP_CLASS as ACTION_CHIP_CLASS } from "@/components/mobile/chrome/mobile-control-recipes"
import { useTranslations } from "next-intl"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"

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
  const tCommon = useTranslations("Common")

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={tV4("picker.title")}
      closeLabel={tCommon("close")}
      contentAriaLabel={tV4("picker.title")}
      description={tV4("picker.description")}
      descriptionClassName="pt-0.5 text-xs text-muted-foreground"
      contentClassName="max-h-dialog lg:hidden"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
      dataTestId="home-v4-category-picker"
    >
      <DrawerBody className="px-inset py-3 pb-safe-max">
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
      </DrawerBody>
    </DrawerShell>
  )
}
