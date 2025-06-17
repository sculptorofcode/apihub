import { User } from "@/contexts/auth/auth-types";

export interface Post {
  id: string;
  content: string;
  image?: string;
  video?: string;
  file?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  liked: boolean;
  likesCount: number;
  bookmarked: boolean;
  commentsCount: number;
  visibility: 'public' | 'friends' | 'private';
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  postId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  liked: boolean;
  likesCount: number;
  replies?: Comment[];
}