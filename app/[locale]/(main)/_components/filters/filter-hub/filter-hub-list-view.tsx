import { ChevronRight as CaretRight } from "lucide-react"

import type { FilterSection } from "./types"

interface FilterHubListViewProps {
  filterSections: FilterSection[]
  onSelectSection: (sectionId: string) => void
  getSelectedSummary: (section: FilterSection) => string | null
}

export function FilterHubListView({
  filterSections,
  onSelectSection,
  getSelectedSummary,
}: FilterHubListViewProps) {
  return (
    <div className="divide-y divide-border">
      {filterSections.map((section) => {
        const summary = getSelectedSummary(section)
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            className="w-full h-11 px-inset flex items-center justify-between text-left transition-colors active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <div className="flex flex-col">
              <span className="text-sm text-foreground">{section.label}</span>
              {summary && (
                <span className="text-xs text-muted-foreground truncate">{summary}</span>
              )}
            </div>
            <CaretRight size={16} className="text-muted-foreground" />
          </button>
        )
      })}
    </div>
  )
}
