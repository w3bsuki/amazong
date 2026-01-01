export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badge_definitions: {
        Row: {
          account_type: string | null
          category: string
          code: string
          color: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          description_bg: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_automatic: boolean | null
          name: string
          name_bg: string | null
          tier: number | null
        }
        Insert: {
          account_type?: string | null
          category: string
          code: string
          color?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          description_bg?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_automatic?: boolean | null
          name: string
          name_bg?: string | null
          tier?: number | null
        }
        Update: {
          account_type?: string | null
          category?: string
          code?: string
          color?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          description_bg?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_automatic?: boolean | null
          name?: string
          name_bg?: string | null
          tier?: number | null
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          logo_dark_url: string | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_dark_url?: string | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_dark_url?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      business_verification: {
        Row: {
          bank_verified: boolean | null
          bank_verified_at: string | null
          created_at: string | null
          eik_number: string | null
          id: string
          legal_name: string | null
          registration_doc_url: string | null
          registration_verified: boolean | null
          registration_verified_at: string | null
          seller_id: string
          updated_at: string | null
          vat_number: string | null
          vat_verified: boolean | null
          vat_verified_at: string | null
          verification_level: number | null
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          bank_verified?: boolean | null
          bank_verified_at?: string | null
          created_at?: string | null
          eik_number?: string | null
          id?: string
          legal_name?: string | null
          registration_doc_url?: string | null
          registration_verified?: boolean | null
          registration_verified_at?: string | null
          seller_id: string
          updated_at?: string | null
          vat_number?: string | null
          vat_verified?: boolean | null
          vat_verified_at?: string | null
          verification_level?: number | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          bank_verified?: boolean | null
          bank_verified_at?: string | null
          created_at?: string | null
          eik_number?: string | null
          id?: string
          legal_name?: string | null
          registration_doc_url?: string | null
          registration_verified?: boolean | null
          registration_verified_at?: string | null
          seller_id?: string
          updated_at?: string | null
          vat_number?: string | null
          vat_verified?: boolean | null
          vat_verified_at?: string | null
          verification_level?: number | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_verification_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_verification_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_feedback: {
        Row: {
          buyer_id: string
          comment: string | null
          communication: boolean | null
          created_at: string | null
          id: string
          order_id: string | null
          payment_promptness: boolean | null
          rating: number
          reasonable_expectations: boolean | null
          seller_id: string
          seller_response: string | null
          seller_response_at: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          communication?: boolean | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_promptness?: boolean | null
          rating: number
          reasonable_expectations?: boolean | null
          seller_id: string
          seller_response?: string | null
          seller_response_at?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          communication?: boolean | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_promptness?: boolean | null
          rating?: number
          reasonable_expectations?: boolean | null
          seller_id?: string
          seller_response?: string | null
          seller_response_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_feedback_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_feedback_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_stats: {
        Row: {
          average_rating: number | null
          conversations_started: number | null
          disputes_opened: number | null
          disputes_won: number | null
          first_purchase_at: string | null
          last_purchase_at: string | null
          reviews_written: number | null
          stores_following: number | null
          total_orders: number | null
          total_ratings: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
          wishlist_count: number | null
        }
        Insert: {
          average_rating?: number | null
          conversations_started?: number | null
          disputes_opened?: number | null
          disputes_won?: number | null
          first_purchase_at?: string | null
          last_purchase_at?: string | null
          reviews_written?: number | null
          stores_following?: number | null
          total_orders?: number | null
          total_ratings?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
          wishlist_count?: number | null
        }
        Update: {
          average_rating?: number | null
          conversations_started?: number | null
          disputes_opened?: number | null
          disputes_won?: number | null
          first_purchase_at?: string | null
          last_purchase_at?: string | null
          reviews_written?: number | null
          stores_following?: number | null
          total_orders?: number | null
          total_ratings?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
          wishlist_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "deal_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          description_bg: string | null
          display_order: number | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          name_bg: string | null
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_bg?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_bg?: string | null
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_bg?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_bg?: string | null
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_attributes: {
        Row: {
          attribute_type: string
          category_id: string | null
          created_at: string | null
          id: string
          is_filterable: boolean | null
          is_required: boolean | null
          name: string
          name_bg: string | null
          options: Json | null
          options_bg: Json | null
          placeholder: string | null
          placeholder_bg: string | null
          sort_order: number | null
          validation_rules: Json | null
        }
        Insert: {
          attribute_type: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_filterable?: boolean | null
          is_required?: boolean | null
          name: string
          name_bg?: string | null
          options?: Json | null
          options_bg?: Json | null
          placeholder?: string | null
          placeholder_bg?: string | null
          sort_order?: number | null
          validation_rules?: Json | null
        }
        Update: {
          attribute_type?: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_filterable?: boolean | null
          is_required?: boolean | null
          name?: string
          name_bg?: string | null
          options?: Json | null
          options_bg?: Json | null
          placeholder?: string | null
          placeholder_bg?: string | null
          sort_order?: number | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "category_attributes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          buyer_unread_count: number | null
          created_at: string
          id: string
          last_message_at: string | null
          order_id: string | null
          product_id: string | null
          seller_id: string
          seller_unread_count: number | null
          status: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_unread_count?: number | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          product_id?: string | null
          seller_id: string
          seller_unread_count?: number | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_unread_count?: number | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          product_id?: string | null
          seller_id?: string
          seller_unread_count?: number | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_boosts: {
        Row: {
          created_at: string | null
          duration_days: number
          expires_at: string
          id: string
          is_active: boolean | null
          price_paid: number
          product_id: string
          seller_id: string
          starts_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days?: number
          expires_at: string
          id?: string
          is_active?: boolean | null
          price_paid: number
          product_id: string
          seller_id: string
          starts_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          expires_at?: string
          id?: string
          is_active?: boolean | null
          price_paid?: number
          product_id?: string
          seller_id?: string
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_boosts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_boosts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          conversation_id: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          order_id: string | null
          product_id: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          order_id?: string | null
          product_id?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          order_id?: string | null
          product_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_message: boolean
          email_order_status: boolean
          email_promotion: boolean
          email_purchase: boolean
          email_review: boolean
          email_system: boolean
          in_app_message: boolean
          in_app_order_status: boolean
          in_app_promotion: boolean
          in_app_purchase: boolean
          in_app_review: boolean
          in_app_system: boolean
          push_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_message?: boolean
          email_order_status?: boolean
          email_promotion?: boolean
          email_purchase?: boolean
          email_review?: boolean
          email_system?: boolean
          in_app_message?: boolean
          in_app_order_status?: boolean
          in_app_promotion?: boolean
          in_app_purchase?: boolean
          in_app_review?: boolean
          in_app_system?: boolean
          push_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_message?: boolean
          email_order_status?: boolean
          email_promotion?: boolean
          email_purchase?: boolean
          email_review?: boolean
          email_system?: boolean
          in_app_message?: boolean
          in_app_order_status?: boolean
          in_app_promotion?: boolean
          in_app_purchase?: boolean
          in_app_review?: boolean
          in_app_system?: boolean
          push_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          delivered_at: string | null
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
          seller_id: string
          seller_received_at: string | null
          shipped_at: string | null
          shipping_carrier: string | null
          status: string | null
          tracking_number: string | null
        }
        Insert: {
          delivered_at?: string | null
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
          seller_id: string
          seller_received_at?: string | null
          shipped_at?: string | null
          shipping_carrier?: string | null
          status?: string | null
          tracking_number?: string | null
        }
        Update: {
          delivered_at?: string | null
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
          seller_id?: string
          seller_received_at?: string | null
          shipped_at?: string | null
          shipping_carrier?: string | null
          status?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          shipping_address: Json | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shipping_address?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shipping_address?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          attribute_id: string | null
          created_at: string | null
          id: string
          is_custom: boolean | null
          name: string
          product_id: string | null
          value: string
        }
        Insert: {
          attribute_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
          product_id?: string | null
          value: string
        }
        Update: {
          attribute_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          product_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "category_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string | null
          color_hex: string | null
          created_at: string
          id: string
          image_url: string | null
          is_default: boolean | null
          name: string
          price_adjustment: number | null
          product_id: string
          size: string | null
          sku: string | null
          sort_order: number | null
          stock: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          color_hex?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          name: string
          price_adjustment?: number | null
          product_id: string
          size?: string | null
          sku?: string | null
          sort_order?: number | null
          stock?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          color_hex?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          name?: string
          price_adjustment?: number | null
          product_id?: string
          size?: string | null
          sku?: string | null
          sort_order?: number | null
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json | null
          barcode: string | null
          boost_expires_at: string | null
          brand_id: string | null
          category_id: string | null
          condition: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          featured_until: string | null
          free_shipping: boolean | null
          id: string
          images: string[] | null
          is_boosted: boolean | null
          is_featured: boolean | null
          is_limited_stock: boolean | null
          is_on_sale: boolean | null
          list_price: number | null
          listing_type: string | null
          meta_description: string | null
          meta_title: string | null
          pickup_only: boolean | null
          price: number
          rating: number | null
          review_count: number | null
          search_vector: unknown
          seller_city: string | null
          seller_id: string
          ships_to_bulgaria: boolean | null
          ships_to_europe: boolean | null
          ships_to_uk: boolean | null
          ships_to_usa: boolean | null
          ships_to_worldwide: boolean | null
          shipping_days: number | null
          sku: string | null
          slug: string | null
          sale_end_date: string | null
          sale_percent: number | null
          status: string | null
          stock: number
          stock_quantity: number | null
          tags: string[] | null
          title: string
          track_inventory: boolean | null
          updated_at: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          attributes?: Json | null
          barcode?: string | null
          boost_expires_at?: string | null
          brand_id?: string | null
          category_id?: string | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          featured_until?: string | null
          free_shipping?: boolean | null
          id?: string
          images?: string[] | null
          is_boosted?: boolean | null
          is_featured?: boolean | null
          is_limited_stock?: boolean | null
          is_on_sale?: boolean | null
          list_price?: number | null
          listing_type?: string | null
          meta_description?: string | null
          meta_title?: string | null
          pickup_only?: boolean | null
          price: number
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown
          seller_city?: string | null
          seller_id: string
          ships_to_bulgaria?: boolean | null
          ships_to_europe?: boolean | null
          ships_to_uk?: boolean | null
          ships_to_usa?: boolean | null
          ships_to_worldwide?: boolean | null
          shipping_days?: number | null
          sku?: string | null
          slug?: string | null
          sale_end_date?: string | null
          sale_percent?: number | null
          status?: string | null
          stock?: number
          stock_quantity?: number | null
          tags?: string[] | null
          title: string
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          attributes?: Json | null
          barcode?: string | null
          boost_expires_at?: string | null
          brand_id?: string | null
          category_id?: string | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          featured_until?: string | null
          free_shipping?: boolean | null
          id?: string
          images?: string[] | null
          is_boosted?: boolean | null
          is_featured?: boolean | null
          is_limited_stock?: boolean | null
          is_on_sale?: boolean | null
          list_price?: number | null
          listing_type?: string | null
          meta_description?: string | null
          meta_title?: string | null
          pickup_only?: boolean | null
          price?: number
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown
          seller_city?: string | null
          seller_id?: string
          ships_to_bulgaria?: boolean | null
          ships_to_europe?: boolean | null
          ships_to_uk?: boolean | null
          ships_to_usa?: boolean | null
          ships_to_worldwide?: boolean | null
          shipping_days?: number | null
          sku?: string | null
          slug?: string | null
          sale_end_date?: string | null
          sale_percent?: number | null
          status?: string | null
          stock?: number
          stock_quantity?: number | null
          tags?: string[] | null
          title?: string
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          business_name: string | null
          commission_rate: number | null
          country_code: string | null
          created_at: string
          default_city: string | null
          display_name: string | null
          email: string | null
          final_value_fee: number | null
          full_name: string | null
          id: string
          insertion_fee: number | null
          is_seller: boolean | null
          is_verified_business: boolean | null
          last_username_change: string | null
          location: string | null
          per_order_fee: number | null
          phone: string | null
          region_auto_detected: boolean | null
          region_updated_at: string | null
          role: string | null
          shipping_region: string | null
          social_links: Json | null
          stripe_customer_id: string | null
          tier: string | null
          updated_at: string
          username: string | null
          vat_number: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          business_name?: string | null
          commission_rate?: number | null
          country_code?: string | null
          created_at?: string
          default_city?: string | null
          display_name?: string | null
          email?: string | null
          final_value_fee?: number | null
          full_name?: string | null
          id: string
          insertion_fee?: number | null
          is_seller?: boolean | null
          is_verified_business?: boolean | null
          last_username_change?: string | null
          location?: string | null
          per_order_fee?: number | null
          phone?: string | null
          region_auto_detected?: boolean | null
          region_updated_at?: string | null
          role?: string | null
          shipping_region?: string | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          tier?: string | null
          updated_at?: string
          username?: string | null
          vat_number?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          business_name?: string | null
          commission_rate?: number | null
          country_code?: string | null
          created_at?: string
          default_city?: string | null
          display_name?: string | null
          email?: string | null
          final_value_fee?: number | null
          full_name?: string | null
          id?: string
          insertion_fee?: number | null
          is_seller?: boolean | null
          is_verified_business?: boolean | null
          last_username_change?: string | null
          location?: string | null
          per_order_fee?: number | null
          phone?: string | null
          region_auto_detected?: boolean | null
          region_updated_at?: string | null
          role?: string | null
          shipping_region?: string | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          tier?: string | null
          updated_at?: string
          username?: string | null
          vat_number?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          images: string[] | null
          product_id: string
          rating: number
          seller_response: string | null
          seller_response_at: string | null
          title: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          product_id: string
          rating: number
          seller_response?: string | null
          seller_response_at?: string | null
          title?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          product_id?: string
          rating?: number
          seller_response?: string | null
          seller_response_at?: string | null
          title?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_feedback: {
        Row: {
          buyer_id: string
          buyer_response: string | null
          buyer_response_at: string | null
          comment: string | null
          communication: boolean | null
          created_at: string | null
          id: string
          item_as_described: boolean | null
          order_id: string | null
          rating: number
          seller_id: string
          shipping_speed: boolean | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          buyer_response?: string | null
          buyer_response_at?: string | null
          comment?: string | null
          communication?: boolean | null
          created_at?: string | null
          id?: string
          item_as_described?: boolean | null
          order_id?: string | null
          rating: number
          seller_id: string
          shipping_speed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          buyer_response?: string | null
          buyer_response_at?: string | null
          comment?: string | null
          communication?: boolean | null
          created_at?: string | null
          id?: string
          item_as_described?: boolean | null
          order_id?: string | null
          rating?: number
          seller_id?: string
          shipping_speed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_feedback_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_feedback_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_stats: {
        Row: {
          active_listings: number | null
          average_rating: number | null
          communication_pct: number | null
          first_sale_at: string | null
          five_star_reviews: number | null
          follower_count: number | null
          item_described_pct: number | null
          last_sale_at: string | null
          positive_feedback_pct: number | null
          repeat_customer_pct: number | null
          response_rate_pct: number | null
          response_time_hours: number | null
          seller_id: string
          shipped_on_time_pct: number | null
          shipping_speed_pct: number | null
          total_listings: number | null
          total_revenue: number | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          active_listings?: number | null
          average_rating?: number | null
          communication_pct?: number | null
          first_sale_at?: string | null
          five_star_reviews?: number | null
          follower_count?: number | null
          item_described_pct?: number | null
          last_sale_at?: string | null
          positive_feedback_pct?: number | null
          repeat_customer_pct?: number | null
          response_rate_pct?: number | null
          response_time_hours?: number | null
          seller_id: string
          shipped_on_time_pct?: number | null
          shipping_speed_pct?: number | null
          total_listings?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          active_listings?: number | null
          average_rating?: number | null
          communication_pct?: number | null
          first_sale_at?: string | null
          five_star_reviews?: number | null
          follower_count?: number | null
          item_described_pct?: number | null
          last_sale_at?: string | null
          positive_feedback_pct?: number | null
          repeat_customer_pct?: number | null
          response_rate_pct?: number | null
          response_time_hours?: number | null
          seller_id?: string
          shipped_on_time_pct?: number | null
          shipping_speed_pct?: number | null
          total_listings?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_stats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          code: string
          countries: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          name_bg: string | null
          region: string | null
          sort_order: number | null
        }
        Insert: {
          code: string
          countries?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_bg?: string | null
          region?: string | null
          sort_order?: number | null
        }
        Update: {
          code?: string
          countries?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_bg?: string | null
          region?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      store_followers: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          seller_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          seller_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_followers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          account_type: string | null
          analytics_access: string | null
          badge_type: string | null
          boosts_included: number | null
          commission_rate: number
          created_at: string | null
          currency: string | null
          description: string | null
          description_bg: string | null
          features: Json | null
          final_value_fee: number | null
          id: string
          insertion_fee: number | null
          is_active: boolean | null
          max_listings: number | null
          name: string
          per_order_fee: number | null
          price_monthly: number
          price_yearly: number
          priority_support: boolean | null
          stripe_price_monthly_id: string | null
          stripe_price_yearly_id: string | null
          tier: string
        }
        Insert: {
          account_type?: string | null
          analytics_access?: string | null
          badge_type?: string | null
          boosts_included?: number | null
          commission_rate: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_bg?: string | null
          features?: Json | null
          final_value_fee?: number | null
          id?: string
          insertion_fee?: number | null
          is_active?: boolean | null
          max_listings?: number | null
          name: string
          per_order_fee?: number | null
          price_monthly: number
          price_yearly: number
          priority_support?: boolean | null
          stripe_price_monthly_id?: string | null
          stripe_price_yearly_id?: string | null
          tier: string
        }
        Update: {
          account_type?: string | null
          analytics_access?: string | null
          badge_type?: string | null
          boosts_included?: number | null
          commission_rate?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_bg?: string | null
          features?: Json | null
          final_value_fee?: number | null
          id?: string
          insertion_fee?: number | null
          is_active?: boolean | null
          max_listings?: number | null
          name?: string
          per_order_fee?: number | null
          price_monthly?: number
          price_yearly?: number
          priority_support?: boolean | null
          stripe_price_monthly_id?: string | null
          stripe_price_yearly_id?: string | null
          tier?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          billing_period: string
          created_at: string | null
          currency: string | null
          expires_at: string
          id: string
          plan_type: string
          price_paid: number
          seller_id: string
          starts_at: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          billing_period: string
          created_at?: string | null
          currency?: string | null
          expires_at: string
          id?: string
          plan_type: string
          price_paid: number
          seller_id: string
          starts_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          billing_period?: string
          created_at?: string | null
          currency?: string | null
          expires_at?: string
          id?: string
          plan_type?: string
          price_paid?: number
          seller_id?: string
          starts_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          label: string
          phone: string | null
          postal_code: string
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string
          phone?: string | null
          postal_code: string
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string
          phone?: string | null
          postal_code?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          awarded_by: string | null
          badge_id: string
          id: string
          metadata: Json | null
          revoke_reason: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id: string
          id?: string
          metadata?: Json | null
          revoke_reason?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id?: string
          id?: string
          metadata?: Json | null
          revoke_reason?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_customer_id: string
          stripe_payment_method_id: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_customer_id: string
          stripe_payment_method_id: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_customer_id?: string
          stripe_payment_method_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_verification: {
        Row: {
          address_verified: boolean | null
          address_verified_at: string | null
          created_at: string | null
          email_verified: boolean | null
          id: string
          id_document_type: string | null
          id_verified: boolean | null
          id_verified_at: string | null
          phone_number: string | null
          phone_verified: boolean | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_verified?: boolean | null
          address_verified_at?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          id?: string
          id_document_type?: string | null
          id_verified?: boolean | null
          id_verified_at?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_verified?: boolean | null
          address_verified_at?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          id?: string
          id_document_type?: string | null
          id_verified?: boolean | null
          id_verified_at?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_verification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      username_history: {
        Row: {
          changed_at: string | null
          id: string
          new_username: string
          old_username: string
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_username: string
          old_username: string
          user_id: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_username?: string
          old_username?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "username_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_options: {
        Row: {
          display_value: string | null
          hex_code: string | null
          id: string
          sort_order: number | null
          type: string
          value: string
        }
        Insert: {
          display_value?: string | null
          hex_code?: string | null
          id?: string
          sort_order?: number | null
          type: string
          value: string
        }
        Update: {
          display_value?: string | null
          hex_code?: string | null
          id?: string
          sort_order?: number | null
          type?: string
          value?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string | null
          product_id: string
          share_token: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          product_id: string
          share_token?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          product_id?: string
          share_token?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      subscription_overview: {
        Row: {
          auto_renew: boolean | null
          boosts_included: number | null
          email: string | null
          expires_at: string | null
          final_value_fee: number | null
          full_name: string | null
          max_listings: number | null
          plan_name: string | null
          plan_type: string | null
          price_monthly: number | null
          price_yearly: number | null
          seller_id: string | null
          starts_at: string | null
          status: string | null
          subscription_id: string | null
          tier: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      block_user: {
        Args: { p_reason?: string; p_user_to_block: string }
        Returns: boolean
      }
      cart_add_item: {
        Args: { p_product_id: string; p_quantity?: number }
        Returns: undefined
      }
      cart_clear: { Args: never; Returns: undefined }
      cart_set_quantity: {
        Args: { p_product_id: string; p_quantity: number }
        Returns: undefined
      }
      check_subscription_expiry: { Args: never; Returns: undefined }
      cleanup_sold_wishlist_items: { Args: never; Returns: number }
      disable_wishlist_sharing: {
        Args: { p_user_id?: string }
        Returns: undefined
      }
      enable_wishlist_sharing: {
        Args: { p_user_id?: string }
        Returns: {
          share_token: string
          share_url: string
        }[]
      }
      expire_listing_boosts: { Args: never; Returns: undefined }
      generate_product_slug: {
        Args: { product_id: string; title: string }
        Returns: string
      }
      generate_share_token: { Args: never; Returns: string }
      generate_store_slug: { Args: { store_name: string }; Returns: string }
      get_blocked_users: {
        Args: never
        Returns: {
          avatar_url: string
          blocked_at: string
          blocked_id: string
          full_name: string
          reason: string
        }[]
      }
      get_category_hierarchy: {
        Args: { p_depth?: number; p_slug?: string }
        Returns: {
          depth: number
          display_order: number
          icon: string
          id: string
          image_url: string
          name: string
          name_bg: string
          parent_id: string
          path: string[]
          slug: string
        }[]
      }
      get_conversation_messages: {
        Args: { p_conversation_id: string }
        Returns: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: string
          is_read: boolean
          read_at: string | null
          created_at: string
          sender_full_name: string | null
          sender_avatar_url: string | null
        }[]
      }
      get_or_create_conversation: {
        Args: {
          p_order_id?: string
          p_product_id?: string
          p_seller_id: string
          p_subject?: string
        }
        Returns: string
      }
      get_seller_listing_info: {
        Args: { seller_uuid: string }
        Returns: {
          current_listings: number
          max_listings: number
          tier: string
        }[]
      }
      get_seller_stats: {
        Args: { target_seller_id?: string }
        Returns: {
          avg_product_rating: number
          order_count: number
          product_count: number
          seller_id: string
          store_name: string
          total_revenue: number
        }[]
      }
      get_seller_subscription_status: {
        Args: { seller_uuid: string }
        Returns: {
          auto_renew: boolean
          expires_at: string
          has_subscription: boolean
          plan_name: string
          status: string
          tier: string
        }[]
      }
      get_shared_wishlist: {
        Args: { p_share_token: string }
        Returns: {
          added_at: string
          owner_name: string
          product_id: string
          product_image: string
          product_price: number
          product_title: string
          wishlist_description: string
          wishlist_name: string
        }[]
      }
      get_total_unread_messages: { Args: never; Returns: number }
      get_unread_notification_count: { Args: never; Returns: number }
      get_user_conversation_ids: {
        Args: { p_user_id: string }
        Returns: {
          conversation_id: string
        }[]
      }
      get_user_conversations: {
        Args: { p_user_id: string }
        Returns: {
          buyer_avatar_url: string
          buyer_full_name: string
          buyer_id: string
          buyer_unread_count: number
          created_at: string
          id: string
          last_message_at: string
          last_message_content: string
          last_message_created_at: string
          last_message_id: string
          last_message_sender_id: string
          last_message_type: string
          order_id: string
          product_id: string
          product_images: string[]
          product_title: string
          seller_avatar_url: string
          seller_full_name: string
          seller_id: string
          seller_unread_count: number
          status: string
          store_name: string
          store_slug: string
          subject: string
          updated_at: string
        }[]
      }
      increment_helpful_count: { Args: { review_id: string }; Returns: number }
      is_admin: { Args: never; Returns: boolean }
      is_blocked_bidirectional: {
        Args: { p_user_a: string; p_user_b: string }
        Returns: boolean
      }
      is_user_blocked: {
        Args: { p_blocked_id: string; p_blocker_id: string }
        Returns: boolean
      }
      mark_all_notifications_read: { Args: never; Returns: number }
      mark_messages_read: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      transliterate_bulgarian: { Args: { input_text: string }; Returns: string }
      unblock_user: { Args: { p_user_to_unblock: string }; Returns: boolean }
      validate_username: { Args: { username: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

const Constants = {
  public: {
    Enums: {},
  },
} as const
