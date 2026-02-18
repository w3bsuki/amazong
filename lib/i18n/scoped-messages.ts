import { getMessages } from "next-intl/server"
import type { AbstractIntlMessages } from "next-intl"

type MessagePrimitive = string | number | boolean | null
type MessageValue = MessagePrimitive | MessageMap | MessageValue[]
interface MessageMap {
  [key: string]: MessageValue | undefined
}

export const ROOT_INTL_NAMESPACES = [
  "Common",
  "Navigation",
  "Header",
  "Sidebar",
  "SidebarMenu",
  "LocaleSwitcher",
  "SearchOverlay",
  "CartDropdown",
  "MessagesDropdown",
  "WishlistDropdown",
  "NotificationsDropdown",
  "CategoryDrawer",
  "Drawers",
  "Messages",
  "Auth",
  "AuthDrawer",
  "Account.header",
  "AccountDrawer",
  "NavUser",
  "Product",
  "ProductModal",
  "ProfilePage",
  "Wishlist",
  "Footer",
  "GeoWelcome",
  "GuestSellCTA",
  "Cookies",
] as const

export const MAIN_ROUTE_INTL_NAMESPACES = [
  "Breadcrumbs",
  "Cart",
  "CartPage",
  "Categories",
  "CustomerService",
  "Errors",
  "FilterHub",
  "Freshness",
  "Home.mobile",
  "Home.mobile.v4",
  "ProductFeed",
  "SaveSearch",
  "SearchFilters",
  "Seller",
  "SellersDirectory",
  "SellersDirectory.empty",
  "TabbedProductFeed",
  "ViewMode",
  "seller.payouts",
] as const

export const USERNAME_ROUTE_INTL_NAMESPACES = [
  "Cart",
  "Errors",
  "Freshness",
  "ProductSocialProof",
  "ProfileError",
  "ProfileSettings",
  "Reviews",
  "Seller",
  "SellerVerification",
] as const

export type IntlNamespace =
  | (typeof ROOT_INTL_NAMESPACES)[number]
  | (typeof MAIN_ROUTE_INTL_NAMESPACES)[number]
  | (typeof USERNAME_ROUTE_INTL_NAMESPACES)[number]
  | string

const localeMessagesCache = new Map<string, Promise<MessageMap>>()

function getLocaleMessages(locale: string): Promise<MessageMap> {
  const cachedMessages = localeMessagesCache.get(locale)
  if (cachedMessages) {
    return cachedMessages
  }

  const messagesPromise = getMessages({ locale }).then((messages) => messages as MessageMap)
  localeMessagesCache.set(locale, messagesPromise)
  return messagesPromise
}

function isMessageMap(value: MessageValue | undefined): value is MessageMap {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function cloneMessageValue<T extends MessageValue>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item: MessageValue) => cloneMessageValue(item)) as T
  }

  if (isMessageMap(value)) {
    const clone: MessageMap = {}
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === "undefined") continue
      clone[key] = cloneMessageValue(entry)
    }
    return clone as T
  }

  return value
}

function mergeMessageMaps(target: MessageMap, source: MessageMap): MessageMap {
  for (const [key, sourceValue] of Object.entries(source)) {
    if (typeof sourceValue === "undefined") continue
    const targetValue = target[key]

    if (isMessageMap(targetValue) && isMessageMap(sourceValue)) {
      mergeMessageMaps(targetValue, sourceValue)
      continue
    }

    target[key] = cloneMessageValue(sourceValue)
  }

  return target
}

function readNamespaceValue(messages: MessageMap, namespacePath: string[]): MessageValue | undefined {
  let current: MessageValue | undefined = messages

  for (const part of namespacePath) {
    if (!isMessageMap(current)) return undefined
    current = current[part]
    if (typeof current === "undefined") return undefined
  }

  return current
}

function assignNamespaceValue(target: MessageMap, namespacePath: string[], value: MessageValue) {
  let current: MessageMap = target

  for (let index = 0; index < namespacePath.length - 1; index += 1) {
    const part = namespacePath[index]
    if (!part) continue
    const next = current[part]
    if (!isMessageMap(next)) {
      current[part] = {}
    }
    current = current[part] as MessageMap
  }

  const leaf = namespacePath[namespacePath.length - 1]
  if (!leaf) return
  const existing = current[leaf]
  const incoming = cloneMessageValue(value)

  if (isMessageMap(existing) && isMessageMap(incoming)) {
    current[leaf] = mergeMessageMaps(existing, incoming)
    return
  }

  current[leaf] = incoming
}

export async function getScopedMessages(
  locale: string,
  namespaces: readonly IntlNamespace[]
): Promise<AbstractIntlMessages> {
  const localeMessages = await getLocaleMessages(locale)
  const scopedMessages: MessageMap = {}

  for (const namespace of namespaces) {
    const path = String(namespace)
      .split(".")
      .filter((part) => part.length > 0)

    if (path.length === 0) continue

    const value = readNamespaceValue(localeMessages, path)
    if (typeof value === "undefined") continue

    assignNamespaceValue(scopedMessages, path, value)
  }

  return scopedMessages as AbstractIntlMessages
}

export async function getAllMessages(locale: string): Promise<AbstractIntlMessages> {
  return (await getLocaleMessages(locale)) as AbstractIntlMessages
}
