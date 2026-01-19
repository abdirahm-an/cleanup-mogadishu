'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PhotoGallery } from '@/components/posts/PhotoGallery';
<<<<<<< HEAD
import { InterestButton } from '@/components/posts/InterestButton';
import { InterestedUsers } from '@/components/posts/InterestedUsers';
import Link from 'next/link';
import { MapPin, Calendar, User, ArrowLeft, Share2, Flag } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
=======
import { StatusBadge } from '@/components/posts/StatusBadge';
import { StatusUpdater } from '@/components/posts/StatusUpdater';
import { CompletionUpload } from '@/components/posts/CompletionUpload';
import { CelebrationAnimation } from '@/components/posts/CelebrationAnimation';
import Link from 'next/link';
import { MapPin, Calendar, User, ArrowLeft, Share2, Flag, Loader2 } from 'lucide-react';
>>>>>>> origin/ralph/US-014

interface Post {
  id: string;
  title: string;
  description: string;
  photos: string;
  status: string;
  createdAt: string;
  authorId: string;
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

<<<<<<< HEAD
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const post: any = await db.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      district: true,
      neighborhood: true,
      // interests: {
      //   include: {
      //     user: {
      //       select: {
      //         id: true,
      //         name: true,
      //         email: true,
      //         phone: true,
      //       }
      //     }
      //   }
      // }
    }
  });
=======
export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionUpload, setShowCompletionUpload] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }
>>>>>>> origin/ralph/US-014

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user is interested
  const interests = post.interests || [];
  const currentUserInterest = session?.user 
    ? interests.find((interest: any) => interest.userId === session.user.id)
    : null;

  const interestCount = interests.length;
  const isCurrentUserInterested = !!currentUserInterest;

  const photos = JSON.parse(post.photos || '[]') as string[];
  const isAuthor = session?.user?.id === post.authorId;

  const handleStatusUpdate = (newStatus: string) => {
    setPost(prev => prev ? { ...prev, status: newStatus } : null);
    
    // Show celebration for completion
    if (newStatus === 'COMPLETED') {
      setShowCelebration(true);
    }
  };

  const handleMarkCompleted = () => {
    setShowCompletionUpload(true);
  };

  const handleCompletionUpload = () => {
    setShowCompletionUpload(false);
    setPost(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
    setShowCelebration(true);
    router.refresh(); // Refresh the page data
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (showCompletionUpload) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <CompletionUpload
            postId={post.id}
            onUploadComplete={handleCompletionUpload}
            onCancel={() => setShowCompletionUpload(false)}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CelebrationAnimation 
        isVisible={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/posts">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Posts
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Post Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl lg:text-3xl mb-3">{post.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{getRelativeTime(post.createdAt.toString())}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {post.district?.name}
                            {post.neighborhood && `, ${post.neighborhood.name}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={post.status} size="md" />
                  </div>
                </CardHeader>
              </Card>

              {/* Status Management (for authors) */}
              {isAuthor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cleanup Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                      <StatusUpdater
                        postId={post.id}
                        currentStatus={post.status}
                        isAuthor={isAuthor}
                        onStatusUpdate={handleStatusUpdate}
                      />
                      
                      {post.status === 'UNDER_REVIEW' && (
                        <Button
                          onClick={handleMarkCompleted}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                    
                    {post.status !== 'COMPLETED' && (
                      <p className="text-sm text-gray-600 mt-3">
                        Update the cleanup status to track progress. Mark as completed when the area is clean.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Photos */}
              {photos.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <PhotoGallery photos={photos} title={post.title} />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reported By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{post.author.name}</div>
                      <div className="text-sm text-gray-600">Community Member</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interest Section */}
              {post.status === 'PUBLISHED' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Help Out</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        Want to help clean up this location? Let the reporter know you're interested!
                      </p>
                      <InterestButton
                        postId={post.id}
                        initialIsInterested={isCurrentUserInterested}
                        initialCount={interestCount}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interested Users (for post author) */}
              {post.status === 'PUBLISHED' && interestCount > 0 && (
                <InterestedUsers
                  postId={post.id}
                  authorId={post.author.id}
                  initialUsers={interests.map((interest: any) => ({
                    id: interest.user.id,
                    name: interest.user.name,
                    email: interest.user.email,
                    phone: interest.user.phone,
                    shareContactInfo: interest.shareContactInfo,
                    createdAt: interest.createdAt.toISOString()
                  }))}
                />
              )}

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600">District</div>
                    <div className="text-gray-900">{post.district?.name || 'Not specified'}</div>
                  </div>
                  {post.neighborhood && (
                    <div>
                      <div className="text-sm font-medium text-gray-600">Neighborhood</div>
                      <div className="text-gray-900">{post.neighborhood.name}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-600">Reported</div>
                    <div className="text-gray-900">{new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {new Date(post.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/posts/new" className="block">
                  <Button className="w-full">Report Another Location</Button>
                </Link>
                <Link href="/posts" className="block">
                  <Button variant="outline" className="w-full">View All Posts</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}