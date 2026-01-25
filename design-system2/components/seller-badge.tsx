import * as React from "react"
import { Badge } from "./ui/badge"
import { Briefcase, CheckCircle2, Sparkles } from "lucide-react"

export type SellerBadgeType = "business" | "verified" | "new"

interface SellerBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  type: SellerBadgeType
}

export function SellerBadge({ type, className, ...props }: SellerBadgeProps) {
  if (type === "business") {
    return (
      <Badge variant="info" className={className} {...props}>
        <Briefcase className="mr-1 h-3 w-3" />
        Business Seller
      </Badge>
    )
  }

  if (type === "verified") {
    return (
      <Badge variant="success" className={className} {...props}>
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Verified
      </Badge>
    )
  }

  if (type === "new") {
    return (
      <Badge variant="warning" className={className} {...props}>
        <Sparkles className="mr-1 h-3 w-3" />
        New Seller
      </Badge>
    )
  }

  return null
}
