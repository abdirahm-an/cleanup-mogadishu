import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/ProfileForm"

async function getProfile(userId: string) {
  // Fetch directly from the database since we're server-side
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

export default async function EditProfilePage() {
  const session = await auth()
  
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-lg text-gray-600 mt-2">
            Update your profile information and preferences
          </p>
        </div>
        
        <div className="flex justify-center">
          <ProfileForm user={serializedUser} />
        </div>
      </div>
    </div>
  )
}