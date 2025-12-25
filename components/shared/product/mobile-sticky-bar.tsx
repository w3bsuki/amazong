"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex gap-3 items-center max-w-md mx-auto">
        <Button variant="outline" size="icon" className="shrink-0 border-border h-11 w-11 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors active:scale-95">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="flex-1 border-primary text-primary font-bold rounded-full h-11 text-sm uppercase tracking-wide hover:bg-primary/10 active:scale-[0.98] transition-transform">
          Add to cart
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground font-bold rounded-full h-11 text-sm uppercase tracking-wide hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-transform">
          Buy It Now
        </Button>
      </div>
    </div>
  );
}
