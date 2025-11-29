import axios from 'axios';
import { BaseScraper, ScraperResult } from './BaseScraper';
import { Founder } from '../models/Founder';
import dotenv from 'dotenv';

dotenv.config();

export class PerplexityUniversityScraper extends BaseScraper {
  private apiKey: string;
  private apiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    super('perplexity_universities');
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  async fetch(): Promise<ScraperResult> {
    console.log('Fetching from Perplexity API (Universities)...');

    if (!this.apiKey) {
      return {
        founders: [],
        source: this.sourceName,
        fetchedAt: new Date(),
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const query = this.buildQuery();
      const response = await this.queryPerplexity(query);
      const founders = this.parsePerplexityResponse(response);

      return {
        founders,
        source: this.sourceName,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error('Perplexity fetch error:', error);
      return {
        founders: [],
        source: this.sourceName,
        fetchedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildQuery(): string {
    const universities = [
      "Queen's University",
      "University of Waterloo",
      "University of Toronto",
      "Stanford University",
      "MIT",
      "UC Berkeley"
    ];

    return `Find recent founder-led tech startups and projects launched in the past month by students or recent graduates from ${universities.join(', ')}. For each founder, provide their name, university, startup/project name, and a brief description. Focus on AI, fintech, devtools, and climate tech.`;
  }

  private async queryPerplexity(query: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant that finds information about university founders and startups. Return results in a structured format with clear separation between each founder.',
            },
            {
              role: 'user',
              content: query,
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }

  private parsePerplexityResponse(response: string): Founder[] {
    const founders: Founder[] = [];

    const founderBlocks = response.split(/\n\n+/);

    for (const block of founderBlocks) {
      const nameMatch = block.match(/(?:Name|Founder):\s*([^\n]+)/i);
      const universityMatch = block.match(/University:\s*([^\n]+)/i);
      const startupMatch = block.match(/(?:Startup|Project|Company):\s*([^\n]+)/i);
      const descriptionMatch = block.match(/Description:\s*([^\n]+)/i);

      if (nameMatch) {
        founders.push(
          this.createFounderFromData({
            name: nameMatch[1].trim(),
            university: universityMatch ? universityMatch[1].trim() : undefined,
            startup_name: startupMatch ? startupMatch[1].trim() : undefined,
            description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
            urls: {},
          })
        );
      }
    }

    return founders;
  }
}
