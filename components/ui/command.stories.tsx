import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Electronics</CommandItem>
            <CommandItem>Fashion</CommandItem>
            <CommandItem>Home & Kitchen</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>
              Create listing <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Open cart <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}
