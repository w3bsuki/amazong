"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VerifiedAvatar } from "@/components/shared/verified-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Check, 
  Copy, 
  Sun, 
  Moon, 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Flame,
  Zap,
  Eye,
  Home,
  Palette,
  Type,
  MousePointer,
  LayoutGrid,
  Layers,
  Box,
  Menu,
  Store,
  Bell,
  Search,
  Sparkles,
  Tag,
  BadgeCheck,
  CircleDot,
  ArrowRight,
} from "lucide-react";

// ============================================
// NAVIGATION CONFIG
// ============================================
const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "colors", label: "Color Palette", icon: Palette },
  { id: "badges", label: "Badges", icon: Tag },
  { id: "buttons", label: "Buttons", icon: MousePointer },
  { id: "typography", label: "Typography", icon: Type },
  { id: "forms", label: "Form Controls", icon: LayoutGrid },
  { id: "cards", label: "Cards", icon: Box },
  { id: "marketplace", label: "E-Commerce", icon: ShoppingCart },
] as const;

// ============================================
// COPY UTILITY
// ============================================
function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return { copiedValue, copy };
}

function CopyButton({ value, className }: { value: string; className?: string }) {
  const { copiedValue, copy } = useCopyToClipboard();
  const isCopied = copiedValue === value;

  return (
    <button
      onClick={() => copy(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md size-7 text-muted-foreground/60 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
        isCopied && "text-emerald-500 hover:text-emerald-500",
        className
      )}
      title={isCopied ? "Copied!" : "Copy"}
    >
      {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

// ============================================
// COLOR SWATCH - PROFESSIONAL
// ============================================
function ColorSwatch({ 
  name, 
  variable,
  className,
}: { 
  name: string;
  variable: string;
  className?: string;
}) {
  return (
    <div className="group relative">
      <div className={cn(
        "h-16 w-full rounded-lg border border-zinc-200/80 dark:border-zinc-700/50 shadow-sm transition-shadow hover:shadow-md",
        className
      )} />
      <div className="mt-2.5 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{name}</p>
          <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{variable}</p>
        </div>
        <CopyButton value={`var(${variable})`} className="opacity-0 group-hover:opacity-100 -mt-0.5" />
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADER
// ============================================
function SectionHeader({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">{number}</span>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h2>
      </div>
      <p className="text-[15px] text-zinc-600 dark:text-zinc-400 max-w-2xl">{description}</p>
    </div>
  );
}

// ============================================
// COMPONENT SHOWCASE BOX
// ============================================
function ShowcaseBox({ 
  title, 
  children, 
  className 
}: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden",
      className
    )}>
      {title && (
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</h3>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================
export function DesignSystemClient() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-none text-[15px]">Treido</h1>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">Design System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="size-8 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => {
                    setActiveSection(id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all",
                    activeSection === id
                      ? "bg-blue-50 dark:bg-blue-950/50 font-medium text-blue-700 dark:text-blue-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn(
                    "size-4",
                    activeSection === id ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"
                  )} />
                  {label}
                </a>
              ))}
            </nav>

            <div className="px-3 mt-6">
              <Separator className="bg-zinc-100 dark:bg-zinc-800" />
            </div>

            <div className="px-3 mt-4">
              <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mb-2">
                Resources
              </p>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <Home className="size-4 text-zinc-400 dark:text-zinc-500" />
                Back to Site
              </Link>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 p-4">
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 text-center">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
                Tailwind v4 • oklch • shadcn/ui
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm lg:hidden"
      >
        {sidebarOpen ? <X className="size-5 text-zinc-600" /> : <Menu className="size-5 text-zinc-600" />}
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <OverviewSection />
          <ColorsSection />
          <BadgesSection />
          <ButtonsSection />
          <TypographySection />
          <FormsSection />
          <CardsSection />
          <MarketplaceSection />

          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              Treido Design System v2.0
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

// ============================================
// SECTION: OVERVIEW
// ============================================
function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-8">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 mb-5">
          <CircleDot className="size-3 text-blue-600 dark:text-blue-400" />
          <span className="text-[12px] font-medium text-blue-700 dark:text-blue-400">v2.0 Preview</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
          Design System
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
          Professional design tokens and components for the Treido marketplace. Built with shadcn/ui and Tailwind CSS v4.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Palette, title: "oklch Colors", description: "Perceptually uniform" },
          { icon: Layers, title: "100+ Tokens", description: "Semantic variables" },
          { icon: Moon, title: "Dark Mode", description: "First-class support" },
          { icon: Shield, title: "WCAG AA", description: "4.5:1 contrast" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 mb-3">
              <item.icon className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">{item.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// SECTION: COLORS
// ============================================
function ColorsSection() {
  return (
    <section id="colors" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="01"
        title="Color Palette"
        description="Our color system uses oklch for perceptually uniform colors across light and dark themes."
      />

      {/* Primary Colors */}
      <ShowcaseBox title="Primary Colors" className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <ColorSwatch name="Primary" variable="--primary" className="bg-primary" />
          <ColorSwatch name="Primary FG" variable="--primary-foreground" className="bg-primary-foreground border-2" />
          <ColorSwatch name="Secondary" variable="--secondary" className="bg-secondary" />
          <ColorSwatch name="Accent" variable="--accent" className="bg-accent" />
          <ColorSwatch name="Muted" variable="--muted" className="bg-muted" />
          <ColorSwatch name="Destructive" variable="--destructive" className="bg-destructive" />
        </div>
      </ShowcaseBox>

      {/* Semantic Status */}
      <ShowcaseBox title="Semantic Status" className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch name="Success" variable="--success" className="bg-success" />
          <ColorSwatch name="Warning" variable="--warning" className="bg-warning" />
          <ColorSwatch name="Error" variable="--error" className="bg-error" />
          <ColorSwatch name="Info" variable="--info" className="bg-info" />
        </div>
      </ShowcaseBox>

      {/* Surfaces */}
      <ShowcaseBox title="Surfaces &amp; Backgrounds">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch name="Background" variable="--background" className="bg-background" />
          <ColorSwatch name="Card" variable="--card" className="bg-card" />
          <ColorSwatch name="Popover" variable="--popover" className="bg-popover" />
          <ColorSwatch name="Border" variable="--border" className="bg-border" />
        </div>
      </ShowcaseBox>
    </section>
  );
}

// ============================================
// SECTION: BADGES
// ============================================
function BadgesSection() {
  return (
    <section id="badges" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="02"
        title="Badges"
        description="A comprehensive badge system with semantic colors and marketplace-specific variants."
      />

      {/* Default Badges */}
      <ShowcaseBox title="Default Variants" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-transparent rounded-md px-3 py-1 text-[12px] font-medium">Default</Badge>
          <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-transparent rounded-md px-3 py-1 text-[12px] font-medium">Secondary</Badge>
          <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-transparent rounded-md px-3 py-1 text-[12px] font-medium">Outline</Badge>
          <Badge variant="destructive" className="rounded-md px-3 py-1 text-[12px] font-medium">Destructive</Badge>
        </div>
      </ShowcaseBox>

      {/* Status Badges - Clean Blue Style */}
      <ShowcaseBox title="Status Badges" className="mb-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900 rounded-md px-3 py-1 text-[12px] font-medium">
              <CheckCircle2 className="size-3 mr-1.5" />
              Success
            </Badge>
            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900 rounded-md px-3 py-1 text-[12px] font-medium">
              <AlertCircle className="size-3 mr-1.5" />
              Warning
            </Badge>
            <Badge className="bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 rounded-md px-3 py-1 text-[12px] font-medium">
              <X className="size-3 mr-1.5" />
              Error
            </Badge>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900 rounded-md px-3 py-1 text-[12px] font-medium">
              <Info className="size-3 mr-1.5" />
              Info
            </Badge>
          </div>
        </div>
      </ShowcaseBox>

      {/* Product Condition */}
      <ShowcaseBox title="Product Condition" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-blue-600 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">NEW</Badge>
          <Badge className="bg-sky-500 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">LIKE NEW</Badge>
          <Badge className="bg-teal-500 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">GOOD</Badge>
          <Badge className="bg-amber-500 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">FAIR</Badge>
          <Badge className="bg-zinc-500 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">USED</Badge>
          <Badge className="bg-violet-500 text-white border-transparent rounded-md px-3 py-1 text-[12px] font-semibold shadow-sm">REFURBISHED</Badge>
        </div>
      </ShowcaseBox>

      {/* E-commerce Badges */}
      <ShowcaseBox title="E-commerce Badges">
        <div className="space-y-4">
          <p className="text-[13px] text-muted-foreground mb-3">Solid Variants (High Emphasis)</p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="deal">
              <Flame className="size-3 mr-1.5" />
              Hot Deal
            </Badge>
            <Badge variant="shipping">
              <Truck className="size-3 mr-1.5" />
              Free Shipping
            </Badge>
            <Badge variant="verified">
              <BadgeCheck className="size-3 mr-1.5" />
              Verified
            </Badge>
            <Badge variant="sale">
              <Zap className="size-3 mr-1.5" />
              Flash Sale
            </Badge>
          </div>
          
          <Separator className="my-4" />

          <p className="text-[13px] text-muted-foreground mb-3">Subtle Variants (Low Emphasis)</p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="success-subtle">In Stock</Badge>
            <Badge variant="warning-subtle">Low Stock</Badge>
            <Badge variant="critical-subtle">Out of Stock</Badge>
            <Badge variant="info-subtle">Pre-order</Badge>
          </div>
        </div>
      </ShowcaseBox>
    </section>
  );
}

// ============================================
// SECTION: BUTTONS
// ============================================
function ButtonsSection() {
  return (
    <section id="buttons" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="03"
        title="Buttons"
        description="Interactive button components with multiple variants and sizes for different contexts."
      />

      {/* Standard Variants */}
      <ShowcaseBox title="Standard Variants" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </ShowcaseBox>

      {/* E-commerce Actions */}
      <ShowcaseBox title="E-commerce Actions" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <ShoppingCart className="size-4 mr-2" />
            Add to Cart
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm">
            Buy Now
          </Button>
          <Button variant="outline" className="border-border">
            <Heart className="size-4 mr-2" />
            Save
          </Button>
          <Button variant="destructive">
            <Flame className="size-4 mr-2" />
            Hot Deal
          </Button>
        </div>
      </ShowcaseBox>

      {/* Sizes */}
      <ShowcaseBox title="Button Sizes" className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline">
            <Heart className="size-4" />
          </Button>
        </div>
      </ShowcaseBox>

      {/* With Icons */}
      <ShowcaseBox title="With Icons">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">
            <Search className="size-4 mr-2" />
            Search
          </Button>
          <Button variant="secondary">
            <Truck className="size-4 mr-2" />
            Track Order
          </Button>
          <Button variant="ghost">
            <Bell className="size-4 mr-2" />
            Notifications
          </Button>
          <Button>
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </ShowcaseBox>
    </section>
  );
}

// ============================================
// SECTION: TYPOGRAPHY
// ============================================
function TypographySection() {
  return (
    <section id="typography" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="04"
        title="Typography"
        description="Type scale optimized for e-commerce readability and hierarchy."
      />

      <ShowcaseBox title="Type Scale">
        <div className="space-y-6">
          {[
            { name: "Display", class: "text-4xl md:text-5xl font-bold tracking-tight", sample: "Big Sale Event" },
            { name: "H1 / Page Title", class: "text-3xl font-bold tracking-tight", sample: "Design System" },
            { name: "H2 / Section", class: "text-2xl font-semibold tracking-tight", sample: "Latest Arrivals" },
            { name: "H3 / Card Title", class: "text-xl font-semibold", sample: "Sony PlayStation 5" },
            { name: "Body Large", class: "text-lg", sample: "Experience lightning-fast loading with an ultra-high speed SSD." },
            { name: "Body", class: "text-base", sample: "Free shipping on orders over $50. Easy returns within 30 days." },
            { name: "Body Small", class: "text-sm text-zinc-600 dark:text-zinc-400", sample: "Ships within 24 hours. Free returns." },
            { name: "Caption", class: "text-xs text-zinc-500 uppercase tracking-wider font-medium", sample: "Verified Seller • Member since 2019" },
          ].map((item) => (
            <div key={item.name} className="pb-6 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">{item.name}</span>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">{item.class.split(" ")[0]}</span>
              </div>
              <p className={cn(item.class, "text-zinc-900 dark:text-zinc-100")}>{item.sample}</p>
            </div>
          ))}
        </div>
      </ShowcaseBox>
    </section>
  );
}

// ============================================
// SECTION: FORMS
// ============================================
function FormsSection() {
  return (
    <section id="forms" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="05"
        title="Form Controls"
        description="Input components with accessible states and clear visual feedback."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ShowcaseBox title="Text Inputs">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px]">Email Address</Label>
              <Input placeholder="you@example.com" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px]">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <Input className="pl-10 h-10" placeholder="Search..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-red-600 dark:text-red-400">Error State</Label>
              <Input className="border-red-300 dark:border-red-900 focus-visible:ring-red-500 h-10" defaultValue="invalid@" />
              <p className="text-[12px] text-red-600 dark:text-red-400">Please enter a valid email address.</p>
            </div>
          </div>
        </ShowcaseBox>

        <ShowcaseBox title="Selection Controls">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Checkbox id="terms" className="size-4" />
              <Label htmlFor="terms" className="text-[13px] text-zinc-700 dark:text-zinc-300">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="newsletter" defaultChecked className="size-4" />
              <Label htmlFor="newsletter" className="text-[13px] text-zinc-700 dark:text-zinc-300">Subscribe to newsletter</Label>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label className="text-[13px] text-zinc-700 dark:text-zinc-300">Push Notifications</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[13px] text-zinc-700 dark:text-zinc-300">Dark Mode</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </ShowcaseBox>

        <ShowcaseBox title="Select Dropdown">
          <div className="space-y-2">
            <Label className="text-[13px]">Category</Label>
            <Select>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home &amp; Garden</SelectItem>
                <SelectItem value="sports">Sports &amp; Outdoors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ShowcaseBox>

        <ShowcaseBox title="Disabled State">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] text-zinc-400">Disabled Input</Label>
              <Input disabled placeholder="Cannot edit" className="h-10" />
            </div>
            <Button disabled className="w-full">Disabled Button</Button>
          </div>
        </ShowcaseBox>
      </div>
    </section>
  );
}

// ============================================
// SECTION: CARDS
// ============================================
function CardsSection() {
  return (
    <section id="cards" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="06"
        title="Cards"
        description="Container components for content and actions."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Card */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Card</CardTitle>
            <CardDescription className="text-[13px]">Simple content container</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Cards contain content and actions about a single subject.
            </p>
          </CardContent>
        </Card>

        {/* Product Card */}
        <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
          <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="size-16 text-zinc-300 dark:text-zinc-700" />
            </div>
            <div className="absolute left-3 top-3 flex gap-2">
              <Badge className="bg-blue-600 text-white border-transparent rounded-md px-2.5 py-0.5 text-[11px] font-semibold">NEW</Badge>
            </div>
            <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow-sm">
              <Heart className="size-4 text-zinc-500" />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-[15px] text-zinc-900 dark:text-zinc-100">Sony PlayStation 5</h3>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="size-3.5 text-zinc-300 dark:text-zinc-600" />
              <span className="text-[12px] text-zinc-500 ml-1">(1,234)</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">$449.99</span>
              <span className="text-sm text-zinc-400 line-through">$499.99</span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Save 10%</span>
            </div>
          </CardContent>
          <div className="px-4 pb-4 flex gap-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-[13px]">Add to Cart</Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-zinc-300 dark:border-zinc-700">
              <Heart className="size-4" />
            </Button>
          </div>
        </Card>

        {/* Seller Card */}
        <Card className="border-border">
          <CardContent className="pt-5">
            <div className="flex gap-4">
              <VerifiedAvatar
                name="TechStore Pro"
                avatarUrl={null}
                size="lg"
                isVerifiedBusiness={true}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-foreground truncate">TechStore Pro</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-medium text-foreground">4.9</span>
                  <span className="text-[12px] text-muted-foreground">(2,341)</span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-2">
                  Member since 2019 • 10K+ items sold
                </p>
              </div>
            </div>
          </CardContent>
          <div className="px-5 pb-5 flex gap-2">
            <Button variant="outline" className="flex-1 h-9 text-[13px]">
              <Store className="size-4 mr-2" />
              Visit Store
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="size-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ============================================
// SECTION: MARKETPLACE
// ============================================
function MarketplaceSection() {
  return (
    <section id="marketplace" className="mt-24 scroll-mt-8">
      <SectionHeader 
        number="07"
        title="E-Commerce Patterns"
        description="Marketplace-specific components and patterns for pricing, orders, and promotions."
      />

      {/* Pricing */}
      <ShowcaseBox title="Pricing Display" className="mb-6">
        <div className="space-y-6">
          <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">$79.99</span>
              <span className="text-xl text-zinc-400 line-through">$129.99</span>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900 rounded-md px-2 py-0.5 text-[12px] font-semibold">
                Save $50
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-emerald-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-blue-500" />
                <span>Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>
      </ShowcaseBox>

      {/* Order Status */}
      <ShowcaseBox title="Order Status" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900 rounded-md px-3 py-1 text-[12px] font-medium">
            <Clock className="size-3 mr-1.5" />
            Pending
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900 rounded-md px-3 py-1 text-[12px] font-medium">
            <Package className="size-3 mr-1.5" />
            Processing
          </Badge>
          <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900 rounded-md px-3 py-1 text-[12px] font-medium">
            <Truck className="size-3 mr-1.5" />
            Shipped
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900 rounded-md px-3 py-1 text-[12px] font-medium">
            <CheckCircle2 className="size-3 mr-1.5" />
            Delivered
          </Badge>
          <Badge className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 rounded-md px-3 py-1 text-[12px] font-medium">
            <X className="size-3 mr-1.5" />
            Cancelled
          </Badge>
        </div>
      </ShowcaseBox>

      {/* Ratings */}
      <ShowcaseBox title="Ratings" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn(
                  "size-5",
                  i <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                )} />
              ))}
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">4.0</span>
            <span className="text-sm text-zinc-500">(1,234 reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">5.0</span>
            <span className="text-sm text-zinc-500">Perfect!</span>
          </div>
        </div>
      </ShowcaseBox>

      {/* Urgency Banners */}
      <ShowcaseBox title="Urgency Banners">
        <div className="space-y-3">
          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 flex items-center gap-3">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-1.5">
              <Clock className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[13px] font-medium text-amber-800 dark:text-amber-300">Only 3 left in stock — order soon!</span>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 flex items-center gap-3">
            <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-1.5">
              <Flame className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-[13px] font-medium text-red-800 dark:text-red-300">Sale ends in 2 hours!</span>
          </div>
          <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-1.5">
              <Eye className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[13px] font-medium text-blue-800 dark:text-blue-300">12 people are viewing this item</span>
          </div>
        </div>
      </ShowcaseBox>
    </section>
  );
}
