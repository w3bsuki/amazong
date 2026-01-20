"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Camera,
  CaretLeft,
  CaretRight,
  Check,
  X,
  Plus,
  Truck,
  ArrowRight,
  House,
  Eye,
  Share,
  MapPin,
  Handshake,
  ImageSquare,
  Tag,
  Package,
  Sparkle,
  CurrencyDollar,
  CheckCircle,
  WarningCircle,
  CloudArrowUp,
  Lightning,
  Info,
  CaretDown,
  SpinnerGap,
  Star,
  ShieldCheck,
  Timer,
  Heart,
  Barcode,
  Ruler,
  Palette,
  Percent,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// PREMIUM MOBILE SELL FORM - World-Class 2026 Experience
// 
// Features:
// - Photo-first flow (most engaging step first)
// - Elegant visual hierarchy with semantic colors
// - Beautiful condition cards with unique colors
// - Smart price input with savings calculator
// - Premium review screen with listing preview
// - Smooth step transitions
// - WCAG compliant touch targets (48px min)
// ============================================================================

// Schema
const sellFormSchema = z.object({
  title: z.string().min(3, "Title too short").max(80, "Max 80 characters"),
  category: z.string().min(1, "Select a category"),
  subcategory: z.string().optional(),
  condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"]),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(12),
  price: z.string().min(1, "Enter a price").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Invalid price"),
  compareAtPrice: z.string().optional(),
  currency: z.enum(["EUR", "BGN", "USD"]).default("EUR"),
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  city: z.string().min(1, "Select your city"),
  acceptOffers: z.boolean().default(false),
  description: z.string().max(4000).optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// ============================================================================
// DATA
// ============================================================================

const CATEGORIES = [
  { id: "fashion", name: "Fashion", icon: "👕", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400", subcategories: ["Men's", "Women's", "Kids", "Shoes", "Bags"] },
  { id: "electronics", name: "Electronics", icon: "📱", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", subcategories: ["Phones", "Tablets", "Laptops", "Gaming"] },
  { id: "home", name: "Home & Garden", icon: "🏠", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", subcategories: ["Furniture", "Decor", "Kitchen"] },
  { id: "sports", name: "Sports & Outdoor", icon: "⚽", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", subcategories: ["Fitness", "Cycling", "Camping"] },
  { id: "toys", name: "Toys & Games", icon: "🎮", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", subcategories: ["Board Games", "Video Games", "Kids Toys"] },
  { id: "books", name: "Books & Media", icon: "📚", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", subcategories: ["Books", "Music", "Movies"] },
  { id: "auto", name: "Auto & Moto", icon: "🚗", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400", subcategories: ["Parts", "Accessories", "Tools"] },
  { id: "beauty", name: "Beauty & Health", icon: "✨", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400", subcategories: ["Skincare", "Makeup", "Wellness"] },
];

const CONDITIONS = [
  { 
    value: "new-with-tags", 
    label: "New with tags", 
    shortLabel: "New",
    desc: "Brand new, original tags attached",
    icon: Sparkle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    ring: "ring-emerald-500/20",
  },
  { 
    value: "new-without-tags", 
    label: "New without tags", 
    shortLabel: "Unworn",
    desc: "Never used, no original packaging",
    icon: Star,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    ring: "ring-blue-500/20",
  },
  { 
    value: "like-new", 
    label: "Excellent", 
    shortLabel: "Excellent",
    desc: "Minimal signs of wear, pristine condition",
    icon: CheckCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    ring: "ring-violet-500/20",
  },
  { 
    value: "good", 
    label: "Good", 
    shortLabel: "Good",
    desc: "Normal wear, fully functional",
    icon: Check,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    ring: "ring-amber-500/20",
  },
  { 
    value: "fair", 
    label: "Fair", 
    shortLabel: "Fair",
    desc: "Visible wear, works perfectly",
    icon: Info,
    color: "text-stone-600 dark:text-stone-400",
    bgColor: "bg-stone-500/10",
    borderColor: "border-stone-500/30",
    ring: "ring-stone-500/20",
  },
] as const;

const CITIES = [
  { name: "Sofia", region: "Sofia Region", popular: true },
  { name: "Plovdiv", region: "Plovdiv Region", popular: true },
  { name: "Varna", region: "Varna Region", popular: true },
  { name: "Burgas", region: "Burgas Region", popular: true },
  { name: "Ruse", region: "Ruse Region" },
  { name: "Stara Zagora", region: "Stara Zagora Region" },
  { name: "Pleven", region: "Pleven Region" },
  { name: "Sliven", region: "Sliven Region" },
  { name: "Dobrich", region: "Dobrich Region" },
  { name: "Shumen", region: "Shumen Region" },
];

const CURRENCIES = [
  { value: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { value: "BGN", symbol: "лв", name: "Bulgarian Lev", flag: "🇧🇬" },
  { value: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
];

const TOTAL_STEPS = 4;

// ============================================================================
// REUSABLE PREMIUM COMPONENTS
// ============================================================================

// Section title with icon badge
function SectionTitle({ 
  children, 
  subtitle,
  icon: Icon,
  badge,
}: { 
  children: ReactNode; 
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" weight="bold" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {children}
            </h2>
            {badge && (
              <Badge variant="secondary" className="text-2xs font-bold px-2 py-0.5 rounded-md">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Premium selection card for drawers
function SelectionCard({
  label,
  value,
  placeholder,
  onClick,
  hasError,
  icon: Icon,
  required,
}: {
  label: string;
  value?: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean;
  icon?: React.ElementType;
  required?: boolean;
}) {
  const hasValue = !!value;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 min-h-16 px-4 py-3 rounded-2xl border text-left transition-all",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        hasError 
          ? "border-destructive/50 bg-destructive/5" 
          : hasValue 
            ? "border-primary/30 bg-primary/5" 
            : "border-border bg-card hover:bg-muted/30"
      )}
    >
      {Icon && (
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          hasValue ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-5" weight={hasValue ? "fill" : "regular"} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {required && <span className="text-destructive text-xs">*</span>}
        </div>
        <span className={cn(
          "text-base font-semibold truncate block mt-0.5",
          hasValue ? "text-foreground" : "text-muted-foreground/50"
        )}>
          {value || placeholder}
        </span>
      </div>
      <CaretRight className={cn(
        "size-5 shrink-0 transition-colors",
        hasValue ? "text-primary/50" : "text-muted-foreground/30"
      )} weight="bold" />
    </button>
  );
}

// Premium toggle option
function TogglePill({
  label,
  sublabel,
  checked,
  onChange,
  icon: Icon,
  checkedBgColor,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ElementType;
  checkedBgColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        "active:scale-[0.98]",
        checked 
          ? "border-primary/40 bg-primary/5" 
          : "border-border bg-card hover:bg-muted/30"
      )}
    >
      {Icon && (
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          checked 
            ? checkedBgColor || "bg-primary/15 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-5" weight={checked ? "fill" : "regular"} />
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <span className={cn(
          "text-base font-semibold block",
          checked ? "text-foreground" : "text-foreground"
        )}>
          {label}
        </span>
        {sublabel && (
          <span className="text-sm text-muted-foreground line-clamp-1">{sublabel}</span>
        )}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        className="shrink-0 scale-110"
      />
    </button>
  );
}

// ============================================================================
// STEP 1: PHOTOS - Hero upload experience
// ============================================================================

function StepPhotos() {
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const photos = watch("photos") || [];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const addDemoPhoto = (count: number = 1) => {
    if (photos.length >= 12 || isUploading) return;
    
    const toAdd = Math.min(count, 12 - photos.length);
    setIsUploading(true);
    setUploadingCount(toAdd);
    
    // Simulate upload delay
    setTimeout(() => {
      const newPhotos = [...photos];
      for (let i = 0; i < toAdd; i++) {
        const randomId = Math.floor(Math.random() * 1000) + i;
        newPhotos.push(`https://picsum.photos/seed/${randomId}/800/800`);
      }
      setValue("photos", newPhotos, { shouldValidate: true });
      setIsUploading(false);
      setUploadingCount(0);
    }, 600);
  };

  const removePhoto = (index: number) => {
    setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const hasPhotos = photos.length > 0;
  const hasError = !!errors.photos;

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Camera}
        subtitle="Great photos sell faster"
      >
        Add photos
      </SectionTitle>

      {/* Photo count progress */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center text-sm font-bold",
            hasPhotos ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {photos.length}
          </div>
          <span className="text-sm text-muted-foreground">
            of 12 photos
          </span>
        </div>
        {photos.length >= 3 && (
          <Badge variant="outline" className="text-success border-success/30 bg-success/5 gap-1">
            <Check className="size-3" weight="bold" />
            Great coverage
          </Badge>
        )}
      </div>

      {/* Main upload area - Hero style when empty */}
      {!hasPhotos && (
        <button
          type="button"
          onClick={() => addDemoPhoto(1)}
          disabled={isUploading}
          className={cn(
            "w-full aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all",
            "hover:bg-muted/20 active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            isUploading ? "opacity-70 cursor-wait" : "",
            hasError ? "border-destructive/50 bg-destructive/5" : "border-border/60 bg-muted/10"
          )}
        >
          {isUploading ? (
            <>
              <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <SpinnerGap className="size-10 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <span className="text-base font-semibold text-foreground block">
                  Uploading...
                </span>
                <span className="text-sm text-muted-foreground">
                  {uploadingCount} photo{uploadingCount !== 1 ? "s" : ""}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="size-10 text-primary" weight="fill" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-lg font-bold text-foreground block">
                  Tap to add photos
                </span>
                <span className="text-sm text-muted-foreground">
                  JPG, PNG or WebP up to 10MB each
                </span>
              </div>
            </>
          )}
        </button>
      )}

      {/* Photo grid when we have photos */}
      {hasPhotos && (
        <div className="grid grid-cols-3 gap-2.5">
          {/* Existing photos */}
          {photos.map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted group ring-1 ring-border/50"
            >
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              
              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-2xs font-bold bg-foreground/90 text-background backdrop-blur-sm">
                  Cover
                </div>
              )}
              
              {/* Photo number badge */}
              {index > 0 && (
                <div className="absolute bottom-2 left-2 size-6 rounded-md text-2xs font-bold bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground">
                  {index + 1}
                </div>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 size-8 flex items-center justify-center rounded-full bg-background/90 text-foreground/70 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity hover:bg-background hover:text-foreground"
              >
                <X className="size-4" weight="bold" />
              </button>
            </div>
          ))}

          {/* Add more button */}
          {photos.length < 12 && (
            <button
              type="button"
              onClick={() => addDemoPhoto(1)}
              disabled={isUploading}
              className={cn(
                "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all",
                "hover:bg-muted/20 active:scale-[0.97]",
                isUploading 
                  ? "opacity-60 cursor-wait border-muted" 
                  : "border-border/60 hover:border-primary/40"
              )}
            >
              {isUploading ? (
                <SpinnerGap className="size-7 text-primary animate-spin" />
              ) : (
                <>
                  <Plus className="size-7 text-muted-foreground" weight="bold" />
                  <span className="text-xs font-semibold text-muted-foreground">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {hasError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <WarningCircle className="size-5 text-destructive shrink-0" weight="fill" />
          <span className="text-sm font-medium text-destructive">{errors.photos?.message}</span>
        </div>
      )}

      {/* Photo tips card */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Lightning className="size-5 text-primary" weight="fill" />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm font-bold text-foreground">Pro tips for better photos</p>
            <ul className="space-y-1.5">
              {[
                "Use natural daylight",
                "Show multiple angles",
                "Include any flaws",
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-success shrink-0" weight="bold" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 2: DETAILS - Category, condition, title
// ============================================================================

function StepDetails() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  
  const title = watch("title") || "";
  const category = watch("category");
  const condition = watch("condition");
  const description = watch("description") || "";
  
  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const selectedCondition = CONDITIONS.find(c => c.value === condition);

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Tag}
        subtitle="Help buyers find your item"
      >
        Item details
      </SectionTitle>

      {/* Title input - Premium design */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <span className={cn(
                "text-xs font-bold tabular-nums",
                title.length > 70 ? "text-warning" : "text-muted-foreground"
              )}>
                {title.length}/80
              </span>
            </div>
            <div className={cn(
              "relative rounded-2xl border bg-card transition-all overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
              fieldState.error ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="e.g. Nike Air Max 90 - Size 42 - Black"
                maxLength={80}
                className="border-none bg-transparent h-14 px-4 text-base font-medium placeholder:text-muted-foreground/40 focus-visible:ring-0"
              />
            </div>
            {fieldState.error && (
              <p className="text-sm text-destructive flex items-center gap-2 px-1">
                <WarningCircle className="size-4" weight="fill" />
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Category & Condition selectors */}
      <div className="space-y-3">
        <SelectionCard
          label="Category"
          value={selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : undefined}
          placeholder="Select a category"
          onClick={() => setCategoryOpen(true)}
          hasError={!!errors.category}
          icon={Package}
          required
        />
        
        <SelectionCard
          label="Condition"
          value={selectedCondition?.label}
          placeholder="Select condition"
          onClick={() => setConditionOpen(true)}
          hasError={!!errors.condition}
          icon={Sparkle}
          required
        />
      </div>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-foreground">
                Description
                <span className="text-xs font-medium text-muted-foreground ml-1.5">(optional)</span>
              </label>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {description.length}/4000
              </span>
            </div>
            <Textarea
              {...field}
              placeholder="Tell buyers about your item: brand, size, why you're selling..."
              rows={4}
              maxLength={4000}
              className="resize-none text-base rounded-2xl border-border bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50"
            />
          </div>
        )}
      />

      {/* Category Drawer */}
      <Drawer open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Select category</DrawerTitle>
            <DrawerDescription className="text-sm">
              Choose the most relevant category for your item
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4 space-y-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setValue("category", cat.id, { shouldValidate: true });
                      setCategoryOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
                      "active:scale-[0.98]",
                      isSelected 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className={cn("size-12 rounded-xl flex items-center justify-center text-2xl", cat.color)}>
                      {cat.icon}
                    </div>
                    <span className={cn(
                      "text-base flex-1 text-left",
                      isSelected ? "font-bold text-foreground" : "font-semibold text-foreground"
                    )}>
                      {cat.name}
                    </span>
                    {isSelected && (
                      <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                        <Check className="size-4 text-primary-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Condition Drawer - Premium design with color-coded conditions */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Item condition</DrawerTitle>
            <DrawerDescription className="text-sm">
              Be accurate — it builds trust with buyers
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[65vh]">
            <div className="p-4 space-y-3">
              {CONDITIONS.map((cond) => {
                const isSelected = condition === cond.value;
                const Icon = cond.icon;
                return (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => {
                      setValue("condition", cond.value, { shouldValidate: true });
                      setConditionOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left",
                      "active:scale-[0.98]",
                      isSelected 
                        ? `${cond.borderColor} ${cond.bgColor} ring-2 ${cond.ring}` 
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className={cn(
                      "size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? cond.bgColor : "bg-muted"
                    )}>
                      <Icon 
                        className={cn(
                          "size-6 transition-colors",
                          isSelected ? cond.color : "text-muted-foreground"
                        )} 
                        weight={isSelected ? "fill" : "regular"} 
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className={cn(
                        "text-base font-bold",
                        isSelected ? cond.color : "text-foreground"
                      )}>
                        {cond.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                        {cond.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className={cn(
                        "size-7 rounded-full flex items-center justify-center shrink-0",
                        cond.bgColor
                      )}>
                        <Check className={cn("size-4", cond.color)} weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ============================================================================
// STEP 3: PRICE - Pricing and shipping
// ============================================================================

function StepPrice() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const price = watch("price") || "";
  const currency = watch("currency") || "EUR";
  const city = watch("city");
  const freeShipping = watch("freeShipping");
  const acceptOffers = watch("acceptOffers");
  const compareAtPrice = watch("compareAtPrice") || "";
  
  const currencyData = CURRENCIES.find(c => c.value === currency);
  const numPrice = parseFloat(price) || 0;
  const numComparePrice = parseFloat(compareAtPrice) || 0;
  const hasSavings = numComparePrice > numPrice && numPrice > 0;
  const savingsPercent = hasSavings ? Math.round((1 - numPrice / numComparePrice) * 100) : 0;

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={CurrencyDollar}
        subtitle="Set a competitive price"
      >
        Price & shipping
      </SectionTitle>

      {/* Price input - Big, bold, prominent */}
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">
              Your price <span className="text-destructive">*</span>
            </label>
            
            <div className={cn(
              "rounded-2xl border bg-card overflow-hidden transition-all",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
              fieldState.error ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <div className="flex items-center h-16 px-4">
                <span className="text-2xl font-bold text-muted-foreground mr-2">
                  {currencyData?.symbol}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="0.00"
                  className="border-none bg-transparent h-full text-3xl font-bold p-0 focus-visible:ring-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-bold">{currency}</span>
                  <CaretDown className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {fieldState.error && (
              <p className="text-sm text-destructive flex items-center gap-2 px-1">
                <WarningCircle className="size-4" weight="fill" />
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Compare at price with savings indicator */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground px-1 flex items-center gap-2">
          Compare at price
          <Badge variant="outline" className="text-2xs px-1.5 py-0 h-5 rounded font-medium">
            Optional
          </Badge>
        </label>
        <div className={cn(
          "flex items-center h-14 px-4 rounded-2xl border bg-card transition-all",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
        )}>
          <span className="text-base font-bold text-muted-foreground mr-2">
            {currencyData?.symbol}
          </span>
          <Input
            type="text"
            inputMode="decimal"
            value={compareAtPrice}
            onChange={(e) => setValue("compareAtPrice", e.target.value)}
            placeholder="Original price (optional)"
            className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
          />
        </div>
        
        {hasSavings && (
          <div className="flex items-center gap-2 px-1 text-success">
            <Percent className="size-4" weight="fill" />
            <span className="text-sm font-bold">
              Buyers save {savingsPercent}% ({currencyData?.symbol}{(numComparePrice - numPrice).toFixed(2)})
            </span>
          </div>
        )}
      </div>

      {/* City selector */}
      <SelectionCard
        label="Ships from"
        value={city}
        placeholder="Select your city"
        onClick={() => setCityOpen(true)}
        hasError={!!errors.city}
        icon={MapPin}
        required
      />

      {/* Toggle options */}
      <div className="space-y-3 pt-1">
        <TogglePill
          label="Free shipping"
          sublabel="Attract more buyers with free delivery"
          checked={freeShipping}
          onChange={(checked) => setValue("freeShipping", checked)}
          icon={Truck}
          checkedBgColor="bg-shipping-free/15 text-shipping-free"
        />
        
        <TogglePill
          label="Accept offers"
          sublabel="Let buyers negotiate the price"
          checked={acceptOffers}
          onChange={(checked) => setValue("acceptOffers", checked)}
          icon={Handshake}
          checkedBgColor="bg-primary/15 text-primary"
        />
      </div>

      {/* Currency Drawer */}
      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Select currency</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            {CURRENCIES.map((curr) => {
              const isSelected = currency === curr.value;
              return (
                <button
                  key={curr.value}
                  type="button"
                  onClick={() => {
                    setValue("currency", curr.value as "EUR" | "BGN" | "USD");
                    setCurrencyOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
                    "active:scale-[0.98]",
                    isSelected 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "border-transparent bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  <span className="text-2xl">{curr.flag}</span>
                  <div className="flex-1 text-left">
                    <span className={cn(
                      "text-base block",
                      isSelected ? "font-bold" : "font-semibold"
                    )}>
                      {curr.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {curr.symbol} ({curr.value})
                    </span>
                  </div>
                  {isSelected && (
                    <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="size-4 text-primary-foreground" weight="bold" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      {/* City Drawer */}
      <Drawer open={cityOpen} onOpenChange={setCityOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Select city</DrawerTitle>
            <DrawerDescription className="text-sm">
              Where will you ship from?
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4">
              {/* Popular cities */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                  Popular cities
                </p>
                <div className="space-y-2">
                  {CITIES.filter(c => c.popular).map((c) => {
                    const isSelected = city === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setValue("city", c.name, { shouldValidate: true });
                          setCityOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left",
                          "active:scale-[0.98]",
                          isSelected 
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                            : "border-transparent bg-muted/40 hover:bg-muted/60"
                        )}
                      >
                        <MapPin 
                          className={cn(
                            "size-5",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} 
                          weight={isSelected ? "fill" : "regular"} 
                        />
                        <div className="flex-1">
                          <span className={cn(
                            "text-base block",
                            isSelected ? "font-bold" : "font-semibold"
                          )}>
                            {c.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {c.region}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                            <Check className="size-4 text-primary-foreground" weight="bold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Other cities */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                  Other cities
                </p>
                <div className="space-y-2">
                  {CITIES.filter(c => !c.popular).map((c) => {
                    const isSelected = city === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setValue("city", c.name, { shouldValidate: true });
                          setCityOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left",
                          "active:scale-[0.98]",
                          isSelected 
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                            : "border-transparent bg-muted/40 hover:bg-muted/60"
                        )}
                      >
                        <MapPin 
                          className={cn(
                            "size-5",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} 
                          weight={isSelected ? "fill" : "regular"} 
                        />
                        <div className="flex-1">
                          <span className={cn(
                            "text-base block",
                            isSelected ? "font-bold" : "font-semibold"
                          )}>
                            {c.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {c.region}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                            <Check className="size-4 text-primary-foreground" weight="bold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ============================================================================
// STEP 4: REVIEW - Final review before publishing
// ============================================================================

function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { watch } = useFormContext<SellFormData>();
  const data = watch();

  const selectedCategory = CATEGORIES.find(c => c.id === data.category);
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);
  const currencyData = CURRENCIES.find(c => c.value === data.currency);

  const numPrice = parseFloat(data.price) || 0;
  const numComparePrice = parseFloat(data.compareAtPrice || "") || 0;
  const hasSavings = numComparePrice > numPrice && numPrice > 0;

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Eye}
        subtitle="Review your listing before publishing"
      >
        Almost done!
      </SectionTitle>

      {/* Preview card - Real listing preview */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden ring-1 ring-border/50">
        {/* Image section with gradient overlay */}
        <div className="aspect-square bg-muted relative">
          {data.photos?.[0] ? (
            <img 
              src={data.photos[0]} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageSquare className="size-20 text-muted-foreground/20" />
            </div>
          )}
          
          {/* Photo count badge */}
          {data.photos && data.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-foreground/80 backdrop-blur-sm text-background text-sm font-bold flex items-center gap-1.5">
              <Camera className="size-4" />
              {data.photos.length}
            </div>
          )}

          {/* Edit photos button */}
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="absolute top-3 right-3 size-10 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
          >
            <Camera className="size-5" weight="bold" />
          </button>

          {/* Condition badge */}
          {selectedCondition && (
            <div className={cn(
              "absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-sm flex items-center gap-1.5",
              selectedCondition.bgColor,
              selectedCondition.color
            )}>
              <selectedCondition.icon className="size-4" weight="fill" />
              {selectedCondition.shortLabel}
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 space-y-4">
          {/* Category & Title */}
          <div className="space-y-2">
            {selectedCategory && (
              <Badge 
                variant="secondary" 
                className={cn("text-xs font-bold", selectedCategory.color)}
              >
                {selectedCategory.icon} {selectedCategory.name}
              </Badge>
            )}
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {data.title || "Untitled listing"}
            </h3>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl font-bold text-foreground">
              {currencyData?.symbol}{numPrice.toFixed(2)}
            </span>
            {hasSavings && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {currencyData?.symbol}{numComparePrice.toFixed(2)}
                </span>
                <Badge className="bg-success/10 text-success border-success/30 text-sm font-bold">
                  -{Math.round((1 - numPrice / numComparePrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Features badges */}
          <div className="flex flex-wrap gap-2">
            {data.freeShipping && (
              <Badge variant="outline" className="text-shipping-free border-shipping-free/30 bg-shipping-free/5 gap-1.5 font-semibold">
                <Truck className="size-3.5" weight="fill" />
                Free shipping
              </Badge>
            )}
            {data.acceptOffers && (
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 gap-1.5 font-semibold">
                <Handshake className="size-3.5" weight="fill" />
                Offers accepted
              </Badge>
            )}
            {data.city && (
              <Badge variant="outline" className="text-muted-foreground gap-1.5 font-medium">
                <MapPin className="size-3.5" />
                {data.city}
              </Badge>
            )}
          </div>

          {/* Description preview */}
          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Quick edit buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { step: 1, icon: Camera, label: "Photos" },
          { step: 2, icon: Tag, label: "Details" },
          { step: 3, icon: CurrencyDollar, label: "Price" },
        ].map(({ step, icon: Icon, label }) => (
          <button
            key={step}
            type="button"
            onClick={() => onEdit(step)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-all active:scale-[0.97]"
          >
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary" weight="fill" />
          <span className="text-sm font-semibold text-foreground">Buyer Protection included</span>
        </div>
        <div className="flex items-center gap-3">
          <Timer className="size-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Listing active for 30 days</span>
        </div>
      </div>

      {/* Terms notice */}
      <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
        By publishing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground font-medium">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/seller-policy" className="underline underline-offset-2 hover:text-foreground font-medium">
          Seller Policy
        </Link>
      </p>
    </div>
  );
}

// ============================================================================
// STEPPER - Premium navigation
// ============================================================================

function Stepper({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header - Premium minimal design */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
        <div className="flex items-center h-14 px-4">
          {/* Back button or spacer */}
          <div className="w-12">
            {!isFirstStep && (
              <button
                type="button"
                onClick={onBack}
                className="size-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
              >
                <CaretLeft className="size-5" weight="bold" />
              </button>
            )}
          </div>
          
          {/* Center - Step dots */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  i + 1 === currentStep 
                    ? "w-8 h-2 bg-primary" 
                    : i + 1 < currentStep
                      ? "w-2 h-2 bg-primary/50"
                      : "w-2 h-2 bg-border"
                )}
              />
            ))}
          </div>
          
          {/* Close button */}
          <div className="w-12 flex justify-end">
            <Link 
              href="/demo"
              className="size-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>

        {/* Progress bar - Thin and elegant */}
        <div className="h-0.5 bg-border/50">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer CTA - Bold and clear */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/40 px-4 pt-4 pb-safe">
        <div className="mx-auto max-w-lg pb-4">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap className="size-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CloudArrowUp className="size-5" weight="bold" />
                  Publish listing
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold gap-2.5"
            >
              Continue
              <ArrowRight className="size-5" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN - Celebration
// ============================================================================

function SuccessScreen({ 
  data,
  onNewListing 
}: { 
  data: SellFormData;
  onNewListing: () => void;
}) {
  const currencyData = CURRENCIES.find(c => c.value === data.currency);
  const numPrice = parseFloat(data.price) || 0;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-end h-14 px-4 border-b border-border/40">
        <Link 
          href="/demo"
          className="size-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
        >
          <X className="size-5" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center space-y-8">
          {/* Success icon */}
          <div className="relative mx-auto">
            <div className="size-28 rounded-3xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="size-16 text-success" weight="fill" />
            </div>
          </div>

          {/* Success message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Listed successfully!
            </h1>
            <p className="text-base text-muted-foreground">
              Your item is now live and visible to buyers
            </p>
          </div>

          {/* Listing preview card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 text-left">
            {data.photos?.[0] ? (
              <img 
                src={data.photos[0]} 
                alt="Preview" 
                className="size-18 rounded-xl object-cover"
              />
            ) : (
              <div className="size-18 rounded-xl bg-muted flex items-center justify-center">
                <ImageSquare className="size-8 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate text-base">
                {data.title || "Your listing"}
              </p>
              <p className="text-xl font-bold text-primary mt-0.5">
                {currencyData?.symbol}{numPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button size="lg" className="w-full h-14 rounded-2xl text-base font-bold gap-2.5" asChild>
              <Link href="/demo">
                <Eye className="size-5" />
                View listing
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 rounded-xl font-semibold gap-2"
              >
                <Share className="size-5" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 rounded-xl font-semibold gap-2"
                onClick={onNewListing}
              >
                <Plus className="size-5" />
                New listing
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground gap-2" 
              asChild
            >
              <Link href="/demo">
                <House className="size-5" />
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DemoSellV4Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<SellFormData | null>(null);

  const methods = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: "",
      category: "",
      condition: "like-new",
      photos: [],
      price: "",
      currency: "EUR",
      freeShipping: false,
      shippingPrice: "",
      city: "",
      acceptOffers: false,
      description: "",
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    const fieldsMap: Record<number, (keyof SellFormData)[]> = {
      1: ["photos"],
      2: ["title", "category", "condition"],
      3: ["price", "city"],
    };
    
    const fields = fieldsMap[currentStep] || [];
    const isValid = fields.length > 0 ? await methods.trigger(fields) : true;
    
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmittedData(methods.getValues());
    setShowSuccess(true);
  };

  const handleNewListing = () => {
    methods.reset();
    setCurrentStep(1);
    setShowSuccess(false);
    setSubmittedData(null);
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  if (showSuccess && submittedData) {
    return <SuccessScreen data={submittedData} onNewListing={handleNewListing} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepPhotos />;
      case 2: return <StepDetails />;
      case 3: return <StepPrice />;
      case 4: return <StepReview onEdit={handleEditStep} />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Stepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {renderStep()}
      </Stepper>
    </FormProvider>
  );
}
