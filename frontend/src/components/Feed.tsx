
import React from 'react';
import FeedSidebar from './feed/FeedSidebar';
import MainFeed from './feed/MainFeed';
import TrendingSidebar from './feed/TrendingSidebar';
import { useAuth } from '@/contexts/auth/useAuth';

const Feed: React.FC = () => {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--background)] px-2 md:px-4 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Left Sidebar - Profile & Shortcuts - Hidden on mobile */}
          <div className="lg:col-span-1 hidden lg:block">
            <FeedSidebar currentUser={currentUser} isLoading={isLoading} isAuthenticated={isAuthenticated}/>
          </div>

          {/* Center Feed - Full width on mobile, 2 cols on lg */}
          <div className="lg:col-span-2">
            <MainFeed />
          </div>

          {/* Right Sidebar - Trending - Hidden on mobile and md */}
          <div className="lg:col-span-1 hidden lg:block">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
