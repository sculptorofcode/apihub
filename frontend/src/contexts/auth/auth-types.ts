import { createContext } from "react";

// Define User type
export type User = {
  isRequestSent: boolean;
  isFriend: boolean;
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string | File | null;
  banner: string | File | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  friendsCount: number;
  friends: User[];
  mutualFriendsCount: number;
  mutualFriends: User[];
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
};

// Define context value type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    username: string,
    password: string,
    password_confirmation: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, email: string, password: string, password_confirmation: string) => Promise<boolean>;
  verifyEmail: (id: string, hash: string, expires: string, signature: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  verifyEmail: async () => false,
  resendVerificationEmail: async () => false,
  updateProfile: async () => false,
  checkUsernameAvailability: async () => false,
});
