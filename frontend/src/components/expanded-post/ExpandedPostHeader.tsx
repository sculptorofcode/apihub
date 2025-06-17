
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '../postcard/types';

interface ExpandedPostHeaderProps {
  author: Post['author'];
  createdAt: string;
}

const ExpandedPostHeader: React.FC<ExpandedPostHeaderProps> = ({ author, createdAt }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)] dark:text-[var(--text-50)] font-medium">
          {getInitials(author.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-lg text-[var(--text-900)] dark:text-[var(--text-50)]">
          {author.name}
        </p>
        <p className="text-muted-foreground">
          {new Date(createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default ExpandedPostHeader;
