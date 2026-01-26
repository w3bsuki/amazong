"use client"

import * as React from "react"
import { Heart, LinkSimple, MapPin, ShoppingCart, Star, Tag, Truck, ArrowSquareOut, X } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function QuickViewDemo() {
  return (
    <div className="min-h-screen bg-surface-page p-8">
      <div className="mx-auto max-w-5xl space-y-12">
        
        <header>
          <h1 className="text-2xl font-bold">Quick View Modal — Before/After</h1>
          <p className="text-muted-foreground">The actual problem and the fix</p>
        </header>

        {/* THE PROBLEM */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-destructive">❌ Current (Ugly)</h2>
          
          <div className="rounded-xl border-2 border-destructive/20 bg-card overflow-hidden">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              {/* Image */}
              <div className="aspect-square bg-muted flex items-center justify-center text-6xl md:border-r">
                🐱
              </div>
              
              {/* Content - CURRENT UGLY VERSION */}
              <div className="flex flex-col">
                <div className="p-4 space-y-4 flex-1">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-price-sale">67,00 €</span>
                    <span className="text-sm text-price-original line-through">93,80 €</span>
                    <span className="text-sm font-medium text-price-savings">Спести 29%</span>
                  </div>
                  
                  <h2 className="text-lg font-semibold">Айсифон 17</h2>
                  
                  {/* Actions - TOP */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      Виж пълната страница
                      <ArrowSquareOut size={16} />
                    </Button>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon-sm"><LinkSimple size={18} /></Button>
                      <Button variant="ghost" size="icon-sm"><Heart size={18} /></Button>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star size={16} weight="fill" className="fill-rating text-rating" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-sm text-muted-foreground">(1,234 отзива)</span>
                  </div>
                  
                  {/* Condition Badge - CURRENT: dark/neutral */}
                  <div>
                    <Badge variant="condition">
                      <Tag size={12} />
                      USED-EXCELLENT
                    </Badge>
                  </div>
                </div>
                
                {/* CTA - THE UGLY PART */}
                <div className="border-t p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* THIS IS THE PROBLEM */}
                    <Button variant="outline" size="lg" className="gap-2">
                      <ShoppingCart size={18} weight="bold" />
                      Добави в кошницата
                    </Button>
                    <Button variant="cta" size="lg">
                      Купи сега
                    </Button>
                  </div>
                  <p className="mt-3 text-center text-xs text-destructive">
                    ↑ "Add to cart" looks like a cancel button, not a purchase action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE FIX */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-success">✓ Fixed (Twitter Theme)</h2>
          
          <div className="rounded-xl border-2 border-success/20 bg-card overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              {/* Image */}
              <div className="relative aspect-square bg-neutral-100 flex items-center justify-center md:border-r overflow-hidden">
                <span className="text-8xl">🐱</span>
                {/* Discount badge - properly styled */}
                <div className="absolute left-3 top-3">
                  <span className="rounded bg-deal px-2 py-1 text-xs font-bold text-deal-foreground">
                    -29%
                  </span>
                </div>
              </div>
              
              {/* Content - FIXED VERSION */}
              <div className="flex flex-col">
                <div className="p-5 space-y-4 flex-1">
                  {/* Price - cleaner layout */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-price-sale tabular-nums">67,00 €</span>
                    <span className="text-base text-muted-foreground line-through tabular-nums">93,80 €</span>
                    <span className="text-sm font-semibold text-price-savings">Спести 29%</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-foreground">Айсифон 17</h2>
                  
                  {/* Actions - cleaner */}
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                      Виж пълната страница
                      <ArrowSquareOut size={16} weight="bold" />
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                        <LinkSimple size={18} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-wishlist-active">
                        <Heart size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star size={18} weight="fill" className="fill-rating text-rating" />
                    <span className="font-bold tabular-nums">4.8</span>
                    <span className="text-sm text-muted-foreground">(1,234 отзива)</span>
                  </div>
                  
                  {/* Badges - better styled */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="condition">
                      <Tag size={12} />
                      USED-EXCELLENT
                    </Badge>
                    <Badge variant="shipping">
                      <Truck size={12} weight="fill" />
                      Безплатна доставка
                    </Badge>
                  </div>
                  
                  {/* Seller preview */}
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg">
                      😊
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">123123123</p>
                      <p className="text-xs text-muted-foreground">Huawei P50 Серия</p>
                    </div>
                  </div>
                </div>
                
                {/* CTA - THE FIX */}
                <div className="border-t bg-muted/30 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* FIXED: Use "black" variant - feels like a real action */}
                    <Button variant="black" size="lg" className="gap-2">
                      <ShoppingCart size={18} weight="bold" />
                      Добави в кошницата
                    </Button>
                    <Button variant="cta" size="lg">
                      Купи сега
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUTTON VARIANTS COMPARISON */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Button Pair Options</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Option 1: Current (bad) */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Current (weak)</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="default" className="text-xs">
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
                <Button variant="cta" size="default" className="text-xs">
                  Buy Now
                </Button>
              </div>
              <p className="text-xs text-destructive">❌ Outline looks like "Cancel"</p>
            </div>
            
            {/* Option 2: Black + Primary (recommended) */}
            <div className="rounded-xl border-2 border-primary bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-primary">Recommended ✓</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="black" size="default" className="text-xs">
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
                <Button variant="cta" size="default" className="text-xs">
                  Buy Now
                </Button>
              </div>
              <p className="text-xs text-success">✓ Both feel like actions</p>
            </div>
            
            {/* Option 3: Secondary + Primary */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Alternative</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="default" className="text-xs">
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
                <Button variant="cta" size="default" className="text-xs">
                  Buy Now
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Softer secondary</p>
            </div>
            
          </div>
        </section>

        {/* CONDITION BADGE OPTIONS */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Condition Badge Options</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Current: Solid dark */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Current (solid dark)</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="condition">NEW</Badge>
                <Badge variant="condition">LIKE NEW</Badge>
                <Badge variant="condition">USED-EXCELLENT</Badge>
                <Badge variant="condition">USED-GOOD</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Neutral, professional, high contrast. Good for eBay-style.
              </p>
            </div>
            
            {/* Alternative: Colored by quality */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Alternative (quality-coded)</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-sm border-transparent bg-condition-new px-1.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wide">NEW</span>
                <span className="inline-flex items-center gap-1 rounded-sm border-transparent bg-condition-likenew px-1.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wide">LIKE NEW</span>
                <span className="inline-flex items-center gap-1 rounded-sm border-transparent bg-condition-good px-1.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wide">EXCELLENT</span>
                <span className="inline-flex items-center gap-1 rounded-sm border-transparent bg-condition-fair px-1.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wide">GOOD</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Color signals quality level instantly.
              </p>
            </div>
            
          </div>
        </section>

        {/* THE ONE-LINE FIX */}
        <section className="rounded-xl bg-primary/5 border-2 border-primary/20 p-6 space-y-4">
          <h2 className="text-lg font-semibold">The Fix (One Line)</h2>
          
          <div className="font-mono text-sm bg-card rounded-lg p-4 overflow-x-auto">
            <p className="text-muted-foreground">
              {"// product-quick-view-content.tsx line ~270"}
            </p>
            <p className="text-destructive line-through">{"<Button variant=\"outline\" size=\"lg\" ...>"}</p>
            <p className="text-success">{"<Button variant=\"black\" size=\"lg\" ...>"}</p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Change the Add to Cart button from <code className="bg-muted px-1 rounded">outline</code> to <code className="bg-muted px-1 rounded">black</code> variant.
            Both buttons now feel like purchase actions.
          </p>
        </section>

      </div>
    </div>
  )
}
