<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FriendsController extends Controller
{
    /**
     * Get the list of restricted usernames that cannot be used in friend operations.
     *
     * @return array
     */
    private function getRestrictedUsernames(): array
    {
        return ['admin', 'administrator', 'moderator', 'superuser', 'root', 'sysadmin', 'system'];
    }
    /**
     * Search for users to add as friends.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->input('query', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $suggested = $request->input('suggested', false);
        $currentUserId = $request->user()->id;

        // Base query to exclude current user and restricted usernames
        $usersQuery = User::where('id', '!=', $currentUserId)
            ->whereNotIn('username', $this->getRestrictedUsernames());

        // Apply search filter if provided
        if ($query) {
            $usersQuery->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")->orWhere('username', 'like', "%{$query}%")->orWhere('bio', 'like', "%{$query}%");
            });
        }

        // TODO: Implement more complex search logic if needed, e.g., by email or location
        // If suggested users are requested, apply additional logic
        if ($suggested) {
            $usersQuery->orderBy('created_at', 'desc');
        } else {
            // For browse all, just sort alphabetically
            $usersQuery->orderBy('name');
        }

        // Execute pagination
        $users = $usersQuery->paginate($perPage, ['*'], 'page', $page);

        // Get sent friend request ids to check if current user has already sent requests
        $sentRequestIds = FriendRequest::where('sender_id', $currentUserId)
            ->whereIn('receiver_id', $users->items())
            ->pluck('receiver_id')
            ->toArray();

        // Get existing friendship ids
        $friendIds = Friendship::where('user_id', $currentUserId)
            ->whereIn('friend_id', $users->items())
            ->pluck('friend_id')
            ->toArray();

        // Format and return response
        $formattedUsers = collect($users->items())->map(function($user) use ($sentRequestIds, $friendIds) {
            // Check if avatar is a storage path and convert to URL
            $avatar = $user->avatar;
            if ($avatar && !str_starts_with($avatar, 'http')) {
                $avatar = asset('storage/' . $avatar);
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'profilePicture' => $avatar,
                'bio' => $user->bio,
                'isRequestSent' => in_array($user->id, $sentRequestIds),
                'isFriend' => in_array($user->id, $friendIds),
            ];
        });

        return response()->json([
            'success' => true,
            'users' => $formattedUsers,
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem()
            ]
        ]);
    }

    /**
     * Send a friend request to another user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendRequest(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $receiverId = $request->input('user_id');
        $sender = $request->user();

        // Check if receiver is the same as sender
        if ($sender->id == $receiverId) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send a friend request to yourself'
            ], 400);
        }

        // Check if receiver has a restricted username
        $receiver = User::find($receiverId);
        if ($receiver && in_array($receiver->username, $this->getRestrictedUsernames())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot send friend requests to this user'
            ], 403);
        }

        // Check if a request already exists
        $existingRequest = FriendRequest::where('sender_id', $sender->id)
            ->where('receiver_id', $receiverId)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Friend request already sent'
            ], 400);
        }

        // Check if they are already friends
        $existingFriendship = Friendship::where(function($query) use ($sender, $receiverId) {
            $query->where('user_id', $sender->id)->where('friend_id', $receiverId);
        })->orWhere(function($query) use ($sender, $receiverId) {
            $query->where('user_id', $receiverId)->where('friend_id', $sender->id);
        })->first();

        if ($existingFriendship) {
            return response()->json([
                'success' => false,
                'message' => 'You are already friends with this user'
            ], 400);
        }

        // Create new friend request
        $friendRequest = new FriendRequest([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'status' => 'pending'
        ]);

        $friendRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Friend request sent successfully',
            'request' => [
                'id' => $friendRequest->id,
                'sender_id' => $friendRequest->sender_id,
                'receiver_id' => $friendRequest->receiver_id,
                'status' => $friendRequest->status,
                'created_at' => $friendRequest->created_at
            ]
        ], 201);
    }

    /**
     * Get all received friend requests.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getReceivedRequests(Request $request): JsonResponse
    {
        $user = $request->user();

        $requests = $user->receivedFriendRequests()
            ->with('sender')
            ->where('status', 'pending')
            ->get();

        $formattedRequests = $requests->map(function($request) {
            // Get avatar URL
            $avatar = $request->sender->avatar;
            if ($avatar && !str_starts_with($avatar, 'http')) {
                $avatar = asset('storage/' . $avatar);
            }

            // Calculate mutual friends
            $mutualFriends = $this->getMutualFriendsCount($request->sender_id, $request->receiver_id);

            return [
                'id' => $request->id,
                'user' => [
                    'id' => $request->sender->id,
                    'name' => $request->sender->name,
                    'username' => $request->sender->username,
                    'profilePicture' => $avatar,
                    'bio' => $request->sender->bio,
                ],
                'mutualFriends' => $mutualFriends,
                'requestedAt' => $request->created_at->diffForHumans()
            ];
        });

        return response()->json([
            'success' => true,
            'requests' => $formattedRequests
        ]);
    }

    /**
     * Get the count of received friend requests.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getReceivedRequestsCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = $user->receivedFriendRequests()
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }

    /**
     * Accept a friend request.
     *
     * @param Request $request
     * @param int $requestId
     * @return JsonResponse
     */
    public function acceptRequest(Request $request, int $requestId): JsonResponse
    {
        $user = $request->user();

        $friendRequest = FriendRequest::where('id', $requestId)
            ->where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Friend request not found'
            ], 404);
        }

        // Update request status
        $friendRequest->status = 'accepted';
        $friendRequest->accepted_at = now();
        $friendRequest->save();

        // Create mutual friendship entries
        Friendship::create([
            'user_id' => $friendRequest->sender_id,
            'friend_id' => $friendRequest->receiver_id
        ]);

        Friendship::create([
            'user_id' => $friendRequest->receiver_id,
            'friend_id' => $friendRequest->sender_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Friend request accepted successfully'
        ]);
    }

    /**
     * Reject a friend request.
     *
     * @param Request $request
     * @param int $requestId
     * @return JsonResponse
     */
    public function rejectRequest(Request $request, $requestId): JsonResponse
    {
        $user = $request->user();

        $friendRequest = FriendRequest::where('id', $requestId)
            ->where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Friend request not found'
            ], 404);
        }

        // Update request status
        $friendRequest->status = 'rejected';
        $friendRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Friend request rejected successfully'
        ]);
    }

    /**
     * Get user's friends list.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getFriends(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = $request->input('query', ''); // Optional search query

        $friends = $user->friends();

        // Apply search filter if provided
        if ($query) {
            $friends->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")->orWhere('username', 'like', "%{$query}%");
            });
        }

        $friends = $friends->get();

        $formattedFriends = $friends->map(function($friend) {
            // Get avatar URL
            $avatar = $friend->avatar;
            if ($avatar && !str_starts_with($avatar, 'http')) {
                $avatar = asset('storage/' . $avatar);
            }

            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'username' => $friend->username,
                'profilePicture' => $avatar,
                'bio' => $friend->bio,
            ];
        });

        return response()->json([
            'success' => true,
            'friends' => $formattedFriends
        ]);
    }

    /**
     * Remove a friend.
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function removeFriend(Request $request, $userId): JsonResponse
    {
        $user = $request->user();

        // Get the friend user before deleting the friendship
        $friend = User::find($userId);
        if (!$friend) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Delete both sides of the friendship
        $deleted = Friendship::where(function($query) use ($user, $userId) {
            $query->where('user_id', $user->id)->where('friend_id', $userId);
        })->orWhere(function($query) use ($user, $userId) {
            $query->where('user_id', $userId)->where('friend_id', $user->id);
        })->delete();

        FriendRequest::where(function($query) use ($user, $userId) {
            $query->where('sender_id', $user->id)->where('receiver_id', $userId);
        })->orWhere(function($query) use ($user, $userId) {
            $query->where('sender_id', $userId)->where('receiver_id', $user->id);
        })->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Friendship not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Friend removed successfully'
        ]);
    }

    /**
     * Get count of mutual friends between two users.
     *
     * @param int $userId1
     * @param int $userId2
     * @return int
     */
    private function getMutualFriendsCount(int $userId1, int $userId2): int
    {
        // Get friend IDs for both users
        $user1Friends = Friendship::where('user_id', $userId1)->pluck('friend_id')->toArray();
        $user2Friends = Friendship::where('user_id', $userId2)->pluck('friend_id')->toArray();

        // Count the intersection of the two arrays
        $mutualFriends = count(array_intersect($user1Friends, $user2Friends));

        return $mutualFriends;
    }

    /**
     * Get mutual friends for one level of connections.
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function getMutualFriendsOneLevel(Request $request, $userId): JsonResponse
    {
        $currentUser = $request->user();
        
        // Validate the user ID
        $otherUser = User::find($userId);
        if (!$otherUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        
        try {
            // Get direct friends of the current user
            $currentUserFriends = Friendship::where('user_id', $currentUser->id)
                ->pluck('friend_id')
                ->toArray();
            
            // Get direct friends of the other user
            $otherUserFriends = Friendship::where('user_id', $userId)
                ->pluck('friend_id')
                ->toArray();

            // Find mutual friend IDs (direct mutual connections)
            $mutualFriendIds = array_intersect($currentUserFriends, $otherUserFriends);

            // Fetch detailed information for mutual friends
            $mutualFriends = User::whereIn('id', $mutualFriendIds)
                ->get()
                ->map(function ($user) {
                    // Format avatar URL if needed
                    $avatar = $user->avatar;
                    if ($avatar && !str_starts_with($avatar, 'http')) {
                        $avatar = asset('storage/' . $avatar);
                    }
                    
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'avatar' => $avatar
                    ];
                })
                ->values()
                ->toArray();

            $mutualCount = count($mutualFriends);
            
            return response()->json([
                'success' => true,
                'mutualFriendsCount' => $mutualCount,
                'mutualFriends' => $mutualFriends
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get mutual friends',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
