import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCounts = searchParams.get('includeCounts') === 'true';

    if (includeCounts) {
      // Get districts with post counts
      const districts = await db.district.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
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

      const districtsWithCounts = districts.map(district => ({
        id: district.id,
        name: district.name,
        postCount: district._count.posts,
      }));

      return NextResponse.json({
        success: true,
        districts: districtsWithCounts
      });
    } else {
      // Original behavior - just return districts without counts
      const districts = await db.district.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
        }
      });

      return NextResponse.json({
        success: true,
        districts
      });
    }

  } catch (error) {
    console.error('Get districts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}