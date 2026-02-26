"use client"

import { useCallback, useState } from "react"
import { LoaderCircle as Spinner, Sparkles as Sparkle } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useSellForm, useSellFormContext } from "../sell-form-provider"

type ListingTextGenerationResponse = {
  draft: {
    title: string
    description: string
    tags: string[]
  }
}

function buildAttributesPayload(
  attributes: Array<{ name: string; value: string }> | undefined,
): Record<string, string> | undefined {
  if (!attributes || attributes.length === 0) return undefined

  const payload = attributes
    .filter((item) => item.name.trim().length > 0 && item.value.trim().length > 0)
    .slice(0, 20)
    .reduce<Record<string, string>>((acc, item) => {
      acc[item.name.trim()] = item.value.trim()
      return acc
    }, {})

  return Object.keys(payload).length > 0 ? payload : undefined
}

export function AiListingTextGenerator() {
  const form = useSellForm()
  const { locale, aiAssistantEnabled } = useSellFormContext()
  const tSell = useTranslations("Sell")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const values = form.getValues()
      const categoryHint = values.categoryPath?.[values.categoryPath.length - 1]?.name
      const payload = {
        locale,
        categoryHint: categoryHint?.trim() ? categoryHint : undefined,
        condition: values.condition ?? undefined,
        brand: values.brandName?.trim() ? values.brandName : undefined,
        attributes: buildAttributesPayload(values.attributes),
      }

      const response = await fetch("/api/assistant/generate-listing-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as ListingTextGenerationResponse | { error?: string }
      if (!response.ok || !("draft" in data)) {
        const errorMessage = (data as { error?: unknown }).error
        const message =
          typeof errorMessage === "string" ? errorMessage : tSell("aiAssistant.textGeneration.errors.failed")
        throw new Error(message)
      }

      form.setValue("title", data.draft.title, { shouldDirty: true, shouldValidate: true })
      form.setValue("description", data.draft.description, { shouldDirty: true, shouldValidate: true })

      if (Array.isArray(data.draft.tags) && data.draft.tags.length > 0) {
        const existingTags = form.getValues("tags") ?? []
        const mergedTags = [...new Set([...existingTags, ...data.draft.tags])].slice(0, 10)
        form.setValue("tags", mergedTags, { shouldDirty: true })
      }

      toast.success(tSell("aiAssistant.textGeneration.toasts.generated"))
    } catch (error) {
      const fallbackMessage = tSell("aiAssistant.textGeneration.errors.failed")
      const message = error instanceof Error && error.message ? error.message : fallbackMessage
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [form, isLoading, locale, tSell])

  if (!aiAssistantEnabled) return null

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-2 border-dashed border-border"
      onClick={() => {
        void handleGenerate()
      }}
      disabled={isLoading}
    >
      {isLoading ? <Spinner className="size-4 animate-spin" /> : <Sparkle className="size-4" />}
      <span className="text-xs sm:text-sm">
        {isLoading ? tSell("aiAssistant.textGeneration.generating") : tSell("aiAssistant.textGeneration.generate")}
      </span>
    </Button>
  )
}
