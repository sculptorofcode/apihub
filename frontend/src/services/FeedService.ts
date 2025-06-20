import apiClient from "../api/apiConfig";
import { API_ROUTES } from "../api/apiRoutes";
import { Post, Comment } from "../types/post";
import { RealtimeService, RealtimeEventType } from "./RealtimeService";
import { 
  transformPostData, 
  transformCommentData, 
  transformPostArray, 
  transformCommentArray,
  transformPartialPostUpdate,
  transformPartialCommentUpdate,
  BackendPost,
  BackendComment 
} from "../utils/dataTransformers";

/**
 * Service for managing feed operations
 */
export class FeedService {
  /**
   * Get feed posts with pagination
   * @param page - The page number to fetch
   */
  static async getFeedPosts(page: number = 1): Promise<{
    posts: Post[];
    hasMore: boolean;
    totalPosts: number;
  }> {
    try {
      const response = await apiClient.get(API_ROUTES.feed.getPosts(page));      if (response.data.success) {
        // Transform posts from backend format to frontend format using our typed transformer
        const transformedPosts = transformPostArray(response.data.posts);
        
        return {
          posts: transformedPosts,
          hasMore: response.data.hasMore,
          totalPosts: response.data.total || 0,
        };
      }

      throw new Error(response.data.message || "Failed to fetch feed posts");
    } catch (error) {
      console.error("FeedService.getFeedPosts error:", error);
      throw error;
    }
  }

  /**
   * Like or unlike a post
   * @param postId - The ID of the post
   */
  static async toggleLike(postId: string): Promise<{
    liked: boolean;
    likesCount: number;
  }> {
    try {
      const response = await apiClient.post(API_ROUTES.posts.like(postId));

      if (response.data.success) {
        return {
          liked: response.data.liked,
          likesCount: response.data.likesCount,
        };
      }

      throw new Error(response.data.message || "Failed to toggle like status");
    } catch (error) {
      console.error("FeedService.toggleLike error:", error);
      throw error;
    }
  }

  /**
   * Bookmark or unbookmark a post
   * @param postId - The ID of the post
   */
  static async toggleBookmark(postId: string): Promise<{
    bookmarked: boolean;
  }> {
    try {
      const response = await apiClient.post(API_ROUTES.posts.bookmark(postId));

      if (response.data.success) {
        return {
          bookmarked: response.data.bookmarked,
        };
      }

      throw new Error(
        response.data.message || "Failed to toggle bookmark status"
      );
    } catch (error) {
      console.error("FeedService.toggleBookmark error:", error);
      throw error;
    }
  }

  /**
   * Create a new post
   * @param postData - The post data to create
   */
  static async createPost(
    postData:
      | FormData
      | {
          content: string;
          visibility?: "public" | "friends" | "private";
        }
  ): Promise<Post> {
    try {
      const isFormData = postData instanceof FormData;

      const response = await apiClient.post(API_ROUTES.posts.create, postData, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });      if (response.data.success) {
        return transformPostData(response.data.post);
      }

      throw new Error(response.data.message || "Failed to create post");
    } catch (error) {
      console.error("FeedService.createPost error:", error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   * @param postId - The ID of the post
   */  static async getComments(postId: string): Promise<Comment[]> {
    try {
      const response = await apiClient.get(API_ROUTES.posts.comments(postId));

      if (response.data.success) {
        // Transform comments from backend format to frontend format using typed transformer
        return transformCommentArray(response.data.comments);
      }

      throw new Error(response.data.message || "Failed to fetch comments");
    } catch (error) {
      console.error("FeedService.getComments error:", error);
      throw error;
    }
  }

  /**
   * Add a comment to a post
   * @param postId - The ID of the post
   * @param content - The comment text
   * @param parentId - Optional parent comment ID for replies
   */
  
  static async addComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    try {
      const response = await apiClient.post(API_ROUTES.posts.comments(postId), {
        content,
        parent_id: parentId,
      });

      if (response.data.success) {
        // Transform comment from backend format to frontend format
        return transformCommentData(response.data.comment);
      }

      throw new Error(response.data.message || "Failed to add comment");
    } catch (error) {
      console.error("FeedService.addComment error:", error);
      throw error;
    }
  }

  /**
   * Update an existing comment
   * @param commentId - The ID of the comment to update
   * @param content - The new comment content
   */  static async updateComment(commentId: string, content: string): Promise<Comment> {
    try {
      const response = await apiClient.put(API_ROUTES.comments.update(commentId), {
        content,
      });

      if (response.data.success) {
        // Transform comment from backend format to frontend format
        return transformCommentData(response.data.comment);
      }

      throw new Error(response.data.message || "Failed to update comment");
    } catch (error) {
      console.error("FeedService.updateComment error:", error);
      throw error;
    }
  }

  /**
   * Delete a comment
   * @param commentId - The ID of the comment to delete
   */
  static async deleteComment(commentId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(API_ROUTES.comments.delete(commentId));

      if (response.data.success) {
        return true;
      }

      throw new Error(response.data.message || "Failed to delete comment");
    } catch (error) {
      console.error("FeedService.deleteComment error:", error);
      throw error;
    }
  }

  /**
   * Like or unlike a comment
   * @param commentId - The ID of the comment
   */
  static async toggleCommentLike(commentId: string): Promise<{
    liked: boolean;
    likesCount: number;
  }> {
    try {
      const response = await apiClient.post(API_ROUTES.comments.like(commentId));

      if (response.data.success) {
        return {
          liked: response.data.liked,
          likesCount: response.data.likesCount,
        };
      }

      throw new Error(response.data.message || "Failed to toggle comment like status");
    } catch (error) {
      console.error("FeedService.toggleCommentLike error:", error);
      throw error;
    }
  }

  /**
   * Setup real-time listeners for post and comment updates
   * @param onPostUpdate - Callback for handling post updates
   * @param onCommentUpdate - Callback for handling comment updates
   */
  static setupRealtimeListeners(
    onPostUpdate: (postId: string, updates: Partial<Post>) => void,
    onCommentUpdate: (commentId: string, updates: Partial<Comment> | null) => void
  ): () => void {
    const realtimeService = RealtimeService.getInstance();      // Handler for post like events
    const handlePostLike = (data: Partial<BackendPost>) => {
      const postId = (data.id || data.postId || data.post_id) as string;
      
      // Use our typed transformer to handle the field conversion
      const updates = transformPartialPostUpdate(data);
      onPostUpdate(postId, updates);
    };
      // Handler for post bookmark events
    const handlePostBookmark = (data: Partial<BackendPost>) => {
      const postId = (data.id || data.postId || data.post_id) as string;
      
      // Use our typed transformer to handle the field conversion
      const updates = transformPartialPostUpdate(data);
      onPostUpdate(postId, updates);
    };
      // Handler for comment added events
    const handleCommentAdded = (data: { comment: BackendComment }) => {
      // Transform comment data from backend format
      const transformedComment = transformCommentData(data.comment);
      onCommentUpdate(transformedComment.postId, transformedComment);
    };
      // Handler for comment updated events
    const handleCommentUpdated = (data: { comment: BackendComment }) => {
      // Transform comment data from backend format
      const transformedComment = transformCommentData(data.comment);
      onCommentUpdate(transformedComment.id, transformedComment);
    };
      // Handler for comment deleted events
    const handleCommentDeleted = (data: Partial<BackendComment>) => {
      const commentId = (data.id || data.commentId || data.comment_id) as string;
      onCommentUpdate(commentId, null);
    };    // Handler for comment like events
    const handleCommentLike = (data: Partial<BackendComment>) => {
      const commentId = (data.id || data.commentId || data.comment_id) as string;
      
      // Use our typed transformer to handle the field conversion
      const updates = transformPartialCommentUpdate(data);
      onCommentUpdate(commentId, updates);
    };
    
    // Subscribe to all events
    realtimeService.subscribe(RealtimeEventType.POST_LIKED, handlePostLike);
    realtimeService.subscribe(RealtimeEventType.POST_BOOKMARKED, handlePostBookmark);
    realtimeService.subscribe(RealtimeEventType.COMMENT_ADDED, handleCommentAdded);
    realtimeService.subscribe(RealtimeEventType.COMMENT_UPDATED, handleCommentUpdated);
    realtimeService.subscribe(RealtimeEventType.COMMENT_DELETED, handleCommentDeleted);
    realtimeService.subscribe(RealtimeEventType.COMMENT_LIKED, handleCommentLike);
    
    // Return cleanup function
    return () => {
      realtimeService.unsubscribe(RealtimeEventType.POST_LIKED, handlePostLike);
      realtimeService.unsubscribe(RealtimeEventType.POST_BOOKMARKED, handlePostBookmark);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_ADDED, handleCommentAdded);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_UPDATED, handleCommentUpdated);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_DELETED, handleCommentDeleted);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_LIKED, handleCommentLike);
    };
  }
}

export default FeedService;
