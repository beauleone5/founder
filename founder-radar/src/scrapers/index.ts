import { ProductHuntScraper } from './ProductHuntScraper';
import { HackerNewsScraper } from './HackerNewsScraper';
import { GitHubTrendingScraper } from './GitHubTrendingScraper';
import { PerplexityUniversityScraper } from './PerplexityUniversityScraper';
import { ManualInputScraper } from './ManualInputScraper';
import { BaseScraper, ScraperResult } from './BaseScraper';
import { configManager } from '../utils/config';
import { Founder } from '../models/Founder';

export class ScraperOrchestrator {
  private scrapers: Map<string, BaseScraper>;

  constructor() {
    this.scrapers = new Map<string, BaseScraper>([
      ['producthunt', new ProductHuntScraper()],
      ['hackernews', new HackerNewsScraper()],
      ['github_trending', new GitHubTrendingScraper()],
      ['perplexity_universities', new PerplexityUniversityScraper()],
      ['manual_input', new ManualInputScraper()],
    ]);
  }

  async fetchAll(): Promise<Founder[]> {
    const sources = configManager.getSources();
    const allFounders: Founder[] = [];

    for (const [sourceName, enabled] of Object.entries(sources)) {
      if (!enabled) {
        console.log(`Skipping ${sourceName} (disabled in config)`);
        continue;
      }

      if (sourceName === 'manual_input') {
        continue;
      }

      const scraper = this.scrapers.get(sourceName);
      if (!scraper) {
        console.warn(`No scraper found for ${sourceName}`);
        continue;
      }

      try {
        console.log(`Fetching from ${sourceName}...`);
        const result = await scraper.fetch();

        if (result.error) {
          console.error(`Error from ${sourceName}: ${result.error}`);
        } else {
          console.log(`✓ Fetched ${result.founders.length} founders from ${sourceName}`);
          allFounders.push(...result.founders);
        }
      } catch (error) {
        console.error(`Exception fetching from ${sourceName}:`, error);
      }
    }

    console.log(`Total founders fetched: ${allFounders.length}`);
    return this.deduplicateFounders(allFounders);
  }

  private deduplicateFounders(founders: Founder[]): Founder[] {
    const seen = new Map<string, Founder>();

    for (const founder of founders) {
      const key = this.getFounderKey(founder);

      if (!seen.has(key)) {
        seen.set(key, founder);
      } else {
        const existing = seen.get(key)!;
        existing.sources = Array.from(new Set([...(existing.sources || []), ...(founder.sources || [])]));
        existing.urls = { ...existing.urls, ...founder.urls };
        existing.raw_data = { ...existing.raw_data, ...founder.raw_data };
      }
    }

    return Array.from(seen.values());
  }

  private getFounderKey(founder: Founder): string {
    return `${founder.name.toLowerCase()}:${founder.startup_name?.toLowerCase() || 'unknown'}`;
  }

  getManualInputScraper(): ManualInputScraper {
    return this.scrapers.get('manual_input') as ManualInputScraper;
  }
}

export const scraperOrchestrator = new ScraperOrchestrator();
