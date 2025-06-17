
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import MobileNavigation from './layout/MobileNavigation';
import TopLoadingBar from './ui/TopLoadingBar';
import { FriendshipService } from '@/services';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [friendRequestsCount, setFriendRequestsCount] = React.useState<number>(0);

  // Mock unread messages count - in real app this would come from context/API
  const unreadMessagesCount = 3;
  useEffect(() => {
    const fetchFriendRequestsCount = async () => {
      try {
        const count = await FriendshipService.getFriendRequestsCount();
        setFriendRequestsCount(count);
      } catch (error) {
        console.error('Failed to fetch friend requests count:', error);
      }
    };

    fetchFriendRequestsCount();
  });

  const showFooter = location.pathname !== '/' && location.pathname !== '/chat';
  return (
    <div className="min-h-screen bg-[var(--background)] font-roboto">
      {/* Loading Bar for route transitions */}
      <TopLoadingBar />

      {/* Header */}
      <Header
        unreadMessagesCount={unreadMessagesCount}
        friendRequestsCount={friendRequestsCount}
      />

      {/* Main Content - Add padding top for mobile navigation */}
      <main className="flex-1 pt-0 md:pt-0 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation friendRequestsCount={friendRequestsCount} />

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
