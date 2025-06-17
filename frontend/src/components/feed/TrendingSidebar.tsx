
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, MoreHorizontal } from 'lucide-react';

const TrendingSidebar: React.FC = () => {
  // Mock trending data
  const trendingPosts = [
    {
      id: '1',
      title: 'AI Startup Raises $50M Series A',
      summary: 'Revolutionary AI platform for content creation secures major funding round.',
      timeAgo: '2h ago',
      readers: '12.3k readers'
    },
    {
      id: '2',
      title: 'Remote Work Trends in 2024',
      summary: 'Latest insights on hybrid work models and productivity metrics.',
      timeAgo: '4h ago',
      readers: '8.7k readers'
    },
    {
      id: '3',
      title: 'Sustainable Tech Innovation',
      summary: 'Green technology companies leading the charge in climate solutions.',
      timeAgo: '6h ago',
      readers: '6.2k readers'
    },
    {
      id: '4',
      title: 'Cryptocurrency Market Update',
      summary: 'Bitcoin and Ethereum show strong recovery signals this week.',
      timeAgo: '8h ago',
      readers: '15.1k readers'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Trending News */}
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-[var(--primary-500)]" />
            <span className="text-[var(--text-900)] dark:text-[var(--text-50)]">IdeaHub News</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Top stories</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {trendingPosts.map((post, index) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--secondary-300)] flex items-center justify-center">
                    <span className="text-xs font-semibold text-[var(--text-900)]">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)] group-hover:text-[var(--primary-500)] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {post.summary}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.timeAgo}</span>
                      <span>•</span>
                      <span>{post.readers}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                {index < trendingPosts.length - 1 && (
                  <div className="border-b border-[var(--border)] mt-4"></div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 text-[var(--primary-500)] hover:text-[var(--primary-600)]"
          >
            Show more
          </Button>
        </CardContent>
      </Card>
      
      {/* Promoted Content */}
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
        <CardContent className="p-4">
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-[var(--primary-400)] to-[var(--secondary-400)] rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-semibold">Promoted</span>
            </div>
            
            <h4 className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
              Explore jobs at Google that match your skills
            </h4>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">Google</p>
                <p className="text-xs text-muted-foreground">Computer Software</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSidebar;
