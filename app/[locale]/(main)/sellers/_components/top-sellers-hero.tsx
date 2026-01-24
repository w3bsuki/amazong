import { AppBreadcrumb } from "@/components/navigation/app-breadcrumb"
import type { BreadcrumbItemData } from "@/components/navigation/app-breadcrumb"

export default function TopSellersHero({
  breadcrumbItems,
  breadcrumbAriaLabel,
  breadcrumbHomeLabel,
  title,
  subtitle,
}: {
  breadcrumbItems: readonly BreadcrumbItemData[]
  breadcrumbAriaLabel: string
  breadcrumbHomeLabel: string
  title: string
  subtitle: string
}) {
  return (
    <div className="bg-rating text-rating-foreground py-6 sm:py-10">
      <div className="container">
        <div className="[&_nav]:border-white/20 [&_nav]:mb-2 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
          <AppBreadcrumb
            items={breadcrumbItems}
            ariaLabel={breadcrumbAriaLabel}
            homeLabel={breadcrumbHomeLabel}
          />
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="size-12 sm:size-14 bg-primary-foreground/10 rounded-full flex items-center justify-center">
            <svg className="size-6 sm:size-7 text-white" fill="currentColor" viewBox="0 0 256 256">
              <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Zm-64,80a24,24,0,0,1-24,24H112a24,24,0,0,1-24-24V48a8,8,0,0,1,8-8H168a8,8,0,0,1,8,8Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">{title}</h1>
            <p className="text-white/80 text-sm sm:text-base mt-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
