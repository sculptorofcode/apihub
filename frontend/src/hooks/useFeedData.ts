import { useState, useEffect, useCallback, useRef } from "react";
import { FeedService, ErrorService } from "../services";
import { Post } from "../types/post";
import { useAuth } from "../contexts/auth/useAuth";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UseFeedDataReturn {
  allPosts: Post[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  handleLike: (postId: string) => Promise<void>;
  handleBookmark: (postId: string) => Promise<void>;
  handleNavigate: (username: string) => void;
  createPost: (
    data:
      | FormData
      | { content: string; visibility?: "public" | "friends" | "private" }
  ) => Promise<boolean>;
}

export const useFeedData = (): UseFeedDataReturn => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch posts function
  const fetchPosts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        setIsError(false);
        setErrorMessage(null);

        const { posts, hasMore: moreAvailable } =
          await FeedService.getFeedPosts(pageNum);

        setAllPosts((prev) => (isInitial ? posts : [...prev, ...posts]));
        setHasMore(moreAvailable);

        if (isInitial) {
          setPage(1);
        }
      } catch (error) {
        const errorMsg = ErrorService.getErrorMessage(
          error,
          "Failed to load posts"
        );
        setIsError(true);
        setErrorMessage(errorMsg);
        toast({
          title: "Error loading feed",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [toast]
  );

  // Initial data loading
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchTrigger, fetchPosts]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, isLoadingMore, hasMore, allPosts.length]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, false);
    }
  }, [page, fetchPosts]);

  // Handle post liking
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "default",
      });
      return;
    }

    try {
      const { liked, likesCount } = await FeedService.toggleLike(postId);

      // Update post in the state
      setAllPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, liked, likesCount } : post
        )
      );
    } catch (error) {
      toast({
        title: "Action failed",
        description: ErrorService.getErrorMessage(error, "Unable to like post"),
        variant: "destructive",
      });
    }
  };

  // Handle bookmarking
  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark posts",
        variant: "default",
      });
      return;
    }

    try {
      const { bookmarked } = await FeedService.toggleBookmark(postId);

      // Update post in the state
      setAllPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, bookmarked } : post
        )
      );

      toast({
        title: bookmarked ? "Post bookmarked" : "Bookmark removed",
        description: bookmarked
          ? "This post has been added to your bookmarks"
          : "This post has been removed from your bookmarks",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Action failed",
        description: ErrorService.getErrorMessage(
          error,
          "Unable to bookmark post"
        ),
        variant: "destructive",
      });
    }
  };

  // Handle navigation to user profile
  const handleNavigate = (username: string) => {
    if (username) {
      navigate(`/profile/${encodeURIComponent(username)}`);
    }
  };

  // Create a new post
  const createPost = async (
    data:
      | FormData
      | { content: string; visibility?: "public" | "friends" | "private" }
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create posts",
        variant: "default",
      });
      return false;
    }

    try {
      const newPost = await FeedService.createPost(data);

      // Add the new post to the top of the feed
      setAllPosts((prev) => [newPost, ...prev]);

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: "Post failed",
        description: ErrorService.getErrorMessage(
          error,
          "Unable to create post"
        ),
        variant: "destructive",
      });
      return false;
    }
  };

  // Refetch all posts (used after creating a post or refreshing the feed)
  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  return {
    allPosts,
    isLoading,
    isError,
    errorMessage,
    refetch,
    hasMore,
    isLoadingMore,
    loadMoreRef,
    handleLike,
    handleBookmark,
    handleNavigate,
    createPost,
  };
};
