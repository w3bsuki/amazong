"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type PostgresChangesSpec = {
  channel: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
  schema?: "public"
  table: keyof Database["public"]["Tables"]
  filter?: string
}

type UseSupabasePostgresChangesOptions = {
  enabled: boolean
  specs: ReadonlyArray<PostgresChangesSpec>
  onChange?: () => void | Promise<void>
  onPayload?: (payload: unknown) => void | Promise<void>
  supabase?: ReturnType<typeof createClient>
}

function safeInvoke(task: () => void | Promise<void>) {
  try {
    const maybePromise = task()
    void Promise.resolve(maybePromise).catch(() => {})
  } catch {
    return
  }
}

export function useSupabasePostgresChanges({
  enabled,
  specs,
  onChange,
  onPayload,
  supabase: providedClient,
}: UseSupabasePostgresChangesOptions) {
  const onChangeRef = useRef(onChange)
  const onPayloadRef = useRef(onPayload)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onPayloadRef.current = onPayload
  }, [onPayload])

  useEffect(() => {
    if (!enabled || specs.length === 0) return

    const supabase = providedClient ?? createClient()
    const handleChange = (payload: unknown) => {
      if (onPayloadRef.current) {
        safeInvoke(() => onPayloadRef.current?.(payload))
      }
      if (onChangeRef.current) {
        safeInvoke(() => onChangeRef.current?.())
      }
    }

    const channels = specs.map((spec) => {
      const schema = spec.schema ?? "public"
      const baseFilter = {
        schema,
        table: spec.table,
        ...(spec.filter ? { filter: spec.filter } : {}),
      }

      const event = spec.event ?? "*"
      if (event === "INSERT") {
        return supabase.channel(spec.channel).on("postgres_changes", { ...baseFilter, event: "INSERT" }, handleChange).subscribe()
      }
      if (event === "UPDATE") {
        return supabase.channel(spec.channel).on("postgres_changes", { ...baseFilter, event: "UPDATE" }, handleChange).subscribe()
      }
      if (event === "DELETE") {
        return supabase.channel(spec.channel).on("postgres_changes", { ...baseFilter, event: "DELETE" }, handleChange).subscribe()
      }

      return supabase.channel(spec.channel).on("postgres_changes", { ...baseFilter, event: "*" }, handleChange).subscribe()
    })

    return () => {
      for (const channel of channels) {
        supabase.removeChannel(channel)
      }
    }
  }, [enabled, providedClient, specs])
}
