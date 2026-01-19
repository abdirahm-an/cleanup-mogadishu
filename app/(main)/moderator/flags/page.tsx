import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FlaggedPostCard } from "@/components/moderator/FlaggedPostCard"

export const metadata: Metadata = {
  title: "Flagged Content - Moderator Dashboard",
  description: "Review and manage flagged posts",
}

interface FlaggedPost {
  id: string
  title: string
  description: string
  author: {
    id: string
    name: string
    email: string
  }
  flags: Array<{
    id: string
    reason: string
    comment: string | null
    status: string
    createdAt: string
    user: {
      id: string
      name: string
    }
  }>
  createdAt: string
  status: string
}

export default async function FlaggedContentPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    redirect("/dashboard")
  }

  try {
    // Fetch flagged posts from our API
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/moderator/flags`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch flagged posts')
    }

    const flaggedPosts: FlaggedPost[] = await response.json()

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/moderator">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Flagged Content</h1>
            <p className="text-muted-foreground mt-2">
              Review and moderate flagged posts from users
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter & Summary</CardTitle>
              <CardDescription>
                {flaggedPosts.length} flagged post{flaggedPosts.length !== 1 ? 's' : ''} pending review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  All ({flaggedPosts.length})
                </Badge>
                <Badge variant="outline">
                  Pending ({flaggedPosts.filter(p => p.flags.some(f => f.status === 'PENDING')).length})
                </Badge>
                <Badge variant="outline">
                  Resolved ({flaggedPosts.filter(p => p.flags.some(f => f.status === 'RESOLVED')).length})
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {flaggedPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No flagged posts to review. Great job keeping the community clean! 🎉
                </div>
              </CardContent>
            </Card>
          ) : (
            flaggedPosts.map((post) => (
              <FlaggedPostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading flagged posts:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/moderator">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Flagged Content</h1>
            <p className="text-muted-foreground mt-2">
              Error loading flagged posts
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Failed to load flagged posts. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}