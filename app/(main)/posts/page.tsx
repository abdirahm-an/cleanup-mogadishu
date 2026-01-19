import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { PostGrid } from '@/components/posts/PostGrid';
import { Plus, Filter, Search } from 'lucide-react';

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
    district?: string;
    neighborhood?: string;
    status?: string;
    search?: string;
  }>;
}

async function getPosts(params: {
  page?: string;
  district?: string;
  neighborhood?: string;
  status?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page);
  if (params.district) searchParams.set('districtId', params.district);
  if (params.neighborhood) searchParams.set('neighborhoodId', params.neighborhood);
  if (params.status) searchParams.set('status', params.status);
  
  searchParams.set('limit', '12');

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/posts?${searchParams.toString()}`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], pagination: { page: 1, pages: 0, total: 0 } };
  }
}

async function getDistricts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/locations/districts`);
    if (!response.ok) throw new Error('Failed to fetch districts');
    const data = await response.json();
    return data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}

function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl 
}: { 
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link href={`${baseUrl}?page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">Previous</Button>
        </Link>
      )}
      
      {startPage > 1 && (
        <>
          <Link href={`${baseUrl}?page=1`}>
            <Button variant="outline" size="sm">1</Button>
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <Link key={page} href={`${baseUrl}?page=${page}`}>
          <Button 
            variant={page === currentPage ? "default" : "outline"} 
            size="sm"
          >
            {page}
          </Button>
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link href={`${baseUrl}?page=${totalPages}`}>
            <Button variant="outline" size="sm">{totalPages}</Button>
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link href={`${baseUrl}?page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">Next</Button>
        </Link>
      )}
    </div>
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const [data, districts] = await Promise.all([
    getPosts(params),
    getDistricts()
  ]);

  const currentPage = parseInt(params.page || '1');
  const { posts, pagination } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'PUBLISHED', label: 'Open', color: 'bg-green-500' },
    { value: 'UNDER_REVIEW', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cleanup Locations
              </h1>
              <p className="text-gray-600 mt-1">
                {pagination.total} location{pagination.total !== 1 ? 's' : ''} reported by our community
              </p>
            </div>
            <Link href="/posts/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Report Location
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Filter by Status</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/posts"
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !params.status 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Posts
              </Link>
              {statusOptions.map(option => (
                <Link 
                  key={option.value}
                  href={`/posts?status=${option.value}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    params.status === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <PostGrid 
            posts={posts}
            emptyMessage="No posts found matching your filters"
            showEmpty={true}
          />

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={pagination.pages}
            baseUrl="/posts"
          />

          {/* Stats */}
          {posts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {posts.filter((p: any) => p.status === 'PUBLISHED').length}
                  </div>
                  <div className="text-sm text-gray-600">Open Reports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {posts.filter((p: any) => p.status === 'UNDER_REVIEW').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {posts.filter((p: any) => p.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(posts.map((p: any) => p.district?.name)).size}
                  </div>
                  <div className="text-sm text-gray-600">Districts Covered</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}