import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/companies/:id?userId=...
 * Unfollows a company for a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Delete the follow relationship
    await prisma.userCompanyFollow.deleteMany({
      where: {
        userId,
        companyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unfollowing company:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow company' },
      { status: 500 }
    );
  }
}
