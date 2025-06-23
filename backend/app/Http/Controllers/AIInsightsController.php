<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateInsightsRequest;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AIInsightsController extends Controller
{
    public function __construct(
        private GeminiService $geminiService
    ) {}

    /**
     * Generate AI insights for a given idea
     */
    public function generateInsights(GenerateInsightsRequest $request): JsonResponse
    {
        try {
            $idea = $request->validated()['idea'];
            
            Log::info('Generating AI insights for idea', ['idea_length' => strlen($idea)]);
            
            $insights = $this->geminiService->generateInsights($idea);
            
            Log::info('Successfully generated AI insights', ['insights_count' => count($insights['insights'] ?? [])]);
            
            return response()->json([
                'success' => true,
                'data' => $insights,
                'message' => 'Insights generated successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to generate AI insights', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate insights. Please try again.',
                'error' => app()->environment('local') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get example ideas for inspiration
     */
    public function getExampleIdeas(): JsonResponse
    {
        $examples = [
            "I want to build an app that helps people swap unused household items with neighbors.",
            "I'm thinking of creating a platform where local businesses can offer skill exchanges instead of payment.",
            "I want to develop a service that connects elderly people with tech-savvy volunteers for digital assistance.",
            "I'm considering a subscription box for locally-sourced, seasonal ingredients with recipe cards.",
            "I want to create a mobile app that gamifies daily exercise by turning workouts into city exploration quests.",
            "I'm thinking of building a platform where people can rent out their parking spaces to commuters.",
            "I want to develop a service that matches dog owners for regular walking partnerships.",
            "I'm considering an app that helps college students find and share textbooks within their campus.",
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'examples' => $examples
            ]
        ]);
    }
}
