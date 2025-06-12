export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_id: string
          created_at: string | null
          food_item_id: string
          id: string
          is_backup_provider: boolean | null
          price: number
          provider_id: string
          quantity: number
          tray_size: Database["public"]["Enums"]["tray_size"]
        }
        Insert: {
          cart_id: string
          created_at?: string | null
          food_item_id: string
          id?: string
          is_backup_provider?: boolean | null
          price: number
          provider_id: string
          quantity?: number
          tray_size?: Database["public"]["Enums"]["tray_size"]
        }
        Update: {
          cart_id?: string
          created_at?: string | null
          food_item_id?: string
          id?: string
          is_backup_provider?: boolean | null
          price?: number
          provider_id?: string
          quantity?: number
          tray_size?: Database["public"]["Enums"]["tray_size"]
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          customer_id: string
          event_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          event_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          created_at: string
          cuisine_type: string
          date: string
          event_name: string | null
          guest_count: number
          id: string
          location: string
          name: string
          number_of_guests: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          cuisine_type: string
          date: string
          event_name?: string | null
          guest_count: number
          id?: string
          location: string
          name: string
          number_of_guests?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          cuisine_type?: string
          date?: string
          event_name?: string | null
          guest_count?: number
          id?: string
          location?: string
          name?: string
          number_of_guests?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string
          cuisine_type: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          menu_id: string | null
          name: string
          price_full_tray: number
          price_half_tray: number
          price_quarter_tray: number
          provider_id: string
          tray_size: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          cuisine_type: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          menu_id?: string | null
          name: string
          price_full_tray?: number
          price_half_tray?: number
          price_quarter_tray?: number
          provider_id: string
          tray_size: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          cuisine_type?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          menu_id?: string | null
          name?: string
          price_full_tray?: number
          price_half_tray?: number
          price_quarter_tray?: number
          provider_id?: string
          tray_size?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_items_provider_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          provider_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          provider_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          provider_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          order_id: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          order_id: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          order_id?: string
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          backup_provider_id: string | null
          cart_id: string | null
          created_at: string
          customer_id: string
          event_id: string
          id: string
          order_status: Database["public"]["Enums"]["order_status"] | null
          primary_provider_id: string | null
          provider_id: string
          special_instructions: string | null
          status: string
          total_amount: number
          total_price_backup: number | null
          total_price_primary: number | null
          updated_at: string
        }
        Insert: {
          backup_provider_id?: string | null
          cart_id?: string | null
          created_at?: string
          customer_id: string
          event_id: string
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"] | null
          primary_provider_id?: string | null
          provider_id: string
          special_instructions?: string | null
          status?: string
          total_amount: number
          total_price_backup?: number | null
          total_price_primary?: number | null
          updated_at?: string
        }
        Update: {
          backup_provider_id?: string | null
          cart_id?: string | null
          created_at?: string
          customer_id?: string
          event_id?: string
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"] | null
          primary_provider_id?: string | null
          provider_id?: string
          special_instructions?: string | null
          status?: string
          total_amount?: number
          total_price_backup?: number | null
          total_price_primary?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_backup_provider_id_fkey"
            columns: ["backup_provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_primary_provider_id_fkey"
            columns: ["primary_provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          max_orders: number | null
          notes: string | null
          provider_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          max_orders?: number | null
          notes?: string | null
          provider_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          max_orders?: number | null
          notes?: string | null
          provider_id?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          address: string | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          name: string
          phone: string | null
          provider_type: Database["public"]["Enums"]["provider_type"]
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          name: string
          phone?: string | null
          provider_type: Database["public"]["Enums"]["provider_type"]
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          name?: string
          phone?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"]
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_id: string
          id: string
          provider_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          provider_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          provider_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      provider_stats: {
        Row: {
          average_rating: number | null
          food_item_count: number | null
          id: string | null
          location: string | null
          name: string | null
          provider_type: Database["public"]["Enums"]["provider_type"] | null
          review_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      food_category:
        | "veg"
        | "non_veg"
        | "halal"
        | "jain"
        | "kosher"
        | "dessert"
        | "snacks"
        | "drinks"
        | "salad"
        | "rice"
        | "breads"
        | "fusion"
        | "regional"
        | "south_indian"
        | "north_indian"
        | "indochinese"
        | "tandoor"
      order_status: "pending" | "confirmed" | "declined" | "cancelled"
      provider_type: "restaurant" | "independent_caterer" | "cloud_kitchen"
      tray_size: "full" | "half" | "quarter"
      user_role:
        | "customer"
        | "provider"
        | "organizer"
        | "restaurant"
        | "caterer"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      food_category: [
        "veg",
        "non_veg",
        "halal",
        "jain",
        "kosher",
        "dessert",
        "snacks",
        "drinks",
        "salad",
        "rice",
        "breads",
        "fusion",
        "regional",
        "south_indian",
        "north_indian",
        "indochinese",
        "tandoor",
      ],
      order_status: ["pending", "confirmed", "declined", "cancelled"],
      provider_type: ["restaurant", "independent_caterer", "cloud_kitchen"],
      tray_size: ["full", "half", "quarter"],
      user_role: [
        "customer",
        "provider",
        "organizer",
        "restaurant",
        "caterer",
        "admin",
      ],
    },
  },
} as const
