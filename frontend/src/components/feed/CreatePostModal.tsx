import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { API_BASE_URL } from '../../config';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Image, FileText, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (data: { content: string, media?: File | null }) => Promise<boolean>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (locationEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('');
        }
      );
    }
  }, [locationEnabled]);
  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) return;
    
    setIsSubmitting(true);
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('content', postContent.trim());
      formData.append('visibility', 'public');
      
      if (locationEnabled && location) {
        formData.append('location', location);
      }
      
      // Append media file if selected
      if (selectedFile) {
        formData.append('media', selectedFile);
      }
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      
      // Send request to create post
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const data = await response.json();
      console.log('Post created:', data);
      
      // Reset form
      setPostContent('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setLocationEnabled(false);
      setLocation('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Avatar click handler
  const handleAvatarClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (user?.username) {
      navigate(`/profile/${encodeURIComponent(user.username)}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-[var(--background-50)] dark:bg-[var(--background-800)]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
              Create a post
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Create a new post to share with your network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAvatarClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAvatarClick(e); }}
              aria-label="Go to your profile"
              tabIndex={0}
              type="button"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-full"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={typeof user?.avatar === 'string' ? user?.avatar : undefined} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
            <div>
              <p className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
                {user?.name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground">Post to anyone</p>
            </div>
          </div>

          {/* Post Content */}
          <Textarea
            placeholder="What do you want to talk about?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[120px] resize-none border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            autoFocus
          />

          {previewUrl && (
            <div className="relative mt-4">
              <button
                onClick={handleRemoveMedia}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                aria-label="Remove media"
              >
                <X className="h-4 w-4" />
              </button>
              {selectedFile?.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="rounded-lg max-h-80 w-full object-contain" />
              ) : (
                <video src={previewUrl} controls className="rounded-lg max-h-80 w-full" />
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*"
          />
          {/* Media Buttons */}          <div className="flex items-center space-x-4 pt-4 border-t border-[var(--border)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)]"
            >
              <Video className="h-5 w-5" />
              <span>Video</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)]"
            >
              <Image className="h-5 w-5" />
              <span>Photo</span>
            </Button>
            
            {/* Location Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocationEnabled(!locationEnabled)}
              className={`flex items-center space-x-2 ${
                locationEnabled ? 'text-[var(--primary-500)]' : 'text-[var(--text-600)] dark:text-[var(--text-400)]'
              } hover:text-[var(--primary-500)]`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Location</span>
              {locationEnabled && location && (
                <span className="text-xs ml-1">(Active)</span>
              )}
            </Button>
          </div>          {/* Post Button */}
          <div className="flex justify-end pt-4">            <Button
              onClick={handlePost}
              disabled={(!postContent.trim() && !selectedFile) || isSubmitting}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
