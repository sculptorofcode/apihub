
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ConversationItemProps {
  conversation: Conversation;
  partner: User | null;
  isGroup: boolean;
  groupName?: string;
  isSelected: boolean;
  onClick: () => void;
  formatTime: (dateString: string) => string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  partner,
  isGroup,
  groupName,
  isSelected,
  onClick,
  formatTime,
}) => {
  if (!partner && !isGroup) return null;

  return (
    <div
      className={cn(
        "p-4 cursor-pointer hover:bg-[var(--background-100)] dark:hover:bg-[var(--background-800)] transition-colors",
        isSelected && "bg-[var(--primary-100)] dark:bg-[var(--primary-900)]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            {isGroup ? (
              <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                <Users className="h-5 w-5" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={partner?.profilePicture} alt={partner?.fullName} />
                <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                  {partner?.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          {conversation.unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-[var(--accent-500)] hover:bg-[var(--accent-500)] flex items-center justify-center min-w-[20px] border-2 border-white dark:border-gray-800">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)] truncate">
              {isGroup ? groupName : partner?.fullName}
            </h3>
            <span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">
              {formatTime(conversation.lastMessageAt)}
            </span>
          </div>
          <p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] truncate">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
