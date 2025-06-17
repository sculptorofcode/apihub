
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendRequestCard from "./FriendRequestCard";
import { UserPlus } from "lucide-react";
import { User } from "@/contexts/auth/auth-types";

interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  requestedAt: string;
}
interface FriendRequestsSectionProps {
  friendRequests: FriendRequest[];
  filteredRequests: FriendRequest[];
  onAccept: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
  searchQuery: string;
  isLoading?: boolean;
}

const FriendRequestsSection: React.FC<FriendRequestsSectionProps> = ({
  friendRequests,
  filteredRequests,
  onAccept,
  onReject,
  searchQuery,
}) => (
  <section className="mb-6 sm:mb-8">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
        New Friend Requests
      </h2>
      {friendRequests.length > 0 && (
        <Badge className="bg-[var(--accent-500)] text-white text-xs sm:text-sm">
          {friendRequests.length}
        </Badge>
      )}
    </div>
    {filteredRequests.length > 0 ? (
      <ScrollArea className="max-h-[280px] sm:max-h-[300px] pr-2 sm:pr-4">
        <div className="space-y-2 sm:space-y-3">
          {filteredRequests.map((request) => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </div>
      </ScrollArea>
    ) : (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <UserPlus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-[var(--text-400)]" />
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
            {searchQuery ? 'No matching requests' : 'No new friend requests'}
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-600)] dark:text-[var(--text-400)]">
            {searchQuery ? 'Try a different search term.' : 'New friend requests will appear here.'}
          </p>
        </CardContent>
      </Card>
    )}
  </section>
);

export default FriendRequestsSection;
