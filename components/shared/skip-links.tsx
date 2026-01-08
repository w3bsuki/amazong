import { Link } from "@/i18n/routing";

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only z-50 relative">
      <Link
        href="#main-content"
        className="fixed top-2 left-2 z-skip-link bg-background text-foreground p-4 rounded-md shadow-sm border border-border font-bold ring-2 ring-primary outline-none"
      >
        Skip to main content
      </Link>
    </div>
  );
}
