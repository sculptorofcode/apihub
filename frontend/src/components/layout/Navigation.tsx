
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import {
  Home,
  Compass,
  Brain,
  Heart,
  Plus
} from 'lucide-react';

interface NavigationProps {
  friendRequestsCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ friendRequestsCount }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--primary-600)] hover:text-white focus:bg-[var(--primary-600)] focus:text-white focus:outline-none ${isActive('/') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)]'
                  }`}
              >
                <Home className="mr-2 h-4 w-4" />
                Feed
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/explore"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--primary-600)] hover:text-white focus:bg-[var(--primary-600)] focus:text-white focus:outline-none ${isActive('/explore') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)]'
                  }`}
              >
                <Compass className="mr-2 h-4 w-4" />
                Explore
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/ai-insights"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--primary-600)] hover:text-white focus:bg-[var(--primary-600)] focus:text-white focus:outline-none ${isActive('/ai-insights') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)]'
                  }`}
              >
                <Brain className="mr-2 h-4 w-4" />
                AI Insights
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/bonds"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--primary-600)] hover:text-white focus:bg-[var(--primary-600)] focus:text-white focus:outline-none relative ${isActive('/bonds') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)]'
                  }`}
              >
                <Heart className={`mr-2 h-4 w-4 text-white transition-colors duration-300 ${isActive('/bonds') ? `fill-current` : ``}`} />
                Bonds
                {friendRequestsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-[var(--accent-500)] hover:bg-[var(--accent-500)] flex items-center justify-center">
                    {friendRequestsCount > 99 ? '99+' : friendRequestsCount}
                  </Badge>
                )}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="md:hidden px-2 py-2">
        <div className="flex items-center justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${isActive('/') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)] hover:bg-[var(--primary-600)]'
              }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            to="/bonds"
            className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors relative ${isActive('/bonds') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)] hover:bg-[var(--primary-600)]'
              }`}
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Bonds</span>
            {friendRequestsCount > 0 && (
              <div className="absolute -top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {friendRequestsCount > 9 ? '9+' : friendRequestsCount}
                </span>
              </div>
            )}
          </Link>

          <Link
            to="/create"
            className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors text-[var(--text-50)] hover:bg-[var(--primary-600)]"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Post</span>
          </Link>

          <Link
            to="/explore"
            className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${isActive('/explore') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)] hover:bg-[var(--primary-600)]'
              }`}
          >
            <Compass className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Explore</span>
          </Link>

          <Link
            to="/ai-insights"
            className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${isActive('/ai-insights') ? 'bg-[var(--primary-600)] text-white' : 'text-[var(--text-50)] hover:bg-[var(--primary-600)]'
              }`}
          >
            <Brain className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">AI</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
