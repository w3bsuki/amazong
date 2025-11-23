"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export function WelcomeToast() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get("welcome") === "true") {
            toast.success("Welcome to Amazon! Your account has been created.")

            // Remove the query param to prevent toast on refresh
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("welcome")
            router.replace(`/?${newParams.toString()}`, { scroll: false })
        }
    }, [searchParams, router])

    return null
}
