import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Flag, Eye, Users, Shield } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Moderator Dashboard - Cleanup Mogadishu",
  description: "Content moderation dashboard for managing flagged content and user reports",
}

export default async function ModeratorDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    redirect("/dashboard")
  }

  // In a real implementation, we would fetch stats from the database
  const stats = {
    pendingFlags: 0,
    resolvedToday: 0,
    activeModerators: 1,
    totalReports: 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage content moderation and review flagged posts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingFlags}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              Actions taken today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Moderators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeModerators}</div>
            <p className="text-xs text-muted-foreground">
              Online moderators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              All time reports
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>
              Review and moderate flagged content from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/moderator/flags">
                <Button className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Review Flagged Content
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common moderation tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Review reported posts for policy violations
              </p>
              <p className="text-sm text-muted-foreground">
                • Take action on inappropriate content
              </p>
              <p className="text-sm text-muted-foreground">
                • Notify users about content issues
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}