import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { User } from "@/contexts/auth/auth-types";

interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  requestedAt: string;
}

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
}) => (
  <Card className="hover:shadow-md transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
          <AvatarImage
            src={
              typeof request.user.avatar === "string"
                ? request.user.avatar
                : undefined
            }
            alt={request.user.name}
          />
          <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
            {request.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] truncate text-sm sm:text-base">
            {request.user.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-600)] dark:text-[var(--text-400)] truncate">
            @{request.user.username}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center mt-1 space-y-1 sm:space-y-0 sm:space-x-2">
            {request.mutualFriends > 0 && (
              <Badge variant="secondary" className="text-xs w-fit">
                {request.mutualFriends} mutual friend
                {request.mutualFriends > 1 ? "s" : ""}
              </Badge>
            )}
            <span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">
              {request.requestedAt}
            </span>
          </div>

          {/* Mobile: Stack buttons below info */}
          <div className="flex space-x-2 mt-3 sm:hidden">
            <Button
              size="sm"
              onClick={() => onAccept(request.id, request.user.name)}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white flex-1 h-10"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(request.id, request.user.name)}
              className="flex-1 h-10"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>

        {/* Desktop: Buttons on the right */}
        <div className="hidden sm:flex space-x-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={() => onAccept(request.id, request.user.name)}
            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(request.id, request.user.name)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default FriendRequestCard;
