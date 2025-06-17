
import React from 'react';
import PostCardSkeleton from './PostCardSkeleton';

interface FeedLoadingIndicatorProps {
  hasMore: boolean;
  allPostsLength: number;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  isLoadingMore: boolean;
}

const FeedLoadingIndicator: React.FC<FeedLoadingIndicatorProps> = ({
  hasMore,
  allPostsLength,
  loadMoreRef,
  isLoadingMore
}) => {
  return (
    <>
      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="mt-8 grid gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <PostCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      <div 
        ref={loadMoreRef} 
        className="h-20 flex items-center justify-center mt-8"
      >
        {!hasMore && allPostsLength > 0 && (
          <p className="text-muted-foreground text-center">
            You've reached the end! 🎉
          </p>
        )}
      </div>
    </>
  );
};

export default FeedLoadingIndicator;
