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
      alumni_profiles: {
        Row: {
          availability_for_mentorship: boolean | null
          availability_for_referrals: boolean | null
          company: string | null
          created_at: string
          department: string | null
          designation: string | null
          domain: string | null
          experience_years: number | null
          graduation_year: number | null
          id: string
          university: string | null
          updated_at: string
        }
        Insert: {
          availability_for_mentorship?: boolean | null
          availability_for_referrals?: boolean | null
          company?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          domain?: string | null
          experience_years?: number | null
          graduation_year?: number | null
          id: string
          university?: string | null
          updated_at?: string
        }
        Update: {
          availability_for_mentorship?: boolean | null
          availability_for_referrals?: boolean | null
          company?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          domain?: string | null
          experience_years?: number | null
          graduation_year?: number | null
          id?: string
          university?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          created_at: string
          id: string
          job_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_matches: {
        Row: {
          created_at: string
          id: string
          job_id: string
          similarity_score: number | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          similarity_score?: number | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          similarity_score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          alumni_id: string
          company: string
          created_at: string
          description: string
          external_url: string | null
          id: string
          interview_questions: string | null
          is_active: boolean | null
          job_type: string | null
          keywords: string[] | null
          location: string | null
          preferred_colleges: string[] | null
          requirements: string[] | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alumni_id: string
          company: string
          created_at?: string
          description: string
          external_url?: string | null
          id?: string
          interview_questions?: string | null
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          location?: string | null
          preferred_colleges?: string[] | null
          requirements?: string[] | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alumni_id?: string
          company?: string
          created_at?: string
          description?: string
          external_url?: string | null
          id?: string
          interview_questions?: string | null
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          location?: string | null
          preferred_colleges?: string[] | null
          requirements?: string[] | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          alumni_id: string
          alumni_response: string | null
          created_at: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["mentorship_status"] | null
          student_id: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          alumni_id: string
          alumni_response?: string | null
          created_at?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          student_id: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          alumni_id?: string
          alumni_response?: string | null
          created_at?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          student_id?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string | null
          github_url: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          theme_preference:
            | Database["public"]["Enums"]["theme_preference"]
            | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          github_url?: string | null
          id: string
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          theme_preference?:
            | Database["public"]["Enums"]["theme_preference"]
            | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          github_url?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          theme_preference?:
            | Database["public"]["Enums"]["theme_preference"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          alumni_id: string
          alumni_response: string | null
          created_at: string
          id: string
          job_id: string
          message: string | null
          status: Database["public"]["Enums"]["referral_status"] | null
          student_id: string
          updated_at: string
        }
        Insert: {
          alumni_id: string
          alumni_response?: string | null
          created_at?: string
          id?: string
          job_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          student_id: string
          updated_at?: string
        }
        Update: {
          alumni_id?: string
          alumni_response?: string | null
          created_at?: string
          id?: string
          job_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          achievements: Json | null
          certifications: string[] | null
          cgpa: number | null
          college_name: string | null
          created_at: string
          department: string | null
          graduation_year: number | null
          id: string
          internships: Json | null
          job_type_preference: string | null
          placement_readiness_score: number | null
          projects: Json | null
          resume_text: string | null
          resume_url: string | null
          skills: string[] | null
          stream: string | null
          student_id: string | null
          university: string | null
          updated_at: string
        }
        Insert: {
          achievements?: Json | null
          certifications?: string[] | null
          cgpa?: number | null
          college_name?: string | null
          created_at?: string
          department?: string | null
          graduation_year?: number | null
          id: string
          internships?: Json | null
          job_type_preference?: string | null
          placement_readiness_score?: number | null
          projects?: Json | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          stream?: string | null
          student_id?: string | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: Json | null
          certifications?: string[] | null
          cgpa?: number | null
          college_name?: string | null
          created_at?: string
          department?: string | null
          graduation_year?: number | null
          id?: string
          internships?: Json | null
          job_type_preference?: string | null
          placement_readiness_score?: number | null
          projects?: Json | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          stream?: string | null
          student_id?: string | null
          university?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
      mentorship_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "active"
        | "completed"
      referral_status: "pending" | "accepted" | "rejected" | "completed"
      theme_preference: "light" | "dark" | "system"
      user_role: "student" | "alumni" | "admin"
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
      mentorship_status: [
        "pending",
        "accepted",
        "rejected",
        "active",
        "completed",
      ],
      referral_status: ["pending", "accepted", "rejected", "completed"],
      theme_preference: ["light", "dark", "system"],
      user_role: ["student", "alumni", "admin"],
    },
  },
} as const
