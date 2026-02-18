import type { ReactNode } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OrderDetailSideCardProps {
  title: ReactNode
  description?: ReactNode | undefined
  action?: ReactNode | undefined
  children: ReactNode
  className?: string | undefined
  headerClassName?: string | undefined
  contentClassName?: string | undefined
  titleClassName?: string | undefined
  descriptionClassName?: string | undefined
  actionRowClassName?: string | undefined
  headingClassName?: string | undefined
}

export function OrderDetailSideCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  actionRowClassName,
  headingClassName,
}: OrderDetailSideCardProps) {
  const titleNode = <CardTitle className={cn("text-base", titleClassName)}>{title}</CardTitle>
  const descriptionNode = description
    ? <CardDescription className={descriptionClassName}>{description}</CardDescription>
    : null

  return (
    <Card className={className}>
      <CardHeader className={cn("pb-3", headerClassName)}>
        {action ? (
          <div className={cn(actionRowClassName ?? "flex items-start justify-between gap-3")}>
            {descriptionNode || headingClassName ? (
              <div className={headingClassName}>
                {titleNode}
                {descriptionNode}
              </div>
            ) : titleNode}
            {action}
          </div>
        ) : (
          <>
            {titleNode}
            {descriptionNode}
          </>
        )}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
