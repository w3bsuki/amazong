import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { FilterCheckboxItem } from "@/components/shared/filters/controls/filter-checkbox-item"

afterEach(() => {
  cleanup()
})

function getCheckboxRow(label: RegExp): HTMLElement {
  const labelNode = screen.getByText(label)
  const row = labelNode.closest('[role="checkbox"]')
  if (!row) {
    throw new Error("Expected checkbox row")
  }
  return row as HTMLElement
}

describe("FilterCheckboxItem", () => {
  test("toggles on click and keyboard when unchecked", () => {
    const onCheckedChange = vi.fn()

    render(
      <FilterCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
        In stock
      </FilterCheckboxItem>
    )

    const row = getCheckboxRow(/in stock/i)
    expect(row).toHaveAttribute("aria-checked", "false")

    fireEvent.click(row)
    fireEvent.keyDown(row, { key: "Enter" })
    fireEvent.keyDown(row, { key: " " })

    expect(onCheckedChange).toHaveBeenCalledTimes(3)
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true)
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, true)
    expect(onCheckedChange).toHaveBeenNthCalledWith(3, true)
  })

  test("toggles off when checked", () => {
    const onCheckedChange = vi.fn()

    render(
      <FilterCheckboxItem checked onCheckedChange={onCheckedChange}>
        In stock
      </FilterCheckboxItem>
    )

    const row = getCheckboxRow(/in stock/i)
    expect(row).toHaveAttribute("aria-checked", "true")

    fireEvent.click(row)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  test("does not toggle when disabled", () => {
    const onCheckedChange = vi.fn()

    render(
      <FilterCheckboxItem checked={false} onCheckedChange={onCheckedChange} disabled>
        In stock
      </FilterCheckboxItem>
    )

    const row = getCheckboxRow(/in stock/i)
    expect(row).toHaveAttribute("aria-disabled", "true")
    expect(row).toHaveAttribute("tabindex", "-1")

    fireEvent.click(row)
    fireEvent.keyDown(row, { key: "Enter" })
    fireEvent.keyDown(row, { key: " " })

    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
