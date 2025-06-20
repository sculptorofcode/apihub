import { Post, Comment } from '../types/post';
import { User } from '../contexts/auth/auth-types';

/**
 * Backend response interfaces to match Laravel models with snake_case and camelCase support
 * These are used to properly type the data coming from the API before transformation
 */

// Backend user representation might be more limited than frontend User type
export interface BackendUser {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  email?: string;
  // Other possible fields that might be included in API responses
  created_at?: string;
  updated_at?: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
}

export interface BackendPost {
  id: string;
  content: string;
  image?: string | null;
  video?: string | null;
  file?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  user: BackendUser;
  user_id?: string;
  liked?: boolean;
  likes_count?: number;
  likesCount?: number;
  bookmarked?: boolean;
  comments_count?: number;
  commentsCount?: number;
  visibility?: 'public' | 'friends' | 'private';
  comments?: BackendComment[];
  // For event data that might use different field names
  postId?: string;
  post_id?: string;
}

export interface BackendComment {
  id: string;
  content: string;
  user: BackendUser;
  post_id?: string;
  postId?: string;
  parent_id?: string | null;
  parentId?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  liked?: boolean;
  likes_count?: number;
  likesCount?: number;
  replies?: BackendComment[];
  // For event data that might use different field names
  commentId?: string;
  comment_id?: string;
}

/**
 * Transform backend user data to a format compatible with the frontend User type
 * This is a simplified transformation as the API might only send a subset of user fields
 */
export function transformUserData(backendUser: BackendUser): Partial<User> {
  return {
    id: Number(backendUser.id), // Convert to number as expected by User type
    name: backendUser.name,
    username: backendUser.username,
    email: backendUser.email || '',
    avatar: backendUser.avatar,
    // Set defaults for required fields in User type that might not be in API response
    isRequestSent: false,
    isFriend: false,
    banner: null,
    bio: backendUser.bio || null,
    location: backendUser.location || null,
    website: backendUser.website || null,
    phone: null,
    // These might not be in API response but required by User type
    friendsCount: 0,
    mutualFriendsCount: 0,
    last_active_at: null,
    created_at: backendUser.created_at || new Date().toISOString(),
    updated_at: backendUser.updated_at || new Date().toISOString(),
  } as User; // Cast to User type as we're providing essential fields
}

/**
 * Transforms backend post data to match frontend Post interface
 * This ensures consistency between backend snake_case and frontend camelCase
 */
export function transformPostData(backendPost: BackendPost): Post {
  return {
    id: backendPost.id,
    content: backendPost.content,
    image: backendPost.image || undefined,
    video: backendPost.video || undefined,
    file: backendPost.file || undefined,
    // Transform dates from snake_case to camelCase
    createdAt: backendPost.created_at || backendPost.createdAt || new Date().toISOString(),
    updatedAt: backendPost.updated_at || backendPost.updatedAt || new Date().toISOString(),
    // Transform user data using our user transformer
    user: transformUserData(backendPost.user) as User,
    liked: backendPost.liked !== undefined ? backendPost.liked : false,
    likesCount: backendPost.likes_count !== undefined ? backendPost.likes_count : backendPost.likesCount || 0,
    bookmarked: backendPost.bookmarked !== undefined ? backendPost.bookmarked : false,
    commentsCount: backendPost.comments_count !== undefined ? backendPost.comments_count : backendPost.commentsCount || 0,
    visibility: backendPost.visibility || 'public',
    comments: backendPost.comments ? backendPost.comments.map(transformCommentData) : undefined,
  };
}

/**
 * Transforms backend comment data to match frontend Comment interface
 */
export function transformCommentData(backendComment: BackendComment): Comment {
  return {
    id: backendComment.id,
    content: backendComment.content,
    user: transformUserData(backendComment.user) as User,
    postId: backendComment.post_id || backendComment.postId || '',
    parentId: backendComment.parent_id || backendComment.parentId,
    createdAt: backendComment.created_at || backendComment.createdAt || new Date().toISOString(),
    updatedAt: backendComment.updated_at || backendComment.updatedAt || new Date().toISOString(),
    liked: backendComment.liked !== undefined ? backendComment.liked : false,
    likesCount: backendComment.likes_count !== undefined ? backendComment.likes_count : backendComment.likesCount || 0,
    replies: backendComment.replies ? backendComment.replies.map(transformCommentData) : undefined,
  };
}

/**
 * Transforms an array of backend posts to frontend format
 * Includes validation to ensure the input is an array
 */
export function transformPostArray(backendPosts: BackendPost[] | unknown): Post[] {
  if (!Array.isArray(backendPosts)) {
    return [];
  }
  
  return backendPosts
    .filter((post): post is BackendPost => isBackendPost(post))
    .map(post => transformPostData(post));
}

/**
 * Transforms an array of backend comments to frontend format
 * Includes validation to ensure the input is an array
 */
export function transformCommentArray(backendComments: BackendComment[] | unknown): Comment[] {
  if (!Array.isArray(backendComments)) {
    return [];
  }
  
  return backendComments
    .filter((comment): comment is BackendComment => isBackendComment(comment))
    .map(comment => transformCommentData(comment));
}

/**
 * Type guard to check if an object is a BackendPost
 */
export function isBackendPost(obj: unknown): obj is BackendPost {
  if (!obj || typeof obj !== 'object') return false;
  
  const post = obj as Partial<BackendPost>;
  return typeof post.id === 'string' && typeof post.content === 'string';
}

/**
 * Type guard to check if an object is a BackendComment
 */
export function isBackendComment(obj: unknown): obj is BackendComment {
  if (!obj || typeof obj !== 'object') return false;
  
  const comment = obj as Partial<BackendComment>;
  return typeof comment.id === 'string' && typeof comment.content === 'string';
}

/**
 * Helper function to transform a partial post update from backend format
 * Used for real-time updates where only specific fields are sent
 */
export function transformPartialPostUpdate(
  update: Partial<BackendPost>
): Partial<Post> {
  const result: Partial<Post> = {};
  
  if (update.liked !== undefined) {
    result.liked = update.liked;
  }
  
  if (update.likes_count !== undefined) {
    result.likesCount = update.likes_count;
  } else if (update.likesCount !== undefined) {
    result.likesCount = update.likesCount;
  }
  
  if (update.bookmarked !== undefined) {
    result.bookmarked = update.bookmarked;
  }
  
  if (update.comments_count !== undefined) {
    result.commentsCount = update.comments_count;
  } else if (update.commentsCount !== undefined) {
    result.commentsCount = update.commentsCount;
  }
  
  return result;
}

/**
 * Helper function to transform a partial comment update from backend format
 * Used for real-time updates where only specific fields are sent
 */
export function transformPartialCommentUpdate(
  update: Partial<BackendComment>
): Partial<Comment> {
  const result: Partial<Comment> = {};
  
  if (update.liked !== undefined) {
    result.liked = update.liked;
  }
  
  if (update.likes_count !== undefined) {
    result.likesCount = update.likes_count;
  } else if (update.likesCount !== undefined) {
    result.likesCount = update.likesCount;
  }
  
  if (update.content !== undefined) {
    result.content = update.content;
  }
  
  return result;
}
