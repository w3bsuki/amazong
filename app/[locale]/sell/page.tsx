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
import { Loader2, Store } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { Breadcrumb } from "@/components/breadcrumb"

interface UploadedImage {
  url: string
  thumbnailUrl: string
}

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
  const [productSubcategory, setProductSubcategory] = useState("")
  const [productTags, setProductTags] = useState("")
  const [productImages, setProductImages] = useState<UploadedImage[]>([])
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
    console.log("Checking user...")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("User found:", user?.id)
      if (!user) {
        console.log("No user, redirecting...")
        router.push("/auth/login?next=/sell")
        return
      }
      setUser(user)

      // Check if user is a seller
      const { data: sellerData, error } = await supabase
        .from("sellers")
        .select("*")
        .eq("id", user.id)
        .single()

      console.log("Seller data:", sellerData, "Error:", error)

      if (sellerData) {
        setSeller(sellerData)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
      console.log("Loading set to false")
    }
  }

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName,
          description: storeDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create store")
      }

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
    
    if (productImages.length === 0) {
      toast.error("Please upload at least one product image")
      return
    }
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: productTitle,
          description: productDescription,
          price: productPrice,
          categoryId: productCategory,
          subcategory: productSubcategory,
          tags: productTags ? productTags.split(',').map(t => t.trim()).filter(t => t) : [],
          images: productImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to list product")
      }

      toast.success("Product listed successfully!")
      setProductTitle("")
      setProductDescription("")
      setProductPrice("")
      setProductImages([])
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
        <Breadcrumb items={[{ label: 'Sell on Amazon', icon: <Store className="h-3.5 w-3.5" /> }]} />
        
        <Card className="mt-4">
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
      <Breadcrumb items={[{ label: 'Sell on Amazon', icon: <Store className="h-3.5 w-3.5" /> }]} />
      
      <h1 className="text-3xl font-bold mb-6 mt-4">Add a New Product</h1>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={productSubcategory}
                  onChange={(e) => setProductSubcategory(e.target.value)}
                  placeholder="e.g. Vase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={productTags}
                  onChange={(e) => setProductTags(e.target.value)}
                  placeholder="e.g. flower, glass, decor"
                />
              </div>
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

            <ImageUpload 
              onImagesChange={setProductImages}
              maxImages={5}
              maxSizeMB={5}
            />

            <Button type="submit" className="w-full bg-[#f08804] hover:bg-[#d67904] text-black" disabled={submitting}>
              {submitting ? "Listing Product..." : "List Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
