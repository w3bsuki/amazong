"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import {
  CheckCircle,
  Camera,
  FolderOpen,
  CurrencyDollar,
  Truck,
  Tag,
  Package,
  PencilSimple,
  Warning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";
import { conditionOptions } from "@/lib/sell-form-schema-v4";

interface StepReviewProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
  onEditStep?: (step: number) => void;
}

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  BGN: "лв",
  EUR: "€",
  USD: "$",
};

// Section wrapper for review
function ReviewSection({
  title,
  icon: Icon,
  onEdit,
  isComplete,
  children,
}: {
  title: string;
  icon: React.ElementType;
  onEdit?: () => void;
  isComplete?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "size-5",
            isComplete ? "text-green-600" : "text-muted-foreground"
          )} weight="fill" />
          <span className="text-sm font-semibold">{title}</span>
          {isComplete && <CheckCircle className="size-4 text-green-600" weight="fill" />}
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 gap-1.5 text-xs text-primary"
          >
            <PencilSimple className="size-3.5" />
            Edit
          </Button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export function StepReview({
  form,
  locale = "en",
  onValidityChange,
  onEditStep,
}: StepReviewProps) {
  const isBg = locale === "bg";
  const formValues = form.watch();
  
  const {
    images,
    title,
    description,
    categoryId,
    categoryPath,
    condition,
    brandName,
    attributes,
    price,
    currency,
    quantity,
    acceptOffers,
    shippingPrice,
    shipsToBulgaria,
    shipsToEurope,
    pickupOnly,
  } = formValues;

  // Check overall validity
  const hasPhotos = Boolean(images && images.length > 0);
  const hasTitle = Boolean(title && title.length >= 3);
  const hasCategory = Boolean(categoryId);
  const hasCondition = Boolean(condition);
  const hasPrice = Boolean(price && parseFloat(price) > 0);

  const isValid = hasPhotos && hasTitle && hasCategory && hasCondition && hasPrice;

  // Notify parent
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  // Get condition label
  const conditionInfo = conditionOptions.find(c => c.value === condition);
  const conditionLabel = conditionInfo
    ? (isBg ? conditionInfo.labelBg : conditionInfo.label)
    : "";

  // Get currency symbol
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  // Get category path display
  const categoryDisplay = categoryPath && categoryPath.length > 0
    ? categoryPath.map(c => c.name).join(" › ")
    : "";

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">
          {isBg ? "Преглед на обявата" : "Review Your Listing"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isBg
            ? "Проверете детайлите преди публикуване"
            : "Check the details before publishing"}
        </p>
      </div>

      {/* Validation warnings */}
      {!isValid && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Warning className="size-5 text-amber-600 shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                {isBg ? "Попълнете задължителните полета" : "Complete required fields"}
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-0.5">
                {!hasPhotos && <li>• {isBg ? "Добавете поне 1 снимка" : "Add at least 1 photo"}</li>}
                {!hasTitle && <li>• {isBg ? "Добавете заглавие" : "Add a title"}</li>}
                {!hasCategory && <li>• {isBg ? "Изберете категория" : "Select a category"}</li>}
                {!hasCondition && <li>• {isBg ? "Изберете състояние" : "Select condition"}</li>}
                {!hasPrice && <li>• {isBg ? "Въведете цена" : "Enter a price"}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Photos & Details */}
      <ReviewSection
        title={isBg ? "Снимки и описание" : "Photos & Details"}
        icon={Camera}
        isComplete={hasPhotos && hasTitle}
        onEdit={() => onEditStep?.(1)}
      >
        {/* Photo preview */}
        {hasPhotos && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
            {images.slice(0, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted"
              >
                <Image
                  src={img.thumbnailUrl || img.url}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {idx === 0 && (
                  <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent py-0.5 text-center">
                    <span className="text-2xs text-white font-bold">COVER</span>
                  </div>
                )}
              </div>
            ))}
            {images.length > 5 && (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-muted-foreground">
                  +{images.length - 5}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <p className="font-semibold text-lg line-clamp-2">{title || "-"}</p>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {description}
          </p>
        )}
      </ReviewSection>

      {/* Category & Condition */}
      <ReviewSection
        title={isBg ? "Категория и състояние" : "Category & Condition"}
        icon={FolderOpen}
        isComplete={hasCategory && hasCondition}
        onEdit={() => onEditStep?.(2)}
      >
        <div className="space-y-3">
          {/* Category */}
          <div className="flex items-start gap-2">
            <Tag className="size-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{isBg ? "Категория" : "Category"}</p>
              <p className="text-sm font-medium">{categoryDisplay || "-"}</p>
            </div>
          </div>

          {/* Condition */}
          <div className="flex items-start gap-2">
            <Package className="size-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{isBg ? "Състояние" : "Condition"}</p>
              <p className="text-sm font-medium">{conditionLabel || "-"}</p>
            </div>
          </div>

          {/* Brand */}
          {brandName && (
            <div className="flex items-start gap-2">
              <Tag className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{isBg ? "Марка" : "Brand"}</p>
                <p className="text-sm font-medium">{brandName}</p>
              </div>
            </div>
          )}

          {/* Attributes */}
          {attributes && attributes.length > 0 && (
            <div className="pt-2 border-t border-border mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {isBg ? "Характеристики" : "Item Specifics"}
              </p>
              <div className="flex flex-wrap gap-2">
                {attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md bg-muted text-xs"
                  >
                    {attr.name}: {attr.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      {/* Pricing & Shipping */}
      <ReviewSection
        title={isBg ? "Цена и доставка" : "Price & Shipping"}
        icon={CurrencyDollar}
        isComplete={hasPrice}
        onEdit={() => onEditStep?.(3)}
      >
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{isBg ? "Цена" : "Price"}</span>
            <span className="text-xl font-bold">
              {currencySymbol} {parseFloat(price || "0").toFixed(2)}
            </span>
          </div>

          {/* Quantity */}
          {quantity > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{isBg ? "Количество" : "Quantity"}</span>
              <span className="font-medium">{quantity}</span>
            </div>
          )}

          {/* Accept offers */}
          {acceptOffers && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="size-4" weight="fill" />
              {isBg ? "Приема оферти" : "Accepts offers"}
            </div>
          )}

          {/* Shipping */}
          <div className="pt-2 border-t border-border mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isBg ? "Доставка" : "Shipping"}
              </span>
            </div>

            {pickupOnly ? (
              <p className="text-sm">{isBg ? "Само лично предаване" : "Pickup only"}</p>
            ) : (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">{isBg ? "Цена:" : "Price:"}</span>{" "}
                  {shippingPrice && parseFloat(shippingPrice) > 0
                    ? `${currencySymbol} ${parseFloat(shippingPrice).toFixed(2)}`
                    : isBg ? "Безплатна" : "Free"}
                </p>
                <p className="text-muted-foreground">
                  {[
                    shipsToBulgaria && "🇧🇬 Bulgaria",
                    shipsToEurope && "🇪🇺 Europe",
                  ].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </ReviewSection>

      {/* Terms agreement - simple visual confirmation, not stored in form */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          {isBg
            ? "При публикуване на обявата, Вие се съгласявате с Условията за продажба и потвърждавате, че информацията е вярна."
            : "By publishing this listing, you agree to the Terms of Sale and confirm that all information is accurate."}
        </p>
      </div>
    </div>
  );
}
