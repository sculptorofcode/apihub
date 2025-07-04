
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PostHeader from './postcard/PostHeader';
import PostContent from './postcard/PostContent';
import PostMedia from './postcard/PostMedia';
import PostActions from './postcard/PostActions';
import ExpandedPostView from './ExpandedPostView';
import { Post } from '@/types/post';
import { usePostInteractions } from '@/hooks';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onNavigate?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post: initialPost,
  onLike: externalOnLike,
  onBookmark: externalOnBookmark,
  onNavigate,
}) => {
  const { post, toggleLike, toggleBookmark } = usePostInteractions(initialPost);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(post.id);
    } else {
      handleCardClick();
    }
  };
  
  const handleLike = (postId: string) => {
    toggleLike();
    if (externalOnLike) {
      externalOnLike(postId);
    }
  };
  
  const handleBookmark = (postId: string) => {
    toggleBookmark();
    if (externalOnBookmark) {
      externalOnBookmark(postId);
    }
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-300)]/10 border-2 hover:border-[var(--primary-300)]/30 bg-[var(--background-50)] dark:bg-[var(--background-800)] cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="space-y-3 md:space-y-4">
          {/* Author Info */}
          <div className="p-4 md:p-6 pb-0">
            <PostHeader author={post.user} createdAt={post.createdAt} />
          </div>
          {/* Content */}
          <div className="px-4 md:px-6 space-y-3 md:space-y-4">
            <PostContent
              title={post.content}
              description={''}
              tags={[]}
              onNavigate={handleNavigate}
            />
          </div>
          {/* Media Content */}
          {(post.image || post.video || post.file) && (
            <div className="relative">
              <PostMedia media={{ image: post.image, video: post.video, file: post.file }} />
            </div>
          )}
          {/* Actions */}
          <div className="px-4 md:px-6 pb-4 md:pb-6">            <PostActions
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          </div>
        </div>
      </Card>

      {/* Expanded Post View */}      <ExpandedPostView
        post={post}
        isOpen={isExpanded}
        onClose={handleCloseExpanded}
        onLike={handleLike}
        onBookmark={handleBookmark}
      />
    </>
  );
};

export default PostCard;
