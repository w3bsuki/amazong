"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  SignInPrompt, 
  CreateStoreForm, 
  SellHeaderV3,
  SellFormSkeleton,
  SellErrorBoundary,
  SellForm,
  SellFormStepper,
  type Category,
  type Seller
} from "@/components/sell";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  categories: Category[];
}

export function SellPageClient({ 
  initialUser, 
  initialSeller, 
  categories: _categories // Categories now fetched dynamically in SellForm
}: SellPageClientProps) {
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);

  // Listen for auth state changes (for client-side navigation)
  useEffect(() => {
    // If we already have initial user from server, skip auth check
    if (initialUser) {
      setIsAuthChecking(false);
      return;
    }

    const supabase = createClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser ? { id: currentUser.id, email: currentUser.email } : null);
      
      if (currentUser && !seller) {
        // Check if user is a seller
        const { data: sellerData } = await supabase
          .from("sellers")
          .select("id, store_name")
          .eq("id", currentUser.id)
          .single();
        
        if (sellerData) {
          setSeller(sellerData);
        }
      } else if (!currentUser) {
        setSeller(null);
      }
      
      setIsAuthChecking(false);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setIsAuthChecking(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [initialUser, seller]);

  // Loading state while checking auth - Full skeleton for better UX
  if (isAuthChecking) {
    return <SellFormSkeleton />;
  }

  // Not logged in - show sign in prompt (full height centered)
  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
        <SellHeaderV3 />
        <div className="flex-1 flex items-center justify-center p-4">
          <SignInPrompt />
        </div>
      </div>
    );
  }

  // No store yet - show create store form (full height centered)
  if (!seller) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
        <SellHeaderV3 user={{ email: user.email }} />
        <div className="flex-1 flex items-center justify-center p-4">
          <CreateStoreForm
            onStoreCreated={(newSeller) => setSeller(newSeller)}
          />
        </div>
      </div>
    );
  }

  // Main listing form with error boundary
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const isMobile = useIsMobile();
  
  // Mobile: Use stepper wizard flow (professional, focused UX)
  // Desktop: Use full form with sidebar (overview)
  if (isMobile) {
    return (
      <SellErrorBoundary sellerId={seller.id}>
        <SellFormStepper 
          sellerId={seller.id}
          locale={locale}
          categories={_categories}
        />
      </SellErrorBoundary>
    );
  }

  return (
    <SellErrorBoundary sellerId={seller.id}>
      <SellForm 
        sellerId={seller.id}
        locale={locale}
      />
    </SellErrorBoundary>
  );
}
