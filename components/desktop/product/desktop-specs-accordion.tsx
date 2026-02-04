"use client"

// =============================================================================
// DESKTOP SPECS ACCORDION - Expandable Specifications
// =============================================================================
// Based on V2 demo design.
// Key features:
// - Key Features list (checkmark style)
// - Quick Specs table (label-value pairs)
// - Full Specifications table (2-column striped)
// - Expandable description
// =============================================================================

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ItemSpecificDetail } from "@/lib/view-models/product-page"

interface DesktopSpecsAccordionProps {
  /** Full list of specifications */
  specifications: ItemSpecificDetail[]
  /** Product description */
  description?: string | null
  /** Number of specs to show as "key features" */
  keyFeaturesCount?: number
  /** Number of specs to show as "quick specs" */
  quickSpecsCount?: number
  className?: string
}

export function DesktopSpecsAccordion({
  specifications,
  description,
  keyFeaturesCount = 5,
  quickSpecsCount = 5,
  className,
}: DesktopSpecsAccordionProps) {
  const t = useTranslations("Product")
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const getSpecLabel = (key: string): string => {
    if (key === "condition") {
      return t("conditionLabel").replace(/:$/, "")
    }

    return key
      .replaceAll("_", " ")
      .replaceAll(/\b\w/g, (c) => c.toUpperCase())
  }

  const keyFeatures = specifications.slice(0, keyFeaturesCount)
  const quickSpecs = specifications.slice(
    keyFeaturesCount,
    keyFeaturesCount + quickSpecsCount
  )
  const hasMoreSpecs = specifications.length > keyFeaturesCount + quickSpecsCount

  // Description truncation
  const descriptionLimit = 300
  const shouldTruncateDescription =
    description && description.length > descriptionLimit

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Features + Quick Specs Grid */}
      {specifications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-subtle p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                {t("keyFeatures")}
              </h3>
              <ul className="space-y-2">
                {keyFeatures.map((spec) => (
                  <li
                    key={spec.key}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                    <span className="text-foreground text-xs">
                      <span className="text-muted-foreground">
                        {getSpecLabel(spec.key)}:
                      </span>{" "}
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Specs */}
          {quickSpecs.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-subtle p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                {t("quickSpecs")}
              </h3>
              <div className="space-y-1.5">
                {quickSpecs.map((spec) => (
                  <div
                    key={spec.key}
                    className="flex items-center justify-between text-xs py-1 border-b border-border-subtle last:border-0"
                  >
                    <span className="text-muted-foreground">{getSpecLabel(spec.key)}</span>
                    <span className="font-medium text-foreground">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description Section */}
      {description && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {t("description")}
          </h3>
          <div className="richtext whitespace-pre-line">
            {showFullDescription || !shouldTruncateDescription
              ? description
              : `${description.slice(0, descriptionLimit)}...`}
          </div>
          {shouldTruncateDescription && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground hover:text-foreground p-0 h-auto"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? (
                <>
                  {t("showLess")} <ChevronUp className="ml-1 size-3.5" />
                </>
              ) : (
                <>
                  {t("readMore")} <ChevronDown className="ml-1 size-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Full Specifications Table */}
      {specifications.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {t("fullSpecifications")}
            </h3>
            {hasMoreSpecs && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showAllSpecs ? (
                  <>
                    {t("showLess")} <ChevronUp className="ml-1 size-3.5" />
                  </>
                ) : (
                  <>
                    {t("showAll")} <ChevronDown className="ml-1 size-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {(showAllSpecs
              ? specifications
              : specifications.slice(0, keyFeaturesCount + quickSpecsCount)
            ).map((spec, i) => (
              <div
                key={spec.key}
                className={cn(
                  "flex items-center justify-between px-6 py-3 text-sm",
                  i % 2 === 0 ? "bg-card" : "bg-surface-subtle",
                  "border-b border-border-subtle last:border-0"
                )}
              >
                <span className="text-muted-foreground">{getSpecLabel(spec.key)}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
