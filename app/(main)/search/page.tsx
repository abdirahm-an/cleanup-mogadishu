'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostGrid } from '@/components/posts/PostGrid';
import { SearchInput } from '@/components/search/SearchInput';
import { Search } from 'lucide-react';

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

interface SearchResponse {
  success: boolean;
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function highlightSearchTerms(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchSearchResults = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setPosts([]);
      setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/posts?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=12`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data: SearchResponse = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load search results. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query);
  }, [query]);

  const loadMoreResults = () => {
    if (pagination.page < pagination.pages && !loading) {
      fetchSearchResults(query, pagination.page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Cleanup Posts
            </h1>
            <div className="max-w-md">
              <SearchInput />
            </div>
          </div>

          {/* Search Results */}
          {query && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Search className="h-5 w-5" />
                <span>
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      {pagination.total} result{pagination.total !== 1 ? 's' : ''} for{' '}
                      <span className="font-medium text-gray-900">"{query}"</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">{error}</div>
              <button
                onClick={() => fetchSearchResults(query)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* No Query State */}
          {!query && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Start searching
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter a search term to find cleanup posts by title or description.
              </p>
            </div>
          )}

          {/* No Results State */}
          {query && !loading && posts.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No cleanup posts match your search for "{query}". Try different keywords or browse all posts.
              </p>
            </div>
          )}

          {/* Search Results Grid */}
          {posts.length > 0 && !loading && (
            <>
              <PostGrid 
                posts={posts.map(post => ({
                  ...post,
                  title: post.title,
                  description: post.description
                }))}
                showEmpty={false}
              />
              
              {/* Load More Button */}
              {pagination.page < pagination.pages && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreResults}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}