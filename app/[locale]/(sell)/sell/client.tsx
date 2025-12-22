"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  SignInPrompt, 
  SellHeader,
  SellFormSkeleton,
  SellErrorBoundary,
  UnifiedSellForm,
  SellerOnboardingWizard,
  type Category,
  type Seller
} from "../_components";
import { AiSellAssistant } from "@/components/ai/ai-sell-assistant";
import { useParams } from "next/navigation";
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
  
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
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
              store_name: profileData.display_name || profileData.business_name || profileData.username || "Store",
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
        <SellHeader />
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
          store_name: profileData.display_name || profileData.business_name || profileData.username || "Store",
        });
        setNeedsOnboarding(false);
      }
    };

    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <SellHeader user={{ email: user.email }} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <SellerOnboardingWizard
            userId={user.id}
            username={username as string}
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
        <SellHeader user={{ email: user.email }} />
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
        {/* Minimal header with toggle - Modernized with backdrop-blur and refined spacing */}
        <header className="safe-top sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                <Sparkles className="size-4.5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-tight leading-none">
                  {isBg ? "Създай обява" : "Create Listing"}
                </h1>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  {isBg ? "с AI асистент" : "with AI assistant"}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseAiAssistant(false)}
            className="h-9 gap-1.5 rounded-full border-border/60 bg-background/50 px-4 font-medium shadow-xs transition-all hover:bg-muted active:scale-95"
          >
            <FileText className="size-4 text-muted-foreground" />
            <span className="hidden xs:inline">
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

  // Traditional Form Mode - Uses UnifiedSellForm which handles responsive layouts internally
  return (
    <SellErrorBoundary sellerId={seller.id}>
      {/* Floating button to switch back to AI (desktop only) */}
      <div className="fixed bottom-4 right-4 z-50 hidden lg:block lg:bottom-6 lg:right-6">
        <Button
          onClick={() => setUseAiAssistant(true)}
          className="gap-2 shadow-lg"
          size="lg"
        >
          <Sparkles className="size-4" />
          {isBg ? "Използвай AI" : "Try AI Assistant"}
        </Button>
      </div>
      
      {/* UnifiedSellForm handles both desktop and mobile layouts */}
      <UnifiedSellForm 
        sellerId={seller.id}
        locale={locale}
        categories={categories}
      />
    </SellErrorBoundary>
  );
}