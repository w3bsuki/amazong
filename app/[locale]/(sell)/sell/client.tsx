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
  categories // Pre-fetched from server
}: SellPageClientProps) {
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);
  
  // Get locale and mobile state at top level (not conditionally)
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const isMobile = useIsMobile();

  // Listen for auth state changes (for client-side navigation)
  useEffect(() => {
    // If we already have initial user from server, skip auth check
    if (initialUser) {
      setIsAuthChecking(false);
      return;
    }

    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  // Loading state while checking auth
  if (isAuthChecking) {
    return <SellFormSkeleton />;
  }

  // Not logged in - show sign in prompt
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

  // No store yet - show create store form
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

  // Mobile: Use stepper wizard flow
  // Desktop: Use full form with sidebar
  if (isMobile) {
    return (
      <SellErrorBoundary sellerId={seller.id}>
        <SellFormStepper 
          sellerId={seller.id}
          locale={locale}
          categories={categories}
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
