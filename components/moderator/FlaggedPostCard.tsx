"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Eye, EyeOff, Trash2, X, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

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

interface FlaggedPostCardProps {
  post: FlaggedPost
}

export function FlaggedPostCard({ post }: FlaggedPostCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [actionReason, setActionReason] = useState("")
  const [notifyAuthor, setNotifyAuthor] = useState(true)
  
  const pendingFlags = post.flags.filter(flag => flag.status === 'PENDING')
  const resolvedFlags = post.flags.filter(flag => flag.status === 'RESOLVED')
  
  const handleModeratorAction = async (action: string, flagIds?: string[]) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/moderator/flags/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          flagIds: flagIds || pendingFlags.map(f => f.id),
          reason: actionReason || undefined,
          notifyAuthor,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to perform action')
      }

      const result = await response.json()
      
      toast.success(`Action completed: ${action.replace('_', ' ').toLowerCase()}`)
      setActionReason("")
      
      // Refresh the page to update the data
      router.refresh()
      
    } catch (error) {
      console.error('Error performing moderator action:', error)
      toast.error('Failed to perform action. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'spam':
        return 'bg-red-100 text-red-800'
      case 'inappropriate':
        return 'bg-orange-100 text-orange-800'
      case 'misleading':
        return 'bg-yellow-100 text-yellow-800'
      case 'other':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <CardDescription>
              By {post.author.name} • Posted {formatDate(post.createdAt)}
            </CardDescription>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={pendingFlags.length > 0 ? "destructive" : "secondary"}>
                {pendingFlags.length} pending flag{pendingFlags.length !== 1 ? 's' : ''}
              </Badge>
              {resolvedFlags.length > 0 && (
                <Badge variant="outline">
                  {resolvedFlags.length} resolved
                </Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {post.status.toLowerCase()}
              </Badge>
            </div>
          </div>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Post Content</Label>
          <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded-lg">
            {post.description}
          </p>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-3 block">Flag Details</Label>
          <div className="space-y-3">
            {post.flags.map((flag) => (
              <div key={flag.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getReasonColor(flag.reason)}>
                      {flag.reason}
                    </Badge>
                    <Badge variant={flag.status === 'PENDING' ? 'destructive' : 'secondary'}>
                      {flag.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reported by {flag.user.name} • {formatDate(flag.createdAt)}
                  </p>
                  {flag.comment && (
                    <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                      "{flag.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {pendingFlags.length > 0 && (
          <>
            <Separator />
            <div>
              <Label className="text-sm font-medium mb-3 block">Moderator Actions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isLoading}>
                      <X className="mr-2 h-4 w-4" />
                      Dismiss Flags
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dismiss Flags</DialogTitle>
                      <DialogDescription>
                        Mark these flags as resolved without taking action on the post.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dismiss-reason">Reason (optional)</Label>
                        <Textarea
                          id="dismiss-reason"
                          placeholder="Why are you dismissing these flags?"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notify-author-dismiss"
                          checked={notifyAuthor}
                          onCheckedChange={setNotifyAuthor}
                        />
                        <Label htmlFor="notify-author-dismiss">
                          Notify post author
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleModeratorAction('DISMISS_FLAG')}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          Dismiss Flags
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isLoading}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Hide Post</DialogTitle>
                      <DialogDescription>
                        Hide this post from public view while keeping it in the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hide-reason">Reason</Label>
                        <Textarea
                          id="hide-reason"
                          placeholder="Why are you hiding this post?"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notify-author-hide"
                          checked={notifyAuthor}
                          onCheckedChange={setNotifyAuthor}
                        />
                        <Label htmlFor="notify-author-hide">
                          Notify post author
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleModeratorAction('HIDE_POST')}
                          disabled={isLoading || !actionReason.trim()}
                          variant="destructive"
                          className="flex-1"
                        >
                          Hide Post
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Post</DialogTitle>
                      <DialogDescription>
                        Permanently delete this post. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="delete-reason">Reason</Label>
                        <Textarea
                          id="delete-reason"
                          placeholder="Why are you deleting this post?"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notify-author-delete"
                          checked={notifyAuthor}
                          onCheckedChange={setNotifyAuthor}
                        />
                        <Label htmlFor="notify-author-delete">
                          Notify post author
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleModeratorAction('DELETE_POST')}
                          disabled={isLoading || !actionReason.trim()}
                          variant="destructive"
                          className="flex-1"
                        >
                          Delete Post
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notify Only
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}