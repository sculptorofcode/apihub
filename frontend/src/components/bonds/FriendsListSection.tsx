
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendCard from "./FriendCard";
import { Users } from "lucide-react";
import { User } from "@/contexts/auth/auth-types";

interface FriendsListSectionProps {
  friends: User[];
  filteredFriends: User[];
  onRemove: (id: string, name: string) => void;
  searchQuery: string;
  isLoading?: boolean;
}

const FriendsListSection: React.FC<FriendsListSectionProps> = ({
  friends,
  filteredFriends,
  onRemove,
  searchQuery,
}) => (
  <section className="mb-6 sm:mb-8">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
        Your Friends
      </h2>
      <Badge variant="secondary" className="text-xs sm:text-sm">
        {friends.length} friend{friends.length !== 1 ? 's' : ''}
      </Badge>
    </div>
    {filteredFriends.length > 0 ? (
      <ScrollArea className="max-h-[400px] sm:max-h-[500px] pr-2 sm:pr-4">
        <div className="space-y-2 sm:space-y-3">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onRemove={onRemove}
            />
          ))}
        </div>
      </ScrollArea>
    ) : (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-[var(--text-400)]" />
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
            {searchQuery ? 'No matching friends' : 'No friends yet'}
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-600)] dark:text-[var(--text-400)]">
            {searchQuery ? 'Try a different search term.' : 'Start connecting with people to build your network!'}
          </p>
        </CardContent>
      </Card>
    )}
  </section>
);

export default FriendsListSection;
