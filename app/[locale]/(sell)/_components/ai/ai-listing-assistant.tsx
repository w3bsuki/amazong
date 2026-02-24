"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { conditionOptions } from "@/lib/sell/schema";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { AiListingAssistantView } from "./ai-listing-assistant-view";
import {
  EMPTY_IMAGES,
  flattenCategories,
  scoreCategoryMatch,
  type FlatCategory,
  type SuggestionResponse,
} from "./ai-listing-assistant-utils";

export function AiListingAssistant() {
  const form = useSellForm();
  const { categories, locale } = useSellFormContext();
  const tSell = useTranslations("Sell");
  const tCommon = useTranslations("Common");

  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);

  const watchedImages = form.watch("images");
  const images = watchedImages ?? EMPTY_IMAGES;
  const currency = form.watch("currency") ?? "BGN";

  const flatCategories = useMemo(() => flattenCategories(categories, locale), [categories, locale]);
  const canGenerate = images.length > 0 && status !== "loading";

  const resolveSuggestedCategory = useCallback(
    (s: SuggestionResponse): FlatCategory | null => {
      const slug = s.category?.slug ?? "";
      const name = s.category?.name ?? "";
      const target = slug || name;
      if (!target) return null;

      let best: { cat: FlatCategory; score: number } | null = null;
      for (const cat of flatCategories) {
        const score = scoreCategoryMatch(target, cat);
        if (score <= 0) continue;
        if (!best || score > best.score) best = { cat, score };
      }

      if (!best || best.score < 50) return null;
      return best.cat;
    },
    [flatCategories]
  );

  const applyAll = useCallback(
    (s: SuggestionResponse) => {
      let applied = 0;

      if (s.title) {
        form.setValue("title", s.title, { shouldValidate: true, shouldDirty: true });
        applied += 1;
      }

      if (s.description) {
        form.setValue("description", s.description, { shouldValidate: true, shouldDirty: true });
        applied += 1;
      }

      if (s.condition) {
        form.setValue("condition", s.condition, { shouldValidate: true, shouldDirty: true });
        applied += 1;
      }

      if (typeof s.price.suggested === "number" && Number.isFinite(s.price.suggested)) {
        form.setValue("price", s.price.suggested.toFixed(2), { shouldValidate: true, shouldDirty: true });
        applied += 1;
      }

      const matchedCategory = resolveSuggestedCategory(s);
      if (matchedCategory) {
        form.setValue("categoryId", matchedCategory.id, { shouldValidate: true, shouldDirty: true });
        form.setValue("categoryPath", matchedCategory.path, { shouldDirty: true });
        applied += 1;
      }

      if (Array.isArray(s.tags) && s.tags.length > 0) {
        const existing = form.getValues("tags") ?? [];
        const merged = [...new Set([...existing, ...s.tags])].slice(0, 10);
        form.setValue("tags", merged, { shouldDirty: true });
        applied += 1;
      }

      if (Array.isArray(s.attributes) && s.attributes.length > 0) {
        const existing = form.getValues("attributes") ?? [];
        const existingKeys = new Set(existing.map((a) => `${a.name}`.toLowerCase()));

        const additions = s.attributes
          .filter((a) => a.name && a.value)
          .filter((a) => !existingKeys.has(a.name.toLowerCase()))
          .slice(0, 12)
          .map((a) => ({
            attributeId: null,
            name: a.name,
            value: a.value,
            isCustom: true,
          }));

        if (additions.length > 0) {
          form.setValue("attributes", [...existing, ...additions], { shouldDirty: true });
          applied += 1;
        }
      }

      if (applied > 0) {
        toast.success(tSell("aiAssistant.toasts.applied"));
      } else {
        toast.message(tSell("aiAssistant.toasts.nothingToApply"));
      }
    },
    [form, resolveSuggestedCategory, tSell]
  );

  const generate = useCallback(async () => {
    if (!canGenerate) return;

    setStatus("loading");
    setError(null);

    try {
      const payload = {
        locale,
        currency,
        images: images.slice(0, 4).map((img) => ({ url: img.url })),
        context: {
          title: form.getValues("title") || "",
          description: form.getValues("description") || "",
          condition: form.getValues("condition") || "",
        },
      };

      const res = await fetch("/api/ai/listing-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as SuggestionResponse | { error?: string };
      if (!res.ok) {
        const errorMessage =
          typeof (data as { error?: unknown }).error === "string"
            ? (data as { error?: string }).error
            : undefined;
        throw new Error(errorMessage || tSell("aiAssistant.errors.generateFailed"));
      }

      setSuggestions(data as SuggestionResponse);
      setStatus("ready");
      toast.success(tSell("aiAssistant.toasts.ready"));
    } catch (e) {
      const message = e instanceof Error ? e.message : tSell("aiAssistant.errors.generateFailed");
      setError(message);
      setStatus("error");
    }
  }, [canGenerate, currency, form, images, locale, tSell]);

  const matchedCategory = suggestions ? resolveSuggestedCategory(suggestions) : null;
  const conditionLabel = suggestions?.condition
    ? (() => {
        const option = conditionOptions.find((c) => c.value === suggestions.condition);
        if (option) return tSell(option.labelKey as never);
        return suggestions.condition;
      })()
    : null;

  return (
    <AiListingAssistantView
      enabled={enabled}
      imagesCount={images.length}
      canGenerate={canGenerate}
      status={status}
      error={error}
      suggestions={suggestions}
      matchedCategory={matchedCategory}
      conditionDisplayLabel={conditionLabel}
      fallbackCurrency={currency}
      labels={{
        assistantLabel: tSell("aiAssistant.label"),
        addPhotoFirst: tSell("aiAssistant.addPhotoFirst"),
        close: tCommon("close"),
        generating: tSell("aiAssistant.generating"),
        generate: tSell("aiAssistant.generate"),
        applyAll: tSell("aiAssistant.applyAll"),
        titleField: tSell("fields.title.label"),
        categoryField: tSell("review.labels.category"),
        conditionField: tSell("steps.details.conditionLabel"),
        priceField: tSell("review.labels.price"),
      }}
      onEnableAndGenerate={() => {
        setEnabled(true);
        if (canGenerate) generate();
      }}
      onClose={() => {
        setEnabled(false);
        setSuggestions(null);
      }}
      onGenerate={generate}
      onApplyAll={() => {
        if (!suggestions) return;
        applyAll(suggestions);
      }}
      onApplyTitle={(title) => {
        form.setValue("title", title, { shouldValidate: true, shouldDirty: true });
        toast.success(tSell("aiAssistant.toasts.titleApplied"));
      }}
      onApplyCategory={(category) => {
        form.setValue("categoryId", category.id, { shouldValidate: true, shouldDirty: true });
        form.setValue("categoryPath", category.path, { shouldDirty: true });
        toast.success(tSell("aiAssistant.toasts.categoryApplied"));
      }}
      onApplyCondition={(condition) => {
        form.setValue("condition", condition, { shouldValidate: true, shouldDirty: true });
        toast.success(tSell("aiAssistant.toasts.conditionApplied"));
      }}
      onApplyPrice={(price) => {
        form.setValue("price", price.toFixed(2), { shouldValidate: true, shouldDirty: true });
        toast.success(tSell("aiAssistant.toasts.priceApplied"));
      }}
    />
  );
}
