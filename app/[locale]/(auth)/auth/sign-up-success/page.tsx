import type { Metadata } from "next"
import { buildRouteMetadata } from "../_lib/route-locale-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return buildRouteMetadata({
    params,
    namespace: "Auth",
    titleKey: "signUpSuccessTitle",
    descriptionKey: "signUpSuccessDescription",
    path: "/auth/sign-up-success",
  })
}

export { default } from "./sign-up-success-client"
