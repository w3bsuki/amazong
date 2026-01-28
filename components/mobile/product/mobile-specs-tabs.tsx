"use client"

// =============================================================================
// MOBILE SPECS TABS - Tabbed Specifications/Description View
// =============================================================================
// Mobile-optimized tabs for product details. Uses shadcn Tabs component.
// Follows the demo pattern of tabbed content for mobile UX.
// =============================================================================

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface SpecItem {
  label: string
  value: string | number | undefined | null
}

interface MobileSpecsTabsProps {
  specifications: SpecItem[]
  description: string | null
  /** Optional key features list */
  features?: string[]
  className?: string
}

/**
 * Mobile Specs Tabs
 * 
 * Tabbed interface for mobile product page:
 * - Specifications: Key-value pairs in a clean table
 * - Description: HTML description content
 * - Features: Optional bullet list of key features
 */
export function MobileSpecsTabs({
  specifications,
  description,
  features,
  className,
}: MobileSpecsTabsProps) {
  const t = useTranslations("Product")

  // Filter out specs with no value
  const validSpecs = specifications.filter(
    (spec) => spec.value !== undefined && spec.value !== null && spec.value !== ""
  )

  // Don't render if no content
  if (validSpecs.length === 0 && !description && (!features || features.length === 0)) {
    return null
  }

  return (
    <div className={cn("bg-surface-card", className)}>
      <Tabs defaultValue="specs" className="w-full gap-0">
        <TabsList className="w-full h-12 p-1 bg-surface-page rounded-none border-0 border-b border-border/50">
          <TabsTrigger 
            value="specs" 
            className="flex-1 h-full rounded-md text-text-muted-alt data-[state=active]:bg-surface-card data-[state=active]:text-text-strong border border-transparent data-[state=active]:border-border/60"
          >
            {t("specifications")}
          </TabsTrigger>
          <TabsTrigger 
            value="description" 
            className="flex-1 h-full rounded-md text-text-muted-alt data-[state=active]:bg-surface-card data-[state=active]:text-text-strong border border-transparent data-[state=active]:border-border/60"
          >
            {t("description")}
          </TabsTrigger>
          {features && features.length > 0 && (
            <TabsTrigger 
              value="features" 
              className="flex-1 h-full rounded-md text-text-muted-alt data-[state=active]:bg-surface-card data-[state=active]:text-text-strong border border-transparent data-[state=active]:border-border/60"
            >
              {t("features")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specs" className="mt-0 p-0">
          {validSpecs.length > 0 ? (
            <div className="divide-y divide-border/50">
              {validSpecs.map((spec, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex justify-between items-center px-4 py-3",
                    index % 2 === 1 && "bg-surface-subtle"
                  )}
                >
                  <span className="text-sm text-text-muted-alt">{spec.label}</span>
                  <span className="text-sm font-medium text-text-strong">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-text-muted-alt">
              {t("noSpecifications")}
            </div>
          )}
        </TabsContent>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-0 p-0">
          {description ? (
            <div 
              className="px-4 py-4 richtext"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <div className="px-4 py-8 text-center text-sm text-text-muted-alt">
              {t("noDescription")}
            </div>
          )}
        </TabsContent>

        {/* Features Tab (optional) */}
        {features && features.length > 0 && (
          <TabsContent value="features" className="mt-0 p-0">
            <ul className="px-4 py-4 space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="size-1.5 mt-1.5 rounded-full bg-text-strong flex-none" />
                  <span className="text-text-default">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
