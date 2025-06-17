    
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Image, FileText, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (data: { content: string }) => Promise<boolean>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const handlePost = async () => {
    if (!postContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onPostCreated) {
        // Pass the content to the parent's handler
        await onPostCreated({ content: postContent.trim() });
      }
      setPostContent('');
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

          {/* Media Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-[var(--border)]">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)]"
            >
              <Video className="h-5 w-5" />
              <span>Video</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)]"
            >
              <Image className="h-5 w-5" />
              <span>Photo</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--primary-500)]"
            >
              <FileText className="h-5 w-5" />
              <span>Document</span>
            </Button>
          </div>          {/* Post Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePost}
              disabled={!postContent.trim() || isSubmitting}
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
