"use client";

import * as React from "react";
import { CheckIcon, ShieldCheck, Plus, X } from "lucide-react";
import { CaretRight } from "@/lib/icons/phosphor";
import { cn } from "@/lib/utils";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

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
}: BrandComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const listboxId = React.useId();
  const isMobile = useIsMobile();
  
  const t = useTranslations("Sell")
  const selectedBrand = brands.find((b) => b.id === value);
  
  // Display text for the trigger button
  const displayText = React.useMemo(() => {
    if (selectedBrand) return selectedBrand.name;
    if (customValue) return customValue;
    return placeholder ?? t("brandCombobox.defaultPlaceholder");
  }, [selectedBrand, customValue, placeholder, t]);

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

  const commandContent = (
    <Command shouldFilter={false} className="bg-transparent">
      <CommandInput
        placeholder={t("brandCombobox.searchPlaceholder")}
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="h-12 border-none focus:ring-0"
      />
      <CommandList
        id={listboxId}
        className={cn("overflow-y-auto", isMobile ? "max-h-(--dialog-h-50vh)" : "max-h-(--spacing-scroll-md)")}
      >
        <CommandEmpty>
          {showCustomOption ? (
            <button
              type="button"
              onClick={handleCustomBrand}
              className="w-full p-3 text-left hover:bg-accent rounded-sm flex items-center gap-2"
            >
                <Plus className="size-4 text-primary" />
                <span className="text-sm">
                  {t("brandCombobox.addCustom", { name: searchQuery })}
                </span>
              </button>
            ) : (
              <span className="text-sm text-muted-foreground p-3 block">
                {t("brandCombobox.noBrandFound")}
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
                  {t("brandCombobox.addCustom", { name: searchQuery })}
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
            {t("brandCombobox.skipNoBrand")}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );

  const trigger = (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      onClick={isMobile ? () => setOpen(true) : undefined}
      disabled={disabled}
      className={cn(
        "relative w-full flex flex-col justify-center h-14 px-4 rounded-md border text-left",
        "bg-background border border-border shadow-xs",
        "hover:border-hover-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1.5">
        {t("brandCombobox.label")}
      </span>
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2.5 truncate pr-12">
          {/* Brand logo if available */}
          {selectedBrand?.logo_url && (
            <img
              src={selectedBrand.logo_url}
              alt=""
              className="size-5 object-contain"
            />
          )}
          <span className={cn(
            "text-sm font-semibold truncate",
            (selectedBrand || customValue) ? "text-foreground" : "text-muted-foreground"
          )}>
            {displayText}
          </span>
          {/* Verified badge */}
          {selectedBrand?.is_verified && (
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
          )}
          {/* Custom brand indicator */}
          {customValue && !selectedBrand && (
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">
              ({t("brandCombobox.customIndicator")})
            </span>
          )}
        </span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 shrink-0">
        {/* Clear button */}
        {(selectedBrand || customValue) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear(e);
            }}
            className="size-6 flex items-center justify-center rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            aria-label={t("brandCombobox.clear")}
          >
            <X className="size-3.5 text-muted-foreground" />
          </button>
        )}
        <CaretRight className="size-4 text-muted-foreground" weight="bold" />
      </div>
    </button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left border-b border-border-subtle pb-4">
              <DrawerTitle className="text-base font-bold">
                {t("brandCombobox.mobileTitle")}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-2 pb-8">
              {commandContent}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-(--radix-popover-trigger-width) p-0" 
        align="start"
      >
        {commandContent}
      </PopoverContent>
    </Popover>
  );
}
