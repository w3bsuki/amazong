import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role for this public endpoint to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CategoryAttribute {
  id: string;
  category_id: string;
  name: string;
  name_bg: string | null;
  attribute_type: string;
  is_required: boolean;
  is_filterable: boolean;
  options: string[] | null;
  options_bg: string[] | null;
  placeholder: string | null;
  placeholder_bg: string | null;
  validation_rules: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Category slug/ID is required" },
        { status: 400 }
      );
    }

    // First, try to find the category by slug or ID
    let categoryId = slug;
    
    // If slug doesn't look like a UUID, look up by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    if (!isUuid) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (categoryError || !category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      categoryId = category.id;
    }

    // Fetch attributes for this category
    const { data: attributes, error } = await supabase
      .from("category_attributes")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching category attributes:", error);
      return NextResponse.json(
        { error: "Failed to fetch category attributes" },
        { status: 500 }
      );
    }

    // Also fetch parent category attributes (if this category has a parent)
    const { data: category } = await supabase
      .from("categories")
      .select("parent_id")
      .eq("id", categoryId)
      .single();

    let parentAttributes: CategoryAttribute[] = [];

    if (category?.parent_id) {
      // Recursively get parent attributes
      const { data: parentAttrs } = await supabase
        .from("category_attributes")
        .select("*")
        .eq("category_id", category.parent_id)
        .order("sort_order", { ascending: true });

      if (parentAttrs) {
        parentAttributes = parentAttrs;
      }
    }

    // Merge attributes - category-specific attributes take precedence
    const attributeNames = new Set(attributes?.map(a => a.name) || []);
    const inheritedAttributes = parentAttributes.filter(
      (pa) => !attributeNames.has(pa.name)
    );

    const allAttributes = [...(attributes || []), ...inheritedAttributes];

    // Transform to cleaner format for frontend
    const formattedAttributes = allAttributes.map((attr: CategoryAttribute) => ({
      id: attr.id,
      name: attr.name,
      nameBg: attr.name_bg,
      type: attr.attribute_type,
      required: attr.is_required,
      filterable: attr.is_filterable,
      options: attr.options,
      optionsBg: attr.options_bg,
      placeholder: attr.placeholder,
      placeholderBg: attr.placeholder_bg,
      validationRules: attr.validation_rules,
      sortOrder: attr.sort_order,
    }));

    return NextResponse.json({
      categoryId,
      attributes: formattedAttributes,
      count: formattedAttributes.length,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
