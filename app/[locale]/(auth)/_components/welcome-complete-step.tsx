"use client"

import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { ArrowRight, Check, CircleUser as UserCircle, ShoppingBag, Store as Storefront } from "lucide-react"

export function WelcomeCompleteStep({ username }: { username: string | null | undefined }) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="size-20 bg-selected rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="size-10 text-primary" />
        </motion.div>

        <h2 className="text-xl font-semibold text-foreground mb-2">You&apos;re all set! 🎉</h2>
        <p className="text-muted-foreground mb-6">Your profile is ready. What would you like to do next?</p>

        <div className="space-y-3 text-left">
          <Link href="/" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
            >
              <div className="size-12 bg-selected rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">Browse Products</h3>
                <p className="text-sm text-muted-foreground">Discover amazing deals</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          </Link>

          <Link href="/sell" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
            >
              <div className="size-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <Storefront className="size-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">Start Selling</h3>
                <p className="text-sm text-muted-foreground">List your first product</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          </Link>

          <Link href={`/${username}`} className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
            >
              <div className="size-12 bg-selected rounded-xl flex items-center justify-center shrink-0">
                <UserCircle className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">View Your Profile</h3>
                <p className="text-sm text-muted-foreground">/{username}</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

