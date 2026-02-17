"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronDown as CaretDown, Check, MapPin, Package, Percent, Star } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities";
import type { QuickFilter } from "./feed-toolbar";
import { pillActive, pillBase, pillInactive } from "./feed-toolbar-pill";

const QUICK_FILTERS: Array<{ id: QuickFilter; labelKey: string; icon: typeof Percent }> = [
  { id: "deals", labelKey: "tabs.deals", icon: Percent },
  { id: "nearby", labelKey: "tabs.nearby", icon: MapPin },
  { id: "top_rated", labelKey: "tabs.top_rated", icon: Star },
  { id: "free_shipping", labelKey: "tabs.free_shipping", icon: Package },
];

interface QuickFilterPillsProps {
  locale: string;
  activeQuickFilters: QuickFilter[];
  onToggleQuickFilter: (id: QuickFilter) => void;
  userCity?: string | null;
  onCityChange?: (city: string) => void;
}

export function QuickFilterPills({
  locale,
  activeQuickFilters,
  onToggleQuickFilter,
  userCity,
  onCityChange,
}: QuickFilterPillsProps) {
  const t = useTranslations("TabbedProductFeed");

  const showCitySelector = activeQuickFilters.includes("nearby") && Boolean(onCityChange);

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar ml-auto">
      {QUICK_FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeQuickFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onToggleQuickFilter(filter.id)}
            aria-pressed={isActive}
            className={cn(pillBase, isActive ? pillActive : pillInactive)}
          >
            <Icon size={16} className="shrink-0" />
            <span>{t(filter.labelKey)}</span>
          </button>
        );
      })}

      {showCitySelector && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={cn(pillBase, userCity ? pillActive : pillInactive)}>
              <MapPin size={16} className="shrink-0" />
              <span className="max-w-28 truncate">
                {userCity
                  ? BULGARIAN_CITIES.find((c) => c.value === userCity)?.[locale === "bg" ? "labelBg" : "label"] ??
                    userCity
                  : t("cityPlaceholder")}
              </span>
              <CaretDown className="size-4 opacity-60 shrink-0" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44 max-h-72 overflow-y-auto">
            {BULGARIAN_CITIES.filter((c) => c.value !== "other").map((city) => {
              const isSelected = userCity === city.value;
              return (
                <DropdownMenuItem
                  key={city.value}
                  onSelect={() => onCityChange?.(city.value)}
                  className={cn(isSelected && "bg-accent")}
                >
                  <span className="flex-1">{locale === "bg" ? city.labelBg : city.label}</span>
                  {isSelected && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export type { QuickFilterPillsProps };

