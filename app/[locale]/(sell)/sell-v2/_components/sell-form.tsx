"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Rocket, Spinner, House, CaretLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

import { PhotosSection } from "./photos-section";
import { DetailsSection } from "./details-section";
import { PricingSection } from "./pricing-section";
import { ShippingSection } from "./shipping-section";
import {
  sellFormSchema,
  defaultFormValues,
  calculateProgress,
  type SellFormData,
} from "../_lib/schema";

interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  children?: Category[];
}

interface SellFormProps {
  sellerId: string;
  categories: Category[];
  locale?: string;
}

export function SellForm({ sellerId, categories, locale = "en" }: SellFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isBg = locale === "bg";

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const formValues = form.watch();
  const { percentage, items } = calculateProgress(formValues);
  const isComplete = percentage === 100;

  const onSubmit = (data: SellFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, sellerId }),
        });

        if (!res.ok) throw new Error("Failed to create listing");

        const { product } = await res.json();
        toast.success(isBg ? "Обявата е публикувана!" : "Listing published!");
        router.push(`/${locale}/products/${product.id}`);
      } catch {
        toast.error(isBg ? "Грешка при публикуване" : "Failed to publish");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <CaretLeft className="size-4" weight="bold" />
            <House className="size-5" />
          </Link>

          <div className="flex-1 max-w-xs flex items-center gap-3">
            <Progress value={percentage} className="h-2" />
            <span className={cn(
              "text-xs font-semibold tabular-nums",
              isComplete ? "text-green-600" : "text-muted-foreground"
            )}>
              {percentage}%
            </span>
          </div>

          
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-[1fr_280px] gap-6">
              {/* Main Form Sections */}
              <div className="space-y-6">
                {/* Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isBg ? "Снимки" : "Photos"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PhotosSection
                      images={formValues.images}
                      onChange={(images) => form.setValue("images", images, { shouldValidate: true })}
                      error={form.formState.errors.images?.message}
                    />
                  </CardContent>
                </Card>

                {/* Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isBg ? "Детайли" : "Details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailsSection form={form} categories={categories} locale={locale} />
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isBg ? "Цена" : "Pricing"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PricingSection form={form} locale={locale} />
                  </CardContent>
                </Card>

                {/* Shipping */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isBg ? "Доставка" : "Shipping"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ShippingSection form={form} locale={locale} />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-20 space-y-4">
                  {/* Checklist */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        {isBg ? "Списък" : "Checklist"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {items.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-xs border",
                            item.done
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-border text-muted-foreground"
                          )}>
                            {item.done ? "✓" : ""}
                          </div>
                          <span className={cn(
                            "text-sm",
                            item.done ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {isBg ? item.labelBg : item.label}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Submit Button (Desktop) */}
                  <Button
                    type="submit"
                    disabled={isPending || !isComplete}
                    className="w-full h-12 gap-2"
                  >
                    {isPending ? (
                      <>
                        <Spinner className="size-5 animate-spin" />
                        {isBg ? "Публикуване..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <Rocket className="size-5" weight="bold" />
                        {isBg ? "Публикувай" : "Publish"}
                      </>
                    )}
                  </Button>
                </div>
              </aside>
            </div>

            {/* Mobile Submit Button */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-background border-t">
              <Button
                type="submit"
                disabled={isPending || !isComplete}
                className="w-full h-12 gap-2"
              >
                {isPending ? (
                  <>
                    <Spinner className="size-5 animate-spin" />
                    {isBg ? "Публикуване..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Rocket className="size-5" weight="bold" />
                    {isBg ? "Публикувай" : "Publish"} ({percentage}%)
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>

      {/* Spacer for fixed mobile button */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
