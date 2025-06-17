import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";

// Custom gradient banner options
const BANNER_GRADIENTS = [
  "bg-gradient-to-r from-blue-400 to-purple-500",
  "bg-gradient-to-r from-green-400 to-teal-500",
  "bg-gradient-to-r from-purple-500 to-indigo-600",
  "bg-gradient-to-r from-pink-400 to-orange-500",
  "bg-gradient-to-r from-indigo-400 to-cyan-400",
];

// Default banner image to use if none is provided
const DEFAULT_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1682686581854-5ebd29f2bd75?q=80&w=1400&h=500&fit=crop";

interface ProfileBannerProps {
  bannerUrl?: string | null | File; // Banner image if available
  isOwnProfile?: boolean; // Whether the current user is viewing their own profile
  onBannerChange?: (file: File) => Promise<void | boolean>; // Callback when banner is changed
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ 
  bannerUrl, 
  isOwnProfile = false,
  onBannerChange 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
    // Use preview URL if available, otherwise use provided banner URL or default
  const bannerImage = previewUrl || (
    bannerUrl && typeof bannerUrl === 'string' ? bannerUrl : DEFAULT_BANNER_IMAGE
  );
  
  // Randomly select a gradient for the overlay effect
  const randomGradient = BANNER_GRADIENTS[Math.floor(Math.random() * BANNER_GRADIENTS.length)];

  const handleBannerClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    if (onBannerChange) {
      setIsUploading(true);
      try {
        await onBannerChange(file);
        toast({
          title: "Banner updated",
          description: "Your profile banner has been updated successfully",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your banner. Please try again.",
          variant: "destructive"
        });
        // Revert preview on error
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`relative h-40 sm:h-48 md:h-64 lg:h-72 overflow-hidden ${isOwnProfile ? 'cursor-pointer' : ''}`} 
      onClick={handleBannerClick}
    >
      {/* Hidden file input */}
      {isOwnProfile && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      )}
      
      {/* Actual banner image */}
      <img
        src={bannerImage}
        alt="Profile banner"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLElement;
          target.style.display = 'none';
        }}
      />
      
      {/* Overlay gradient for visual enhancement */}
      <div className={`absolute inset-0 opacity-40 ${randomGradient}`} />
      
      {/* Additional overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/30" />
      
      {/* Decorative pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Edit button - Show when this is the user's profile */}
      {isOwnProfile && (
        <div className="absolute right-4 top-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-white/20 backdrop-blur-sm"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Change Banner
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileBanner;
