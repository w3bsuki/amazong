import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FilterRatingSectionProps {
  minRating: string | null;
  onChange: (minRating: string | null) => void;
}

export function FilterRatingSection({ minRating, onChange }: FilterRatingSectionProps) {
  const t = useTranslations("SearchFilters");

  return (
    <div className="-mx-inset divide-y divide-border">
      {[4, 3, 2, 1].map((stars) => {
        const value = stars.toString();
        const isActive = minRating === value;
        const handleToggle = () => onChange(isActive ? null : value);

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            handleToggle();
          }
        };

        return (
          <div
            key={stars}
            role="checkbox"
            aria-checked={isActive}
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full flex items-center gap-3 px-inset h-11 cursor-pointer transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
              isActive ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
            )}
          >
            <Checkbox
              checked={isActive}
              onCheckedChange={handleToggle}
              className="pointer-events-none shrink-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} />
              ))}
            </div>
            <span className="text-sm">{t("andUp")}</span>
          </div>
        );
      })}
    </div>
  );
}


