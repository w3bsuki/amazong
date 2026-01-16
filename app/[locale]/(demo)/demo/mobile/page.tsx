"use client"

import { Suspense } from "react"
import { MobileDemoLanding } from "./_components/mobile-demo-landing"
import { DeviceMobile, Monitor } from "@phosphor-icons/react"

export default function MobileDemoPage() {
  return (
    <>
      {/* Desktop Message - Show only on md+ screens */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="mx-auto size-20 bg-muted rounded-full flex items-center justify-center">
            <DeviceMobile size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Mobile Demo Only
          </h1>
          <p className="text-muted-foreground">
            This demo showcases a world-class mobile shopping experience. 
            Please view on a mobile device or resize your browser window to see the full experience.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Monitor size={18} />
            <span>Current: Desktop view</span>
          </div>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
              <span className="size-2 bg-primary rounded-full animate-pulse" />
              Resize to &lt; 768px to view mobile demo
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Demo - Show only on mobile screens */}
      <div className="md:hidden">
        <Suspense fallback={<MobileDemoSkeleton />}>
          <MobileDemoLanding />
        </Suspense>
      </div>
    </>
  )
}

function MobileDemoSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Search bar skeleton */}
      <div className="px-4 pt-4 pb-3">
        <div className="h-11 bg-muted rounded-full" />
      </div>
      {/* Category circles skeleton */}
      <div className="px-4 py-3">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="size-16 bg-muted rounded-full" />
              <div className="h-3 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Banner skeleton */}
      <div className="px-4 py-2">
        <div className="h-32 bg-muted rounded-lg" />
      </div>
      {/* Products skeleton */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square bg-muted rounded-md" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
