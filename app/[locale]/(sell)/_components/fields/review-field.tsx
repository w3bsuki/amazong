"use client";

import { useEffect } from "react";
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
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { conditionOptions } from "@/lib/sell/schema-v4";

// ============================================================================
// REVIEW FIELD - Final review step using context pattern
// Phase 4: Responsive Unification
// ============================================================================

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  BGN: "лв",
  EUR: "€",
  USD: "$",
};

// Section wrapper for review - Premium design
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
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-9 rounded-xl flex items-center justify-center",
            isComplete ? "bg-success/10" : "bg-muted"
          )}>
            <Icon className={cn(
              "size-4.5",
              isComplete ? "text-success" : "text-muted-foreground"
            )} weight="fill" />
          </div>
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 px-3 gap-1.5 text-primary text-sm font-semibold hover:bg-primary/10"
          >
            <PencilSimple className="size-4" />
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

interface ReviewFieldProps {
  onEditStep?: (step: number) => void;
}

export function ReviewField({ onEditStep }: ReviewFieldProps) {
  const { watch } = useSellForm();
  const { isBg, setCurrentStep } = useSellFormContext();
  
  const formValues = watch();
  
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
  const hasTitle = Boolean(title && title.length >= 5);
  const hasCategory = Boolean(categoryId);
  const hasCondition = Boolean(condition);
  const hasPrice = Boolean(price && Number.parseFloat(price) > 0);

  const isValid = hasPhotos && hasTitle && hasCategory && hasCondition && hasPrice;

  // Handle edit navigation - use provided callback or context
  const handleEdit = (step: number) => {
    if (onEditStep) {
      onEditStep(step);
    } else {
      setCurrentStep(step);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

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
    <div className="flex flex-col gap-5">
      {/* Validation warnings - Premium alert design */}
      {!isValid && (
        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <Warning className="size-5 text-warning" weight="fill" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {isBg ? "Попълнете задължителните полета" : "Complete required fields"}
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
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
        onEdit={() => handleEdit(1)}
      >
        {/* Photo preview */}
        {hasPhotos && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
            {images.slice(0, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted"
              >
                <Image
                  src={img.thumbnailUrl || img.url}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
                {idx === 0 && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 text-center">
                    <span className="text-2xs text-white font-bold uppercase tracking-wider">Cover</span>
                  </div>
                )}
              </div>
            ))}
            {images.length > 5 && (
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted-foreground">
                  +{images.length - 5}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <p className="font-bold text-base line-clamp-2 leading-tight">{title || "-"}</p>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {description}
          </p>
        )}
      </ReviewSection>

      {/* Category & Condition */}
      <ReviewSection
        title={isBg ? "Категория и състояние" : "Category & Condition"}
        icon={FolderOpen}
        isComplete={hasCategory && hasCondition}
        onEdit={() => handleEdit(2)}
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
        </div>
      </ReviewSection>

      {/* Item Specifics (Brand + Attributes) */}
      {(brandName || (attributes && attributes.length > 0)) && (
        <ReviewSection
          title={isBg ? "Детайли" : "Item Specifics"}
          icon={Tag}
          isComplete={true}
          onEdit={() => handleEdit(2)}
        >
          <div className="space-y-3">
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
              <div className={brandName ? "pt-2 border-t border-border" : ""}>
                <p className="text-xs text-muted-foreground mb-2">
                  {isBg ? "Характеристики" : "Attributes"}
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
      )}

      {/* Pricing & Shipping */}
      <ReviewSection
        title={isBg ? "Цена и доставка" : "Price & Shipping"}
        icon={CurrencyDollar}
        isComplete={hasPrice}
        onEdit={() => handleEdit(3)}
      >
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{isBg ? "Цена" : "Price"}</span>
            <span className="text-xl font-bold">
              {currencySymbol} {Number.parseFloat(price || "0").toFixed(2)}
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
            <div className="flex items-center gap-2 text-sm text-success">
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
                  {shippingPrice && Number.parseFloat(shippingPrice) > 0
                    ? `${currencySymbol} ${Number.parseFloat(shippingPrice).toFixed(2)}`
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

      {/* Terms agreement - Clean design */}
      <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
        {isBg
          ? "При публикуване на обявата, Вие се съгласявате с Условията за продажба и потвърждавате, че информацията е вярна."
          : "By publishing this listing, you agree to the Terms of Sale and confirm that all information is accurate."}
      </p>
    </div>
  );
}
