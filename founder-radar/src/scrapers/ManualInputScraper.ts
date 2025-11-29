import { BaseScraper, ScraperResult } from './BaseScraper';
import { Founder } from '../models/Founder';

export class ManualInputScraper extends BaseScraper {
  constructor() {
    super('manual_input');
  }

  async fetch(): Promise<ScraperResult> {
    return {
      founders: [],
      source: this.sourceName,
      fetchedAt: new Date(),
    };
  }

  async addManualFounder(data: {
    name: string;
    url: string;
    startup_name?: string;
    description?: string;
  }): Promise<Founder> {
    return this.createFounderFromData({
      name: data.name,
      startup_name: data.startup_name,
      urls: {
        source: data.url,
      },
      description: data.description,
    });
  }
}
