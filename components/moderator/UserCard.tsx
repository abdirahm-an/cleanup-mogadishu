"use client";

import { useState } from "react";
import { 
  User, 
  Calendar, 
  Mail, 
  AlertTriangle, 
  MessageSquare,
  Shield,
  Ban,
  UserCheck
} from "lucide-react";

interface UserWithStats {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  _count: {
    posts: number;
    flags: number;
  };
}

interface UserCardProps {
  user: UserWithStats;
  onAction: (userId: string, action: string, reason?: string) => Promise<void>;
  currentUserRole: string;
}

export function UserCard({ user, onAction, currentUserRole }: UserCardProps) {
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "WARNED":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800";
      case "USER":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "WARN" || action === "SUSPEND") {
      setPendingAction(action);
      setShowReasonModal(true);
    } else {
      handleAction(action);
    }
  };

  const handleAction = async (action: string, reasonText?: string) => {
    setLoading(true);
    try {
      await onAction(user.id, action, reasonText);
      setShowReasonModal(false);
      setPendingAction(null);
      setReason("");
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const canPromote = currentUserRole === "ADMIN" && user.role === "USER";
  const canTakeAction = user.role !== "ADMIN" && (currentUserRole === "MODERATOR" || currentUserRole === "ADMIN");

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-100 rounded-full p-3">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-900">{user._count.posts}</span> posts
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-900">{user._count.flags}</span> flags
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {canTakeAction && (
            <div className="flex items-center space-x-2">
              {user.status === "ACTIVE" && (
                <button
                  onClick={() => handleActionClick("WARN")}
                  disabled={loading}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md hover:bg-yellow-100 disabled:opacity-50"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Warn</span>
                </button>
              )}
              
              {(user.status === "ACTIVE" || user.status === "WARNED") && (
                <button
                  onClick={() => handleActionClick("SUSPEND")}
                  disabled={loading}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
                >
                  <Ban className="h-4 w-4" />
                  <span>Suspend</span>
                </button>
              )}
              
              {user.status === "SUSPENDED" && (
                <button
                  onClick={() => handleAction("ACTIVATE")}
                  disabled={loading}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Activate</span>
                </button>
              )}
              
              {canPromote && (
                <button
                  onClick={() => handleAction("PROMOTE")}
                  disabled={loading}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
                >
                  <Shield className="h-4 w-4" />
                  <span>Promote</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {pendingAction === "WARN" ? "Warn User" : "Suspend User"}
            </h3>
            
            <p className="text-gray-600 mb-4">
              Please provide a reason for this action. This will be logged for record keeping.
            </p>
            
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for action..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setPendingAction(null);
                  setReason("");
                }}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(pendingAction!, reason)}
                disabled={loading || !reason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}