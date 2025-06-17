import React from "react";
import { ExternalLink, Calendar, MapPin, Clock, Award } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { User } from "@/contexts/auth/auth-types";
import { useAuth } from "../../contexts/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UserAvatar from "./UserAvatar";

interface ProfileDetailsProps {
  profile: User;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile }) => {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  // Format last active time
  const getLastActive = () => {
    if (!profile.last_active_at) return "Never active";
    return `Last active ${formatDistanceToNow(new Date(profile.last_active_at), { addSuffix: true })}`;
  };

  // Format account creation date
  const getMemberSince = () => {
    return format(new Date(profile.created_at), "MMMM yyyy");
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="pt-16 md:pt-20 pb-4">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-grow max-w-full">
          {/* Name and Username with modern styling */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-900)] to-[var(--text-700)] dark:from-[var(--text-50)] dark:to-[var(--text-300)]">
              {profile.name}
            </h1>
            <span className="text-base md:text-lg text-[var(--text-500)] dark:text-[var(--text-400)]">
              @{profile.username}
            </span>
          </div>

          {/* Bio/Tagline with improved typography */}
          {profile.bio && (
            <div className="mb-5">
              <p className="text-base leading-relaxed text-[var(--text-700)] dark:text-[var(--text-300)] italic">
                "{profile.bio}"
              </p>
            </div>
          )}

          {/* Details with icons in a flexible grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-x-8 gap-y-2 mb-5">
            {/* Member since */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
              <Calendar className="h-4 w-4 flex-shrink-0 text-[var(--primary-500)]" />
              <span>Member since {getMemberSince()}</span>
            </div>

            {/* Last active */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
              <Clock className="h-4 w-4 flex-shrink-0 text-[var(--primary-500)]" />
              <span>{getLastActive()}</span>
            </div>

            {/* Location if available */}
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                <MapPin className="h-4 w-4 flex-shrink-0 text-[var(--primary-500)]" />
                <span>{profile.location}</span>
              </div>
            )}
            {/* Website if available */}
            {profile.website && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--primary-500)]" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline truncate max-w-[200px]"
                >
                  {profile.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            )}

            {/* Expertise badge - visually interesting element */}
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 flex-shrink-0 text-amber-500" />
              <span className="text-[var(--text-600)] dark:text-[var(--text-400)]">
                API Expert
              </span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex gap-4 min-w-[120px]">
          {/* Connection counter with visual enhancement */}
          {!isOwnProfile && profile.friendsCount > 0 && (
            <div className="bg-[var(--card-bg-subtle)] dark:bg-[var(--card-bg-subtle-dark)] p-3 rounded-lg text-center">
              <div className="text-xs font-medium text-[var(--text-600)] dark:text-[var(--text-400)] mb-2">
                Friends
              </div>
              {profile.friends && profile.friends.length > 0 && (
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  <TooltipProvider delayDuration={200}>
                    {profile.friends.slice(0, 6).map((friend) => (
                      <UserAvatar key={`friend_${friend.id}`} user={friend} currentUser={user}/>
                    ))}
                  </TooltipProvider>

                  {profile.mutualFriendsCount > 6 && (
                    <div className="mt-1.5 w-full text-xs text-[var(--primary-600)] dark:text-[var(--primary-400)] font-medium">
                      +{profile.mutualFriendsCount - 6} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mutual friends section - moved to right side */}
          {!isOwnProfile && profile.mutualFriendsCount > 0 && (
            <div className="bg-[var(--card-bg-subtle)] dark:bg-[var(--card-bg-subtle-dark)] p-3 rounded-lg text-center">
              <div className="text-xs font-medium text-[var(--text-600)] dark:text-[var(--text-400)] mb-2">
                Mutual Friends
              </div>
              {profile.mutualFriends && profile.mutualFriends.length > 0 && (
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  <TooltipProvider delayDuration={200}>
                    {profile.mutualFriends.slice(0, 6).map((friend) => (
                      <UserAvatar key={`mutual_${friend.id}`} user={friend} currentUser={user}/>
                    ))}
                  </TooltipProvider>

                  {profile.mutualFriendsCount > 6 && (
                    <div className="mt-1.5 w-full text-xs text-[var(--primary-600)] dark:text-[var(--primary-400)] font-medium">
                      +{profile.mutualFriendsCount - 6} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
