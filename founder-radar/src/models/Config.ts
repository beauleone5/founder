export interface SourceConfig {
  producthunt: boolean;
  hackernews: boolean;
  github_trending: boolean;
  angellist: boolean;
  yc_directory: boolean;
  perplexity_universities: boolean;
  manual_input: boolean;
}

export interface FilterConfig {
  university?: string[];
  age_range?: [number, number];
  location?: string[];
  product_niche?: string[];
  technical_background?: string[];
  min_execution_score?: number;
  min_technical_score?: number;
  exclude_non_technical?: boolean;
}

export interface ScoreWeights {
  execution_velocity: number;
  technical_depth: number;
  momentum_score: number;
  market_potential: number;
  credibility: number;
}

export interface ScrapingConfig {
  max_items_per_source: number;
  fetch_interval_hours: number;
}

export interface AppConfig {
  sources: SourceConfig;
  filters: FilterConfig;
  weights: ScoreWeights;
  scraping: ScrapingConfig;
}
