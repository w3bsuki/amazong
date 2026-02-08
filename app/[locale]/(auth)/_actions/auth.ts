"use server"

import {
  checkUsernameAvailability as sharedCheckUsernameAvailability,
  login as sharedLogin,
  requestPasswordReset as sharedRequestPasswordReset,
  signUp as sharedSignUp,
} from "@/lib/auth/server-actions"
import type { AuthActionState } from "@/lib/auth/server-actions"

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  return sharedCheckUsernameAvailability(username)
}

export async function login(
  locale: string,
  redirectPath: string | null | undefined,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedLogin(locale, redirectPath, prevState, formData)
}

export async function signUp(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedSignUp(locale, prevState, formData)
}

export async function requestPasswordReset(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedRequestPasswordReset(locale, prevState, formData)
}
