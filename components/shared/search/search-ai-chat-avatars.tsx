import { Bot as Robot } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const avatarSizeClasses = {
  sm: "size-7",
  md: "size-8",
} as const

export function SearchAiAssistantAvatar({ size = "sm" }: { size?: keyof typeof avatarSizeClasses }) {
  return (
    <Avatar className={cn(avatarSizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Robot size={size === "md" ? 16 : 14} />
      </AvatarFallback>
    </Avatar>
  )
}

export function SearchAiUserAvatar({
  label,
  size = "sm",
}: {
  label: string
  size?: keyof typeof avatarSizeClasses
}) {
  return (
    <Avatar className={cn(avatarSizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-foreground text-background text-2xs font-semibold">
        {label}
      </AvatarFallback>
    </Avatar>
  )
}

