import { getTranslations } from "next-intl/server"
import { AddressesContent } from "./addresses-content"
import { USER_ADDRESSES_SELECT } from "./_lib/selects"
import { withAccountPageShell } from "../_lib/account-page-shell"

export const metadata = {
  title: "Addresses | Treido",
  description: "Manage your saved addresses.",
}

export default async function AddressesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "SidebarMenu" })

    const { data: addressesData } = await supabase
      .from("user_addresses")
      .select(USER_ADDRESSES_SELECT)
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    const addresses = (addressesData ?? []).map((address) => ({
      ...address,
      is_default: address.is_default ?? false,
    }))

    return {
      title: t("addresses"),
      content: <AddressesContent initialAddresses={addresses} />,
    }
  })
}
