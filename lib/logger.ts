type JsonPrimitive = string | number | boolean | null

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type LogLevel = "info" | "warn" | "error"

type LogMeta = Record<string, unknown>

const SENSITIVE_KEY = /(authorization|cookie|set-cookie|password|secret|token|api[_-]?key|signature|jwt)/i
const isDev = process.env.NODE_ENV === "development"

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  )
}

function toSafeJson(value: unknown, depth = 0): JsonValue {
  if (value == null) return null
  if (typeof value === "string") {
    return value.length > 500 ? `${value.slice(0, 500)}…` : value
  }
  if (typeof value === "number" || typeof value === "boolean") return value

  if (value instanceof Date) return value.toISOString()

  if (Array.isArray(value)) {
    if (depth >= 3) return `[array:${value.length}]`
    return value.slice(0, 50).map((v) => toSafeJson(v, depth + 1))
  }

  if (isPlainObject(value)) {
    if (depth >= 3) return "[object]"

    const entries = Object.entries(value).slice(0, 50)
    const out: Record<string, JsonValue> = {}
    for (const [k, v] of entries) {
      out[k] = SENSITIVE_KEY.test(k) ? "[redacted]" : toSafeJson(v, depth + 1)
    }
    return out
  }

  return Object.prototype.toString.call(value)
}

function emit(level: LogLevel, payload: Record<string, JsonValue>) {
  const line = JSON.stringify(payload)
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else if (typeof process !== "undefined" && typeof process.stdout?.write === "function") process.stdout.write(`${line}\n`)
  else console.warn(line)
}

function wrapMeta(meta: unknown): Record<string, unknown> | undefined {
  if (meta === undefined) return undefined
  return { data: meta }
}

export function logEvent(level: LogLevel, event: string, meta?: LogMeta) {
  emit(level, {
    ts: new Date().toISOString(),
    level,
    event,
    ...(meta ? { meta: toSafeJson(meta) } : {}),
  })
}

export function logError(event: string, err: unknown, meta?: LogMeta) {
  let errorPayload: Record<string, JsonValue>

  if (err instanceof Error) {
    errorPayload = { name: err.name, message: err.message }
  } else if (isPlainObject(err)) {
    const record = err as Record<string, unknown>

    const message =
      typeof record.message === "string"
        ? record.message
        : typeof record.error === "string"
          ? record.error
          : "[object Object]"

    const code = typeof record.code === "string" || typeof record.code === "number" ? String(record.code) : undefined
    const status = typeof record.status === "number" ? record.status : undefined
    const details = typeof record.details === "string" ? record.details : undefined
    const hint = typeof record.hint === "string" ? record.hint : undefined

    errorPayload = {
      name: "object",
      message,
      ...(code ? { code } : {}),
      ...(status ? { status } : {}),
      ...(details ? { details } : {}),
      ...(hint ? { hint } : {}),
      data: toSafeJson(err),
    }
  } else {
    errorPayload = { name: typeof err, message: String(err) }
  }

  emit("error", {
    ts: new Date().toISOString(),
    level: "error",
    event,
    error: errorPayload,
    ...(meta ? { meta: toSafeJson(meta) } : {}),
  })
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (!isDev) return
    logEvent("info", message, { debug: true, ...(wrapMeta(meta) ?? {}) })
  },
  info: (message: string, meta?: unknown) => {
    logEvent("info", message, wrapMeta(meta))
  },
  warn: (message: string, meta?: unknown) => {
    logEvent("warn", message, wrapMeta(meta))
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    if (error == null) {
      logEvent("error", message, meta)
      return
    }
    logError(message, error, meta)
  },
}
