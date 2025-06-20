
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types/post';

interface PostHeaderProps {
  author: Post['user'];
  createdAt: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ author, createdAt }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigate(`/profile/${encodeURIComponent(author.username.toLowerCase())}`);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleAvatarClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAvatarClick(e); }}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-full"
        aria-label={`Go to profile of ${author.name}`}
        tabIndex={0}
        type="button"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              typeof author.avatar === 'string'
                ? author.avatar
                : author.avatar
                  ? URL.createObjectURL(author.avatar)
                  : undefined
            }
            alt={author.name}
          />
          <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)] dark:text-[var(--text-50)] font-medium">
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>
      </button>
      <div>
        <p className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
          {author.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

export default PostHeader;
