import Image from "next/image";
import { toast } from "sonner";
import { Eye, House, Plus, Share, Zap as Lightning, CircleCheck as CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link, type Locale } from "@/i18n/routing";
import { BoostDialog } from "../../../_components/seller/boost-dialog";

type SellSuccessStateProps = {
  locale: Locale;
  createdProductHref: string | null;
  productId: string | null;
  productTitle: string;
  firstImageUrl: string | null;
  onNewListing: () => void;
};

export function SellSuccessState({
  locale,
  createdProductHref,
  productId,
  productTitle,
  firstImageUrl,
  onNewListing,
}: SellSuccessStateProps) {
  const tSell = useTranslations("Sell");
  const tCommon = useTranslations("Common");
  const tBoost = useTranslations("Boost");

  const handleShare = () => {
    const shareLocale = locale === "bg" ? "bg" : "en";
    const url = createdProductHref
      ? `${window.location.origin}/${shareLocale}${createdProductHref}`
      : `${window.location.origin}/${shareLocale}/sell`;

    if (navigator.share) {
      navigator.share({ title: productTitle, url });
      return;
    }

    navigator.clipboard.writeText(url);
    toast.success(tSell("success.linkCopied"));
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex h-(--control-primary) items-center justify-center md:h-14">
          <span className="text-sm font-medium text-muted-foreground">
            {tSell("success.headerStatus")}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="size-10 text-success-foreground" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{tSell("success.title")}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{tSell("success.description")}</p>
          </div>

          {firstImageUrl ? (
            <div className="bg-surface-subtle rounded-xl border border-border-subtle p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={firstImageUrl}
                  alt={productTitle}
                  width={80}
                  height={80}
                  sizes="80px"
                  className="size-20 rounded-xl object-cover"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-base truncate">{productTitle}</p>
                  <p className="text-sm text-muted-foreground">{tSell("success.listingActive")}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-4 pt-4">
            <Button asChild className="w-full h-(--control-primary) gap-2 bg-primary hover:bg-interactive-hover text-base font-semibold rounded-md">
              <Link href={createdProductHref || "/"}>
                <Eye className="size-5" />
                {tSell("success.viewListing")}
              </Link>
            </Button>

            {productId ? (
              <div className="space-y-2">
                <BoostDialog
                  product={{ id: productId, title: productTitle, is_boosted: false, boost_expires_at: null }}
                  locale={locale}
                  trigger={
                    <Button variant="outline" className="w-full h-(--control-primary) gap-2 rounded-md font-semibold">
                      <Lightning className="size-5 text-primary" />
                      {tBoost("title")}
                    </Button>
                  }
                />
                <p className="text-xs text-muted-foreground">{tBoost("description")}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-(--control-primary) gap-2 rounded-md font-medium"
                onClick={handleShare}
              >
                <Share className="size-5" />
                {tCommon("share")}
              </Button>

              <Button
                variant="outline"
                className="h-(--control-primary) gap-2 rounded-md font-medium"
                onClick={onNewListing}
              >
                <Plus className="size-5" />
                {tSell("success.newListing")}
              </Button>
            </div>

            <Button
              variant="ghost"
              asChild
              className="w-full h-(--control-primary) gap-2 text-muted-foreground hover:text-foreground rounded-md"
            >
              <Link href="/">
                <House className="size-5" />
                {tCommon("goToHomepage")}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
