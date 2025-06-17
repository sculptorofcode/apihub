
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Post } from './types';

interface PostMediaProps {
  media: Post['media'];
}

const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!media) return null;

  if (media.type === 'image') {
    return (
      <img
        src={media.url}
        alt={media.alt || 'Post image'}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
    );
  }

  if (media.type === 'video') {
    return (
      <div className="relative">
        <video
          src={media.url}
          poster={media.thumbnail}
          className="w-full h-64 object-cover"
          controls={false}
          muted
          loop
          playsInline
          {...(isVideoPlaying ? { autoPlay: true } : {})}
        />
        <button
          onClick={e => {
            e.stopPropagation();
            setIsVideoPlaying(v => !v);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-200"
          aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
        >
          <div className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors duration-200">
            {isVideoPlaying ? (
              <Pause className="h-6 w-6 text-gray-800" />
            ) : (
              <Play className="h-6 w-6 text-gray-800 ml-1" />
            )}
          </div>
        </button>
      </div>
    );
  }

  return null;
};

export default PostMedia;
