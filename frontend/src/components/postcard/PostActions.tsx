
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Post } from '@/types/post';
import ShareDropdown from '../share/ShareDropdown';

interface PostActionsProps {
  post: Post;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onBookmark,
}) => {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(post.id);
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="flex items-center space-x-4">        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-all duration-200 ${
            post.liked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-muted-foreground hover:text-red-500'
          }`}
          aria-label={`${post.liked ? 'Unlike' : 'Like'} this post`}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-200 ${
              post.liked ? 'fill-current' : ''
            }`} 
          />
          <span className="text-sm font-medium">{post.likesCount}</span>
        </Button>        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors duration-200"
          aria-label="View comments"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </Button>        {/* Share Button with Dropdown */}        <ShareDropdown 
          postId={post.id} 
          postTitle={post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '')}
        />
      </div>      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          post.bookmarked 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-primary'
        }`}
        aria-label={`${post.bookmarked ? 'Remove bookmark' : 'Bookmark'} this post`}
      >
        <Bookmark 
          className={`h-4 w-4 transition-all duration-200 ${
            post.bookmarked ? 'fill-current' : ''
          }`} 
        />
      </Button>
    </div>
  );
};

export default PostActions;
