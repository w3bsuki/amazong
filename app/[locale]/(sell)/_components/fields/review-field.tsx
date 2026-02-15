"use client";

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
} from "@/lib/icons/phosphor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { conditionOptions } from "@/lib/sell/schema-v4";
import { useTranslations } from "next-intl";

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
  editLabel,
  isComplete,
  children,
}: {
  title: string;
  icon: React.ElementType;
  onEdit?: () => void;
  editLabel?: string;
  isComplete?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border-subtle">
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
            className="h-8 px-3 gap-1.5 text-primary text-sm font-semibold hover:bg-hover active:bg-active"
          >
            <PencilSimple className="size-4" />
            {editLabel ?? "Edit"}
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
  const tSell = useTranslations("Sell")
  const tCommon = useTranslations("Common")
  
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
  const hasDescription = Boolean(description && description.trim().length >= 50);
  const hasPrice = Boolean(price && Number.parseFloat(price) > 0);

  const isValid = hasPhotos && hasTitle && hasCategory && hasCondition && hasDescription && hasPrice;

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
    ? tSell(conditionInfo.labelKey as never)
    : "";

  // Get currency symbol
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  // Get category path display
  const categoryDisplay = categoryPath && categoryPath.length > 0
    ? categoryPath.map(c => (isBg && c.name_bg ? c.name_bg : c.name)).join(" › ")
    : "";

  return (
    <div className="flex flex-col gap-5">
      {/* Validation warnings - Premium alert design */}
      {!isValid && (
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <Warning className="size-5 text-warning" weight="fill" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {tSell("review.completeRequiredFieldsTitle")}
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                {!hasPhotos && <li>• {tSell("validation.photosRequired")}</li>}
                {!hasTitle && <li>• {tSell("validation.titleMin")}</li>}
                {!hasCategory && <li>• {tSell("validation.categoryRequired")}</li>}
                {!hasCondition && <li>• {tSell("validation.conditionRequired")}</li>}
                {!hasDescription && <li>• {tSell("validation.descriptionMin")}</li>}
                {!hasPrice && <li>• {tSell("validation.priceRequired")}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Photos & Details */}
      <ReviewSection
        title={tSell("review.sections.photosAndDetails")}
        icon={Camera}
        isComplete={hasPhotos && hasTitle}
        onEdit={() => handleEdit(1)}
        editLabel={tCommon("edit")}
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
                  alt={tSell("photos.photoAlt", { index: idx + 1 })}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
                {idx === 0 && (
                  <div className="absolute bottom-0 inset-x-0 bg-surface-overlay py-0.5 text-center">
                    <span className="text-2xs text-overlay-text font-bold uppercase tracking-wider">{tSell("photos.cover")}</span>
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
        title={tSell("review.sections.categoryAndCondition")}
        icon={FolderOpen}
        isComplete={hasCategory && hasCondition}
        onEdit={() => handleEdit(2)}
        editLabel={tCommon("edit")}
      >
        <div className="space-y-3">
          {/* Category */}
          <div className="flex items-start gap-2">
            <Tag className="size-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{tSell("review.labels.category")}</p>
              <p className="text-sm font-medium">{categoryDisplay || "-"}</p>
            </div>
          </div>

          {/* Condition */}
          <div className="flex items-start gap-2">
            <Package className="size-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{tSell("review.labels.condition")}</p>
              <p className="text-sm font-medium">{conditionLabel || "-"}</p>
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Item Specifics (Brand + Attributes) */}
      {(brandName || (attributes && attributes.length > 0)) && (
        <ReviewSection
          title={tSell("review.sections.itemSpecifics")}
          icon={Tag}
          isComplete={true}
          onEdit={() => handleEdit(2)}
          editLabel={tCommon("edit")}
        >
          <div className="space-y-3">
            {/* Brand */}
            {brandName && (
              <div className="flex items-start gap-2">
                <Tag className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{tSell("review.labels.brand")}</p>
                  <p className="text-sm font-medium">{brandName}</p>
                </div>
              </div>
            )}

            {/* Attributes */}
            {attributes && attributes.length > 0 && (
              <div className={brandName ? "pt-2 border-t border-border" : ""}>
                <p className="text-xs text-muted-foreground mb-2">
                  {tSell("review.labels.attributes")}
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
        title={tSell("review.sections.priceAndShipping")}
        icon={CurrencyDollar}
        isComplete={hasPrice}
        onEdit={() => handleEdit(3)}
        editLabel={tCommon("edit")}
      >
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{tSell("review.labels.price")}</span>
            <span className="text-xl font-bold">
              {currencySymbol} {Number.parseFloat(price || "0").toFixed(2)}
            </span>
          </div>

          {/* Quantity */}
          {quantity > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{tSell("review.labels.quantity")}</span>
              <span className="font-medium">{quantity}</span>
            </div>
          )}

          {/* Accept offers */}
          {acceptOffers && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="size-4" weight="fill" />
              {tSell("review.labels.acceptsOffers")}
            </div>
          )}

          {/* Shipping */}
          <div className="pt-2 border-t border-border mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {tSell("review.labels.shipping")}
              </span>
            </div>

            {pickupOnly ? (
              <p className="text-sm">{tSell("review.labels.pickupOnly")}</p>
            ) : (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">{tSell("review.labels.shippingPrice")}</span>{" "}
                  {shippingPrice && Number.parseFloat(shippingPrice) > 0
                    ? `${currencySymbol} ${Number.parseFloat(shippingPrice).toFixed(2)}`
                    : tSell("review.labels.free")}
                </p>
                <p className="text-muted-foreground">
                  {[
                    shipsToBulgaria && `🇧🇬 ${tSell("review.shippingDestinations.bulgaria")}`,
                    shipsToEurope && `🇪🇺 ${tSell("review.shippingDestinations.europe")}`,
                  ].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </ReviewSection>

      {/* Terms agreement - Clean design */}
      <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
        {tSell("review.termsAgreement")}
      </p>
    </div>
  );
}
