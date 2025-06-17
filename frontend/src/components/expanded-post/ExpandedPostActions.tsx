
import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareDropdown from '../share/ShareDropdown';

interface ExpandedPostActionsProps {
  postId: string;
  postTitle?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  commentsCount: number;
  onLike: () => void;
  onBookmark: () => void;
}

const ExpandedPostActions: React.FC<ExpandedPostActionsProps> = ({
  postId,
  postTitle,
  likes,
  isLiked,
  isBookmarked,
  commentsCount,
  onLike,
  onBookmark
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-y border-border">
      <div className="flex items-center space-x-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`flex items-center space-x-2 transition-all duration-200 ${
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-muted-foreground hover:text-red-500'
          }`}
        >
          <Heart 
            className={`h-5 w-5 transition-all duration-200 ${
              isLiked ? 'fill-current' : ''
            }`} 
          />
          <span className="font-medium">{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors duration-200"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">{commentsCount}</span>
        </Button>
        {/* Share Button with Dropdown */}
        <ShareDropdown 
          postId={postId} 
          postTitle={postTitle}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBookmark}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          isBookmarked 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <Bookmark 
          className={`h-5 w-5 transition-all duration-200 ${
            isBookmarked ? 'fill-current' : ''
          }`} 
        />
      </Button>
    </div>
  );
};

export default ExpandedPostActions;
