"use client";

import { useCallback, useMemo, useState } from "react";
import { Sparkle, SpinnerGap, Check, WarningCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { conditionOptions } from "@/lib/sell/schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import type { Category } from "../../_lib/types";

type SuggestionResponse = {
  title: string | null;
  description: string | null;
  condition:
    | "new-with-tags"
    | "new-without-tags"
    | "used-like-new"
    | "used-excellent"
    | "used-good"
    | "used-fair"
    | null;
  category:
    | {
        slug: string | null;
        name: string | null;
        rationale: string | null;
      }
    | null;
  price: {
    suggested: number | null;
    low: number | null;
    high: number | null;
    currency: "BGN" | "EUR" | "USD" | null;
    rationale: string | null;
  };
  attributes: Array<{ name: string; value: string; rationale: string | null }>;
  tags: string[];
  questions: string[];
  warnings: string[];
};

type FlatCategory = {
  id: string;
  slug: string;
  name: string;
  name_bg?: string | null;
  path: Array<{ id: string; name: string; slug: string }>;
};

const EMPTY_IMAGES: Array<{ url: string }> = [];

function flattenCategories(categories: Category[], locale: string): FlatCategory[] {
  const out: FlatCategory[] = [];

  function walk(node: Category, path: FlatCategory["path"]) {
    const name = locale === "bg" && node.name_bg ? node.name_bg : node.name;
    const nextPath = [...path, { id: node.id, name, slug: node.slug }];
    out.push({ id: node.id, slug: node.slug, name: node.name, name_bg: node.name_bg ?? null, path: nextPath });

    for (const child of node.children ?? []) {
      walk(child, nextPath);
    }
  }

  for (const c of categories) walk(c, []);
  return out;
}

function scoreCategoryMatch(target: string, cat: FlatCategory): number {
  const t = target.trim().toLowerCase();
  if (!t) return 0;

  const slug = cat.slug.toLowerCase();
  const nameEn = cat.name.toLowerCase();
  const nameBg = (cat.name_bg ?? "").toLowerCase();

  if (t === slug) return 100;
  if (t === nameEn || (nameBg && t === nameBg)) return 90;

  const hay = `${slug} ${nameEn} ${nameBg} ${cat.path.map((p) => p.name.toLowerCase()).join(" ")}`;
  if (hay.includes(t)) return 70;

  // token overlap
  const tokens = t.split(/\s+|>|/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const hits = tokens.filter((tok) => tok.length >= 3 && hay.includes(tok)).length;
  return Math.min(60, hits * 10);
}

/**
 * AiListingAssistant - AI-powered form suggestions from product images.
 * Uses context pattern (useSellForm/useSellFormContext) instead of prop drilling.
 * 
 * @example
 * ```tsx
 * // Inside SellFormProvider
 * <AiListingAssistant />
 * ```
 */
export function AiListingAssistant() {
  // Use context instead of prop drilling
  const form = useSellForm();
  const { categories, locale } = useSellFormContext();
  const tSell = useTranslations("Sell")
  const tCommon = useTranslations("Common")
  
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

  const showPanel = enabled;

  const matchedCategory = suggestions ? resolveSuggestedCategory(suggestions) : null;
  const conditionLabel = suggestions?.condition
    ? (() => {
        const option = conditionOptions.find((c) => c.value === suggestions.condition)
        if (option) return tSell(option.labelKey as never)
        return suggestions.condition
      })()
    : null;

  // Minimal: just a single button that generates suggestions
  // No card wrapper, no toggle - just action
  if (!showPanel) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setEnabled(true);
          if (canGenerate) generate();
        }}
        disabled={images.length === 0}
        className="w-full h-11 gap-2 border-dashed border-border"
       >
         <Sparkle className="size-4" weight="fill" />
         <span className="text-sm">
           {tSell("aiAssistant.label")}
         </span>
         {images.length === 0 && (
           <span className="text-xs text-muted-foreground ml-1">
             ({tSell("aiAssistant.addPhotoFirst")})
           </span>
         )}
       </Button>
     );
  }

  // Expanded: show results inline
  return (
    <div className="space-y-3">
      {/* Header with close */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <Sparkle className="size-4 text-primary" weight="fill" />
           <span className="text-sm font-medium">{tSell("aiAssistant.label")}</span>
         </div>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => { setEnabled(false); setSuggestions(null); }}
           className="h-8 px-2 text-muted-foreground"
         >
           {tCommon("close")}
         </Button>
       </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generate}
          disabled={!canGenerate}
          className="h-9 gap-1.5"
        >
           {status === "loading" ? (
             <SpinnerGap className="size-4 animate-spin" />
           ) : (
             <Sparkle className="size-4" />
           )}
           {status === "loading" ? tSell("aiAssistant.generating") : tSell("aiAssistant.generate")}
         </Button>

         {suggestions && (
           <Button
             type="button"
             variant="secondary"
             size="sm"
             onClick={() => applyAll(suggestions)}
             className="h-9 gap-1.5"
           >
             <Check className="size-4" />
             {tSell("aiAssistant.applyAll")}
           </Button>
         )}
       </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <WarningCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Results - compact list */}
      {suggestions && (() => {
        const title = suggestions.title
        const condition = suggestions.condition
        const suggestedPrice = typeof suggestions.price.suggested === "number" && Number.isFinite(suggestions.price.suggested)
          ? suggestions.price.suggested
          : null

        return (
          <div className="space-y-2">
            {title && (
              <button
                 type="button"
                 onClick={() => {
                   form.setValue("title", title, { shouldValidate: true, shouldDirty: true });
                   toast.success(tSell("aiAssistant.toasts.titleApplied"));
                 }}
                 className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-left hover:bg-accent"
               >
                 <div className="min-w-0">
                   <div className="text-xs text-muted-foreground">{tSell("fields.title.label")}</div>
                   <div className="text-sm truncate">{title}</div>
                 </div>
                 <Check className="size-4 text-muted-foreground shrink-0" />
               </button>
            )}

            {matchedCategory && (
              <button
                type="button"
                 onClick={() => {
                   form.setValue("categoryId", matchedCategory.id, { shouldValidate: true, shouldDirty: true });
                   form.setValue("categoryPath", matchedCategory.path, { shouldDirty: true });
                   toast.success(tSell("aiAssistant.toasts.categoryApplied"));
                 }}
                 className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-left hover:bg-accent"
               >
                 <div className="min-w-0">
                   <div className="text-xs text-muted-foreground">{tSell("review.labels.category")}</div>
                   <div className="text-sm truncate">{matchedCategory.path.map(p => p.name).join(" > ")}</div>
                 </div>
                 <Check className="size-4 text-muted-foreground shrink-0" />
               </button>
            )}

            {condition && (
              <button
                 type="button"
                 onClick={() => {
                   form.setValue("condition", condition, { shouldValidate: true, shouldDirty: true });
                   toast.success(tSell("aiAssistant.toasts.conditionApplied"));
                 }}
                 className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-left hover:bg-accent"
               >
                 <div className="min-w-0">
                   <div className="text-xs text-muted-foreground">{tSell("steps.details.conditionLabel")}</div>
                   <div className="text-sm">{conditionLabel}</div>
                 </div>
                 <Check className="size-4 text-muted-foreground shrink-0" />
               </button>
            )}

            {suggestedPrice !== null && (
              <button
                 type="button"
                 onClick={() => {
                   form.setValue("price", suggestedPrice.toFixed(2), { shouldValidate: true, shouldDirty: true });
                   toast.success(tSell("aiAssistant.toasts.priceApplied"));
                 }}
                 className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-left hover:bg-accent"
               >
                 <div className="min-w-0">
                   <div className="text-xs text-muted-foreground">{tSell("review.labels.price")}</div>
                   <div className="text-sm">{suggestedPrice.toFixed(2)} {suggestions.price.currency ?? currency}</div>
                 </div>
                 <Check className="size-4 text-muted-foreground shrink-0" />
               </button>
            )}
          </div>
        )
      })()}
    </div>
  );
}
