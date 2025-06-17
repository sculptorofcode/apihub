
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, Video, MoreVertical, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface ChatHeaderProps {
  partner: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partner }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${partner.username}`);
  };

  const handleBlock = () => {
    console.log(`Blocking user: ${partner.username}`);
    // TODO: Implement block functionality
  };

  const handleBlockAndReport = () => {
    console.log(`Blocking and reporting user: ${partner.username}`);
    // TODO: Implement block and report functionality
  };

  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleProfileClick}
          >
            <AvatarImage src={partner.profilePicture} alt={partner.fullName} />
            <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
              {partner.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 
              className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              {partner.fullName}
            </h3>
            <p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
              @{partner.username}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[var(--background-800)] border shadow-lg z-50">
              <DropdownMenuItem 
                onClick={handleBlock}
                className="cursor-pointer hover:bg-[var(--background-100)] dark:hover:bg-[var(--background-700)] text-[var(--text-900)] dark:text-[var(--text-50)]"
              >
                <Shield className="h-4 w-4 mr-2" />
                Block
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleBlockAndReport}
                className="cursor-pointer hover:bg-[var(--background-100)] dark:hover:bg-[var(--background-700)] text-red-600 dark:text-red-400"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Block & Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
