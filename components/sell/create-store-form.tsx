"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Storefront,
  Sparkle,
  ArrowRight,
  SpinnerGap,
  Warning,
  Check,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { storeSchema, type StoreFormData } from "./schemas";
import type { Seller } from "./types";

interface CreateStoreFormProps {
  onStoreCreated: (seller: Seller) => void;
}

export function CreateStoreForm({ onStoreCreated }: CreateStoreFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: { storeName: "" },
  });

  const onSubmit = (data: StoreFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeName: data.storeName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create store");
        }

        const seller = await response.json();
        onStoreCreated(seller);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-amber-500 mb-4">
              <Sparkle weight="bold" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Create Your Store
            </h1>
            <p className="text-muted-foreground">
              Choose a unique name for your store. This will be visible to buyers.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Store Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Storefront className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="My Awesome Store"
                          className="pl-12 h-12 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      This is how customers will identify your store
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div
                  className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
                  role="alert"
                >
                  <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <Warning weight="bold" className="size-4 text-destructive" />
                  </div>
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full h-11 text-base font-medium"
              >
                {isPending ? (
                  <>
                    <SpinnerGap className="mr-2 size-4" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    Create Store
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {/* Benefits list */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">What you get</p>
            <ul className="grid grid-cols-2 gap-3">
              {[
                "Unlimited listings",
                "Secure payments",
                "Analytics dashboard",
                "Customer messaging",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check weight="bold" className="size-3 text-emerald-600" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
