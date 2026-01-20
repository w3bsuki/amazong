import Link from "next/link";

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Demo Pages</h1>
        <p className="text-sm text-muted-foreground">
          Prototype pages for testing new designs and components.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/demo/sell2"
            className="block p-4 rounded-md border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="font-semibold text-primary">✨ Premium Sell Form (NEW)</div>
            <div className="text-sm text-muted-foreground">
              World-class mobile-first sell form with exceptional UI/UX
            </div>
          </Link>
          
          <Link
            href="/demo/sell"
            className="block p-4 rounded-md border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="font-semibold text-foreground">Mobile Sell Form (Basic)</div>
            <div className="text-sm text-muted-foreground">
              Basic mobile sell form prototype
            </div>
          </Link>
          
          <Link
            href="/demo/product-desktop"
            className="block p-4 rounded-md border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="font-semibold text-foreground">Desktop Product Page</div>
            <div className="text-sm text-muted-foreground">
              World-class desktop product page with left gallery + right buy box
            </div>
          </Link>
          
          <Link
            href="/demo/product-mobile"
            className="block p-4 rounded-md border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="font-semibold text-foreground">Mobile Product Page</div>
            <div className="text-sm text-muted-foreground">
              World-class mobile product page prototype
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
