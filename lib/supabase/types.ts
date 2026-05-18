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
    PostgrestVersion: "14.4"
  }
  vibemap: {
    Tables: {
      bookings: {
        Row: {
          amount_rub: number | null
          confirmed_at: string | null
          created_at: string | null
          guests: string[] | null
          id: string
          kind: string
          metadata: Json | null
          provider: string
          provider_order_id: string | null
          recommendation_id: string | null
          starts_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_rub?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          guests?: string[] | null
          id?: string
          kind: string
          metadata?: Json | null
          provider: string
          provider_order_id?: string | null
          recommendation_id?: string | null
          starts_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_rub?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          guests?: string[] | null
          id?: string
          kind?: string
          metadata?: Json | null
          provider?: string
          provider_order_id?: string | null
          recommendation_id?: string | null
          starts_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibility_scores: {
        Row: {
          computed_at: string | null
          conflict_dimensions: Json | null
          expires_at: string | null
          id: string
          overlap_dimensions: Json | null
          reasoning: string
          score: number
          user_a: string
          user_b: string
        }
        Insert: {
          computed_at?: string | null
          conflict_dimensions?: Json | null
          expires_at?: string | null
          id?: string
          overlap_dimensions?: Json | null
          reasoning: string
          score: number
          user_a: string
          user_b: string
        }
        Update: {
          computed_at?: string | null
          conflict_dimensions?: Json | null
          expires_at?: string | null
          id?: string
          overlap_dimensions?: Json | null
          reasoning?: string
          score?: number
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibility_scores_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibility_scores_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          amount_rub: number | null
          companions: string[] | null
          created_at: string | null
          external_id: string | null
          feedback_text: string | null
          id: string
          kind: string
          metadata: Json | null
          rating: number | null
          source: string | null
          starts_at: string | null
          title: string
          user_id: string
          venue_name: string | null
        }
        Insert: {
          amount_rub?: number | null
          companions?: string[] | null
          created_at?: string | null
          external_id?: string | null
          feedback_text?: string | null
          id?: string
          kind: string
          metadata?: Json | null
          rating?: number | null
          source?: string | null
          starts_at?: string | null
          title: string
          user_id: string
          venue_name?: string | null
        }
        Update: {
          amount_rub?: number | null
          companions?: string[] | null
          created_at?: string | null
          external_id?: string | null
          feedback_text?: string | null
          id?: string
          kind?: string
          metadata?: Json | null
          rating?: number | null
          source?: string | null
          starts_at?: string | null
          title?: string
          user_id?: string
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          id: string
          source: string
          status: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source: string
          status?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source?: string
          status?: string
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lifestyle_profiles: {
        Row: {
          budget_evening_rub: number | null
          cuisines: Json | null
          dislikes: Json | null
          humor_taste: Json | null
          music_taste: Json | null
          raw_portrait: Json | null
          rhythm: string | null
          spontaneity_score: number | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          budget_evening_rub?: number | null
          cuisines?: Json | null
          dislikes?: Json | null
          humor_taste?: Json | null
          music_taste?: Json | null
          raw_portrait?: Json | null
          rhythm?: string | null
          spontaneity_score?: number | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          budget_evening_rub?: number | null
          cuisines?: Json | null
          dislikes?: Json | null
          humor_taste?: Json | null
          music_taste?: Json | null
          raw_portrait?: Json | null
          rhythm?: string | null
          spontaneity_score?: number | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lifestyle_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          compatibility_score_id: string | null
          created_at: string | null
          id: string
          met_at: string | null
          outcome: string | null
          status_a: string | null
          status_b: string | null
          suggested_venue: Json | null
          user_a: string
          user_b: string
        }
        Insert: {
          compatibility_score_id?: string | null
          created_at?: string | null
          id?: string
          met_at?: string | null
          outcome?: string | null
          status_a?: string | null
          status_b?: string | null
          suggested_venue?: Json | null
          user_a: string
          user_b: string
        }
        Update: {
          compatibility_score_id?: string | null
          created_at?: string | null
          id?: string
          met_at?: string | null
          outcome?: string | null
          status_a?: string | null
          status_b?: string | null
          suggested_venue?: Json | null
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_compatibility_score_id_fkey"
            columns: ["compatibility_score_id"]
            isOneToOne: false
            referencedRelation: "compatibility_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          external_id: string | null
          id: string
          kind: string
          outcome: string | null
          outcome_at: string | null
          payload: Json
          reasoning: string | null
          shown_at: string | null
          user_id: string
        }
        Insert: {
          external_id?: string | null
          id?: string
          kind: string
          outcome?: string | null
          outcome_at?: string | null
          payload: Json
          reasoning?: string | null
          shown_at?: string | null
          user_id: string
        }
        Update: {
          external_id?: string | null
          id?: string
          kind?: string
          outcome?: string | null
          outcome_at?: string | null
          payload?: Json
          reasoning?: string | null
          shown_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          created_at: string | null
          experience_id: string | null
          feeling: string
          free_text: string | null
          id: string
          match_id: string | null
          mismatch_dimension: string | null
          user_id: string
          would_meet_again: boolean | null
        }
        Insert: {
          created_at?: string | null
          experience_id?: string | null
          feeling: string
          free_text?: string | null
          id?: string
          match_id?: string | null
          mismatch_dimension?: string | null
          user_id: string
          would_meet_again?: boolean | null
        }
        Update: {
          created_at?: string | null
          experience_id?: string | null
          feeling?: string
          free_text?: string | null
          id?: string
          match_id?: string | null
          mismatch_dimension?: string | null
          user_id?: string
          would_meet_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reflections_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          onboarding_completed_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          onboarding_completed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          onboarding_completed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vibe_memories: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          importance: number | null
          last_accessed_at: string | null
          memory_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vibe_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  vibemap: {
    Enums: {},
  },
} as const
