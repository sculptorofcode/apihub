
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from './types';

interface CommentItemProps {
  comment: Comment;
  onReplyClick: () => void;
  isNested?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplyClick, isNested = false }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarSize = isNested ? 'h-8 w-8' : 'h-10 w-10';
  const paddingSize = isNested ? 'p-3' : 'p-4';
  const textSize = isNested ? 'text-sm' : '';
  const nameSize = isNested ? 'text-sm' : '';

  return (
    <div className="flex space-x-3">
      <Avatar className={`${avatarSize} flex-shrink-0`}>
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback className={`bg-[var(--secondary-300)] text-[var(--text-900)] dark:text-[var(--text-50)] ${isNested ? 'text-xs' : ''}`}>
          {getInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className={`bg-[var(--background-100)] dark:bg-[var(--background-700)] rounded-lg ${paddingSize}`}>
          <div className={`flex items-center space-x-2 ${isNested ? 'mb-1' : 'mb-2'}`}>
            <p className={`font-medium text-[var(--text-900)] dark:text-[var(--text-50)] ${nameSize}`}>
              {comment.author.name}
            </p>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className={`text-[var(--text-700)] dark:text-[var(--text-300)] ${textSize}`}>
            {comment.content}
          </p>
        </div>
        <div className={`flex items-center space-x-4 mt-2 ${isNested ? 'ml-3' : 'ml-4'}`}>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-red-500">
            <Heart className="h-3 w-3 mr-1" />
            {comment.likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-[var(--primary-500)]"
            onClick={onReplyClick}
          >
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
