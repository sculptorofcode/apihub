import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExpandedPostHeader from './expanded-post/ExpandedPostHeader';
import ExpandedPostContent from './expanded-post/ExpandedPostContent';
import ExpandedPostActions from './expanded-post/ExpandedPostActions';
import CommentsSection from './expanded-post/CommentsSection';
import { Comment } from './expanded-post/types';
import { Post } from '@/types/post';

interface ExpandedPostViewProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

// Dummy comments data
const initialComments: Comment[] = [
  {
    id: '1',
    author: { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5c2?w=100&h=100&fit=crop&crop=face' },
    content: 'This is a brilliant idea! I\'ve been thinking about something similar for months.',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        content: 'Totally agree! The market timing seems perfect for this.',
        createdAt: '2024-01-15T11:00:00Z',
        likes: 3
      }
    ]
  },
  {
    id: '2',
    author: { name: 'David Rodriguez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    content: 'Have you considered the potential challenges with user acquisition? I\'d love to hear your thoughts on the go-to-market strategy.',
    createdAt: '2024-01-15T09:45:00Z',
    likes: 8,
    replies: [
      {
        id: '2-1',
        author: { name: 'Emma Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        content: 'Great question! I think partnerships could be key here.',
        createdAt: '2024-01-15T10:15:00Z',
        likes: 5
      },
      {
        id: '2-2',
        author: { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
        content: 'Social media marketing would be crucial for initial traction.',
        createdAt: '2024-01-15T10:20:00Z',
        likes: 2
      }
    ]
  },
  {
    id: '3',
    author: { name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face' },
    content: 'This reminds me of a startup I worked with last year. The key insight here is understanding the user pain points deeply.',
    createdAt: '2024-01-15T08:30:00Z',
    likes: 15
  }
];

const ExpandedPostView: React.FC<ExpandedPostViewProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onBookmark,
  onShare
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLike = () => onLike?.(post.id);
  const handleBookmark = () => onBookmark?.(post.id);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{
        animation: isOpen ? 'fade-in 0.3s ease-out' : 'fade-out 0.3s ease-out'
      }}
    >
      <div
        className="relative w-full max-w-4xl h-[90vh] mx-4 bg-[var(--background-50)] dark:bg-[var(--background-800)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          animation: isOpen ? 'scale-in 0.3s ease-out' : 'scale-out 0.3s ease-out'
        }}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black rounded-full shadow-lg"
          aria-label="Close expanded view"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* Author Info */}
            <ExpandedPostHeader author={post.user} createdAt={post.createdAt} />

            {/* Post Content */}
            <ExpandedPostContent
              title={''}
              description={post.content}
              tags={[]}
              media={''}
            />

            {/* Actions Bar */}
            <ExpandedPostActions
              postId={post.id}
              postTitle={''}
              likes={post.likesCount}
              isLiked={post.liked}
              isBookmarked={post.bookmarked}
              commentsCount={comments.length}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />

            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              onCommentsChange={setComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedPostView;
