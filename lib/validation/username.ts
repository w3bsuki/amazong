import { z } from "zod"

export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "support",
  "help",
  "info",
  "contact",
  "treido",
  "store",
  "shop",
  "seller",
  "buyer",
  "user",
  "users",
  "account",
  "settings",
  "profile",
  "members",
  "member",
  "api",
  "auth",
  "login",
  "signup",
  "register",
  "logout",
  "signout",
  "home",
  "index",
  "about",
  "terms",
  "privacy",
  "legal",
  "search",
  "explore",
  "discover",
  "trending",
  "popular",
  "checkout",
  "cart",
  "order",
  "orders",
  "payment",
  "payments",
  "sell",
  "selling",
  "buy",
  "buying",
  "deals",
  "offers",
  "messages",
  "notifications",
  "inbox",
  "outbox",
  "test",
  "demo",
  "example",
  "null",
  "undefined",
  "root",
]

type UsernameMessages = {
  min: string
  max: string
  start: string
  charset: string
  noConsecutiveUnderscores: string
  noTrailingUnderscore: string
}

export function createUsernameSchema(messages: UsernameMessages) {
  return z
    .string()
    .min(3, { message: messages.min })
    .max(30, { message: messages.max })
    .regex(/^[a-z0-9]/, { message: messages.start })
    .regex(/^[a-z0-9_]+$/, { message: messages.charset })
    .refine((val) => !val.includes("__"), {
      message: messages.noConsecutiveUnderscores,
    })
    .refine((val) => !val.endsWith("_"), {
      message: messages.noTrailingUnderscore,
    })
}
