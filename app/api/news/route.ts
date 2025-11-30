import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchNewsForCompanies } from '@/lib/newsFetcher';
import { scoreImpact } from '@/lib/impactScoring';
import { NewsItemWithScore } from '@/lib/types';

/**
 * GET /api/news?userId=...
 * Fetches news for all companies followed by a user, adds impact scores,
 * and returns them sorted by score and date
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get all companies followed by this user
    const follows = await prisma.userCompanyFollow.findMany({
      where: { userId },
      include: {
        company: true,
      },
    });

    if (follows.length === 0) {
      return NextResponse.json({ news: [] });
    }

    const companies = follows.map(follow => follow.company);

    // Fetch news for all companies
    const news = await fetchNewsForCompanies(companies);

    // Add impact scores to each article
    const newsWithScores: NewsItemWithScore[] = news.map(article => ({
      ...article,
      impactScore: scoreImpact(article),
    }));

    // Sort by impact score (desc), then by published date (desc)
    newsWithScores.sort((a, b) => {
      if (b.impactScore !== a.impactScore) {
        return b.impactScore - a.impactScore;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return NextResponse.json({ news: newsWithScores });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
