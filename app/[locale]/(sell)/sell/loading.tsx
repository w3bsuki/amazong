import { SellFormSkeleton } from "../_components/ui/sell-section-skeleton";

/**
 * Instant loading state for /sell page
 * 
 * This loading.tsx file ensures users see immediate feedback
 * when navigating to the sell page, improving perceived performance.
 */
export default function SellPageLoading() {
  return <SellFormSkeleton />;
}
