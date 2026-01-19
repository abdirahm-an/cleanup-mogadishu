import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const includeCounts = searchParams.get('includeCounts') === 'true';
    
    if (!districtId) {
      return NextResponse.json(
        { error: 'District ID is required' },
        { status: 400 }
      );
    }

    if (includeCounts) {
      // Get neighborhoods with post counts
      const neighborhoods = await db.neighborhood.findMany({
        where: { districtId },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          districtId: true,
          _count: {
            select: {
              posts: {
                where: {
                  status: { not: 'DRAFT' }
                }
              }
            }
          }
        }
      });

      const neighborhoodsWithCounts = neighborhoods.map(neighborhood => ({
        id: neighborhood.id,
        name: neighborhood.name,
        districtId: neighborhood.districtId,
        postCount: neighborhood._count.posts,
      }));

      return NextResponse.json({
        success: true,
        neighborhoods: neighborhoodsWithCounts
      });
    } else {
      // Original behavior - just return neighborhoods without counts
      const neighborhoods = await db.neighborhood.findMany({
        where: { districtId },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          districtId: true,
        }
      });

      return NextResponse.json({
        success: true,
        neighborhoods
      });
    }

  } catch (error) {
    console.error('Get neighborhoods error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}