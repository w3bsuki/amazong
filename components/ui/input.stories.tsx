/**
 * Input Stories - Your REAL production input component
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Input } from "./input"
import { Search as SearchIcon, Mail, Lock, Eye } from "lucide-react"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number", "tel", "url"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// BASIC
// =============================================================================

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
}

// =============================================================================
// INPUT TYPES
// =============================================================================

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
}

export const SearchType: Story = {
  args: {
    type: "search",
    placeholder: "Search products...",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
    min: 0,
    max: 100,
  },
}

// =============================================================================
// STATES
// =============================================================================

export const Invalid: Story = {
  args: {
    placeholder: "Invalid input",
    "aria-invalid": true,
    defaultValue: "invalid@",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email address
      </label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <Input id="username" placeholder="johndoe" />
      <p className="text-sm text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="email-error" className="text-sm font-medium">
        Email
      </label>
      <Input
        id="email-error"
        type="email"
        placeholder="you@example.com"
        aria-invalid
        defaultValue="invalid-email"
      />
      <p className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
}

// =============================================================================
// WITH ICONS (using wrapper pattern)
// =============================================================================

export const WithIconLeft: Story = {
  render: () => (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input className="pl-10" placeholder="Search..." />
    </div>
  ),
}

export const WithIconRight: Story = {
  render: () => (
    <div className="relative">
      <Input type="password" className="pr-10" placeholder="Password" />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <Eye className="size-4" />
      </button>
    </div>
  ),
}

export const SearchInput: Story = {
  render: () => (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="search"
        className="pl-10"
        placeholder="Търсене в продукти, марки и още..."
      />
    </div>
  ),
}

// =============================================================================
// FORM EXAMPLES
// =============================================================================

export const LoginForm: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="login-email" type="email" className="pl-10" placeholder="you@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="login-password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="login-password" type="password" className="pl-10" placeholder="••••••••" />
        </div>
      </div>
    </div>
  ),
}
