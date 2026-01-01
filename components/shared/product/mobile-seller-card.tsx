"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileSellerCardProps {
  store: {
    name: string;
    rating?: string;
    verified?: boolean;
    avatarUrl?: string;
  };
  ctaHref?: string;
}

export function MobileSellerCard({ store, ctaHref }: MobileSellerCardProps) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card px-3 py-2.5">
        <Avatar className="h-9 w-9 border border-border/60 shrink-0">
          <AvatarImage src={store.avatarUrl} />
          <AvatarFallback className="text-xs font-semibold">
            {store.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate text-sm font-semibold text-foreground">{store.name}</span>
            {store.verified ? <ShieldCheck className="h-4 w-4 text-verified" /> : null}
          </div>
          {store.rating ? (
            <div className="text-xs font-medium text-muted-foreground">{store.rating}</div>
          ) : null}
        </div>
        {ctaHref ? (
          <Link
            href={ctaHref}
            className="flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
