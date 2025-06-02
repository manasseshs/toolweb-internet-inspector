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
      email_migrations: {
        Row: {
          completed_at: string | null
          created_at: string
          destination_email: string
          destination_host: string
          destination_password_encrypted: string
          error_message: string | null
          id: string
          migration_log: Json | null
          progress_percentage: number | null
          source_email: string
          source_host: string
          source_password_encrypted: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          destination_email: string
          destination_host: string
          destination_password_encrypted: string
          error_message?: string | null
          id?: string
          migration_log?: Json | null
          progress_percentage?: number | null
          source_email: string
          source_host: string
          source_password_encrypted: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          destination_email?: string
          destination_host?: string
          destination_password_encrypted?: string
          error_message?: string | null
          id?: string
          migration_log?: Json | null
          progress_percentage?: number | null
          source_email?: string
          source_host?: string
          source_password_encrypted?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          created_at: string
          email_address: string
          id: string
          smtp_response_code: string | null
          smtp_response_message: string | null
          smtp_server: string | null
          status: string
          updated_at: string
          user_id: string
          verification_details: Json | null
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: string
          smtp_response_code?: string | null
          smtp_response_message?: string | null
          smtp_server?: string | null
          status: string
          updated_at?: string
          user_id: string
          verification_details?: Json | null
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: string
          smtp_response_code?: string | null
          smtp_response_message?: string | null
          smtp_server?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_details?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_global: boolean | null
          is_read: boolean | null
          message: string
          target_user_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          is_read?: boolean | null
          message: string
          target_user_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          is_read?: boolean | null
          message?: string
          target_user_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_admin?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      service_controls: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_admin_reply: boolean
          message: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_admin_reply?: boolean
          message: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_admin_reply?: boolean
          message?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tool_history: {
        Row: {
          created_at: string
          id: string
          input_data: string
          result_data: Json | null
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_data: string
          result_data?: Json | null
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_data?: string
          result_data?: Json | null
          tool_id?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          is_admin: boolean | null
          password_hash: string
          plan: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          is_admin?: boolean | null
          password_hash: string
          plan?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          is_admin?: boolean | null
          password_hash?: string
          plan?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: undefined
      }
    }
    Enums: {
      notification_type: "general" | "new_tool" | "service_update"
      user_status: "active" | "disabled"
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
      notification_type: ["general", "new_tool", "service_update"],
      user_status: ["active", "disabled"],
    },
  },
} as const
