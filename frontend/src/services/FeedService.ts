import apiClient from "../api/apiConfig";
import { API_ROUTES } from "../api/apiRoutes";
import { Post } from "../types/post";

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
      const response = await apiClient.get(API_ROUTES.feed.getPosts(page));

      if (response.data.success) {
        return {
          posts: response.data.posts,
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
      });

      if (response.data.success) {
        return response.data.post;
      }

      throw new Error(response.data.message || "Failed to create post");
    } catch (error) {
      console.error("FeedService.createPost error:", error);
      throw error;
    }
  }
}

export default FeedService;
