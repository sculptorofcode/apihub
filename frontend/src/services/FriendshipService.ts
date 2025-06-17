import apiClient from '../api/apiConfig';
import { API_ROUTES } from '../api/apiRoutes';
import { User } from '../contexts/auth/auth-types';

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  requestedAt: string;
}

export interface UserSearchPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface UserSearchResponse {
  users: User[];
  pagination: UserSearchPagination;
}

/**
 * Service for handling friend requests and friendship operations
 */
export class FriendshipService {
  /**
   * Get current user's friends
   */
  static async getFriends(): Promise<User[]> {
    try {
      const response = await apiClient.get(API_ROUTES.friends.getFriends);
      
      if (response.data.success) {
        return response.data.friends;
      }
      
      throw new Error(response.data.message || 'Failed to fetch friends');
    } catch (error) {
      console.error('FriendshipService.getFriends error:', error);
      throw error;
    }
  }

  /**
   * Get friend requests sent to the current user
   */
  static async getFriendRequests(): Promise<FriendRequest[]> {
    try {
      const response = await apiClient.get(API_ROUTES.friends.getRequests);
      
      if (response.data.success) {
        return response.data.requests;
      }
      
      throw new Error(response.data.message || 'Failed to fetch friend requests');
    } catch (error) {
      console.error('FriendshipService.getFriendRequests error:', error);
      throw error;
    }
  }

  /**
   * Get friend requests count for the current user
   * @returns Number of friend requests
   */
  static async getFriendRequestsCount(): Promise<number> {
    try {
      const response = await apiClient.get(API_ROUTES.friends.getRequestsCount);
      
      if (response.data.success) {
        return response.data.count;
      }
      
      throw new Error(response.data.message || 'Failed to fetch friend requests count');
    } catch (error) {
      console.error('FriendshipService.getFriendRequestsCount error:', error);
      throw error;
    }
  }

  /**
   * Send a friend request to a user
   * @param userId - The ID of the user to send the request to
   */
  static async sendFriendRequest(userId: string | number): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.friends.sendRequest, { 
        user_id: userId 
      });
      
      return response.data.success;
    } catch (error) {
      console.error('FriendshipService.sendFriendRequest error:', error);
      throw error;
    }
  }

  /**
   * Accept a friend request
   * @param requestId - The ID of the friend request to accept
   */
  static async acceptFriendRequest(requestId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.friends.acceptRequest(requestId));
      
      return response.data.success;
    } catch (error) {
      console.error('FriendshipService.acceptFriendRequest error:', error);
      throw error;
    }
  }

  /**
   * Reject a friend request
   * @param requestId - The ID of the friend request to reject
   */
  static async rejectFriendRequest(requestId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(API_ROUTES.friends.rejectRequest(requestId));
      
      return response.data.success;
    } catch (error) {
      console.error('FriendshipService.rejectFriendRequest error:', error);
      throw error;
    }
  }

  /**
   * Remove a friend
   * @param userId - The ID of the friend to remove
   */
  static async removeFriend(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(API_ROUTES.friends.removeFriend(userId));
      
      return response.data.success;
    } catch (error) {
      console.error('FriendshipService.removeFriend error:', error);
      throw error;
    }
  }

  /**
   * Search for users with optional filters for suggestions
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param suggested - Whether to return suggested users
   */
  static async searchUsers(
    query: string = '', 
    page: number = 1, 
    suggested: boolean = false
  ): Promise<UserSearchResponse> {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await apiClient.get(
        `${API_ROUTES.friends.searchWithParams(query, page, suggested)}&_nocache=${timestamp}`,
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
      
      if (response.data.success) {
        return {
          users: response.data.users,
          pagination: response.data.pagination
        };
      }
      
      throw new Error(response.data.message || 'Search failed');
    } catch (error) {
      console.error('FriendshipService.searchUsers error:', error);
      throw error;
    }
  }
}

export default FriendshipService;
