export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          description: string
          description_long: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: string
          is_hidden: boolean
          max_unlocks: number
          name: string
          points: number | null
          shortened: string
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          category?: string | null
          description: string
          description_long?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          is_hidden?: boolean
          max_unlocks?: number
          name: string
          points?: number | null
          shortened: string
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          category?: string | null
          description?: string
          description_long?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          is_hidden?: boolean
          max_unlocks?: number
          name?: string
          points?: number | null
          shortened?: string
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: []
      }
      associates_requests: {
        Row: {
          created_at: string
          decision_by: string | null
          email: string
          id: string
          name: string
          notes: string
          status: Database["public"]["Enums"]["request_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          decision_by?: string | null
          email: string
          id?: string
          name: string
          notes?: string
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          decision_by?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "associates_requests_decision_by_fkey"
            columns: ["decision_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "associates_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
        ]
      }
      auction: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string
          id: string
          next: string | null
          previous: string | null
          seller_id: string
          status: Database["public"]["Enums"]["auction_state"]
          thingy_id: string
          valid: boolean
        }
        Insert: {
          amount?: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          next?: string | null
          previous?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["auction_state"]
          thingy_id: string
          valid?: boolean
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          next?: string | null
          previous?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["auction_state"]
          thingy_id?: string
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "auction_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_next_fkey"
            columns: ["next"]
            isOneToOne: false
            referencedRelation: "auction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_previous_fkey"
            columns: ["previous"]
            isOneToOne: false
            referencedRelation: "auction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_thingy_id_fkey"
            columns: ["thingy_id"]
            isOneToOne: false
            referencedRelation: "thingy"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "character_race_race_id_fkey"
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
          image_uuid: string | null
          level: number
          name: string
          player_uuid: string
          shortened: string
        }
        Insert: {
          about?: string
          id?: string
          image_uuid?: string | null
          level?: number
          name?: string
          player_uuid: string
          shortened: string
        }
        Update: {
          about?: string
          id?: string
          image_uuid?: string | null
          level?: number
          name?: string
          player_uuid?: string
          shortened?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_image_uuid_fkey1"
            columns: ["image_uuid"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
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
          rules_url: string | null
        }
        Insert: {
          id?: string
          name: string
          rules_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          rules_url?: string | null
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
          image_uuid: string | null
          level: number
        }
        Insert: {
          about?: string
          auth_user_uuid: string
          id?: string
          image_uuid?: string | null
          level?: number
        }
        Update: {
          about?: string
          auth_user_uuid?: string
          id?: string
          image_uuid?: string | null
          level?: number
        }
        Relationships: [
          {
            foreignKeyName: "dms_auth_user_uuid_fkey"
            columns: ["auth_user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "dms_image_uuid_fkey1"
            columns: ["image_uuid"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
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
      journal: {
        Row: {
          campaign_id: string
          date: string
          excerpt: string
          id: string
          shortened: string
          title: string
        }
        Insert: {
          campaign_id: string
          date: string
          excerpt?: string
          id?: string
          shortened?: string
          title?: string
        }
        Update: {
          campaign_id?: string
          date?: string
          excerpt?: string
          id?: string
          shortened?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      options: {
        Row: {
          id: string
          poll_id: string
          text: string
        }
        Insert: {
          id?: string
          poll_id?: string
          text: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          about: string
          id: string
          image_uuid: string | null
          level: number
          name: string
          shortened: string
        }
        Insert: {
          about?: string
          id?: string
          image_uuid?: string | null
          level?: number
          name?: string
          shortened: string
        }
        Update: {
          about?: string
          id?: string
          image_uuid?: string | null
          level?: number
          name?: string
          shortened?: string
        }
        Relationships: [
          {
            foreignKeyName: "parties_image_uuid_fkey1"
            columns: ["image_uuid"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      party_campaigns: {
        Row: {
          campaign_id: string
          party_id: string
        }
        Insert: {
          campaign_id?: string
          party_id?: string
        }
        Update: {
          campaign_id?: string
          party_id?: string
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
      party_entries: {
        Row: {
          journal_id: string
          party_id: string
          text: string
        }
        Insert: {
          journal_id?: string
          party_id?: string
          text?: string
        }
        Update: {
          journal_id?: string
          party_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_entries_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_entries_party_id_fkey"
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
          image_uuid: string | null
          level: number
        }
        Insert: {
          about?: string
          auth_user_uuid: string
          id?: string
          image_uuid?: string | null
          level?: number
        }
        Update: {
          about?: string
          auth_user_uuid?: string
          id?: string
          image_uuid?: string | null
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
          {
            foreignKeyName: "players_auth_user_uuid_fkey2"
            columns: ["auth_user_uuid"]
            isOneToOne: true
            referencedRelation: "roles"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "players_image_uuid_fkey1"
            columns: ["image_uuid"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          question: string
          shortened: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          question: string
          shortened: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          question?: string
          shortened?: string
        }
        Relationships: []
      }
      races: {
        Row: {
          id: string
          name: string
          rules_url: string | null
        }
        Insert: {
          id?: string
          name: string
          rules_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          rules_url?: string | null
        }
        Relationships: []
      }
      received_achievements_character: {
        Row: {
          achievement_uuid: string
          character_uuid: string
          count: number
          first_received_date: string
          last_received_date: string
        }
        Insert: {
          achievement_uuid: string
          character_uuid: string
          count?: number
          first_received_date: string
          last_received_date: string
        }
        Update: {
          achievement_uuid?: string
          character_uuid?: string
          count?: number
          first_received_date?: string
          last_received_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "received_achievements_characters_achievement_uuid_fkey"
            columns: ["achievement_uuid"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "received_achievements_characters_character_uuid_fkey"
            columns: ["character_uuid"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["role"]
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
      thingy: {
        Row: {
          character_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          next: string | null
          public: boolean
          shortened: string
          tags: Database["public"]["Enums"]["thingy_type"][]
        }
        Insert: {
          character_id?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          next?: string | null
          public?: boolean
          shortened: string
          tags: Database["public"]["Enums"]["thingy_type"][]
        }
        Update: {
          character_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          next?: string | null
          public?: boolean
          shortened?: string
          tags?: Database["public"]["Enums"]["thingy_type"][]
        }
        Relationships: [
          {
            foreignKeyName: "thingy_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thingy_next_fkey"
            columns: ["next"]
            isOneToOne: false
            referencedRelation: "thingy"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_uuid: string
          email: string
          knumber: string | null
          name: string
          username: string
        }
        Insert: {
          auth_user_uuid?: string
          email: string
          knumber?: string | null
          name?: string
          username: string
        }
        Update: {
          auth_user_uuid?: string
          email?: string
          knumber?: string | null
          name?: string
          username?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          auth_user_uuid: string | null
          created_at: string
          id: string
          option_id: string
          poll_id: string
        }
        Insert: {
          auth_user_uuid?: string | null
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
        }
        Update: {
          auth_user_uuid?: string | null
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_auth_user_uuid_fkey1"
            columns: ["auth_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      when2dnd_polls: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          date_from: string
          date_to: string
          deadline: string | null
          id: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          date_from: string
          date_to: string
          deadline?: string | null
          id?: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          date_from?: string
          date_to?: string
          deadline?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "when2dnd_poll_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "when2dnd_poll_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["auth_user_uuid"]
          },
        ]
      }
      when2dnd_votes: {
        Row: {
          auth_user_uuid: string | null
          created_at: string
          end: string
          id: string
          start: string
          when2dnd_poll_id: string
        }
        Insert: {
          auth_user_uuid?: string | null
          created_at?: string
          end: string
          id?: string
          start: string
          when2dnd_poll_id?: string
        }
        Update: {
          auth_user_uuid?: string | null
          created_at?: string
          end?: string
          id?: string
          start?: string
          when2dnd_poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "when2dnd_votes_auth_user_uuid_fkey"
            columns: ["auth_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "when2dnd_votes_auth_user_uuid_fkey1"
            columns: ["auth_user_uuid"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["auth_user_uuid"]
          },
          {
            foreignKeyName: "when2dnd_votes_when2dnd_poll_id_fkey"
            columns: ["when2dnd_poll_id"]
            isOneToOne: false
            referencedRelation: "when2dnd_polls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_party_entries_for_campaign: {
        Args: { a_campaign_id: string; a_journal_id: string }
        Returns: undefined
      }
      is_dm_for_player: {
        Args: { player_id: string }
        Returns: boolean
      }
      vote_on: {
        Args: {
          a_option_id: string
          a_poll_id: string
          a_auth_user_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      achievement_type: "dm" | "player" | "character"
      auction_state:
        | "deleted"
        | "created"
        | "listing_approved"
        | "buy_request"
        | "signed_off"
        | "deal_completed"
      difficulty: "easy" | "medium" | "hard" | "impossible"
      request_status: "approved" | "denied" | "pending"
      role: "admin" | "dm" | "player"
      thingy_type:
        | "Adventuring Gear"
        | "Ammunition"
        | "Artisan’s Tools"
        | "Explosive"
        | "Firearm"
        | "Food and Drink"
        | "Futuristic"
        | "Gaming Set"
        | "Generic Variant"
        | "Heavy Armor"
        | "Illegal Drug"
        | "Instrument"
        | "Light Armor"
        | "Martial Weapon"
        | "Medium Armor"
        | "Melee Weapon"
        | "Modern"
        | "Mount"
        | "Other"
        | "Poison"
        | "Potion"
        | "Ranged Weapon"
        | "Renaissance"
        | "Ring"
        | "Rod"
        | "Scroll"
        | "Shield"
        | "Simple Weapon"
        | "Spellcasting Focus"
        | "Staff"
        | "Tack and Harness"
        | "Tattoo"
        | "Tool"
        | "Trade Bar"
        | "Trade Good"
        | "Treasure (Art Object)"
        | "Treasure (Coinage)"
        | "Treasure (Gemstone)"
        | "Vehicle (Air)"
        | "Vehicle (Land)"
        | "Vehicle (Space)"
        | "Vehicle (Water)"
        | "Wand"
        | "Wondrous Item"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
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

export type TablesInsert<
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

export type TablesUpdate<
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

export type Enums<
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

export type CompositeTypes<
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

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      achievement_type: ["dm", "player", "character"],
      auction_state: [
        "deleted",
        "created",
        "listing_approved",
        "buy_request",
        "signed_off",
        "deal_completed",
      ],
      difficulty: ["easy", "medium", "hard", "impossible"],
      request_status: ["approved", "denied", "pending"],
      role: ["admin", "dm", "player"],
      thingy_type: [
        "Adventuring Gear",
        "Ammunition",
        "Artisan’s Tools",
        "Explosive",
        "Firearm",
        "Food and Drink",
        "Futuristic",
        "Gaming Set",
        "Generic Variant",
        "Heavy Armor",
        "Illegal Drug",
        "Instrument",
        "Light Armor",
        "Martial Weapon",
        "Medium Armor",
        "Melee Weapon",
        "Modern",
        "Mount",
        "Other",
        "Poison",
        "Potion",
        "Ranged Weapon",
        "Renaissance",
        "Ring",
        "Rod",
        "Scroll",
        "Shield",
        "Simple Weapon",
        "Spellcasting Focus",
        "Staff",
        "Tack and Harness",
        "Tattoo",
        "Tool",
        "Trade Bar",
        "Trade Good",
        "Treasure (Art Object)",
        "Treasure (Coinage)",
        "Treasure (Gemstone)",
        "Vehicle (Air)",
        "Vehicle (Land)",
        "Vehicle (Space)",
        "Vehicle (Water)",
        "Wand",
        "Wondrous Item",
      ],
    },
  },
} as const

