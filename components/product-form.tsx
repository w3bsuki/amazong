"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function ProductForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const imageUrl = formData.get("image_url") as string
    const product = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      stock: Number.parseInt(formData.get("stock") as string),
      images: imageUrl ? [imageUrl] : [], // Use images array instead of image_url
      seller_id: userId,
    }

    const supabase = createClient()
    const { error: uploadError } = await supabase.from("products").insert(product)

    if (uploadError) {
      setError(uploadError.message)
    } else {
      router.push("/")
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-bold text-sm">
          Product Title
        </Label>
        <Input id="title" name="title" required className="rounded-md focus-visible:ring-brand-warning" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-bold text-sm">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="rounded-md min-h-[100px] focus-visible:ring-brand-warning"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="font-bold text-sm">
            Price ($)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="rounded-md focus-visible:ring-brand-warning"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="font-bold text-sm">
            Stock Quantity
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="1"
            required
            defaultValue="1"
            className="rounded-md focus-visible:ring-brand-warning"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-bold text-sm">
          Category
        </Label>
        <Select name="category" required>
          <SelectTrigger className="rounded-md focus:ring-brand-warning">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="home">Home & Kitchen</SelectItem>
            <SelectItem value="toys">Toys & Games</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="font-bold text-sm">
          Image URL
        </Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
          className="rounded-md focus-visible:ring-brand-warning"
        />
        <p className="text-xs text-muted-foreground">For demo purposes, paste a public image URL</p>
      </div>

      {error && <div className="text-destructive text-sm font-bold">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand hover:bg-brand/90 text-foreground border-none rounded font-normal"
      >
        {isLoading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  )
}
