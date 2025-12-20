"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CONDITION_OPTIONS, type SellFormData } from "../_lib/schema";

interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  children?: Category[];
}

interface DetailsSectionProps {
  form: UseFormReturn<SellFormData>;
  categories: Category[];
  locale?: string;
}

export function DetailsSection({ form, categories, locale = "en" }: DetailsSectionProps) {
  const isBg = locale === "bg";

  // Flatten categories for simple select (in real app, use proper category picker)
  const flatCategories = flattenCategories(categories);

  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isBg ? "Заглавие" : "Title"} <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder={isBg ? "Напр. iPhone 15 Pro Max 256GB" : "e.g. iPhone 15 Pro Max 256GB"}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isBg ? "Категория" : "Category"} <span className="text-destructive">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isBg ? "Избери категория" : "Select category"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {flatCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {isBg && cat.name_bg ? cat.name_bg : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isBg ? "Състояние" : "Condition"} <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {CONDITION_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={cn(
                      "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                      field.value === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="text-sm">{isBg ? option.labelBg : option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Brand */}
      <FormField
        control={form.control}
        name="brandName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isBg ? "Марка" : "Brand"}</FormLabel>
            <FormControl>
              <Input
                placeholder={isBg ? "Напр. Apple, Nike, Samsung" : "e.g. Apple, Nike, Samsung"}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel>{isBg ? "Описание" : "Description"}</FormLabel>
              <span className="text-xs text-muted-foreground">{field.value?.length || 0}/2000</span>
            </div>
            <FormControl>
              <Textarea
                placeholder={isBg 
                  ? "Опиши продукта подробно - състояние, размер, цвят, причина за продажба..." 
                  : "Describe your item - condition details, size, color, why you're selling..."}
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Helper to flatten category tree
function flattenCategories(categories: Category[], prefix = ""): Category[] {
  return categories.flatMap((cat) => {
    const name = prefix ? `${prefix} > ${cat.name}` : cat.name;
    const nameBg = prefix && cat.name_bg ? `${prefix} > ${cat.name_bg}` : cat.name_bg;
    const flat: Category[] = [{ ...cat, name, name_bg: nameBg || undefined }];
    
    if (cat.children?.length) {
      flat.push(...flattenCategories(cat.children, cat.name));
    }
    return flat;
  });
}
