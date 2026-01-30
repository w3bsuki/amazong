import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"

type SocialIconBgClass =
  | "bg-primary"
  | "bg-social-instagram"
  | "bg-social-tiktok"
  | "bg-social-youtube"
  | "bg-social-twitter"

interface SocialInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Prefix text (e.g., "@" for handles) */
  prefix?: string
  /** Icon element (social platform icon) */
  icon?: ReactNode
  /** Background color class for the icon container */
  iconBg?: SocialIconBgClass
}

/**
 * Unified social link input with consistent styling.
 * Used in onboarding and profile edit forms.
 */
export const SocialInput = forwardRef<HTMLInputElement, SocialInputProps>(
  ({ prefix, icon, iconBg = "bg-primary", className, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
        {icon && (
          <div className={cn(
            "size-10 sm:size-11 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
            iconBg
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 flex items-center h-10 sm:h-11 rounded-lg border-2 border-input overflow-hidden transition-colors focus-within:border-primary">
          {prefix && (
            <span className="px-3 text-sm text-muted-foreground bg-surface-subtle border-r border-input h-full flex items-center font-medium">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className="flex-1 h-full px-3 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
            {...props}
          />
        </div>
      </div>
    )
  }
)
SocialInput.displayName = "SocialInput"
