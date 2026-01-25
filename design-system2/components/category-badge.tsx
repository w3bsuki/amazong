import * as React from "react"
import { Badge } from "./ui/badge"
import { Shirt, Laptop, Car } from "lucide-react"

export type CategoryType = "fashion" | "tech" | "auto"

interface CategoryBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  category: CategoryType
}

export function CategoryBadge({ category, className, ...props }: CategoryBadgeProps) {
  if (category === "fashion") {
    return (
      <Badge variant="fashion" className={className} {...props}>
        <Shirt className="mr-1 h-3 w-3" />
        Fashion
      </Badge>
    )
  }

  if (category === "tech") {
    return (
      <Badge variant="tech" className={className} {...props}>
        <Laptop className="mr-1 h-3 w-3" />
        Electronics
      </Badge>
    )
  }

  if (category === "auto") {
    return (
      <Badge variant="auto" className={className} {...props}>
        <Car className="mr-1 h-3 w-3" />
        Automotive
      </Badge>
    )
  }

  return null
}
