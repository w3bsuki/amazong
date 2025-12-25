"use client";

import { useRouter } from "next/navigation";
import {
  Storefront,
  ArrowRight,
  ShieldCheck,
  Lightning,
  Truck,
  ChartLineUp,
  Users,
  CreditCard,
  Star,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function SignInPrompt() {
  const router = useRouter();
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Hero Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 sm:mb-6">
            <Sparkle weight="fill" className="size-4" />
            Join 10,000+ sellers
          </div>
          
          {/* Headline - Mobile optimized */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground tracking-tight mb-4 sm:mb-6">
            Turn your items into
            <span className="text-primary block">instant cash</span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
            List your products in minutes, reach millions of customers, and get paid fast. 
            No monthly fees, just simple selling.
          </p>
          
          {/* CTA Buttons - Mobile stacked */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start">
            <Button 
              size="lg" 
              onClick={() => router.push("/auth/login")}
              className="h-12 px-6 sm:px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
            >
              Start Selling
              <ArrowRight className="ml-2 size-5" weight="bold" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/auth/register")}
              className="h-12 px-6 sm:px-8 text-base font-semibold w-full sm:w-auto"
            >
              Create Free Account
            </Button>
          </div>
          
          {/* Trust Stats - Mobile friendly */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
            {[
              { value: "$2M+", label: "Paid to Sellers" },
              { value: "50K+", label: "Products Listed" },
              { value: "4.9★", label: "Seller Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side - Feature Card - Hidden on small mobile, visible from sm+ */}
        <div className="order-1 lg:order-2 hidden sm:block">
          <div className="relative">
            {/* Decorative gradient blob */}
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl" />
            
            {/* Card */}
            <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-primary text-primary-foreground">
                  <Storefront weight="fill" className="size-6 sm:size-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Seller Center</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your business dashboard</p>
                </div>
              </div>
              
              {/* Features List - Reduced on tablet */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  { icon: ShieldCheck, title: "Secure Payments", desc: "Get paid directly to your bank" },
                  { icon: Lightning, title: "Quick Setup", desc: "List your first item in 5 minutes" },
                  { icon: Truck, title: "Easy Shipping", desc: "Print labels with one click" },
                  { icon: ChartLineUp, title: "Sales Analytics", desc: "Track your performance" },
                  { icon: Users, title: "Customer Support", desc: "24/7 seller assistance" },
                  { icon: CreditCard, title: "No Monthly Fees", desc: "Pay only when you sell" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center size-9 sm:size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon weight="duotone" className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">{title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Testimonial */}
              <div className="bg-muted/50 rounded-xl p-3 sm:p-4 border border-border/50">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" className="size-3.5 sm:size-4 text-rating" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground mb-2">
                  &quot;I made my first sale within 24 hours of listing. The process was incredibly smooth!&quot;
                </p>
                <p className="text-xs text-muted-foreground">— Maria K., Top Seller</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
