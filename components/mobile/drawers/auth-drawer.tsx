"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle, X } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { LoginFormBody } from "@/components/auth/login-form-body"
import { SignUpFormBody } from "@/components/auth/sign-up-form-body"
import {
  checkUsernameAvailability,
  loginInPlace,
  signUpInPlace,
} from "@/lib/auth/server-actions"
import { useDrawer, type AuthDrawerMode } from "@/components/providers/drawer-context"
import { useAuth } from "@/components/providers/auth-state-manager"
import { cn } from "@/lib/utils"

interface AuthDrawerProps {
  open: boolean
  mode: AuthDrawerMode
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: AuthDrawerMode) => void
}

export function AuthDrawer({ open, mode, onOpenChange, onModeChange }: AuthDrawerProps) {
  const locale = useLocale()
  const router = useRouter()
  const tAuth = useTranslations("Auth")
  const tDrawer = useTranslations("AuthDrawer")
  const tDrawers = useTranslations("Drawers")
  const { refreshSession } = useAuth()
  const { openAccount } = useDrawer()

  const [didSignUpSucceed, setDidSignUpSucceed] = useState(false)

  const boundLoginAction = useMemo(() => loginInPlace.bind(null, locale), [locale])
  const boundSignUpAction = useMemo(() => signUpInPlace.bind(null, locale), [locale])

  useEffect(() => {
    if (!open) {
      setDidSignUpSucceed(false)
    }
  }, [open])

  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleSwitchMode = useCallback(
    (nextMode: AuthDrawerMode) => {
      onModeChange(nextMode)
      if (nextMode !== "signup") {
        setDidSignUpSucceed(false)
      }
    },
    [onModeChange]
  )

  const handleLoginSuccess = useCallback(async () => {
    await refreshSession({ forceRetry: true })
    router.refresh()
    onOpenChange(false)
    window.setTimeout(() => {
      openAccount()
    }, 80)
  }, [onOpenChange, openAccount, refreshSession, router])

  const handleSignUpSuccess = useCallback(() => {
    setDidSignUpSucceed(true)
  }, [])

  const isLoginMode = mode === "login"

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-dialog rounded-t-2xl" data-testid="mobile-auth-drawer">
        <DrawerHeader className="border-b border-border-subtle px-inset py-2.5 text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-sm font-semibold">{tDrawer("title")}</DrawerTitle>
            <DrawerClose asChild>
              <IconButton
                aria-label={tDrawers("close")}
                variant="ghost"
                size="icon-compact"
                className="text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <X size={16} weight="bold" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="max-w-sm">{tDrawer("description")}</DrawerDescription>

          {!didSignUpSucceed && (
            <div
              className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-border-subtle bg-surface-subtle p-1"
              role="tablist"
              aria-label={tDrawer("tabsLabel")}
            >
              <button
                id="auth-drawer-tab-login"
                type="button"
                role="tab"
                aria-selected={isLoginMode}
                aria-controls="auth-drawer-panel-login"
                tabIndex={isLoginMode ? 0 : -1}
                className={cn(
                  "min-h-(--spacing-touch-md) rounded-lg px-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  isLoginMode
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground"
                )}
                onClick={() => handleSwitchMode("login")}
              >
                {tAuth("signIn")}
              </button>
              <button
                id="auth-drawer-tab-signup"
                type="button"
                role="tab"
                aria-selected={!isLoginMode}
                aria-controls="auth-drawer-panel-signup"
                tabIndex={!isLoginMode ? 0 : -1}
                className={cn(
                  "min-h-(--spacing-touch-md) rounded-lg px-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  !isLoginMode
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground"
                )}
                onClick={() => handleSwitchMode("signup")}
              >
                {tAuth("signUp")}
              </button>
            </div>
          )}
        </DrawerHeader>

        <DrawerBody className="px-inset py-3 pb-2">
          {isLoginMode ? (
            <div id="auth-drawer-panel-login" role="tabpanel" aria-labelledby="auth-drawer-tab-login">
              <LoginFormBody
                action={boundLoginAction}
                onSuccess={handleLoginSuccess}
                onSwitchToSignUp={() => handleSwitchMode("signup")}
                onNavigateAway={handleClose}
                showCreateAccountCta={false}
                showLegalText={false}
              />
            </div>
          ) : didSignUpSucceed ? (
            <div
              id="auth-drawer-panel-signup-success"
              className="flex flex-col items-center justify-center gap-3 py-8 text-center"
            >
              <span className="inline-flex size-(--control-primary) items-center justify-center rounded-full bg-primary-subtle text-primary">
                <CheckCircle size={26} weight="fill" />
              </span>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">{tAuth("checkYourEmail")}</p>
                <p className="text-sm text-muted-foreground">{tAuth("signUpSuccessDescription")}</p>
              </div>
            </div>
          ) : (
            <div id="auth-drawer-panel-signup" role="tabpanel" aria-labelledby="auth-drawer-tab-signup">
              <SignUpFormBody
                action={boundSignUpAction}
                checkUsernameAvailabilityAction={checkUsernameAvailability}
                onSuccess={handleSignUpSuccess}
                onSwitchToSignIn={() => handleSwitchMode("login")}
                onNavigateAway={handleClose}
                showSignInCta={false}
                showLegalText={false}
              />
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="border-t border-border-subtle px-inset py-3 pb-safe-max gap-2">
          {isLoginMode ? (
            <Button
              type="button"
              variant="outline"
              size="default"
              className="w-full"
              onClick={() => handleSwitchMode("signup")}
            >
              {tAuth("createAccount")}
            </Button>
          ) : didSignUpSucceed ? (
            <>
              <Button
                type="button"
                size="default"
                className="w-full"
                onClick={() => handleSwitchMode("login")}
              >
                {tAuth("goToSignIn")}
              </Button>
              <Button type="button" variant="outline" size="default" className="w-full" onClick={handleClose}>
                {tDrawer("continueBrowsing")}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="default"
              className="w-full"
              onClick={() => handleSwitchMode("login")}
            >
              {tAuth("signIn")}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
