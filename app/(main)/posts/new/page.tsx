import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';

export const metadata = {
  title: 'Create New Post - Cleanup Mogadishu',
  description: 'Create a new cleanup location post',
};

export default async function NewPostPage() {
  // Require authentication
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/posts/new');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit a Cleanup Location
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help make Mogadishu cleaner by reporting locations that need attention. 
          Upload photos and provide details to get the community involved.
        </p>
      </div>

      <PostForm />
    </div>
  );
}