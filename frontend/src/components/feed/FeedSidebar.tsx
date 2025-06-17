
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp, Bookmark, Users, Mail, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '@/contexts/auth/auth-types';

function FeedSidebar({ currentUser, isLoading, isAuthenticated }: {
  currentUser: User;
  isLoading: boolean;
  isAuthenticated: boolean;
}) {
  const shortcuts = [
    { name: 'Saved Items', icon: Bookmark, link: '/bookmarks', count: 12 },
    { name: 'Groups', icon: Users, link: '/groups', count: 5 },
    { name: 'Newsletters', icon: Mail, link: '/newsletters', count: 3 },
    { name: 'Events', icon: Calendar, link: '/events', count: 2 }
  ];

  if (isLoading || !isAuthenticated || !currentUser) {
    return (
      <div className="space-y-4">
        <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
          <CardContent className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-16 bg-gray-200 rounded-t-lg"></div>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <Button disabled className="w-full h-8 bg-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
        <CardContent className="p-0">
          {/* Cover Image */}
          <div className="h-16 bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-t-lg"></div>

          {/* Profile Info */}
          <div className="px-4 pb-4 -mt-8">
            <Avatar className="h-16 w-16 border-4 border-white dark:border-[var(--background-800)]">
              <AvatarImage
                src={typeof currentUser.avatar === 'string'
                  ? currentUser.avatar
                  : currentUser.avatar
                    ? URL.createObjectURL(currentUser.avatar)
                    : ''}
                alt={currentUser.name} />
              <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                JD
              </AvatarFallback>
            </Avatar>

            <div className="mt-2">
              <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
                {currentUser.name}
              </h3>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
              <p className="text-xs text-muted-foreground">{currentUser.location}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
            >
              <Link to="/profile/edit" className="flex items-center justify-center">
                <span>Edit Profile</span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Profile viewers</span>
              </div>
              <Badge variant="secondary">0</Badge>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Post impressions</span>
              </div>
              <Badge variant="secondary">0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shortcuts */}
      <Card className="bg-[var(--background-50)] dark:bg-[var(--background-800)] border-[var(--border)]">
        <CardContent className="p-4">
          <h4 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
            Quick Access
          </h4>

          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.name}
                to={shortcut.link}
                className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--background-100)] dark:hover:bg-[var(--background-700)] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <shortcut.icon className="h-4 w-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
                  <span className="text-sm text-[var(--text-900)] dark:text-[var(--text-50)]">
                    {shortcut.name}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {shortcut.count}
                </Badge>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-[var(--primary-500)] hover:text-[var(--primary-600)]"
          >
            <Link to="/settings" className="flex items-center justify-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedSidebar;
