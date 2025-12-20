"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, MapPin, Globe, Truck } from "@phosphor-icons/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { SellFormData } from "../_lib/schema";

interface ShippingSectionProps {
  form: UseFormReturn<SellFormData>;
  locale?: string;
}

const SHIPPING_REGIONS = [
  { key: "bulgaria" as const, icon: MapPin, label: "Bulgaria", labelBg: "България" },
  { key: "europe" as const, icon: Truck, label: "Europe", labelBg: "Европа" },
  { key: "worldwide" as const, icon: Globe, label: "Worldwide", labelBg: "По света" },
  { key: "pickup" as const, icon: Package, label: "Local pickup", labelBg: "Лично предаване" },
];

export function ShippingSection({ form, locale = "en" }: ShippingSectionProps) {
  const isBg = locale === "bg";
  const freeShipping = form.watch("freeShipping");

  return (
    <div className="space-y-6">
      {/* Shipping Regions */}
      <div>
        <FormLabel className="text-sm font-medium mb-3 block">
          {isBg ? "Доставка до" : "Ships to"}
        </FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {SHIPPING_REGIONS.map(({ key, icon: Icon, label, labelBg }) => (
            <FormField
              key={key}
              control={form.control}
              name={`shippingRegions.${key}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                        field.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="text-sm">{isBg ? labelBg : label}</span>
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Free Shipping Toggle */}
      <FormField
        control={form.control}
        name="freeShipping"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                {isBg ? "Безплатна доставка" : "Free shipping"}
              </FormLabel>
              <FormDescription>
                {isBg 
                  ? "Ще покриеш разходите за доставка"
                  : "You'll cover shipping costs"}
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Shipping Price (if not free) */}
      {!freeShipping && (
        <FormField
          control={form.control}
          name="shippingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isBg ? "Цена за доставка" : "Shipping price"}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    лв
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
