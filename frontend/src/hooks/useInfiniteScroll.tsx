
import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollArgs {
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}

export function useInfiniteScroll({
  hasMore,
  isLoadingMore,
  loadMore,
}: UseInfiniteScrollArgs) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new window.IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target && target.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  return { loadMoreRef };
}
