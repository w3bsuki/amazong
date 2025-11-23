"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SellPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form States
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")

  const [productTitle, setProductTitle] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productImage, setProductImage] = useState("")
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    checkUser()
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?next=/sell")
        return
      }
      setUser(user)

      // Check if user is a seller
      const { data: sellerData } = await supabase
        .from("sellers")
        .select("*")
        .eq("id", user.id)
        .single()

      if (sellerData) {
        setSeller(sellerData)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // 1. Ensure profile exists
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          role: 'seller'
        })

      if (profileError) throw profileError

      // 2. Create seller record
      const { error: sellerError } = await supabase
        .from("sellers")
        .insert({
          id: user.id,
          store_name: storeName,
          description: storeDescription
        })

      if (sellerError) throw sellerError

      toast.success("Store created successfully!")
      setSeller({ id: user.id, store_name: storeName })
    } catch (error: any) {
      toast.error(error.message || "Failed to create store")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Get category ID (mock for now, ideally fetch from DB)
      // For MVP we will just use a hardcoded UUID if we can't find one, or insert one.
      // Actually, let's fetch categories first or just use a known one.
      // For simplicity, we'll just insert without category_id if it's optional, or fetch one.
      // The schema says category_id is optional.

      const { error } = await supabase
        .from("products")
        .insert({
          seller_id: user.id,
          title: productTitle,
          description: productDescription,
          price: parseFloat(productPrice),
          images: [productImage],
          category_id: productCategory || null,
        })

      if (error) throw error

      toast.success("Product listed successfully!")
      setProductTitle("")
      setProductDescription("")
      setProductPrice("")
      setProductImage("")
      router.push("/search?q=" + encodeURIComponent(productTitle))
    } catch (error: any) {
      toast.error(error.message || "Failed to list product")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!seller) {
    return (
      <div className="container max-w-lg mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Start Selling on Amazon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  placeholder="My Awesome Store"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDesc">Description</Label>
                <Textarea
                  id="storeDesc"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Tell us about your store..."
                />
              </div>
              <Button type="submit" className="w-full bg-[#f08804] hover:bg-[#d67904] text-black" disabled={submitting}>
                {submitting ? "Creating..." : "Create Store"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Product</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                required
                placeholder="e.g. Vintage Vase (ВАЗА)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={productCategory} onValueChange={setProductCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
                placeholder="Product details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                required
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500">For MVP, please provide a direct image URL.</p>
            </div>

            <Button type="submit" className="w-full bg-[#f08804] hover:bg-[#d67904] text-black" disabled={submitting}>
              {submitting ? "Listing Product..." : "List Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
