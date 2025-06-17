
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Hash, Star } from 'lucide-react';

const Explore = () => {
  const trendingTags = [
    { name: 'AI', posts: 1234, growth: '+15%' },
    { name: 'Sustainability', posts: 892, growth: '+23%' },
    { name: 'FinTech', posts: 567, growth: '+8%' },
    { name: 'HealthTech', posts: 445, growth: '+31%' },
    { name: 'Web3', posts: 389, growth: '+12%' },
    { name: 'EdTech', posts: 234, growth: '+45%' },
  ];

  const featuredCategories = [
    {
      name: 'Technology',
      description: 'Latest innovations in tech',
      icon: '💻',
      posts: 2341,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      name: 'Healthcare',
      description: 'Revolutionary healthcare solutions',
      icon: '🏥',
      posts: 1567,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
      name: 'Environment',
      description: 'Sustainable and eco-friendly ideas',
      icon: '🌱',
      posts: 987,
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    },
    {
      name: 'Education',
      description: 'Transforming learning experiences',
      icon: '📚',
      posts: 756,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      name: 'Social Impact',
      description: 'Ideas that change communities',
      icon: '🤝',
      posts: 623,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    },
    {
      name: 'Entertainment',
      description: 'Creative and fun innovations',
      icon: '🎭',
      posts: 445,
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
            Explore Ideas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover trending topics, explore categories, and find inspiration from the most innovative ideas in our community
          </p>
        </div>

        {/* Trending Tags Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-[var(--primary-500)] mr-3" />
            <h2 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
              Trending Tags
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingTags.map((tag, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-[var(--background-50)] dark:bg-[var(--background-800)]">
                <div className="flex items-center justify-between mb-2">
                  <Hash className="h-4 w-4 text-[var(--primary-500)]" />
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {tag.growth}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-1">
                  {tag.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tag.posts.toLocaleString()} posts
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Star className="h-6 w-6 text-[var(--accent-500)] mr-3" />
            <h2 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
              Featured Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-[var(--background-50)] dark:bg-[var(--background-800)]">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[var(--text-900)] dark:text-[var(--text-50)] mb-2 group-hover:text-[var(--primary-500)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={category.color}>
                        {category.posts.toLocaleString()} ideas
                      </Badge>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)]">
              <div className="text-3xl font-bold text-[var(--primary-500)] mb-2">
                12,540
              </div>
              <div className="text-muted-foreground">Total Ideas</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-[var(--secondary-50)] to-[var(--secondary-100)] dark:from-[var(--secondary-900)] dark:to-[var(--secondary-800)]">
              <div className="text-3xl font-bold text-[var(--secondary-500)] mb-2">
                3,847
              </div>
              <div className="text-muted-foreground">Active Creators</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-[var(--accent-50)] to-[var(--accent-100)] dark:from-[var(--accent-900)] dark:to-[var(--accent-800)]">
              <div className="text-3xl font-bold text-[var(--accent-500)] mb-2">
                156
              </div>
              <div className="text-muted-foreground">Categories</div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
