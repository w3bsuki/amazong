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
  Handshake,
  CircleNotch,
  Image as ImageIcon,
  Minus,
  Star,
  Sparkle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// DEMO MOBILE SELL FORM V3 - Premium Mobile-First UX
// 
// Design principles:
// - Mobile-first with 48px touch targets
// - "Label inside" pattern for compact inputs
// - Drawer-based selections for categories/conditions
// - Clean typography with proper hierarchy
// - Semantic colors from design system
// - No animations, no gradients, no arbitrary values
// ============================================================================

// Schema
const sellFormSchema = z.object({
  title: z.string().min(5, "Min 5 characters").max(80, "Max 80 characters"),
  category: z.string().min(1, "Select a category"),
  condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"]),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(12),
  price: z.string().min(1, "Enter a price").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Invalid price"),
  currency: z.enum(["EUR", "BGN", "USD"]).default("EUR"),
  quantity: z.number().min(1).default(1),
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  city: z.string().min(1, "Select your city"),
  acceptOffers: z.boolean().default(false),
  description: z.string().max(4000).optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// Data
const CATEGORIES = [
  { id: "electronics", name: "Electronics", nameBg: "Електроника" },
  { id: "fashion", name: "Fashion", nameBg: "Мода" },
  { id: "home", name: "Home & Garden", nameBg: "Дом и градина" },
  { id: "sports", name: "Sports", nameBg: "Спорт" },
  { id: "toys", name: "Toys & Games", nameBg: "Играчки" },
  { id: "books", name: "Books & Media", nameBg: "Книги" },
  { id: "auto", name: "Auto Parts", nameBg: "Авточасти" },
  { id: "other", name: "Other", nameBg: "Друго" },
];

const CONDITIONS = [
  { value: "new-with-tags", label: "New with tags", labelBg: "Ново с етикет", desc: "Brand new, original tags attached", descBg: "Чисто ново, с оригинален етикет" },
  { value: "new-without-tags", label: "New without tags", labelBg: "Ново без етикет", desc: "Never used, no original packaging", descBg: "Неизползвано, без опаковка" },
  { value: "like-new", label: "Like new", labelBg: "Като ново", desc: "Used once or twice, excellent condition", descBg: "Използвано веднъж, отлично състояние" },
  { value: "good", label: "Good", labelBg: "Добро", desc: "Light wear, fully functional", descBg: "Леки следи от употреба, работи перфектно" },
  { value: "fair", label: "Fair", labelBg: "Задоволително", desc: "Visible wear, works perfectly", descBg: "Видими следи от употреба, работи" },
] as const;

const CITIES = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"];

const CURRENCIES = [
  { value: "EUR", symbol: "€", name: "Euro" },
  { value: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { value: "USD", symbol: "$", name: "US Dollar" },
];

const TOTAL_STEPS = 4;

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

/** Labeled input row - "Label Inside" pattern with 48px height */
function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  suffix,
  prefix,
  error,
  required,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "decimal" | "numeric";
  maxLength?: number;
  suffix?: ReactNode;
  prefix?: ReactNode;
  error?: boolean;
  required?: boolean;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center h-12 px-4 rounded-md border transition-all",
        "bg-background shadow-xs",
        "focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5",
        error ? "border-destructive bg-destructive/5" : "border-border"
      )}
    >
      <label
        htmlFor={id}
        className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2"
      >
        {label}{required && "*"}:
      </label>
      {prefix && <span className="text-muted-foreground font-bold text-sm shrink-0 mr-1">{prefix}</span>}
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
      />
      {suffix && <span className="ml-2 shrink-0">{suffix}</span>}
    </div>
  );
}

/** Selector row - triggers drawer on tap */
function SelectorRow({
  label,
  value,
  placeholder,
  onClick,
  error,
  required,
}: {
  label: string;
  value: string | undefined;
  placeholder: string;
  onClick: () => void;
  error?: boolean;
  required?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center h-12 px-4 rounded-md border transition-all text-left",
        "bg-background shadow-xs",
        "hover:border-primary/30 active:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5",
        error ? "border-destructive bg-destructive/5" : "border-border"
      )}
    >
      <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
        {label}{required && "*"}:
      </span>
      <span
        className={cn(
          "text-sm font-semibold flex-1 truncate",
          value ? "text-foreground" : "text-muted-foreground/50"
        )}
      >
        {value || placeholder}
      </span>
      <CaretRight className="size-4 text-muted-foreground/50 shrink-0 ml-2" weight="bold" />
    </button>
  );
}

/** Quantity stepper with +/- buttons */
function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center h-12 rounded-md border border-border bg-background shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full w-12 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors border-r border-border/50"
        aria-label="Decrease"
      >
        <Minus className="size-4" weight="bold" />
      </button>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm font-bold tabular-nums">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full w-12 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors border-l border-border/50"
        aria-label="Increase"
      >
        <Plus className="size-4" weight="bold" />
      </button>
    </div>
  );
}

/** Toggle button - for options like "Free Shipping" */
function ToggleOption({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between h-14 px-4 rounded-md border transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5",
        checked
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-md flex items-center justify-center border",
            checked
              ? "bg-primary/10 border-primary/20"
              : "bg-muted/50 border-border"
          )}
        >
          <Icon
            className={cn("size-5", checked ? "text-primary" : "text-muted-foreground")}
            weight={checked ? "fill" : "regular"}
          />
        </div>
        <span className={cn("text-sm font-semibold", checked ? "text-primary" : "text-foreground")}>
          {label}
        </span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </button>
  );
}

/** Section header with icon */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="size-10 rounded-md bg-muted/50 border border-border flex items-center justify-center shrink-0">
        <Icon className="size-5 text-muted-foreground" weight="bold" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/** Error message */
function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <p className="text-xs font-medium text-destructive mt-2 px-1">{message}</p>
  );
}

// ============================================================================
// STEP 1: BASICS - Title, Category, Condition
// ============================================================================

function StepBasics() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const title = watch("title") || "";
  const category = watch("category");
  const condition = watch("condition");

  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const selectedCondition = CONDITIONS.find(c => c.value === condition);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sparkle}
        title="What are you selling?"
        subtitle="Add the basic details about your item"
      />

      <div className="space-y-3">
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <LabeledInput
                id="title"
                label="Title"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="e.g., iPhone 15 Pro Max 256GB"
                maxLength={80}
                required
                error={!!fieldState.error}
                suffix={
                  <span
                    className={cn(
                      "text-2xs font-bold tabular-nums",
                      title.length >= 80
                        ? "text-destructive"
                        : title.length >= 5
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40"
                    )}
                  >
                    {title.length}/80
                  </span>
                }
              />
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />

        {/* Category */}
        <div>
          <SelectorRow
            label="Category"
            value={selectedCategory?.name}
            placeholder="Select a category"
            onClick={() => setCategoryOpen(true)}
            error={!!errors.category}
            required
          />
          <FieldError message={errors.category?.message} />
        </div>

        {/* Condition */}
        <div>
          <SelectorRow
            label="Condition"
            value={selectedCondition?.label}
            placeholder="Select condition"
            onClick={() => setConditionOpen(true)}
            error={!!errors.condition}
            required
          />
          <FieldError message={errors.condition?.message} />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description (optional)
                </label>
                <span className="text-2xs font-bold tabular-nums text-muted-foreground/60">
                  {(field.value || "").length}/4000
                </span>
              </div>
              <Textarea
                {...field}
                placeholder="Describe your item: brand, size, condition details..."
                rows={4}
                maxLength={4000}
                className="resize-none text-sm bg-background border-border shadow-xs focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/5"
              />
            </div>
          )}
        />
      </div>

      {/* Category Drawer */}
      <Drawer open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Category</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[60vh]">
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
                      "w-full flex items-center justify-between h-14 px-4 rounded-md border transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary font-bold"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className="text-base">{cat.name}</span>
                    {isSelected && <Check className="size-5" weight="bold" />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Condition Drawer */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Condition</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[60vh]">
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
                      "w-full flex flex-col items-start gap-1 p-4 rounded-md border transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn("text-base font-semibold", isSelected && "text-primary")}>
                        {cond.label}
                      </span>
                      {isSelected && <Check className="size-5 text-primary" weight="bold" />}
                    </div>
                    <span className="text-sm text-muted-foreground">{cond.desc}</span>
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
// STEP 2: PHOTOS
// ============================================================================

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
    <div className="space-y-6">
      <SectionHeader
        icon={Camera}
        title="Photos"
        subtitle="Add up to 12 photos. First photo is the cover."
      />

      {/* Counter Badge */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tap to add photos. Drag to reorder.
        </p>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold tabular-nums",
            photos.length === 0
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          {photos.length}/12
        </span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Add Button - Always First */}
        {photos.length < 12 && (
          <button
            type="button"
            onClick={addDemoPhoto}
            className={cn(
              "aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all",
              "hover:bg-muted/50 active:bg-muted",
              errors.photos ? "border-destructive bg-destructive/5" : "border-border"
            )}
          >
            <Plus className="size-6 text-muted-foreground" weight="bold" />
            <span className="text-xs font-semibold text-muted-foreground">Add</span>
          </button>
        )}

        {/* Photo Thumbnails */}
        {photos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className="relative aspect-square rounded-md overflow-hidden bg-muted border border-border"
          >
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            
            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-2xs font-bold bg-foreground text-background">
                Cover
              </div>
            )}
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1.5 right-1.5 size-7 flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition-colors shadow-sm"
            >
              <X className="size-4" weight="bold" />
            </button>
          </div>
        ))}
      </div>

      <FieldError message={errors.photos?.message} />

      {/* Tips */}
      <div className="p-4 rounded-md bg-muted/50 border border-border">
        <p className="text-xs font-semibold text-foreground mb-2">Photo tips</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use natural light for best results</li>
          <li>• Show the item from multiple angles</li>
          <li>• Include any flaws or damage</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 3: PRICING & SHIPPING
// ============================================================================

function StepPricing() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const currency = watch("currency") || "EUR";
  const city = watch("city");
  const quantity = watch("quantity") || 1;
  const freeShipping = watch("freeShipping");
  const acceptOffers = watch("acceptOffers");

  const currencyData = CURRENCIES.find(c => c.value === currency);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Star}
        title="Price & Shipping"
        subtitle="Set your price and shipping options"
      />

      <div className="space-y-4">
        {/* Price Input */}
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <LabeledInput
                    id="price"
                    label="Price"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="0.00"
                    inputMode="decimal"
                    required
                    error={!!fieldState.error}
                    prefix={currencyData?.symbol}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  className="h-12 px-4 rounded-md border border-border bg-background shadow-xs hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  <span className="text-sm font-bold">{currency}</span>
                  <CaretRight className="size-3.5 text-muted-foreground/50" weight="bold" />
                </button>
              </div>
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Quantity
          </label>
          <div className="w-40">
            <QuantityStepper
              value={quantity}
              onChange={(val) => setValue("quantity", val)}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <SelectorRow
            label="Ships from"
            value={city}
            placeholder="Select your city"
            onClick={() => setCityOpen(true)}
            error={!!errors.city}
            required
          />
          <FieldError message={errors.city?.message} />
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-2" />

        {/* Options */}
        <div className="space-y-3">
          <ToggleOption
            icon={Truck}
            label="Free shipping"
            checked={freeShipping}
            onChange={(checked) => setValue("freeShipping", checked)}
          />
          <ToggleOption
            icon={Handshake}
            label="Accept offers"
            checked={acceptOffers}
            onChange={(checked) => setValue("acceptOffers", checked)}
          />
        </div>
      </div>

      {/* Currency Drawer */}
      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Currency</DrawerTitle>
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
                    "w-full flex items-center justify-between h-14 px-4 rounded-md border transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-8">{curr.symbol}</span>
                    <span className="text-base">{curr.name}</span>
                  </div>
                  {isSelected && <Check className="size-5 text-primary" weight="bold" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      {/* City Drawer */}
      <Drawer open={cityOpen} onOpenChange={setCityOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">Select city</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4 space-y-2">
              {CITIES.map((c) => {
                const isSelected = city === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setValue("city", c, { shouldValidate: true });
                      setCityOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between h-14 px-4 rounded-md border transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary font-bold"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className="text-base">{c}</span>
                    {isSelected && <Check className="size-5" weight="bold" />}
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
// STEP 4: REVIEW
// ============================================================================

function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { watch } = useFormContext<SellFormData>();
  const data = watch();

  const selectedCategory = CATEGORIES.find(c => c.id === data.category);
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);
  const currencyData = CURRENCIES.find(c => c.value === data.currency);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Eye}
        title="Review your listing"
        subtitle="Make sure everything looks good before publishing"
      />

      {/* Preview Card */}
      <div className="rounded-md border border-border bg-card overflow-hidden">
        {/* Image */}
        {data.photos?.[0] ? (
          <div className="aspect-square bg-muted">
            <img
              src={data.photos[0]}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square bg-muted flex items-center justify-center">
            <ImageIcon className="size-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Details */}
        <div className="p-4 space-y-3">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold line-clamp-2 flex-1">
              {data.title || "Untitled listing"}
            </h3>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-foreground">
                {currencyData?.symbol}{data.price || "0.00"}
              </p>
              {data.acceptOffers && (
                <p className="text-xs text-primary font-medium">Make offer</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {selectedCategory && (
              <span className="px-2 py-1 rounded-full bg-muted font-medium">
                {selectedCategory.name}
              </span>
            )}
            {selectedCondition && (
              <span className="px-2 py-1 rounded-full bg-muted font-medium">
                {selectedCondition.label}
              </span>
            )}
            {data.freeShipping && (
              <span className="px-2 py-1 rounded-full bg-shipping-free/10 text-shipping-free font-semibold">
                Free shipping
              </span>
            )}
          </div>

          {/* Location */}
          {data.city && (
            <p className="text-xs text-muted-foreground">
              Ships from {data.city}
            </p>
          )}
        </div>
      </div>

      {/* Edit Sections */}
      <div className="space-y-2">
        <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          Quick edit
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="h-12 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="h-12 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => onEdit(3)}
            className="h-12 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            Price
          </button>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center">
        By publishing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Sale
        </Link>
        .
      </p>
    </div>
  );
}

// ============================================================================
// STEPPER WRAPPER
// ============================================================================

function StepperWrapper({
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
  const progressPercent = (currentStep / totalSteps) * 100;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const stepLabels: Record<number, string> = {
    1: "Basics",
    2: "Photos",
    3: "Price",
    4: "Review",
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back / Close */}
          <div className="w-10">
            {!isFirstStep ? (
              <button
                type="button"
                onClick={onBack}
                className="size-10 -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label="Back"
              >
                <CaretLeft className="size-5" weight="bold" />
              </button>
            ) : (
              <Link
                href="/demo"
                className="size-10 -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </Link>
            )}
          </div>

          {/* Step Info */}
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground">
              {currentStep}
            </span>
            <span className="text-sm font-bold text-foreground">
              {stepLabels[currentStep]}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              of {totalSteps}
            </span>
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-200"
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

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background border-t border-border px-4 py-3 pb-safe">
        <div className="mx-auto max-w-lg">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full h-12 gap-2 text-sm font-bold"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch className="size-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Listing"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              className="w-full h-12 gap-2 text-sm font-bold"
              size="lg"
            >
              Continue
              <ArrowRight className="size-4" weight="bold" />
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

function SuccessScreen({ onNewListing }: { onNewListing: () => void }) {
  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-end h-14 px-4 border-b border-border">
        <Link
          href="/demo"
          className="size-10 -mr-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <X className="size-5" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center space-y-8">
          {/* Success Icon */}
          <div className="mx-auto size-20 rounded-full bg-success flex items-center justify-center">
            <Check className="size-10 text-success-foreground" weight="bold" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Published!</h1>
            <p className="text-base text-muted-foreground">
              Your listing is live and visible to buyers.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button className="w-full h-12 gap-2" size="lg" asChild>
              <Link href="/demo">
                <Eye className="size-5" />
                View Listing
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-12 gap-2">
                <Share className="size-5" />
                Share
              </Button>
              <Button variant="outline" size="lg" className="h-12 gap-2" onClick={onNewListing}>
                <Plus className="size-5" />
                New
              </Button>
            </div>

            <Button variant="ghost" className="w-full h-12 text-muted-foreground" asChild>
              <Link href="/demo">
                <House className="size-5" />
                Back to Home
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

export default function DemoSell3Page() {
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
      quantity: 1,
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
      case 1:
        return <StepBasics />;
      case 2:
        return <StepPhotos />;
      case 3:
        return <StepPricing />;
      case 4:
        return <StepReview onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <StepperWrapper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {renderStep()}
      </StepperWrapper>
    </FormProvider>
  );
}
