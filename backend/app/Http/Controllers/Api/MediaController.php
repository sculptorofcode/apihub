<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    protected $baseUrl = "https://api-hub-backend.onrender.com/api/v1";
    protected $apiKey = "YOUR_API_KEY"; // Replace with your actual API key or fetch from config

    /**
     * Upload media to external API and create a post
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadMedia(Request $request)
    {
        $user = Auth::user();

        // Validate the request
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
            'visibility' => 'sometimes|in:public,friends,private',
            'media' => 'required|file|max:20480', // 20MB max
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create multipart form
            $formData = [
                'multipart' => [
                    [
                        'name' => 'name',
                        'contents' => $request->input('name')
                    ],
                    [
                        'name' => 'title',
                        'contents' => $request->input('title')
                    ],
                    [
                        'name' => 'location',
                        'contents' => $request->input('location', '')
                    ],
                    [
                        'name' => 'image',
                        'contents' => fopen($request->file('media')->getPathname(), 'r'),
                        'filename' => $request->file('media')->getClientOriginalName()
                    ]
                ]
            ];

            // Make API request to upload image
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}"
            ])->post("{$this->baseUrl}/apicollection/postimg", $formData);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload media to external service',
                    'error' => $response->json() ?? 'Unknown error'
                ], 500);
            }

            $responseData = $response->json();

            // Create the post with the media URL from the response
            $mediaUrl = $responseData['media_url'] ?? null; // Adjust based on actual API response structure
            $mediaType = $request->file('media')->getMimeType();
            $mediaType = substr($mediaType, 0, strpos($mediaType, '/'));

            $post = new Post([
                'user_id' => $user->id,
                'content' => $request->input('content'),
                'visibility' => $request->input('visibility', 'public'),
                'media_url' => $mediaUrl,
                'media_type' => $mediaType,
                'location' => $request->input('location')
            ]);

            $post->save();
            $post->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully with media',
                'post' => $post
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while uploading media',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's uploaded images
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserImages(Request $request)
    {
        try {
            // Make API request to get images
            $response = Http::post("{$this->baseUrl}/apicollection/getyourimage", [
                'apiKey' => $this->apiKey
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch images from external service',
                    'error' => $response->json() ?? 'Unknown error'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching images',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
