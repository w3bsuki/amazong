"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Wallet, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PayoutRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal shown when user tries to publish but hasn't completed Stripe payout setup.
 * Links to /api/connect/onboarding which redirects to Stripe, then back to /sell
 */
export function PayoutRequiredModal({ open, onOpenChange }: PayoutRequiredModalProps) {
  const locale = useLocale();
  const isBg = locale === "bg";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetupPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/connect/onboarding", {
        method: "POST",
        headers: {
          "x-next-intl-locale": locale,
          "x-return-to-sell": "true", // Custom header to indicate return to /sell
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to start setup");
      }

      const data = await response.json();
      if (!data?.url) {
        throw new Error("No redirect URL received");
      }

      // Redirect to Stripe - they'll return to /sell?payout=complete
      window.location.href = data.url;
    } catch (err) {
      setError(
        isBg
          ? "Грешка при стартиране на настройката. Опитайте отново."
          : "Error starting setup. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 size-16 rounded-2xl bg-primary flex items-center justify-center">
            <Wallet className="size-8 text-primary-foreground" strokeWidth={2} />
          </div>

          <DialogTitle className="text-xl font-bold">
            {isBg ? "Настройте плащанията" : "Set Up Payments"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isBg
              ? "Свържете банковата си сметка, за да получавате плащания от купувачите."
              : "Connect your bank account to receive payments from buyers."}
          </DialogDescription>
        </DialogHeader>

        {/* Benefits */}
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-selected flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isBg ? "Сигурни плащания" : "Secure payments"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isBg
                  ? "Обработени от Stripe, световен лидер"
                  : "Processed by Stripe, a global leader"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-selected flex items-center justify-center shrink-0">
              <Zap className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isBg ? "Бързи преводи" : "Fast transfers"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isBg
                  ? "Получавайте парите си за дни, не седмици"
                  : "Get your money in days, not weeks"}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive-subtle text-destructive text-sm">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleSetupPayments}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="size-5 mr-2 animate-spin" />
            ) : (
              <Wallet className="size-5 mr-2" />
            )}
            {isBg ? "Настройване на плащания" : "Set Up Payments"}
            <ArrowRight className="size-5 ml-2" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full"
          >
            {isBg ? "По-късно" : "Later"}
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-muted-foreground">
          {isBg
            ? "Вашата обява е запазена като чернова. Можете да я публикувате след настройката."
            : "Your listing is saved as a draft. You can publish it after setup."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
