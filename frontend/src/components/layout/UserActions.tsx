import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  MessageCircle,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/auth/useAuth';

interface UserActionsProps {
  unreadMessagesCount: number;
}

const UserActions: React.FC<UserActionsProps> = ({ unreadMessagesCount }) => {
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
    console.log('Logout clicked');
  };

  const handleNotificationDropdownOpen = () => {
    // Hide the red dot when notifications are opened
    setHasNewNotifications(false);
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: "John liked your idea about AI-powered healthcare", time: "2 min ago" },
    { id: 2, text: "Sarah commented on your post", time: "15 min ago" },
    { id: 3, text: "New friend request from Mike", time: "1 hour ago" },
    { id: 4, text: "Your idea was featured in trending", time: "2 hours ago" },
  ];

  // If user is not logged in, show login button
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center">
        <Link to="/auth/login">
          <Button 
            className="bg-white text-[var(--primary-600)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-700)] flex items-center gap-2"
            size="sm"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </Link>
        <Link to="/auth/register">
          <Button 
            className="bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)] flex items-center gap-2 ml-2"
            size="sm"
          >
            <User className="h-4 w-4" />
            Register
          </Button>
        </Link>
      </div>
    );
  }

  // Render the normal user actions for logged in users
  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      {/* Notifications Dropdown */}
      <DropdownMenu onOpenChange={(open) => open && handleNotificationDropdownOpen()}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white hover:bg-[var(--primary-600)] min-w-[44px] min-h-[44px] p-2"
          >
            <Bell className="h-5 w-5 md:h-4 md:w-4" />
            {hasNewNotifications && (
              <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[var(--background-900)] shadow-lg border border-[var(--border)] rounded-lg z-50"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-semibold text-base">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer min-h-[44px]">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-[var(--text-900)] dark:text-[var(--text-50)] line-clamp-2">
                    {notification.text}
                  </p>
                  <p className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">
                    {notification.time}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-3 cursor-pointer min-h-[44px]">
            <Link to="/notifications" className="w-full text-center text-[var(--primary-500)] font-medium">
              View All Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 md:h-8 md:w-8 rounded-full min-w-[44px] min-h-[44px] p-1">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar ? (typeof user.avatar === 'string' ? user.avatar : URL.createObjectURL(user.avatar as Blob)) : ''}
                alt={user?.name || 'Guest'}
              />
              <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-white dark:bg-[var(--background-900)] shadow-lg border border-[var(--border)] rounded-lg z-50"
          align="end"
          forceMount
        >
          <DropdownMenuItem asChild className="min-h-[44px] cursor-pointer">
            <Link to={`/profile/${user?.username}`} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="min-h-[44px] cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActions;
