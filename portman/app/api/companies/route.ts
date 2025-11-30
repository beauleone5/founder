import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/companies?userId=...
 * Returns the list of companies followed by a user
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const companies = follows.map(follow => follow.company);

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies
 * Body: { userId: string, name: string, ticker?: string }
 * Creates or finds a company and adds a follow relationship
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, ticker } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'userId and name are required' },
        { status: 400 }
      );
    }

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `anonymous+${userId}@boardsignal.app`,
        },
      });
    }

    // Find or create company (exact match)
    let company = await prisma.company.findFirst({
      where: {
        name: name,
        ticker: ticker || null,
      },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name,
          ticker: ticker || null,
        },
      });
    }

    // Check if follow already exists
    const existingFollow = await prisma.userCompanyFollow.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: company.id,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this company' },
        { status: 400 }
      );
    }

    // Create follow relationship
    await prisma.userCompanyFollow.create({
      data: {
        userId,
        companyId: company.id,
      },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company follow:', error);
    return NextResponse.json(
      { error: 'Failed to follow company' },
      { status: 500 }
    );
  }
}
