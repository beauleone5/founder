import { v4 as uuidv4 } from 'uuid';
import { NewsItem, Company } from './types';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Generates mock news data for development/demo purposes
 */
function generateMockNews(company: Company): NewsItem[] {
  const mockArticles = [
    {
      title: `${company.name} announces Series B funding round of $50M`,
      description: `${company.name} has successfully raised $50 million in Series B funding to expand operations and accelerate growth.`,
      source: 'TechCrunch',
      url: `https://example.com/news/${company.id}/funding`,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      title: `${company.name} CEO discusses future plans in exclusive interview`,
      description: `In a recent interview, the CEO of ${company.name} outlined the company's strategic vision for the next five years.`,
      source: 'Bloomberg',
      url: `https://example.com/news/${company.id}/ceo-interview`,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      title: `Market analysis: ${company.name} shows strong growth potential`,
      description: `Analysts predict strong performance for ${company.name} in the coming quarters based on recent market trends.`,
      source: 'Financial Times',
      url: `https://example.com/news/${company.id}/market-analysis`,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ];

  return mockArticles.map(article => ({
    id: uuidv4(),
    companyId: company.id,
    companyName: company.name,
    ...article,
  }));
}

/**
 * Fetches news from NewsAPI.org for a specific company
 */
async function fetchNewsFromAPI(company: Company): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY is not configured');
  }

  const query = company.ticker
    ? `${company.name} OR ${company.ticker}`
    : company.name;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const params = new URLSearchParams({
    q: query,
    from: sevenDaysAgo.toISOString().split('T')[0],
    sortBy: 'publishedAt',
    language: 'en',
    pageSize: '10',
    apiKey: NEWS_API_KEY,
  });

  try {
    const response = await fetch(`${NEWS_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`);
    }

    return (data.articles || []).map((article: any) => ({
      id: uuidv4(),
      companyId: company.id,
      companyName: company.name,
      title: article.title || 'Untitled',
      source: article.source?.name || 'Unknown',
      url: article.url || '#',
      publishedAt: article.publishedAt || new Date().toISOString(),
      description: article.description || '',
    }));
  } catch (error) {
    console.error(`Failed to fetch news for ${company.name}:`, error);
    return [];
  }
}

/**
 * Fetches news for a company, using real API if configured, otherwise mock data
 */
export async function fetchNewsForCompany(company: Company): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.log(`No NEWS_API_KEY found, using mock data for ${company.name}`);
    return generateMockNews(company);
  }

  return fetchNewsFromAPI(company);
}

/**
 * Fetches news for multiple companies
 */
export async function fetchNewsForCompanies(companies: Company[]): Promise<NewsItem[]> {
  const newsPromises = companies.map(company => fetchNewsForCompany(company));
  const newsArrays = await Promise.all(newsPromises);

  // Flatten the array of arrays
  return newsArrays.flat();
}
