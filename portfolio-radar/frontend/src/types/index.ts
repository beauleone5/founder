export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Company {
  id: number;
  name: string;
  sector: string;
  website?: string;
  logo?: string;
  description?: string;
  competitor_list?: string[];
}

export interface DailyInsight {
  id: number;
  company_id: number;
  date: string;
  daily_summary?: string;
  top_insights?: string[];
  risk_score?: number;
  opportunity_score?: number;
  must_know?: string;
  news_data?: any;
  github_data?: any;
  competitor_data?: any;
}

export interface CompanyDashboardCard {
  company: Company;
  latest_insight?: DailyInsight;
}

export interface DashboardResponse {
  companies: CompanyDashboardCard[];
  top_alerts: string[];
}
