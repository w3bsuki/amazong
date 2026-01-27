import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Table>
        <TableCaption>Recent orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#10241</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell className="text-right">$145.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#10240</TableCell>
            <TableCell>Shipped</TableCell>
            <TableCell className="text-right">$89.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#10239</TableCell>
            <TableCell>Processing</TableCell>
            <TableCell className="text-right">$59.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}
