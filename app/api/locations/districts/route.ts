import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
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

  } catch (error) {
    console.error('Get districts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}