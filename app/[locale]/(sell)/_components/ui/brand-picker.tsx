"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  MagnifyingGlass,
  X,
  Check,
  Plus,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  is_verified?: boolean;
}

interface BrandPickerProps {
  brands: Brand[];
  value: string | null;
  onChange: (brandId: string | null, brandName: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export function BrandPicker({
  brands,
  value,
  onChange,
  placeholder = "Search or add brand...",
  allowCustom = true,
}: BrandPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [customBrand, setCustomBrand] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find selected brand from value
  useEffect(() => {
    if (value) {
      const found = brands.find(b => b.id === value);
      setSelectedBrand(found || null);
    } else {
      setSelectedBrand(null);
    }
  }, [value, brands]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return brands.slice(0, 20);
    }
    
    const query = searchQuery.toLowerCase().trim();
    return brands
      .filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.slug.includes(query)
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
      .slice(0, 20);
  }, [searchQuery, brands]);

  // Check if we should show "Add custom" option
  const showAddCustom = useMemo(() => {
    if (!allowCustom || !searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().trim();
    return !brands.some(b => b.name.toLowerCase() === query);
  }, [allowCustom, searchQuery, brands]);

  // Handle brand selection
  const handleSelect = useCallback((brand: Brand) => {
    setSelectedBrand(brand);
    setCustomBrand("");
    onChange(brand.id, brand.name);
    setSearchQuery("");
    setIsOpen(false);
  }, [onChange]);

  // Handle custom brand
  const handleAddCustom = useCallback(() => {
    const name = searchQuery.trim();
    if (name) {
      setSelectedBrand(null);
      setCustomBrand(name);
      onChange(null, name); // null ID, but pass the name
      setSearchQuery("");
      setIsOpen(false);
    }
  }, [searchQuery, onChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    setSelectedBrand(null);
    setCustomBrand("");
    onChange(null, "");
    setIsOpen(true);
    inputRef.current?.focus();
  }, [onChange]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Brand Display */}
      {(selectedBrand || customBrand) && !isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left bg-background border border-border rounded-md hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {selectedBrand?.logo_url && (
              <img
                src={selectedBrand.logo_url}
                alt={selectedBrand.name}
                className="h-5 w-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-foreground truncate">
              {selectedBrand?.name || customBrand}
            </span>
            {selectedBrand?.is_verified && (
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" weight="fill" />
            )}
            {customBrand && !selectedBrand && (
              <span className="text-xs text-muted-foreground">(Custom)</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Check className="h-4 w-4 text-green-600" weight="bold" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </button>
      ) : (
        <>
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-10 pr-4 h-12 rounded-md"
            />
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-md overflow-hidden max-h-[300px] overflow-y-auto">
              <div className="p-2">
                {/* Add Custom Option */}
                {showAddCustom && (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors mb-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add "{searchQuery}" as custom brand
                  </button>
                )}

                {/* Brand Results */}
                {searchResults.length === 0 && !showAddCustom ? (
                  <div className="py-6 text-center text-muted-foreground text-sm">
                    No brands found
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {searchResults.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => handleSelect(brand)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                          "hover:bg-muted",
                          value === brand.id && "bg-primary/10"
                        )}
                      >
                        {brand.logo_url ? (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {brand.name[0]}
                          </div>
                        )}
                        <span className="font-medium flex-1 text-left">{brand.name}</span>
                        {brand.is_verified && (
                          <ShieldCheck className="h-4 w-4 text-primary" weight="fill" />
                        )}
                        {value === brand.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Skip brand */}
                <button
                  type="button"
                  onClick={() => {
                    onChange(null, "");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip - No brand / Unbranded
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
