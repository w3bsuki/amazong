/**
 * Animation Showcase Component
 * 
 * A demo component showing all animation utilities from the design system.
 * Use this as a reference for implementing loading states and micro-interactions.
 */

import React from 'react';

export function AnimationShowcase() {
  return (
    <div className="p-8 space-y-12 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Animation Utilities Showcase</h1>
      
      {/* Skeleton Loading */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Skeleton Loading</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-avatar</p>
            <div className="skeleton-avatar" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-avatar-sm</p>
            <div className="skeleton-avatar-sm" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-avatar-lg</p>
            <div className="skeleton-avatar-lg" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-button</p>
            <div className="skeleton-button" />
          </div>
        </div>
        
        <div className="space-y-2 max-w-md">
          <p className="text-sm text-muted-foreground">skeleton-text (multiple lines)</p>
          <div className="skeleton-text" />
          <div className="skeleton-text w-4/5" />
          <div className="skeleton-text w-3/5" />
        </div>
        
        <div className="space-y-2 max-w-xs">
          <p className="text-sm text-muted-foreground">skeleton-heading</p>
          <div className="skeleton-heading" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-image</p>
            <div className="skeleton-image w-32" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-badge</p>
            <div className="skeleton-badge" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">skeleton-price</p>
            <div className="skeleton-price" />
          </div>
        </div>

        {/* Product Card Skeleton Example */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Product Card Skeleton (composite)</p>
          <div className="w-48 border border-border rounded-lg p-3 space-y-3">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text w-3/4" />
            <div className="flex justify-between items-center">
              <div className="skeleton-price" />
              <div className="skeleton-badge" />
            </div>
          </div>
        </div>
      </section>

      {/* Spinners & Loading */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Spinners & Loading</h2>
        <div className="flex items-center gap-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">spinner-sm</p>
            <div className="spinner-sm text-primary" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">spinner (default)</p>
            <div className="spinner text-primary" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">spinner-lg</p>
            <div className="spinner-lg text-primary" />
          </div>
        </div>
        
        <div className="space-y-2 max-w-xs">
          <p className="text-sm text-muted-foreground">progress-indeterminate</p>
          <div className="progress-indeterminate" />
        </div>
      </section>

      {/* Pulse Animations */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Pulse Animations</h2>
        <div className="flex items-center gap-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">animate-pulse-gentle</p>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse-gentle" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">animate-pulse-fast</p>
            <div className="w-4 h-4 bg-destructive rounded-full animate-pulse-fast" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">animate-pulse-ring</p>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse-ring" />
          </div>
        </div>
      </section>

      {/* Micro-interactions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Micro-interactions</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-twitter animate-press">
            animate-press
          </button>
          <div className="card-twitter animate-lift p-4">
            animate-lift (hover me)
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">animate-spin-slow</p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin-slow" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">animate-spin-fast</p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin-fast" />
          </div>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold">Usage Notes</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>All animations respect <code className="bg-muted px-1 rounded">prefers-reduced-motion: reduce</code></li>
          <li>Use skeleton utilities for loading placeholder content</li>
          <li>Spinners inherit text color - use <code className="bg-muted px-1 rounded">text-primary</code> etc.</li>
          <li>Toast/modal animations are triggered via JS toggling classes</li>
          <li>Combine <code className="bg-muted px-1 rounded">animate-press</code> with buttons for tactile feedback</li>
        </ul>
      </section>
    </div>
  );
}

export default AnimationShowcase;
