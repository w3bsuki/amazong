"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
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
  CircleNotch,
  Image as ImageIcon,
  Tag,
  Package,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// DEMO MOBILE SELL FORM V4 - 2026 Native Mobile UX
// Clean, minimal, information-dense, no gimmicks
// ============================================================================

// Schema
const sellFormSchema = z.object({
  title: z.string().min(5, "Min 5 characters").max(80, "Max 80 characters"),
  category: z.string().min(1, "Select a category"),
  condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"]),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(12),
  price: z.string().min(1, "Enter a price").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Invalid price"),
  currency: z.enum(["EUR", "BGN", "USD"]).default("EUR"),
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  city: z.string().min(1, "Select your city"),
  acceptOffers: z.boolean().default(false),
  description: z.string().max(4000).optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// Data - Clean, no emojis
const CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home & Garden" },
  { id: "sports", name: "Sports" },
  { id: "toys", name: "Toys & Games" },
  { id: "books", name: "Books & Media" },
  { id: "auto", name: "Auto Parts" },
  { id: "other", name: "Other" },
];

const CONDITIONS = [
  { value: "new-with-tags", label: "New with tags", desc: "Brand new, original tags attached" },
  { value: "new-without-tags", label: "New without tags", desc: "Never used, no original packaging" },
  { value: "like-new", label: "Like new", desc: "Used once or twice, excellent condition" },
  { value: "good", label: "Good", desc: "Light wear, fully functional" },
  { value: "fair", label: "Fair", desc: "Visible wear, works perfectly" },
] as const;

const CITIES = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"];

const CURRENCIES = [
  { value: "EUR", symbol: "€", name: "Euro" },
  { value: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { value: "USD", symbol: "$", name: "US Dollar" },
];

const TOTAL_STEPS = 3;

// ============================================================================
// COMPONENTS - Clean, native-feel UI
// ============================================================================

// Field wrapper with label
function FormField({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Selection row - clean tap target
function SelectionRow({
  label,
  value,
  placeholder,
  onClick,
  hasError,
}: {
  label: string;
  value?: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between h-11 px-3 rounded-md border bg-background text-left transition-colors",
        "hover:bg-muted/50 active:bg-muted",
        hasError ? "border-destructive" : "border-input"
      )}
    >
      <span className={cn(
        "text-sm truncate",
        value ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        {value || placeholder}
      </span>
      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepBasics() {
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
      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <FormField 
            label="Title" 
            error={fieldState.error?.message}
            hint={`${title.length}/80`}
            required
          >
            <Input
              {...field}
              value={field.value || ""}
              placeholder="What are you selling?"
              maxLength={80}
              className={fieldState.error ? "border-destructive" : ""}
            />
          </FormField>
        )}
      />

      {/* Category & Condition */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Category" error={errors.category?.message} required>
          <SelectionRow
            label="Category"
            value={selectedCategory?.name}
            placeholder="Select"
            onClick={() => setCategoryOpen(true)}
            hasError={!!errors.category}
          />
        </FormField>
        
        <FormField label="Condition" error={errors.condition?.message} required>
          <SelectionRow
            label="Condition"
            value={selectedCondition?.label}
            placeholder="Select"
            onClick={() => setConditionOpen(true)}
            hasError={!!errors.condition}
          />
        </FormField>
      </div>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormField label="Description" hint={`${description.length}/4000`}>
            <Textarea
              {...field}
              placeholder="Describe your item: brand, size, condition details, reason for selling..."
              rows={4}
              maxLength={4000}
              className="resize-none text-sm"
            />
          </FormField>
        )}
      />
      
      {/* Category Drawer */}
      <Drawer open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DrawerContent aria-label="Select category">
          <DrawerHeader className="border-b">
            <DrawerTitle>Category</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="py-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setValue("category", cat.id, { shouldValidate: true });
                    setCategoryOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                    "hover:bg-muted/50 active:bg-muted",
                    category === cat.id && "bg-muted"
                  )}
                >
                  <span className={cn(
                    "text-sm",
                    category === cat.id ? "font-semibold text-foreground" : "text-foreground"
                  )}>
                    {cat.name}
                  </span>
                  {category === cat.id && (
                    <Check className="size-4 text-primary" weight="bold" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Condition Drawer */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent aria-label="Select condition">
          <DrawerHeader className="border-b">
            <DrawerTitle>Condition</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="py-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => {
                    setValue("condition", cond.value, { shouldValidate: true });
                    setConditionOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start justify-between gap-3 px-4 py-3 text-left transition-colors",
                    "hover:bg-muted/50 active:bg-muted",
                    condition === cond.value && "bg-muted"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-sm",
                      condition === cond.value ? "font-semibold" : "font-medium"
                    )}>
                      {cond.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {cond.desc}
                    </div>
                  </div>
                  {condition === cond.value && (
                    <Check className="size-4 text-primary shrink-0 mt-0.5" weight="bold" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function StepPhotos() {
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const photos = watch("photos") || [];

  const addDemoPhoto = () => {
    if (photos.length >= 12) return;
    const randomId = Math.floor(Math.random() * 1000);
    const newPhoto = `https://picsum.photos/seed/${randomId}/400/400`;
    setValue("photos", [...photos, newPhoto], { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add up to 12 photos. First photo is the cover.
        </p>
        <span className="text-sm font-medium tabular-nums">
          {photos.length}/12
        </span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Add photo button - always first */}
        {photos.length < 12 && (
          <button
            type="button"
            onClick={addDemoPhoto}
            className={cn(
              "aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors",
              "hover:bg-muted/50 active:bg-muted",
              errors.photos ? "border-destructive" : "border-border"
            )}
          >
            <Camera className="size-6 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Add</span>
          </button>
        )}

        {photos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className="relative aspect-square rounded-md overflow-hidden bg-muted"
          >
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            {index === 0 && (
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-2xs font-medium bg-foreground text-background">
                Cover
              </div>
            )}
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 size-6 flex items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
            >
              <X className="size-3.5" weight="bold" />
            </button>
          </div>
        ))}
      </div>

      {errors.photos && (
        <p className="text-xs text-destructive">{errors.photos.message}</p>
      )}

      {/* Tips - minimal, no card */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use natural light • Show multiple angles • Include any flaws
        </p>
      </div>
    </div>
  );
}

function StepPricing({ onEdit }: { onEdit: (step: number) => void }) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const data = watch();
  const price = data.price || "";
  const currency = data.currency || "EUR";
  const city = data.city;
  const freeShipping = data.freeShipping;
  const acceptOffers = data.acceptOffers;
  
  const currencyData = CURRENCIES.find(c => c.value === currency);
  const selectedCategory = CATEGORIES.find(c => c.id === data.category);
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);

  return (
    <div className="space-y-5">
      {/* Preview - Compact summary */}
      <div className="flex gap-3 p-3 rounded-md border border-border bg-muted/30">
        {data.photos?.[0] ? (
          <div className="size-16 rounded overflow-hidden bg-muted shrink-0">
            <img src={data.photos[0]} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="size-16 rounded bg-muted shrink-0 flex items-center justify-center">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-2 leading-snug">
            {data.title || "Untitled listing"}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {selectedCategory && <span>{selectedCategory.name}</span>}
            {selectedCondition && (
              <>
                <span>•</span>
                <span>{selectedCondition.label}</span>
              </>
            )}
          </div>
          <button 
            type="button" 
            onClick={() => onEdit(1)}
            className="text-xs text-primary font-medium mt-1.5 hover:underline"
          >
            Edit details
          </button>
        </div>
      </div>

      {/* Price Input */}
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <FormField label="Price" error={fieldState.error?.message} required>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {currencyData?.symbol}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "pl-8 text-lg font-semibold tabular-nums",
                    fieldState.error && "border-destructive"
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrencyOpen(true)}
                className="shrink-0 w-20 font-medium"
              >
                {currency}
              </Button>
            </div>
          </FormField>
        )}
      />

      {/* City */}
      <FormField label="Ships from" error={errors.city?.message} required>
        <SelectionRow
          label="City"
          value={city}
          placeholder="Select your city"
          onClick={() => setCityOpen(true)}
          hasError={!!errors.city}
        />
      </FormField>

      {/* Options - Clean toggles */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Options</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue("freeShipping", !freeShipping)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-11 rounded-md border text-sm font-medium transition-colors",
              freeShipping 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-input bg-background text-foreground hover:bg-muted/50"
            )}
          >
            <Truck className="size-4" weight={freeShipping ? "fill" : "regular"} />
            Free shipping
            {freeShipping && <Check className="size-3.5" weight="bold" />}
          </button>
          <button
            type="button"
            onClick={() => setValue("acceptOffers", !acceptOffers)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-11 rounded-md border text-sm font-medium transition-colors",
              acceptOffers 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-input bg-background text-foreground hover:bg-muted/50"
            )}
          >
            <Handshake className="size-4" weight={acceptOffers ? "fill" : "regular"} />
            Accept offers
            {acceptOffers && <Check className="size-3.5" weight="bold" />}
          </button>
        </div>
      </div>

      {/* Currency Drawer */}
      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent aria-label="Select currency">
          <DrawerHeader className="border-b">
            <DrawerTitle>Currency</DrawerTitle>
          </DrawerHeader>
          <div className="py-2">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.value}
                type="button"
                onClick={() => {
                  setValue("currency", curr.value as "EUR" | "BGN" | "USD");
                  setCurrencyOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 transition-colors",
                  "hover:bg-muted/50 active:bg-muted",
                  currency === curr.value && "bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium w-6">{curr.symbol}</span>
                  <span className="text-sm">{curr.name}</span>
                </div>
                {currency === curr.value && (
                  <Check className="size-4 text-primary" weight="bold" />
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* City Drawer */}
      <Drawer open={cityOpen} onOpenChange={setCityOpen}>
        <DrawerContent aria-label="Select city">
          <DrawerHeader className="border-b">
            <DrawerTitle>Select city</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="py-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setValue("city", c, { shouldValidate: true });
                    setCityOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 transition-colors",
                    "hover:bg-muted/50 active:bg-muted",
                    city === c && "bg-muted"
                  )}
                >
                  <span className={cn(
                    "text-sm",
                    city === c ? "font-semibold" : ""
                  )}>
                    {c}
                  </span>
                  {city === c && <Check className="size-4 text-primary" weight="bold" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        By publishing, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Sale</Link>.
      </p>
    </div>
  );
}

// ============================================================================
// STEPPER - Clean, minimal navigation
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

  const stepLabels: Record<number, { title: string; subtitle: string }> = {
    1: { title: "Details", subtitle: "Title, category & condition" },
    2: { title: "Photos", subtitle: "Add up to 12 images" }, 
    3: { title: "Price", subtitle: "Set your price & shipping" },
  };

  const current = stepLabels[currentStep] ?? { title: "Step", subtitle: "" };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header - Clean & Professional */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border pt-safe">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Back button */}
          <div className="w-10">
            {!isFirstStep && (
              <button
                type="button"
                onClick={onBack}
                className="size-10 -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <CaretLeft className="size-5" />
              </button>
            )}
          </div>
          
          {/* Title & Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">{current.title}</span>
              <span className="text-xs text-muted-foreground">
                {currentStep}/{totalSteps}
              </span>
            </div>
            {/* Progress bar */}
            <div className="flex gap-1 mt-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    i + 1 <= currentStep ? "bg-foreground" : "bg-border"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Close/Cancel */}
          <Link 
            href="/demo" 
            className="size-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors -mr-2"
          >
            <X className="size-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-5">
          {children}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background border-t border-border px-4 pt-3 pb-safe">
        <div className="mx-auto max-w-lg pb-3">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch className="size-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish listing"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              className="w-full"
              size="lg"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN - Clean, professional
// ============================================================================

function SuccessScreen({ onNewListing }: { onNewListing: () => void }) {
  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-end h-14 px-4 border-b border-border">
        <Link 
          href="/demo"
          className="size-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors -mr-2"
        >
          <X className="size-5" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center space-y-6">
          {/* Success icon - simple, no animation */}
          <div className="mx-auto size-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="size-8 text-success" weight="bold" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Listing published</h1>
            <p className="text-sm text-muted-foreground">
              Your item is now live and visible to buyers.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button className="w-full" size="lg" asChild>
              <Link href="/demo">
                <Eye className="size-4" />
                View listing
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg">
                <Share className="size-4" />
                Share
              </Button>
              <Button variant="outline" size="lg" onClick={onNewListing}>
                <Plus className="size-4" />
                New listing
              </Button>
            </div>

            <Button variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link href="/demo">
                <House className="size-4" />
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

export default function DemoSellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      1: ["title", "category", "condition"],
      2: ["photos"],
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
    setShowSuccess(true);
  };

  const handleNewListing = () => {
    methods.reset();
    setCurrentStep(1);
    setShowSuccess(false);
  };

  if (showSuccess) {
    return <SuccessScreen onNewListing={handleNewListing} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepBasics />;
      case 2: return <StepPhotos />;
      case 3: return <StepPricing onEdit={setCurrentStep} />;
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