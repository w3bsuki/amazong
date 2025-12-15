"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Check, Eye, EyeOff } from "lucide-react"

// ============================================
// UNUSED UI COMPONENTS - Testing which work
// ============================================
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Calendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Spinner } from "@/components/ui/spinner"

// ============================================
// UNUSED CUSTOM COMPONENTS - Testing which work
// ============================================
import { ImageUpload } from "@/components/image-upload"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProductPrice, InlinePrice } from "@/components/product-price"
import { PromoBannerStrip } from "@/components/promo-banner-strip"
import { RatingScrollLink } from "@/components/rating-scroll-link"
import { SectionCards } from "@/components/section-cards"
import { SignOutButton } from "@/components/sign-out-button"
import { StickyCheckoutButton } from "@/components/sticky-checkout-button"
import { UpgradeBanner } from "@/components/upgrade-banner"

// ============================================
// DEMO PAGE - Component Gallery
// ============================================

interface ComponentDemo {
  name: string
  file: string
  category: "ui" | "custom" | "form" | "layout"
  status: "works" | "needs-props" | "error" | "not-tested"
  description: string
  verdict: "keep" | "delete" | "review"
  reason: string
  render: () => React.ReactNode
}

export default function ComponentAuditPage() {
  const [hiddenComponents, setHiddenComponents] = useState<Set<string>>(new Set())
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set())

  const toggleHidden = (name: string) => {
    setHiddenComponents(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleDelete = (name: string) => {
    setMarkedForDeletion(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const components: ComponentDemo[] = [
    // ============================================
    // UI COMPONENTS (from shadcn)
    // ============================================
    {
      name: "Breadcrumb (UI)",
      file: "components/ui/breadcrumb.tsx",
      category: "ui",
      status: "works",
      verdict: "keep",
      reason: "Standard shadcn component - may be used indirectly",
      description: "Navigation breadcrumbs - standard UI component",
      render: () => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Electronics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    },
    {
      name: "Calendar",
      file: "components/ui/calendar.tsx",
      category: "ui",
      status: "works",
      verdict: "review",
      reason: "Used by react-day-picker - needed if we have date pickers",
      description: "Date picker calendar - react-day-picker",
      render: () => <Calendar mode="single" className="rounded-md border" />
    },
    {
      name: "Carousel",
      file: "components/ui/carousel.tsx",
      category: "ui",
      status: "works",
      verdict: "keep",
      reason: "Embla carousel - used for product sliders on homepage",
      description: "Embla carousel - for product sliders",
      render: () => (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {[1, 2, 3].map((i) => (
              <CarouselItem key={i}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{i}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
    },
    {
      name: "Collapsible",
      file: "components/ui/collapsible.tsx",
      category: "ui",
      status: "works",
      verdict: "review",
      reason: "Used in FAQ or expandable sections?",
      description: "Expandable sections",
      render: () => (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline">Click to expand</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 p-4 border rounded">
            Hidden content revealed!
          </CollapsibleContent>
        </Collapsible>
      )
    },
    {
      name: "Context Menu",
      file: "components/ui/context-menu.tsx",
      category: "ui",
      status: "works",
      verdict: "delete",
      reason: "Right-click menus not used anywhere in e-commerce",
      description: "Right-click menu",
      render: () => (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    },
    {
      name: "Input OTP",
      file: "components/ui/input-otp.tsx",
      category: "ui",
      status: "works",
      verdict: "review",
      reason: "For 2FA/verification - might need for auth flows",
      description: "One-time password input",
      render: () => (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )
    },
    {
      name: "Menubar",
      file: "components/ui/menubar.tsx",
      category: "ui",
      status: "works",
      verdict: "delete",
      reason: "Desktop app style menu - not used in web e-commerce",
      description: "Horizontal menu bar",
      render: () => (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
    },
    {
      name: "Resizable Panels",
      file: "components/ui/resizable.tsx",
      category: "ui",
      status: "works",
      verdict: "delete",
      reason: "Not used in any layouts - admin/IDE feature",
      description: "Draggable resizable panels",
      render: () => (
        <ResizablePanelGroup direction="horizontal" className="min-h-[100px] rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Panel One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Panel Two</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    },
    {
      name: "Spinner",
      file: "components/ui/spinner.tsx",
      category: "ui",
      status: "works",
      verdict: "keep",
      reason: "Loading indicator - useful utility",
      description: "Loading spinner animation",
      render: () => (
        <div className="flex gap-4 items-center">
          <Spinner className="size-3" />
          <Spinner className="size-4" />
          <Spinner className="size-6" />
        </div>
      )
    },

    // ============================================
    // CUSTOM COMPONENTS
    // ============================================
    {
      name: "ImageUpload",
      file: "components/image-upload.tsx",
      category: "form",
      status: "works",
      verdict: "review",
      reason: "Useful but check if product forms use inline version instead",
      description: "Drag & drop image uploader",
      render: () => (
        <ImageUpload
          onChange={(images) => console.log("Uploaded:", images)}
          maxImages={3}
        />
      )
    },
    {
      name: "LanguageSwitcher",
      file: "components/language-switcher.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "EN/BG toggle - should be used in header!",
      description: "EN/BG language toggle",
      render: () => <LanguageSwitcher />
    },
    {
      name: "ProductPrice",
      file: "components/product-price.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Price formatting - should be used on product cards",
      description: "Price display with currency formatting",
      render: () => (
        <div className="space-y-4">
          <ProductPrice price={99.99} originalPrice={149.99} locale="en" size="lg" />
          <ProductPrice price={49.99} locale="bg" size="md" />
          <InlinePrice price={29.99} locale="en" />
        </div>
      )
    },
    {
      name: "PromoBannerStrip",
      file: "components/promo-banner-strip.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Top promotional banner - Amazon-style promo strip",
      description: "Top promotional banner",
      render: () => <PromoBannerStrip locale="en" />
    },
    {
      name: "RatingScrollLink",
      file: "components/rating-scroll-link.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Clickable star rating - should be on product pages",
      description: "Clickable rating that scrolls to reviews",
      render: () => (
        <RatingScrollLink 
          rating={4.5} 
          ratingLabel="4.5 out of 5" 
          ratingsText="(128 reviews)" 
        />
      )
    },
    {
      name: "SectionCards",
      file: "components/section-cards.tsx",
      category: "custom",
      status: "works",
      verdict: "review",
      reason: "Dashboard stats cards - check if used in admin",
      description: "Dashboard section cards",
      render: () => <SectionCards />
    },
    {
      name: "SignOutButton",
      file: "components/sign-out-button.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Logout button - definitely needed in header/account menu",
      description: "Sign out / logout button",
      render: () => (
        <div className="flex gap-2">
          <SignOutButton variant="default" />
          <SignOutButton variant="ghost" />
          <SignOutButton variant="outline" showLabel />
        </div>
      )
    },
    {
      name: "StickyCheckoutButton",
      file: "components/sticky-checkout-button.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Mobile checkout UX - important for conversion",
      description: "Fixed checkout button for mobile",
      render: () => (
        <div className="relative h-24 border rounded overflow-hidden">
          <StickyCheckoutButton 
            total={199.99} 
            totalItems={3}
            isProcessing={false}
            locale="en"
            onCheckout={() => alert("Checkout!")} 
          />
        </div>
      )
    },
    {
      name: "UpgradeBanner",
      file: "components/upgrade-banner.tsx",
      category: "custom",
      status: "works",
      verdict: "keep",
      reason: "Plan upgrade CTA - needed for monetization",
      description: "Plan upgrade promotional banner",
      render: () => (
        <UpgradeBanner 
          currentTier="free"
          variant="default"
        />
      )
    },
  ]

  const categories = {
    ui: components.filter(c => c.category === "ui"),
    custom: components.filter(c => c.category === "custom"),
    form: components.filter(c => c.category === "form"),
  }

  const verdictCounts = {
    keep: components.filter(c => c.verdict === "keep").length,
    delete: components.filter(c => c.verdict === "delete").length,
    review: components.filter(c => c.verdict === "review").length,
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔬 Component Audit - Visual Review</h1>
        <p className="text-muted-foreground mb-4">
          These components were flagged as &quot;unused&quot; by Knip. Review them visually and decide what to do.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" className="gap-1 bg-green-600">
            <Check className="h-3 w-3" />
            Keep: {verdictCounts.keep}
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <Trash2 className="h-3 w-3" />
            Delete: {verdictCounts.delete}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Review: {verdictCounts.review}
          </Badge>
        </div>

        {markedForDeletion.size > 0 && (
          <Card className="bg-destructive/10 border-destructive/20 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Your selections for deletion:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                {Array.from(markedForDeletion).map(name => {
                  const comp = components.find(c => c.name === name)
                  return <li key={name} className="text-muted-foreground font-mono">• {comp?.file}</li>
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({components.length})</TabsTrigger>
          <TabsTrigger value="ui">UI ({categories.ui.length})</TabsTrigger>
          <TabsTrigger value="custom">Custom ({categories.custom.length})</TabsTrigger>
          <TabsTrigger value="form">Form ({categories.form.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {components.map((comp) => (
            <ComponentCard
              key={comp.name}
              component={comp}
              isHidden={hiddenComponents.has(comp.name)}
              isMarkedForDeletion={markedForDeletion.has(comp.name)}
              onToggleHidden={() => toggleHidden(comp.name)}
              onToggleDelete={() => toggleDelete(comp.name)}
            />
          ))}
        </TabsContent>

        {Object.entries(categories).map(([key, comps]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {comps.map((comp) => (
              <ComponentCard
                key={comp.name}
                component={comp}
                isHidden={hiddenComponents.has(comp.name)}
                isMarkedForDeletion={markedForDeletion.has(comp.name)}
                onToggleHidden={() => toggleHidden(comp.name)}
                onToggleDelete={() => toggleDelete(comp.name)}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">⚠️ Components NOT shown here (need complex setup):</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-muted-foreground mb-1">Likely DELETE:</h4>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• <code>breadcrumb.tsx</code> - Duplicate of product-breadcrumb</li>
              <li>• <code>product-form.tsx</code> - Old version, has enhanced</li>
              <li>• <code>sell-form-schema-v3.ts</code> - Old, v4 exists</li>
              <li>• <code>category-subheader.tsx</code> - navigation/ version used</li>
              <li>• <code>mega-menu.tsx</code> - navigation/ version used</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground mb-1">Likely KEEP:</h4>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• <code>theme-provider.tsx</code> - For dark mode (not wired up)</li>
              <li>• <code>error-boundary.tsx</code> - Error handling wrapper</li>
              <li>• <code>analytics.tsx</code> - Vercel analytics</li>
              <li>• <code>data-table.tsx</code> - TanStack for admin tables</li>
              <li>• <code>product-variant-selector.tsx</code> - Size/color picker</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentCard({
  component,
  isHidden,
  isMarkedForDeletion,
  onToggleHidden,
  onToggleDelete,
}: {
  component: ComponentDemo
  isHidden: boolean
  isMarkedForDeletion: boolean
  onToggleHidden: () => void
  onToggleDelete: () => void
}) {
  const verdictColors = {
    keep: "bg-green-500/10 text-green-700 border-green-500/20",
    delete: "bg-red-500/10 text-red-700 border-red-500/20",
    review: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  }

  return (
    <Card className={isMarkedForDeletion ? "border-destructive bg-destructive/5" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg flex flex-wrap items-center gap-2">
              {component.name}
              <Badge variant={component.status === "works" ? "default" : "secondary"} className="text-xs">
                {component.status}
              </Badge>
              <Badge className={`text-xs ${verdictColors[component.verdict]}`}>
                {component.verdict.toUpperCase()}
              </Badge>
              {isMarkedForDeletion && <Badge variant="destructive">MARKED</Badge>}
            </CardTitle>
            <CardDescription className="font-mono text-xs mt-1">{component.file}</CardDescription>
            <p className="text-sm text-muted-foreground mt-1">{component.reason}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleHidden}
              title={isHidden ? "Show preview" : "Hide preview"}
            >
              {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant={isMarkedForDeletion ? "default" : "destructive"}
              onClick={onToggleDelete}
              title={isMarkedForDeletion ? "Unmark" : "Mark for deletion"}
            >
              {isMarkedForDeletion ? <Check className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isHidden && (
        <CardContent className="pt-4 border-t">
          <div className="p-4 bg-muted/50 rounded-lg overflow-auto">
            {component.render()}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
