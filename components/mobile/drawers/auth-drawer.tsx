"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { CircleCheck as CheckCircle } from "lucide-react";

import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

import {
  DrawerBody,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { LoginFormBody } from "@/components/auth/login-form-body"
import { SignUpFormBody } from "@/components/auth/sign-up-form-body"
import { DrawerShell } from "@/components/shared/drawer-shell"
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
  const { openAccountAfterAuthClose } = useDrawer()

  const [didSignUpSucceed, setDidSignUpSucceed] = useState(false)
  const loginTabRef = useRef<HTMLButtonElement | null>(null)
  const signUpTabRef = useRef<HTMLButtonElement | null>(null)

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
    openAccountAfterAuthClose()
  }, [openAccountAfterAuthClose, refreshSession, router])

  const handleSignUpSuccess = useCallback(() => {
    setDidSignUpSucceed(true)
  }, [])

  const isLoginMode = mode === "login"
  const focusModeTab = useCallback((targetMode: AuthDrawerMode) => {
    if (targetMode === "signup") {
      signUpTabRef.current?.focus()
      return
    }
    loginTabRef.current?.focus()
  }, [])

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      let nextMode: AuthDrawerMode | null = null

      if (event.key === "ArrowRight") {
        nextMode = isLoginMode ? "signup" : "login"
      } else if (event.key === "ArrowLeft") {
        nextMode = isLoginMode ? "signup" : "login"
      } else if (event.key === "Home") {
        nextMode = "login"
      } else if (event.key === "End") {
        nextMode = "signup"
      }

      if (!nextMode) return

      event.preventDefault()
      handleSwitchMode(nextMode)
      focusModeTab(nextMode)
    },
    [focusModeTab, handleSwitchMode, isLoginMode]
  )

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={tDrawer("title")}
      closeLabel={tDrawers("close")}
      description={tDrawer("description")}
      contentClassName="max-h-dialog rounded-t-2xl"
      headerClassName="border-b border-border-subtle px-inset py-2.5 text-left"
      descriptionClassName="max-w-sm"
      closeButtonClassName="text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active focus-visible:ring-2 focus-visible:ring-focus-ring motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)"
      dataTestId="mobile-auth-drawer"
      headerExtra={
        !didSignUpSucceed ? (
          <div
            className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-border-subtle bg-surface-subtle p-1"
            role="tablist"
            aria-label={tDrawer("tabsLabel")}
          >
            <button
              ref={loginTabRef}
              id="auth-drawer-tab-login"
              type="button"
              role="tab"
              aria-selected={isLoginMode}
              aria-controls="auth-drawer-panel-login"
              tabIndex={isLoginMode ? 0 : -1}
              className={cn(
                "min-h-(--spacing-touch-md) rounded-lg px-3 text-sm font-medium tap-transparent active:bg-active motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                isLoginMode
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-hover hover:text-foreground"
              )}
              onKeyDown={handleTabKeyDown}
              onClick={() => handleSwitchMode("login")}
            >
              {tAuth("signIn")}
            </button>
            <button
              ref={signUpTabRef}
              id="auth-drawer-tab-signup"
              type="button"
              role="tab"
              aria-selected={!isLoginMode}
              aria-controls="auth-drawer-panel-signup"
              tabIndex={!isLoginMode ? 0 : -1}
              className={cn(
                "min-h-(--spacing-touch-md) rounded-lg px-3 text-sm font-medium tap-transparent active:bg-active motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                !isLoginMode
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-hover hover:text-foreground"
              )}
              onKeyDown={handleTabKeyDown}
              onClick={() => handleSwitchMode("signup")}
            >
              {tAuth("signUp")}
            </button>
          </div>
        ) : null
      }
    >

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
                <CheckCircle size={26} />
              </span>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">{tAuth("checkYourEmail")}</p>
                <p className="text-sm text-muted-foreground">{tAuth("signUpSuccessDescription")}</p>
              </div>
              <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
                <Button
                  type="button"
                  size="primary"
                  className="w-full"
                  onClick={() => handleSwitchMode("login")}
                >
                  {tAuth("goToSignIn")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={handleClose}
                >
                  {tDrawer("continueBrowsing")}
                </Button>
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
    </DrawerShell>
  )
}
