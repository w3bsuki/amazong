"use client";

import { useState, useRef, useEffect, type ReactNode, useCallback } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Camera,
  CaretLeft,
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
  Sparkle,
  CurrencyDollar,
  CheckCircle,
  WarningCircle,
  CloudArrowUp,
  Lightning,
  SpinnerGap,
  Star,
  ShieldCheck,
  Timer,
  CaretRight,
  Minus,
  PencilSimple,
  Package,
  TextT,
  Storefront,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// DEMO SELL 2 - iOS-Style Premium Mobile Sell Form
// 
// Design principles:
// - iOS-inspired minimal aesthetics with clear visual hierarchy
// - 48px minimum touch targets (WCAG AAA)
// - Single-column layout with generous spacing
// - Bottom sheet drawers for selections (iOS action sheet style)
// - Haptic-ready interactions with active scale states
// - Photo-first flow (most engaging step first)
// - Semantic color system from design tokens
// - No arbitrary values, no gradients
// ============================================================================

// Schema
const sellFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(80, "Title too long"),
  category: z.string().min(1, "Please select a category"),
  condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"]),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(12),
  price: z.string().min(1, "Enter a price").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Invalid price"),
  currency: z.enum(["EUR", "BGN", "USD"]).default("BGN"),
  quantity: z.number().min(1).default(1),
  freeShipping: z.boolean().default(false),
  city: z.string().min(1, "Select your location"),
  acceptOffers: z.boolean().default(true),
  description: z.string().max(2000).optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// ============================================================================
// DATA
// ============================================================================

const CATEGORIES = [
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "home", name: "Home & Garden", icon: "🏠" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "toys", name: "Toys & Games", icon: "🎮" },
  { id: "books", name: "Books & Media", icon: "📚" },
  { id: "auto", name: "Auto Parts", icon: "🚗" },
  { id: "beauty", name: "Beauty", icon: "✨" },
  { id: "collectibles", name: "Collectibles", icon: "🎭" },
  { id: "other", name: "Other", icon: "📦" },
];

const CONDITIONS = [
  { 
    value: "new-with-tags", 
    label: "New with tags", 
    short: "New",
    desc: "Brand new, never used, original tags",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  { 
    value: "new-without-tags", 
    label: "New without tags", 
    short: "Unused",
    desc: "Never worn, no original packaging",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  { 
    value: "like-new", 
    label: "Like new", 
    short: "Excellent",
    desc: "Used once or twice, pristine condition",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  { 
    value: "good", 
    label: "Good", 
    short: "Good",
    desc: "Normal wear, fully functional",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  { 
    value: "fair", 
    label: "Fair", 
    short: "Fair",
    desc: "Visible wear, works perfectly",
    color: "text-stone-600 dark:text-stone-400",
    bg: "bg-stone-500/10",
  },
] as const;

const CITIES = [
  { name: "Sofia", popular: true },
  { name: "Plovdiv", popular: true },
  { name: "Varna", popular: true },
  { name: "Burgas", popular: true },
  { name: "Ruse" },
  { name: "Stara Zagora" },
  { name: "Pleven" },
  { name: "Sliven" },
  { name: "Dobrich" },
  { name: "Shumen" },
  { name: "Pernik" },
  { name: "Haskovo" },
];

const CURRENCIES = [
  { value: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { value: "EUR", symbol: "€", name: "Euro" },
  { value: "USD", symbol: "$", name: "US Dollar" },
];

const TOTAL_STEPS = 4;

// ============================================================================
// iOS-STYLE COMPONENTS
// ============================================================================

/** iOS-style list row - tappable selection */
function ListRow({
  label,
  value,
  placeholder,
  onClick,
  hasError,
  icon: Icon,
}: {
  label: string;
  value: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean;
  icon?: React.ElementType;
}) {
  const hasValue = !!value;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 h-14 px-4 rounded-xl border transition-all",
        "active:scale-[0.98] active:opacity-90",
        hasError 
          ? "border-destructive/40 bg-destructive/5" 
          : "border-border bg-card hover:bg-accent/50"
      )}
    >
      {Icon && (
        <div className={cn(
          "size-9 rounded-lg flex items-center justify-center shrink-0",
          hasValue ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-[18px]" weight={hasValue ? "fill" : "regular"} />
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground block">
          {label}
        </span>
        <span className={cn(
          "text-[15px] font-medium truncate block -mt-0.5",
          hasValue ? "text-foreground" : "text-muted-foreground/50"
        )}>
          {value || placeholder}
        </span>
      </div>
      <CaretRight className="size-4 text-muted-foreground/40 shrink-0" weight="bold" />
    </button>
  );
}

/** iOS-style toggle row */
function ToggleRow({
  icon: Icon,
  label,
  sublabel,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-center gap-3 h-16 px-4 rounded-xl border transition-all",
        "active:scale-[0.98] active:opacity-90",
        checked 
          ? "border-primary/30 bg-primary/5" 
          : "border-border bg-card hover:bg-accent/50"
      )}
    >
      <div className={cn(
        "size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        checked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="size-5" weight={checked ? "fill" : "regular"} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <span className={cn(
          "text-[15px] font-semibold block",
          checked ? "text-foreground" : "text-foreground"
        )}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[13px] text-muted-foreground line-clamp-1">{sublabel}</span>
        )}
      </div>
      {/* iOS-style toggle */}
      <div className={cn(
        "w-[51px] h-[31px] rounded-full p-[2px] transition-colors shrink-0",
        checked ? "bg-primary" : "bg-muted-foreground/20"
      )}>
        <div className={cn(
          "size-[27px] rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </button>
  );
}

/** iOS-style quantity stepper */
function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[15px] font-medium text-foreground">Quantity</span>
      <div className="flex items-center h-10 rounded-lg border border-border bg-card overflow-hidden ml-auto">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="h-full w-10 flex items-center justify-center hover:bg-accent disabled:opacity-30 transition-all active:bg-accent/80"
        >
          <Minus className="size-4" weight="bold" />
        </button>
        <div className="w-12 flex items-center justify-center border-x border-border">
          <span className="text-[15px] font-bold tabular-nums">{value}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, value + 1))}
          className="h-full w-10 flex items-center justify-center hover:bg-accent transition-all active:bg-accent/80"
        >
          <Plus className="size-4" weight="bold" />
        </button>
      </div>
    </div>
  );
}

/** Section header */
function SectionHeader({ 
  title, 
  subtitle,
  icon: Icon,
}: { 
  title: string; 
  subtitle?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="size-6 text-primary" weight="fill" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: PHOTOS
// ============================================================================

function StepPhotos() {
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const photos = watch("photos") || [];
  const [isUploading, setIsUploading] = useState(false);

  const addDemoPhoto = useCallback(() => {
    if (photos.length >= 12 || isUploading) return;
    setIsUploading(true);
    
    setTimeout(() => {
      const id = Math.floor(Math.random() * 1000);
      setValue("photos", [...photos, `https://picsum.photos/seed/${id}/600/600`], { shouldValidate: true });
      setIsUploading(false);
    }, 400);
  }, [photos, isUploading, setValue]);

  const removePhoto = (index: number) => {
    setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const hasPhotos = photos.length > 0;

  return (
    <div className="space-y-5">
      <SectionHeader 
        icon={Camera}
        title="Add photos"
        subtitle="Great photos sell items faster"
      />

      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {photos.length} of 12 photos
        </span>
        {photos.length >= 3 && (
          <Badge variant="outline" className="bg-success/5 text-success border-success/20 gap-1 text-xs">
            <Check className="size-3" weight="bold" />
            Good coverage
          </Badge>
        )}
      </div>

      {/* Upload zone when empty */}
      {!hasPhotos && (
        <button
          type="button"
          onClick={addDemoPhoto}
          disabled={isUploading}
          className={cn(
            "w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all",
            "active:scale-[0.99]",
            isUploading ? "opacity-70" : "",
            errors.photos ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/40 hover:bg-accent/30"
          )}
        >
          {isUploading ? (
            <SpinnerGap className="size-12 text-primary animate-spin" />
          ) : (
            <>
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="size-8 text-primary" weight="fill" />
              </div>
              <div className="text-center">
                <span className="text-base font-semibold text-foreground block">Tap to add photos</span>
                <span className="text-sm text-muted-foreground">JPG, PNG up to 10MB</span>
              </div>
            </>
          )}
        </button>
      )}

      {/* Photo grid */}
      {hasPhotos && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted group ring-1 ring-border/50"
            >
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              
              {index === 0 && (
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-foreground/90 text-background">
                  Cover
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1.5 right-1.5 size-7 flex items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity shadow-sm"
              >
                <X className="size-4" weight="bold" />
              </button>
            </div>
          ))}

          {photos.length < 12 && (
            <button
              type="button"
              onClick={addDemoPhoto}
              disabled={isUploading}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-accent/30 transition-all active:scale-95"
            >
              {isUploading ? (
                <SpinnerGap className="size-6 text-primary animate-spin" />
              ) : (
                <>
                  <Plus className="size-6 text-muted-foreground" weight="bold" />
                  <span className="text-xs font-medium text-muted-foreground">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {errors.photos && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <WarningCircle className="size-4" weight="fill" />
          {errors.photos.message}
        </div>
      )}

      {/* Tips */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
        <div className="flex items-start gap-3">
          <Lightning className="size-5 text-primary shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1.5">Quick tips</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-success" weight="bold" />
                Use natural daylight
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-success" weight="bold" />
                Show all angles
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-success" weight="bold" />
                Include any flaws
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 2: DETAILS
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
      <SectionHeader 
        icon={Tag}
        title="Item details"
        subtitle="Help buyers find your item"
      />

      <div className="space-y-3">
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[13px] font-semibold text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <span className={cn(
                  "text-xs font-medium tabular-nums",
                  title.length > 70 ? "text-warning" : "text-muted-foreground"
                )}>
                  {title.length}/80
                </span>
              </div>
              <div className={cn(
                "h-14 px-4 rounded-xl border bg-card flex items-center transition-all",
                "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
                fieldState.error ? "border-destructive/40 bg-destructive/5" : "border-border"
              )}>
                <TextT className="size-5 text-muted-foreground mr-3 shrink-0" />
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="What are you selling?"
                  maxLength={80}
                  className="border-none bg-transparent h-full p-0 text-[15px] font-medium focus-visible:ring-0"
                />
              </div>
              {fieldState.error && (
                <p className="text-sm text-destructive flex items-center gap-1.5 px-1">
                  <WarningCircle className="size-4" weight="fill" />
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Category */}
        <ListRow
          label="Category"
          value={selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : undefined}
          placeholder="Select category"
          onClick={() => setCategoryOpen(true)}
          hasError={!!errors.category}
          icon={Package}
        />

        {/* Condition */}
        <ListRow
          label="Condition"
          value={selectedCondition?.label}
          placeholder="Select condition"
          onClick={() => setConditionOpen(true)}
          hasError={!!errors.condition}
          icon={Sparkle}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[13px] font-semibold text-foreground">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {description.length}/2000
                </span>
              </div>
              <Textarea
                {...field}
                placeholder="Describe your item: brand, size, why you're selling..."
                rows={4}
                maxLength={2000}
                className="resize-none text-[15px] rounded-xl border-border bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50"
              />
            </div>
          )}
        />
      </div>

      {/* Category Drawer */}
      <Drawer open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Select category</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[65vh]">
            <div className="p-4 space-y-1.5">
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
                      "w-full flex items-center gap-3 h-14 px-4 rounded-xl transition-all",
                      "active:scale-[0.98]",
                      isSelected 
                        ? "bg-primary/10 ring-2 ring-primary/20" 
                        : "bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className={cn(
                      "text-[15px] flex-1 text-left",
                      isSelected ? "font-bold text-primary" : "font-medium text-foreground"
                    )}>
                      {cat.name}
                    </span>
                    {isSelected && (
                      <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="size-3.5 text-primary-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Condition Drawer */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Item condition</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[70vh]">
            <div className="p-4 space-y-2">
              {CONDITIONS.map((cond) => {
                const isSelected = condition === cond.value;
                return (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => {
                      setValue("condition", cond.value, { shouldValidate: true });
                      setConditionOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left",
                      "active:scale-[0.98]",
                      isSelected 
                        ? `${cond.bg} ring-2 ring-primary/20` 
                        : "bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center shrink-0",
                      isSelected ? cond.bg : "bg-muted"
                    )}>
                      <Star 
                        className={cn("size-5", isSelected ? cond.color : "text-muted-foreground")} 
                        weight={isSelected ? "fill" : "regular"} 
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className={cn(
                        "text-[15px] font-semibold",
                        isSelected ? cond.color : "text-foreground"
                      )}>
                        {cond.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{cond.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="size-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="size-3.5 text-primary-foreground" weight="bold" />
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
// STEP 3: PRICE & SHIPPING
// ============================================================================

function StepPrice() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const currency = watch("currency") || "BGN";
  const city = watch("city");
  const quantity = watch("quantity") || 1;
  const freeShipping = watch("freeShipping");
  const acceptOffers = watch("acceptOffers");
  
  const currencyData = CURRENCIES.find(c => c.value === currency);

  return (
    <div className="space-y-5">
      <SectionHeader 
        icon={CurrencyDollar}
        title="Price & shipping"
        subtitle="Set a competitive price"
      />

      <div className="space-y-4">
        {/* Price input - big and prominent */}
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-foreground px-1">
                Price <span className="text-destructive">*</span>
              </label>
              <div className={cn(
                "h-16 px-4 rounded-xl border bg-card flex items-center transition-all",
                "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
                fieldState.error ? "border-destructive/40 bg-destructive/5" : "border-border"
              )}>
                <span className="text-2xl font-bold text-muted-foreground mr-2">
                  {currencyData?.symbol}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="0.00"
                  className="border-none bg-transparent h-full p-0 text-2xl font-bold focus-visible:ring-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <span className="text-sm font-bold">{currency}</span>
                  <CaretRight className="size-3 text-muted-foreground rotate-90" weight="bold" />
                </button>
              </div>
              {fieldState.error && (
                <p className="text-sm text-destructive flex items-center gap-1.5 px-1">
                  <WarningCircle className="size-4" weight="fill" />
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Quantity */}
        <div className="h-14 px-4 rounded-xl border border-border bg-card flex items-center">
          <QuantityStepper 
            value={quantity} 
            onChange={(val) => setValue("quantity", val)} 
          />
        </div>

        {/* City */}
        <ListRow
          label="Ships from"
          value={city}
          placeholder="Select your city"
          onClick={() => setCityOpen(true)}
          hasError={!!errors.city}
          icon={MapPin}
        />

        {/* Divider */}
        <div className="h-px bg-border my-1" />

        {/* Toggle options */}
        <ToggleRow
          icon={Truck}
          label="Free shipping"
          sublabel="Buyers love free delivery"
          checked={freeShipping}
          onChange={(checked) => setValue("freeShipping", checked)}
        />
        
        <ToggleRow
          icon={Handshake}
          label="Accept offers"
          sublabel="Let buyers negotiate"
          checked={acceptOffers}
          onChange={(checked) => setValue("acceptOffers", checked)}
        />
      </div>

      {/* Currency Drawer */}
      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Select currency</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-1.5">
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
                    "w-full flex items-center gap-3 h-14 px-4 rounded-xl transition-all",
                    "active:scale-[0.98]",
                    isSelected 
                      ? "bg-primary/10 ring-2 ring-primary/20" 
                      : "bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  <span className="text-xl font-bold w-8">{curr.symbol}</span>
                  <div className="flex-1 text-left">
                    <span className={cn(
                      "text-[15px] block",
                      isSelected ? "font-bold text-primary" : "font-medium"
                    )}>
                      {curr.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{curr.value}</span>
                  </div>
                  {isSelected && (
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="size-3.5 text-primary-foreground" weight="bold" />
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
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Select city</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[65vh]">
            <div className="p-4">
              {/* Popular cities */}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                Popular
              </p>
              <div className="space-y-1.5 mb-4">
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
                        "w-full flex items-center gap-3 h-12 px-4 rounded-xl transition-all",
                        "active:scale-[0.98]",
                        isSelected 
                          ? "bg-primary/10 ring-2 ring-primary/20" 
                          : "bg-muted/40 hover:bg-muted/60"
                      )}
                    >
                      <MapPin className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} weight={isSelected ? "fill" : "regular"} />
                      <span className={cn("text-[15px] flex-1 text-left", isSelected ? "font-bold text-primary" : "font-medium")}>
                        {c.name}
                      </span>
                      {isSelected && (
                        <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="size-3.5 text-primary-foreground" weight="bold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Other cities */}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                Other cities
              </p>
              <div className="space-y-1.5">
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
                        "w-full flex items-center gap-3 h-12 px-4 rounded-xl transition-all",
                        "active:scale-[0.98]",
                        isSelected 
                          ? "bg-primary/10 ring-2 ring-primary/20" 
                          : "bg-muted/40 hover:bg-muted/60"
                      )}
                    >
                      <MapPin className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} weight={isSelected ? "fill" : "regular"} />
                      <span className={cn("text-[15px] flex-1 text-left", isSelected ? "font-bold text-primary" : "font-medium")}>
                        {c.name}
                      </span>
                      {isSelected && (
                        <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="size-3.5 text-primary-foreground" weight="bold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ============================================================================
// STEP 4: REVIEW
// ============================================================================

function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { watch } = useFormContext<SellFormData>();
  const data = watch();

  const selectedCategory = CATEGORIES.find(c => c.id === data.category);
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);
  const currencyData = CURRENCIES.find(c => c.value === data.currency);
  const price = parseFloat(data.price) || 0;

  return (
    <div className="space-y-5">
      <SectionHeader 
        icon={Eye}
        title="Review listing"
        subtitle="Check everything before publishing"
      />

      {/* Preview card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Image */}
        <div className="aspect-square bg-muted relative">
          {data.photos?.[0] ? (
            <img src={data.photos[0]} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageSquare className="size-16 text-muted-foreground/20" />
            </div>
          )}
          
          {data.photos && data.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-foreground/80 text-background text-xs font-bold flex items-center gap-1">
              <Camera className="size-3.5" />
              {data.photos.length}
            </div>
          )}
          
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="absolute top-3 right-3 size-9 rounded-xl bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
          >
            <PencilSimple className="size-4" weight="bold" />
          </button>

          {selectedCondition && (
            <div className={cn(
              "absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold",
              selectedCondition.bg, selectedCondition.color
            )}>
              {selectedCondition.short}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            {selectedCategory && (
              <Badge variant="secondary" className="text-xs font-medium">
                {selectedCategory.icon} {selectedCategory.name}
              </Badge>
            )}
            <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
              {data.title || "Untitled listing"}
            </h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {currencyData?.symbol}{price.toFixed(2)}
            </span>
            {data.quantity > 1 && (
              <span className="text-sm text-muted-foreground">
                × {data.quantity}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {data.freeShipping && (
              <Badge variant="outline" className="text-shipping-free border-shipping-free/30 bg-shipping-free/5 gap-1 text-xs">
                <Truck className="size-3" weight="fill" />
                Free shipping
              </Badge>
            )}
            {data.acceptOffers && (
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 gap-1 text-xs">
                <Handshake className="size-3" weight="fill" />
                Offers OK
              </Badge>
            )}
            {data.city && (
              <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
                <MapPin className="size-3" />
                {data.city}
              </Badge>
            )}
          </div>

          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>

      {/* Quick edit buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { step: 1, icon: Camera, label: "Photos" },
          { step: 2, icon: Tag, label: "Details" },
          { step: 3, icon: CurrencyDollar, label: "Price" },
        ].map(({ step, icon: Icon, label }) => (
          <button
            key={step}
            type="button"
            onClick={() => onEdit(step)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all active:scale-95"
          >
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Trust badges */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-5 text-primary" weight="fill" />
          <span className="text-sm font-medium text-foreground">Buyer Protection included</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Timer className="size-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active for 30 days</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center px-4">
        By publishing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="/seller-policy" className="underline underline-offset-2 hover:text-foreground">Seller Policy</Link>
      </p>
    </div>
  );
}

// ============================================================================
// STEPPER WRAPPER - iOS-style navigation
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
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header - iOS style */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 pt-safe">
        <div className="flex items-center h-12 px-4">
          <div className="w-12">
            {!isFirst && (
              <button
                type="button"
                onClick={onBack}
                className="size-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
              >
                <CaretLeft className="size-5" weight="bold" />
              </button>
            )}
          </div>
          
          {/* Step indicator dots */}
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i + 1 === currentStep 
                    ? "w-6 bg-primary" 
                    : i + 1 < currentStep
                      ? "w-1.5 bg-primary/60"
                      : "w-1.5 bg-border"
                )}
              />
            ))}
          </div>
          
          <div className="w-12 flex justify-end">
            <Link 
              href="/en/demo"
              className="size-9 -mr-1.5 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-border/50">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-5">
          {children}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 pt-3 pb-safe">
        <div className="mx-auto max-w-lg pb-3">
          {isLast ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full h-[52px] rounded-xl text-[15px] font-bold gap-2"
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
              className="w-full h-[52px] rounded-xl text-[15px] font-bold gap-2"
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
// SUCCESS SCREEN
// ============================================================================

function SuccessScreen({ 
  data,
  onNew 
}: { 
  data: SellFormData;
  onNew: () => void;
}) {
  const currencyData = CURRENCIES.find(c => c.value === data.currency);
  const price = parseFloat(data.price) || 0;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe">
      <header className="flex items-center justify-end h-12 px-4 border-b border-border/50">
        <Link 
          href="/en/demo"
          className="size-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <X className="size-5" />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center space-y-6">
          {/* Success icon */}
          <div className="size-24 rounded-3xl bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="size-14 text-success" weight="fill" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Published!</h1>
            <p className="text-base text-muted-foreground">
              Your listing is now live
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 text-left">
            {data.photos?.[0] ? (
              <img src={data.photos[0]} alt="Preview" className="size-16 rounded-lg object-cover" />
            ) : (
              <div className="size-16 rounded-lg bg-muted flex items-center justify-center">
                <ImageSquare className="size-8 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">{data.title}</p>
              <p className="text-lg font-bold text-primary">{currencyData?.symbol}{price.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button size="lg" className="w-full h-[52px] rounded-xl text-[15px] font-bold gap-2" asChild>
              <Link href="/en/demo">
                <Eye className="size-5" />
                View listing
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl font-semibold gap-2">
                <Share className="size-5" />
                Share
              </Button>
              <Button variant="outline" className="h-12 rounded-xl font-semibold gap-2" onClick={onNew}>
                <Plus className="size-5" />
                New
              </Button>
            </div>

            <Button variant="ghost" className="w-full text-muted-foreground gap-2" asChild>
              <Link href="/en/demo">
                <House className="size-5" />
                Home
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

export default function DemoSell2Page() {
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
      currency: "BGN",
      quantity: 1,
      freeShipping: false,
      city: "",
      acceptOffers: true,
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
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmittedData(methods.getValues());
    setShowSuccess(true);
  };

  const handleNew = () => {
    methods.reset();
    setCurrentStep(1);
    setShowSuccess(false);
    setSubmittedData(null);
  };

  if (showSuccess && submittedData) {
    return <SuccessScreen data={submittedData} onNew={handleNew} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepPhotos />;
      case 2: return <StepDetails />;
      case 3: return <StepPrice />;
      case 4: return <StepReview onEdit={setCurrentStep} />;
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
