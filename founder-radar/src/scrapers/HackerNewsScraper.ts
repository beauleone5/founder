import axios from 'axios';
import { BaseScraper, ScraperResult } from './BaseScraper';
import { Founder } from '../models/Founder';

export class HackerNewsScraper extends BaseScraper {
  private apiBase = 'https://hacker-news.firebaseio.com/v0';

  constructor() {
    super('hackernews');
  }

  async fetch(): Promise<ScraperResult> {
    console.log('Fetching from HackerNews...');

    try {
      const newStoriesResponse = await axios.get(`${this.apiBase}/newstories.json`);
      const storyIds = newStoriesResponse.data.slice(0, 100);

      const founders: Founder[] = [];

      for (const id of storyIds) {
        try {
          const story = await this.fetchStory(id);
          if (story && this.isShowHN(story.title)) {
            const founder = this.parseHNStory(story);
            if (founder) {
              founders.push(founder);
            }
          }

          if (founders.length >= 20) break;
        } catch (error) {
          console.error(`Error fetching HN story ${id}:`, error);
        }
      }

      return {
        founders,
        source: this.sourceName,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error('HackerNews fetch error:', error);
      return {
        founders: [],
        source: this.sourceName,
        fetchedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async fetchStory(id: number): Promise<any> {
    const response = await axios.get(`${this.apiBase}/item/${id}.json`);
    return response.data;
  }

  private isShowHN(title: string): boolean {
    return /^Show HN:/i.test(title);
  }

  private parseHNStory(story: any): Founder | null {
    if (!story.by) return null;

    const title = story.title.replace(/^Show HN:\s*/i, '');

    return this.createFounderFromData({
      name: story.by,
      startup_name: this.extractStartupName(title),
      urls: {
        hackernews: `https://news.ycombinator.com/item?id=${story.id}`,
        website: story.url,
      },
      description: story.text || title,
      niche: this.extractNiche(title + ' ' + (story.text || '')),
    });
  }

  private extractStartupName(title: string): string {
    const match = title.match(/^([^–—-]+)/);
    return match ? match[1].trim() : title.trim();
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
