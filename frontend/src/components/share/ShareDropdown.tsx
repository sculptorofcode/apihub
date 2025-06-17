
import React, { useState, useRef, useEffect } from 'react';
import { Share, Facebook, Linkedin, MessageCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareDropdownProps {
  postId: string;
  postTitle?: string;
  className?: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ 
  postId, 
  postTitle = '', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  // Generate the post URL
  const postUrl = `${window.location.origin}/post/${postId}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(postTitle);

  // Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };

  const handleShare = (platform: string) => {
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link copied to clipboard!",
        description: "You can now share this post anywhere.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link copied to clipboard!",
        description: "You can now share this post anywhere.",
      });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="flex items-center space-x-2 text-muted-foreground hover:text-[var(--primary-500)] transition-colors duration-200 min-h-[44px] px-2"
        aria-label="Share this post"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Share className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-48 bg-white border border-[var(--border)] rounded-lg shadow-lg py-2 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-[var(--border)]">
            Share this post
          </div>
          
          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-[var(--background-100)] transition-colors min-h-[44px]"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            <span>Share to Facebook</span>
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-[var(--background-100)] transition-colors min-h-[44px]"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            <span>Share to LinkedIn</span>
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-[var(--background-100)] transition-colors min-h-[44px]"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span>Share to WhatsApp</span>
          </button>

          <div className="border-t border-[var(--border)] my-1"></div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-[var(--background-100)] transition-colors min-h-[44px]"
            aria-label="Copy link to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
