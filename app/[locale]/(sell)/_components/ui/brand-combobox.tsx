"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, ShieldCheck, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// BRAND COMBOBOX - shadcn/ui Combobox pattern for brand selection
// ============================================================================
// Pattern verified from Context7 (shadcn/ui Combobox docs)
// Uses Popover + Command for searchable dropdown with custom brand support

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string | null;
  is_verified?: boolean;
}

export interface BrandComboboxProps {
  /** Array of available brands */
  brands: Brand[];
  /** Currently selected brand ID (null/undefined for custom brand) */
  value: string | null | undefined;
  /** Custom brand name (when value is null) */
  customValue?: string;
  /** Callback when brand selection changes */
  onValueChange: (brandId: string | null, brandName: string) => void;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Allow entering custom brand names */
  allowCustom?: boolean;
  /** Disable the combobox */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Locale for translations */
  locale?: string;
}

export function BrandCombobox({
  brands,
  value,
  customValue = "",
  onValueChange,
  placeholder,
  allowCustom = true,
  disabled = false,
  className,
  locale = "en",
}: BrandComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const isBg = locale === "bg";
  const selectedBrand = brands.find((b) => b.id === value);
  
  // Display text for the trigger button
  const displayText = React.useMemo(() => {
    if (selectedBrand) return selectedBrand.name;
    if (customValue) return customValue;
    return placeholder ?? (isBg ? "Избери марка..." : "Select brand...");
  }, [selectedBrand, customValue, placeholder, isBg]);

  // Filter brands based on search query
  const filteredBrands = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return brands.slice(0, 50); // Limit initial display
    }
    const query = searchQuery.toLowerCase().trim();
    return brands
      .filter((b) =>
        b.name.toLowerCase().includes(query) ||
        b.slug?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        // Exact match first
        const aExact = a.name.toLowerCase() === query;
        const bExact = b.name.toLowerCase() === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        // Verified brands next
        if (a.is_verified && !b.is_verified) return -1;
        if (!a.is_verified && b.is_verified) return 1;
        // Then alphabetically
        return a.name.localeCompare(b.name);
      })
      .slice(0, 50);
  }, [searchQuery, brands]);

  // Check if custom value option should be shown
  const showCustomOption = React.useMemo(() => {
    if (!allowCustom || !searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().trim();
    return !brands.some((b) => b.name.toLowerCase() === query);
  }, [allowCustom, searchQuery, brands]);

  // Handle brand selection
  const handleSelect = React.useCallback(
    (brand: Brand) => {
      onValueChange(brand.id, brand.name);
      setOpen(false);
      setSearchQuery("");
    },
    [onValueChange]
  );

  // Handle custom brand entry
  const handleCustomBrand = React.useCallback(() => {
    if (searchQuery.trim()) {
      onValueChange(null, searchQuery.trim());
      setOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, onValueChange]);

  // Handle clear
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange(null, "");
    },
    [onValueChange]
  );

  // Handle skip (unbranded)
  const handleSkip = React.useCallback(() => {
    onValueChange(null, "");
    setOpen(false);
    setSearchQuery("");
  }, [onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-12 text-sm font-medium rounded-xl border-border",
            !selectedBrand && !customValue && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2.5 truncate">
            {/* Brand logo if available */}
            {selectedBrand?.logo_url && (
              <img
                src={selectedBrand.logo_url}
                alt=""
                className="size-5 object-contain"
              />
            )}
            <span className="truncate">{displayText}</span>
            {/* Verified badge */}
            {selectedBrand?.is_verified && (
              <ShieldCheck className="size-3.5 text-primary shrink-0" weight="fill" />
            )}
            {/* Custom brand indicator */}
            {customValue && !selectedBrand && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                ({isBg ? "Потребителска" : "Custom"})
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clear button */}
            {(selectedBrand || customValue) && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                className="size-6 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                aria-label={isBg ? "Изчисти" : "Clear"}
              >
                <X className="size-3.5 text-muted-foreground" weight="bold" />
              </span>
            )}
            <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0" 
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={isBg ? "Търси марка..." : "Search brand..."}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {showCustomOption ? (
                <button
                  type="button"
                  onClick={handleCustomBrand}
                  className="w-full p-3 text-left hover:bg-accent rounded-sm flex items-center gap-2"
                >
                  <Plus className="size-4 text-primary" />
                  <span className="text-sm">
                    {isBg ? `Добави "${searchQuery}"` : `Add "${searchQuery}"`}
                  </span>
                </button>
              ) : (
                <span className="text-sm text-muted-foreground p-3 block">
                  {isBg ? "Няма намерени марки" : "No brand found"}
                </span>
              )}
            </CommandEmpty>
            
            {/* Custom brand option when searching */}
            {showCustomOption && filteredBrands.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCustomBrand}
                    className="flex items-center gap-2"
                  >
                    <Plus className="size-4 text-primary" />
                    <span>
                      {isBg ? `Добави "${searchQuery}"` : `Add "${searchQuery}"`}
                    </span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            <CommandGroup>
              {filteredBrands.map((brand) => (
                <CommandItem
                  key={brand.id}
                  value={brand.name}
                  onSelect={() => handleSelect(brand)}
                  className="flex items-center gap-2"
                >
                  <CheckIcon
                    className={cn(
                      "size-4 shrink-0",
                      value === brand.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {/* Brand logo */}
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt=""
                      className="size-5 object-contain"
                    />
                  ) : (
                    <div className="size-5 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {brand.name[0]}
                    </div>
                  )}
                  <span className="flex-1">{brand.name}</span>
                  {brand.is_verified && (
                    <ShieldCheck className="size-4 text-primary shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Skip / Unbranded option */}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={handleSkip}
                className="text-muted-foreground justify-center text-xs"
              >
                {isBg ? "Пропусни - Без марка" : "Skip - No brand / Unbranded"}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
