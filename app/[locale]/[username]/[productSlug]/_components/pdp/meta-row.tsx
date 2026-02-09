"use client";

import { Clock, Eye, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySummary {
  id?: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  icon?: string | null;
  parent_id?: string | null;
}

interface MetaRowProps {
  category: CategorySummary | null;
  rootCategory: CategorySummary | null;
  timeAgo: string | null;
  viewCount: number | null;
  locale: string;
}

/**
 * Meta row displaying category badge + time/views for product pages.
 * Used by mobile PDP variants.
 */
export function MetaRow({
  category,
  rootCategory,
  timeAgo,
  viewCount,
  locale,
}: MetaRowProps) {
  const rootCategoryName = rootCategory
    ? locale === "bg" && rootCategory.name_bg
      ? rootCategory.name_bg
      : rootCategory.name
    : null;
  const categoryName = category
    ? locale === "bg" && category.name_bg
      ? category.name_bg
      : category.name
    : null;
  const showSubcategory = category && rootCategory && category.slug !== rootCategory.slug;

  if (!category && !rootCategory && !timeAgo && !viewCount) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left: Category badge */}
      {(category || rootCategory) && (
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
              "bg-muted",
              "text-xs font-medium text-foreground",
              "truncate max-w-45"
            )}
          >
            <Folder className="size-3 shrink-0 text-muted-foreground" strokeWidth={2} />
            <span className="truncate">
              {rootCategoryName || categoryName}
              {showSubcategory && (
                <span className="text-muted-foreground"> · {categoryName}</span>
              )}
            </span>
          </span>
        </div>
      )}

      {/* Right: Time & Views */}
      {(timeAgo || (viewCount != null && viewCount > 0)) && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          {timeAgo && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" strokeWidth={1.5} />
              {timeAgo}
            </span>
          )}
          {viewCount != null && viewCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" strokeWidth={1.5} />
              {viewCount.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export type { CategorySummary, MetaRowProps };
