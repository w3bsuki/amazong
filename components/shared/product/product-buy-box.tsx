"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { useLocale } from "next-intl";
import { z } from "zod";
import {
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Types ---

type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK";

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

interface Option {
  id: string;
  value: string;
  label: string;
  stockInfo: StockInfo;
  price?: price;
}

interface Hinges {
  label: string;
  id: string;
  name: string;
  options?: Option[];
  min?: number;
  max?: number;
}

type price = {
  regular?: number;
  sale?: number;
  currency?: string;
};

const formSchema = z.object({
  quantity: z.number().min(1).max(99),
  size: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;

interface ProductBuyBoxProps {
  product: {
    name: string;
    price: price;
    store: {
      name: string;
      rating: string;
      verified: boolean;
    };
    images: Array<{ src: string; alt: string }>;
    hinges?: Record<string, Hinges>;
    soldCount?: number;
    shipping?: {
      text: string;
      canShip: boolean;
    };
    returns?: string;
    description?: string;
    itemSpecifics?: React.ReactNode;
  };
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const locale = useLocale();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const sizeHinges = product.hinges?.size;
  const size = form.watch("size");

  const selectedItem = useMemo(() => {
    if (!sizeHinges?.options) return null;
    return sizeHinges.options.find((item) => item.value === size);
  }, [size, sizeHinges]);

  const stockInfo = selectedItem?.stockInfo;

  const onSubmit = (_data: FormType) => {
    // TODO: Implement add to cart functionality
  };

  return (
    <div className="h-full flex flex-col space-y-form-sm">
      {/* Title & Seller Info */}
      <div className="space-y-1.5">
        <h1 className="text-xl lg:text-2xl font-bold leading-tight text-foreground tracking-tight m-0">
          {product.name}
        </h1>

        <div className="hidden lg:flex items-center gap-form-sm bg-background border border-border p-form-sm rounded-md shadow-sm">
          <Avatar className="h-9 w-9 border border-border shrink-0">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-muted text-muted-foreground">BD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-sm hover:underline cursor-pointer truncate">
              {product.store.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {product.store.rating} positive feedback
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs border-cta-trust-blue/20 text-cta-trust-blue hover:bg-cta-trust-blue/5 rounded-full">
              <Store className="mr-1 h-3 w-3" /> Visit
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-full">
              <MessageCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2 lg:grid lg:grid-cols-[90px_1fr] lg:gap-form-sm">
          <span className="text-sm font-medium text-muted-foreground hidden lg:block">Price:</span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              {new Intl.NumberFormat(locale, { style: "currency", currency: product.price.currency || "USD", minimumFractionDigits: 2 }).format(product.price.sale || 0)}
              <span className="text-xs font-normal text-muted-foreground ml-1">{locale === "bg" ? "с ДДС" : "incl. VAT"}</span>
            </span>
            {product.price.regular && (
              <span className="text-sm text-muted-foreground">
                <span className="lg:hidden">Was: </span>
                <span className="line-through">{new Intl.NumberFormat(locale, { style: "currency", currency: product.price.currency || "USD", minimumFractionDigits: 2 }).format(product.price.regular)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Condition */}
        <div className="flex items-center gap-2 lg:grid lg:grid-cols-[90px_1fr] lg:gap-form-sm">
          <span className="text-sm font-medium text-muted-foreground">Condition:</span>
          <span className="font-bold text-foreground">New with tags</span>
        </div>
      </div>

      {/* Form (Size & Buttons) */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-form-sm">
          {sizeHinges && sizeHinges.options && sizeHinges.options.length > 0 && (
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      Select Size
                    </FormLabel>
                    <span className="text-xs font-medium text-cta-trust-blue cursor-pointer hover:underline">Size Guide</span>
                  </div>
                  <FormControl>
                    <SizeRadioGroup field={field} options={sizeHinges.options ?? []} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Quantity Field */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex flex-col lg:grid lg:grid-cols-[90px_1fr] lg:items-center gap-2 lg:gap-form-sm space-y-0">
                <FormLabel className="text-sm font-medium text-muted-foreground">Quantity:</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-lg rounded-r-none border-r-0"
                        onClick={() => field.onChange(Math.max(1, field.value - 1))}
                        disabled={field.value <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="h-8 w-10 border-y border-input flex items-center justify-center text-sm font-bold">
                        {field.value}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-lg rounded-l-none border-l-0"
                        onClick={() => field.onChange(Math.min(99, field.value + 1))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-success">
                        {stockInfo?.stockQuantity ? `${stockInfo.stockQuantity} available` : "In Stock"}
                      </span>
                      {product.soldCount ? <span className="text-2xs text-muted-foreground font-medium uppercase tracking-wider">{product.soldCount} sold</span> : null}
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="hidden flex-col gap-2 lg:flex">
            <Button className="w-full bg-cta-trust-blue text-white hover:bg-cta-trust-blue/90 h-11 text-base font-bold rounded-full shadow-sm transition-colors" size="lg">
              Buy It Now
            </Button>
            <Button variant="outline" className="w-full border-cta-trust-blue text-cta-trust-blue hover:bg-cta-trust-blue/5 h-11 text-base font-bold rounded-full transition-colors" size="lg">
              Add to cart
            </Button>
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted h-11 text-base font-bold rounded-full transition-colors" size="lg">
              <Heart className="mr-2 h-5 w-5" /> Add to Watchlist
            </Button>
          </div>
        </form>
      </Form>

      {/* About this item & Item specifics - Moved here to use the space */}
      <div className="hidden lg:block space-y-form py-form-sm">
        {product.description && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">About this item</h2>
            <div className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {product.itemSpecifics && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Item specifics</h2>
            <div className="text-sm">
              {product.itemSpecifics}
            </div>
          </div>
        )}
      </div>

      {/* Shipping, Returns, Payments - Styled like Urgency Box */}
      <div className="hidden lg:block bg-muted/30 p-form rounded-md space-y-form-sm border border-border/50 mt-auto">
        {/* Shipping */}
        <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
          <div className="text-muted-foreground font-medium">Shipping:</div>
          <div className="text-foreground">
            <span className="font-bold">{product.shipping?.text || "Shipping calculated at checkout"}</span>
            <span className="text-muted-foreground mx-2">|</span>
            <span className="text-cta-trust-blue font-medium hover:underline cursor-pointer">See details</span>
          </div>
        </div>

        {/* Returns */}
        <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
          <div className="text-muted-foreground font-medium">Returns:</div>
          <div className="text-foreground font-medium">
            {product.returns || "30 days returns. Buyer pays for return shipping."}
          </div>
        </div>

        {/* Payments */}
        <div className="grid grid-cols-[90px_1fr] gap-2 text-sm items-center">
          <div className="text-muted-foreground font-medium">Payments:</div>
          <div className="flex gap-1.5">
            <div className="h-5 w-8 bg-card border border-border rounded-sm shadow-sm"></div>
            <div className="h-5 w-8 bg-card border border-border rounded-sm shadow-sm"></div>
            <div className="h-5 w-8 bg-card border border-border rounded-sm shadow-sm"></div>
            <div className="h-5 w-8 bg-card border border-border rounded-sm shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SizeRadioGroupProps {
  options?: Array<Option>;
  field: ControllerRenderProps<FormType>;
}

const SizeRadioGroup = ({ options, field }: SizeRadioGroupProps) => {
  if (!options) return null;

  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={field.onChange}
      className="flex flex-wrap gap-form-sm"
    >
      {options.map((item) => (
        <FormItem key={item.id}>
          <FormLabel className="cursor-pointer">
            <RadioGroupItem
              value={item.value}
              id={item.id}
              className="peer sr-only"
              disabled={item.stockInfo.stockStatusCode === "OUT_OF_STOCK"}
            />
            <div className="flex h-9 min-w-10 lg:h-10 lg:min-w-14 items-center justify-center rounded-md border border-border bg-background px-2 lg:px-3 text-xs lg:text-sm font-medium text-foreground transition-all hover:border-foreground peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:bg-muted peer-disabled:text-muted-foreground">
              {item.label}
            </div>
          </FormLabel>
        </FormItem>
      ))}
    </RadioGroup>
  );
};
