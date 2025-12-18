"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import {
  Storefront,
  Package,
  CurrencyDollar,
  Eye,
  Plus,
  Pencil,
  Trash,

  SpinnerGap,
  Warning,
  ShoppingCart,

  Star,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Seller {
  id: string;
  store_name: string;
  description?: string | null;
  verified?: boolean | null;
  created_at?: string;
  [key: string]: unknown; // Allow profile fields
}

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  images: string[];
  created_at: string;
  category?: { name: string } | null;
}

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("Please sign in to access the seller dashboard");
          setLoading(false);
          return;
        }

        // Fetch profile info
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profileData || !profileData.username) {
          setError("You need to set up a username to access the seller dashboard");
          setLoading(false);
          return;
        }

        // Map profile to seller format for compatibility
        setSeller({
          ...profileData,
          store_name: profileData.display_name || profileData.business_name || profileData.username,
        });

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`
            id,
            title,
            price,
            stock,
            images,
            created_at,
            category:categories(name)
          `)
          .eq("seller_id", session.user.id)
          .order("created_at", { ascending: false });

        if (!productsError && productsData) {
          setProducts(productsData as Product[]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        fetchData();
      } else {
        setLoading(false);
        setError("Please sign in to access the seller dashboard");
      }
    });

    // Initial fetch
    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpinnerGap className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Warning className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sell">Become a Seller</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!seller) return null;

  const totalRevenue = products.reduce((sum, p) => sum + Number(p.price) * (10 - p.stock), 0); // Mock calculation
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Storefront weight="fill" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{seller.store_name}</h1>
              <div className="flex items-center gap-2">
                {seller.verified && (
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <Star weight="fill" className="w-3 h-3 mr-1" />
                    Verified Seller
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  Member since {seller.created_at ? new Date(seller.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/sell">
            <Plus weight="bold" className="w-4 h-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package weight="duotone" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CurrencyDollar weight="duotone" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <ShoppingCart weight="duotone" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Warning weight="duotone" className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>Manage your product listings</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/sell">
                <Plus weight="bold" className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package weight="duotone" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Start by creating your first product listing</p>
              <Button asChild>
                <Link href="/sell">
                  <Plus weight="bold" className="w-4 h-4 mr-2" />
                  Create Listing
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.images?.[0] && product.images[0].startsWith('http') ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>${Number(product.price).toFixed(2)}</span>
                      <span>•</span>
                      <span className={product.stock < 5 ? "text-amber-600 font-medium" : ""}>
                        {product.stock} in stock
                      </span>
                      {product.category && (
                        <>
                          <span>•</span>
                          <span>{product.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/product/${product.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
