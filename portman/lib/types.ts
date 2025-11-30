export interface NewsItem {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
}

export interface NewsItemWithScore extends NewsItem {
  impactScore: number;
}

export interface Company {
  id: string;
  name: string;
  ticker: string | null;
}
