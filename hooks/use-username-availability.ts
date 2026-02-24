"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useUsernameAvailability(
  username: string,
  options?: { debounceMs?: number; minLength?: number },
) {
  const debounceMs = options?.debounceMs ?? 500
  const minLength = options?.minLength ?? 3

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    setIsCheckingUsername(false)
    setUsernameAvailable(null)

    const cleaned = username.trim().toLowerCase()
    if (!cleaned || cleaned.length < minLength) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      if (requestId !== requestIdRef.current) return

      setIsCheckingUsername(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", cleaned)
          .maybeSingle()

        if (requestId !== requestIdRef.current) return

        if (error) {
          setUsernameAvailable(null)
          return
        }

        setUsernameAvailable(!data)
      } catch {
        if (requestId !== requestIdRef.current) return
        setUsernameAvailable(null)
      } finally {
        if (requestId === requestIdRef.current) {
          setIsCheckingUsername(false)
        }
      }
    }, debounceMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [debounceMs, minLength, username])

  return { isCheckingUsername, usernameAvailable }
}

