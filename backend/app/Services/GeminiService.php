<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->apiUrl = config('services.gemini.api_url');
    }

    public function generateInsights(string $userIdea): array
    {
        $prompt = $this->buildPrompt($userIdea);
        
        try {
            $response = Http::timeout(30)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 1,
                    'topP' => 1,
                    'maxOutputTokens' => 2048,
                ]
            ]);

            if ($response->successful()) {
                return $this->parseResponse($response->json());
            }

            throw new \Exception('Gemini API request failed: ' . $response->status() . ' - ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Gemini API Error: ' . $e->getMessage());
            throw $e;
        }
    }

    private function buildPrompt(string $userIdea): string
    {
        return "I just discovered an idea that {$userIdea}. Help me take this idea to the next level. Think creatively but stay grounded—what are 3 unique, practical ways to develop or implement this idea in real life? Consider challenges, possible tools or technologies, and who might benefit from it most.

Please format your response as JSON with this exact structure:
{
    \"insights\": [
        {
            \"title\": \"First Implementation Strategy\",
            \"description\": \"Detailed description of the first approach\",
            \"challenges\": [\"challenge1\", \"challenge2\", \"challenge3\"],
            \"tools\": [\"tool1\", \"tool2\", \"tool3\"],
            \"beneficiaries\": [\"group1\", \"group2\", \"group3\"]
        },
        {
            \"title\": \"Second Implementation Strategy\",
            \"description\": \"Detailed description of the second approach\",
            \"challenges\": [\"challenge1\", \"challenge2\", \"challenge3\"],
            \"tools\": [\"tool1\", \"tool2\", \"tool3\"],
            \"beneficiaries\": [\"group1\", \"group2\", \"group3\"]
        },
        {
            \"title\": \"Third Implementation Strategy\",
            \"description\": \"Detailed description of the third approach\",
            \"challenges\": [\"challenge1\", \"challenge2\", \"challenge3\"],
            \"tools\": [\"tool1\", \"tool2\", \"tool3\"],
            \"beneficiaries\": [\"group1\", \"group2\", \"group3\"]
        }
    ]
}

Make sure to return only valid JSON without any additional text or markdown formatting.";
    }

    private function parseResponse(array $response): array
    {
        try {
            $content = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Clean the response to extract JSON
            $content = trim($content);
            
            // Remove markdown code blocks if present
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*$/', '', $content);
            
            // Try to extract JSON from the response
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');
            
            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonString = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
                $parsed = json_decode($jsonString, true);
                
                if ($parsed && isset($parsed['insights'])) {
                    return $parsed;
                }
            }
            
            // Fallback to plain text parsing
            return $this->parseTextResponse($content);
        } catch (\Exception $e) {
            Log::warning('Failed to parse Gemini response: ' . $e->getMessage());
            return $this->parseTextResponse($response['candidates'][0]['content']['parts'][0]['text'] ?? 'No response generated');
        }
    }

    private function parseTextResponse(string $content): array
    {
        // Basic text parsing fallback
        $lines = explode('\n', $content);
        $insights = [];
        
        // Try to extract key points from the text
        $currentInsight = null;
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;
            
            // Look for numbered points or bullet points
            if (preg_match('/^(\d+\.|\*|\-)\s*(.+)/', $line, $matches)) {
                if ($currentInsight) {
                    $insights[] = $currentInsight;
                }
                $currentInsight = [
                    'title' => $matches[2],
                    'description' => $matches[2],
                    'challenges' => ['Implementation complexity', 'Market adoption'],
                    'tools' => ['Technology stack', 'Development tools'],
                    'beneficiaries' => ['Target users', 'Stakeholders']
                ];
            } elseif ($currentInsight && strlen($line) > 20) {
                $currentInsight['description'] .= ' ' . $line;
            }
        }
        
        if ($currentInsight) {
            $insights[] = $currentInsight;
        }
        
        // If no structured content found, create a single insight
        if (empty($insights)) {
            $insights[] = [
                'title' => 'AI Generated Insights',
                'description' => $content,
                'challenges' => ['Technical implementation', 'User adoption', 'Market validation'],
                'tools' => ['Development framework', 'Analytics tools', 'User feedback systems'],
                'beneficiaries' => ['End users', 'Business stakeholders', 'Community']
            ];
        }
        
        return ['insights' => array_slice($insights, 0, 3)]; // Limit to 3 insights
    }
}
