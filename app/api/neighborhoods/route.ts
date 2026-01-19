import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const neighborhoods = await db.neighborhood.findMany({
      include: {
        district: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { district: { name: "asc" } },
        { name: "asc" },
      ],
    })

    return NextResponse.json({ neighborhoods })
  } catch (error) {
    console.error("Error fetching neighborhoods:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}