"use client"


import { useTranslations } from "next-intl";
import { Wallet, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface PayoutRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal shown when user tries to publish but hasn't completed Stripe payout setup.
 * Links to /api/connect/onboarding which redirects to Stripe, then back to /sell
 */
export function PayoutRequiredModal({ open, onOpenChange }: PayoutRequiredModalProps) {
  const tSell = useTranslations("Sell");
  const router = useRouter();

  const handleSetupPayouts = () => {
    onOpenChange(false);
    router.push("/seller/settings/payouts");
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
            {tSell("payoutSetupRequired")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {tSell("payoutSetupDescription")}
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
                {tSell("payoutSetupModal.benefits.securePayments.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {tSell("payoutSetupModal.benefits.securePayments.description")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-selected flex items-center justify-center shrink-0">
              <Zap className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {tSell("payoutSetupModal.benefits.fastTransfers.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {tSell("payoutSetupModal.benefits.fastTransfers.description")}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleSetupPayouts}
            size="lg"
            className="w-full"
          >
            <Wallet className="size-5 mr-2" />
            {tSell("setupPayouts")}
            <ArrowRight className="size-5 ml-2" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {tSell("payoutSetupModal.later")}
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-muted-foreground">
          {tSell("payoutSetupModal.note")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
