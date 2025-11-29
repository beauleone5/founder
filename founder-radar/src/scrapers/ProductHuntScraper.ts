import Parser from 'rss-parser';
import { BaseScraper, ScraperResult } from './BaseScraper';
import { Founder } from '../models/Founder';

export class ProductHuntScraper extends BaseScraper {
  private parser: Parser;
  private rssUrl = 'https://www.producthunt.com/feed';

  constructor() {
    super('producthunt');
    this.parser = new Parser();
  }

  async fetch(): Promise<ScraperResult> {
    console.log('Fetching from ProductHunt RSS...');

    try {
      const feed = await this.parser.parseURL(this.rssUrl);
      const founders: Founder[] = [];

      for (const item of feed.items) {
        try {
          const founder = this.parseProductHuntItem(item);
          if (founder) {
            founders.push(founder);
          }
        } catch (error) {
          console.error('Error parsing ProductHunt item:', error);
        }
      }

      return {
        founders,
        source: this.sourceName,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error('ProductHunt fetch error:', error);
      return {
        founders: [],
        source: this.sourceName,
        fetchedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private parseProductHuntItem(item: any): Founder | null {
    if (!item.title || !item.link) return null;

    const creatorMatch = item.content?.match(/by (.+?)(?:\s|<)/);
    const creator = creatorMatch ? creatorMatch[1] : item.creator || 'Unknown';

    return this.createFounderFromData({
      name: creator,
      startup_name: item.title,
      urls: {
        product: item.link,
        website: item.link,
      },
      niche: this.extractNiche(item.content || item.contentSnippet || ''),
      tagline: item.contentSnippet,
    });
  }

  private extractNiche(content: string): string | undefined {
    const niches = ['AI', 'SaaS', 'Fintech', 'DevTools', 'HealthTech', 'EdTech', 'Climate'];
    for (const niche of niches) {
      if (content.toLowerCase().includes(niche.toLowerCase())) {
        return niche;
      }
    }
    return undefined;
  }
}
