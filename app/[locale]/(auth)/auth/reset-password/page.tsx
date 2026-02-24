import type { Metadata } from "next"
import ResetPasswordClient from "./reset-password-client"
import { buildRouteMetadata } from "../_lib/route-locale-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return buildRouteMetadata({
    params,
    namespace: "Auth",
    titleKey: "setNewPassword",
    descriptionKey: "setNewPasswordDescription",
  })
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
