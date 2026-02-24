import * as React from "react"
import { ChevronRight as IconChevronRight } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "./product-form-modal.types"

interface ProductCategorySelectorProps {
  categories: Category[]
  value: string | undefined
  onChange: (id: string) => void
}

function findCategoryPath(
  categories: Category[],
  targetId: string,
  path: Category[] = []
): Category[] | null {
  for (const category of categories) {
    if (category.id === targetId) {
      return [...path, category]
    }
    if (category.children?.length) {
      const found = findCategoryPath(category.children, targetId, [...path, category])
      if (found) return found
    }
  }
  return null
}

export function ProductCategorySelector({
  categories,
  value,
  onChange,
}: ProductCategorySelectorProps) {
  const selectedPath = React.useMemo(
    () => (value ? findCategoryPath(categories, value) || [] : []),
    [categories, value]
  )

  const [rootCategoryId, setRootCategoryId] = React.useState<string>(selectedPath[0]?.id || "")
  const [leafCategoryId, setLeafCategoryId] = React.useState<string>(selectedPath[1]?.id || "")

  React.useEffect(() => {
    setRootCategoryId(selectedPath[0]?.id || "")
    setLeafCategoryId(selectedPath[1]?.id || "")
  }, [selectedPath])

  const rootCategories = categories
  const activeRoot = rootCategories.find((category) => category.id === rootCategoryId) ?? null
  const leafCategories = activeRoot?.children || []

  const handleRootChange = (id: string) => {
    setRootCategoryId(id)
    setLeafCategoryId("")

    const selectedRoot = rootCategories.find((entry) => entry.id === id)
    if (!selectedRoot?.children?.length) {
      onChange(id)
    }
  }

  const handleLeafChange = (id: string) => {
    setLeafCategoryId(id)
    onChange(id)
  }

  const breadcrumb = [
    rootCategoryId && rootCategories.find((category) => category.id === rootCategoryId)?.name,
    leafCategoryId && leafCategories.find((category) => category.id === leafCategoryId)?.name,
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          {breadcrumb.map((name, index) => (
            <React.Fragment key={`${name}-${index}`}>
              {index > 0 && <IconChevronRight className="size-3" />}
              <span className={index === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                {name}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="hidden sm:grid sm:grid-cols-2 gap-2">
        <Select value={rootCategoryId} onValueChange={handleRootChange}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={leafCategoryId}
          onValueChange={handleLeafChange}
          disabled={!rootCategoryId || leafCategories.length === 0}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Subcategory" />
          </SelectTrigger>
          <SelectContent>
            {leafCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sm:hidden space-y-2">
        <Select value={rootCategoryId} onValueChange={handleRootChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {rootCategoryId && leafCategories.length > 0 && (
          <Select value={leafCategoryId} onValueChange={handleLeafChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {leafCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
