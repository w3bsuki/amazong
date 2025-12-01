"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Storefront,
  Package,
  Tag,
  Camera,
  CurrencyDollar,
  Check,
  ArrowRight,
  ArrowLeft,
  SpinnerGap,
  Sparkle,
  Warning,
  Plus,
  X,
  Image as ImageIcon,
  CaretDown,
  Lightning,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageUpload } from "@/components/image-upload";

// ============================================================================
// TYPES
// ============================================================================

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  children?: Category[];
}

interface Seller {
  id: string;
  store_name: string;
  user_id: string;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const storeSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters").max(50, "Store name is too long"),
});

const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title is too long"),
  description: z.string().min(20, "Please provide a more detailed description (at least 20 characters)").max(5000, "Description is too long"),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Enter a valid price greater than 0"),
  listPrice: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Enter a valid stock quantity"),
  tags: z.array(z.string()).default([]),
  listingType: z.enum(["normal", "boosted"]).default("normal"),
  images: z.array(z.object({
    url: z.string(),
    thumbnailUrl: z.string().optional(),
    position: z.number(),
  })).min(1, "Please add at least one product image"),
});

// Predefined tag options with badge colors
const TAG_OPTIONS = [
  { value: "new", label: "New", labelBg: "Ново", color: "bg-green-500", description: "Fresh arrival" },
  { value: "sale", label: "Sale", labelBg: "Разпродажба", color: "bg-red-500", description: "Discounted item" },
  { value: "limited", label: "Limited", labelBg: "Лимитирано", color: "bg-purple-500", description: "Limited availability" },
  { value: "trending", label: "Trending", labelBg: "Популярно", color: "bg-orange-500", description: "Hot right now" },
  { value: "bestseller", label: "Best Seller", labelBg: "Топ продажби", color: "bg-yellow-500", description: "Top selling item" },
  { value: "premium", label: "Premium", labelBg: "Премиум", color: "bg-blue-600", description: "High quality" },
  { value: "handmade", label: "Handmade", labelBg: "Ръчна изработка", color: "bg-amber-600", description: "Handcrafted item" },
  { value: "eco-friendly", label: "Eco-Friendly", labelBg: "Еко", color: "bg-emerald-500", description: "Environmentally friendly" },
] as const;

type StoreFormData = z.infer<typeof storeSchema>;
type ProductFormData = z.infer<typeof productSchema>;

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

const steps = [
  { id: 1, name: "Photos", icon: Camera },
  { id: 2, name: "Details", icon: Package },
  { id: 3, name: "Pricing", icon: CurrencyDollar },
  { id: 4, name: "Tags", icon: Tag },
  { id: 5, name: "Review", icon: Check },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;
          
          return (
            <li key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    isCompleted && "bg-green-500 shadow-green-500/20",
                    isActive && "bg-blue-500 shadow-blue-500/30 shadow-xl ring-4 ring-blue-100 scale-110",
                    !isCompleted && !isActive && "bg-gray-200"
                  )}
                >
                  {isCompleted ? (
                    <Check weight="bold" className="w-6 h-6 text-white" />
                  ) : (
                    <Icon 
                      weight={isActive ? "fill" : "regular"} 
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-white" : "text-gray-500"
                      )} 
                    />
                  )}
                </div>
                <span className={cn(
                  "mt-2 text-sm font-medium transition-colors",
                  isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                )}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-green-500 transition-all duration-300",
                        isCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================================================
// SIGN IN PROMPT
// ============================================================================

function SignInPrompt() {
  const router = useRouter();
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-20 rounded-full" />
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
            <Storefront weight="duotone" className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Start Selling Today
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Join thousands of sellers and reach millions of customers. Sign in to create your store.
        </p>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={() => router.push("/auth/login")}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
          >
            Sign In to Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <button 
              onClick={() => router.push("/auth/register")}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Create one for free
            </button>
          </p>
        </div>
        
        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "Secure" },
            { icon: Lightning, label: "Fast Setup" },
            { icon: Truck, label: "Easy Shipping" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-gray-500">
              <Icon weight="duotone" className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CREATE STORE FORM
// ============================================================================

function CreateStoreForm({ userId, onStoreCreated }: { userId: string; onStoreCreated: (seller: Seller) => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: { storeName: "" },
  });

  const onSubmit = (data: StoreFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeName: data.storeName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create store");
        }

        const seller = await response.json();
        onStoreCreated(seller);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/25 mb-6">
            <Sparkle weight="fill" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Store
          </h1>
          <p className="text-gray-600">
            Choose a unique name for your store. This will be visible to buyers.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">
                      Store Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Storefront className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="My Awesome Store"
                          className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is how customers will identify your store
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-2 duration-300"
                  role="alert"
                >
                  <Warning weight="fill" className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25"
              >
                {isPending ? (
                  <>
                    <SpinnerGap className="mr-2 w-5 h-5 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    Create Store
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CATEGORY COMBOBOX
// ============================================================================

function CategoryCombobox({ 
  categories, 
  value, 
  onChange 
}: { 
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  
  // Flatten categories for easier lookup (with null safety)
  const safeCategories = categories || [];
  const flatCategories = safeCategories.flatMap(cat => 
    cat.children 
      ? [cat, ...cat.children.map(child => ({ ...child, parentName: cat.name }))]
      : [cat]
  );
  
  const selectedCategory = flatCategories.find(cat => cat.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a category"
          className={cn(
            "w-full h-14 justify-between text-left font-normal border-gray-200 hover:bg-gray-50",
            !value && "text-gray-500"
          )}
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-400" />
            {selectedCategory ? (
              <span className="text-gray-900">{selectedCategory.name}</span>
            ) : (
              <span>Select a category...</span>
            )}
          </div>
          <CaretDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-12" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No category found.</CommandEmpty>
            {safeCategories.map((parentCat) => (
              <CommandGroup key={parentCat.id} heading={parentCat.name}>
                <CommandItem
                  value={parentCat.name}
                  onSelect={() => {
                    onChange(parentCat.id);
                    setOpen(false);
                  }}
                  className="py-3"
                >
                  <Check className={cn("mr-2 w-4 h-4", value === parentCat.id ? "opacity-100" : "opacity-0")} />
                  {parentCat.name}
                </CommandItem>
                {parentCat.children?.map((childCat) => (
                  <CommandItem
                    key={childCat.id}
                    value={`${parentCat.name} ${childCat.name}`}
                    onSelect={() => {
                      onChange(childCat.id);
                      setOpen(false);
                    }}
                    className="py-3 pl-8"
                  >
                    <Check className={cn("mr-2 w-4 h-4", value === childCat.id ? "opacity-100" : "opacity-0")} />
                    {childCat.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// TAG INPUT (Badge-Style)
// ============================================================================

function TagInput({ 
  tags, 
  onChange,
  locale = "en"
}: { 
  tags: string[];
  onChange: (tags: string[]) => void;
  locale?: string;
}) {
  const toggleTag = (tagValue: string) => {
    if (tags.includes(tagValue)) {
      onChange(tags.filter(t => t !== tagValue));
    } else if (tags.length < 5) {
      onChange([...tags, tagValue]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected tags preview */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500 w-full mb-2">Selected badges (will appear on your listing):</span>
          {tags.map((tag) => {
            const tagOption = TAG_OPTIONS.find(t => t.value === tag);
            if (!tagOption) return null;
            return (
              <Badge
                key={tag}
                className={cn(
                  "px-3 py-1.5 text-white font-semibold text-xs uppercase tracking-wide",
                  tagOption.color
                )}
              >
                {locale === "bg" ? tagOption.labelBg : tagOption.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Tag options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TAG_OPTIONS.map((option) => {
          const isSelected = tags.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              disabled={!isSelected && tags.length >= 5}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                !isSelected && tags.length >= 5 && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Badge preview */}
              <Badge
                className={cn(
                  "px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold mb-2",
                  isSelected ? option.color + " text-white" : "bg-gray-200 text-gray-600"
                )}
              >
                {locale === "bg" ? option.labelBg : option.label}
              </Badge>
              
              {/* Description */}
              <p className="text-xs text-gray-500 mt-1">
                {option.description}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check weight="bold" className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        {tags.length}/5 badges • Select up to 5 badges for your listing
      </p>
    </div>
  );
}

// ============================================================================
// LISTING FORM
// ============================================================================

function ListingForm({ seller, categories }: { seller: Seller; categories: Category[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: "",
      listPrice: "",
      stock: "1",
      tags: [],
      listingType: "normal",
      images: [],
    },
    mode: "onChange",
  });

  const { watch, trigger } = form;
  const watchedImages = watch("images");
  const watchedTags = watch("tags");
  const watchedListingType = watch("listingType");

  // Step validation
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger("images");
      case 2:
        return await trigger(["title", "description", "categoryId"]);
      case 3:
        return await trigger(["price", "stock"]);
      case 4:
        return true; // Tags are optional
      case 5:
        return true; // Review step
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCanSubmit(false); // Disable submission during navigation
      setCurrentStep(currentStep + 1);
      // Enable submission only after a short delay when on step 5
      if (currentStep + 1 === 5) {
        setTimeout(() => setCanSubmit(true), 100);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCanSubmit(false);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ListingForm] handleSubmit called, currentStep:", currentStep, "canSubmit:", canSubmit);
    // Only submit if we're on step 5 and submission is enabled
    if (currentStep !== 5 || !canSubmit) {
      console.log("[ListingForm] Submission blocked - not on step 5 or canSubmit is false");
      return;
    }
    form.handleSubmit(onSubmit)(e);
  };

  const onSubmit = (data: ProductFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            price: parseFloat(data.price),
            listPrice: data.listPrice ? parseFloat(data.listPrice) : undefined,
            stock: parseInt(data.stock),
            tags: data.tags,
            listingType: data.listingType,
            images: data.images,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create listing");
        }

        setSuccess(true);
        setTimeout(() => router.push(`/${locale}/account/selling`), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-xl shadow-green-500/30 mb-6">
            <Check weight="bold" className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Listing Created!</h2>
          <p className="text-gray-600 mb-4">Your product is now live and visible to buyers.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <SpinnerGap className="w-4 h-4 animate-spin" />
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">
          <Storefront weight="fill" className="w-3.5 h-3.5 mr-1" />
          {seller.store_name}
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
        <p className="text-gray-600">Add your product details and start selling</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Step 1: Photos */}
            <div className={cn("p-8", currentStep !== 1 && "hidden")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Camera weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Photos</h2>
                  <p className="text-gray-500 text-sm">Add high-quality images to attract buyers</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxImages={8}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-2 mt-4">
                      <ImageIcon weight="duotone" className="w-4 h-4" />
                      Upload up to 8 images. First image will be the main photo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image tips */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Sparkle weight="fill" className="w-4 h-4" />
                  Tips for great photos
                </h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Use natural lighting for best results</li>
                  <li>• Show the product from multiple angles</li>
                  <li>• Include size reference when applicable</li>
                </ul>
              </div>
            </div>

            {/* Step 2: Details */}
            <div className={cn("p-8", currentStep !== 2 && "hidden")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Package weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                  <p className="text-gray-500 text-sm">Describe your product clearly</p>
                </div>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Product Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Vintage Leather Wallet - Handcrafted"
                          className="h-14 text-lg border-gray-200"
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific and include key details like brand, color, or size
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your product in detail. Include materials, dimensions, condition, and any unique features..."
                          className="min-h-[160px] resize-none border-gray-200"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/5000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Category</FormLabel>
                      <FormControl>
                        <CategoryCombobox
                          categories={categories}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Step 3: Pricing */}
            <div className={cn("p-8", currentStep !== 3 && "hidden")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <CurrencyDollar weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pricing & Stock</h2>
                  <p className="text-gray-500 text-sm">Set your price and inventory</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Selling Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-16 text-3xl font-bold pl-10 border-gray-200"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>The price buyers will pay</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="listPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Compare at Price
                        <span className="ml-2 text-xs font-normal text-gray-400">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">$</span>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-16 text-2xl pl-10 border-gray-200 text-gray-500"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>Original price to show discount</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-base font-semibold">Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          className="h-14 text-lg border-gray-200 max-w-[200px]"
                        />
                      </FormControl>
                      <FormDescription>How many items do you have available?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price preview */}
              {watch("price") && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm text-gray-500 mb-2">Price preview:</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${parseFloat(watch("price") || "0").toFixed(2)}
                    </span>
                    {watch("listPrice") && parseFloat(watch("listPrice") || "0") > parseFloat(watch("price") || "0") && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${parseFloat(watch("listPrice") || "0").toFixed(2)}
                        </span>
                        <Badge className="bg-red-100 text-red-700 border-0">
                          {Math.round((1 - parseFloat(watch("price") || "0") / parseFloat(watch("listPrice") || "1")) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Tags */}
            <div className={cn("p-8", currentStep !== 4 && "hidden")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Tag weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Badges</h2>
                  <p className="text-gray-500 text-sm">Select badges to highlight your product</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Choose Badges</FormLabel>
                    <FormDescription className="mb-4">
                      These badges will appear on your product listing to attract buyers
                    </FormDescription>
                    <FormControl>
                      <TagInput
                        tags={field.value}
                        onChange={field.onChange}
                        locale={locale as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 5: Review & Listing Type */}
            <div className={cn("p-8", currentStep !== 5 && "hidden")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Check weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Review & Publish</h2>
                  <p className="text-gray-500 text-sm">Confirm your listing details</p>
                </div>
              </div>

              {/* Listing Type Selection */}
              <div className="mb-8">
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold mb-4 block">Choose Listing Type</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Normal Listing */}
                          <button
                            type="button"
                            onClick={() => field.onChange("normal")}
                            className={cn(
                              "relative p-6 rounded-xl border-2 text-left transition-all duration-200",
                              field.value === "normal"
                                ? "border-blue-500 bg-blue-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                field.value === "normal" ? "bg-blue-500" : "bg-gray-200"
                              )}>
                                <Package weight="fill" className={cn(
                                  "w-6 h-6",
                                  field.value === "normal" ? "text-white" : "text-gray-500"
                                )} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">Normal Listing</h4>
                                <p className="text-sm text-gray-500 mb-2">Standard visibility in search and category pages</p>
                                <Badge className="bg-green-100 text-green-700 border-0">Free</Badge>
                              </div>
                            </div>
                            {field.value === "normal" && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check weight="bold" className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>

                          {/* Boosted Listing */}
                          <button
                            type="button"
                            onClick={() => field.onChange("boosted")}
                            className={cn(
                              "relative p-6 rounded-xl border-2 text-left transition-all duration-200",
                              field.value === "boosted"
                                ? "border-amber-500 bg-amber-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            )}
                          >
                            <div className="absolute -top-3 -right-3">
                              <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                                <Lightning weight="fill" className="w-3 h-3 mr-1" />
                                Boost
                              </Badge>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                field.value === "boosted" ? "bg-amber-500" : "bg-gray-200"
                              )}>
                                <Lightning weight="fill" className={cn(
                                  "w-6 h-6",
                                  field.value === "boosted" ? "text-white" : "text-gray-500"
                                )} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">Boosted Listing</h4>
                                <p className="text-sm text-gray-500 mb-2">Featured in &quot;Recommended&quot; section with priority visibility</p>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-amber-100 text-amber-700 border-0">2.99 лв / 7 days</Badge>
                                  <span className="text-xs text-gray-400">Premium required</span>
                                </div>
                              </div>
                            </div>
                            {field.value === "boosted" && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                <Check weight="bold" className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Listing Summary */}
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkle weight="fill" className="w-5 h-5 text-amber-500" />
                  Listing Summary
                </h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Title</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">
                      {watch("title") || "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {parseFloat(watch("price") || "0").toFixed(2)} лв.
                      </span>
                      {watch("listPrice") && parseFloat(watch("listPrice") || "0") > parseFloat(watch("price") || "0") && (
                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                          -{Math.round((1 - parseFloat(watch("price") || "0") / parseFloat(watch("listPrice") || "1")) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Stock</span>
                    <span className="font-medium text-gray-900">{watch("stock")} units</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Images</span>
                    <span className="font-medium text-gray-900">{watchedImages.length} photos</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">Badges</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                      {watchedTags.length > 0 ? (
                        watchedTags.map(tag => {
                          const tagOption = TAG_OPTIONS.find(t => t.value === tag);
                          return tagOption ? (
                            <Badge key={tag} className={cn("text-[10px] text-white", tagOption.color)}>
                              {tagOption.label}
                            </Badge>
                          ) : null;
                        })
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Listing Type</span>
                    <Badge className={cn(
                      "border-0",
                      watch("listingType") === "boosted" 
                        ? "bg-amber-100 text-amber-700" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {watch("listingType") === "boosted" ? (
                        <>
                          <Lightning weight="fill" className="w-3 h-3 mr-1" />
                          Boosted
                        </>
                      ) : "Normal"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="mx-8 mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-2 duration-300"
                role="alert"
              >
                <Warning weight="fill" className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      step === currentStep ? "bg-blue-600" : step < currentStep ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending || !canSubmit}
                  className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
                >
                  {isPending ? (
                    <>
                      <SpinnerGap className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check weight="bold" className="w-4 h-4" />
                      Publish Listing
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SellPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let initialized = false;
    
    const fetchSellerAndCategories = async (currentUser: any) => {
      console.log("[SellPage] Fetching seller and categories...");
      try {
        if (currentUser) {
          // Check if user is a seller with timeout
          console.log("[SellPage] Checking seller status for user:", currentUser.id);
          try {
            const sellerPromise = supabase
              .from("sellers")
              .select("*")
              .eq("id", currentUser.id)
              .single();
            
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Seller query timeout")), 5000)
            );
            
            const { data: sellerData, error: sellerError } = await Promise.race([sellerPromise, timeoutPromise]) as any;
            
            if (sellerError && sellerError.code !== 'PGRST116') {
              console.warn("[SellPage] Seller query error:", sellerError);
            }
            console.log("[SellPage] Seller data:", sellerData);
            setSeller(sellerData);
          } catch (sellerErr) {
            console.warn("[SellPage] Seller check failed:", sellerErr);
            setSeller(null);
          }
        }

        // Fetch categories
        console.log("[SellPage] Fetching categories...");
        const categoriesResponse = await fetch("/api/categories?children=true");
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log("[SellPage] Categories:", categoriesData?.categories?.length);
          setCategories(categoriesData?.categories || []);
        }
      } catch (error) {
        console.error("[SellPage] Fetch error:", error);
      } finally {
        console.log("[SellPage] Setting loading to false");
        setLoading(false);
      }
    };

    // Listen for auth changes - this fires immediately with current state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      console.log("[SellPage] Auth state changed:", session?.user?.email ?? "no user");
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Only fetch on first auth state or if not yet initialized
      if (!initialized) {
        initialized = true;
        await fetchSellerAndCategories(currentUser);
      } else if (currentUser) {
        // User logged in after initial load
        const { data: sellerData } = await supabase
          .from("sellers")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        setSeller(sellerData);
      } else {
        setSeller(null);
      }
    });

    // Fallback: if onAuthStateChange doesn't fire in 2 seconds, proceed without user
    const fallbackTimer = setTimeout(() => {
      if (!initialized) {
        console.log("[SellPage] Fallback: no auth state received, proceeding without user");
        initialized = true;
        fetchSellerAndCategories(null);
      }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <SpinnerGap className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <SignInPrompt />;
  }

  // No store yet
  if (!seller) {
    return (
      <CreateStoreForm
        userId={user.id}
        onStoreCreated={(newSeller) => setSeller(newSeller)}
      />
    );
  }

  // Main listing form
  return <ListingForm seller={seller} categories={categories} />;
}
