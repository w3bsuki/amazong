import { Check, LoaderCircle as SpinnerGap, Sparkles as Sparkle, CircleAlert as WarningCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { FlatCategory, SuggestionResponse } from "./ai-listing-assistant-utils";

type Status = "idle" | "loading" | "ready" | "error";

type ViewLabels = {
  assistantLabel: string;
  addPhotoFirst: string;
  close: string;
  generating: string;
  generate: string;
  applyAll: string;
  titleField: string;
  categoryField: string;
  conditionField: string;
  priceField: string;
};

type AiListingAssistantViewProps = {
  enabled: boolean;
  imagesCount: number;
  canGenerate: boolean;
  status: Status;
  error: string | null;
  suggestions: SuggestionResponse | null;
  matchedCategory: FlatCategory | null;
  conditionDisplayLabel: string | null;
  fallbackCurrency: string;
  labels: ViewLabels;
  onEnableAndGenerate: () => void;
  onClose: () => void;
  onGenerate: () => void;
  onApplyAll: () => void;
  onApplyTitle: (title: string) => void;
  onApplyCategory: (category: FlatCategory) => void;
  onApplyCondition: (condition: NonNullable<SuggestionResponse["condition"]>) => void;
  onApplyPrice: (price: number) => void;
};

function SuggestionButton({
  fieldLabel,
  value,
  onClick,
}: {
  fieldLabel: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-left hover:bg-accent"
    >
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{fieldLabel}</div>
        <div className="text-sm truncate">{value}</div>
      </div>
      <Check className="size-4 text-muted-foreground shrink-0" />
    </button>
  );
}

export function AiListingAssistantView({
  enabled,
  imagesCount,
  canGenerate,
  status,
  error,
  suggestions,
  matchedCategory,
  conditionDisplayLabel,
  fallbackCurrency,
  labels,
  onEnableAndGenerate,
  onClose,
  onGenerate,
  onApplyAll,
  onApplyTitle,
  onApplyCategory,
  onApplyCondition,
  onApplyPrice,
}: AiListingAssistantViewProps) {
  if (!enabled) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onEnableAndGenerate}
        disabled={imagesCount === 0}
        className="w-full h-11 gap-2 border-dashed border-border"
      >
        <Sparkle className="size-4" />
        <span className="text-sm">{labels.assistantLabel}</span>
        {imagesCount === 0 ? (
          <span className="text-xs text-muted-foreground ml-1">({labels.addPhotoFirst})</span>
        ) : null}
      </Button>
    );
  }

  const title = suggestions?.title ?? null;
  const condition = suggestions?.condition ?? null;
  const suggestedPrice =
    typeof suggestions?.price.suggested === "number" && Number.isFinite(suggestions.price.suggested)
      ? suggestions.price.suggested
      : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="size-4 text-primary" />
          <span className="text-sm font-medium">{labels.assistantLabel}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 px-2 text-muted-foreground"
        >
          {labels.close}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="h-9 gap-1.5"
        >
          {status === "loading" ? (
            <SpinnerGap className="size-4 animate-spin" />
          ) : (
            <Sparkle className="size-4" />
          )}
          {status === "loading" ? labels.generating : labels.generate}
        </Button>

        {suggestions ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onApplyAll}
            className="h-9 gap-1.5"
          >
            <Check className="size-4" />
            {labels.applyAll}
          </Button>
        ) : null}
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <WarningCircle className="size-4" />
          <span>{error}</span>
        </div>
      ) : null}

      {suggestions ? (
        <div className="space-y-2">
          {title ? (
            <SuggestionButton
              fieldLabel={labels.titleField}
              value={title}
              onClick={() => onApplyTitle(title)}
            />
          ) : null}

          {matchedCategory ? (
            <SuggestionButton
              fieldLabel={labels.categoryField}
              value={matchedCategory.path.map((part) => part.name).join(" > ")}
              onClick={() => onApplyCategory(matchedCategory)}
            />
          ) : null}

          {condition ? (
            <SuggestionButton
              fieldLabel={labels.conditionField}
              value={conditionDisplayLabel ?? condition}
              onClick={() => onApplyCondition(condition)}
            />
          ) : null}

          {suggestedPrice !== null ? (
            <SuggestionButton
              fieldLabel={labels.priceField}
              value={`${suggestedPrice.toFixed(2)} ${suggestions.price.currency ?? fallbackCurrency}`}
              onClick={() => onApplyPrice(suggestedPrice)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
