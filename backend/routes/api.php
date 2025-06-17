<?php

use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\FriendsController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/auth/check-username', [AuthController::class, 'checkUsernameAvailability']);

// Public Feed Routes
Route::get('/feed', [FeedController::class, 'index']);
Route::get('/users/{username}/posts', [FeedController::class, 'getUserPosts']);

// Email Verification Routes
Route::get('/auth/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/auth/email/verify/resend', [AuthController::class, 'resendVerificationEmail'])->name('verification.resend');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user', [AuthController::class, 'user']);
  Route::post('/auth/logout', [AuthController::class, 'logout']);
  Route::post('/auth/refresh', [AuthController::class, 'refresh']);
  // Profile Routes
  Route::get('/profile/{username}', [AuthController::class, 'show']);
  Route::put('/profile', [AuthController::class, 'update']);
  Route::post('/profile', [AuthController::class, 'update']);
  Route::post('/profile/activity', [AuthController::class, 'updateActivity']);  // Feed API routes - Some are available without authentication
  Route::post('/posts', [FeedController::class, 'store']);
  Route::get('/posts/{id}', [FeedController::class, 'show']);
  Route::put('/posts/{id}', [FeedController::class, 'update']);
  Route::delete('/posts/{id}', [FeedController::class, 'destroy']);
  Route::post('/posts/{postId}/like', [FeedController::class, 'like']);
  Route::post('/posts/{postId}/bookmark', [FeedController::class, 'bookmark']);
  Route::post('/posts/{postId}/comments', [FeedController::class, 'storeComment']);
  Route::get('/posts/{postId}/comments', [FeedController::class, 'getComments']);
  Route::post('/comments/{commentId}/like', [FeedController::class, 'likeComment']);
  Route::put('/comments/{commentId}', [FeedController::class, 'updateComment']);
  Route::delete('/comments/{commentId}', [FeedController::class, 'destroyComment']);
  // Bookmarks route
  Route::get('/bookmarks', [FeedController::class, 'getBookmarks']);

  // Friends API routes
  Route::get('/friends/search', [FriendsController::class, 'searchUsers']);
  Route::post('/friends/request', [FriendsController::class, 'sendRequest']);
  Route::get('/friends/requests', [FriendsController::class, 'getReceivedRequests']);
  Route::get('/friends/requests/count', [FriendsController::class, 'getReceivedRequestsCount']);
  Route::post('/friends/requests/{requestId}/accept', [FriendsController::class, 'acceptRequest']);
  Route::post('/friends/requests/{requestId}/reject', [FriendsController::class, 'rejectRequest']);
  Route::get('/friends', [FriendsController::class, 'getFriends']);
  Route::delete('/friends/{userId}', [FriendsController::class, 'removeFriend']);
  Route::get('/friends/{userId}/mutual-friends', [FriendsController::class, 'getMutualFriendsOneLevel']);
});
