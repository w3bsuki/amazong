"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CaretDown, Check } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pillActive, pillBase, pillInactive } from "./feed-toolbar-pill";
import type { FilterState } from "./feed-toolbar";

type FilterOption = { value: string; label: string };

export type CategoryFilterDef = {
  id: string;
  label: string;
  name: string;
  options: FilterOption[];
};

interface CategoryAttributeDropdownsProps {
  locale: string;
  filters: FilterState;
  onFiltersChange: (next: FilterState) => void;
  inlineFilters: CategoryFilterDef[];
  overflowFilters: CategoryFilterDef[];
}

export function CategoryAttributeDropdowns({
  filters,
  onFiltersChange,
  inlineFilters,
  overflowFilters,
}: CategoryAttributeDropdownsProps) {
  const t = useTranslations("TabbedProductFeed");
  const overflowSelectedCount = overflowFilters.filter((f) => Boolean(filters.attributes[f.id])).length;

  if (inlineFilters.length === 0 && overflowFilters.length === 0) return null;

  return (
    <>
      <div className="h-6 w-px bg-border shrink-0" />
      <div className="flex items-center gap-2 shrink-0">
        {inlineFilters.map((filter) => {
          const selectedValue = filters.attributes[filter.id];
          const hasValue = Boolean(selectedValue);
          const displayLabel = hasValue
            ? filter.options.find((o) => o.value === selectedValue)?.label ?? selectedValue
            : filter.label;

          return (
            <DropdownMenu key={filter.id}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={cn(pillBase, hasValue ? pillActive : pillInactive)}>
                  <span className="max-w-28 truncate">{displayLabel}</span>
                  <CaretDown className="size-4 opacity-60 shrink-0" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-40 max-h-72 overflow-y-auto">
                {filter.options.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onSelect={() => {
                        const newAttributes = { ...filters.attributes };
                        if (isSelected) {
                          delete newAttributes[filter.id];
                        } else {
                          newAttributes[filter.id] = opt.value;
                        }
                        onFiltersChange({ ...filters, attributes: newAttributes });
                      }}
                      className={cn(isSelected && "bg-accent")}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {isSelected && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
                {hasValue && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        const newAttributes = { ...filters.attributes };
                        delete newAttributes[filter.id];
                        onFiltersChange({ ...filters, attributes: newAttributes });
                      }}
                      variant="destructive"
                    >
                      {t("clear")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

        {overflowFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={cn(pillBase, overflowSelectedCount > 0 ? pillActive : pillInactive)}>
                <span>{t("tabs.moreFilters", { count: overflowFilters.length })}</span>
                <CaretDown className="size-3 opacity-50 shrink-0" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              {overflowFilters.map((filter) => {
                const selectedValue = filters.attributes[filter.id];
                const hasValue = Boolean(selectedValue);

                return (
                  <DropdownMenuSub key={filter.id}>
                    <DropdownMenuSubTrigger className={cn(hasValue && "font-medium")}>
                      <span className="flex-1">{filter.label}</span>
                      {hasValue && (
                        <span className="text-xs text-primary ml-2">
                          {filter.options.find((o) => o.value === selectedValue)?.label ?? selectedValue}
                        </span>
                      )}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="min-w-36 max-h-64 overflow-y-auto">
                        {filter.options.map((opt) => {
                          const isSelected = selectedValue === opt.value;
                          return (
                            <DropdownMenuItem
                              key={opt.value}
                              onSelect={() => {
                                const newAttributes = { ...filters.attributes };
                                if (isSelected) {
                                  delete newAttributes[filter.id];
                                } else {
                                  newAttributes[filter.id] = opt.value;
                                }
                                onFiltersChange({ ...filters, attributes: newAttributes });
                              }}
                              className={cn(isSelected && "bg-accent")}
                            >
                              <span className="flex-1">{opt.label}</span>
                              {isSelected && <Check className="size-4 text-primary" />}
                            </DropdownMenuItem>
                          );
                        })}
                        {hasValue && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => {
                                const newAttributes = { ...filters.attributes };
                                delete newAttributes[filter.id];
                                onFiltersChange({ ...filters, attributes: newAttributes });
                              }}
                              variant="destructive"
                            >
                              {t("clear")}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
}

export type { CategoryAttributeDropdownsProps };
