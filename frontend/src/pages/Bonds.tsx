import React, { useState, useEffect } from 'react';

import BondsHeader from '@/components/bonds/BondsHeader';
import BondsSearchBar from '@/components/bonds/BondsSearchBar';
import FriendRequestsSection from '@/components/bonds/FriendRequestsSection';
import FriendsListSection from '@/components/bonds/FriendsListSection';
import FindFriendsSection from '@/components/bonds/FindFriendsSection';
import { User } from '@/contexts/auth/auth-types';
import apiClient from '@/api/apiConfig';
import { API_ROUTES } from '@/api/apiRoutes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/useAuth';

interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  requestedAt: string;
}

const Bonds: React.FC = () => {
  const { toast } = useToast();
  const { token, user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState({
    friends: true,
    requests: true
  });
  useEffect(() => {
    if (token) {
      loadFriends();
      loadFriendRequests();

      // Load initial suggested users
      searchForUsers("", 1, true);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  // Load friends from the API
  const loadFriends = async () => {
    setIsLoading(prev => ({ ...prev, friends: true }));
    try {
      const response = await apiClient.get(API_ROUTES.friends.getFriends, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setFriends(response.data.friends);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: 'Error',
        description: 'Failed to load friends. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, friends: false }));
    }
  };
  // Load friend requests from the API
  const loadFriendRequests = async () => {
    setIsLoading(prev => ({ ...prev, requests: true }));
    try {
      const response = await apiClient.get(API_ROUTES.friends.getRequests, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setFriendRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error loading friend requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load friend requests. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const handleAcceptRequest = async (requestId: string, userName: string) => {
    try {
      const response = await apiClient.post(API_ROUTES.friends.acceptRequest(requestId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
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
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept friend request. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleRejectRequest = async (requestId: string, userName: string) => {
    try {
      const response = await apiClient.post(API_ROUTES.friends.rejectRequest(requestId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Remove the request from the list
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));

        toast({
          title: "Friend request rejected",
          description: `Request from ${userName} has been declined.`,
        });
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject friend request. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveFriend = async (userId: string, userName: string) => {
    try {
      const response = await apiClient.delete(API_ROUTES.friends.removeFriend(userId), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Remove the friend from the list
        setFriends(prev => prev.filter(friend => friend.id.toString() !== userId));

        toast({
          title: "Friend removed",
          description: `${userName} has been removed from your friends list.`,
        });
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove friend. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSendRequest = async (userId: string, userName: string) => {
    try {
      const response = await apiClient.post(API_ROUTES.friends.sendRequest, { user_id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Add to sent requests for UI state
        setSentRequests(prev => [...prev, userId]);

        toast({
          title: "Friend request sent",
          description: `Your request to ${userName} has been sent!`,
        });
      }
    } catch (error: unknown) {
      console.error('Error sending friend request:', error);
      const apiClientError = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Error',
        description: apiClientError.response?.data?.message || 'Failed to send friend request. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter(request =>
    request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );  // UseState to track user search
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0
  });
  // Search users API call for FindFriendsSection with pagination and suggested/all support
  const searchForUsers = async (query: string, page: number = 1, suggested: boolean = false) => {
    setSearchLoading(true);
    try {
      if (query === "" && page === 1) {
        // Load initial set for tab (suggested or browse all)
        const timestamp = new Date().getTime();
        const response = await apiClient.get(
          `${API_ROUTES.friends.searchWithParams('', page, suggested)}&_nocache=${timestamp}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            } 
          }
        );

        if (response.data.success) {
          setSearchUsers(response.data.users);
          setUsersPagination(response.data.pagination);
        }
        return;
      }

      // Search with query and pagination
      const timestamp = new Date().getTime();
      const response = await apiClient.get(
        `${API_ROUTES.friends.searchWithParams(query, page, suggested)}&_nocache=${timestamp}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        }
      );

      if (response.data.success) {
        setSearchUsers(response.data.users);
        setUsersPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <BondsHeader />
        <BondsSearchBar value={searchQuery} onChange={setSearchQuery} />
        <FriendRequestsSection
          friendRequests={friendRequests}
          filteredRequests={filteredRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          searchQuery={searchQuery}
          isLoading={isLoading.requests}
        />
        <FriendsListSection
          friends={friends}
          filteredFriends={filteredFriends}
          onRemove={handleRemoveFriend}
          searchQuery={searchQuery}
          isLoading={isLoading.friends}
        />
        <FindFriendsSection
          users={searchUsers}
          currentUserId={currentUser?.id?.toString() || ""}
          sentRequests={sentRequests}
          onSendRequest={handleSendRequest}
          onSearch={searchForUsers}
          isLoading={searchLoading}
          pagination={usersPagination}
        />
      </div>
    </div>
  );
};

export default Bonds;
