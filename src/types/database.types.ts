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
          end_date: string | null
          id: string
          name: string
          shortened: string
          start_date: string
        }
        Insert: {
          description?: string
          end_date?: string | null
          id?: string
          name: string
          shortened?: string
          start_date?: string
        }
        Update: {
          description?: string
          end_date?: string | null
          id?: string
          name?: string
          shortened?: string
          start_date?: string
        }
        Relationships: []
      }
      character_class: {
        Row: {
          character_id: string
          class_id: string
        }
        Insert: {
          character_id?: string
          class_id?: string
        }
        Update: {
          character_id?: string
          class_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_class_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_class_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      character_party: {
        Row: {
          character_id: string
          party_id: string
        }
        Insert: {
          character_id?: string
          party_id?: string
        }
        Update: {
          character_id?: string
          party_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_party_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_party_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      character_race: {
        Row: {
          character_id: string
          race_id: string
        }
        Insert: {
          character_id?: string
          race_id?: string
        }
        Update: {
          character_id?: string
          race_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_race_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_races_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          about: string
          id: string
          level: number
          name: string
          player_uuid: string | null
          shortened: string
        }
        Insert: {
          about?: string
          id?: string
          level?: number
          name?: string
          player_uuid?: string | null
          shortened: string
        }
        Update: {
          about?: string
          id?: string
          level?: number
          name?: string
          player_uuid?: string | null
          shortened?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_player_uuid_fkey"
            columns: ["player_uuid"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      dm_party: {
        Row: {
          dm_id: string
          party_id: string
        }
        Insert: {
          dm_id?: string
          party_id?: string
        }
        Update: {
          dm_id?: string
          party_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_party_dm_id_fkey"
            columns: ["dm_id"]
            isOneToOne: false
            referencedRelation: "dms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_party_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      dms: {
        Row: {
          about: string
          auth_user_uuid: string
          id: string
          level: number
        }
        Insert: {
          about?: string
          auth_user_uuid: string
          id?: string
          level?: number
        }
        Update: {
          about?: string
          auth_user_uuid?: string
          id?: string
          level?: number
        }
        Relationships: [
          {
            foreignKeyName: "dms_auth_user_uuid_fkey1"
            columns: ["auth_user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
        ]
      }
      parties: {
        Row: {
          id: string
          name: string
          shortened: string
        }
        Insert: {
          id?: string
          name?: string
          shortened: string
        }
        Update: {
          id?: string
          name?: string
          shortened?: string
        }
        Relationships: []
      }
      party_campaigns: {
        Row: {
          campaign_id: string
          end_date: string | null
          party_id: string
          start_date: string
        }
        Insert: {
          campaign_id?: string
          end_date?: string | null
          party_id?: string
          start_date: string
        }
        Update: {
          campaign_id?: string
          end_date?: string | null
          party_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_campaigns_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_campaigns_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          about: string
          auth_user_uuid: string
          id: string
          level: number
        }
        Insert: {
          about?: string
          auth_user_uuid: string
          id?: string
          level?: number
        }
        Update: {
          about?: string
          auth_user_uuid?: string
          id?: string
          level?: number
        }
        Relationships: [
          {
            foreignKeyName: "players_auth_user_uuid_fkey1"
            columns: ["auth_user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
        ]
      }
      races: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      received_achievements_dm: {
        Row: {
          achievement_uuid: string
          count: number
          dm_uuid: string
          first_received_date: string
          last_received_date: string
        }
        Insert: {
          achievement_uuid: string
          count?: number
          dm_uuid: string
          first_received_date: string
          last_received_date: string
        }
        Update: {
          achievement_uuid?: string
          count?: number
          dm_uuid?: string
          first_received_date?: string
          last_received_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "received_achievements_dm_achievement_uuid_fkey"
            columns: ["achievement_uuid"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "received_achievements_dm_dm_uuid_fkey"
            columns: ["dm_uuid"]
            isOneToOne: false
            referencedRelation: "dms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "received_achievements_dm_player_uuid_fkey"
            columns: ["dm_uuid"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      received_achievements_player: {
        Row: {
          achievement_uuid: string
          count: number
          first_received_date: string
          last_received_date: string
          player_uuid: string
        }
        Insert: {
          achievement_uuid: string
          count?: number
          first_received_date: string
          last_received_date: string
          player_uuid: string
        }
        Update: {
          achievement_uuid?: string
          count?: number
          first_received_date?: string
          last_received_date?: string
          player_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "received_achievements_achievement_uuid_fkey"
            columns: ["achievement_uuid"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "received_achievements_player_uuid_fkey"
            columns: ["player_uuid"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          auth_user_uuid: string
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          auth_user_uuid?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          auth_user_uuid?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: [
          {
            foreignKeyName: "roles_auth_user_uuid_fkey"
            columns: ["auth_user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_uuid: string
          knumber: string
          username: string
        }
        Insert: {
          auth_user_uuid?: string
          knumber: string
          username: string
        }
        Update: {
          auth_user_uuid?: string
          knumber?: string
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

