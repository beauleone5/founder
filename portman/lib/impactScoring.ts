import { NewsItem } from './types';

const HIGH_IMPACT_KEYWORDS = [
  'acquisition',
  'merger',
  'series a',
  'series b',
  'series c',
  'funding',
  'raises',
  'raised',
  'layoffs',
  'layoff',
  'ceo',
  'board',
  'investigation',
  'bankruptcy',
  'bankrupt',
  'ipo',
  'going public',
  'scandal',
  'lawsuit',
  'settlement',
  'breakthrough',
  'partnership',
  'collapse',
];

const AMOUNT_PATTERNS = [
  /\$\d+[.,]?\d*\s*(million|billion|m|b)/i,
  /\d+[.,]?\d*\s*(million|billion)\s*dollars?/i,
];

/**
 * Scores the impact of a news article from 0-10 based on keywords and patterns
 */
export function scoreImpact(article: NewsItem): number {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();

  let score = 3; // Base score

  // Check for high-impact keywords (+4 points)
  const hasHighImpactKeyword = HIGH_IMPACT_KEYWORDS.some(keyword =>
    text.includes(keyword)
  );
  if (hasHighImpactKeyword) {
    score += 4;
  }

  // Check for amount patterns (+2 points)
  const hasAmountPattern = AMOUNT_PATTERNS.some(pattern =>
    pattern.test(text)
  );
  if (hasAmountPattern) {
    score += 2;
  }

  // Additional boost for multiple high-impact keywords
  const keywordCount = HIGH_IMPACT_KEYWORDS.filter(keyword =>
    text.includes(keyword)
  ).length;
  if (keywordCount >= 2) {
    score += 1;
  }

  // Cap at 10, floor at 0
  return Math.max(0, Math.min(10, score));
}
