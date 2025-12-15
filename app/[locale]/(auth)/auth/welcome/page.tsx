"use client"

import { Link } from "@/i18n/routing"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Confetti, 
  ShoppingBag, 
  Storefront, 
  UserCircle,
  ArrowRight,
  SpinnerGap,
  CheckCircle
} from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface UserProfile {
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export default function WelcomePage() {
  const _t = useTranslations('Auth') // Available for future i18n
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Not logged in, redirect to login
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", user.id)
        .single()

      setProfile(profileData)
      setIsLoading(false)
    }

    fetchProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <SpinnerGap className="size-8 text-blue-500 animate-spin" weight="bold" />
      </div>
    )
  }

  const displayName = profile?.display_name || profile?.username || "there"

  return (
    <div className="min-h-svh flex items-center justify-center bg-linear-to-b from-blue-50 via-white to-white p-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Header with confetti */}
          <div className="relative bg-linear-to-r from-blue-500 to-blue-600 px-6 py-8 text-center text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
              <Confetti className="absolute top-4 right-4 size-8 text-yellow-300 opacity-80" weight="fill" />
              <Confetti className="absolute bottom-4 left-4 size-6 text-green-300 opacity-80" weight="fill" />
            </div>
            
            <div className="relative">
              <div className="size-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-10 text-white" weight="fill" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome, {displayName}! 🎉
              </h1>
              <p className="text-blue-100 text-sm">
                Your account has been created successfully
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              What would you like to do?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              You can browse products, start selling, or complete your profile
            </p>

            {/* Action Cards */}
            <div className="space-y-3">
              {/* Browse Products */}
              <Link href="/" className="block">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group"
                >
                  <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="size-6 text-blue-600" weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">Browse Products</h3>
                    <p className="text-sm text-gray-500">Discover amazing deals</p>
                  </div>
                  <ArrowRight className="size-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </motion.div>
              </Link>

              {/* Start Selling */}
              <Link href="/sell" className="block">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl border border-amber-200 transition-colors group"
                >
                  <div className="size-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <Storefront className="size-6 text-white" weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">Start Selling</h3>
                    <p className="text-sm text-gray-600">List your first product</p>
                  </div>
                  <ArrowRight className="size-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
                </motion.div>
              </Link>

              {/* Complete Profile */}
              <Link href="/account/profile" className="block">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group"
                >
                  <div className="size-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <UserCircle className="size-6 text-purple-600" weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">Complete Profile</h3>
                    <p className="text-sm text-gray-500">Add avatar, bio & more</p>
                  </div>
                  <ArrowRight className="size-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </motion.div>
              </Link>
            </div>

            {/* Username Info */}
            {profile?.username && (
              <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-700 text-center">
                  Your profile is at <span className="font-medium">amazong.com/u/{profile.username}</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Need help? Visit our <Link href="/help" className="text-blue-600 hover:underline">Help Center</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
