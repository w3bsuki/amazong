interface ToggleOptionSelectionArgs {
  selected: string[]
  option: string
  multiSelect: boolean
}

export function toggleOptionSelection({
  selected,
  option,
  multiSelect,
}: ToggleOptionSelectionArgs): string[] {
  if (!multiSelect) {
    return selected.includes(option) ? [] : [option]
  }

  return selected.includes(option)
    ? selected.filter((v) => v !== option)
    : [...selected, option]
}

