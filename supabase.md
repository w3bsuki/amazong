# Supabase Setup for Amazong

## 1. Project Connection
Your project is connected to the Supabase project:
- **Project URL:** `https://dhtzybnkvpimmomzwrce.supabase.co`
- **Project ID:** `dhtzybnkvpimmomzwrce`

## 2. Database Schema & Migrations
The project contains two migration files:
1. `scripts/migrations.sql`: A basic schema (likely the current one).
2. `supabase/schema.sql`: A **comprehensive, production-ready schema**.

**Recommendation:** Use `supabase/schema.sql`. It includes:
- **Full-Text Search:** Uses `tsvector` and `pg_trgm` for Amazon-like search capabilities.
- **Triggers:** Automatically updates the search index when a product is added.
- **Security:** Row Level Security (RLS) policies for buyers and sellers.
- **Advanced Tables:** Support for `reviews`, `categories`, and `sellers`.

### How to Apply the Schema
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce/editor).
2. Open the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql`.
4. Paste and run the SQL.

## 3. Search Indexing (How it works)
Just like Amazon, we need an index to make products searchable.
- **Amazon's Approach:** Uses a distributed search fleet (like OpenSearch). When a seller lists an item, it's added to a queue and indexed asynchronously (eventual consistency).
- **Our Approach:** We use Postgres Full-Text Search.
    - **Trigger:** `on_product_created` fires immediately when a product is inserted.
    - **Action:** It populates the `search_vector` column with the product title and description.
    - **Result:** The product is **instantly** searchable.

## 4. Codebase Updates Required
If you switch to the robust `supabase/schema.sql`, you need to update a few lines in your code to match the new table structure:

**`app/sell/page.tsx`**
- Change `image_url` to `images` (array).
- Ensure `category_id` is handled or optional.

**`app/search/page.tsx`**
- Change `image_url` to `images[0]`.
- Upgrade search from `.ilike()` to `.textSearch('search_vector', query)` for better results.
