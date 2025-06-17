import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileBanner from "./ProfileBanner";
import ProfileDetails from "./ProfileDetails";
import { useAuth } from "../../contexts/auth/useAuth";
import { Badge } from "../ui/badge";
import { Edit, Sparkles } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { User } from "@/contexts/auth/auth-types";
import FriendshipService from "../../services/FriendshipService";
import ErrorService from "../../services/ErrorService";

interface ProfileCardProps {
  profile: User;
  onProfileUpdate?: (updatedFields: Partial<User>) => Promise<boolean | void>;
  onFriendRequestSent?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onProfileUpdate, onFriendRequestSent }) => {
  const { user, token } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [localRequestSent, setLocalRequestSent] = useState(false);
  // Handle sending friend request
  const handleSendFriendRequest = async () => {
    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send friend requests",
        variant: "destructive"
      });
      return;
    }

    setIsSendingRequest(true);

    try {
      const success = await FriendshipService.sendFriendRequest(profile.id);

      if (success) {
        toast({
          title: "Request sent",
          description: `Friend request sent to ${profile.name}`,
        });
        setLocalRequestSent(true);
        if (onFriendRequestSent) {
          onFriendRequestSent();
        }
      } else {
        throw new Error('Failed to send friend request');
      }
    } catch (error) {
      const errorMessage = ErrorService.getErrorMessage(error, "Failed to send friend request");
      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Calculate profile completion percentage (for own profile)
  const calculateProfileCompletion = () => {
    if (!isOwnProfile) return null;
    const fields = [
      profile.avatar,
      profile.banner,
      profile.bio,
      profile.location,
      profile.website,
      profile.phone
    ];

    const filledFields = fields.filter(field => field !== null && field !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };
  const profileCompletion = calculateProfileCompletion();

  // Handle banner image change
  const handleBannerChange = async (file: File) => {
    if (!onProfileUpdate) {
      toast({
        title: "Update not available",
        description: "Profile update functionality is not available right now.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Pass the file directly to the profile update function
      // The parent component will handle the file upload
      await onProfileUpdate({
        banner: file
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error; // Re-throw to let the banner component handle the error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative overflow-visible">
      {/* Banner with overlay */}
      <div className="rounded-t-none rounded-b-3xl overflow-hidden">
        <ProfileBanner
          bannerUrl={profile.banner}
          isOwnProfile={isOwnProfile}
          onBannerChange={handleBannerChange}
        />
      </div>

      {/* Card body with glass effect */}
      <div className="relative bg-white/80 dark:bg-[var(--background-800)]/90 backdrop-blur-sm border border-[var(--border)] rounded-3xl rounded-tl-none mt-[-2rem] mx-4 p-6 shadow-md">
        {/* Avatar - positioned for overlap with banner */}
        <div className="absolute left-8 top-[-3rem] ring-8 ring-white dark:ring-[var(--background-800)] rounded-full">
          <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white dark:border-[var(--background-800)] shadow-xl">
            {profile.avatar ? (
              <AvatarImage
                src={typeof profile.avatar === 'string' ? profile.avatar : URL.createObjectURL(profile.avatar as File)}
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] text-white text-xl md:text-2xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Active indicator */}
          {profile.last_active_at && new Date(profile.last_active_at).getTime() > Date.now() - 1000 * 60 * 15 && (
            <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-[var(--background-800)]"></div>
          )}
        </div>

        {/* Pro badge - display for premium accounts */}
        <div className="absolute right-6 top-[-1rem] flex gap-2">
          {isOwnProfile ? (
            <>
              <Badge variant="outline" className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border-amber-300 flex gap-1 items-center px-3 py-1.5 text-sm font-medium shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pro Member</span>
              </Badge>
              <Link to="/edit-profile">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Edit className="h-4 w-4" />}
                >
                  Edit Profile
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex gap-3">
              {/* Show different badges/buttons based on friendship status */}
              {profile.isFriend ? (
                <Badge variant="outline" className="flex gap-1.5 items-center px-3 py-1.5 text-sm font-medium bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Friends</span>
                </Badge>) : profile.isRequestSent || localRequestSent ? (
                  <Badge variant="outline" className="flex gap-1.5 items-center px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Request Sent</span>
                  </Badge>
                ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="px-6 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                        onClick={handleSendFriendRequest}
                        disabled={isSendingRequest}
                      >
                        {isSendingRequest ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : "Add Friend"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send a friend request to connect</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}              {/* Message button with tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-4"
                    >
                      Message
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start a conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Profile Details */}
        <ProfileDetails profile={profile} />

        {/* Profile completion meter (only for own profile) */}
        {isOwnProfile && profileCompletion !== null && (
          <div className="mt-6 px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                Profile completion
              </span>
              <span className="text-sm font-medium text-[var(--primary-600)]">
                {profileCompletion}%
              </span>
            </div>
            <div className="h-2 w-full bg-[var(--background-200)] dark:bg-[var(--background-700)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] rounded-full"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            {profileCompletion < 100 && (
              <div className="mt-1 text-xs text-[var(--text-500)]">
                Complete your profile to increase visibility
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
