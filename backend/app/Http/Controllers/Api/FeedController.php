<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FeedController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Auth is handled at the route level
    }

    /**
     * Get posts for the feed
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Get page from query parameters
        $page = max(1, intval($request->query('page', 1)));
        $postsPerPage = 10;

        // Get the authenticated user (if any)
        $user = $request->user();

        // Start query builder
        $query = Post::query()
            ->with(['user'])
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc');
        // If authenticated, include posts from friends and own posts
        if ($user) {
            // Get user's friends IDs (if the friends relationship exists)
            $friendsIds = [];
            if (method_exists($user, 'friends')) {
                $friendsIds = $user->friends()->pluck('users.id')->toArray();
            }

            $query->where(function ($q) use ($user, $friendsIds) {
                $q->where('visibility', 'public')
                    ->orWhere(function ($q) use ($user, $friendsIds) {
                        $q->where('visibility', 'friends')
                            ->whereIn('user_id', array_merge([$user->id], $friendsIds));
                    })
                    ->orWhere(function ($q) use ($user) {
                        $q->where('visibility', 'private')
                            ->where('user_id', $user->id);
                    });
            });
        }

        // Get paginated posts
        $posts = $query->paginate($postsPerPage, ['*'], 'page', $page);

        return response()->json([
            'posts' => $posts->items(),
            'hasMore' => $posts->hasMorePages(),
            'total' => $posts->total(),
            'success' => true,
        ]);
    }
    /**
     * Like or unlike a post
     *
     * @param Request $request
     * @param string $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function like(Request $request, $postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        // Check if the user already liked this post
        $liked = $post->likes()->where('user_id', $user->id)->exists();

        if ($liked) {
            // Unlike the post
            $post->likes()->detach($user->id);
            $liked = false;
        } else {
            // Like the post
            $post->likes()->attach($user->id);
            $liked = true;
        }

        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likesCount' => $post->likes()->count(),
            'message' => $liked ? 'Post liked' : 'Post unliked'
        ]);
    }

    /**
     * Bookmark or unbookmark a post
     *
     * @param Request $request
     * @param string $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function bookmark(Request $request, $postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        // Check if the user already bookmarked this post
        $bookmarked = $post->bookmarks()->where('user_id', $user->id)->exists();

        if ($bookmarked) {
            // Remove bookmark
            $post->bookmarks()->detach($user->id);
            $bookmarked = false;
        } else {
            // Add bookmark
            $post->bookmarks()->attach($user->id);
            $bookmarked = true;
        }

        return response()->json([
            'success' => true,
            'bookmarked' => $bookmarked,
            'message' => $bookmarked ? 'Post bookmarked' : 'Bookmark removed'
        ]);
    }

    /**
     * Create a new post
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validate the request
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
            'visibility' => 'sometimes|in:public,friends,private',
            'image' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:5120', // 5MB max
            'video' => 'sometimes|mimes:mp4,avi,mov|max:51200', // 50MB max
            'file' => 'sometimes|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        // Create the post
        $post = new Post([
            'user_id' => $user->id,
            'content' => $request->input('content'),
            'visibility' => $request->input('visibility', 'public'),
        ]);

        $post->save();

        // Handle file uploads
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts/images', 'public');
            $post->image = Storage::url($path);
        }

        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('posts/videos', 'public');
            $post->video = Storage::url($path);
        }

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('posts/files', 'public');
            $post->file = Storage::url($path);
        }

        $post->save();

        // Load the user relationship for the response
        $post->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'post' => $post
        ]);
    }

    /**
     * Add a comment to a post
     *
     * @param Request $request
     * @param string $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeComment(Request $request, $postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create the comment
        $comment = new Comment([
            'content' => $request->input('content'),
            'parent_id' => $request->input('parent_id'),
        ]);

        $comment->user()->associate($user);
        $comment->post()->associate($post);
        $comment->save();

        // Load the relationships for the response
        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'comment' => $comment
        ]);
    }

    /**
     * Get comments for a post
     *
     * @param Request $request
     * @param string $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getComments(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        $page = max(1, intval($request->query('page', 1)));
        $commentsPerPage = 10;

        // Get comments with pagination, ordered by creation date
        $comments = $post->comments()
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($commentsPerPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'comments' => $comments->items(),
            'hasMore' => $comments->hasMorePages(),
            'total' => $comments->total(),
        ]);
    }

    /**
     * Like or unlike a comment
     *
     * @param Request $request
     * @param string $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function likeComment(Request $request, $commentId)
    {
        $user = Auth::user();
        $comment = Comment::findOrFail($commentId);
        
        // Check if the user already liked this comment
        $liked = $comment->likes()->where('user_id', $user->id)->exists();
        
        if ($liked) {
            // Unlike the comment
            $comment->likes()->detach($user->id);
            $liked = false;
        } else {
            // Like the comment
            $comment->likes()->attach($user->id);
            $liked = true;
        }
        
        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likesCount' => $comment->likes()->count(),
            'message' => $liked ? 'Comment liked' : 'Comment unliked'
        ]);
    }

    /**
     * Get a single post by ID
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $post = Post::with('user')
            ->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'post' => $post
        ]);
    }
    
    /**
     * Update an existing post
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $post = Post::findOrFail($id);
        
        // Check if user owns the post
        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'content' => 'sometimes|string|max:5000',
            'visibility' => 'sometimes|in:public,friends,private',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update the post
        if ($request->has('content')) {
            $post->content = $request->input('content');
        }
        
        if ($request->has('visibility')) {
            $post->visibility = $request->input('visibility');
        }
        
        $post->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully',
            'post' => $post
        ]);
    }
    
    /**
     * Delete a post
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $user = Auth::user();
        $post = Post::findOrFail($id);
        
        // Check if user owns the post
        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        // Delete any media files
        if ($post->image) {
            Storage::delete(str_replace('/storage/', 'public/', $post->image));
        }
        
        if ($post->video) {
            Storage::delete(str_replace('/storage/', 'public/', $post->video));
        }
        
        if ($post->file) {
            Storage::delete(str_replace('/storage/', 'public/', $post->file));
        }
        
        // Delete the post
        $post->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully'
        ]);
    }

    /**
     * Update a comment
     *
     * @param Request $request
     * @param string $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateComment(Request $request, $commentId)
    {
        $user = Auth::user();
        $comment = Comment::findOrFail($commentId);
        
        // Check if user owns the comment
        if ($comment->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update the comment
        $comment->content = $request->input('content');
        $comment->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }
    
    /**
     * Delete a comment
     *
     * @param Request $request
     * @param string $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyComment(Request $request, $commentId)
    {
        $user = Auth::user();
        $comment = Comment::findOrFail($commentId);
        
        // Check if user owns the comment
        if ($comment->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        // Delete the comment
        $comment->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Get the bookmarked posts for the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBookmarks(Request $request)
    {
        $user = $request->user();
        $page = max(1, intval($request->query('page', 1)));
        $postsPerPage = 10;
        
        // Get bookmarked posts with pagination
        $bookmarks = $user->bookmarkedPosts()
            ->with('user')
            ->orderBy('post_bookmarks.created_at', 'desc')
            ->paginate($postsPerPage, ['*'], 'page', $page);
        
        return response()->json([
            'success' => true,
            'posts' => $bookmarks->items(),
            'hasMore' => $bookmarks->hasMorePages(),
            'total' => $bookmarks->total(),
        ]);
    }

    /**
     * Get posts for a specific user
     * 
     * @param Request $request
     * @param string $username
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPosts(Request $request, $username)
    {
        $page = max(1, intval($request->query('page', 1)));
        $postsPerPage = 10;
        
        // Find the user by username
        $user = User::where('username', $username)->firstOrFail();
        
        // Get the authenticated user (if any)
        $currentUser = $request->user();
        
        // Build the query
        $query = Post::query()
            ->with(['user'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc');
        
        // Filter by visibility based on authentication and friendship status
        if (!$currentUser || $currentUser->id !== $user->id) {
            // For guests or other users, only show public posts
            $query->where('visibility', 'public');
            
            // If authenticated and friends, also show friend-visible posts
            if ($currentUser) {
                $isFriend = false;
                if (method_exists($currentUser, 'friends')) {
                    $isFriend = $currentUser->friends()->where('friends.id', $user->id)->exists();
                }
                
                if ($isFriend) {
                    $query->orWhere(function($q) use ($user) {
                        $q->where('user_id', $user->id)
                          ->where('visibility', 'friends');
                    });
                }
            }
        }
        
        // Get paginated posts
        $posts = $query->paginate($postsPerPage, ['*'], 'page', $page);
        
        return response()->json([
            'success' => true,
            'posts' => $posts->items(),
            'hasMore' => $posts->hasMorePages(),
            'total' => $posts->total(),
        ]);
    }
}
