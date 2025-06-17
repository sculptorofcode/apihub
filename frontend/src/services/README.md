# API Services Documentation

This document provides an overview of the service layer for API interactions in the Apihub application. These services centralize API requests and error handling.

## Available Services

### 1. AuthService

Handles user authentication operations.

```typescript
import { AuthService } from '@/services';

// Login
const loginResponse = await AuthService.login('username', 'password');

// Register a new user
const registrationResponse = await AuthService.register(
  'John Doe', 
  'john@example.com', 
  'johndoe', 
  'password123', 
  'password123'
);

// Get current user
const currentUser = await AuthService.getCurrentUser();

// Logout
await AuthService.logout();

// Password reset
await AuthService.forgotPassword('email@example.com');
await AuthService.resetPassword(token, email, newPassword, passwordConfirmation);

// Email verification
await AuthService.verifyEmail(id, hash, expires, signature);
await AuthService.resendVerificationEmail('email@example.com');
```

### 2. ProfileService

Manages user profile operations.

```typescript
import { ProfileService } from '@/services';

// Get a user's profile
const userProfile = await ProfileService.getUserProfile('username');

// Update profile
const updatedProfile = await ProfileService.updateProfile({
  bio: 'New bio text',
  location: 'New York'
});

// Update profile with file upload
const updatedProfileWithAvatar = await ProfileService.updateProfile({
  avatar: avatarFile, // File object
  name: 'New Name'
}, true); // true indicates there's a file upload

// Update activity status
await ProfileService.updateActivity();
```

### 3. FriendshipService

Handles friend requests and friendship operations.

```typescript
import { FriendshipService } from '@/services';

// Get friends list
const friends = await FriendshipService.getFriends();

// Get received friend requests
const friendRequests = await FriendshipService.getFriendRequests();

// Send friend request
await FriendshipService.sendFriendRequest(userId);

// Accept/reject friend requests
await FriendshipService.acceptFriendRequest(requestId);
await FriendshipService.rejectFriendRequest(requestId);

// Remove friend
await FriendshipService.removeFriend(userId);

// Search for users
const searchResult = await FriendshipService.searchUsers(
  'johnd', // search term
  1,       // page
  true     // get suggested users
);

// Access search results
const { users, pagination } = searchResult;
```

### 4. ErrorService

Provides utilities for error handling across the application.

```typescript
import { ErrorService } from '@/services';

try {
  // Some code that might throw an error
} catch (error) {
  // Get a user-friendly error message
  const errorMessage = ErrorService.getErrorMessage(
    error,
    'Something went wrong' // fallback message
  );
  
  // Log the error with context
  ErrorService.logError(
    'ComponentName.functionName',
    error,
    { additionalInfo: 'Some context data' }
  );
  
  // Display error message to user
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive'
  });
}
```

## Custom Hooks

The application also provides custom hooks built on top of these services for more convenient usage:

### 1. useUserProfile

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

const { profile, loading, error, refetch } = useUserProfile('username');
```

### 2. useFriends

```typescript
import { useFriends } from '@/hooks/useFriends';

const { 
  friends, 
  friendRequests, 
  handleAcceptRequest,
  handleRejectRequest,
  handleRemoveFriend,
  handleSendRequest,
  searchForUsers,
  searchUsers,
  filterFriends,
  filterRequests,
  isLoading 
} = useFriends();
```

## Best Practices

1. Always use the service layer for API calls instead of directly using apiClient
2. Handle errors with ErrorService to ensure consistent error messages
3. Use the provided hooks for common operations when appropriate
4. Don't forget to handle loading states in the UI
