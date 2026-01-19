import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is moderator or admin
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const moderator = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!moderator || (moderator.role !== "MODERATOR" && moderator.role !== "ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const { action, reason } = await request.json();

    // Validate action
    const validActions = ["WARN", "SUSPEND", "ACTIVATE", "PROMOTE"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Check if target user exists
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admins can promote or take actions against other moderators/admins
    if (action === "PROMOTE" && moderator.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can promote users" }, { status: 403 });
    }

    if (targetUser.role === "ADMIN" || 
        (targetUser.role === "MODERATOR" && moderator.role !== "ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions for this action" }, { status: 403 });
    }

    // Determine new status and role based on action
    let newStatus = targetUser.status;
    let newRole = targetUser.role;

    switch (action) {
      case "WARN":
        newStatus = "WARNED";
        break;
      case "SUSPEND":
        newStatus = "SUSPENDED";
        break;
      case "ACTIVATE":
        newStatus = "ACTIVE";
        break;
      case "PROMOTE":
        newRole = "MODERATOR";
        newStatus = "ACTIVE";
        break;
    }

    // Update user in a transaction to ensure consistency
    const result = await db.$transaction(async (tx) => {
      // Update user status/role
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          status: newStatus,
          role: newRole
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true
        }
      });

      // Log the moderation action
      await tx.moderationAction.create({
        data: {
          targetId: userId,
          moderatorId: session.user.id!,
          action: action,
          reason: reason || null
        }
      });

      return updatedUser;
    });

    return NextResponse.json({
      user: result,
      message: `User ${action.toLowerCase()}ed successfully`
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}