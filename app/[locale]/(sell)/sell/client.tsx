"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  SignInPrompt, 
  SellHeaderV3,
  SellFormSkeleton,
  SellErrorBoundary,
  SellForm,
  SellFormStepper,
  SellerOnboardingWizard,
  type Category,
  type Seller
} from "@/components/sell";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  initialNeedsOnboarding?: boolean;
  initialUsername?: string | null;
  categories: Category[];
}

export function SellPageClient({ 
  initialUser, 
  initialSeller,
  initialNeedsOnboarding = false,
  initialUsername = null,
  categories // Pre-fetched from server
}: SellPageClientProps) {
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);
  const [needsOnboarding, setNeedsOnboarding] = useState(initialNeedsOnboarding);
  const [username, setUsername] = useState<string | null>(initialUsername);
  
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
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user?: { id: string; email?: string } } | null) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser ? { id: currentUser.id, email: currentUser.email } : null);
      
      if (currentUser && !seller) {
        // Check if user has a profile with username and is_seller status
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, username, display_name, business_name, is_seller")
          .eq("id", currentUser.id)
          .single();
        
        if (profileData?.username) {
          setUsername(profileData.username);
          
          // Check if user needs onboarding (has username but is_seller is false)
          if (!profileData.is_seller) {
            setNeedsOnboarding(true);
          } else {
            setSeller({
              id: profileData.id,
              store_name: profileData.display_name || profileData.business_name || profileData.username,
            });
          }
        }
      } else if (!currentUser) {
        setSeller(null);
        setNeedsOnboarding(false);
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
        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
          <SignInPrompt />
        </div>
      </div>
    );
  }

  // First-time seller onboarding
  // User has username but hasn't set up their seller profile yet (is_seller = false)
  if (needsOnboarding && user && username) {
    const handleOnboardingComplete = async () => {
      // Refresh seller data after onboarding
      const supabase = createClient();
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name, business_name")
        .eq("id", user.id)
        .single();
      
      if (profileData) {
        setSeller({
          id: profileData.id,
          store_name: profileData.display_name || profileData.business_name || profileData.username,
        });
        setNeedsOnboarding(false);
      }
    };

    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <SellHeaderV3 user={{ email: user.email }} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <SellerOnboardingWizard
            userId={user.id}
            username={username}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>
    );
  }

  // No username yet - need to set one up (legacy users only)
  // New users get username at signup, so this shouldn't happen
  if (!seller) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
        <SellHeaderV3 user={{ email: user.email }} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <div className="max-w-md mx-auto text-center space-y-4 px-4">
            <h2 className="text-2xl font-bold">Set Up Your Username</h2>
            <p className="text-muted-foreground">
              You need a username before you can start selling. Visit your account settings to set one up.
            </p>
            <Link 
              href="/account/profile" 
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Settings
            </Link>
          </div>
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
        categories={categories}
      />
    </SellErrorBoundary>
  );
}
