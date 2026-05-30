// ============================================================
// OPTIC — TypeScript Type Definitions
// ============================================================

export type LeadSource =
  | "website"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "referral";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export type LeadPriority = "low" | "medium" | "high";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type ConfidenceLevel = "low" | "medium" | "high";

export interface LeadInsight {
  id: number;
  lead_id: string;
  ai_summary: string | null;
  lead_intent: string | null;
  urgency_level: UrgencyLevel | null;
  recommended_action: string | null;
  lead_score: number | null;
  confidence_level: ConfidenceLevel | null;
  ai_model: string | null;
  ai_provider: string | null;
  processing_time_ms: number | null;
  processed_at: string | null;
}

export interface StatusHistory {
  from_status: LeadStatus | null;
  to_status: LeadStatus;
  changed_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  inquiry_message: string;
  status: LeadStatus;
  priority: LeadPriority;
  lead_score: number | null;
  is_demo: boolean;
  insight: LeadInsight | null;
  status_history?: StatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_leads: number;
  new_leads_today: number;
  high_priority_uncontacted: number;
  qualified_this_week: number;
  leads_by_source: Record<LeadSource, number>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedLeads {
  data: Lead[];
  pagination: PaginationMeta;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LeadFilters {
  status?: LeadStatus | "";
  priority?: LeadPriority | "";
  source?: LeadSource | "";
  search?: string;
  page?: number;
  per_page?: number;
}

// Form data types
export interface CreateLeadFormData {
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  inquiry_message: string;
  status?: LeadStatus;
  priority?: LeadPriority;
}

export interface UpdateLeadFormData extends Partial<CreateLeadFormData> {}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
