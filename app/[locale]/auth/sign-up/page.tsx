"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/?welcome=true`,
          data: {
            full_name: name,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white dark:bg-zinc-900">
      <div className="w-full max-w-[350px]">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold tracking-tighter">amazon</span>
          </div>
          <Card className="rounded-sm border-zinc-300 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-normal">Create account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="font-bold text-xs">
                      Your name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="First and last name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-8 rounded-[3px] border-zinc-400 focus-visible:ring-1 focus-visible:ring-[#e77600] focus-visible:border-[#e77600]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 rounded-[3px] border-zinc-400 focus-visible:ring-1 focus-visible:ring-[#e77600] focus-visible:border-[#e77600]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="font-bold text-xs">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 rounded-[3px] border-zinc-400 focus-visible:ring-1 focus-visible:ring-[#e77600] focus-visible:border-[#e77600]"
                    />
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <span className="text-[#007185] font-bold">i</span> Passwords must be at least 6 characters.
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="font-bold text-xs">
                      Re-enter password
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-8 rounded-[3px] border-zinc-400 focus-visible:ring-1 focus-visible:ring-[#e77600] focus-visible:border-[#e77600]"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-[#f0c14b] hover:bg-[#f4d078] text-black border border-[#a88734] rounded-[3px] h-8 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] text-sm font-normal"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create your Amazon account"}
                  </Button>
                </div>

                <div className="mt-4 text-xs text-zinc-600">
                  By creating an account, you agree to Amazon's{" "}
                  <Link href="#" className="text-[#007185] hover:underline">
                    Conditions of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#007185] hover:underline">
                    Privacy Notice
                  </Link>
                  .
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <div className="text-xs">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-[#007185] hover:underline hover:text-[#c7511f]">
                      Sign in ›
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-8 text-xs text-[#007185]">
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              Conditions of Use
            </Link>
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              Privacy Notice
            </Link>
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              Help
            </Link>
          </div>
          <p className="text-xs text-zinc-500">© 1996-2024, Amazon.com, Inc. or its affiliates</p>
        </div>
      </div>
    </div>
  )
}
