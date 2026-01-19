import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PostGrid } from '@/components/posts/PostGrid';
import { Plus, MapPin, Users, CheckCircle } from 'lucide-react';

async function getLatestPosts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts?limit=8`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch posts during build');
      return [];
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Cleanup 
              <span className="text-primary-600"> Mogadishu</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Join our community effort to clean and beautify Mogadishu. 
              Report areas that need attention, coordinate cleanup events, and track our progress together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/posts/new">
                <Button size="lg" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Plus className="w-5 h-5" />
                  Report a Location
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View All Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center px-4">
              <MapPin className="w-8 h-8 mb-2" />
              <div className="text-2xl sm:text-3xl font-bold">{latestPosts.length}</div>
              <div className="text-primary-100 text-sm sm:text-base">Locations Reported</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <Users className="w-8 h-8 mb-2" />
              <div className="text-2xl sm:text-3xl font-bold">
                {new Set(latestPosts.map((post: any) => post.author?.id)).size}
              </div>
              <div className="text-primary-100 text-sm sm:text-base">Active Contributors</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <CheckCircle className="w-8 h-8 mb-2" />
              <div className="text-2xl sm:text-3xl font-bold">
                {latestPosts.filter((post: any) => post.status === 'COMPLETED').length}
              </div>
              <div className="text-primary-100 text-sm sm:text-base">Areas Cleaned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 px-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Recent Reports
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Latest cleanup locations reported by our community
                </p>
              </div>
              {latestPosts.length > 0 && (
                <Link href="/posts" className="self-start">
                  <Button variant="outline">
                    View All Posts
                  </Button>
                </Link>
              )}
            </div>

            <PostGrid 
              posts={latestPosts}
              emptyMessage="No cleanup locations reported yet"
              showEmpty={true}
            />

            {latestPosts.length === 0 && (
              <div className="text-center mt-8 px-4">
                <Link href="/posts/new">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Plus className="w-5 h-5 mr-2" />
                    Be First to Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Every report helps us identify areas that need attention. 
              Join thousands of residents working together for a cleaner Mogadishu.
            </p>
            <Link href="/posts/new">
              <Button size="lg" className="flex items-center justify-center gap-2 mx-auto w-full sm:w-auto">
                <Plus className="w-5 h-5" />
                Report a Location Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
