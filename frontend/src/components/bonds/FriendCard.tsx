
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserMinus, MessageCircle } from "lucide-react";
import { User } from "@/contexts/auth/auth-types";

interface FriendCardProps {
  friend: User;
  onRemove: (id: string, name: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onRemove }) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to chat page - in a real app, this would open the conversation with this specific friend
    navigate('/chat');
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
            <AvatarImage src={typeof friend.avatar === 'string' ? friend.avatar : ''} alt={friend.name} />
            <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
              {friend.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] truncate text-sm sm:text-base">
              {friend.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-600)] dark:text-[var(--text-400)] truncate">
              @{friend.username}
            </p>
            <p className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)] truncate mt-1">
              Active 2 hours ago
            </p>            <div className="flex flex-wrap items-center mt-2 gap-1 sm:gap-2">
              {friend.bio && (
                <Badge variant="secondary" className="text-xs">
                  Has bio
                </Badge>
              )}
              {friend.location && (
                <Badge variant="outline" className="text-xs">
                  {friend.location}
                </Badge>
              )}
            </div>
            
            {/* Mobile: Full-width buttons below info */}
            <div className="mt-3 sm:hidden space-y-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleMessage}
                className="w-full h-10 bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(friend.id.toString(), friend.name)}
                className="w-full h-10"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove Friend
              </Button>
            </div>
          </div>
          
          {/* Desktop: Buttons on the right */}
          <div className="hidden sm:flex flex-col space-y-2 flex-shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={handleMessage}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(friend.id.toString(), friend.name)}
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
