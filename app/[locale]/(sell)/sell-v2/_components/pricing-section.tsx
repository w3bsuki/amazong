"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "@phosphor-icons/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_OPTIONS, type SellFormData } from "../_lib/schema";

interface PricingSectionProps {
  form: UseFormReturn<SellFormData>;
  locale?: string;
}

export function PricingSection({ form, locale = "en" }: PricingSectionProps) {
  const isBg = locale === "bg";
  const currency = form.watch("currency");
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.value === currency)?.symbol || "лв";

  return (
    <div className="space-y-6">
      {/* Price + Currency */}
      <div className="grid grid-cols-[1fr_100px] gap-3">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isBg ? "Цена" : "Price"} <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencySymbol}
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>&nbsp;</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      {/* Quantity */}
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isBg ? "Количество" : "Quantity"}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10"
                  onClick={() => field.onChange(Math.max(1, (field.value || 1) - 1))}
                  disabled={field.value <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="9999"
                  className="w-20 text-center"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10"
                  onClick={() => field.onChange(Math.min(9999, (field.value || 1) + 1))}
                  disabled={field.value >= 9999}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Accept Offers */}
      <FormField
        control={form.control}
        name="acceptOffers"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                {isBg ? "Приемай оферти" : "Accept offers"}
              </FormLabel>
              <FormDescription>
                {isBg 
                  ? "Позволи на купувачите да предлагат цена"
                  : "Allow buyers to make price offers"}
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
