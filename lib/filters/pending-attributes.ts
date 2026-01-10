export type PendingAttributeValues = Record<string, string[]>

export function setPendingAttributeValues(
  prev: PendingAttributeValues,
  attrName: string,
  values: string[]
): PendingAttributeValues {
  const next = { ...prev }

  if (values.length === 0) {
    delete next[attrName]
  } else {
    next[attrName] = values
  }

  return next
}
