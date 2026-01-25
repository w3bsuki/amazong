import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Tokens v2 — Refined",
  robots: { index: false, follow: false },
};

/**
 * DESIGN PRINCIPLES:
 * 
 * 1. Anchor on Twitter Blue (hue 243) — everything harmonizes with this
 * 2. Status colors: Same chroma (~0.14-0.16), vary hue only
 * 3. Lightness: 0.55-0.65 for text on white, 0.68-0.78 for text on dark
 * 4. Marketplace: Muted variants, not screaming colors
 * 5. No more than 5-6 distinct hues total
 */

export default function DesignTokensV2Demo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-surface-subtle px-6 py-12 md:px-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground">
            Design Tokens v2
          </h1>
          <p className="mt-2 text-muted-foreground">
            Refined palette anchored on Twitter Blue • Consistent lightness/chroma • Dark mode ready
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-12 md:px-10">
        
        {/* The Problem */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">The Problem (Current)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Random hues, inconsistent saturation, no visual harmony
            </p>
          </div>
          
          <div className="rounded-xl border bg-card p-6">
            <p className="mb-4 text-sm font-medium text-muted-foreground">Current status colors:</p>
            <div className="flex flex-wrap gap-3">
              <Chip style={{ background: "oklch(0.60 0.18 145)" }}>Success (H:145)</Chip>
              <Chip style={{ background: "oklch(0.75 0.16 85)" }} dark>Warning (H:85)</Chip>
              <Chip style={{ background: "oklch(0.55 0.25 27)" }}>Error (H:27)</Chip>
              <Chip style={{ background: "oklch(0.55 0.18 250)" }}>Info (H:250)</Chip>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ❌ Lightness varies 0.55→0.75 • Chroma varies 0.16→0.25 • Hues unrelated to primary
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">The Solution (Proposed)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Consistent L=0.55, C=0.15, hues offset from primary (243)
            </p>
          </div>
          
          <div className="rounded-xl border bg-card p-6">
            <p className="mb-4 text-sm font-medium text-muted-foreground">Refined status colors:</p>
            <div className="flex flex-wrap gap-3">
              <Chip style={{ background: "oklch(0.55 0.15 155)" }}>Success (H:155)</Chip>
              <Chip style={{ background: "oklch(0.72 0.14 85)" }} dark>Warning (H:85)</Chip>
              <Chip style={{ background: "oklch(0.55 0.18 25)" }}>Error (H:25)</Chip>
              <Chip style={{ background: "oklch(0.55 0.15 243)" }}>Info (H:243)</Chip>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ✅ Lightness consistent • Chroma consistent • Info matches primary hue
            </p>
          </div>
        </section>

        {/* Hue Wheel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Hue Harmony (5 Colors)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All semantic colors derive from 5 anchor hues
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-5">
            <HueCard hue={243} name="Primary Blue" role="brand, info, links" />
            <HueCard hue={155} name="Teal Green" role="success, verified, fresh" />
            <HueCard hue={25} name="Warm Red" role="error, deal, urgency" />
            <HueCard hue={85} name="Amber" role="warning, rating" />
            <HueCard hue={300} name="Purple" role="refurb, premium" />
          </div>
        </section>

        {/* Refined Status */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Status Colors (Refined)</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Light mode */}
            <div className="rounded-xl border bg-white p-6">
              <p className="mb-4 text-sm font-medium text-neutral-500">Light Mode (L ≈ 0.55)</p>
              <div className="space-y-2">
                <StatusRow label="Success" oklch="0.55 0.15 155" />
                <StatusRow label="Warning" oklch="0.72 0.14 85" textDark />
                <StatusRow label="Error" oklch="0.55 0.18 25" />
                <StatusRow label="Info" oklch="0.55 0.15 243" />
              </div>
            </div>
            
            {/* Dark mode */}
            <div className="rounded-xl border bg-neutral-900 p-6">
              <p className="mb-4 text-sm font-medium text-neutral-400">Dark Mode (L ≈ 0.68)</p>
              <div className="space-y-2">
                <StatusRow label="Success" oklch="0.68 0.15 155" />
                <StatusRow label="Warning" oklch="0.78 0.14 85" textDark />
                <StatusRow label="Error" oklch="0.68 0.16 25" />
                <StatusRow label="Info" oklch="0.67 0.15 243" />
              </div>
            </div>
          </div>
        </section>

        {/* Condition Badges - Unified */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Condition Badges (Unified)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Same lightness/chroma, only hue varies to indicate quality level
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Current - chaotic */}
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Current (chaotic)</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-condition-new px-3 py-1 text-sm text-white">New</span>
                <span className="rounded-full bg-condition-likenew px-3 py-1 text-sm text-white">Like New</span>
                <span className="rounded-full bg-condition-good px-3 py-1 text-sm text-white">Good</span>
                <span className="rounded-full bg-condition-fair px-3 py-1 text-sm text-white">Fair</span>
              </div>
            </div>
            
            {/* Proposed - unified */}
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Proposed (unified)</p>
              <div className="flex flex-wrap gap-2">
                <Badge oklch="0.55 0.14 155">New</Badge>
                <Badge oklch="0.55 0.12 200">Like New</Badge>
                <Badge oklch="0.55 0.10 243">Good</Badge>
                <Badge oklch="0.55 0.08 260">Fair</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Quality degrades: chroma 0.14→0.08, hue shifts warm→cool
              </p>
            </div>
          </div>
        </section>

        {/* Price Display */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Price Display</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Current</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-price-sale">$79.99</span>
                <span className="text-lg text-price-original line-through">$129.99</span>
              </div>
            </div>
            
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Proposed (deal red)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: "oklch(0.55 0.18 25)" }}>$79.99</span>
                <span className="text-lg text-muted-foreground line-through">$129.99</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Sale price uses error/deal hue (25) • Original uses muted-foreground
              </p>
            </div>
          </div>
        </section>

        {/* Order Status - Progressive */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Order Status (Progressive)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Color tells the story: warm start → cool completion
            </p>
          </div>
          
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap gap-2">
              <Badge oklch="0.65 0.14 85">Pending</Badge>
              <Badge oklch="0.55 0.15 243">Processing</Badge>
              <Badge oklch="0.55 0.13 220">Shipped</Badge>
              <Badge oklch="0.55 0.15 155">Delivered</Badge>
              <Badge oklch="0.55 0.18 25">Cancelled</Badge>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Pending (amber wait) → Processing (primary blue) → Shipped (teal) → Delivered (green success) → Cancelled (red)
            </p>
          </div>
        </section>

        {/* Token Spec Table */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Token Specification</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Light Mode</th>
                  <th className="pb-3 font-medium">Dark Mode</th>
                  <th className="pb-3 font-medium">Hue Source</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <TokenRow name="--success" light="0.55 0.15 155" dark="0.68 0.15 155" source="Teal Green" />
                <TokenRow name="--warning" light="0.72 0.14 85" dark="0.78 0.14 85" source="Amber" />
                <TokenRow name="--error" light="0.55 0.18 25" dark="0.68 0.16 25" source="Warm Red" />
                <TokenRow name="--info" light="0.55 0.15 243" dark="0.67 0.15 243" source="Primary Blue" />
                <TokenRow name="--deal" light="0.55 0.18 25" dark="0.68 0.16 25" source="Warm Red" />
                <TokenRow name="--verified" light="0.55 0.15 155" dark="0.68 0.15 155" source="Teal Green" />
                <TokenRow name="--rating" light="0.75 0.16 85" dark="0.80 0.14 85" source="Amber" />
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
          <h2 className="text-lg font-semibold">Summary: 5 Rules</h2>
          <ol className="mt-4 space-y-2 text-sm">
            <li><strong>1.</strong> Anchor all hues on the 5-color wheel (243, 155, 25, 85, 300)</li>
            <li><strong>2.</strong> Light mode: L ≈ 0.55, Dark mode: L ≈ 0.68</li>
            <li><strong>3.</strong> Chroma 0.14-0.18 for saturation (never above 0.20)</li>
            <li><strong>4.</strong> Warning/Rating are background colors (higher L), not text colors</li>
            <li><strong>5. Info = Primary hue</strong> — they&apos;re the same blue</li>
          </ol>
        </section>

      </div>
    </div>
  );
}

/* Helper Components */

function Chip({ children, style, dark }: { children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }) {
  return (
    <span 
      className={`rounded-full px-3 py-1.5 text-sm font-medium ${dark ? "text-neutral-900" : "text-white"}`}
      style={style}
    >
      {children}
    </span>
  );
}

function HueCard({ hue, name, role }: { hue: number; name: string; role: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-center">
      <div 
        className="mx-auto mb-3 h-12 w-12 rounded-full"
        style={{ background: `oklch(0.55 0.15 ${hue})` }}
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">H: {hue}</p>
      <p className="mt-1 text-xs text-muted-foreground">{role}</p>
    </div>
  );
}

function StatusRow({ label, oklch, textDark }: { label: string; oklch: string; textDark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="h-8 w-20 rounded"
        style={{ background: `oklch(${oklch})` }}
      />
      <span className={`text-sm ${textDark ? "text-neutral-900" : "text-white"}`} style={{ color: `oklch(${oklch})` }}>
        {label} text
      </span>
      <span className="text-xs text-muted-foreground font-mono">oklch({oklch})</span>
    </div>
  );
}

function Badge({ children, oklch }: { children: React.ReactNode; oklch: string }) {
  return (
    <span 
      className="rounded-full px-3 py-1 text-sm font-medium text-white"
      style={{ background: `oklch(${oklch})` }}
    >
      {children}
    </span>
  );
}

function TokenRow({ name, light, dark, source }: { name: string; light: string; dark: string; source: string }) {
  return (
    <tr className="border-b">
      <td className="py-2 font-semibold">{name}</td>
      <td className="py-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded" style={{ background: `oklch(${light})` }} />
          {light}
        </span>
      </td>
      <td className="py-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded" style={{ background: `oklch(${dark})` }} />
          {dark}
        </span>
      </td>
      <td className="py-2 text-muted-foreground">{source}</td>
    </tr>
  );
}
