"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Camera,
  Plus,
  Star,
  Check,
  CaretRight,
  Tag,
  Package,
  Truck,
  Sparkle,
  Info,
  Warning,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trash,
  CloudCheck,
  Spinner,
  House,
  Globe,
  Percent,
  Handshake,
  TextT,
  MagnifyingGlass,
  DotsSixVertical,
  Eye,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// =============================================================================
// FORM SCHEMA
// =============================================================================
const sellFormSchema = z.object({
  // Photos
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        file: z.instanceof(File).optional(),
      })
    )
    .min(1, "Add at least 1 photo")
    .max(12, "Maximum 12 photos"),

  // Basic Info
  title: z.string().min(5, "Title needs at least 5 characters").max(80),
  category: z.string().min(1, "Select a category"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum([
    "new-with-tags",
    "new-without-tags",
    "like-new",
    "excellent",
    "good",
    "fair",
  ]),

  // Description
  description: z.string().max(2000).optional(),

  // Item Specifics
  attributes: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),

  // Pricing
  price: z.string().min(1, "Enter a price"),
  currency: z.enum(["BGN", "EUR", "USD"]).default("BGN"),
  compareAtPrice: z.string().optional(),
  quantity: z.number().min(1).max(9999).default(1),
  acceptOffers: z.boolean().default(false),
  minOfferPercent: z.number().min(50).max(99).optional(),

  // Shipping
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  shipsTo: z.array(z.string()).default(["bulgaria"]),
  processingDays: z.number().min(1).max(14).default(2),

  // Extras
  tags: z.array(z.string()).max(5).default([]),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// =============================================================================
// MOCK DATA
// =============================================================================
const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "💻",
    subcategories: ["Phones", "Laptops", "Tablets", "Accessories", "Gaming"],
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "👕",
    subcategories: ["Men", "Women", "Kids", "Shoes", "Bags"],
  },
  {
    id: "home",
    name: "Home & Garden",
    icon: "🏠",
    subcategories: ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    subcategories: ["Fitness", "Outdoor", "Team Sports", "Water Sports"],
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: "🎨",
    subcategories: ["Art", "Antiques", "Coins", "Trading Cards"],
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    subcategories: ["Parts", "Accessories", "Tools", "Car Care"],
  },
];

const CONDITIONS = [
  {
    value: "new-with-tags",
    label: "New with tags",
    description: "Brand new, never used, tags attached",
    color: "bg-emerald-500",
  },
  {
    value: "new-without-tags",
    label: "New without tags",
    description: "Brand new, never used",
    color: "bg-emerald-400",
  },
  {
    value: "like-new",
    label: "Like New",
    description: "Used once or twice, no signs of wear",
    color: "bg-blue-500",
  },
  {
    value: "excellent",
    label: "Excellent",
    description: "Gently used, minimal wear",
    color: "bg-blue-400",
  },
  {
    value: "good",
    label: "Good",
    description: "Some signs of wear",
    color: "bg-amber-500",
  },
  {
    value: "fair",
    label: "Fair",
    description: "Visible wear, may have flaws",
    color: "bg-orange-500",
  },
];

const SHIPPING_REGIONS = [
  { id: "bulgaria", label: "Bulgaria", icon: House, time: "1-3 days" },
  { id: "europe", label: "Europe", icon: Globe, time: "5-10 days" },
  { id: "worldwide", label: "Worldwide", icon: Globe, time: "10-21 days" },
];

// =============================================================================
// STEPPER NAVIGATION
// =============================================================================
const STEPS = [
  { id: "photos", label: "Photos", icon: Camera },
  { id: "details", label: "Details", icon: Package },
  { id: "pricing", label: "Pricing", icon: Tag },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "review", label: "Review", icon: Eye },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}: {
  steps: typeof STEPS;
  currentStep: StepId;
  onStepClick: (step: StepId) => void;
  completedSteps: Set<StepId>;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.has(step.id);
        const isPast = index < currentIndex;
        const isClickable = isCompleted || isPast || index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                isActive &&
                  "bg-primary text-primary-foreground shadow-sm",
                !isActive && isCompleted &&
                  "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
                !isActive && !isCompleted && isPast &&
                  "bg-muted text-muted-foreground hover:bg-muted/80",
                !isActive && !isCompleted && !isPast &&
                  "text-muted-foreground/50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  isActive && "bg-primary-foreground/20",
                  !isActive && isCompleted && "bg-emerald-200 dark:bg-emerald-800",
                  !isActive && !isCompleted && "bg-muted-foreground/10"
                )}
              >
                {isCompleted && !isActive ? (
                  <Check className="size-3.5" weight="bold" />
                ) : (
                  <Icon className="size-3.5" weight={isActive ? "fill" : "regular"} />
                )}
              </div>
              <span className="hidden lg:inline">{step.label}</span>
            </button>

            {index < steps.length - 1 && (
              <CaretRight
                className={cn(
                  "size-4 mx-1",
                  index < currentIndex
                    ? "text-emerald-500"
                    : "text-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// PHOTO UPLOAD SECTION
// =============================================================================
function PhotosStep({
  images,
  onImagesChange,
}: {
  images: SellFormData["images"];
  onImagesChange: (images: SellFormData["images"]) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: SellFormData["images"] = [];
      const maxSlots = 12 - images.length;

      Array.from(files)
        .slice(0, maxSlots)
        .forEach((file) => {
          if (file.type.startsWith("image/")) {
            newImages.push({
              id: crypto.randomUUID(),
              url: URL.createObjectURL(file),
              file,
            });
          }
        });

      onImagesChange([...images, ...newImages]);
    },
    [images, onImagesChange]
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    setDraggedIndex(index);
    onImagesChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Product Photos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to 12 photos. Drag to reorder. First photo is your cover image.
        </p>
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Existing Images */}
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden border-2 group cursor-grab active:cursor-grabbing transition-all",
              draggedIndex === index
                ? "border-primary scale-95 opacity-50"
                : "border-border hover:border-primary/50",
              index === 0 && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <Image
              src={image.url}
              alt={`Product ${index + 1}`}
              fill
              className="object-cover"
            />

            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary text-primary-foreground text-2xs px-1.5 py-0.5 gap-1">
                  <Star className="size-3" weight="fill" />
                  Cover
                </Badge>
              </div>
            )}

            {/* Drag Handle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/60 backdrop-blur-sm rounded-md p-1">
                <DotsSixVertical className="size-4 text-white" />
              </div>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
            >
              <Trash className="size-3.5" weight="bold" />
            </button>

            {/* Position Number */}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-2xs font-semibold px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < 12 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
              dragActive
                ? "border-primary bg-primary/5 scale-105"
                : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
            )}
          >
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center transition-colors",
                dragActive ? "bg-primary/20" : "bg-muted"
              )}
            >
              <Plus
                className={cn(
                  "size-5",
                  dragActive ? "text-primary" : "text-muted-foreground"
                )}
                weight="bold"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {images.length === 0 ? "Add photos" : `${12 - images.length} left`}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Tips */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkle className="size-4 text-primary" weight="fill" />
          Photo Tips for Better Sales
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" weight="bold" />
            Use natural lighting and a clean background
          </li>
          <li className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" weight="bold" />
            Show the item from multiple angles
          </li>
          <li className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" weight="bold" />
            Include close-ups of details, labels, and any flaws
          </li>
          <li className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" weight="bold" />
            Square photos (1:1) work best for listings
          </li>
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// DETAILS STEP
// =============================================================================
function DetailsStep({
  form,
}: {
  form: ReturnType<typeof useForm<SellFormData>>;
}) {
  const category = form.watch("category");
  const condition = form.watch("condition");
  const description = form.watch("description") || "";

  const selectedCategoryData = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-sm font-semibold">
            Title <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {form.watch("title")?.length || 0}/80
          </span>
        </div>
        <div className="relative">
          <TextT className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="title"
            {...form.register("title")}
            placeholder="e.g., iPhone 15 Pro Max 256GB Space Black - Like New"
            className="pl-10 h-11"
            maxLength={80}
          />
        </div>
        {form.formState.errors.title && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Warning className="size-3.5" />
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Category <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                form.setValue("category", cat.id);
                form.setValue("subcategory", undefined);
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                category === cat.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  category === cat.id ? "text-primary" : "text-foreground"
                )}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Subcategory */}
        {selectedCategoryData && (
          <div className="pt-3 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Subcategory
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryData.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => form.setValue("subcategory", sub)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm transition-all",
                    form.watch("subcategory") === sub
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Condition <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() =>
                form.setValue("condition", cond.value as SellFormData["condition"])
              }
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all",
                condition === cond.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className={cn("size-3 rounded-full mt-1 shrink-0", cond.color)}
              />
              <div>
                <span
                  className={cn(
                    "text-sm font-medium block",
                    condition === cond.value ? "text-primary" : "text-foreground"
                  )}
                >
                  {cond.label}
                </span>
                <span className="text-2xs text-muted-foreground">
                  {cond.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <Label htmlFor="brand" className="text-sm font-semibold">
          Brand <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="brand"
            {...form.register("brand")}
            placeholder="Search or type brand name..."
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-sm font-semibold">
            Description{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {description.length}/2000
          </span>
        </div>
        <div className="relative">
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Describe your item in detail. Include measurements, materials, flaws, and any other relevant information..."
            className="min-h-32 resize-none"
            maxLength={2000}
          />
        </div>

        {/* Quick description prompts */}
        <div className="flex flex-wrap gap-2">
          {[
            "Size & fit",
            "Material",
            "Color/pattern",
            "Included items",
            "Reason for selling",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() =>
                form.setValue(
                  "description",
                  `${description}${description ? "\n\n" : ""}${prompt}: `
                )
              }
              className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              + {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PRICING STEP
// =============================================================================
function PricingStep({
  form,
}: {
  form: ReturnType<typeof useForm<SellFormData>>;
}) {
  const price = form.watch("price");
  const compareAtPrice = form.watch("compareAtPrice");
  const currency = form.watch("currency");
  const quantity = form.watch("quantity");
  const acceptOffers = form.watch("acceptOffers");

  const currencySymbol = { BGN: "лв", EUR: "€", USD: "$" }[currency];

  const discount = useMemo(() => {
    if (!price || !compareAtPrice) return null;
    const p = parseFloat(price);
    const c = parseFloat(compareAtPrice);
    if (isNaN(p) || isNaN(c) || c <= p) return null;
    return Math.round(((c - p) / c) * 100);
  }, [price, compareAtPrice]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Set Your Price</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Price competitively to sell faster. You can always adjust later.
        </p>
      </div>

      {/* Price Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="price" className="text-sm font-semibold">
            Selling Price <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currencySymbol}
            </span>
            <Input
              id="price"
              {...form.register("price")}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="pl-10 pr-20 h-12 text-lg font-semibold"
            />
            <Select
              value={currency}
              onValueChange={(v) =>
                form.setValue("currency", v as SellFormData["currency"])
              }
            >
              <SelectTrigger className="absolute right-1 top-1/2 -translate-y-1/2 w-20 h-10 border-0 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BGN">BGN</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="compareAtPrice" className="text-sm font-semibold flex items-center gap-2">
            Compare at Price
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                Original retail price. Shows buyers how much they&apos;re saving.
              </TooltipContent>
            </Tooltip>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currencySymbol}
            </span>
            <Input
              id="compareAtPrice"
              {...form.register("compareAtPrice")}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="pl-10 h-12"
            />
          </div>
          {discount && (
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <Percent className="size-3 mr-1" />
              {discount}% off
            </Badge>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Quantity</Label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <button
              type="button"
              onClick={() => form.setValue("quantity", Math.max(1, quantity - 1))}
              className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
            >
              <span className="text-lg font-medium">−</span>
            </button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                form.setValue("quantity", Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 h-10 text-center border-0 focus-visible:ring-0"
              min={1}
              max={9999}
            />
            <button
              type="button"
              onClick={() =>
                form.setValue("quantity", Math.min(9999, quantity + 1))
              }
              className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
            >
              <span className="text-lg font-medium">+</span>
            </button>
          </div>
          <span className="text-sm text-muted-foreground">items available</span>
        </div>
      </div>

      {/* Accept Offers */}
      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Handshake className="size-5 text-primary" weight="duotone" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Accept Offers</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Let buyers make offers below your asking price
              </p>
            </div>
          </div>
          <Switch
            checked={acceptOffers}
            onCheckedChange={(v) => form.setValue("acceptOffers", v)}
          />
        </div>

        {acceptOffers && (
          <div className="pt-3 border-t border-border">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              Auto-decline offers below:
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={99}
                value={form.watch("minOfferPercent") || 70}
                onChange={(e) =>
                  form.setValue("minOfferPercent", parseInt(e.target.value))
                }
                className="flex-1 accent-primary"
              />
              <Badge variant="secondary" className="tabular-nums">
                {form.watch("minOfferPercent") || 70}%
              </Badge>
            </div>
            {price && (
              <p className="text-xs text-muted-foreground mt-2">
                Minimum offer:{" "}
                <span className="font-semibold text-foreground">
                  {currencySymbol}
                  {(
                    parseFloat(price) *
                    ((form.watch("minOfferPercent") || 70) / 100)
                  ).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SHIPPING STEP
// =============================================================================
function ShippingStep({
  form,
}: {
  form: ReturnType<typeof useForm<SellFormData>>;
}) {
  const freeShipping = form.watch("freeShipping");
  const shipsTo = form.watch("shipsTo");
  const processingDays = form.watch("processingDays");
  const currency = form.watch("currency");
  const currencySymbol = { BGN: "лв", EUR: "€", USD: "$" }[currency];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Shipping Options</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Free shipping increases sales by up to 40%
        </p>
      </div>

      {/* Free Shipping Toggle */}
      <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Truck className="size-5 text-primary" weight="duotone" />
            </div>
            <div>
              <Label className="text-sm font-semibold flex items-center gap-2">
                Free Shipping
                <Badge className="bg-emerald-100 text-emerald-700 text-2xs">
                  Recommended
                </Badge>
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Buyers love free shipping – listings sell faster
              </p>
            </div>
          </div>
          <Switch
            checked={freeShipping}
            onCheckedChange={(v) => form.setValue("freeShipping", v)}
          />
        </div>
      </div>

      {/* Shipping Price (if not free) */}
      {!freeShipping && (
        <div className="space-y-3">
          <Label htmlFor="shippingPrice" className="text-sm font-semibold">
            Shipping Price
          </Label>
          <div className="relative w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currencySymbol}
            </span>
            <Input
              id="shippingPrice"
              {...form.register("shippingPrice")}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="pl-10 h-11"
            />
          </div>
        </div>
      )}

      {/* Shipping Regions */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Ships To</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SHIPPING_REGIONS.map((region) => {
            const Icon = region.icon;
            const isSelected = shipsTo.includes(region.id);

            return (
              <label
                key={region.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      form.setValue("shipsTo", [...shipsTo, region.id]);
                    } else {
                      form.setValue(
                        "shipsTo",
                        shipsTo.filter((s) => s !== region.id)
                      );
                    }
                  }}
                />
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                  <Icon
                    className={cn(
                      "size-4",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                    weight="duotone"
                  />
                </div>
                <div className="flex-1">
                  <span
                    className={cn(
                      "text-sm font-medium block",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {region.label}
                  </span>
                  <span className="text-2xs text-muted-foreground">
                    {region.time}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Processing Time */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Processing Time</Label>
        <div className="flex items-center gap-3">
          <Select
            value={processingDays.toString()}
            onValueChange={(v) => form.setValue("processingDays", parseInt(v))}
          >
            <SelectTrigger className="w-40 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 5, 7, 10, 14].map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} {days === 1 ? "day" : "days"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Time to ship after sale
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// REVIEW STEP
// =============================================================================
function ReviewStep({
  form,
}: {
  form: ReturnType<typeof useForm<SellFormData>>;
}) {
  const data = form.getValues();
  const currencySymbol = { BGN: "лв", EUR: "€", USD: "$" }[data.currency];
  const categoryData = CATEGORIES.find((c) => c.id === data.category);
  const conditionData = CONDITIONS.find((c) => c.value === data.condition);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Review Your Listing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Double-check everything before publishing
        </p>
      </div>

      {/* Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Preview */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted relative">
            {data.images[0] ? (
              <Image
                src={data.images[0].url}
                alt={data.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="size-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {data.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {data.images.slice(1, 6).map((img, i) => (
                <div
                  key={img.id}
                  className="size-16 rounded-lg overflow-hidden border border-border shrink-0 relative"
                >
                  <Image
                    src={img.url}
                    alt={`${data.title} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {data.images.length > 6 && (
                <div className="size-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-muted-foreground">
                    +{data.images.length - 6}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {data.title || "Untitled Listing"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {categoryData && (
                <Badge variant="secondary" className="text-xs">
                  {categoryData.icon} {categoryData.name}
                </Badge>
              )}
              {conditionData && (
                <Badge
                  className={cn(
                    "text-xs text-white",
                    conditionData.color
                  )}
                >
                  {conditionData.label}
                </Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {currencySymbol}
              {data.price || "0.00"}
            </span>
            {data.compareAtPrice && (
              <span className="text-base text-muted-foreground line-through">
                {currencySymbol}
                {data.compareAtPrice}
              </span>
            )}
            {data.acceptOffers && (
              <Badge variant="outline" className="text-xs ml-2">
                <Handshake className="size-3 mr-1" />
                Accepts Offers
              </Badge>
            )}
          </div>

          {/* Quantity */}
          <p className="text-sm text-muted-foreground">
            {data.quantity} {data.quantity === 1 ? "item" : "items"} available
          </p>

          {/* Description Preview */}
          {data.description && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.description}
              </p>
            </div>
          )}

          {/* Shipping Info */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="size-4 text-muted-foreground" />
              {data.freeShipping ? (
                <span className="text-emerald-600 font-medium">Free shipping</span>
              ) : data.shippingPrice ? (
                <span>
                  {currencySymbol}
                  {data.shippingPrice} shipping
                </span>
              ) : (
                <span className="text-muted-foreground">Shipping not set</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {data.shipsTo.map((region) => {
                const regionData = SHIPPING_REGIONS.find((r) => r.id === region);
                return regionData ? (
                  <Badge key={region} variant="secondary" className="text-2xs">
                    {regionData.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Final Checklist</h4>
        <div className="space-y-2">
          {[
            { label: "At least 1 photo added", ok: data.images.length > 0 },
            { label: "Title is descriptive", ok: data.title?.length >= 10 },
            { label: "Category selected", ok: !!data.category },
            { label: "Condition specified", ok: !!data.condition },
            { label: "Price set", ok: !!data.price },
            { label: "Shipping options configured", ok: data.shipsTo.length > 0 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              {item.ok ? (
                <CheckCircle className="size-4 text-emerald-500" weight="fill" />
              ) : (
                <Warning className="size-4 text-amber-500" />
              )}
              <span
                className={cn(
                  item.ok ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SIDEBAR PREVIEW
// =============================================================================
function LivePreview({
  form,
}: {
  form: ReturnType<typeof useForm<SellFormData>>;
}) {
  const data = form.watch();
  const currencySymbol = { BGN: "лв", EUR: "€", USD: "$" }[data.currency];
  const categoryData = CATEGORIES.find((c) => c.id === data.category);

  return (
    <div className="sticky top-6 p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Live Preview</h4>
        <Badge variant="secondary" className="text-2xs">
          Desktop
        </Badge>
      </div>

      {/* Mini Product Card */}
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="aspect-4/3 bg-muted relative">
          {data.images[0] ? (
            <Image
              src={data.images[0].url}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="size-8 text-muted-foreground/30" />
            </div>
          )}
          {data.freeShipping && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-emerald-500 text-white text-2xs">
                Free Shipping
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {data.title || "Your product title..."}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground">
              {currencySymbol}
              {data.price || "0.00"}
            </span>
            {data.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {currencySymbol}
                {data.compareAtPrice}
              </span>
            )}
          </div>
          {categoryData && (
            <p className="text-2xs text-muted-foreground">
              {categoryData.icon} {categoryData.name}
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded-lg bg-muted">
          <span className="text-lg font-bold text-foreground">
            {data.images.length}
          </span>
          <p className="text-2xs text-muted-foreground">Photos</p>
        </div>
        <div className="p-2 rounded-lg bg-muted">
          <span className="text-lg font-bold text-foreground">
            {data.quantity}
          </span>
          <p className="text-2xs text-muted-foreground">Quantity</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN FORM COMPONENT
// =============================================================================
export function SellFormDemo({ locale: _locale }: { locale: string }) {
  const [currentStep, setCurrentStep] = useState<StepId>("photos");
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      images: [],
      title: "",
      category: "",
      subcategory: undefined,
      brand: "",
      condition: "excellent",
      description: "",
      attributes: [],
      price: "",
      currency: "BGN",
      compareAtPrice: "",
      quantity: 1,
      acceptOffers: false,
      minOfferPercent: 70,
      freeShipping: true,
      shippingPrice: "",
      shipsTo: ["bulgaria"],
      processingDays: 2,
      tags: [],
    },
    mode: "onChange",
  });

  // Watch all form values for progress calculation
  const watchedValues = form.watch();
  
  // Calculate progress
  const progress = useMemo(() => {
    let score = 0;
    const total = 6;

    if (watchedValues.images.length > 0) score++;
    if (watchedValues.title?.length >= 5) score++;
    if (watchedValues.category) score++;
    if (watchedValues.condition) score++;
    if (watchedValues.price) score++;
    if (watchedValues.shipsTo.length > 0) score++;

    return Math.round((score / total) * 100);
  }, [watchedValues]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    console.log("Form submitted:", data);
    // Handle submission
  });

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 800);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Progress */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Exit</span>
              </Button>
              <div className="hidden md:flex items-center gap-3">
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm font-medium tabular-nums text-muted-foreground">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Center: Steps */}
            <StepIndicator
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              completedSteps={completedSteps}
            />

            {/* Right: Save Status */}
            <div className="flex items-center gap-3">
              {isSaving ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="size-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CloudCheck className="size-4 text-emerald-500" />
                  <span className="hidden sm:inline">Saved</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Form Area */}
          <div className="flex-1 max-w-3xl">
            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
                {currentStep === "photos" && (
                  <PhotosStep
                    images={form.watch("images")}
                    onImagesChange={(images) => form.setValue("images", images)}
                  />
                )}
                {currentStep === "details" && <DetailsStep form={form} />}
                {currentStep === "pricing" && <PricingStep form={form} />}
                {currentStep === "shipping" && <ShippingStep form={form} />}
                {currentStep === "review" && <ReviewStep form={form} />}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={currentStepIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>

                {currentStep === "review" ? (
                  <Button
                    type="submit"
                    size="lg"
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="size-5" weight="fill" />
                    Publish Listing
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    size="lg"
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="size-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar Preview (Desktop Only) */}
          <aside className="hidden xl:block w-72">
            <LivePreview form={form} />
          </aside>
        </div>
      </main>
    </div>
  );
}
