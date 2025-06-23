
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Lightbulb, TrendingUp, Users, Zap, ArrowRight, Target, Wrench, AlertCircle } from 'lucide-react';

interface Insight {
  title: string;
  description: string;
  challenges: string[];
  tools: string[];
  beneficiaries: string[];
}

interface InsightsResponse {
  insights: Insight[];
}

const AIInsights = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/ai-insights/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ idea: inputValue }),
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.data.insights);
      } else {
        setError(data.message || 'Failed to generate insights');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error generating insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "I want to build an app that helps people swap unused household items with neighbors.",
    "I'm thinking of creating a platform where local businesses can offer skill exchanges instead of payment.",
    "I want to develop a service that connects elderly people with tech-savvy volunteers for digital assistance.",
    "I'm considering a subscription box for locally-sourced, seasonal ingredients with recipe cards."
  ];

  const recentInsights = [
    {
      title: "Market Analysis: AI-Powered Education Tools",
      summary: "Growing market with 40% YoY growth. Key opportunities in personalized learning and automated assessment.",
      tags: ["Education", "AI", "Market Research"],
      confidence: 92,
      relatedPosts: 23
    },
    {
      title: "Trend Validation: Sustainable Fashion Marketplace",
      summary: "Strong consumer demand but high competition. Differentiation through local sourcing recommended.",
      tags: ["Sustainability", "Fashion", "E-commerce"],
      confidence: 87,
      relatedPosts: 15
    },
    {
      title: "Problem Analysis: Remote Team Collaboration",
      summary: "Major pain points identified in async communication and project visibility. Opportunity for specialized tools.",
      tags: ["Remote Work", "Productivity", "Communication"],
      confidence: 94,
      relatedPosts: 31
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-full bg-[var(--accent-500)]/10 border-2 border-[var(--accent-500)]/20">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-[var(--accent-500)]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3 sm:mb-4 px-2">
            AI Insights
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Get AI-powered market analysis, trend validation, and discover related discussions for your ideas
          </p>
        </div>

        {/* AI Input Section */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-[var(--accent-500)]/20 bg-[var(--background-50)] dark:bg-[var(--background-800)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                Describe your idea or ask a question
              </label>
              <Textarea
                placeholder="e.g., I want to build an app that helps people find local farmers markets. Can you analyze the market potential and show me related discussions?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] border-[var(--accent-300)] focus:border-[var(--accent-500)] text-sm sm:text-base"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="inline-flex items-center">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[var(--accent-500)]" />
                  AI-powered analysis
                </span>
              </p>
              
              <Button 
                type="submit" 
                disabled={!inputValue.trim() || isLoading}
                className="bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2"
              >
                {isLoading ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Insights
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Card>
        )}

        {/* AI Generated Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-6">
              AI Generated Insights
            </h2>
            <div className="space-y-6">
              {insights.map((insight, index) => (
                <Card key={index} className="p-6 border-l-4 border-l-blue-500">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
                      {insight.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {insight.challenges.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500" />
                          Challenges
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.challenges.map((challenge, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {challenge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {insight.tools.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          Tools & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.tools.map((tool, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {insight.beneficiaries.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          Who Benefits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.beneficiaries.map((beneficiary, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {beneficiary}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Example Prompts */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3 sm:mb-4 px-1">
            Try these examples:
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {examplePrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 sm:p-4 text-left justify-start hover:bg-[var(--accent-50)] hover:border-[var(--accent-300)] text-xs sm:text-sm"
                onClick={() => setInputValue(prompt)}
              >
                <Lightbulb className="h-4 w-4 mr-2 sm:mr-3 text-[var(--accent-500)] flex-shrink-0" />
                <span className="break-words">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Insights */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4 sm:mb-6 px-1">
            Recent AI Insights
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {recentInsights.map((insight, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] leading-tight">
                    {insight.title}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs self-start sm:self-auto flex-shrink-0"
                  >
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
                  {insight.summary}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {insight.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {insight.relatedPosts} related posts
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIInsights;
