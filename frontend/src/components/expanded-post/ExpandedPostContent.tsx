
import React from 'react';
import { Badge } from '@/components/ui/badge';
import PostMedia from '../postcard/PostMedia';
import { Post } from '../postcard/types';

interface ExpandedPostContentProps {
  title: string;
  description: string;
  tags: string[];
  media?: Post['media'];
}

const ExpandedPostContent: React.FC<ExpandedPostContentProps> = ({
  title,
  description,
  tags,
  media
}) => {
  return (
    <div className="space-y-6">
      {/* Post Title */}
      <h1 className="text-3xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] leading-tight">
        {title}
      </h1>

      {/* Post Media */}
      {media && (
        <div className="relative rounded-lg overflow-hidden">
          <PostMedia media={media} />
        </div>
      )}

      {/* Post Content */}
      <div className="prose prose-lg max-w-none text-[var(--text-700)] dark:text-[var(--text-300)] leading-relaxed">
        <p>{description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-[var(--secondary-300)] text-[var(--text-900)] dark:text-[var(--text-50)] hover:bg-[var(--primary-300)] hover:text-white transition-colors duration-200 px-3 py-1"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ExpandedPostContent;
