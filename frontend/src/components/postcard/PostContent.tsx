
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Post } from './types';

interface PostContentProps {
  title: string;
  description: string;
  tags: string[];
  onNavigate?: () => void;
}

const PostContent: React.FC<PostContentProps> = ({
  title,
  description,
  tags,
  onNavigate,
}) => {
  const truncateDescription = (text: string, maxLines: number = 3) => {
    if(!text || typeof text !== 'string') return '';
    const words = text.split(' ');
    const maxWords = maxLines * 12;
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Title */}
      <h3 
        className="text-lg md:text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] group-hover:text-primary transition-colors duration-200 cursor-pointer line-clamp-2 break-words leading-tight"
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onNavigate) onNavigate();
          }
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm md:text-base break-words">
        {truncateDescription(description)}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-[var(--secondary-300)] text-[var(--text-900)] dark:text-[var(--text-50)] hover:bg-[var(--primary-300)] hover:text-white transition-colors duration-200 text-xs md:text-sm min-h-[28px]"
          >
            #{tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge variant="outline" className="text-muted-foreground text-xs md:text-sm min-h-[28px]">
            +{tags.length - 3}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PostContent;
