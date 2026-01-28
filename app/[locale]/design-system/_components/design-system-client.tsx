"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
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
  X,
  Flame,
  Zap,
  Home,
  Palette,
  MousePointer,
  LayoutGrid,
  Box,
  Menu,
  Tag,
  BadgeCheck,
  ArrowRight,
  RefreshCw,
  Loader2,
  Info,
  Mail,
  Search,
  Eye,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ============================================
// NAVIGATION CONFIG
// ============================================
const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "colors", label: "Color System", icon: Palette },
  { id: "typography", label: "Typography", icon: Box },
  { id: "buttons", label: "Buttons", icon: MousePointer },
  { id: "badges", label: "Badges", icon: Tag },
  { id: "forms", label: "Form Controls", icon: LayoutGrid },
  { id: "cards", label: "Cards", icon: Box },
  { id: "feedback", label: "Feedback", icon: RefreshCw },
] as const;

// ============================================
// SECTION WRAPPER - Consistent spacing
// ============================================
function Section({ 
  id, 
  title, 
  description,
  children 
}: { 
  id: string;
  title: string; 
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-12 first:pt-0">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-2 text-reading leading-relaxed max-w-2xl">{description}</p>
      </div>
      <div className="space-y-8">
        {children}
      </div>
    </section>
  );
}

// ============================================
// SHOWCASE GRID - For component demos
// ============================================
function ShowcaseGrid({ 
  title, 
  children, 
  className,
  cols = 1,
}: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}) {
  const gridCols = {
    1: "",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
      )}
      <div className={cn("grid gap-4", gridCols[cols])}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// DEMO BOX - Individual component showcase
// ============================================
function DemoBox({ 
  label, 
  children, 
  className,
  dark = false,
}: { 
  label?: string; 
  children: React.ReactNode; 
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border p-6 flex flex-col",
      dark ? "bg-foreground border-foreground" : "bg-card border-border",
      className
    )}>
      {children}
      {label && (
        <span className={cn(
          "text-xs mt-4 pt-4 border-t",
          dark ? "text-background/60 border-background/20" : "text-muted-foreground border-border"
        )}>{label}</span>
      )}
    </div>
  );
}

// ============================================
// COLOR SWATCH
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
    <div className="flex items-center gap-3">
      <div 
        className={cn("w-12 h-12 rounded-lg border border-border shadow-sm", className)}
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <code className="text-xs text-muted-foreground">{variable}</code>
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-5" />
              </div>
              <div>
                <h1 className="font-semibold text-sidebar-foreground">Treido</h1>
                <p className="text-xs text-sidebar-foreground/60">Design System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    activeSection === id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              ))}
            </nav>

            <div className="px-3 my-4">
              <Separator className="bg-sidebar-border" />
            </div>

            <div className="px-3">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
              >
                <ArrowRight className="size-4 rotate-180" />
                Back to Site
              </Link>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/60 px-3 py-2.5 text-center">
              <p className="text-xs text-sidebar-foreground/70">
                Tailwind v4 + shadcn/ui
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg border border-border bg-background shadow-sm lg:hidden"
      >
        {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
          <OverviewSection />
          <Separator className="my-2" />
          <ColorsSection />
          <Separator className="my-2" />
          <TypographySection />
          <Separator className="my-2" />
          <ButtonsSection />
          <Separator className="my-2" />
          <BadgesSection />
          <Separator className="my-2" />
          <FormsSection />
          <Separator className="my-2" />
          <CardsSection />
          <Separator className="my-2" />
          <FeedbackSection />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Built with shadcn/ui, Tailwind CSS v4, and oklch colors
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
    <Section 
      id="overview" 
      title="Treido Design System" 
      description="A professional component library built with shadcn/ui, Tailwind CSS v4, and oklch colors. Twitter-inspired theming with full dark mode support."
    >
      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "24", label: "Components", icon: Box },
          { value: "8", label: "Button Variants", icon: MousePointer },
          { value: "20+", label: "Badge Types", icon: Tag },
          { value: "100%", label: "Accessible", icon: CheckCircle2 },
        ].map((stat) => (
          <div 
            key={stat.label} 
            className="rounded-xl border border-border bg-card p-5 text-center"
          >
            <stat.icon className="size-5 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Theme Preview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-primary p-6 text-center">
          <div className="text-primary-foreground font-semibold">Primary</div>
          <div className="text-primary-foreground/70 text-sm mt-1">Twitter Blue</div>
        </div>
        <div className="rounded-xl bg-secondary p-6 text-center">
          <div className="text-secondary-foreground font-semibold">Secondary</div>
          <div className="text-secondary-foreground/70 text-sm mt-1">Dark Neutral</div>
        </div>
        <div className="rounded-xl bg-muted p-6 text-center border border-border">
          <div className="text-foreground font-semibold">Muted</div>
          <div className="text-muted-foreground text-sm mt-1">Subtle Background</div>
        </div>
        <div className="rounded-xl bg-destructive p-6 text-center">
          <div className="text-destructive-foreground font-semibold">Destructive</div>
          <div className="text-destructive-foreground/70 text-sm mt-1">Error States</div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-border bg-accent/30 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="size-10 rounded-lg bg-selected flex items-center justify-center">
              <Info className="size-5 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Built for Marketplace</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Every component is optimized for e-commerce: condition badges, shipping indicators, 
              price displays, and seller trust badges all follow professional marketplace patterns.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ============================================
// SECTION: COLORS
// ============================================
function ColorsSection() {
  return (
    <Section 
      id="colors" 
      title="Color System" 
      description="Semantic color tokens using oklch for perceptual uniformity. All colors automatically adapt to dark mode."
    >
      {/* Core Semantic Colors */}
      <ShowcaseGrid title="Core Palette">
        <div className="rounded-xl border border-border p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: "Background", var: "--background", class: "bg-background border border-border" },
              { name: "Foreground", var: "--foreground", class: "bg-foreground" },
              { name: "Card", var: "--card", class: "bg-card border border-border" },
              { name: "Muted", var: "--muted", class: "bg-muted" },
              { name: "Accent", var: "--accent", class: "bg-accent" },
              { name: "Border", var: "--border", class: "bg-border" },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={cn("h-16 rounded-lg shadow-sm", color.class)} />
                <div>
                  <p className="text-sm font-medium">{color.name}</p>
                  <code className="text-xs text-muted-foreground">{color.var}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseGrid>
      
      {/* Semantic Status Colors */}
      <ShowcaseGrid title="Semantic Status">
        <div className="rounded-xl border border-border p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Success", class: "bg-success" },
              { name: "Warning", class: "bg-warning" },
              { name: "Error", class: "bg-error" },
              { name: "Info", class: "bg-info" },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={cn("h-14 rounded-lg", color.class)} />
                <p className="text-sm font-medium text-center">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseGrid>

      {/* Interactive States */}
      <ShowcaseGrid title="Interactive States">
        <div className="rounded-xl border border-border p-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { name: "Primary", class: "bg-primary" },
              { name: "Interactive Hover", class: "bg-interactive-hover" },
              { name: "Hover", class: "bg-hover" },
              { name: "Active", class: "bg-active" },
              { name: "Selected", class: "bg-selected" },
              { name: "Checked", class: "bg-checked" },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={cn("h-10 rounded-md border border-border", color.class)} />
                <p className="text-xs text-center text-muted-foreground">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseGrid>
    </Section>
  );
}

// ============================================
// SECTION: TYPOGRAPHY
// ============================================
function TypographySection() {
  return (
    <Section 
      id="typography" 
      title="Typography" 
      description="Type scale optimized for marketplace interfaces with excellent readability."
    >
      <div className="rounded-xl border border-border p-6 space-y-6">
        {/* Headings */}
        <div className="space-y-4">
          <p className="text-4xl font-bold tracking-tight">Display — 36px Bold</p>
          <p className="text-3xl font-semibold tracking-tight">Heading 1 — 30px Semibold</p>
          <p className="text-2xl font-semibold">Heading 2 — 24px Semibold</p>
          <p className="text-xl font-medium">Heading 3 — 20px Medium</p>
          <p className="text-lg font-medium">Heading 4 — 18px Medium</p>
        </div>
        
        <Separator />
        
        {/* Body Text */}
        <div className="space-y-3">
          <p className="text-base">Body Default — 16px Regular</p>
          <p className="text-sm">Body Small — 14px Regular</p>
          <p className="text-xs">Caption — 12px Regular</p>
          <p className="text-tiny">Micro — 11px Regular</p>
        </div>

        <Separator />
        
        {/* Special Styles */}
        <div className="space-y-3">
          <p className="text-lg font-bold tabular-nums">€1,299.99 — Price Large</p>
          <p className="text-base font-semibold tabular-nums text-price-sale">€899.00 — Sale Price</p>
          <p className="text-sm line-through text-muted-foreground tabular-nums">€1,199.00 — Strikethrough</p>
        </div>
      </div>
    </Section>
  );
}

// ============================================
// SECTION: BUTTONS
// ============================================
function ButtonsSection() {
  const [loading, setLoading] = useState(false);
  
  return (
    <Section 
      id="buttons" 
      title="Buttons" 
      description="Action components with consistent sizing, proper focus states, and accessible hover effects."
    >
      {/* Variants */}
      <ShowcaseGrid title="Variants">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Marketplace CTAs */}
      <ShowcaseGrid title="Marketplace CTAs">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="black"><ShoppingCart className="size-4" />Add to Cart</Button>
            <Button variant="cta"><Zap className="size-4" />Buy Now</Button>
            <Button variant="deal"><Flame className="size-4" />Hot Deal</Button>
            <Button variant="brand">Follow</Button>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Sizes */}
      <ShowcaseGrid title="Sizes">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">XS 32px</Button>
            <Button size="sm">SM 36px</Button>
            <Button size="default">Default 44px</Button>
            <Button size="lg">LG 48px</Button>
            <Button size="xl">XL 56px</Button>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Icon Buttons */}
      <ShowcaseGrid title="Icon Buttons">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-sm" variant="outline"><Heart className="size-4" /></Button>
            <Button size="icon" variant="outline"><ShoppingCart className="size-4" /></Button>
            <Button size="icon-lg" variant="outline"><Search className="size-5" /></Button>
            <Button size="icon" variant="ghost"><Star className="size-4" /></Button>
            <Button size="icon"><ArrowRight className="size-4" /></Button>
          </div>
        </div>
      </ShowcaseGrid>

      {/* States */}
      <ShowcaseGrid title="States">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button disabled variant="outline">Disabled Outline</Button>
            <Button onClick={() => setLoading(!loading)}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Loading..." : "Click to Load"}
            </Button>
          </div>
        </div>
      </ShowcaseGrid>
    </Section>
  );
}

// ============================================
// SECTION: BADGES
// ============================================
function BadgesSection() {
  return (
    <Section 
      id="badges" 
      title="Badges" 
      description="Two-tier badge system with solid (high emphasis) and subtle (low emphasis) variants for WCAG AA compliance."
    >
      {/* Core Variants */}
      <ShowcaseGrid title="Core Variants">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Status Badges - Solid */}
      <ShowcaseGrid title="Status — Solid (High Emphasis)">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success"><CheckCircle2 className="size-3" />Success</Badge>
            <Badge variant="warning"><AlertCircle className="size-3" />Warning</Badge>
            <Badge variant="critical"><X className="size-3" />Critical</Badge>
            <Badge variant="info"><Info className="size-3" />Info</Badge>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Status Badges - Subtle */}
      <ShowcaseGrid title="Status — Subtle (Low Emphasis)">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success-subtle">In Stock</Badge>
            <Badge variant="warning-subtle">Low Stock</Badge>
            <Badge variant="critical-subtle">Out of Stock</Badge>
            <Badge variant="info-subtle">Pre-order</Badge>
            <Badge variant="neutral-subtle">Draft</Badge>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Condition Badges */}
      <ShowcaseGrid title="Product Condition (C2C)">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="condition-new"><Tag className="size-3" />New</Badge>
            <Badge variant="condition-likenew"><Heart className="size-3" />Like New</Badge>
            <Badge variant="condition-good"><CheckCircle2 className="size-3" />Good</Badge>
            <Badge variant="condition-fair"><AlertCircle className="size-3" />Fair</Badge>
            <Badge variant="condition-used"><Package className="size-3" />Used</Badge>
            <Badge variant="condition-refurb"><RefreshCw className="size-3" />Refurb</Badge>
          </div>
        </div>
      </ShowcaseGrid>

      {/* E-commerce Badges */}
      <ShowcaseGrid title="E-commerce">
        <div className="rounded-xl border border-border p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Shipping & Trust</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="shipping"><Truck className="size-3" />Free Shipping</Badge>
              <Badge variant="shipping-express"><Zap className="size-3" />Express</Badge>
              <Badge variant="verified"><BadgeCheck className="size-3" />Verified</Badge>
              <Badge variant="top-rated"><Star className="size-3" />Top Rated</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Deals & Promotions</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="deal"><Flame className="size-3" />Hot Deal</Badge>
              <Badge variant="sale"><Zap className="size-3" />Flash Sale</Badge>
              <Badge variant="promoted"><Info className="size-3" />Ad</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Stock Status</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="stock-available"><CheckCircle2 className="size-3" />In Stock</Badge>
              <Badge variant="stock-low"><Clock className="size-3" />Only 3 left</Badge>
              <Badge variant="stock-out"><X className="size-3" />Sold Out</Badge>
            </div>
          </div>
        </div>
      </ShowcaseGrid>
    </Section>
  );
}

// ============================================
// SECTION: FORMS
// ============================================
function FormsSection() {
  return (
    <Section 
      id="forms" 
      title="Form Controls" 
      description="Input components with proper focus states, error handling, and accessibility."
    >
      <ShowcaseGrid cols={2}>
        {/* Text Inputs */}
        <div className="rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-sm font-medium">Text Inputs</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="search" className="pl-9" placeholder="Search products..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="error" className="text-destructive">With Error</Label>
              <Input 
                id="error" 
                className="border-destructive focus-visible:ring-destructive" 
                defaultValue="invalid@" 
              />
              <p className="text-xs text-destructive">Please enter a valid email address.</p>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-sm font-medium">Selection Controls</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="newsletter" defaultChecked />
              <Label htmlFor="newsletter" className="font-normal">Subscribe to newsletter</Label>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="font-normal">Push Notifications</Label>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkmode" className="font-normal">Dark Mode</Label>
              <Switch id="darkmode" defaultChecked />
            </div>
          </div>
        </div>
      </ShowcaseGrid>

      {/* Disabled States */}
      <ShowcaseGrid title="Disabled States">
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input disabled placeholder="Disabled input" className="max-w-xs" />
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </div>
      </ShowcaseGrid>
    </Section>
  );
}

// ============================================
// SECTION: CARDS
// ============================================
function CardsSection() {
  return (
    <Section 
      id="cards" 
      title="Cards" 
      description="Container components for grouping related content with consistent styling."
    >
      <ShowcaseGrid cols={2}>
        {/* Basic Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cards use flat styling with subtle borders. No heavy shadows for a clean, modern look.
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>

        {/* Seller Card */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-start">
              <Avatar className="size-12">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=TS" />
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">TechStore Pro</p>
                  <Badge variant="verified"><BadgeCheck className="size-3" /></Badge>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="size-3.5 fill-warning text-warning" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(2,341 reviews)</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">Visit Store</Button>
          </CardFooter>
        </Card>
      </ShowcaseGrid>

      {/* Product Cards Preview */}
      <ShowcaseGrid title="Product Card Preview" cols={4}>
        {[
          { title: "Sony PS5", price: 449.99, original: 499.99, condition: "new", stock: true },
          { title: "iPhone 14 Pro", price: 899.00, original: null, condition: "like_new", stock: true },
          { title: "MacBook Air M2", price: 1199.00, original: 1299.00, condition: "good", stock: false },
          { title: "Nintendo Switch", price: 299.99, original: null, condition: "used", stock: true },
        ].map((product, i) => (
          <div key={i} className="group rounded-xl border border-border overflow-hidden bg-card">
            {/* Image Area */}
            <div className="relative aspect-square bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="size-12 text-muted-foreground/30" />
              </div>
              <Badge 
                variant={
                  product.condition === "new" ? "condition-new" : 
                  product.condition === "like_new" ? "condition-likenew" :
                  product.condition === "good" ? "condition-good" : "condition-used"
                }
                className="absolute top-2 left-2"
              >
                {product.condition === "new" ? "NEW" : 
                 product.condition === "like_new" ? "LIKE NEW" :
                 product.condition === "good" ? "GOOD" : "USED"}
              </Badge>
              <button className="absolute top-2 right-2 size-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                <Heart className="size-4 text-muted-foreground" />
              </button>
            </div>
            {/* Content */}
            <div className="p-3">
              <p className="font-medium text-sm line-clamp-2">{product.title}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={cn(
                  "font-bold tabular-nums",
                  product.original ? "text-price-sale" : ""
                )}>€{product.price.toFixed(2)}</span>
                {product.original && (
                  <span className="text-xs text-muted-foreground line-through">€{product.original.toFixed(2)}</span>
                )}
              </div>
              {product.stock && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Truck className="size-3" />
                  <span>Free shipping</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </ShowcaseGrid>
    </Section>
  );
}

// ============================================
// SECTION: FEEDBACK (Loading, Progress, Skeleton)
// ============================================
function FeedbackSection() {
  return (
    <Section 
      id="feedback" 
      title="Feedback & Loading" 
      description="Visual indicators for async operations, progress states, and content loading."
    >
      {/* Progress Bars */}
      <ShowcaseGrid title="Progress Bars">
        <div className="rounded-xl border border-border p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Default</span>
              <span className="text-muted-foreground">25%</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Half Progress</span>
              <span className="text-muted-foreground">50%</span>
            </div>
            <Progress value={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Almost Done</span>
              <span className="text-muted-foreground">75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete</span>
              <span className="text-muted-foreground">100%</span>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </ShowcaseGrid>

      {/* Skeletons */}
      <ShowcaseGrid title="Skeleton Loaders" cols={2}>
        {/* Text Skeleton */}
        <div className="rounded-xl border border-border p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* User Row Skeleton */}
        <div className="rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </ShowcaseGrid>

      {/* Product Card Skeletons */}
      <ShowcaseGrid title="Product Card Skeleton" cols={4}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="size-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </ShowcaseGrid>
    </Section>
  );
}
