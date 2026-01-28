import { Link } from "@/i18n/routing";

/**
 * SkipLinks — Accessibility navigation for keyboard users
 *
 * Provides quick navigation to key page areas:
 * - Main content (product grid, page content)
 * - Sidebar (categories, filters)
 * - Footer
 *
 * These links are only visible when focused, allowing keyboard users
 * to bypass repetitive navigation blocks.
 *
 * Best Practices:
 * - Links target element IDs that exist on the page
 * - Each target element should have tabindex="-1" for proper focus
 * - Links are in a logical tab order
 */

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="fixed top-2 left-2 z-skip-link bg-background text-foreground p-4 rounded-md shadow-md border border-border font-semibold ring-2 ring-primary outline-none transform -translate-y-16 focus:translate-y-0 transition-transform duration-150"
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <nav
      aria-label="Skip links"
      className="sr-only focus-within:not-sr-only"
    >
      {/* Primary skip link - always first */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>

      {/* Secondary skip links - shown in sequence on Tab */}
      <SkipLink href="#shell-sidebar">
        Skip to sidebar
      </SkipLink>

      <SkipLink href="#product-grid">
        Skip to products
      </SkipLink>

      <SkipLink href="#footerHeader">
        Skip to footer
      </SkipLink>
    </nav>
  );
}

