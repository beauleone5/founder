import axios from 'axios';
import { BaseScraper, ScraperResult } from './BaseScraper';
import { Founder } from '../models/Founder';

export class GitHubTrendingScraper extends BaseScraper {
  private apiBase = 'https://api.github.com';

  constructor() {
    super('github_trending');
  }

  async fetch(): Promise<ScraperResult> {
    console.log('Fetching from GitHub Trending...');

    try {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const dateStr = date.toISOString().split('T')[0];

      const query = `created:>${dateStr} stars:>50`;
      const response = await axios.get(`${this.apiBase}/search/repositories`, {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 30,
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const founders: Founder[] = [];

      for (const repo of response.data.items) {
        try {
          const founder = await this.parseGitHubRepo(repo);
          if (founder) {
            founders.push(founder);
          }
        } catch (error) {
          console.error('Error parsing GitHub repo:', error);
        }
      }

      return {
        founders,
        source: this.sourceName,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error('GitHub fetch error:', error);
      return {
        founders: [],
        source: this.sourceName,
        fetchedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async parseGitHubRepo(repo: any): Promise<Founder | null> {
    if (!repo.owner) return null;

    try {
      const ownerData = await axios.get(repo.owner.url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const owner = ownerData.data;

      return this.createFounderFromData({
        name: owner.name || owner.login,
        startup_name: repo.name,
        urls: {
          github: owner.html_url,
          website: owner.blog || repo.homepage,
        },
        niche: this.extractNiche(repo.description || ''),
        github_stats: {
          stars: repo.stargazers_count,
          language: repo.language,
          commits: repo.size,
          description: repo.description,
        },
        location: owner.location,
      });
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      return null;
    }
  }

  private extractNiche(description: string): string | undefined {
    const niches = ['AI', 'SaaS', 'Fintech', 'DevTools', 'HealthTech', 'EdTech', 'Climate'];
    for (const niche of niches) {
      if (description.toLowerCase().includes(niche.toLowerCase())) {
        return niche;
      }
    }
    return undefined;
  }
}
