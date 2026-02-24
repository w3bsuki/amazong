import {
  PlansControls as RenderPlansControls,
  PlansFaqSection as RenderPlansFaqSection,
  PlansFeaturesSection as RenderPlansFeaturesSection,
  PlansFooter as RenderPlansFooter,
  PlansGuaranteeSection as RenderPlansGuaranteeSection,
  PlansHeroSection as RenderPlansHeroSection,
} from "./plans-page-static-sections"
import { PlansPricingGrid as RenderPlansPricingGrid } from "./plans-page-pricing-grid"
import { PlansComparisonSection as RenderPlansComparisonSection } from "./plans-page-comparison-section"

export function PlansHeroSection(props: Parameters<typeof RenderPlansHeroSection>[0]) {
  return <RenderPlansHeroSection {...props} />
}

export function PlansControls(props: Parameters<typeof RenderPlansControls>[0]) {
  return <RenderPlansControls {...props} />
}

export function PlansPricingGrid(props: Parameters<typeof RenderPlansPricingGrid>[0]) {
  return <RenderPlansPricingGrid {...props} />
}

export function PlansFeaturesSection(props: Parameters<typeof RenderPlansFeaturesSection>[0]) {
  return <RenderPlansFeaturesSection {...props} />
}

export function PlansComparisonSection(props: Parameters<typeof RenderPlansComparisonSection>[0]) {
  return <RenderPlansComparisonSection {...props} />
}

export function PlansGuaranteeSection(props: Parameters<typeof RenderPlansGuaranteeSection>[0]) {
  return <RenderPlansGuaranteeSection {...props} />
}

export function PlansFaqSection(props: Parameters<typeof RenderPlansFaqSection>[0]) {
  return <RenderPlansFaqSection {...props} />
}

export function PlansFooter(props: Parameters<typeof RenderPlansFooter>[0]) {
  return <RenderPlansFooter {...props} />
}
