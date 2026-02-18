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

export function ProductCategorySelector({
  categories,
  value,
  onChange,
}: ProductCategorySelectorProps) {
  const findCategoryPath = React.useCallback((cats: Category[], targetId: string, path: Category[] = []): Category[] | null => {
    for (const cat of cats) {
      if (cat.id === targetId) {
        return [...path, cat]
      }
      if (cat.children?.length) {
        const found = findCategoryPath(cat.children, targetId, [...path, cat])
        if (found) return found
      }
    }
    return null
  }, [])

  const selectedPath = value ? findCategoryPath(categories, value) || [] : []

  const [l0, setL0] = React.useState<string>(selectedPath[0]?.id || "")
  const [l1, setL1] = React.useState<string>(selectedPath[1]?.id || "")
  const [l2, setL2] = React.useState<string>(selectedPath[2]?.id || "")
  const [l3, setL3] = React.useState<string>(selectedPath[3]?.id || "")

  const l0Categories = categories
  const l1Categories = l0 ? l0Categories.find((cat) => cat.id === l0)?.children || [] : []
  const l2Categories = l1 ? l1Categories.find((cat) => cat.id === l1)?.children || [] : []
  const l3Categories = l2 ? l2Categories.find((cat) => cat.id === l2)?.children || [] : []

  const handleL0Change = (id: string) => {
    setL0(id)
    setL1("")
    setL2("")
    setL3("")
    const cat = l0Categories.find((entry) => entry.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL1Change = (id: string) => {
    setL1(id)
    setL2("")
    setL3("")
    const cat = l1Categories.find((entry) => entry.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL2Change = (id: string) => {
    setL2(id)
    setL3("")
    const cat = l2Categories.find((entry) => entry.id === id)
    if (!cat?.children?.length) onChange(id)
  }

  const handleL3Change = (id: string) => {
    setL3(id)
    onChange(id)
  }

  const breadcrumb = [
    l0 && l0Categories.find((cat) => cat.id === l0)?.name,
    l1 && l1Categories.find((cat) => cat.id === l1)?.name,
    l2 && l2Categories.find((cat) => cat.id === l2)?.name,
    l3 && l3Categories.find((cat) => cat.id === l3)?.name,
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          {breadcrumb.map((name, index) => (
            <React.Fragment key={index}>
              {index > 0 && <IconChevronRight className="size-3" />}
              <span className={index === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                {name}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Select value={l0} onValueChange={handleL0Change}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {l0Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l1} onValueChange={handleL1Change} disabled={!l0 || l1Categories.length === 0}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Subcategory" />
          </SelectTrigger>
          <SelectContent>
            {l1Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l2} onValueChange={handleL2Change} disabled={!l1 || l2Categories.length === 0}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {l2Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={l3} onValueChange={handleL3Change} disabled={!l2 || l3Categories.length === 0}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Subtype" />
          </SelectTrigger>
          <SelectContent>
            {l3Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sm:hidden space-y-2">
        <Select value={l0} onValueChange={handleL0Change}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {l0Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {l0 && l1Categories.length > 0 && (
          <Select value={l1} onValueChange={handleL1Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {l1Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {l1 && l2Categories.length > 0 && (
          <Select value={l2} onValueChange={handleL2Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {l2Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {l2 && l3Categories.length > 0 && (
          <Select value={l3} onValueChange={handleL3Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select subtype" />
            </SelectTrigger>
            <SelectContent>
              {l3Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
