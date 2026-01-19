"use client";

import { Search, Users } from "lucide-react";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalUsers: number;
  filteredUsers: number;
}

export function UserSearch({ 
  searchQuery, 
  onSearchChange, 
  totalUsers, 
  filteredUsers 
}: UserSearchProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Search Users</h2>
        </div>
        <div className="text-sm text-gray-600">
          {searchQuery ? (
            <span>
              {filteredUsers} of {totalUsers} users
            </span>
          ) : (
            <span>{totalUsers} total users</span>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users by name or email..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {searchQuery && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Searching for: <span className="font-medium text-gray-900">"{searchQuery}"</span>
          </span>
          <button
            onClick={() => onSearchChange("")}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}