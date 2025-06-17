
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Image, FileText } from 'lucide-react';
import PostCard from '../PostCard';
import CreatePostModal from './CreatePostModal';
import { useFeedData } from '@/hooks/useFeedData';
import PostCardSkeleton from '../PostCardSkeleton';
import FeedLoadingIndicator from '../FeedLoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';

const MainFeed: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    allPosts,
    isLoading,
    isError,
    refetch,
    hasMore,
    isLoadingMore,
    loadMoreRef,
    handleLike,
    handleBookmark,
    handleNavigate,
    createPost
  } = useFeedData();

  const handleRetry = () => {
    refetch();
  };

  // Avatar click handler
  const handleAvatarClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (user?.username) {
      navigate(`/profile/${encodeURIComponent(user.username)}`);
    }
  };
  // Handle creating a post
  const handleCreatePost = async (data: { content: string }) => {
    return await createPost({ content: data.content, visibility: 'public' });
  };

  if (isLoading && allPosts.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Start Post Skeleton */}
        <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)]">
          <CardContent className="p-3 md:p-4">
            <div className="flex space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-10 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Post Skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError && allPosts.length === 0) {
    return (
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)]">
        <CardContent className="p-6 md:p-8 text-center">
          <p className="text-muted-foreground mb-4">Failed to load feed</p>
          <Button onClick={handleRetry} className="min-h-[44px]">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Start a Post */}
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
        <CardContent className="p-3 md:p-4">
          <div className="flex space-x-2 md:space-x-3">
            {/* Avatar clickable */}            <button
              onClick={handleAvatarClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAvatarClick(e); }}
              aria-label="Go to your profile"
              tabIndex={0}
              type="button"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12">
                <AvatarImage src={typeof user?.avatar === 'string' ? user?.avatar : undefined} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
            <div className="flex-1">
              <Input
                placeholder="Start a post"
                className="cursor-pointer bg-[var(--background-100)] dark:bg-[var(--background-700)] border-[var(--border)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-600)] transition-colors rounded-full h-10 md:h-12 text-sm md:text-base"
                onClick={() => setShowCreateModal(true)}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-[var(--border)]">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 md:space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)] min-h-[44px] px-2 md:px-3 text-xs md:text-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Video className="h-4 w-4 md:h-5 md:w-5" />
              <span>Video</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 md:space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)] min-h-[44px] px-2 md:px-3 text-xs md:text-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Image className="h-4 w-4 md:h-5 md:w-5" />
              <span>Photo</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 md:space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)] min-h-[44px] px-2 md:px-3 text-xs md:text-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Write article</span>
              <span className="sm:hidden">Article</span>
            </Button>
          </div>
        </CardContent>
      </Card>      {/* Feed Posts */}
      {allPosts.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          {allPosts.map((uiPost) => (
            <PostCard
              key={uiPost.id}
              post={uiPost}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onNavigate={() => handleNavigate(uiPost.user.name)}
            />
          ))}
        </div>
      )}

      <FeedLoadingIndicator
        hasMore={hasMore}
        allPostsLength={allPosts.length}
        loadMoreRef={loadMoreRef}
        isLoadingMore={isLoadingMore}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handleCreatePost}
      />
    </div>
  );
};

export default MainFeed;
