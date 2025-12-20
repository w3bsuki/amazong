"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Camera,
  X,
  Sparkle,
  Package,
  Tag,
  Truck,
  Check,
  CaretRight,
  ArrowLeft,
  Info,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldContent,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";

// =============================================================================
// Schema
// =============================================================================
const sellFormSchema = z.object({
  images: z
    .array(z.string())
    .min(1, "Add at least 1 photo")
    .max(8, "Maximum 8 photos"),
  title: z
    .string()
    .min(3, "Title needs at least 3 characters")
    .max(80, "Title is too long"),
  category: z.string().min(1, "Select a category"),
  condition: z.enum([
    "new-with-tags",
    "new-without-tags",
    "like-new",
    "good",
    "fair",
  ]),
  description: z.string().max(2000).optional(),
  price: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
    message: "Enter a valid price",
  }),
  acceptOffers: z.boolean().default(false),
  shipping: z.enum(["standard", "express", "pickup"]).default("standard"),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// =============================================================================
// Constants
// =============================================================================
const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports" },
  { value: "toys", label: "Toys & Games" },
  { value: "books", label: "Books" },
  { value: "other", label: "Other" },
];

const CONDITIONS = [
  { value: "new-with-tags", label: "New with tags", desc: "Brand new, unused" },
  { value: "new-without-tags", label: "New without tags", desc: "New, no tags" },
  { value: "like-new", label: "Like new", desc: "Barely used" },
  { value: "good", label: "Good", desc: "Minor signs of use" },
  { value: "fair", label: "Fair", desc: "Visible wear" },
];

const STEPS = [
  { id: 1, title: "Photos", icon: Camera },
  { id: 2, title: "Details", icon: Package },
  { id: 3, title: "Price", icon: Tag },
  { id: 4, title: "Shipping", icon: Truck },
];

// =============================================================================
// Demo Images (placeholder)
// =============================================================================
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
];

// =============================================================================
// Main Component
// =============================================================================
export default function SellFormDemo() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      images: [],
      title: "",
      category: "",
      condition: "like-new",
      description: "",
      price: "",
      acceptOffers: false,
      shipping: "standard",
    },
    mode: "onChange",
  });

  const { watch, setValue, control, handleSubmit, formState } = form;
  const images = watch("images");
  const values = watch();

  // Calculate progress
  const getProgress = useCallback(() => {
    let completed = 0;
    if (images.length > 0) completed++;
    if (values.title && values.category && values.condition) completed++;
    if (values.price) completed++;
    if (values.shipping) completed++;
    return (completed / 4) * 100;
  }, [images, values]);

  // Add demo image
  const addDemoImage = () => {
    if (images.length >= 8) return;
    const nextImg = DEMO_IMAGES[images.length % DEMO_IMAGES.length];
    setValue("images", [...images, nextImg]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  // Navigation
  const canGoNext = useCallback(() => {
    switch (step) {
      case 1:
        return images.length > 0;
      case 2:
        return !!values.title && !!values.category && !!values.condition;
      case 3:
        return !!values.price;
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, images, values]);

  const goNext = () => {
    if (step < 4 && canGoNext()) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Submit
  const onSubmit = async (data: SellFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Form submitted:", data);
    toast.success("Listing created successfully!");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={goBack} disabled={step === 1}>
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-semibold">Create Listing</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 4</p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Save draft
          </Button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </header>

      {/* Step indicators - Mobile */}
      <div className="border-b px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isComplete = step > s.id;
            return (
              <button
                key={s.id}
                onClick={() => s.id <= step && setStep(s.id)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive && "text-primary",
                  isComplete && "text-primary",
                  !isActive && !isComplete && "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-all",
                    isActive && "border-primary bg-primary/10",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isComplete && "border-muted-foreground/30"
                  )}
                >
                  {isComplete ? (
                    <Check className="size-5" weight="bold" />
                  ) : (
                    <Icon className="size-5" weight={isActive ? "fill" : "regular"} />
                  )}
                </div>
                <span className="text-[10px] font-medium">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl p-4 pb-32 md:p-6 md:pb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Photos */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Add photos</h2>
                <p className="text-sm text-muted-foreground">
                  Add up to 8 photos. The first photo will be your cover.
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {/* Upload Button - First position */}
                <button
                  type="button"
                  onClick={addDemoImage}
                  disabled={images.length >= 8}
                  className={cn(
                    "group relative aspect-square rounded-xl border-2 border-dashed transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    images.length === 0
                      ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
                      : ""
                  )}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Camera className="size-6" weight="fill" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {images.length === 0 ? "Add photos" : "Add more"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {images.length}/8
                    </span>
                  </div>
                </button>

                {/* Image Previews */}
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-xl bg-muted",
                      idx === 0 && images.length > 0 && "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        Cover
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tips Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex gap-3 p-4">
                  <Sparkle className="size-5 shrink-0 text-primary" weight="fill" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">Photo tips</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use natural lighting</li>
                      <li>• Show all angles and details</li>
                      <li>• Include any flaws or damage</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {formState.errors.images && (
                <FieldError>{formState.errors.images.message}</FieldError>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Item details</h2>
                <p className="text-sm text-muted-foreground">
                  Describe what you&apos;re selling.
                </p>
              </div>

              <FieldGroup className="gap-5">
                {/* Title */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        placeholder="e.g., iPhone 14 Pro Max 256GB"
                        aria-invalid={fieldState.invalid}
                        className="h-12 text-base"
                      />
                      <FieldDescription>
                        {field.value.length}/80 characters
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Category */}
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="category"
                          className="h-12 w-full text-base"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Condition */}
                <Controller
                  name="condition"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Condition</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-2"
                      >
                        {CONDITIONS.map((cond) => (
                          <label
                            key={cond.value}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
                              "hover:border-primary/50 hover:bg-accent/50",
                              field.value === cond.value &&
                                "border-primary bg-primary/5 ring-1 ring-primary"
                            )}
                          >
                            <RadioGroupItem value={cond.value} />
                            <div className="flex-1">
                              <p className="font-medium">{cond.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {cond.desc}
                              </p>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Description */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Description{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Describe your item: brand, model, features, any flaws..."
                        className="min-h-[120px] text-base"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        {field.value?.length || 0}/2000 characters
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Set your price</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a competitive price to sell faster.
                </p>
              </div>

              <FieldGroup className="gap-5">
                {/* Price Input */}
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price">Price</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                          $
                        </span>
                        <Input
                          {...field}
                          id="price"
                          type="number"
                          inputMode="decimal"
                          placeholder="0.00"
                          className="h-14 pl-8 text-2xl font-semibold"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Accept Offers Toggle */}
                <Controller
                  name="acceptOffers"
                  control={control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="acceptOffers">
                          Accept offers
                        </FieldLabel>
                        <FieldDescription>
                          Let buyers make offers on your item
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id="acceptOffers"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />

                {/* Earnings Preview */}
                {values.price && Number(values.price) > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Item price</span>
                        <span>${Number(values.price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          Selling fee (10%)
                          <Info className="size-3.5" />
                        </span>
                        <span>-${(Number(values.price) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">You&apos;ll earn</span>
                          <span className="text-xl font-bold text-primary">
                            ${(Number(values.price) * 0.9).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </FieldGroup>
            </div>
          )}

          {/* Step 4: Shipping */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Shipping options</h2>
                <p className="text-sm text-muted-foreground">
                  How will you send this item?
                </p>
              </div>

              <Controller
                name="shipping"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3"
                  >
                    {[
                      {
                        value: "standard",
                        label: "Standard shipping",
                        desc: "3-5 business days",
                        price: "Free",
                      },
                      {
                        value: "express",
                        label: "Express shipping",
                        desc: "1-2 business days",
                        price: "$9.99",
                      },
                      {
                        value: "pickup",
                        label: "Local pickup",
                        desc: "Buyer collects in person",
                        price: "Free",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all",
                          "hover:border-primary/50 hover:bg-accent/50",
                          field.value === option.value &&
                            "border-primary bg-primary/5 ring-1 ring-primary"
                        )}
                      >
                        <RadioGroupItem value={option.value} />
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.desc}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            option.price === "Free"
                              ? "text-green-600 dark:text-green-500"
                              : "text-foreground"
                          )}
                        >
                          {option.price}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />

              {/* Summary Card */}
              <Card className="mt-8">
                <CardContent className="space-y-4 p-4">
                  <h3 className="font-semibold">Listing summary</h3>
                  <div className="flex gap-3">
                    {images[0] && (
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={images[0]}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {values.title || "Untitled"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {CATEGORIES.find((c) => c.value === values.category)?.label ||
                          "No category"}
                      </p>
                      <p className="mt-1 text-lg font-bold text-primary">
                        ${Number(values.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Desktop Submit Button */}
          <div className="mt-8 hidden md:flex md:gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={goBack}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                type="button"
                size="lg"
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex-1"
              >
                Continue
                <CaretRight className="size-4" weight="bold" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !formState.isValid}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="size-4" weight="bold" />
                    Publish listing
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 md:hidden">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={goBack}
              className="h-12"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              size="lg"
              onClick={goNext}
              disabled={!canGoNext()}
              className="h-12 flex-1 text-base"
            >
              Continue
              <CaretRight className="size-5" weight="bold" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !formState.isValid}
              className="h-12 flex-1 text-base"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="size-5" weight="bold" />
                  Publish listing
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
