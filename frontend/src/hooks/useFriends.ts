import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { FriendshipService, ErrorService } from '../services';
import { FriendRequest, UserSearchPagination } from '../services/FriendshipService';
import { User } from '@/contexts/auth/auth-types';

interface UseFriendsReturn {
  friends: User[];
  friendRequests: FriendRequest[];
  sentRequests: string[];
  searchUsers: User[];
  usersPagination: UserSearchPagination;
  isLoading: {
    friends: boolean;
    requests: boolean;
    search: boolean;
  };
  handleAcceptRequest: (requestId: string, userName: string) => Promise<void>;
  handleRejectRequest: (requestId: string, userName: string) => Promise<void>;
  handleRemoveFriend: (userId: string, userName: string) => Promise<void>;
  handleSendRequest: (userId: string, userName: string) => Promise<void>;
  searchForUsers: (query: string, page?: number, suggested?: boolean) => Promise<void>;
  filterFriends: (query: string) => User[];
  filterRequests: (query: string) => FriendRequest[];
}

export function useFriends(): UseFriendsReturn {
  const { toast } = useToast();
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState({
    friends: true,
    requests: true,
    search: false
  });
  const [usersPagination, setUsersPagination] = useState<UserSearchPagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0
  });
  // Load initial data when the component mounts
  useEffect(() => {
    loadFriends();
    loadFriendRequests();
    searchForUsers("", 1, true); // Load initial suggested users
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load friends list
  const loadFriends = async () => {
    setIsLoading(prev => ({ ...prev, friends: true }));
    try {
      const friendsList = await FriendshipService.getFriends();
      setFriends(friendsList);
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to load friends. Please try again later.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, friends: false }));
    }
  };

  // Load friend requests
  const loadFriendRequests = async () => {
    setIsLoading(prev => ({ ...prev, requests: true }));
    try {
      const requests = await FriendshipService.getFriendRequests();
      setFriendRequests(requests);
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to load friend requests. Please try again later.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Accept a friend request
  const handleAcceptRequest = async (requestId: string, userName: string) => {
    try {
      const success = await FriendshipService.acceptFriendRequest(requestId);
      
      if (success) {
        // Remove the request from the list
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Reload friends list
        loadFriends();
        
        toast({
          title: "Friend request accepted",
          description: `You are now friends with ${userName}!`,
        });
      }
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to accept friend request. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Reject a friend request
  const handleRejectRequest = async (requestId: string, userName: string) => {
    try {
      const success = await FriendshipService.rejectFriendRequest(requestId);
      
      if (success) {
        // Remove the request from the list
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        
        toast({
          title: "Friend request rejected",
          description: `Request from ${userName} has been declined.`,
        });
      }
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to reject friend request. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Remove a friend
  const handleRemoveFriend = async (userId: string, userName: string) => {
    try {
      const success = await FriendshipService.removeFriend(userId);
      
      if (success) {
        // Remove the friend from the list
        setFriends(prev => prev.filter(friend => friend.id.toString() !== userId));
        
        toast({
          title: "Friend removed",
          description: `${userName} has been removed from your friends list.`,
        });
      }
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to remove friend. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Send a friend request
  const handleSendRequest = async (userId: string, userName: string) => {
    try {
      const success = await FriendshipService.sendFriendRequest(userId);
      
      if (success) {
        // Add to sent requests for UI state
        setSentRequests(prev => [...prev, userId]);
        
        toast({
          title: "Friend request sent",
          description: `Your request to ${userName} has been sent!`,
        });
      }
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to send friend request. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Search for users
  const searchForUsers = async (query: string, page: number = 1, suggested: boolean = false) => {
    setIsLoading(prev => ({ ...prev, search: true }));
    try {
      const result = await FriendshipService.searchUsers(query, page, suggested);
      setSearchUsers(result.users);
      setUsersPagination(result.pagination);
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to search for users. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, search: false }));
    }
  };

  // Filter friends by name or username
  const filterFriends = (query: string): User[] => {
    if (!query) return friends;
    
    return friends.filter(friend =>
      friend.name.toLowerCase().includes(query.toLowerCase()) ||
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Filter requests by name or username
  const filterRequests = (query: string): FriendRequest[] => {
    if (!query) return friendRequests;
    
    return friendRequests.filter(request =>
      request.user.name.toLowerCase().includes(query.toLowerCase()) ||
      request.user.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    friends,
    friendRequests,
    sentRequests,
    searchUsers,
    usersPagination,
    isLoading,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend,
    handleSendRequest,
    searchForUsers,
    filterFriends,
    filterRequests
  };
}
