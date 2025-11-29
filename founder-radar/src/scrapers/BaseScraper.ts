import { Founder } from '../models/Founder';

export interface ScraperResult {
  founders: Founder[];
  source: string;
  fetchedAt: Date;
  error?: string;
}

export abstract class BaseScraper {
  protected sourceName: string;

  constructor(sourceName: string) {
    this.sourceName = sourceName;
  }

  abstract fetch(): Promise<ScraperResult>;

  protected createFounderFromData(data: any): Founder {
    return {
      name: data.name || 'Unknown',
      startup_name: data.startup_name,
      sources: [this.sourceName],
      urls: data.urls || {},
      raw_data: data,
      niche: data.niche,
      location: data.location,
    };
  }
}
