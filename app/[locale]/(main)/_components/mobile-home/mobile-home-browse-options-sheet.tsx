import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"

interface MobileHomeBrowseOptionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  closeLabel: string
  loadingLabel: string
  allLabel: ReactNode
  options: CategoryTreeNode[]
  isLoading: boolean
  onSelectAll: () => void
  onSelectOption: (slug: string) => void
  getOptionLabel: (option: CategoryTreeNode) => string
}

export function MobileHomeBrowseOptionsSheet({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  loadingLabel,
  allLabel,
  options,
  isLoading,
  onSelectAll,
  onSelectOption,
  getOptionLabel,
}: MobileHomeBrowseOptionsSheetProps) {
  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      closeLabel={closeLabel}
      contentAriaLabel={title}
      description={description}
      headerLayout="centered"
      dataTestId="home-v4-browse-options-sheet"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
      closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
      closeIconSize={18}
      contentClassName="max-h-dialog"
    >
      <DrawerBody className="px-inset py-3" noDrag>
        <button
          type="button"
          onClick={onSelectAll}
          data-testid="home-v4-browse-options-all"
          className="inline-flex w-full min-h-(--control-default) items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
        >
          {allLabel}
        </button>

        <div className="mt-3 grid gap-2">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-secondary px-3 py-3 text-sm text-muted-foreground">
              {loadingLabel}
            </div>
          ) : (
            options.map((child) => (
              <button
                key={child.slug}
                type="button"
                onClick={() => onSelectOption(child.slug)}
                data-testid={`home-v4-browse-option-${child.slug}`}
                className="inline-flex w-full min-h-(--control-default) items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
              >
                <span className="truncate">{getOptionLabel(child)}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            ))
          )}
        </div>
      </DrawerBody>
    </DrawerShell>
  )
}

