"use client";

import { useState, memo } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { 
  Storefront, 
  CaretDown, 
  SignOut,
  Package,
  House,
  FloppyDisk,
  X,
  ShoppingCart
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Props for the SellHeader component.
 */
interface SellHeaderProps {
  /** Current user object with email */
  user?: { email?: string } | null;
  /** Store/business name to display */
  storeName?: string | null;
  /** Store slug for linking */
  storeSlug?: string | null;
  /** Callback to save draft */
  onSaveDraft?: () => void;
  /** Whether there are unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Form completion progress (0-100) */
  progress?: number;
}

/**
 * SellHeader - Header component for the sell form page.
 * Displays navigation, user menu, save draft button, and progress bar.
 * 
 * @example
 * ```tsx
 * <SellHeader 
 *   user={{ email: "user@example.com" }}
 *   storeName="My Store"
 *   hasUnsavedChanges={true}
 *   progress={65}
 *   onSaveDraft={() => saveDraft()}
 * />
 * ```
 */
export function SellHeader({
  user,
  storeName,
  storeSlug,
  onSaveDraft,
  hasUnsavedChanges = false,
  progress = 0,
}: SellHeaderProps) {
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.push("/");
    }
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    router.push("/");
  };
  
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container-content flex h-14 items-center justify-between">
          {/* Left: Logo + Store */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
              <Storefront className="size-4" weight="fill" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm">{storeName || "Seller Center"}</span>
              {storeName && (
                <span className="text-xs text-muted-foreground block -mt-0.5">Create Listing</span>
              )}
            </div>
          </Link>

          {/* Right: Actions + User Menu */}
          <div className="flex items-center gap-2">
            {/* Save Draft - desktop only */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSaveDraft}
              className="hidden sm:inline-flex gap-2 text-muted-foreground hover:text-foreground"
            >
              <FloppyDisk className="size-4" />
              Save Draft
            </Button>

            {/* Cancel/Exit */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 px-2 sm:px-3">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                      <span className="hidden md:inline text-sm max-w-(--sell-header-user-max-w) truncate">
                      {storeName || user.email?.split("@")[0]}
                    </span>
                    <CaretDown className="size-3.5 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      {storeName && <p className="font-medium text-sm">{storeName}</p>}
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <House className="size-4" />
                      Back to Homepage
                    </Link>
                  </DropdownMenuItem>
                  {storeSlug && (
                    <DropdownMenuItem asChild>
                      <Link href={`/${storeSlug}`} className="flex items-center gap-2">
                        <Storefront className="size-4" />
                        View My Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account/selling" className="flex items-center gap-2">
                      <Package className="size-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sell/orders" className="flex items-center gap-2">
                      <ShoppingCart className="size-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="p-0">
                    <form action="/api/auth/signout" method="post" className="w-full">
                      <button
                        type="submit"
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-accent focus:bg-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setIsSigningOut(true)}
                      >
                        <SignOut className="size-4" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="h-0.5 w-full bg-muted lg:hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </nav>

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Memoized SellHeader - Optimized to prevent unnecessary re-renders.
 * Use this when the header is rendered frequently (e.g., in form context).
 */
const MemoizedSellHeader = memo(SellHeader);
