"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  Shield,
  CreditCard,
  GlobeSimple,
  Question,
  SignOut,
  CaretRight,
} from "@/lib/icons/phosphor"
import { cn } from "@/lib/utils"

interface SettingsItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  hasToggle?: boolean
  danger?: boolean
  href?: string
  onClick?: () => void
  toggled?: boolean
  onToggle?: (value: boolean) => void
}

function SettingsItem({
  icon,
  label,
  description,
  hasToggle,
  danger,
  href,
  onClick,
  toggled,
  onToggle,
}: SettingsItemProps) {
  const content = (
    <>
      <div className={cn(
        "size-10 rounded-lg flex items-center justify-center",
        danger ? "bg-destructive-subtle" : "bg-muted"
      )}>
        <span className={danger ? "text-destructive" : "text-foreground"}>
          {icon}
        </span>
      </div>
      <div className="flex-1 text-left">
        <p className={cn(
          "font-medium",
          danger ? "text-destructive" : "text-foreground"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {hasToggle && onToggle ? (
        <Switch
          checked={toggled ?? false}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <CaretRight className="size-5 text-muted-foreground" />
      )}
    </>
  )

  const baseClasses = cn(
    "w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border",
    "tap-transparent active:bg-active transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
    danger && "text-destructive"
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  )
}

interface ProfileSettingsPanelProps {
  /** Whether the user is a seller */
  isSeller?: boolean
  /** Sign out handler */
  onSignOut?: () => void
}

/**
 * ProfileSettingsPanel - Tradesphere-style settings list
 * 
 * Card-style items with icons, labels, descriptions, and either
 * chevron (navigation) or switch (toggle) on the right.
 */
export function ProfileSettingsPanel({ onSignOut }: ProfileSettingsPanelProps) {
  const t = useTranslations("ProfileSettings")

  return (
    <div className="space-y-2 pb-4">
      <SettingsItem
        icon={<Bell className="size-5" weight="fill" />}
        label={t("notifications")}
        description={t("notificationsDescription")}
        href="/account/notifications"
      />
      
      <SettingsItem
        icon={<Shield className="size-5" weight="fill" />}
        label={t("security")}
        description={t("securityDescription")}
        href="/account/security"
      />
      
      <SettingsItem
        icon={<CreditCard className="size-5" weight="fill" />}
        label={t("paymentMethods")}
        description={t("paymentMethodsDescription")}
        href="/account/payments"
      />
      
      <SettingsItem
        icon={<GlobeSimple className="size-5" weight="fill" />}
        label={t("languageRegion")}
        description={t("languageRegionDescription")}
        href="/account/settings"
      />
      
      <SettingsItem
        icon={<Question className="size-5" weight="fill" />}
        label={t("helpSupport")}
        description={t("helpSupportDescription")}
        href="/support"
      />

      {onSignOut && (
        <SettingsItem
          icon={<SignOut className="size-5" weight="fill" />}
          label={t("signOut")}
          description={t("signOutDescription")}
          danger
          onClick={onSignOut}
        />
      )}
    </div>
  )
}
