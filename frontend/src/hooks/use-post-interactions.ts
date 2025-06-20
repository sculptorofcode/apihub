import { useState } from 'react';
import { Post } from '../types/post';
import { FeedService } from '../services';
import { transformPostData } from '../utils/dataTransformers';

/**
 * Custom hook for handling post interactions (likes, comments, bookmarks)
 * with optimistic updates and realtime sync
 * 
 * @param initialPost - The initial post data
 * @returns Hook state and functions for interacting with the post
 */
export function usePostInteractions(initialPost: Post) {
  const [post, setPost] = useState<Post>(initialPost);
  
  // Toggle like status with optimistic update
  const toggleLike = async () => {
    // Optimistic update - update UI immediately for better user experience
    const optimisticPost = {
      ...post,
      liked: !post.liked,
      likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1
    };
    setPost(optimisticPost);
    
    try {
      // Send API request
      const response = await FeedService.toggleLike(post.id);
      
      // Update with accurate server data if necessary
      if (optimisticPost.liked !== response.liked || optimisticPost.likesCount !== response.likesCount) {
        setPost(prev => ({
          ...prev,
          liked: response.liked,
          likesCount: response.likesCount
        }));
      }
    } catch (error) {
      // Revert to original state on error
      setPost(initialPost);
      console.error('Error toggling like:', error);
    }
  };
  
  // Toggle bookmark status with optimistic update
  const toggleBookmark = async () => {
    // Optimistic update
    const optimisticPost = {
      ...post,
      bookmarked: !post.bookmarked
    };
    setPost(optimisticPost);
    
    try {
      // Send API request
      const response = await FeedService.toggleBookmark(post.id);
      
      // Update with accurate server data if necessary
      if (optimisticPost.bookmarked !== response.bookmarked) {
        setPost(prev => ({
          ...prev,
          bookmarked: response.bookmarked
        }));
      }
    } catch (error) {
      // Revert to original state on error
      setPost(initialPost);
      console.error('Error toggling bookmark:', error);
    }
  };
  
  // Add a comment with optimistic update
  const addComment = async (content: string, parentId?: string) => {
    try {
      // Send API request (not optimistic since we need the new comment ID and timestamps)
      const newComment = await FeedService.addComment(post.id, content, parentId);
      
      // Update post with new comment
      setPost(prev => {
        // If parent comment (top level)
        if (!parentId) {
          return {
            ...prev,
            comments: [...(prev.comments || []), newComment],
            commentsCount: prev.commentsCount + 1
          };
        }
        
        // If it's a reply to a comment
        return {
          ...prev,
          comments: (prev.comments || []).map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            return comment;
          }),
          commentsCount: prev.commentsCount + 1
        };
      });
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };
  
  // External update function for when post is updated via realtime events
  const updatePostData = (updatedPost: Partial<Post>) => {
    setPost(prev => ({
      ...prev,
      ...updatedPost
    }));
  };
  
  return {
    post,
    toggleLike,
    toggleBookmark,
    addComment,
    updatePostData,
    setPost
  };
}
