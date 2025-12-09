"use client"

import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { cn } from "@/lib/utils"
import { getCategories, getSubcategories } from "../../_actions"
import { CaretRight, SpinnerGap } from "@phosphor-icons/react"

type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
}

export function CategoryStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { setValue, watch, formState: { errors } } = form
  const selectedCategoryId = watch("categoryId")
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([])

  useEffect(() => {
    loadRootCategories()
  }, [])

  const loadRootCategories = async () => {
    setLoading(true)
    const data = await getCategories()
    setCategories(data)
    setLoading(false)
  }

  const handleCategorySelect = async (category: Category) => {
    setLoading(true)
    const subs = await getSubcategories(category.id)
    
    if (subs && subs.length > 0) {
      // Has subcategories, drill down
      setBreadcrumbs([...breadcrumbs, category])
      setCategories(subs)
    } else {
      // Leaf category, select it
      setValue("categoryId", category.id, { shouldValidate: true })
    }
    setLoading(false)
  }

  const handleBreadcrumbClick = async (index: number) => {
    if (index === -1) {
      // Go to root
      setBreadcrumbs([])
      loadRootCategories()
    } else {
      // Go to specific level
      const targetCategory = breadcrumbs[index]
      const newBreadcrumbs = breadcrumbs.slice(0, index)
      setBreadcrumbs(newBreadcrumbs)
      
      setLoading(true)
      const subs = await getSubcategories(targetCategory.id)
      setCategories(subs)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Select a category</h2>
        <p className="text-sm text-gray-500">Choose the category that best fits your item.</p>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 text-sm">
        <button 
          onClick={() => handleBreadcrumbClick(-1)}
          className="text-gray-500 hover:text-gray-900 hover:underline"
        >
          All Categories
        </button>
        {breadcrumbs.map((cat, idx) => (
          <div key={cat.id} className="flex items-center gap-2">
            <CaretRight className="size-3 text-gray-400" />
            <button
              onClick={() => handleBreadcrumbClick(idx)}
              className="text-gray-500 hover:text-gray-900 hover:underline"
            >
              {cat.name}
            </button>
          </div>
        ))}
      </div>

      {/* Category List */}
      <div className="border rounded-sm divide-y max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <SpinnerGap className="size-6 animate-spin text-gray-400" />
          </div>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={cn(
                "w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-colors",
                selectedCategoryId === cat.id && "bg-blue-50 text-blue-700"
              )}
            >
              <span className="font-medium">{cat.name}</span>
              <CaretRight className="size-4 text-gray-400" />
            </button>
          ))
        )}
        {!loading && categories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No categories found.
          </div>
        )}
      </div>

      {selectedCategoryId && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-sm border border-emerald-100 text-sm">
          Selected Category ID: {selectedCategoryId}
        </div>
      )}

      {errors.categoryId && (
        <p className="text-sm text-red-600">{errors.categoryId.message}</p>
      )}
    </div>
  )
}
