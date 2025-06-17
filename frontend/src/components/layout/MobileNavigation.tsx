
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Plus, Search, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileNavigationProps {
  friendRequestsCount?: number;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ friendRequestsCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      icon: Heart,
      label: 'Bonds',
      path: '/bonds',
      isActive: location.pathname === '/bonds',
      badge: friendRequestsCount > 0 ? friendRequestsCount : undefined,
    },
    {
      icon: Plus,
      label: 'Post',
      path: '/create',
      isActive: location.pathname === '/create',
    },
    {
      icon: Search,
      label: 'Explore',
      path: '/explore',
      isActive: location.pathname === '/explore',
    },
    {
      icon: Bot,
      label: 'AI',
      path: '/ai-insights',
      isActive: location.pathname === '/ai-insights',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--primary-500)] border-t border-[var(--primary-600)] md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 min-w-[60px] relative ${
                item.isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
