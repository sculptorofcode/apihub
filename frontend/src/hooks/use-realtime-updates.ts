import { useEffect, useState } from 'react';
import { RealtimeService, RealtimeEventType } from '../services/RealtimeService';
import { Post, Comment } from '../types/post';
import { FeedService } from '../services';

/**
 * Hook for using realtime post updates
 * @param posts - List of posts to keep updated
 * @returns An object containing the updated posts list and a function to set posts
 */
export function useRealtimePosts(initialPosts: Post[]) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  
  useEffect(() => {
    // Update local state when initialPosts change from outside
    setPosts(initialPosts);
  }, [initialPosts]);
  
  useEffect(() => {
    // Setup realtime listeners for post updates
    const cleanup = FeedService.setupRealtimeListeners(
      // Handle post updates (likes, bookmarks)
      (postId, updates) => {
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === postId ? { ...post, ...updates } : post
          )
        );
      },
      // Handle comment updates
      (commentId, updates) => {
        setPosts(currentPosts => 
          currentPosts.map(post => {
            // If the post has no comments, just return it as is
            if (!post.comments) return post;
            
            // If this is a new comment being added to a post
            if (updates && 'postId' in updates && updates.postId === post.id && !commentId) {
              const newComment = updates as Comment;
              return {
                ...post,
                comments: [...(post.comments || []), newComment],
                commentsCount: post.commentsCount + 1
              };
            }
            
            // If this is an update to an existing comment
            const updatedComments = post.comments.map(comment => {
              // Update the specific comment
              if (comment.id === commentId) {
                // Delete comment case
                if (updates === null) return null;
                // Update comment case
                return { ...comment, ...updates };
              }
              
              // Check for updates to replies
              if (comment.replies && comment.replies.length > 0) {
                const updatedReplies = comment.replies.map(reply => {
                  if (reply.id === commentId) {
                    // Delete reply case
                    if (updates === null) return null;
                    // Update reply case
                    return { ...reply, ...updates };
                  }
                  return reply;
                }).filter(Boolean) as Comment[];
                
                return {
                  ...comment,
                  replies: updatedReplies
                };
              }
              
              return comment;
            }).filter(Boolean) as Comment[];
            
            // If a comment was deleted, update the count
            const wasCommentDeleted = post.comments.length > updatedComments.length;
            
            return {
              ...post,
              comments: updatedComments,
              commentsCount: wasCommentDeleted ? post.commentsCount - 1 : post.commentsCount
            };
          })
        );
      }
    );
    
    return cleanup;
  }, []);
  
  return { posts, setPosts };
}

/**
 * Hook for using realtime comment updates
 * @param initialComments - Initial comments list
 * @param postId - The ID of the post these comments belong to
 * @returns An object containing the updated comments list
 */
export function useRealtimeComments(initialComments: Comment[], postId: string) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  
  useEffect(() => {
    // Update local state when initialComments change from outside
    setComments(initialComments);
  }, [initialComments]);
  
  useEffect(() => {
    // Subscribe to realtime events for this specific post's comments
    const realtimeService = RealtimeService.getInstance();
    
    // Handler for new comments
    const handleCommentAdded = (data: { comment: Comment }) => {
      if (data.comment.postId !== postId) return;
      
      // If it's a top-level comment
      if (!data.comment.parentId) {
        setComments(currentComments => [...currentComments, data.comment]);
        return;
      }
      
      // If it's a reply
      setComments(currentComments => 
        currentComments.map(comment => {
          if (comment.id === data.comment.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data.comment]
            };
          }
          return comment;
        })
      );
    };
    
    // Handler for updated comments
    const handleCommentUpdated = (data: { comment: Comment }) => {
      if (data.comment.postId !== postId) return;
      
      setComments(currentComments => 
        currentComments.map(comment => {
          // If this is the updated comment
          if (comment.id === data.comment.id) {
            return data.comment;
          }
          
          // Check if the updated comment is in replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === data.comment.id ? data.comment : reply
              )
            };
          }
          
          return comment;
        })
      );
    };
    
    // Handler for deleted comments
    const handleCommentDeleted = (data: { commentId: string }) => {
      setComments(currentComments => {
        // First check if the deleted comment is a top-level comment
        const deletedCommentIndex = currentComments.findIndex(c => c.id === data.commentId);
        
        if (deletedCommentIndex !== -1) {
          // Remove the comment from the array
          return currentComments.filter(c => c.id !== data.commentId);
        }
        
        // If not found at top level, check in replies
        return currentComments.map(comment => {
          if (comment.replies && comment.replies.some(r => r.id === data.commentId)) {
            return {
              ...comment,
              replies: comment.replies.filter(r => r.id !== data.commentId)
            };
          }
          return comment;
        });
      });
    };
    
    // Handler for comment likes
    const handleCommentLike = (data: { commentId: string; liked: boolean; likesCount: number }) => {
      setComments(currentComments => 
        currentComments.map(comment => {
          // If this is the liked/unliked comment
          if (comment.id === data.commentId) {
            return {
              ...comment,
              liked: data.liked,
              likesCount: data.likesCount
            };
          }
          
          // Check if the liked/unliked comment is in replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === data.commentId 
                  ? { ...reply, liked: data.liked, likesCount: data.likesCount }
                  : reply
              )
            };
          }
          
          return comment;
        })
      );
    };
    
    // Subscribe to events
    realtimeService.subscribe(RealtimeEventType.COMMENT_ADDED, handleCommentAdded);
    realtimeService.subscribe(RealtimeEventType.COMMENT_UPDATED, handleCommentUpdated);
    realtimeService.subscribe(RealtimeEventType.COMMENT_DELETED, handleCommentDeleted);
    realtimeService.subscribe(RealtimeEventType.COMMENT_LIKED, handleCommentLike);
    
    // Cleanup function to unsubscribe
    return () => {
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_ADDED, handleCommentAdded);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_UPDATED, handleCommentUpdated);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_DELETED, handleCommentDeleted);
      realtimeService.unsubscribe(RealtimeEventType.COMMENT_LIKED, handleCommentLike);
    };
  }, [postId]);
  
  return { comments };
}
