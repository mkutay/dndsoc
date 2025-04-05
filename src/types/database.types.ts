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
      achievements: {
        Row: {
          description: string
          id: string
          name: string
        }
        Insert: {
          description: string
          id?: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          description: string
          end_date: string
          id: string
          name: string | null
          start_date: string
        }
        Insert: {
          description: string
          end_date: string
          id?: string
          name?: string | null
          start_date: string
        }
        Update: {
          description?: string
          end_date?: string
          id?: string
          name?: string | null
          start_date?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          campaign_ids: string[] | null
          class: string | null
          id: string
          level: number | null
          name: string | null
          shortened: string
          species: string | null
          user_uuid: string
        }
        Insert: {
          campaign_ids?: string[] | null
          class?: string | null
          id?: string
          level?: number | null
          name?: string | null
          shortened: string
          species?: string | null
          user_uuid?: string
        }
        Update: {
          campaign_ids?: string[] | null
          class?: string | null
          id?: string
          level?: number | null
          name?: string | null
          shortened?: string
          species?: string | null
          user_uuid?: string
        }
        Relationships: []
      }
      dms: {
        Row: {
          campaign_ids: string[] | null
          id: string
          level: number
          user_uuid: string
        }
        Insert: {
          campaign_ids?: string[] | null
          id?: string
          level?: number
          user_uuid: string
        }
        Update: {
          campaign_ids?: string[] | null
          id?: string
          level?: number
          user_uuid?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          about: string
          achievement_ids: string[]
          campaign_ids: string[]
          id: string
          level: number
          user_uuid: string
        }
        Insert: {
          about?: string
          achievement_ids?: string[]
          campaign_ids: string[]
          id?: string
          level?: number
          user_uuid?: string
        }
        Update: {
          about?: string
          achievement_ids?: string[]
          campaign_ids?: string[]
          id?: string
          level?: number
          user_uuid?: string
        }
        Relationships: []
      }
      received_achievements: {
        Row: {
          achievement_uuid: string
          count: number
          first_received_date: string
          last_received_date: string
          user_uuid: string
        }
        Insert: {
          achievement_uuid: string
          count?: number
          first_received_date: string
          last_received_date: string
          user_uuid: string
        }
        Update: {
          achievement_uuid?: string
          count?: number
          first_received_date?: string
          last_received_date?: string
          user_uuid?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          role: Database["public"]["Enums"]["role"]
          user_uuid: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["role"]
          user_uuid?: string
        }
        Update: {
          role?: Database["public"]["Enums"]["role"]
          user_uuid?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          knumber: string
          user_uuid: string
          username: string
        }
        Insert: {
          knumber: string
          user_uuid: string
          username: string
        }
        Update: {
          knumber?: string
          user_uuid?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: "admin" | "dm" | "player"
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
      role: ["admin", "dm", "player"],
    },
  },
} as const

