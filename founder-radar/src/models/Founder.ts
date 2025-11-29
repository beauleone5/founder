export interface Founder {
  founder_id?: number;
  name: string;
  startup_name?: string;
  age?: number;
  location?: string;
  university?: string;
  niche?: string;
  sources?: string[];
  urls?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    product?: string;
    [key: string]: string | undefined;
  };
  raw_data?: any;
  ai_bio?: string;
  ai_execution_evidence?: string;
  ai_technical_summary?: string;
  ai_market_summary?: string;
  ai_momentum_signals?: string;
  ai_risks?: string;
  ai_email_template?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Score {
  score_id?: number;
  founder_id: number;
  execution_velocity: number;
  technical_depth: number;
  momentum_score: number;
  market_potential: number;
  credibility: number;
  custom_score_weights?: {
    execution_velocity: number;
    technical_depth: number;
    momentum_score: number;
    market_potential: number;
    credibility: number;
  };
  total_score: number;
  score_explanation?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FounderWithScore extends Founder {
  score?: Score;
}
