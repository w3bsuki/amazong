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
import { AiSellAssistant } from "@/components/ai-sell-assistant";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, ArrowLeft } from "lucide-react";

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
  
  // AI-first mode toggle (default: AI assistant)
  const [useAiAssistant, setUseAiAssistant] = useState(true);
  
  // Get locale and mobile state at top level (not conditionally)
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const isMobile = useIsMobile();
  const isBg = locale === "bg";

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
            <h2 className="text-2xl font-bold">
              {isBg ? "Настройте потребителско име" : "Set Up Your Username"}
            </h2>
            <p className="text-muted-foreground">
              {isBg 
                ? "Нужно ви е потребителско име, преди да започнете да продавате."
                : "You need a username before you can start selling. Visit your account settings to set one up."}
            </p>
            <Link 
              href="/account/profile" 
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {isBg ? "Настройки" : "Go to Settings"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CONTENT: AI-First or Traditional Form
  // =========================================================================
  
  // AI Assistant Mode (default)
  if (useAiAssistant) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        {/* Minimal header with toggle */}
        <header className="safe-top flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">
                  {isBg ? "Създай обява" : "Create Listing"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isBg ? "с AI асистент" : "with AI assistant"}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseAiAssistant(false)}
            className="gap-1.5"
          >
            <FileText className="size-4" />
            <span className="hidden sm:inline">
              {isBg ? "Ръчен формуляр" : "Manual Form"}
            </span>
          </Button>
        </header>
        
        {/* AI Chatbot takes full remaining space */}
        <div className="flex-1 min-h-0">
          <AiSellAssistant embedded />
        </div>
      </div>
    );
  }

  // Traditional Form Mode
  return (
    <SellErrorBoundary sellerId={seller.id}>
      {/* Floating button to switch back to AI */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <Button
            onClick={() => setUseAiAssistant(true)}
            className="gap-2 shadow-lg"
            size="lg"
          >
            <Sparkles className="size-4" />
            {isBg ? "Използвай AI" : "Try AI Assistant"}
          </Button>
        </div>
      )}
      
      {isMobile ? (
        <SellFormStepper 
          sellerId={seller.id}
          locale={locale}
          categories={categories}
        />
      ) : (
        <SellForm 
          sellerId={seller.id}
          locale={locale}
          categories={categories}
        />
      )}
    </SellErrorBoundary>
  );
}
