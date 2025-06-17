import React from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/profile/ProfileCard";
import AnalyticsCard from "../components/profile/AnalyticsCard";
import ActivityFeed from "../components/profile/ActivityFeed";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { User } from "@/contexts/auth/auth-types";
import { useUserProfile } from "../hooks/useUserProfile";
import { ProfileService, ErrorService } from "../services";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { isAuthenticated, token, user: currentUser } = useAuth();
  const { toast } = useToast();
  const { profile, loading: isLoading, error: profileError, refetch: refetchProfile } = useUserProfile(username || '');  // Handle profile updates, including banner
  const handleProfileUpdate = async (updatedFields: Partial<User>): Promise<boolean> => {
    // Check if this is the user's own profile
    const isOwnProfile = currentUser?.username === username;
    
    if (!token || !isOwnProfile) {
      toast({
        title: "Not authorized",
        description: "You can only update your own profile",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Determine if there are file uploads in the update
      const hasFileUpload = updatedFields.banner instanceof File ||
        (updatedFields.avatar && typeof updatedFields.avatar !== 'string');
      
      // Use the ProfileService to update the profile
      await ProfileService.updateProfile(updatedFields, hasFileUpload);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      // Refresh the profile data
      refetchProfile();
      return true;
    } catch (error) {
      // Use ErrorService to extract a meaningful error message
      const errorMessage = ErrorService.getErrorMessage(
        error,
        'Failed to update profile. Please try again.'
      );
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  // Redirect to login if not authenticated when accessing protected parts
  // Public profiles are visible to all, but editing requires authentication
  const isOwnProfile = currentUser?.username === username;
  if (!isAuthenticated && isOwnProfile) {
    return <Navigate to="/auth/login" replace />;
  }

  // Loading state with improved skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Card Skeleton */}
          <Skeleton className="w-full h-80 rounded-2xl mb-6" />

          {/* Two-column layout for analytics and activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="w-full h-64 rounded-xl md:col-span-1" />
            <Skeleton className="w-full h-[500px] rounded-xl md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }
  // Error state with improved visuals
  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-4 py-8">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto gap-6 p-10 bg-white dark:bg-[var(--background-800)] rounded-2xl shadow-sm border border-[var(--border)]">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-center">Profile not found</h1>
          <p className="text-gray-500 text-center">{profileError || "The requested profile could not be found."}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--background)] pt-0 pb-12">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Profile Card - Full width */}
        <div className="mb-8">
          <ProfileCard 
            profile={profile} 
            onProfileUpdate={isOwnProfile ? handleProfileUpdate : undefined}
            onFriendRequestSent={refetchProfile} 
          />
        </div>

        {/* Two-column layout for desktop */}
        <div className="px-4 grid grid-cols-1 gap-6">
          {/* Left column: Analytics and connections */}
          <AnalyticsCard />

          {/* Activity Feed */}
          <ActivityFeed profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
