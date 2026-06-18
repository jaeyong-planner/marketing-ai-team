export type ContentType = "blog" | "social" | "email" | "script" | "other";

export type ContentStatus =
  | "idea"
  | "researching"
  | "draft"
  | "pending_review"
  | "needs_revision"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "archived";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision";

export type AgentRunStatus =
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type CampaignPlatform =
  | "meta"
  | "google"
  | "x"
  | "email"
  | "organic"
  | "other";

export interface Lead {
  id: string;
  email: string;
  name: string | null;
  interest: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  campaign_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "viewer";
  created_at: string;
  updated_at: string;
}

export interface ContentCalendar {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  body_md: string | null;
  meta_json: Record<string, unknown>;
  topic: string | null;
  scheduled_at: string | null;
  agent_run_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        Profile,
        Pick<Profile, "id"> & Partial<Omit<Profile, "id">>,
        Partial<Omit<Profile, "id">>
      >;
      leads: TableDef<
        Lead,
        {
          email: string;
          name?: string | null;
          interest?: string | null;
          source?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          campaign_id?: string | null;
          metadata?: Record<string, unknown>;
        }
      >;
      content_calendar: TableDef<ContentCalendar>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}