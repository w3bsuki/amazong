import { DrawerBody } from "@/components/ui/drawer"

import { MenuSection } from "./account-drawer-menu-section"
import { AccountDrawerProfileSection } from "./account-drawer-profile-section"
import { AccountDrawerSignOutSection } from "./account-drawer-sign-out-section"
import type { MenuItem } from "./account-drawer.types"

interface AccountDrawerAuthenticatedContentProps {
  onClose: () => void
  displayName: string
  avatarUrl: string | null | undefined
  isEmailVerified: boolean
  memberSinceLabel: string | null
  email: string | null | undefined
  isSeller: boolean
  activeListings: number
  rating: number
  totalSales: number
  verifiedLabel: string
  statsListingsLabel: string
  statsRatingLabel: string
  statsSalesLabel: string
  accountSectionLabel: string
  sellingSectionLabel: string
  settingsSectionLabel: string
  accountItems: MenuItem[]
  sellingItems: MenuItem[]
  settingsItems: MenuItem[]
  signOutLabel: string
  isSigningOut: boolean
  onSignOutSubmit: () => void
}

export function AccountDrawerAuthenticatedContent({
  onClose,
  displayName,
  avatarUrl,
  isEmailVerified,
  memberSinceLabel,
  email,
  isSeller,
  activeListings,
  rating,
  totalSales,
  verifiedLabel,
  statsListingsLabel,
  statsRatingLabel,
  statsSalesLabel,
  accountSectionLabel,
  sellingSectionLabel,
  settingsSectionLabel,
  accountItems,
  sellingItems,
  settingsItems,
  signOutLabel,
  isSigningOut,
  onSignOutSubmit,
}: AccountDrawerAuthenticatedContentProps) {
  return (
    <DrawerBody className="space-y-3 px-inset pt-4 pb-safe-max">
      <AccountDrawerProfileSection
        displayName={displayName}
        avatarUrl={avatarUrl}
        isEmailVerified={isEmailVerified}
        memberSinceLabel={memberSinceLabel}
        email={email}
        isSeller={isSeller}
        activeListings={activeListings}
        rating={rating}
        totalSales={totalSales}
        verifiedLabel={verifiedLabel}
        statsListingsLabel={statsListingsLabel}
        statsRatingLabel={statsRatingLabel}
        statsSalesLabel={statsSalesLabel}
        onClose={onClose}
      />

      <MenuSection label={accountSectionLabel} items={accountItems} onItemClick={onClose} />
      <MenuSection label={sellingSectionLabel} items={sellingItems} onItemClick={onClose} />
      <MenuSection label={settingsSectionLabel} items={settingsItems} onItemClick={onClose} />

      <AccountDrawerSignOutSection
        signOutLabel={signOutLabel}
        isSigningOut={isSigningOut}
        onSubmit={onSignOutSubmit}
      />
    </DrawerBody>
  )
}

