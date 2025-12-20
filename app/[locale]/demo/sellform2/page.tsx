"use client";

import { useState, useCallback, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  Tag,
  CurrencyDollar,
  Eye,
  Check,
  CaretLeft,
  CaretRight,
  X,
  Sparkle,
  Package,
  Truck,
  Info,
  CheckCircle,
  SpinnerGap,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// =============================================================================
// SCHEMA - Simple, practical validation
// =============================================================================
const sellFormSchema = z.object({
  images: z.array(z.string().url()).min(1, "Add at least 1 photo").max(12),
  title: z.string().min(5, "Title needs 5+ characters").max(80),
  category: z.string().min(1, "Select a category"),
  condition: z.enum(["new", "like-new", "excellent", "good", "fair"]),
  description: z.string().max(2000).optional(),
  price: z.string().min(1, "Enter a price"),
  currency: z.enum(["BGN", "EUR", "USD"]).default("BGN"),
  quantity: z.number().int().min(1).max(999).default(1),
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

const defaultValues: SellFormData = {
  images: [],
  title: "",
  category: "",
  condition: "excellent",
  description: "",
  price: "",
  currency: "BGN",
  quantity: 1,
  freeShipping: false,
  shippingPrice: "",
};

// =============================================================================
// STEP CONFIGURATION
// =============================================================================
const STEPS = [
  { id: 1, label: "Photos", icon: Camera },
  { id: 2, label: "Details", icon: Tag },
  { id: 3, label: "Price", icon: CurrencyDollar },
  { id: 4, label: "Review", icon: Eye },
] as const;

const CONDITIONS = [
  { value: "new", label: "New with tags", description: "Never used, tags attached" },
  { value: "like-new", label: "Like new", description: "Worn once, no signs of wear" },
  { value: "excellent", label: "Excellent", description: "Minimal signs of wear" },
  { value: "good", label: "Good", description: "Some signs of wear" },
  { value: "fair", label: "Fair", description: "Visible wear, functional" },
];

const CATEGORIES = [
  { value: "clothing-women", label: "Women's Clothing" },
  { value: "clothing-men", label: "Men's Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags & Accessories" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "other", label: "Other" },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default function SellForm2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const values = form.watch();

  // Calculate progress
  const progress = calculateProgress(values);

  // Step validation
  const canProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return values.images.length > 0;
      case 2: return !!values.title && !!values.category && !!values.condition;
      case 3: return !!values.price && parseFloat(values.price) > 0;
      case 4: return true;
      default: return false;
    }
  }, [values]);

  const handleNext = useCallback(() => {
    if (canProceed(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  }, [canProceed, currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = form.handleSubmit(async (data) => {
    startTransition(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Submitted:", data);
      alert("Listing created successfully!");
    });
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Create Listing</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{progress}% complete</span>
              <Progress value={progress} className="w-20 sm:w-32 h-2" />
            </div>
          </div>
          
          {/* Step Indicator - Desktop */}
          <nav className="hidden md:flex items-center justify-between mt-4" aria-label="Form steps">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => canProceed(step.id - 1) && setCurrentStep(step.id)}
                    disabled={!canProceed(step.id - 1) && step.id !== 1}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      isActive && "bg-primary/10 text-primary",
                      isCompleted && "text-primary",
                      !isActive && !isCompleted && "text-muted-foreground",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center size-8 rounded-full text-sm font-medium",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "bg-muted"
                    )}>
                      {isCompleted ? <Check weight="bold" className="size-4" /> : <Icon className="size-4" />}
                    </span>
                    <span className="font-medium">{step.label}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-px mx-4",
                      isCompleted ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </nav>
          
          {/* Step Indicator - Mobile */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  currentStep === step.id ? "bg-primary" : 
                  currentStep > step.id ? "bg-primary/60" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && <StepPhotos form={form} />}
            {currentStep === 2 && <StepDetails form={form} />}
            {currentStep === 3 && <StepPricing form={form} />}
            {currentStep === 4 && <StepReview form={form} onEdit={setCurrentStep} />}
          </div>

          {/* Navigation */}
          <div className="sticky bottom-0 -mx-4 px-4 py-4 bg-background border-t mt-6">
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-1"
              >
                <CaretLeft className="size-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden">
                <span>Step {currentStep} of {STEPS.length}</span>
              </div>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed(currentStep)}
                  className="gap-1"
                >
                  <span>Continue</span>
                  <CaretRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending ? (
                    <>
                      <SpinnerGap className="size-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle weight="bold" className="size-4" />
                      <span>Publish Listing</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

// =============================================================================
// STEP 1: PHOTOS
// =============================================================================
function StepPhotos({ form }: { form: UseFormReturn<SellFormData> }) {
  const images = form.watch("images");
  const [dragActive, setDragActive] = useState(false);

  const handleAddImage = useCallback(() => {
    // Simulate image upload with placeholder
    const placeholders = [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    ];
    const randomImage = placeholders[Math.floor(Math.random() * placeholders.length)];
    const currentImages = form.getValues("images");
    if (currentImages.length < 12) {
      form.setValue("images", [...currentImages, randomImage], { shouldValidate: true });
    }
  }, [form]);

  const handleRemoveImage = useCallback((index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }, [form]);

  const handleSetPrimary = useCallback((index: number) => {
    const currentImages = form.getValues("images");
    const [primary] = currentImages.splice(index, 1);
    form.setValue("images", [primary, ...currentImages], { shouldValidate: true });
  }, [form]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Add photos</h2>
        <p className="text-muted-foreground mt-1">
          Great photos help your item sell faster. Add up to 12 photos.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onClick={handleAddImage}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleAddImage(); }}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          "hover:border-primary/50 hover:bg-primary/5",
          dragActive && "border-primary bg-primary/10",
          images.length === 0 ? "py-16" : "py-6"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "flex items-center justify-center rounded-full bg-muted",
            images.length === 0 ? "size-16" : "size-12"
          )}>
            <Camera className={cn(
              "text-muted-foreground",
              images.length === 0 ? "size-8" : "size-6"
            )} />
          </div>
          <div>
            <p className="font-medium">
              {images.length === 0 ? "Add photos" : "Add more photos"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {images.length}/12 photos • Click or drag to upload
            </p>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group bg-muted",
                index === 0 && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="size-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(index); }}
                    title="Set as cover"
                  >
                    <Sparkle className="size-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                  title="Remove"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
        <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Photo tips</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Use natural lighting for best results</li>
            <li>Show the item from multiple angles</li>
            <li>Include close-ups of any details or flaws</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// STEP 2: DETAILS
// =============================================================================
function StepDetails({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, formState: { errors }, watch, setValue } = form;
  const title = watch("title");
  const condition = watch("condition");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Item details</h2>
        <p className="text-muted-foreground mt-1">
          Help buyers find your item with accurate details.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Title</Label>
          <span className="text-xs text-muted-foreground">{title?.length || 0}/80</span>
        </div>
        <Input
          id="title"
          placeholder="e.g., Nike Air Max 90 - Size 42 - White"
          {...register("title")}
          aria-invalid={!!errors.title}
          className="h-11"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={watch("category")}
          onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
        >
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <Label>Condition</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => setValue("condition", cond.value as SellFormData["condition"], { shouldValidate: true })}
              className={cn(
                "flex flex-col items-start p-3 rounded-lg border text-left transition-all",
                "hover:border-primary/50",
                condition === cond.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border"
              )}
            >
              <span className="font-medium text-sm">{cond.label}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{cond.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description (optional)</Label>
          <span className="text-xs text-muted-foreground">{watch("description")?.length || 0}/2000</span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your item's features, measurements, or any defects..."
          rows={4}
          {...register("description")}
          className="resize-none"
        />
      </div>
    </div>
  );
}

// =============================================================================
// STEP 3: PRICING
// =============================================================================
function StepPricing({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, formState: { errors }, watch, setValue } = form;
  const freeShipping = watch("freeShipping");
  const currency = watch("currency");

  const currencySymbols: Record<string, string> = {
    BGN: "лв",
    EUR: "€",
    USD: "$",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Set your price</h2>
        <p className="text-muted-foreground mt-1">
          Price your item competitively to sell faster.
        </p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price")}
              aria-invalid={!!errors.price}
              className="h-12 text-lg pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currencySymbols[currency]}
            </span>
          </div>
          <Select
            value={currency}
            onValueChange={(value) => setValue("currency", value as SellFormData["currency"])}
          >
            <SelectTrigger className="w-24 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BGN">BGN</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={999}
          {...register("quantity", { valueAsNumber: true })}
          className="h-11 w-24"
        />
      </div>

      {/* Shipping */}
      <div className="space-y-4">
        <Label>Shipping</Label>
        
        <div className="space-y-2">
          {/* Free Shipping Option */}
          <button
            type="button"
            onClick={() => setValue("freeShipping", true)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
              "hover:border-primary/50",
              freeShipping
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border"
            )}
          >
            <div className={cn(
              "flex items-center justify-center size-5 rounded-full border-2",
              freeShipping ? "border-primary bg-primary" : "border-muted-foreground/30"
            )}>
              {freeShipping && <Check weight="bold" className="size-3 text-primary-foreground" />}
            </div>
            <div className="flex-1">
              <span className="font-medium">Free shipping</span>
              <p className="text-sm text-muted-foreground">Buyers love free shipping!</p>
            </div>
            <Truck className="size-5 text-muted-foreground" />
          </button>

          {/* Paid Shipping Option */}
          <button
            type="button"
            onClick={() => setValue("freeShipping", false)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
              "hover:border-primary/50",
              !freeShipping
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border"
            )}
          >
            <div className={cn(
              "flex items-center justify-center size-5 rounded-full border-2",
              !freeShipping ? "border-primary bg-primary" : "border-muted-foreground/30"
            )}>
              {!freeShipping && <Check weight="bold" className="size-3 text-primary-foreground" />}
            </div>
            <div className="flex-1">
              <span className="font-medium">Buyer pays shipping</span>
              {!freeShipping && (
                <div className="mt-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Shipping cost"
                    {...register("shippingPrice")}
                    className="h-9 w-32"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Fee Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-500">Selling fees</p>
          <p className="text-amber-800/80 dark:text-amber-500/80 mt-0.5">
            10% commission on the final sale price. No listing fees.
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// STEP 4: REVIEW
// =============================================================================
function StepReview({ 
  form, 
  onEdit 
}: { 
  form: UseFormReturn<SellFormData>; 
  onEdit: (step: number) => void;
}) {
  const values = form.watch();
  
  const categoryLabel = CATEGORIES.find(c => c.value === values.category)?.label || values.category;
  const conditionLabel = CONDITIONS.find(c => c.value === values.condition)?.label || values.condition;
  
  const currencySymbols: Record<string, string> = {
    BGN: "лв",
    EUR: "€",
    USD: "$",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Review your listing</h2>
        <p className="text-muted-foreground mt-1">
          Make sure everything looks good before publishing.
        </p>
      </div>

      {/* Preview Card */}
      <div className="border rounded-xl overflow-hidden bg-card">
        {/* Images */}
        {values.images.length > 0 && (
          <div className="relative aspect-4/3 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.images[0]}
              alt="Product"
              className="size-full object-cover"
            />
            {values.images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
                +{values.images.length - 1} more
              </div>
            )}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3"
              onClick={() => onEdit(1)}
            >
              Edit photos
            </Button>
          </div>
        )}

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{values.title || "Untitled"}</h3>
              <p className="text-sm text-muted-foreground mt-1">{categoryLabel}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold">
                {values.price || "0"} {currencySymbols[values.currency]}
              </p>
              {values.freeShipping && (
                <p className="text-sm text-green-600 dark:text-green-500">Free shipping</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md text-sm">
              <Package className="size-3.5" />
              {conditionLabel}
            </span>
            {values.quantity > 1 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md text-sm">
                Qty: {values.quantity}
              </span>
            )}
          </div>

          {/* Description */}
          {values.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {values.description}
            </p>
          )}

          {/* Edit Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button type="button" size="sm" variant="outline" onClick={() => onEdit(2)}>
              Edit details
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onEdit(3)}>
              Edit price
            </Button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <CheckCircle weight="fill" className="size-5 text-green-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-green-900 dark:text-green-500">Ready to publish!</p>
          <p className="text-green-800/80 dark:text-green-500/80 mt-0.5">
            Your listing looks great. Click "Publish Listing" to make it live.
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================
function calculateProgress(values: SellFormData): number {
  let completed = 0;
  const total = 5;

  if (values.images.length > 0) completed++;
  if (values.title.length >= 5) completed++;
  if (values.category) completed++;
  if (values.condition) completed++;
  if (values.price && parseFloat(values.price) > 0) completed++;

  return Math.round((completed / total) * 100);
}
