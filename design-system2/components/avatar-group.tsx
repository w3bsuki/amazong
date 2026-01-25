import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  users: Array<{
    name: string
    image?: string
    initials: string
  }>
  limit?: number
  size?: "sm" | "md" | "lg"
}

export function AvatarGroup({ 
  users, 
  limit = 4, 
  size = "md",
  className,
  ...props 
}: AvatarGroupProps) {
  const displayedUsers = users.slice(0, limit)
  const remaining = users.length - limit

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  }

  return (
    <div className={cn("flex items-center -space-x-3", className)} {...props}>
      {displayedUsers.map((user, index) => (
        <Avatar 
          key={index} 
          className={cn(
            "border-2 border-background ring-0 transition-transform",
            sizeClasses[size]
          )}
        >
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
      
      {remaining > 0 && (
        <div className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border-2 border-background bg-muted text-muted-foreground items-center justify-center font-bold ring-0",
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  )
}
