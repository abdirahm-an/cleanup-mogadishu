import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

interface ModeratorActionRequest {
  action: "DISMISS_FLAG" | "HIDE_POST" | "DELETE_POST" | "NOTIFY_AUTHOR"
  flagIds?: string[]
  reason?: string
  notifyAuthor?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== "MODERATOR") {
      return NextResponse.json(
        { error: "Forbidden - Moderator access required" },
        { status: 403 }
      )
    }

    const postId = (await params).id
    const body: ModeratorActionRequest = await request.json()
    const { action, flagIds, reason, notifyAuthor = false } = body

    // Verify the post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        flags: true,
        author: true,
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Start a transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // Log the moderator action
      await tx.moderationAction.create({
        data: {
          postId,
          moderatorId: session.user.id,
          action,
          reason: reason || null,
        }
      })

      switch (action) {
        case "DISMISS_FLAG":
          // Update flag status to DISMISSED for specified flags or all pending flags
          const flagsToUpdate = flagIds || post.flags.filter(f => f.status === 'PENDING').map(f => f.id)
          
          await tx.flag.updateMany({
            where: {
              id: { in: flagsToUpdate },
              postId,
            },
            data: {
              status: 'DISMISSED',
            }
          })
          break

        case "HIDE_POST":
          // Update post status to hide it
          await tx.post.update({
            where: { id: postId },
            data: {
              status: 'ARCHIVED', // Using ARCHIVED as "hidden" status
            }
          })

          // Mark all pending flags as resolved
          await tx.flag.updateMany({
            where: {
              postId,
              status: 'PENDING',
            },
            data: {
              status: 'RESOLVED',
            }
          })
          break

        case "DELETE_POST":
          // Mark all pending flags as resolved before deletion
          await tx.flag.updateMany({
            where: {
              postId,
              status: 'PENDING',
            },
            data: {
              status: 'RESOLVED',
            }
          })

          // Delete the post (this will cascade delete related data)
          await tx.post.delete({
            where: { id: postId }
          })
          break

        case "NOTIFY_AUTHOR":
          // For now, just log the action. In a real app, you might send an email or notification
          console.log(`Notification sent to ${post.author.email} about post: ${postId}`)
          break

        default:
          throw new Error(`Unknown action: ${action}`)
      }

      // If notifyAuthor is true, log a notification action
      if (notifyAuthor && action !== "NOTIFY_AUTHOR") {
        await tx.moderationAction.create({
          data: {
            postId: action === "DELETE_POST" ? null : postId,
            moderatorId: session.user.id,
            action: "NOTIFY_AUTHOR",
            reason: `Author notified about ${action.toLowerCase().replace('_', ' ')}`,
          }
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `${action} completed successfully`,
      action,
      postId 
    })

  } catch (error) {
    console.error("Error performing moderator action:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}