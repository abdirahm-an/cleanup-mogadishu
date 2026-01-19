"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserCard } from "@/components/moderator/UserCard";
import { UserSearch } from "@/components/moderator/UserSearch";

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

export default function ModeratorUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has moderator access
  if (session?.user?.role !== "MODERATOR" && session?.user?.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need moderator permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/moderator/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (
    userId: string,
    action: string,
    reason?: string
  ) => {
    try {
      const response = await fetch(`/api/moderator/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Refresh users list
      await fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Manage user accounts, view activity, and take moderation actions.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-6">
        <UserSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalUsers={users.length}
          filteredUsers={filteredUsers.length}
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onAction={handleUserAction}
            currentUserRole={session?.user?.role || "USER"}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchQuery ? "No users found matching your search." : "No users found."}
          </p>
        </div>
      )}
    </div>
  );
}