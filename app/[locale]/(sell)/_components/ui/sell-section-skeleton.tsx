"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SellSectionSkeletonProps {
  /** The section type to render the appropriate skeleton structure */
  variant?: "photos" | "details" | "pricing" | "shipping" | "default";
  /** Additional className */
  className?: string;
}

/**
 * SellSectionSkeleton - Loading skeleton for sell form sections
 * 
 * Provides visual loading states that match the structure of each section
 * to minimize layout shift when content loads.
 */
export function SellSectionSkeleton({ 
  variant = "default",
  className 
}: SellSectionSkeletonProps) {
  return (
    <Card className={cn("rounded-md border-border/60", className)}>
      {/* Header skeleton */}
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-2.5">
          {/* Icon placeholder */}
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            {/* Title */}
            <Skeleton className="h-4 w-24" />
            {/* Description */}
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        {variant === "photos" && <PhotosSkeleton />}
        {variant === "details" && <DetailsSkeleton />}
        {variant === "pricing" && <PricingSkeleton />}
        {variant === "shipping" && <ShippingSkeleton />}
        {variant === "default" && <DefaultSkeleton />}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Section-Specific Skeletons
// ============================================================================

function PhotosSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Main upload zone */}
      <Skeleton className="col-span-2 aspect-square rounded-md" />
      {/* Thumbnail slots */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-md" />
      ))}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title field */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-3 w-20" />
      </div>
      
      {/* Category picker */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
      
      {/* Condition dropdown */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
      
      {/* Description textarea */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    </div>
  );
}

function PricingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Format selection (2 cards) */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-touch-lg rounded-md" />
        <Skeleton className="h-touch-lg rounded-md" />
      </div>
      
      {/* Price and quantity */}
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-touch w-full rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-touch w-full rounded-md" />
        </div>
      </div>
      
      {/* Accept offers checkbox */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

function ShippingSkeleton() {
  return (
    <div className="space-y-3">
      {/* Shipping option cards */}
      <Skeleton className="h-touch-lg rounded-md" />
      <Skeleton className="h-touch-lg rounded-md" />
      
      {/* Package dimensions */}
      <div className="rounded-md border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-touch-sm w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-3/4 rounded-lg" />
    </div>
  );
}

// ============================================================================
// Full Form Skeleton - For initial page load
// ============================================================================

export function SellFormSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="container-content h-full flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-14">
        <div className="container-content">
          <div className="lg:grid lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem] lg:gap-4 py-4 lg:py-6">
            {/* Left column - Form sections */}
            <div className="space-y-6">
              {/* Page header */}
              <div className="pb-4">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>

              {/* Progress (mobile) */}
              <div className="lg:hidden space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>

              {/* Section skeletons */}
              <SellSectionSkeleton variant="photos" />
              <SellSectionSkeleton variant="details" />
              <SellSectionSkeleton variant="pricing" />
              <SellSectionSkeleton variant="shipping" />
            </div>

            {/* Right column - Sidebar (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-20 space-y-4">
                {/* Preview card */}
                <Card className="rounded-md">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>

                {/* Tips card */}
                <Card className="rounded-md">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/5" />
                  </CardContent>
                </Card>

                {/* Checklist card */}
                <Card className="rounded-md">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-28" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile footer skeleton */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 pb-safe lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Skeleton className="size-touch rounded-lg shrink-0" />
          <Skeleton className="flex-1 h-touch rounded-lg" />
        </div>
      </div>
    </div>
  );
}
