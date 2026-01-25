import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System Demo",
  robots: { index: false, follow: false },
};

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Design Tokens Demo
          </h1>
          <p className="text-muted-foreground">
            Toggle dark mode (system or manual) to see tokens adapt.
          </p>
        </header>

        {/* Core Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Core Colors (Twitter Theme)</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            <ColorSwatch name="primary" className="bg-primary text-primary-foreground" />
            <ColorSwatch name="secondary" className="bg-secondary text-secondary-foreground" />
            <ColorSwatch name="muted" className="bg-muted text-muted-foreground" />
            <ColorSwatch name="accent" className="bg-accent text-accent-foreground" />
            <ColorSwatch name="destructive" className="bg-destructive text-destructive-foreground" />
            <ColorSwatch name="card" className="bg-card text-card-foreground border" />
          </div>
        </section>

        {/* Status Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Status Colors</h2>
          <p className="text-sm text-muted-foreground">
            ✅ Status tokens adapt to dark mode (via `:root`/`.dark` overrides bridged into Tailwind).
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ColorSwatch name="success" className="bg-success text-white" />
            <ColorSwatch name="warning" className="bg-warning text-warning-foreground" />
            <ColorSwatch name="error" className="bg-error text-white" />
            <ColorSwatch name="info" className="bg-info text-white" />
          </div>
        </section>

        {/* Surfaces */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Surface Hierarchy</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <SurfaceCard name="background" className="bg-background" />
            <SurfaceCard name="surface-page" className="bg-surface-page" />
            <SurfaceCard name="surface-subtle" className="bg-surface-subtle" />
            <SurfaceCard name="surface-card" className="bg-surface-card" />
            <SurfaceCard name="surface-elevated" className="bg-surface-elevated" />
            <SurfaceCard name="muted" className="bg-muted" />
          </div>
        </section>

        {/* Interactive States */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Interactive States</h2>
          <div className="flex flex-wrap gap-3">
            <button className="h-10 rounded-md border border-border bg-background px-4 text-foreground hover:bg-hover">
              Default → Hover
            </button>
            <button className="h-10 rounded-md border border-selected-border bg-selected px-4 text-foreground">
              Selected
            </button>
            <button className="h-10 rounded-md bg-active px-4 text-foreground">
              Active
            </button>
            <button className="h-10 rounded-md bg-checked px-4 text-checked-foreground">
              Checked
            </button>
          </div>
        </section>

        {/* Marketplace Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Marketplace Semantic</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
            <ColorSwatch name="verified" className="bg-verified text-white" small />
            <ColorSwatch name="shipping-free" className="bg-shipping-free text-white" small />
            <ColorSwatch name="rating" className="bg-rating text-black" small />
            <ColorSwatch name="wishlist" className="bg-wishlist text-white" small />
            <ColorSwatch name="deal" className="bg-deal text-deal-foreground" small />
          </div>
        </section>

        {/* Price Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Price Display</h2>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-price-sale">$79.99</span>
              <span className="text-lg text-price-original line-through">$129.99</span>
              <span className="text-sm font-medium text-price-savings">Save 38%</span>
            </div>
            <p className="mt-2 text-price-regular">Regular price shown in default text</p>
          </div>
        </section>

        {/* Condition Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Condition Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-condition-new px-3 py-1 text-sm font-medium text-white">New</span>
            <span className="rounded-full bg-condition-likenew px-3 py-1 text-sm font-medium text-white">Like New</span>
            <span className="rounded-full bg-condition-good px-3 py-1 text-sm font-medium text-white">Good</span>
            <span className="rounded-full bg-condition-fair px-3 py-1 text-sm font-medium text-white">Fair</span>
            <span className="rounded-full bg-condition-used px-3 py-1 text-sm font-medium text-white">Used</span>
            <span className="rounded-full bg-condition-refurb px-3 py-1 text-sm font-medium text-white">Refurbished</span>
          </div>
        </section>

        {/* Order Status */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Order Status</h2>
          <div className="flex flex-wrap gap-2">
            <StatusPill name="Pending" className="bg-order-pending" />
            <StatusPill name="Processing" className="bg-order-processing" />
            <StatusPill name="Shipped" className="bg-order-shipped" />
            <StatusPill name="Delivered" className="bg-order-delivered" />
            <StatusPill name="Cancelled" className="bg-order-cancelled" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Typography Scale</h2>
          <div className="space-y-2 rounded-lg border bg-card p-4">
            <p className="text-2xs text-muted-foreground">text-2xs (10px) — Micro labels</p>
            <p className="text-tiny text-muted-foreground">text-tiny (11px) — Tiny captions</p>
            <p className="text-compact">text-compact (13px) — Compact UI</p>
            <p className="text-body">text-body (14px) — Body text</p>
            <p className="text-reading">text-reading (15px) — Long-form reading</p>
            <p className="text-price font-semibold">text-price (16px) — Prices</p>
          </div>
        </section>

        {/* Radius */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Border Radius</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex h-16 w-24 items-center justify-center rounded-sm border bg-muted text-xs">sm (2px)</div>
            <div className="flex h-16 w-24 items-center justify-center rounded-md border bg-muted text-xs">md (4px)</div>
            <div className="flex h-16 w-24 items-center justify-center rounded-lg border bg-muted text-xs">lg (6px)</div>
            <div className="flex h-16 w-24 items-center justify-center rounded-full border bg-muted text-xs">full</div>
          </div>
        </section>

        {/* Touch Targets */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Touch Targets</h2>
          <div className="flex flex-wrap items-end gap-3">
            <button className="flex h-touch-xs w-24 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              touch-xs (32px)
            </button>
            <button className="flex h-touch-sm w-24 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              touch-sm (36px)
            </button>
            <button className="flex h-touch w-24 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              touch (40px)
            </button>
            <button className="flex h-touch-lg w-24 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              touch-lg (48px)
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-6 text-sm text-muted-foreground">
          <p>Theme: Twitter (via tweakcn.com) • Tailwind CSS v4 • shadcn/ui new-york</p>
        </footer>
      </div>
    </div>
  );
}

function ColorSwatch({ name, className, small }: { name: string; className: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${small ? "" : ""}`}>
      <div className={`${small ? "h-10 w-full" : "h-16 w-full"} rounded-md ${className} flex items-center justify-center text-xs font-medium`}>
        {name}
      </div>
    </div>
  );
}

function SurfaceCard({ name, className }: { name: string; className: string }) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">bg-{name}</p>
    </div>
  );
}

function StatusPill({ name, className }: { name: string; className: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium text-white ${className}`}>
      {name}
    </span>
  );
}
