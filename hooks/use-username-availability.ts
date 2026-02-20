"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useUsernameAvailability(
  username: string,
  options?: { debounceMs?: number; minLength?: number },
) {
  const debounceMs = options?.debounceMs ?? 500
  const minLength = options?.minLength ?? 3

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const timeoutId = setTimeout(async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < minLength) {
        if (!cancelled) setUsernameAvailable(null)
        return
      }

      if (!cancelled) setIsCheckingUsername(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", cleaned)
          .maybeSingle()

        if (!cancelled) setUsernameAvailable(!data)
      } finally {
        if (!cancelled) setIsCheckingUsername(false)
      }
    }, debounceMs)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [debounceMs, minLength, username])

  return { isCheckingUsername, usernameAvailable }
}

