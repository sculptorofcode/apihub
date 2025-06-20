<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Friendship;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|min:3|max:30|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        // Send verification email
        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please check your email for verification link.',
            'user' => $user,
        ], 201);
    }

    /**
     * Login a user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        Log::info('Login attempt', [
            'login' => $request->login,
            'ip' => $request->ip(),
            'userAgent' => $request->header('User-Agent')
        ]);
        // Validate request data
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if login is email or username
        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $loginValue = $request->login;

        // Find the user
        $user = User::where($loginField, $loginValue)->first();

        // Check password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            // Resend verification email
            try {
                $user->sendEmailVerificationNotification();
                $emailSent = true;
            } catch (\Exception $e) {
                Log::error('Failed to send verification email: ' . $e->getMessage());
                $emailSent = false;
            }

            return response()->json([
                'success' => false,
                'message' => 'Email not verified. ' .
                    ($emailSent ? 'A new verification link has been sent to your email.' : 'Failed to send verification email.'),
                'unverified' => true,
                'email' => $user->email,
                'email_sent' => $emailSent
            ], 403);
        }

        // Delete previous tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User logged in', [
            'userId' => $user->id,
            'username' => $user->username
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $this->formatUserProfile($user)
        ]);
    }

    /**
     * Get authenticated user details
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        Log::info('Authenticated user access', [
            'userId' => $user->id,
            'username' => $user->username
        ]);

        return response()->json([
            'success' => true,
            'user' => $this->formatUserProfile($user),
        ]);
    }

    /**
     * Logout user (revoke token)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke all tokens
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Refresh token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        // Revoke all tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'token' => $token
        ]);
    }

    /**
     * Send a reset link to the given user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete all old tokens
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Generate token
        $token = Str::random(64);

        // Insert token record
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // Get user
        $user = User::where('email', $request->email)->first();

        // Send password reset email
        $resetLink = env('FRONTEND_URL', 'http://localhost:5173') . '/auth/reset-password/' . $token . '?email=' . urlencode($request->email);

        // Send email with reset link
        Mail::send('emails.reset-password', [
            'resetLink' => $resetLink,
            'user' => $user
        ], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset your password');
        });

        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email'
        ]);
    }

    /**
     * Reset the user's password
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resetPassword(Request $request): JsonResponse
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find token record
        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // Check if token exists and is valid
        if (!$tokenRecord || !Hash::check($request->token, $tokenRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 400);
        }

        // Check if token is expired (tokens valid for 60 minutes)
        if (now()->diffInMinutes(\Carbon\Carbon::parse($tokenRecord->created_at)) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'success' => false,
                'message' => 'Token expired'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete used token
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Logout user from all devices
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }

    /**
     * Check if a username is available
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkUsernameAvailability(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username format',
                'errors' => $validator->errors(),
                'available' => false
            ], 422);
        }

        $username = $request->input('username');

        // Check for restricted usernames
        $restrictedUsernames = ['admin', 'administrator', 'moderator', 'superuser', 'root', 'sysadmin', 'system'];

        // Check if the username is a restricted term
        if (in_array(strtolower($username), $restrictedUsernames)) {
            return response()->json([
                'success' => true,
                'available' => false,
                'username' => $username,
                'message' => 'This username is reserved'
            ]);
        }

        // Check if username exists in database
        $exists = User::where('username', $username)->exists();

        return response()->json([
            'success' => true,
            'available' => !$exists,
            'username' => $username
        ]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = User::find($request->id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified'
            ]);
        }

        // Check the hash
        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $request->hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link'
            ], 400);
        }

        Log::info('Email verification attempt', [
            'userId' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'requestHash' => $request->hash,
            'expectedHash' => sha1($user->getEmailForVerification()),
            'signatureValid' => $request->hasValidSignature(),
        ]);

        // Check the signature
        if (!$request->hasValidSignature()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid/expired verification link'
            ], 400);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully'
        ]);
    }

    /**
     * Resend the email verification notification.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified'
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification link sent successfully'
        ]);
    }

    /**
     * Get mutual friends count
     *
     * @param int $userId
     * @param int $friendId
     * @return array
     */
    public function getMutualFriendsCount(int $userId, int $friendId): array
    {
        // If either ID is null or 0, return 0
        if (!$userId || !$friendId) {
            return [
                'mutualFriendsCount' => 0,
                'mutualFriends' => []
            ];
        }

        try {
            $userFriends = Friendship::where('user_id', $userId)->pluck('friend_id')->toArray();
            $friendFriends = Friendship::where('user_id', $friendId)->pluck('friend_id')->toArray();

            // Find mutual friend IDs
            $mutualFriendIds = array_intersect($userFriends, $friendFriends);

            // Fetch usernames and avatars for mutual friends
            $mutualFriends = User::whereIn('id', $mutualFriendIds)
                ->get()
                ->map(function ($user) {
                    $avatar = $user->avatar;
                    if ($avatar && !str_starts_with($avatar, 'http')) {
                        $avatar = asset('storage/' . $avatar);
                    }
                    return $this->formatUserProfile($user, false);
                })
                ->values()
                ->toArray();

            $mutualCount = count($mutualFriends);

            return [
                'mutualFriendsCount' => $mutualCount,
                'mutualFriends' => $mutualFriends
            ];
        } catch (Exception $e) {
            Log::error('Error getting mutual friends count', [
                'error' => $e->getMessage(),
                'userId' => $userId,
                'friendId' => $friendId
            ]);
            return [
                'mutualFriendsCount' => 0,
                'mutualFriends' => []
            ];
        }
    }

    /**
     * Get mutual friends count for one level of connections
     *
     * @param int $userId
     * @param int $friendId
     * @return array
     */
    public function getMutualFriendsCountOneLevel(int $userId, int $friendId): array
    {
        // If either ID is null or 0, return 0
        if (!$userId || !$friendId) {
            return [
                'mutualFriendsCount' => 0,
                'mutualFriends' => []
            ];
        }

        try {
            // Get direct friends of the user
            $userFriends = Friendship::where('user_id', $userId)->pluck('friend_id')->toArray();

            // Get direct friends of the potential friend
            $friendFriends = Friendship::where('user_id', $friendId)->pluck('friend_id')->toArray();

            // Find mutual friend IDs at level 1 (direct mutual connections)
            $mutualFriendIds = array_intersect($userFriends, $friendFriends);

            // Fetch usernames and avatars for mutual friends
            $mutualFriends = User::whereIn('id', $mutualFriendIds)
                ->get()
                ->map(function ($user) {
                    return $this->formatUserProfile($user);
                })
                ->values()
                ->toArray();

            $mutualCount = count($mutualFriends);

            return [
                'mutualFriendsCount' => $mutualCount,
                'mutualFriends' => $mutualFriends
            ];
        } catch (Exception $e) {
            Log::error('Error getting mutual friends count (one level)', [
                'error' => $e->getMessage(),
                'userId' => $userId,
                'friendId' => $friendId
            ]);
            return [
                'mutualFriendsCount' => 0,
                'mutualFriends' => []
            ];
        }
    }


    /**
     * Format user profile for API response
     *
     * @param User $user
     * @param bool $fetchMutual
     * @param ?bool $fetchFriends
     * @return array
     */
    public function formatUserProfile(User $user, bool $fetchMutual = true, bool $fetchFriends = true): array
    {
        $avatar = $user->avatar;
        if ($avatar && !str_starts_with($avatar, 'http')) {
            $avatar = asset('storage/' . $avatar);
        }

        $banner = $user->banner;
        if ($banner && !str_starts_with($banner, 'http')) {
            $banner = asset('storage/' . $banner);
        }

        $friendsCount = $user->friends()->count();
        if ($fetchFriends) {
            $friends = $user->friends()->get()->map(function ($friend) {
                return $this->formatUserProfile($friend, false, false);
            })->toArray();
        } else {
            $friends = [];
        }
        $mutualFriendsCount = 0;
        $mutualFriends = [];
        $isFriend = false;
        $isRequestSent = false;

        $currentUser = request()->user();
        Log::info('Current user', [
            'currentUserId' => $currentUser ? $currentUser->id : null,
            'viewedUserId' => $user->id
        ]);

        if ($currentUser && $currentUser->id !== $user->id && $fetchMutual) {
            // Calculate mutual friends
            $mutual = $this->getMutualFriendsCount($currentUser->id, $user->id);
            $mutualFriendsCount = $mutual['mutualFriendsCount'];
            $mutualFriends = $mutual['mutualFriends'];

            // Check if they are friends
            $isFriend = $currentUser->friendships()
                ->where('friend_id', $user->id)
                ->exists();

            // Check if a friend request has been sent
            if (!$isFriend) {
                $isRequestSent = $currentUser->sentFriendRequests()
                    ->where('receiver_id', $user->id)
                    ->whereNull('accepted_at')
                    ->where('status', '!=', 'rejected')
                    ->exists();
            }
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $avatar,
            'banner' => $banner,
            'bio' => $user->bio,
            'location' => $user->location,
            'website' => $user->website,
            'phone' => $user->phone,
            'friendsCount' => $friendsCount,
            'friends' => $friends,
            'mutualFriendsCount' => $mutualFriendsCount,
            'mutualFriends' => $mutualFriends,
            'isFriend' => $isFriend,
            'isRequestSent' => $isRequestSent,
            'last_active_at' => $user->last_active_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }


    /**
     * Get user profile
     *
     * @param string $username
     * @return JsonResponse
     */
    public function show(string $username): JsonResponse
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Log information about the request and authentication
        $currentUser = request()->user();
        Log::info('Public profile access', [
            'username' => $username,
            'authenticated' => !is_null($currentUser),
            'currentUserId' => $currentUser ? $currentUser->id : null,
            'request' => request()->all()
        ]);

        return response()->json([
            'success' => true,
            'user' => $this->formatUserProfile($user),
        ]);
    }

    /**
     * Update user profile
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'bio' => 'sometimes|nullable|string|max:1000',
            'location' => 'sometimes|nullable|string|max:255',
            'website' => 'sometimes|nullable|string|url|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'avatar' => 'sometimes|nullable|image|max:5120',
            'banner' => 'sometimes|nullable|image|max:10240', // Max 10MB for banner images
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            try {
                // Delete old avatar if it exists and isn't a URL
                if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Store new avatar
                $path = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $path;

                Log::info('Avatar uploaded successfully', [
                    'path' => $path
                ]);
            } catch (Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Avatar upload failed: ' . $e->getMessage(),
                ], 500);
            }
        }

        // Handle banner upload
        if ($request->hasFile('banner')) {
            try {
                // Delete old banner if it exists and isn't a URL
                if ($user->banner && !str_starts_with($user->banner, 'http')) {
                    Storage::disk('public')->delete($user->banner);
                }

                // Store new banner
                $path = $request->file('banner')->store('banners', 'public');
                $user->banner = $path;

                Log::info('Banner uploaded successfully', [
                    'path' => $path
                ]);
            } catch (Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Banner upload failed: ' . $e->getMessage(),
                ], 500);
            }
        }        // Update other fields
        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('username')) {
            $user->username = $request->username;
        }
        if ($request->has('bio')) $user->bio = $request->bio;
        if ($request->has('location')) $user->location = $request->location;
        if ($request->has('website')) $user->website = $request->website;
        if ($request->has('phone')) $user->phone = $request->phone;
        $user->save();

        // Prepare detailed response
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $this->formatUserProfile($user),
        ]);
    }

    /**
     * Update last active timestamp
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateActivity(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->last_active_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Activity updated'
        ]);
    }
}
