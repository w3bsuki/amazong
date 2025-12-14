import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { ProfileContent } from "./profile-content"

interface ProfilePageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connection()
  const { locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, phone, shipping_region, country_code, role, created_at")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === "bg" ? "Профил" : "Profile"}</h1>
      <ProfileContent 
        locale={locale} 
        profile={profile || {
          id: user.id,
          email: user.email || "",
          full_name: null,
          avatar_url: null,
          phone: null,
          shipping_region: null,
          country_code: null,
          role: "buyer",
          created_at: user.created_at,
        }}
      />
    </div>
  )
}
