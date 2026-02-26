import type { ReactNode } from "react"

import { AppBreadcrumb, type BreadcrumbItemData } from "../../_components/navigation/app-breadcrumb"
import { PageShell } from "../../_components/page-shell"
import { StaticPageHeaderSync } from "./static-page-header-sync"

interface StaticHeroPageShellProps {
  title: string
  breadcrumbItems: readonly BreadcrumbItemData[]
  breadcrumbAriaLabel: string
  breadcrumbHomeLabel?: string
  hero: ReactNode
  children: ReactNode
  pageShellClassName?: string
  heroContainerClassName?: string
  bodyContainerClassName?: string
}

const BREADCRUMB_WRAPPER_CLASSNAME =
  "hidden md:block [&_nav]:border-border-subtle [&_nav]:mb-4 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground"

export function StaticHeroPageShell({
  title,
  breadcrumbItems,
  breadcrumbAriaLabel,
  breadcrumbHomeLabel,
  hero,
  children,
  pageShellClassName = "overflow-x-hidden",
  heroContainerClassName = "container px-4 sm:px-6 py-10 md:py-16",
  bodyContainerClassName = "container px-4 sm:px-6 py-8",
}: StaticHeroPageShellProps) {
  return (
    <PageShell className={pageShellClassName}>
      <StaticPageHeaderSync title={title} backHref="/" />
      <div className="bg-primary text-primary-foreground">
        <div className={heroContainerClassName}>
          <div className={BREADCRUMB_WRAPPER_CLASSNAME}>
            <AppBreadcrumb
              items={breadcrumbItems}
              ariaLabel={breadcrumbAriaLabel}
              {...(breadcrumbHomeLabel === undefined ? {} : { homeLabel: breadcrumbHomeLabel })}
            />
          </div>
          {hero}
        </div>
      </div>

      <div className={bodyContainerClassName}>{children}</div>
    </PageShell>
  )
}

