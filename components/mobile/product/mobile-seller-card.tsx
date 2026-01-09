"use client";

import { Star, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeAvatarSrc } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MobileSellerCardProps {
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  isVerified?: boolean;
}

/**
 * MobileSellerCard - treido-mock style
 * 
 * Reference: treido-mock ProductPage.tsx lines 105-128
 * - Simple row layout (no Card wrapper)
 * - Avatar w-10 h-10
 * - Name + blue verified checkmark inline
 * - Small "Виж профила" button
 */
export function MobileSellerCard({
  name,
  username,
  avatarUrl,
  rating,
  reviewCount,
  isVerified,
}: MobileSellerCardProps) {
  const t = useTranslations("Product");

  const href = username ? `/${username}` : "#";
  const hasRating = rating != null && rating > 0;

  return (
    <div className="px-4 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        {/* Avatar - treido-mock: w-10 h-10 */}
        <Link href={href}>
          <Avatar className="size-10 border border-border">
            <AvatarImage src={safeAvatarSrc(avatarUrl)} alt={name} />
            <AvatarFallback className="text-sm font-medium bg-muted">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Name + Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link href={href} className="text-sm font-bold text-foreground hover:underline truncate">
              {name}
            </Link>
            {isVerified && (
              <CheckCircle2 className="size-3.5 text-blue-600 fill-white shrink-0" />
            )}
          </div>

          {hasRating && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-foreground text-foreground" />
              <span className="font-medium text-foreground">
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </span>
              {reviewCount != null && reviewCount > 0 && (
                <span>({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* View Profile Button - treido-mock style */}
        <Link
          href={href}
          className="text-xs font-medium text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted active:bg-muted transition-colors shrink-0"
        >
          {t("viewProfile")}
        </Link>
      </div>
    </div>
  );
}
