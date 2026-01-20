"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Camera,
  X,
  Check,
  CaretLeft,
  ArrowRight,
  Rocket,
  Star,
  Package,
  Tag,
  Truck,
  Sparkle,
  Plus,
  ImageSquare,
  CheckCircle,
  Eye,
  House,
  Share,
  Minus,
  CurrencyDollar,
  MapPin,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// ============================================================================
// DEMO SELL2 - World-class mobile-first sell form
// Premium UI/UX with beautiful transitions, proper touch targets, and 
// exceptional attention to detail. Following all design system rules.
// ============================================================================

// Types
interface ProductImage {
  id: string;
  url: string;
  isPrimary?: boolean;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  condition: string;
  price: string;
  currency: string;
  quantity: number;
  acceptOffers: boolean;
  shippingPrice: string;
  sellerCity: string;
  images: ProductImage[];
}

// Constants
const STEPS = [
  { id: 1, label: "Photos", icon: Camera },
  { id: 2, label: "Details", icon: Package },
  { id: 3, label: "Price", icon: Tag },
  { id: 4, label: "Review", icon: CheckCircle },
];

const CONDITIONS = [
  { value: "new", label: "New with tags", description: "Brand new, never worn/used" },
  { value: "likenew", label: "Like new", description: "Worn once or twice, perfect condition" },
  { value: "good", label: "Good", description: "Gently used, minor signs of wear" },
  { value: "fair", label: "Fair", description: "Some wear, all flaws disclosed" },
];

const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "home", name: "Home & Garden", icon: "🏠" },
  { id: "sports", name: "Sports & Outdoors", icon: "⚽" },
  { id: "collectibles", name: "Collectibles", icon: "🎭" },
  { id: "toys", name: "Toys & Games", icon: "🎮" },
];

const CITIES = [
  "Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven"
];

// ============================================================================
// Step Progress Indicator
// ============================================================================
function StepIndicator({ 
  currentStep, 
  totalSteps 
}: { 
  currentStep: number; 
  totalSteps: number 
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            idx < currentStep 
              ? "w-6 bg-primary" 
              : idx === currentStep 
                ? "w-6 bg-primary/40" 
                : "w-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Photo Upload Section - Beautiful drag & drop with preview
// ============================================================================
function PhotoUploadSection({
  images,
  onAddImages,
  onRemoveImage,
  onSetPrimary,
}: {
  images: ProductImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onSetPrimary: (id: string) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onAddImages(acceptedFiles);
    },
    [onAddImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 12 - images.length,
  });

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Camera className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Add photos
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Great photos help your item sell faster. Add up to 12 photos.
        </p>
      </div>

      {/* Photo grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden group",
                idx === 0 && "col-span-2 row-span-2"
              )}
            >
              <img
                src={image.url}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-foreground/90 text-background text-2xs font-bold px-2 py-0.5">
                    <Star className="w-3 h-3 mr-1" weight="fill" />
                    Cover
                  </Badge>
                </div>
              )}
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors" />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemoveImage(image.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
              {/* Set as cover */}
              {!image.isPrimary && idx !== 0 && (
                <button
                  type="button"
                  onClick={() => onSetPrimary(image.id)}
                  className="absolute bottom-2 left-2 right-2 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm text-2xs font-bold text-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
                >
                  Set as cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < 12 && (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer",
            "min-h-44 touch-action-manipulation",
            isDragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 bg-muted/30",
            images.length > 0 && "min-h-32"
          )}
        >
          <input {...getInputProps()} />
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border mb-3",
            isDragActive && "bg-primary/10 border-primary/30"
          )}>
            {isDragActive ? (
              <Plus className="w-5 h-5 text-primary" weight="bold" />
            ) : (
              <Camera className="w-5 h-5 text-muted-foreground" weight="bold" />
            )}
          </div>
          <p className="text-sm font-semibold text-foreground">
            {isDragActive ? "Drop photos here" : images.length > 0 ? "Add more photos" : "Tap to add photos"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {images.length}/12 photos • JPG, PNG, WebP
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
        <Sparkle className="w-5 h-5 text-primary shrink-0 mt-0.5" weight="fill" />
        <div>
          <p className="text-sm font-medium text-foreground">Pro tip</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Show multiple angles, include close-ups of details, and photograph any flaws.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Details Section - Title, Category, Condition
// ============================================================================
function DetailsSection({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);

  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Package className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Item details
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Help buyers find your item with accurate details.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g., iPhone 15 Pro Max 256GB"
              maxLength={80}
              className="h-12 text-base font-medium bg-background border-border/60 rounded-xl pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground tabular-nums">
              {data.title.length}/80
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <Drawer open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full flex items-center justify-between h-12 px-4 rounded-xl border transition-colors text-left",
                  data.categoryId
                    ? "border-border/60 bg-background"
                    : "border-dashed border-border bg-muted/30"
                )}
              >
                <span className={cn(
                  "text-base",
                  data.categoryId ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {data.categoryName || "Select a category"}
                </span>
                <CaretRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-border/50">
                <DrawerTitle className="text-lg font-bold">Select Category</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onChange({ categoryId: cat.id, categoryName: cat.name });
                      setIsCategoryOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      data.categoryId === cat.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    {data.categoryId === cat.id && (
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                    )}
                  </button>
                ))}
              </div>
              <div className="h-8" />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Condition <span className="text-destructive">*</span>
          </label>
          <Drawer open={isConditionOpen} onOpenChange={setIsConditionOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full flex items-center justify-between h-12 px-4 rounded-xl border transition-colors text-left",
                  data.condition
                    ? "border-border/60 bg-background"
                    : "border-dashed border-border bg-muted/30"
                )}
              >
                <span className={cn(
                  "text-base",
                  data.condition ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {selectedCondition?.label || "Select condition"}
                </span>
                <CaretRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-border/50">
                <DrawerTitle className="text-lg font-bold">Item Condition</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => {
                      onChange({ condition: condition.value });
                      setIsConditionOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      data.condition === condition.value
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                      data.condition === condition.value
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}>
                      {data.condition === condition.value && (
                        <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{condition.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{condition.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="h-8" />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Description <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your item, including any flaws or special features..."
            rows={4}
            maxLength={1000}
            className="text-base bg-background border-border/60 rounded-xl resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {data.description.length}/1000
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Pricing Section
// ============================================================================
function PricingSection({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}) {
  const [isCityOpen, setIsCityOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Tag className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Set your price
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Price it right to sell faster. You can adjust anytime.
        </p>
      </div>

      <div className="space-y-5">
        {/* Price Input - Premium styled */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Price <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <CurrencyDollar className="w-5 h-5 text-muted-foreground" weight="bold" />
            </div>
            <Input
              type="text"
              inputMode="decimal"
              value={data.price}
              onChange={(e) => onChange({ price: e.target.value })}
              placeholder="0.00"
              className="h-14 text-2xl font-bold text-center bg-background border-border/60 rounded-xl pl-12 pr-16"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="font-bold">
                {data.currency}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4 p-2 rounded-xl bg-muted/30">
            <button
              type="button"
              onClick={() => onChange({ quantity: Math.max(1, data.quantity - 1) })}
              disabled={data.quantity <= 1}
              className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Minus className="w-5 h-5" weight="bold" />
            </button>
            <span className="w-16 text-center text-2xl font-bold tabular-nums">
              {data.quantity}
            </span>
            <button
              type="button"
              onClick={() => onChange({ quantity: Math.min(999, data.quantity + 1) })}
              className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center"
            >
              <Plus className="w-5 h-5" weight="bold" />
            </button>
          </div>
        </div>

        {/* Accept Offers */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
              <Tag className="w-5 h-5 text-muted-foreground" weight="bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Accept offers</p>
              <p className="text-xs text-muted-foreground">Let buyers negotiate</p>
            </div>
          </div>
          <Switch
            checked={data.acceptOffers}
            onCheckedChange={(checked) => onChange({ acceptOffers: checked })}
          />
        </div>

        {/* Shipping section */}
        <div className="pt-4 border-t border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-muted-foreground" weight="bold" />
            <span className="text-sm font-semibold text-foreground">Shipping</span>
          </div>

          {/* Shipping Price */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Shipping cost
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={data.shippingPrice}
                onChange={(e) => onChange({ shippingPrice: e.target.value })}
                placeholder="0.00 for free shipping"
                className="h-12 text-base font-medium bg-background border-border/60 rounded-xl pr-16"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-sm font-medium text-muted-foreground">{data.currency}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ships from
            </label>
            <Drawer open={isCityOpen} onOpenChange={setIsCityOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between h-12 px-4 rounded-xl border border-border/60 bg-background text-left"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className={cn(
                      "text-base",
                      data.sellerCity ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {data.sellerCity || "Select city"}
                    </span>
                  </div>
                  <CaretRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-border/50">
                  <DrawerTitle className="text-lg font-bold">Select City</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-1">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        onChange({ sellerCity: city });
                        setIsCityOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between h-12 px-4 rounded-xl transition-colors",
                        data.sellerCity === city
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted/60"
                      )}
                    >
                      <span>{city}</span>
                      {data.sellerCity === city && (
                        <Check className="w-5 h-5" weight="bold" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="h-8" />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Review Section
// ============================================================================
function ReviewSection({
  data,
  onEditStep,
}: {
  data: FormData;
  onEditStep: (step: number) => void;
}) {
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);
  const coverImage = data.images[0];

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Eye className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Review listing
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Make sure everything looks good before publishing.
        </p>
      </div>

      {/* Preview Card */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {/* Image */}
        {coverImage && (
          <div className="relative aspect-square bg-muted">
            <img
              src={coverImage.url}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-xs font-bold"
            >
              Edit
            </button>
            {data.images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                <ImageSquare className="w-4 h-4" />
                {data.images.length}
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground line-clamp-2">
                {data.title || "Untitled listing"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {data.categoryName && (
                  <Badge variant="secondary" className="font-medium">
                    {data.categoryName}
                  </Badge>
                )}
                {selectedCondition && (
                  <Badge variant="outline" className="font-medium">
                    {selectedCondition.label}
                  </Badge>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-bold text-primary shrink-0"
            >
              Edit
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between py-3 border-y border-border/50">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {data.price ? `${data.price} ${data.currency}` : "No price set"}
              </p>
              {data.acceptOffers && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Open to offers
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-bold text-primary"
            >
              Edit
            </button>
          </div>

          {/* Shipping */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {!data.shippingPrice || data.shippingPrice === "0" 
                  ? "Free shipping" 
                  : `${data.shippingPrice} ${data.currency} shipping`}
              </p>
              {data.sellerCity && (
                <p className="text-xs text-muted-foreground">
                  Ships from {data.sellerCity}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl bg-muted/30 p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Listing checklist</p>
        {[
          { label: "Photos added", done: data.images.length > 0 },
          { label: "Title set", done: data.title.length >= 5 },
          { label: "Category selected", done: !!data.categoryId },
          { label: "Condition set", done: !!data.condition },
          { label: "Price set", done: !!data.price },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              item.done ? "bg-success" : "bg-muted border border-border"
            )}>
              {item.done && <Check className="w-3 h-3 text-success-foreground" weight="bold" />}
            </div>
            <span className={cn(
              "text-sm",
              item.done ? "text-foreground" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Success Screen
// ============================================================================
function SuccessScreen({
  data,
  onNewListing,
}: {
  data: FormData;
  onNewListing: () => void;
}) {
  const coverImage = data.images[0];

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-center h-14">
          <span className="text-sm font-medium text-muted-foreground">
            Listing Published
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center space-y-8">
          {/* Success icon */}
          <div className="mx-auto w-20 h-20 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success-foreground" weight="fill" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Published!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your listing is live and ready for buyers.
            </p>
          </div>

          {/* Product preview */}
          {coverImage && (
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-4">
                <img
                  src={coverImage.url}
                  alt={data.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-base truncate">{data.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.price} {data.currency}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <Button className="w-full h-12 gap-2 text-base font-semibold rounded-xl">
              <Eye className="w-5 h-5" />
              View Listing
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl font-medium"
                onClick={() => {
                  navigator.share?.({
                    title: data.title,
                    url: window.location.origin,
                  });
                }}
              >
                <Share className="w-5 h-5" />
                Share
              </Button>

              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl font-medium"
                onClick={onNewListing}
              >
                <Plus className="w-5 h-5" />
                New
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full h-12 gap-2 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <House className="w-5 h-5" />
              Go Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function Sell2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublished, setIsPublished] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: "",
    categoryName: "",
    condition: "",
    price: "",
    currency: "BGN",
    quantity: 1,
    acceptOffers: true,
    shippingPrice: "",
    sellerCity: "",
    images: [],
  });

  // Scroll to top on step change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Photo handlers
  const handleAddImages = useCallback((files: File[]) => {
    const newImages: ProductImage[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      isPrimary: formData.images.length === 0 && idx === 0,
    }));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 12),
    }));
  }, [formData.images.length]);

  const handleRemoveImage = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
    }));
  }, []);

  const handleSetPrimary = useCallback((id: string) => {
    setFormData(prev => {
      const images = prev.images.map(img => ({
        ...img,
        isPrimary: img.id === id,
      }));
      const primaryIdx = images.findIndex(img => img.id === id);
      if (primaryIdx > 0) {
        const primary = images.splice(primaryIdx, 1)[0];
        if (primary) {
          images.unshift(primary);
        }
      }
      return { ...prev, images };
    });
  }, []);

  // Navigation
  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.images.length > 0;
      case 2: return formData.title.length >= 5 && formData.categoryId && formData.condition;
      case 3: return !!formData.price;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const handleNewListing = () => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      categoryName: "",
      condition: "",
      price: "",
      currency: "BGN",
      quantity: 1,
      acceptOffers: true,
      shippingPrice: "",
      sellerCity: "",
      images: [],
    });
    setCurrentStep(1);
    setIsPublished(false);
  };

  // Success screen
  if (isPublished) {
    return <SuccessScreen data={formData} onNewListing={handleNewListing} />;
  }

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;
  const progress = (currentStep / 4) * 100;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <CaretLeft className="w-5 h-5" weight="bold" />
              </button>
            )}
            <div>
              <p className="text-sm font-bold text-foreground">
                {STEPS[currentStep - 1]?.label ?? ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep} of 4
              </p>
            </div>
          </div>
          <StepIndicator currentStep={currentStep} totalSteps={4} />
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">
          {currentStep === 1 && (
            <PhotoUploadSection
              images={formData.images}
              onAddImages={handleAddImages}
              onRemoveImage={handleRemoveImage}
              onSetPrimary={handleSetPrimary}
            />
          )}
          {currentStep === 2 && (
            <DetailsSection
              data={formData}
              onChange={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <PricingSection
              data={formData}
              onChange={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <ReviewSection
              data={formData}
              onEditStep={setCurrentStep}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 pb-safe">
        <div className="mx-auto max-w-lg">
          {isLastStep ? (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={!canProceed()}
              className="w-full h-12 gap-2 rounded-xl text-base font-bold"
            >
              <Rocket className="w-5 h-5" weight="fill" />
              Publish Listing
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-12 gap-2 rounded-xl text-base font-bold"
            >
              Continue
              <ArrowRight className="w-5 h-5" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
