"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ShippingRegion {
  id: string;
  field: string;
  label: string;
  labelBg: string;
  description: string;
  descriptionBg: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  deliveryTime: string;
  deliveryTimeBg: string;
  carriers: string[];
}

interface ShippingRegionCardProps {
  region: ShippingRegion;
  isSelected: boolean;
  onToggle: () => void;
  locale: string;
}

/**
 * ShippingRegionCard - Selectable card for shipping destination options
 * 
 * Displays a shipping region with:
 * - Icon for the region type
 * - Label and description
 * - Delivery time estimate
 * - Carrier logos when selected
 * - Checkbox for selection
 */
export function ShippingRegionCard({
  region,
  isSelected,
  onToggle,
  locale,
}: ShippingRegionCardProps) {
  const Icon = region.icon;
  const isBg = locale === "bg";

  return (
    <label
      className={cn(
        "relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all w-full cursor-pointer shadow-xs",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-background hover:border-primary/30"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "size-10 rounded-lg flex items-center justify-center shrink-0 border",
        isSelected ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
      )}>
        <Icon className={cn(
          "size-5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} weight="bold" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-sm tracking-tight",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {isBg ? region.labelBg : region.label}
          </span>
          <span className="text-xs font-semibold text-muted-foreground/70">
            {isBg ? region.deliveryTimeBg : region.deliveryTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isBg ? region.descriptionBg : region.description}
        </p>
        {region.carriers.length > 0 && isSelected && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {region.carriers.map((carrier) => (
              <span
                key={carrier}
                className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 text-muted-foreground"
              >
                {carrier}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox indicator */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle()}
        className="size-5 rounded-md"
        aria-label={isBg ? region.labelBg : region.label}
      />
    </label>
  );
}
