"use client";

import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileSellerCardProps {
  store: {
    name: string;
    rating: string;
    verified: boolean;
    avatarUrl?: string;
  };
}

export function MobileSellerCard({ store }: MobileSellerCardProps) {
  return (
    <div className="lg:hidden mb-4">
      <div className="flex items-center gap-3 bg-background border border-border p-3 rounded-xl shadow-sm">
        <Avatar className="h-10 w-10 border border-border shrink-0">
          <AvatarImage src={store.avatarUrl} />
          <AvatarFallback>{store.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 text-sm hover:underline cursor-pointer truncate">
            {store.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {store.rating} positive feedback
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-muted-foreground hover:bg-background hover:text-foreground rounded-full bg-background">
            <Store className="mr-1.5 h-3.5 w-3.5" /> Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
