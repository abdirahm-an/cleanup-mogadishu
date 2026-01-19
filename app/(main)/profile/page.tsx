import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileCard } from "@/components/profile/ProfileCard"

async function getProfile(userId: string) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
    headers: {
      'Cookie': `next-auth.session-token=placeholder` // This will be handled by auth() middleware
    },
    cache: 'no-store'
  })
  
  // Since we're server-side, we'll fetch directly from the database
  const { db } = await import("@/lib/db")
  
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return user
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const user = await getProfile(session.user.id)
  
  if (!user) {
    redirect("/login")
  }
  
  // Convert dates to strings for serialization
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your profile information and preferences
          </p>
        </div>
        
        <div className="flex justify-center">
          <ProfileCard user={serializedUser} />
        </div>
      </div>
    </div>
  )
}