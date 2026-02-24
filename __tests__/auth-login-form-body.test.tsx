import React from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { LoginFormBody } from "@/components/auth/login-form-body"

const authMessages: Record<string, string> = {
  email: "Email",
  emailPlaceholder: "you@example.com",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  forgotPassword: "Forgot your password?",
  rememberMe: "Remember me",
  signIn: "Sign in",
  signingIn: "Signing in...",
  createAccount: "Create your Treido account",
  newToTreido: "New to Treido?",
  byContinuing: "By continuing, you agree to Treido's",
  conditionsOfUse: "Conditions of Use",
  privacyNotice: "Privacy Notice",
  and: "and",
  showPassword: "Show password",
  hidePassword: "Hide password",
  invalidEmail: "Please enter a valid email address.",
}

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => authMessages[key] ?? key,
  useLocale: () => "en",
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe("LoginFormBody", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test("renders form-first section hierarchy", () => {
    const action = async (prevState: { fieldErrors?: Record<string, string> }) => prevState
    render(<LoginFormBody action={action} />)
    const form = screen.getAllByTestId("login-form")[0]
    const root = form.parentElement
    expect(root).not.toBeNull()

    const sectionOrder = [
      ...(root as HTMLElement).querySelectorAll(
        [
          "[data-testid='login-email-section']",
          "[data-testid='login-password-section']",
          "[data-testid='login-remember-section']",
          "[data-testid='login-submit-section']",
          "[data-testid='login-create-account-section']",
          "[data-testid='login-legal-section']",
        ].join(",")
      ),
    ].map((element) => element.getAttribute("data-testid"))

    expect(sectionOrder).toEqual([
      "login-email-section",
      "login-password-section",
      "login-remember-section",
      "login-submit-section",
      "login-create-account-section",
      "login-legal-section",
    ])
  })

  test("keeps submit disabled until email and password are valid", () => {
    const action = async (prevState: { fieldErrors?: Record<string, string> }) => prevState
    render(<LoginFormBody action={action} />)
    const form = screen.getAllByTestId("login-form")[0]

    const submitButton = within(form).getByRole("button", { name: "Sign in" })
    const emailInput = within(form).getByLabelText("Email")
    const passwordInput = within(form).getByLabelText("Password")

    expect(submitButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.change(passwordInput, { target: { value: "TestPassword123!" } })
    expect(submitButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: "valid@example.com" } })
    expect(submitButton).toBeEnabled()
  })
})
