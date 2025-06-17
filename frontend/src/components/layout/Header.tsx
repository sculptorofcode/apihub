import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import UserActions from './UserActions';

interface HeaderProps {
  unreadMessagesCount: number;
  friendRequestsCount: number;
}

const Header: React.FC<HeaderProps> = ({ unreadMessagesCount, friendRequestsCount }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  // Add effect to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if page has been scrolled more than 10px
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Call handler once on mount to set initial state
    handleScroll();
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-border bg-[var(--primary-500)] backdrop-blur supports-[backdrop-filter]:bg-[var(--primary-500)]/95 transition-all duration-200 ${
        hasScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container flex h-14 md:h-16 items-center justify-between px-2 md:px-4">
        {/* Logo - Smaller on mobile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/" className="flex items-center space-x-1 md:space-x-2">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-[var(--accent-500)]">
              <Brain className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="font-bold text-lg md:text-xl text-white font-orbitron">
              IdeaHub
            </span>
          </Link>

          {/* Main Navigation - Hidden on small mobile, shown on md+ */}
          <div className="hidden md:block">
            <Navigation friendRequestsCount={friendRequestsCount} />
          </div>
        </div>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden lg:block">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <UserActions unreadMessagesCount={unreadMessagesCount} />
      </div>

      {/* Mobile Navigation - Bottom on small screens */}
      <div className="md:hidden border-t border-white/20">
        <Navigation friendRequestsCount={friendRequestsCount} />
      </div>
    </header>
  );
};

export default Header;
