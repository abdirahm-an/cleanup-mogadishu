import { PostCard } from './PostCard';

interface Post {
  id: string;
  title: string;
  description: string;
  photos: string[];
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  district?: {
    id: string;
    name: string;
  } | null;
  neighborhood?: {
    id: string;
    name: string;
  } | null;
}

interface PostGridProps {
  posts: Post[];
  emptyMessage?: string;
  showEmpty?: boolean;
}

export function PostGrid({ 
  posts, 
  emptyMessage = "No posts found", 
  showEmpty = true 
}: PostGridProps) {
  if (posts.length === 0) {
    if (!showEmpty) return null;
    
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Be the first to report a cleanup location in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}