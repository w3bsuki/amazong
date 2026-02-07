"use server"

import {
  checkUsernameAvailability as sharedCheckUsernameAvailability,
  login as sharedLogin,
  loginInPlace as sharedLoginInPlace,
  requestPasswordReset as sharedRequestPasswordReset,
  signUp as sharedSignUp,
  signUpInPlace as sharedSignUpInPlace,
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

export async function loginInPlace(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedLoginInPlace(locale, prevState, formData)
}

export async function signUp(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedSignUp(locale, prevState, formData)
}

export async function signUpInPlace(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedSignUpInPlace(locale, prevState, formData)
}

export async function requestPasswordReset(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return sharedRequestPasswordReset(locale, prevState, formData)
}
