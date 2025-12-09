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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-16">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Side - Hero Content */}
        <div className="order-2 lg:order-1">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkle weight="fill" className="size-4" />
            Join 10,000+ sellers
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            Turn your items into
            <span className="text-primary block">instant cash</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            List your products in minutes, reach millions of customers, and get paid fast. 
            No monthly fees, just simple selling.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={() => router.push("/auth/login")}
              className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Selling
              <ArrowRight className="ml-2 size-5" weight="bold" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/auth/register")}
              className="h-12 px-8 text-base font-semibold"
            >
              Create Free Account
            </Button>
          </div>
          
          {/* Trust Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
            {[
              { value: "$2M+", label: "Paid to Sellers" },
              { value: "50K+", label: "Products Listed" },
              { value: "4.9★", label: "Seller Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side - Feature Card */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            {/* Decorative gradient blob */}
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl" />
            
            {/* Card */}
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center size-14 rounded-xl bg-primary text-primary-foreground">
                  <Storefront weight="fill" className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Seller Center</h2>
                  <p className="text-sm text-muted-foreground">Your business dashboard</p>
                </div>
              </div>
              
              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: ShieldCheck, title: "Secure Payments", desc: "Get paid directly to your bank" },
                  { icon: Lightning, title: "Quick Setup", desc: "List your first item in 5 minutes" },
                  { icon: Truck, title: "Easy Shipping", desc: "Print labels with one click" },
                  { icon: ChartLineUp, title: "Sales Analytics", desc: "Track your performance" },
                  { icon: Users, title: "Customer Support", desc: "24/7 seller assistance" },
                  { icon: CreditCard, title: "No Monthly Fees", desc: "Pay only when you sell" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon weight="duotone" className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Testimonial */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" className="size-4 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-2">
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
